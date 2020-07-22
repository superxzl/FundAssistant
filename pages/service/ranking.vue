<template>
	<view class="page">
		<nav-bar title="单日排行" bgColor="#F5f5f5"></nav-bar>
		<view class="cell_list">
			<view class="cell_left txt">名称</view>
			<view class="cell_left txt">代码</view>
			<view class="cell_left txt">涨幅</view>
		</view>
		<view class="cell_list" v-for="(item,index) of rankingList" :key="index">
			<view class="cell_left txt">{{item.SHORTNAME}}</view>
			<view class="cell_left txt">{{item.FCODE}}</view>
			<view class="cell_left txt" :style="{'color':item.RZDF > 0 ? '#FE635F' : '#00AA90'}">{{item.RZDF}}%</view>
		</view>
	</view>
</template>

<script>
	import {
		myhttp
	} from '../../common/service.js' // 局部引入
	import zPrompt from '@/components/common/prompt';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			zPrompt
		},
		data() {
			return {
				popupOptions: {
					placeholder: ''
				},
				rankingList: []
			};
		},
		computed: {

		},
		//第一次加载
		onLoad(e) {

		},
		onShow() {
			let token = uni.getStorageSync('token')
			if (token == '') {
				uni.showToast({
					title: '请先登录',
					icon: "none"
				})
				uni.switchTab({
					url: "../user/login"
				})
			}
			myhttp
				.post('api/fund/runking', {}, {
					custom: {
						auth: true
					}
				})
				.then(res => {
					this.rankingList = res.data.data
				})
				.catch(err => {
					if (err.data.code == 401) {
						uni.setStorageSync('token', '');
					}
					uni.showToast({
						'title': err.data.msg
					})
				});
		},
		//方法
		methods: {

		},
		//页面隐藏
		onHide() {},
		//页面卸载
		onUnload() {},
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

	.cell_list {
		padding: 30rpx 30rpx;
		margin: 20rpx 30rpx 0 30rpx;
		border-radius: 8rpx;
	}

	.cell_right image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
	}
</style>
