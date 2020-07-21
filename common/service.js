/**
 * 引入核心文件
 */
import Request from '@/js_sdk/luch-request/luch-request/index.js'
/**
 * new Request对象
 */
const myhttp = new Request()
/**
 * 获取浏览器缓存token
 */
const getTokenStorage = () => {
	let token = ''
	try {
		token = uni.getStorageSync('token')
	} catch (e) {
		//TODO handle the exception
	}
	return token
}
/**
 * 设置全局配置
 */
myhttp.setConfig((config) => {
	//设置全局URL
	config.baseUrl = 'https://tool.gosql.cn/'
	//全局自定义配置,认证为需要认证
	config.custom = {
		auth: true,
	}
	config.token = getTokenStorage()
	return config
})
/**
 * 请求之前拦截器 
 */
myhttp.interceptor.request((config, cancel) => {
	if (config.custom.auth) {
		config.header.token = uni.getStorageSync('token')
		// config.header.token = ''
	}
	if(config.header.token == ''){
		// console.log('token为空触发跳转')
		uni.navigateTo({
			url: '/pages/user/login'
		})
	}
	if (config.custom.loading) {
		uni.showLoading()
	}
	return config
})

/**
 * 自定义验证器
 * 如果返回true 则进入响应拦截器的响应成功函数(resolve)
 * 如果返回false进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
myhttp.validateStatus = (statusCode) => {
	return statusCode === 200
}

/**
 * 请求之后拦截器 
 */
myhttp.interceptor.response((response) => {
	//服务端返回的code码成功为1,失败为0，则reject()
	if (response.data.code == 0) {
		return Promise.reject(response)
	}
	return response
}, (response) => {
	return response
})

export {
	myhttp
}
