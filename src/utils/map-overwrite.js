import * as turf from "@turf/turf";

export function setFitView(center, zoom, map, loca) {
	const curZoom = map.getZoom();
	const curPitch = map.getPitch();
	const curRotation = map.getRotation();
	const curCenter = [map.getCenter().lng, map.getCenter().lat];

	const targZoom = zoom;
	const targPitch = 0;
	const targRotation = 0;
	const targCenter = center;

	const route = [
		{
			pitch: {
				value: targPitch,
				duration: 1000,
				control: [
					[0, curPitch],
					[1, targPitch],
				],
				timing: [0.23, 1.0, 0.32, 1.0],
			},
			zoom: {
				value: targZoom,
				duration: 2500,
				control: [
					[0, curZoom],
					[1, targZoom],
				],
				timing: [0.13, 0.31, 0.105, 1],
			},
			rotation: {
				value: targRotation,
				duration: 1000,
				control: [
					[0, curRotation],
					[1, targRotation],
				],
				timing: [0.13, 0.31, 0.105, 1],
			},
			center: {
				value: targCenter,
				duration: 1000,
				control: [curCenter, targCenter],
				timing: [0.13, 0.31, 0.105, 1],
			},
		},
	];

	// 如果用户有操作则停止动画
	map.on("mousewheel", () => {
		loca.animate.stop();
	});

	loca.viewControl.addAnimates(route, () => {});

	loca.animate.start();
}

export function getFitCenter(points) {
	let features = turf.featureCollection(points.map((point) => turf.point(point)));
	let center = turf.center(features);
	return [center.geometry.coordinates[0], center.geometry.coordinates[1]];
}

export function setFitCenter(points, map) {
	const center = getFitCenter(points);
}

export function panTo(center, map, loca) {
	const curZoom = map.getZoom();
	const curPitch = map.getPitch();
	const curRotation = map.getRotation();
	const curCenter = [map.getCenter().lng, map.getCenter().lat];

	const targZoom = 17;
	const targPitch = 45;
	const targRotation = 0;
	const targCenter = center;

	const route = [
		{
			pitch: {
				value: targPitch,
				duration: 2000,
				control: [
					[0, curPitch],
					[1, targPitch],
				],
				timing: [0.420, 0.145, 0.000, 1],
			},
			zoom: {
				value: targZoom,
				duration: 2500,
				control: [
					[0, curZoom],
					[1, targZoom],
				],
				timing: [0.315, 0.245, 0.405, 1.000],
			},
			rotation: {
				value: targRotation,
				duration: 2000,
				control: [
					[0, curRotation],
					[1, targRotation],
				],
				timing: [1.000, 0.085, 0.460, 1],
			},
			center: {
				value: targCenter,
				duration: 1500,
				control: [curCenter, targCenter],
				timing: [0.0, 0.52, 0.315, 1.0],
			},
		},
	];

	// 如果用户有操作则停止动画
	map.on("mousewheel", () => {
		loca.animate.stop();
	});
	loca.viewControl.addAnimates(route, () => {});
	loca.animate.start();
}

export function getFitZoom(map, points) {
	const mapWidth = map.getSize().width;
	const mapHeight = map.getSize().height;

	const WORLD_DIM = { height: 256, width: 256 };
	const ZOOM_MAX = 18;
	let features = turf.featureCollection(points.map((point) => turf.point(point)));
	const bounds = turf.bbox(features); // [minX, minY, maxX, maxY]

	function zoom(mapPx, worldPx, fraction) {
		return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
	}

	const latFraction = (bounds[3] - bounds[1]) / WORLD_DIM.height;
	const lngFraction = (bounds[2] - bounds[0]) / WORLD_DIM.width;

	const latZoom = zoom(mapHeight, WORLD_DIM.height, latFraction);
	const lngZoom = zoom(mapWidth, WORLD_DIM.width, lngFraction);

	return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

// 经纬是否有效
export function isValidLatLng(longitude, latitude) {
	// 检查纬度是否在 -90 到 90 之间
	const isValidLatitude = typeof latitude === "number" && latitude >= -90 && latitude <= 90;
	// 检查经度是否在 -180 到 180 之间
	const isValidLongitude = typeof longitude === "number" && longitude >= -180 && longitude <= 180;

	// 如果纬度和经度都是有效的，则返回 true
	return isValidLatitude && isValidLongitude;
}
