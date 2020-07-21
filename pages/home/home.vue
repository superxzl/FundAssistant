<template>
	<view>
		<nav-bar title="我的持仓"></nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="header_count">
			<view class="money" :style="{'color':todayColor}">
				今日：{{today_money}}
			</view>
			<view class="money" :style="{'color':allColor}">累计：{{all_money}}</view>
		</view>
		<view v-for="(item, index) of cardinfo" :key="index" class="swipe_action_list">
			<swipe-action :options="options" :index="item.id" :titel="item.fund_code" @button="onButton">
				<view class="swipe_action">
					<card :cardinfo="item"></card>
				</view>
			</swipe-action>
		</view>
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
		 @trigger="trigger" @fabClick="fabClick" />
		<z-prompt ref="prompt" @confirm="onPromptConfirm2"></z-prompt>
	</view>
</template>

<script>
	import {
		myhttp
	} from '../../common/service.js' // 局部引入
	import zPrompt from '@/components/common/prompt';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import card from '@/components/list-card/list-card.vue'
	import swipeAction from '@/components/common/swipe-action';
	import navBar from '@/components/common/zhouWei-navBar';
	export default {
		components: {
			swipeAction,
			navBar,
			card,
			uniFab,
			zPrompt
		},
		data() {
			return {
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				today_money: '',
				all_money: '',
				showtitle: '',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#FE635F',
					buttonColor: '#FE635F'
				},
				content: [{
						iconPath: '/static/component.png',
						selectedIconPath: '/static/componentHL.png',
						text: '添加',
						active: true
					},
					{
						iconPath: '/static/component.png',
						selectedIconPath: '/static/componentHL.png',
						text: '简约模式',
						active: true
					},
				],
				allColor: 'red',
				todayColor: 'red',
				cardinfo: [],
				options: [{
						text: '修改',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				show: true
			};
		},
		//第一次加载
		onLoad(e) {

		},
		//页面显示
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
		},
		//方法
		methods: {
			onPromptConfirm2($event) {
				console.log($event)
			},
			onShowPrompt() {
				this.$refs.prompt.onPopupShow("", {
					title: '修改' + this.showtitle,
					but_title: '确定',
					Config: [{
							title: '操作', // 标题
							tips: "持仓净值", // 提示
							confirmText: '确认', // 确认按钮文字
							placeholder: '持仓净值', // 输入框提示文字
							password: false, // 是否是密码框
							inputType: 'number', // 输入框类型
							maxlength: 11, // 最大输入长度
							confirmType: "done", // 设置键盘右下角按钮的文字，仅在 type="text" 时生效,
							value: ""
						},
						{
							title: '操作', // 标题
							tips: "持仓数量", // 提示
							confirmText: '确认', // 确认按钮文字
							placeholder: '持仓数量', // 输入框提示文字
							password: false, // 是否是密码框
							inputType: 'number', // 输入框类型
							maxlength: 11, // 最大输入长度
							confirmType: "done", // 设置键盘右下角按钮的文字，仅在 type="text" 时生效,
							value: ""
						}
					]
				});
			},
			onShow() {
				myhttp
					.post('api/fund/index', {}, {
						custom: {
							auth: true
						}
					})
					.then(res => {
						this.cardinfo = res.data.data
						this.today_money = res.data.all_profit_and_loss_today
						this.all_money = res.data.all_total_revenue
						this.allColor = Number(this.all_money) > 0 ? 'red' : 'green'
						this.todayColor = Number(this.today_money) > 0 ? 'red' : 'green'
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
			onBackPress() {
				if (this.$refs.fab.isShow) {
					this.$refs.fab.close()
					return true
				}
				return false
			},
			onClick: function(e) {
				console.log('onClick');
			},
			onPageJump(url) {
				uni.navigateTo({
					url: url
				});
			},
			onButton(e) {
				console.log(e)
				switch (e.content.text) {
					case '删除':
						uni.showModal({
							title: '删除提示',
							content: `您是否确认删除该持有基金?`,
							success: function(res) {
								if (res.confirm) {
									myhttp
										.post('api/fund/delete', {
											id: e.index
										}, {
											custom: {
												auth: true
											}
										})
										.then(res => {
											uni.showToast({
												title: '删除成功',
												icon: 'none'
											});
										})
										.catch(err => {
											if (err.data.code == 401) {
												uni.setStorageSync('token', '');
											}
											uni.showToast({
												'title': err.data.msg
											})
										});
								} else if (res.cancel) {
									console.log('取消删除')
								}
							}
						})

						break;
					case '修改':
						this.onShowPrompt()
						// myhttp
						// 	.post('api/fund/edit', {
						// 		id: e.index
						// 	}, {
						// 		custom: {
						// 			auth: true
						// 		}
						// 	})
						// 	.then(res => {
						// 		uni.showToast({
						// 			title: '修改成功',
						// 			icon: 'none'
						// 		});
						// 	})
						// 	.catch(err => {
						// 		uni.showToast({
						// 			'title': err.data.msg
						// 		})
						// 	});
						break;
					default:
						break;
				}
			},
			tapIcon(e) {
				console.log('you tap icon')
			},
			trigger(e) {
				console.log(e)
				this.content[e.index].active = !e.item.active
				uni.showModal({
					title: '提示',
					content: `您${this.content[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			fabClick() {
				uni.showToast({
					title: '点击了悬浮按钮',
					icon: 'none'
				})
			},
			switchBtn(hor, ver) {
				if (hor === 0) {
					this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal'
					this.directionStr = this.direction === 'horizontal' ? '垂直' : '水平'
				} else {
					this.horizontal = hor
					this.vertical = ver
				}
				this.$forceUpdate()
			}
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
<style scoped>
	.swipe_action_list {
		border-bottom-width: 2rpx;
		border-bottom-color: #eee;
		border-bottom-style: solid;
	}

	.swipe_action {
		background-color: #ffffff;
		/* padding: 50rpx 30rpx; */
	}

	.money {
		display: inline;
		margin-left: 70rpx;
		text-align: center;
	}

	.header_count {
		border-width: 2rpx;
		margin-left: 27rpx;
		margin-right: 27rpx;
		border-radius: 10rpx;
		margin-top: 20rpx;
		height: 70rpx;
		display: block;
		line-height: 70rpx;
		background-color: #FFFFFF;
		border: 1px dashed #999999;
	}

	/* 头条小程序组件内不能引入字体 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('~@/static/uni.ttf') format('truetype');
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	.example {
		padding: 0 15px 15px;
	}

	.example-info {
		padding: 15px;
		color: #3b4144;
		background: #ffffff;
	}

	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	/* #endif */
	.example {
		padding: 0 15px;
	}

	.example-info {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		color: #3b4144;
		background-color: #ffffff;
		font-size: 14px;
		line-height: 20px;
	}

	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}


	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}

	.uni-fab-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.uni-padding-wrap {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
