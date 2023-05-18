import Request from "./axios";
import Loading from "@/component/Loading/index";

export default new Request({
	// baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 1000 * 60 * 2,
	headers: {
		"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		"device-flag": "PC"
	},
	// 实例级拦截器
	interceptors: {
		// 实例级请求拦截器
		requestInterceptor: config => {
			// 打开全局请求loading
			if (config.customs?.isLoading) {
				config.customs.loadingInstance = Loading.load(config.customs?.loadingText || "数据加载中...");
			}
			// 防止缓存，给get请求加上时间戳
			if (config.method === "get" || config.method === "GET") {
				config.params = { ...config.params, t: new Date().getTime() };
			}
			return config;
		},
		// 实例级响应拦截器
		responseInterceptor: response => {
			// 关闭打开全局请求loading
			if (response.config.customs?.isLoading) {
				response.config?.customs?.loadingInstance.close();
			}
			return response.data;
		},
		// 请求响应失败拦截器
		responseInterceptorCatch: error => {
			if (error.config.customs?.isLoading) {
				error.config?.customs?.loadingInstance.close();
			}
			return Promise.reject(error);
		}
	}
});
