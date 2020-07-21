<template class="box-body">
	<view class="box">
		<view class="father-box">
			<view class="header">
				<view class="auth">{{cardinfo.name}}</view>
				<view class="leave">{{cardinfo.up_and_down}}</view>
				<view class="tag">{{cardinfo.fund_code}}</view>
				<view class="time">更新时间:{{cardinfo.update_time}}</view>
			</view>
			<view class="content">
				<!-- {{cardinfo.content}} -->
				净值图:
				<image class="img" :src="cardinfo.code_pic"></image>
				<!-- 				<view class="show">
						份额：{{cardinfo.fenge}}
					</view> -->
			</view>

			<view class="hr"></view>
			<view class="function">
				<view class="good">
					<view>成本涨跌:{{cardinfo.cost_up_and_down}}</view>
				</view>
				<view class="good">
					<view>持仓金额:{{cardinfo.my_money}}</view>
				</view>
				<view class="good">
					<view>今日盈亏:{{cardinfo.profit_and_loss_today}}</view>
				</view>
				<view class="good">
					<view>累计盈亏:{{cardinfo.total_revenue}}</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: 'card',
		props: {
			cardinfo: {
				type: Object
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>
	.low {
		margin-left: 5px;
	}

	.father-box {
		background-color: #FFFFFF;
		box-shadow: #C8C7CC;
		height: 530upx;
		width: 93%;
		margin: 20upx auto;
		border: 1px dashed #999999;
		border-radius: 20upx;
	}

	.img {
		margin: 20upx 0px 20upx 50upx;
		height: 120upx;
		width: 170upx;
		/* border-radius: 90upx; */
		border: 1px solid #007AFF;
		display: inline-flex;
	}

	.auth {
		font-weight: bolder;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 15px;
		margin-top: -50upx;
		margin-left: 90upx;
	}

	.time {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 12px;
		display: inline-flex;
		margin-left: 90upx;
		margin-top: -20upx;
		color: #808080;
	}

	.leave {
		font-size: 12px;
		text-align: center;
		background: #4CD964;
		width: 100upx;
		text-align: center;
		height: 38upx;
		line-height: 38upx;
		border-radius: 10upx;
		color: #F2F2F2;
		margin-left: 440rpx;
		margin-top: -35upx;
	}

	.content {
		display: block;
		font-size: 14px;
		color: #24292E;
		/* font-style: italic; */
		margin-left: 40upx;
		margin-right: 60upx;
		margin-top: 18upx;
		height: 200upx;
		text-indent: 1.5em;
	}

	.nbsp {
		margin-left: 25upx;
	}

	.icon-like {
		height: 32upx;
		width: 32upx;
	}

	.good {
		display: inline-flex;
		margin-top: 30upx;
		margin-left: 50upx;
	}

	.good view {
		font-size: 12px;
		/* margin-left: 20upx; */
		color: #6D6D72;
		margin-top: -2upx;
		text-align: center;
		margin-right: 30rpx;
		margin-left: 40rpx;
	}

	.hr {
		width: 100%;
		margin: 25upx auto;
		margin-bottom: 0upx;
		color: #AAAAAA;
		border-color: #ececec;
		border: 0.2rpx dashed #999999;
		height: 0.2px;
	}

	.show {
		/* color: #0081FF; */
		margin-top: 12upx;
	}

	.tag {
		font-size: 12px;
		text-align: center;
		line-height: 38upx;
		background: #36BBFF;
		width: 120upx;
		text-align: center;
		height: 38upx;
		border-radius: 10upx;
		color: #F2F2F2;
		margin-left: 550upx;
		margin-top: -33upx;
	}

	.header {
		margin-top: 70upx;
	}
</style>
