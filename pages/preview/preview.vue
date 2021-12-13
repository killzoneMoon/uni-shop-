<template>
	<transition
	name="animate__animated animate__slideInLeft"
	enter-active-class="animate__slideInDown"
	leave-active-class="animate__slideOutRight"
	>
		<view v-if="ordersList.address">
			<view  class="preview-wrap u-skeleton">
				<view class="addressNav" @click="toUrl('pages/orders/addresses')">
					<view v-if="ordersList.address.length && is_default_exist">
						<view class="title">
							{{_initAddress.province+_initAddress.city+_initAddress.county+_initAddress.address}}
						</view>
						<view class="phone">
							{{_initAddress.phone}}
						</view>
					</view>
					<view v-else style="
					    font-size: 20px;
					    line-height: 50px;
					    height: 100%
						">
						添加地址
					</view>
					<view class="triangle" ></view>
				</view>
				
				<view class="content-wrap">
					<view class="content">
						<view class="details" v-for="(item,index) in ordersList.carts" v-if="" @click="toUrl('pages/goods/show?id='+item.goods.id)">
							<u-image class="book-url" :src="item.goods.cover_url" width="100px" height="130px"></u-image>
							<view class="minor-details">
								<view class="book-title">{{item.goods.title}}</view>
								<view class="price">${{item.goods.price}}</view>
								<view class="count">x {{item.num}}</view>
							</view>
						</view>
					</view>
				</view>
				<cart-bottom zero="zero" :cartInfo="ordersList.carts" buttonText="下单并支付" :buttonEvent="toPayment" >
				</cart-bottom>
				<view class="Qrcode-wrap" v-if="QrcodeUrl.length">
					<view class="Qrcode">
						<view class="title">支付</view>
						<u-image :src="QrcodeUrl" style="
						    width: 11.5rem;
						    height: 12rem;
						    display: inline-block;
						    margin-left: 17%;
						" width="11.5rem" height="12rem"></u-image>
						<view class="close" @click="closeQrcode">
							稍后支付
						</view>
					</view>
				</view>
				<!-- <u-skeleton :loading="skeletonLoading" :animate="true"></u-skeleton> -->
			</view>
		</view>
	</transition>
</template>

<script>
	let _this
	export default {
		name:"preview",
		beforeMount() {
			this._initOrdersList()
			this.$u._initPreview = ()=>{this._initOrdersList()}
		},
		data(){
			return{
				ordersList:{},
				QrcodeUrl:"",
				skeletonLoading:true,
				//#ifdef MP-WEIXIN
				orderInfo:{},
				//#endif
			}
		},
		methods:{
			toUrl(url){
				this.$u.route({
					url
				})
			},
			async toPayment(){
				//循环请求status的api直到支付成功或二维码消失
				//#ifndef MP-WEIXIN
				this.statusTimer = setInterval(async()=>{
					if(	await this.$store.dispatch('getStatus',this.$store.state.orderInfo.id)===2){
						clearInterval(this.statusTimer)
					}
					
				},4000)
				//#endif
				//使用接口文档提供的支付宝沙盒
				let address_id = ''
				//#ifndef MP-WEIXIN
				this.$store.state.ordersPreview.address.forEach(a=>{
					if(a.is_default){
						address_id = a.id
					}
				})
				await this.$store.dispatch('CreateOrder',address_id).then(res=>{
					uni.showToast({
						title:"下单成功" 
					})
				})
				await this.$store.dispatch('getQrcode',this.$store.state.orderInfo.id)
				this.showQrcode()
				//#endif
				//#ifdef MP-WEIXIN
				let WXQrcodeUrl
				await this.$u.get('/api/address').then(res=>{},err=>{
					err.data.forEach(a=>{
						if(a.is_default){
							address_id = a.id
						}
					})
				})
				await this.$u.post('/api/orders',{address_id}).then(res=>{},async err=>{
					uni.showToast({
						title:"下单成功",
					})
					this.orderInfo = err
					await this.$u.get(`api/orders/${err.id}/pay`,{type:'aliyun'}).then(res=>{},err=>{
						WXQrcodeUrl = "https://api.shop.eduwork.cn"+err.qr_code_url
						_this.QrcodeUrl = "https://api.shop.eduwork.cn"+err.qr_code_url
					})
				})
				//#endif
				_this.WXShowQrcode(WXQrcodeUrl)
			},
			WXShowQrcode(url){
				this.QrcodeUrl = url
			},
			closeQrcode(){
				clearInterval(this.statusTimer)
				this.QrcodeUrl = ''
				this.$u.route({
					url:'pages/cart/cart',
					type:'switchTab'
				})
			},
			showQrcode(){
				this.QrcodeUrl = "https://api.shop.eduwork.cn"+this.$store.state.Qrcode.qr_code_url
			},
			async _initOrdersList(){
				_this = this
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('getOrdersPreview')
				this.ordersList = this.$store.state.ordersPreview
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get('/api/orders/preview').then(res=>{},err=>{
					this.ordersList = err
				})
				//#endif
				this.skeletonLoading = false
			}
		},
		computed:{
			_initAddress(){
				let address = ''
				this.ordersList.address.forEach(c=>{
					if(c.is_default){
						address = c
					}
				})
				return address
			},
			is_default_exist(){
				let flag = false
				this.ordersList.address.forEach(a=>{
					if(a.is_default){
						flag = true
					}
				})
				return flag
			}
		}
	}
</script>

<style lang="scss" scoped>
	.Qrcode-wrap{
		    width: 100%;
		    height: 100%;
		    position: absolute;
		    top: 0;
		    left: 0;
		    background: rgba(0,0,0,.3);
		.Qrcode{
			width: 90%;
			    margin: 3rem auto;
			    background: white;
			    border-radius: 21px;
			.title,.close{
				    width: 100%;
				    text-align: center;
				    font-size: 18px;
				    line-height: 3rem;
			}
			.close{
				margin-top:-1rem;
				     width: 100%;
				     text-align: center;
			}
		}
	}
	.addressNav{
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 10px 15px;
		height: 50px;
		border-bottom: 1px solid whitesmoke;
		position: relative;
		.title{
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 91%;
			overflow: hidden;
			flex: 1;
			font-size: 18px;
		}
		.phone{
			font-size: 14px;
			margin-top: 5px;
			color: gray;
		}
		.triangle{
			position: absolute;
			    top: 41%;
			    right: 10%;
			    height: 10px;
			    width: 10px;
			    border-left: 1px solid black;
			    border-top: 1px solid black;
			    transform: rotateZ(135deg);
		}
	}
	
	.details{
		flex:8;
		height: 100%;
		margin-bottom: 10px;
		display: flex;
		.book-url{
			flex: 30%;
			height: 100%;
		}
		.minor-details{
			padding-top: 16rpx;
			height: 100%;
			flex: 76%;
			padding-left: 5%;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			position:relative;
			.book-title{
				font-size: 12px;
				flex: 1;
			}
			.price{
				flex: 3;
				font-size:30rpx;
				text-align: bottom;
				color: red;
				line-height: 176rpx;
			}
			.count{
				    font-size: 12px;
				    position: absolute;
				    bottom: 29%;
				    right: 9%;
			}
		}
	}
	.content-wrap{
		    height: 20rem;
		    overflow: scroll;
	}
</style>
