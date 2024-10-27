

// 高德API_KEY   JSAPI
export const AMAP_KEY = "";

// 高德SAFE_KEY   JSAPI
export const AMAP_SAFE_KEY = "";

// 高德WEB_API
export const AMPA_WEB_API_URL = "https://restapi.amap.com/v3";

// 高德WEB_KEY
export const AMPA_WEB_KEY = "";

// 高德AMAP_THEME
export const AMAP_THEME = "";

// 高德地图版本
export const AMAP_VERSION = "2.0";

// 高德地图插件
export const AMAP_PLUGINS = [
	"AMap.HeatMap", //热力图
	" AMap.Polyline", //折线图
	"AMap.MoveAnimation", //动画
	"AMap.GraspRoad", //室内地图
	"Loca",
];

// 默认加载配置
export const AMAP_LOAD_CONFIG = {
	key: AMAP_KEY,
	version: AMAP_VERSION,
	plugins: AMAP_PLUGINS,
	Loca: {
		version: "2.0.0",
	},
};

// 默认主题配置
export const AMAP_DEFAULT_THEME = {
	//高德默认自带主题有normal .  macaron .  dark .  light .  fresh .  grey . blue .  darkblue . whitesmoke 和graffiti(涂鸦风格)
	mapStyle: "amap://styles/grey",

	zoom: 13,

	viewMode: "3D", //是否为3D地图模式

	// 倾斜角度
	pitch: 0,

	center: [117.291589, 31.847696],

	skyColor: "#2A2A2A",

	features: ['bg', 'road', 'building']//'point'

};