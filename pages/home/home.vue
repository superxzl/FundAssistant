<template>
	<view>
		<nav-bar title="我的持仓"></nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<!-- <mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" @up="upCallback"> -->
			<view class="header_count">
				<view class="money" :style="{'color':Number(this.all_money) > 0 ? '#FE635F' : '#00AA90'}">今日：{{all_money}}</view>
				<view class="money" :style="{'color':Number(this.today_money) > 0 ? '#FE635F' : '#00AA90'}">
					累计：{{today_money}}
				</view>
			</view>
			<view class="" v-if="cardinfo.length<=0">
				<view class="empty_data">请添加持仓！</view>
			</view>
			<view v-for="(item, index) of cardinfo" :key="index" class="swipe_action_list">
				<swipe-action :options="options" :index="item.ID" :titel="item.NAME" @button="onButton()" :style="{'color':item.FUNDDRZD>0?'#FE635F':'#00AA90'}">
					<view class="swipe_action">
						<card :cardinfo="item"></card>
					</view>
				</swipe-action>
			</view>
			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
			 @trigger="trigger" @fabClick="fabClick" />
			<z-prompt ref="prompt" @confirm="onPromptConfirm2"></z-prompt>
		<!-- </mescroll-body> -->
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
				today_money: '未持仓',
				all_money: '未持仓',
				showtitle: '',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#FE635F',
					buttonColor: '#FE635F'
				},
				content: [{
						iconPath: '../../static/home/add.png',
						selectedIconPath: '../../static/home/add.png',
						text: '添加',
						active: true
					}
					// ,
					// {
					// 	iconPath: '/static/component.png',
					// 	selectedIconPath: '/static/componentHL.png',
					// 	text: '简约模式',
					// 	active: true
					// },
				],
				allColor: 'red',
				todayColor: 'red',
				cardinfo: [],
				options: [{
						text: '修改',
						title: '',
						style: {
							backgroundColor: '#00AA90'
						}
					},
					{
						text: '删除',
						title: '',
						style: {
							backgroundColor: '#FE635F'
						}
					}
				],
				show: true
			};
		},
		//第一次加载
		onLoad(e) {
			this.fastFlush()
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
			this.fastFlush()
		},
		//方法
		methods: {
			onPromptConfirm2($event) {
				console.log($event)
				if ($event.type == 'edit') {
					$event.value.map(item => {
						console.log(item);
						if (item.cost == '' || item.share == '') {
							uni.showToast({
								title: "请填写完整"
							})
						} else {
							myhttp
								.post('api/fund/edit', {
									id: $event.index,
									cost: item.cost,
									share: item.share,
								}, {
									custom: {
										auth: true
									}
								})
								.then(res => {
									uni.showToast({
										title: '修改成功',
										icon: 'none'
									});
									this.$refs.prompt.onPopupHide()
									this.fastFlush()
								})
								.catch(err => {
									if (err.data.code == 401) {
										uni.setStorageSync('token', '');
									}
									uni.showToast({
										'title': err.data.msg
									})
								});
						}
					})
				} else {
					$event.value.map(item => {
						if (item.code == '' || item.cost == '' || item.share == '') {
							uni.showToast({
								title: "请填写完整"
							})
						} else {
							myhttp
								.post('api/fund/add', {
									fund_code: item.code,
									cost: item.cost,
									share: item.share,
								}, {
									custom: {
										auth: true
									}
								})
								.then(res => {
									uni.showToast({
										title: '添加成功',
										icon: 'none'
									});
									this.$refs.prompt.onPopupHide()
									this.fastFlush()
								})
								.catch(err => {
									if (err.data.code == 401) {
										uni.setStorageSync('token', '');
									}
									uni.showToast({
										'title': err.data.msg
									})
								});
						}
					})
				}
			},
			onShowPrompt(index) {
				this.$refs.prompt.onPopupShow("", {
					title: '修改持仓' + this.showtitle,
					but_title: '保存修改',
					index: index,
					type: 'edit',
					Config: [{
							title: '操作', // 标题
							tips: "持仓净值", // 提示
							confirmText: '确认', // 确认按钮文字
							placeholder: '持仓净值', // 输入框提示文字
							password: false, // 是否是密码框
							inputType: 'text', // 输入框类型
							maxlength: 11, // 最大输入长度
							confirmType: "done", // 设置键盘右下角按钮的文字，仅在 type="text" 时生效,
							value: "",
							name: "cost"
						},
						{
							title: '操作', // 标题
							tips: "持仓数量", // 提示
							confirmText: '确认', // 确认按钮文字
							placeholder: '持仓数量', // 输入框提示文字
							password: false, // 是否是密码框
							inputType: 'text', // 输入框类型
							maxlength: 11, // 最大输入长度
							confirmType: "done", // 设置键盘右下角按钮的文字，仅在 type="text" 时生效,
							value: "",
							name: "share"
						}
					]
				});
			},
			fastFlush() {
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
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						if (err.data.code == 401) {
							uni.setStorageSync('token', '');
						}
						uni.showToast({
							'title': err.data.msg
						})
						this.mescroll.endErr();
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
											this.fastFlush()
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
							}.bind(this)
						})

						break;
					case '修改':
						this.onShowPrompt(e.index)
						break;
					default:
						break;
				}
			},
			tapIcon(e) {
				console.log('you tap icon')
			},
			trigger(e) {
				switch (e.index) {
					case 0:
						this.$refs.prompt.onPopupShow("", {
							title: '添加持仓',
							but_title: '添加',
							type: 'add',
							Config: [{
									title: '操作', // 标题
									tips: "基金代码", // 提示
									confirmText: '确认', // 确认按钮文字
									placeholder: '基金代码', // 输入框提示文字
									password: false, // 是否是密码框
									inputType: 'text', // 输入框类型
									maxlength: 11, // 最大输入长度
									confirmType: "done", // 设置键盘右下角按钮的文字，仅在 type="text" 时生效,
									value: "",
									name: "code"
								}, {
									title: '操作', // 标题
									tips: "持仓净值", // 提示
									confirmText: '确认', // 确认按钮文字
									placeholder: '持仓净值', // 输入框提示文字
									password: false, // 是否是密码框
									inputType: 'text', // 输入框类型
									maxlength: 11, // 最大输入长度
									confirmType: "done", // 设置键盘右下角按钮的文字，仅在 type="text" 时生效,
									value: "",
									name: "cost"
								},
								{
									title: '操作', // 标题
									tips: "持仓数量", // 提示
									confirmText: '确认', // 确认按钮文字
									placeholder: '持仓数量', // 输入框提示文字
									password: false, // 是否是密码框
									inputType: 'text', // 输入框类型
									maxlength: 11, // 最大输入长度
									confirmType: "done", // 设置键盘右下角按钮的文字，仅在 type="text" 时生效,
									value: "",
									name: "share"
								}
							]
						})
						break;
					case 1:
						console.log('修改')
						this.content[e.index].active = !e.item.active
					default:
						break;
				}
				// uni.showModal({
				// 	title: '提示',
				// 	content: `您${this.content[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
				// 	success: function(res) {
				// 		if (res.confirm) {
				// 			console.log(res)
				// 			console.log('用户点击确定')
				// 		} else if (res.cancel) {
				// 			console.log('用户点击取消')
				// 		}
				// 	}
				// })
			},
			fabClick() {
				// uni.showToast({
				// 	title: '点击了悬浮按钮',
				// 	icon: 'none'
				// })
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
		onPullDownRefresh() {
			this.fastFlush()
		},
		/*下拉刷新的回调 */
		downCallback() {
			//联网加载数据
			// this.fastFlush()
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		upCallback(page) {
			//联网加载数据
			// this.fastFlush()
		},
		//页面上拉触底
		onReachBottom() {},
		//用户点击分享
		onShareAppMessage(e) {
			return this.wxShare();
		}
	};
</script>
<style scoped>
	.empty_data {
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
		text-align: center;
		color: #FE635F;
	}

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
		margin-left: 90rpx;
		text-align: center;
		font-size: 12px;
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
