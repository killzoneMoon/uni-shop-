<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录图书商城</view>
			<u-form
			:model="form"
			labelPosition="left"
			:rules="rules"
			ref="uForm"
			>
				<u-form-item
						label="邮箱"
						prop="email"
						borderBottom
						 required
				>
					<input class="u-border-bottom" type="text" v-model="form.email" placeholder="请输入邮箱" />
				</u-form-item >
					
				<u-form-item
						label="密码"
						prop="password"
						borderBottom
						 required
				>
					<input class="u-border-bottom" type="password" v-model="form.password" placeholder="请输入密码" />
				</u-form-item>
			</u-form>
			<button :style="[inputStyle]" ref='submit' class="getCaptcha" @click="submit">登录</button>
			<view class="alternative">
				<view class="password" @click="toUrl('pages/auth/login')">短信验证登录</view>
				<view class="password" @click="toUrl('pages/auth/signup')">注册账户</view>
				<view class="password" @click="toIndex('pages/index/index')">返回主页</view>
				<view class="issue">找回密码</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			userObj:{},
			userToken:{},
			form: {
				email: '',
				password:'',
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
			},
		}
	},
	onReady() {
			this.$refs.uForm.setRules(this.rules)
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.form.email && (this.form.password+"").length>=6) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['warning'];
			}
			return style;
		}
	},
	methods: {
		async submit() {
			this.$refs.uForm.validate(async valid => {
				if (!valid) {
					uni.showToast({
						title:'验证失败',
						icon:"none"
					})
				}else{
					const {email,password} = this.form
					if(this.$u.test.email(email) && (password+"").length>=6) {
					
						let params = {
							email,
							password
						}
						// #ifdef MP-WEIXIN
						//貌似使用this.$u的请求不管成功还失败都会调用err函数,且err即作为请求返回的数据也作为失败的消息
						this.$u.post('/api/auth/login',params).then(res=>{
						},err=>{
							let _this = this
							this.userToken = err
							this.$bus.userToken = err
							this.$u.http.interceptor.request = (config) => {
								config.header.Authorization = _this.$bus.userToken.token_type+" "+_this.$bus.userToken.access_token
								if(config.url == '/api/auth/login') config.header.noToken = true;
								return config;
							}
							uni.setStorageSync('uni-shop-userToken',JSON.stringify(err))
							this.$u.get('/api/user',{}).then(res=>{
							},err=>{
								uni.setStorageSync('uni-shop-userObj',JSON.stringify(err))
								this.userObj = err
								this.$bus.userObj = err
								const message = err.data ? "邮箱或密码不正确" : '微信小程序登陆成功'
								const type = err.data ? 'error' : 'success'
								this.showToast({
									title:message,
									type,
								})
								if(!err.data){
									setTimeout(()=>{
										this.toIndex('pages/index/index')
									},1500)
								}
							})
						})
						//#endif
						
						
						
						
						
						// #ifndef MP-WEIXIN
						const result = await this.$store.dispatch('getLogin',params).then(res=>{
							this.showToast({title:"登陆成功",type:"success"})
							setTimeout(()=>{
								this.toIndex('pages/index/index')
							},1500)
						},err=>{
							uni.showToast({
								title:"邮箱或密码不正确",
								icon:"error"
							})
						})
						// #endif
					}else if(!(this.form.email.length && (this.form.password+"").length>=6)){
						return
					}else{
						this.showToast({title:"邮箱错误",type:'error'})
					}
				}
			});
		},
		toIndex(url){
			this.$u.route({
				type:'switchTab',
				url
			})
		},
		toUrl(url){
			this.$u.route({
				url,
				type:"reLaunch",
			})
		},
		showToast({title,type}) {
			this.$refs.uToast.show({
				title,
				type
			})
		}
	},
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

