<template>
	<view>
		<nav-bar backState="2000" title="自助服务"></nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<button type="default" @tap="onJudgeLogin">登录</button>
		<public-module></public-module>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	onLoad(e) {
		
	},
	onShow() {
		
	},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		onJudgeLogin() {
			this.judgeLogin(() => {
				uni.showToast({
					title:"用户已登录，接下来可以处理用户的功能了",
					icon:"none"
				});
			}, "force"); // judge:（默认值） 如果未登录询问是否登录  force：未登录直接强制登录
		}
	},
	//页面下来刷新
	onPullDownRefresh() {},
	//页面上拉触底
	onReachBottom() {},
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
