import AMapLoader from "@amap/amap-jsapi-loader";
import { AMAP_LOAD_CONFIG, AMAP_DEFAULT_THEME } from "@/config/config.js";
import * as dat from "dat.gui";

let instance = null; // Store instance
let gui = new dat.GUI();

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
			this.map.on("complete", () => {
				this.addGuiButton(); // Add the new button here
			});

			this.map.on("zoomchange", () => {
				const zoom = this.map.getZoom();
			});
		});
	}

	/**
	 * @description Add a button to dat.GUI
	 */
	addGuiButton() {
		// Define an object with actions
		const actions = {
			draw: () => {
				

				// 地图上的鼠标样式设置为准心
				this.map.setDefaultCursor("crosshair");

				// 地图不可拖动
				this.map.setStatus({ dragEnable: false });

				this.drawMode = true;

				// 监听鼠标按下
				// this.map.on("touchstart", (e) => {
				// 	if(!this.drawMode) return
				// 	this.isPress = true;
				// 	// console.log("按下");
				// });

				// 监听鼠标按下
				window.addEventListener("mousedown", (e) => {
					if (!this.drawMode) return;
					this.isPress = true;
					console.log("按下");
				});

				// 监听鼠标抬起
				// this.map.on("touchend", (e) => {
				// 	this.isPress = false;
				// 	this.drawMode = false
				// 	console.log("抬起");
				// });

				// 监听鼠标抬起
				window.addEventListener("mouseup", (e) => {
					this.isPress = false;
					this.drawMode = false;
					console.log("抬起");

					window.removeEventListener("mousemove")

				});

				// 监听鼠标移动
				// this.map.on("touchmove", (e) => {
				// 	if (!this.isPress && !this.drawMode) return;

				// 	const position = [e.lnglat.lng, e.lnglat.lat];

				// 	// 数组长度为0则第一个点为起点marker
				// 	if (!this.path.length) {
				// 		this.path.push(position);
				// 		new this.AMap.Marker({ map: this.map, position: position });
				// 		return;
				// 	}

				// 	if (this.path.length == 1) {
				// 		this.path.push(position);
				// 		this.line = new this.AMap.Polyline({
				// 			map: this.map,
				// 			path: this.path,
				// 			strokeColor: "#FF33FF",
				// 			strokeWeight: 6,
				// 			strokeOpacity: 0.5,
				// 		});
				// 		return;
				// 	}

				// 	if (this.path.length > 1) {
				// 		this.path.push(position);
				// 		this.line.setPath(this.path);
				// 	}
				// });

				window.addEventListener("mousemove", (e) => {
					console.log(this.isPress , this.drawMode);
					
					if (!this.isPress && !this.drawMode) return;

					// 屏幕坐标转换为地图坐标
					const coods = this.map.containerToLngLat([e.clientX, e.clientY]);
					
					
					const position = [coods.lng, coods.lat];
					// console.log(position);

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
				});
			},
		};

		// Add a button to the dat.GUI panel
		gui.add(actions, "draw").name("点击开始画线");
	}
}
