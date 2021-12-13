<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录图书商城</view>
			<input class="u-border-bottom" type="number" v-model="tel" placeholder="请输入手机号" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha" @click="">获取短信验证码</button>
			<view class="alternative">
				<view class="password" @click="toUrl('pages/auth/passwordLogin')">密码登录</view>
				<view class="password" @click="toUrl('pages/auth/signup')">注册账户</view>
				<view class="password" @click="toIndex('pages/index/index')">返回主页</view>
				<view class="issue">遇到问题</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tel: ''
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.tel) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['warning'];
			}
			return style;
		}
	},
	methods: {
		toIndex(url){
			this.$u.route({
				type:'switchTab',
				url
			})
		},
		submit() {
			if(this.$u.test.mobile(this.tel)) {
				this.$u.route({
					url: 'pages/auth/code',
					type:"reLaunch",
				})
			}
		},
		toUrl(url){
			this.$u.route({
				type:"reLaunch",
				url:url,
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;

		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			color: $u-type-info;
			margin-bottom: 60rpx;
			margin-top: 8rpx;
		}
		.getCaptcha {
			background-color: rgb(253, 243, 208);
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content:space-between;
			
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
		
		.hint {
			padding: 20rpx 40rpx;
			font-size: 20rpx;
			color: $u-tips-color;
			
			.link {
				color: $u-type-warning;
			}
		}
	}
}
</style>
