<template>
	<view>
		{{_initThis}}
		<u-upload
	:action="action"
	:auto-upload="true"
	:max-size="5 * 1024 *1024"
	:max-count="1"
	:multiple-='false'
	:before-upload="beforeUpload"
	:show-progress="false"
	:show-upload-list="true"
	:custom-btn="true"
	:form-data="formData"
	:deletable="false"
	ref="upload"
	width="0"
	height="0"
	@on-success="uploadSuccess"
		 >
			 <u-avatar class="u-avatar" slot='addBtn' :src="userObj.avatar_url" size="140"></u-avatar>
		</u-upload>
		<u-loading mode="circle" color="blue" :show="loading" style="margin-left: 27%;margin-top:17%;"></u-loading>
	</view>
</template>

<script>
	let _this
	import {mapState} from 'vuex'
	import axios from 'axios'
	export default {
		name:"upload",
		computed:{
			//#ifndef MP-WEIXIN
			...mapState(['userObj','loginInfo']),
			//#endif
			_initThis(){
				_this = this
				return ''
			}
		},
		data(){
			return{
				//#ifdef MP-WEIXIN
				userObj:{},
				//#endif
				formData:{},
				upFileName:'',
				action: '',
				loading:false,
			}
		},
		methods:{
			async beforeUpload(index,list){
				_this.loading = true
				//#ifdef H5
				const filename = list[0].file.name
				//#endif 
				//#ifndef H5
				const filename = list[0].file.path
				//#endif 
				
				const arr = filename.split(".")
				const suffix = arr[arr.length-1] 
				_this.upFileName = _this.$u.guid(20) + "." + suffix
				let ossToken
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('getOssToken',this.loginInfo)
				 ossToken = this.$store.state.ossToken
				 this.action = ossToken.host
				 this.formData = {
				 	'key':this.upFileName,
				 	'policy':ossToken.policy,
				 	'OSSAccessKeyId':ossToken.accessid,
				 	'success_action_status':'200',
				 	'signature':ossToken.signature,
				 }
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get('/api/auth/oss/token').then(res=>{
				},err=>{
					ossToken = err
					_this.formData = {
						'key':_this.upFileName,
						'policy':ossToken.policy,
						'OSSAccessKeyId':ossToken.accessid,
						'success_action_status':'200',
						'signature':ossToken.signature,
					}
					_this.action = ossToken.host
				})
				//#endif
			},
			async uploadSuccess(){
				let params = {
					avatar:_this.upFileName
				}
				
				//#ifndef MP-WEIXIN
				let {loginInfo} = this.$store.state
				await this.$store.dispatch('updateAvatar',{token:loginInfo,params})
				await this.$store.dispatch('getUser',{token:loginInfo})
				this.$u.toast('更新成功')
				this.$refs.upload.remove(0)
				this.$refs.upload.upload()
				this.loading = false
				//#endif
				
				//#ifdef MP-WEIXIN
				await this.$u.patch('/api/user/avatar',params).then(res=>{},err=>{})
				await this.$u.get(`/api/user`).then(res=>{},err=>{
					_this.userObj = err
					_this.$bus.userObj = err
					_this.$u.toast('更新成功')
					_this.$refs.upload.remove(0)
					_this.$refs.upload.upload()
					_this.loading = false
				})
				//#endif
			}
		},
		beforeMount() {
			//#ifdef MP-WEIXIN
			this.userObj = this.$bus.userObj
			//#endif
		}
	}
</script>

<style lang="scss" scoped>
	.u-preview-wrap{
		border-radius:35px;
		margin: 0;
	}
</style>
