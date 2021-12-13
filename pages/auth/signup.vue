<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎注册图书商城</view>
			 <u-form ref="uForm" :model="form" :rules="rules">
				 <u-form-item prop="email" label="邮箱" required>
					 <input class="u-border-bottom" type="text" v-model="form.email" placeholder="请输入邮箱" />
				 </u-form-item>
				 <u-form-item prop="name" label="名称" required>
				 	<input class="u-border-bottom" type="text" v-model="form.name" placeholder="请输入名称" />
				 </u-form-item>
				 <u-form-item prop="password" label="密码" required>
				 	<input class="u-border-bottom" type="password" v-model="form.password" placeholder="请输入密码" />
				 </u-form-item>
				 <u-form-item prop="password_confirmation"  label="密码" required>
				 	<input class="u-border-bottom" type="password" v-model="form.password_confirmation" placeholder="请再次输入密码" /> 
				 </u-form-item>
			 </u-form>
		<!-- 	
			
-->
			<button :style="[inputStyle]"  class="getCaptcha" @click="signup">注册</button>
			<view class="alternative">
				<view class="password" @click="toLogin">登录</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	onReady() {
			this.$refs.uForm.setRules(this.rules);
	},
	name:"signup",
	data(){
		return {
			form: {
				email:"",
				password:"", 
				password_confirmation:"",
				name:"",
			},
			rules:{
				email: [
					{ 
						required: true, 
						whitespace:true,
						pattern:/^\w+@{1}\w{0,20}(.(com|cn)){1,}$/ig,
						message: '请输入正确的邮箱', 
						trigger: ['change','blur'],
					}
				],
				password: [
					{ 
						required: true, 
						min:6,
						whitespace:true,
						message: '密码最少6位', 
						trigger: ['change','blur'],
					}
				],
				name: [
					{ 
						required: true, 
						whitespace:true,
						message: '请输入姓名', 
						trigger: ['change','blur'],
					}
				],
				password_confirmation: [
					{ 
						required: true, 
						message: '密码确认是必须的', 
						trigger: ['change','blur'],
					}
				],
			},
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.form.email.length && this.form.password.length && this.form.password_confirmation.length && this.form.name.length ) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['warning'];
			}
			return style;
		}
	},
	methods:{
		toLogin(){
			this.$u.route({
				type:"reLaunch",
				url:"pages/auth/login"
			})
		},
		signup(){
			this.$refs.uForm.validate(async valid => {
				if (!valid) {
					uni.showToast({
						title:'验证失败',
						icon:"none"
					})
				}else{
					
					const {email,password,password_confirmation,name} = this.form
					if(this.$u.test.email(email)){
						//#ifndef MP-WEIXIN
						await this.$store.dispatch('getRegister',{email,password,password_confirmation,name})
						uni.showToast({
							title:"注册成功,登陆中",
							icon:"none"
						})
						this.$u.login({password,email}).then(res=>{
							setTimeout(()=>{
								uni.showToast({
									title:"已登录",
									icon:"none"
								})
								this.$u.route({
									type:'switchTab',
									url:"pages/index/index"
								})
							},500)
						},err=>{})
						// #endif
						//#ifdef MP-WEIXIN
						this.$u.post('/api/auth/register',{email,password,password_confirmation,name}).then(res=>{
							uni.showToast({
								title:"注册成功,登陆中",
								icon:"none"
							})
							this.$u.login({password,email}).then(res=>{
								setTimeout(()=>{
									uni.showToast({
										title:"已登录",
										icon:"none"
									})
									this.$u.route({
										type:'switchTab',
										url:"pages/index/index"
									})
								},500)
							},err=>{})
						},err=>{})
							
						//#endif
					}else{
						uni.showToast({
							title:"邮箱格式不正规",
							icon:"error",
							duration:2000
						})
					}
				}
			})
		}
	}
}
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

