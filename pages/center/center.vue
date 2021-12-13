<template>
	<transition
		  appear
		  name="animate__animated"
		  enter-active-class="animate__slideInDown"
		  >
	<view>
		<view v-if="userObj.id || $bus.userObj">
			<view class="u-flex header user-box u-p-l-30 u-p-r-20 u-p-b-30">
				<view class="avatar" >
					<upload>
					</upload>
				</view>
					
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-20">{{userObj.name}}</view>
					<view class="u-font-14 u-tips-color">邮箱:{{userObj.email}}</view>
				</view>
			</view>
			
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="setting" title="个人信息" @click="toBaseInfo"></u-cell-item>
				</u-cell-group>
			</view>
			
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item @click.native="toUrl('pages/orders/orderList')" icon="order" title="所有订单"></u-cell-item>
					<u-cell-item icon="star" title="商品收藏" @click="toUrl('pages/collection/collection')"></u-cell-item>
					<u-cell-item icon="map" @click="toUrl('pages/orders/addresses?prePage=pages/center/center')" title="收货地址"></u-cell-item>
				</u-cell-group>
			</view>
			
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="arrow-leftward" @click="logOut" title="退出登录"></u-cell-item>
				</u-cell-group>
			</view>
		</view>
		
		<view v-else class="login" @click="toLogin">
			登录
		</view>
		<u-toast ref="uToast" />
		
	</view>
	</transition>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				pic:'https://uviewui.com/common/logo.png',
				show:true,
				//#ifdef MP-WEIXIN
				userObj:{},
				//#endif
			}
		},
		mounted() {
			// #ifndef MP-WEIXIN
			if(!localStorage.getItem('uni-shop-userObj')){
				this.showToast()
			}
			// #endif
		},
		methods: {
			toUrl(url){
				this.$u.route({
					url
				})
			},
			toBaseInfo(){
				this.$u.route({
					url:"pages/center/baseInfo"
				})
			},
			toUpload(){
				this.$u.route({
					url:"pages/upload/upload"
				})
			},
			logOut(){
				//#ifndef MP-WEIXIN
				if(!confirm('确认退出'))return
				this.$store.dispatch('logOut',this.$store.state.loginInfo)
				this.$bus.userObj = null
				//#endif
				//#ifdef MP-WEIXIN
				this.$u.post('/api/auth/logout').then(res=>{},err=>{
					uni.showToast({
						title:"退出成功",
						icon:"none"
					})
					uni.removeStorageSync('uni-shop-userToken')
					uni.removeStorageSync('uni-shop-userObj')
					this.userObj = {}
					this.$bus.userObj = {}
					this.$bus.userToken = {}
				})
				//#endif
			},
			showToast() {
				this.$refs.uToast.show({
					title: '请登录',
					type: 'warning',
				})
				setTimeout(()=>{
					this.$u.route({
						url:"pages/auth/login"
					})
				},1500)
			},
			toLogin(){
				this.$u.route({
					url:"pages/auth/login"
				})
			}
		},
		computed:{
			// #ifndef MP-WEIXIN
			...mapState(['userObj'])
			// #endif
		},
		//#ifdef MP-WEIXIN
		onShow() {
			this.userObj = this.$bus.userObj
		},
		//#endif
	}
</script>

<style lang="scss">
	@import '../../theme.scss';
	@import '../../index.scss';
	@import '../../uni.scss';
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;

}
.header{
	padding-top: 15px;
}
.login{
	font-size: 20px;
	    color: white;
	    background: $u-type-primary;
	    display: inline-block;
	    padding: 5px 50px;
	    border-radius: 4px;
	    margin: 31%;
}
.avatar{
	width: 70px;
	height:70px;
	margin-right: 10px;
}
</style>
