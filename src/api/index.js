import request from "@/utils/request.js";

import { AMPA_WEB_KEY } from "@/config/config.js";

// 输入提示
export const inputtips = (keywords) => {
	return request({
		url: "/assistant/inputtips",
		method: "get",
		params: {
			key: AMPA_WEB_KEY,
			keywords,
		},
	});
};

// 路径规划
export const driving = (option) => {
	return request({
		url: "/direction/driving",
		method: "get",
		params: {
			key: AMPA_WEB_KEY,
			...option,
		},
	});
};
