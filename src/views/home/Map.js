import AMapLoader from "@amap/amap-jsapi-loader";
import { AMAP_LOAD_CONFIG, AMAP_DEFAULT_THEME } from "@/config/config.js";
import _ from "lodash";
import * as turf from "@turf/turf";
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx";
import { events } from "@/utils/events.js";
import { setFitView, getFitZoom, getFitCenter, isValidLatLng, panTo } from "@/utils/map-overwrite.js";
import { ElMessage } from "element-plus";

let instance = null; // Store instance

let graspRoad;

export class GaoDeMap {
	constructor(element) {
		// Singleton pattern
		if (instance) {
			return instance;
		} else {
			this.initMap(element);
		}

		// Store instance
		instance = this;

		this.element = element;

		this.drawMode = false;

		this.isPress = false;

		this.path = [];

		this.line = null;

		this.point = null;

		this.gpx = [];

		events.on("startDraw", () => this.startDraw());
		// events.on("endDraw", () => this.endDraw());
		events.on("drawLine", (path) => this.drawLine(path));
		events.on("StartCorrect", () => this.lineCorrection());
		events.on("viewLocation", (item) => this.viewLocation(item));
		events.on("export", (path) => this.exportGPX(path));
		events.on("clear", () => this.clear());
	}

	/**
	 * @param {*} element
	 * @description Initialize map
	 */
	async initMap(element) {
		await AMapLoader.load(AMAP_LOAD_CONFIG).then((AMap) => {
			this.AMap = AMap;
			this.map = new AMap.Map(element, AMAP_DEFAULT_THEME);

			this.loca = new Loca.Container({
				map: this.map,
			});

			// Map load complete
			this.map.on("complete", () => {});

			this.map.on("zoomchange", () => {
				const zoom = this.map.getZoom();
			});
		});
	}

	/**
	 * @description Add a button to dat.GUI
	 */
	startDraw() {
		// Define an object with actions

		this.drawMode = true;

		// 地图上的鼠标样式设置为准心
		this.map.setDefaultCursor("crosshair");

		// 地图不可拖动
		this.map.setStatus({ dragEnable: false });

		// 监听鼠标按下
		this.map.on("touchstart", (e) => {
			if (!this.drawMode) return;
			this.isPress = true;
			console.log("按下");

			events.emit("mapMovingStart");
		});

		// 监听鼠标抬起
		this.map.on("touchend", (e) => {
			this.isPress = false;
			this.drawMode = false;
			console.log("抬起");
			this.map.setStatus({ dragEnable: true });
			events.emit("mapMovingEnd");
		});

		// 监听鼠标移动，节流
		this.map.on(
			"touchmove",
			_.throttle((e) => {
				if (!this.isPress && !this.drawMode) return;

				const position = [e.lnglat.lng, e.lnglat.lat];

				// 数组长度为0则第一个点为起点marker
				if (!this.path.length) {
					this.path.push(position);
					new this.AMap.Marker({ map: this.map, position: position });
					return;
				}

				if (this.path.length == 1) {
					this.path.push(position);
					this.line = new this.AMap.Polyline({
						map: this.map,
						path: this.path,
						strokeColor: "#FF33FF",
						strokeWeight: 6,
						strokeOpacity: 0.5,
					});
					return;
				}

				if (this.path.length > 1) {
					this.path.push(position);
					this.line.setPath(this.path);
				}
			}, 30)
		);
	}

	endDraw() {
		this.drawMode = false;
		this.map.setStatus({ dragEnable: true });
		// events.emit("mapMovingEnd")
	}

	// 高德线路纠偏
	async lineCorrection() {
		let arr = this.path.map((item, index) => {
			// console.log(item);

			let angle = 0;
			// 2023-05-25 12:23的时间戳

			let tm = 1478031031;

			// 和下一个点的角度
			if (this.path[index + 1]) {
				const rowAngle = turf.bearing(turf.point(item), turf.point(this.path[index + 1]));

				// turf的角度是-180 和 180 度之间（顺时针正数） ， 需要转为 0 和 360 度之间（逆时针负数）
				const result = rowAngle < 0 ? (angle = 360 + rowAngle) : (angle = rowAngle);
				angle = result.toFixed(0);
			}

			return {
				x: item[0],
				y: item[1],
				sp: 10,
				ag: Number(angle),
				tm: !index ? tm : 1 + index,
			};
		});

		console.log(arr);

		this.line.setMap(null);

		for (var i = 0; i < arr.length; i += 1) {
			this.gpx.push([arr[i].x, arr[i].y]);
		}
		var oldLine = new this.AMap.Polyline({
			path: this.gpx,
			// 虚线
			strokeStyle: "dashed",
			strokeColor: "#0f0",
			strokeWeight: 6,
			strokeOpacity: 0.3,
		});
		this.map.add(oldLine);

		if (!graspRoad) {
			graspRoad = new this.AMap.GraspRoad();
		}

		graspRoad.driving(arr, (error, result) => {
			if (!error) {
				var path2 = [];
				var newPath = result.data.points;
				for (var i = 0; i < newPath.length; i += 1) {
					path2.push([newPath[i].x, newPath[i].y]);
				}
				console.log(path2);

				var newLine = new this.AMap.Polyline({
					path: path2,
					strokeWeight: 8,
					strokeOpacity: 0.8,
					strokeColor: "#00f",
					showDir: true,
				});
				this.map.add(newLine);
				setFitView(getFitCenter(path2), getFitZoom(this.map, path2), this.map, this.loca);
			}
		});
	}

	drawLine(path) {
		this.clear();
		this.path = path;
		new this.AMap.Polyline({
			path: path,
			strokeStyle: "dashed",
			strokeColor: "#0f0",
			strokeWeight: 6,
			strokeOpacity: 0.5,
			map: this.map,
		});

		const center = getFitCenter(path);
		const zoom = getFitZoom(this.map, path);
		setFitView(center, zoom, this.map, this.loca);

		// this.map.setFitView();
	}

	viewLocation({ name, position }) {
		position = position.split(",").map((item) => Number(item));

		console.log("123123", position);

		this.point && this.point.setMap(null);
		this.point = null;

		this.point = new this.AMap.Marker({
			map: this.map,
			position: position,
			content: `<div style="display: flex;justify-content: center;align-items: center;flex-direction:row;gap:10px">
			
				<div style="width: 10px;height: 10px;background-color: #ff0;border-radius: 50%;"></div>
				<div  style="white-space: nowrap;">${name}</div>
			</div>`,
		});
		// this.map.setFitView();

		panTo(position, this.map, this.loca, this.AMap);
	}

	clear() {
		this.line && this.line.setMap(null);
		this.line = null;

		this.path = [];

		this.map.setStatus({ dragEnable: true });

		this.isPress = false;

		this.drawMode = false;

		this.map.clearMap();
	}

	exportGPX(path) {
		// 转为GeoJSON
		const geoJSON = turf.lineString(path || this.gpx);

		const options = {
			metadata: {
				name: "导出为GPX",
				author: {
					name: "Zuo",
				},
			},
		};
		const gpxLine = GeoJsonToGpx(geoJSON, options);

		// convert document to string or post process it
		const gpxString = new XMLSerializer().serializeToString(gpxLine);

		// @see https://stackoverflow.com/questions/10654971/create-text-file-from-string-using-js-and-html5
		const link = document.createElement("a");
		link.download = "高德地图路线绘制.gpx";
		const blob = new Blob([gpxString], { type: "text/xml" });
		link.href = window.URL.createObjectURL(blob);
		link.click();
		ElMessage.success("导出PGX成功");
	}
}
