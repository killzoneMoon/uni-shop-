<template>
	<transition
	appear
	name="animate__animated animate__slideInLeft"
	enter-active-class="animate__flipInX"
	leave-active-class="animate__flipOutX"
	>
		<view class="wrap">
				<u-form :model="form" :errorType="errorType" ref="uForm">
					<u-form-item label="昵称" prop="name" required>
						<u-input v-model="form.name"  />
					</u-form-item>
				</u-form>
				<u-button @click="submit">提交</u-button>
			</view>
	</transition>
</template>

<script>
	export default {
		name:"baseInfo",
		data(){
			return {
				errorType:['message'],
				form:{
					name:"",
				},
				rules: {
					name: [
						{ 
							required: true, 
							message: '请输入姓名', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
				}
			}
		},
		methods:{
			async submit(){
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						//#ifndef MP-WEIXIN
						if(this.form.name!==this.$store.state.userObj.name){
							await this.$store.dispatch('getUser',{token:this.$store.state.loginInfo,params:{name:this.form.name}})
							await this.$store.dispatch('getUser',{token:this.$store.state.loginInfo})
							uni.showToast({
								title:"修改成功",
								icon:"none",
								duration:2000,
							})
						}
						//#endif
						//#ifdef MP-WEIXIN
						if(this.form.name!==this.$bus.userObj.name){
						await this.$u.put('/api/user',{name:this.form.name}).then(res=>{},async err=>{
							await this.$u.get('/api/user').then(res=>{},err=>{
								this.$bus.userObj = err
								uni.showToast({
									title:"修改成功",
									icon:"none",
									duration:2000,
								})
								this.$u.route({
									url:"pages/center/center",
									type:"switchTab"
								})
							})
						})
						}
						// #endif
					} else {
					return
					}
				});
			}
		},
		onReady(){
			this.$refs.uForm.setRules(this.rules);
			//#ifndef MP-WEIXIN
			const {name} = this.$store.state.userObj 
			this.form.name = name
			//#endif
			//#ifdef MP-WEIXIN
			this.form.name = this.$bus.userObj.name
			//#endif
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		padding:0 20px;
	}
</style>
