import axios from "axios";

const instance = axios.create({
	time: 5000,
	baseURL: "https://restapi.amap.com/v3",
});

// 添加请求拦截器
instance.interceptors.request.use(
	function (config) {
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default instance;
