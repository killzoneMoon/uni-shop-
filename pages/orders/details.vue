<template>
	<view class="wrap">
		<view  v-if="orderInfo.goods" class="details-wrap">
			<view class="header">
				<view class="totalCount">
					共计1件商品
				</view>
				<view class="payStatus">未支付</view>
			</view>
			<view class="content">
				<view class="address-phone">
					<view class='phone'>{{phone}}</view>
					<view class='address'>{{address}}</view>
				</view>
				<view class="items-wrap">
					<view  class="details" v-for="(item,index) in orderInfo.goods.data">
						<u-image class="book-url" width="100px" height="130px" :src="item.cover_url"></u-image>
						<view class="minor-details">
							<view class="book-title">{{item.description}}</view>
							<view class="price">${{item.price}}</view>
							<view class="count">x {{orderInfo.orderDetails.data[index].num}}</view>
						</view>
					</view>
				</view>
				<view class="bolt-nut">
					<view class="serialcode">订单编号:<view>{{orderInfo.order_no}}</view></view>
					<view class="date">下单时间:<view>{{orderInfo.created_at}}</view></view>
					<view class="totalsum">商品总额:<view>${{orderInfo.amount}}</view></view>
				</view>
			</view>
		</view>
		<cart-bottom zero="zero" buttonText="立即付款" v-if="orderInfo.amount" :buttonEvent="pay" :totalSum="orderInfo.amount"></cart-bottom>
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
	</view>
</template>

<script>
	let _this
	export default {
		onLoad(e) {
			this.id = e.id
			_this = this
			this._initOrderDetails(e.id)
		},
		data(){
			return{
				orderInfo:{},
				QrcodeUrl:"",
				address:"",
				phone:0,
				id:"",
			}
		},
		name:"Details",
		
		methods:{
			async pay(){ 
				//#ifndef MP-WEIXIN
				this.statusTimer = setInterval(async()=>{
					if(await this.$store.dispatch('getStatus',this.orderInfo.id)===2){
						clearInterval(this.statusTimer)
					}
					
				},4000)
				//#endif
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('getQrcode',this.orderInfo.id)
				//#endif
				
				
				//#ifdef MP-WEIXIN
				_this.statusTimer = setInterval(()=>{
					this.$u.get(`/api/orders/${_this.id}/status`,{}).then(res=>{},err=>{
						if(err===2){
							clearInterval(_this.statusTimer)
						}
					})
				},4000)
				this.$u.get(`api/orders/${_this.id}/pay`,{type:'aliyun'}).then(res=>{},err=>{
					_this.QrcodeUrl = "https://api.shop.eduwork.cn"+err.qr_code_url
				})
				//#endif
				this.showQrcode()
			},
			
			showQrcode(){
				//#ifndef MP-WEIXIN
				this.QrcodeUrl = "https://api.shop.eduwork.cn"+this.$store.state.Qrcode.qr_code_url
				//#endif
			},
			
			async _initOrderDetails(id){
				let orderInfo
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('getOrderDetails',id).then(res=>{
					orderInfo = res
				})
				
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get(`/api/orders/${id}?include=goods,orderDetails.goods,address`,{include:"goods,orderDetails.goods,address"}).then(res=>{},err=>{
					orderInfo = err
				})
				//#endif
				if(!orderInfo){
					this.orderInfo = {
						goods:false
					}
					return
				}else{
					this.orderInfo = orderInfo
				}
				this.$bus.totalSum = this.orderInfo.amount
				
				// 初始化地址以及电话
				this._initAddress()
			},
			
			closeQrcode(){
				clearInterval(this.statusTimer)
				this.QrcodeUrl = ''
			},
			
			_initAddress(){
				const {province,city,address,county,phone} = this.orderInfo.address
				 this.address = `${province}-${city}-${county}-${address}`
				 this.phone = phone
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		height:100%;
		.details-wrap{
			height:100%;
			padding:0 10px;
			.header{
				    height: 7%;
				    display: flex;
				    align-items: center;
					width:100%;
					.totalCount{
						font-size: 16px;
						    float: left;
					}
					.payStatus{
						    color: white;
						    background: crimson;
						    padding: 1px 5px;
						    font-size: 16px;
						    border-radius: 3px;
						    float: right;
						    margin-left: 46%;
					}
			}
			.content{
				height:84%;
				width:100%;
				.address-phone{
					height: 10%;
					width: 100%;
					display: flex;
					flex-direction: column;
					.phone{
						font-size:19px;
					}
					.address{
						font-size:18px;
						color:gray;
					}
				}
				.items-wrap{
					max-height: 74%;
					overflow: scroll;
					.details{
						margin:1rem 0;
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
								color:gray;
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
				}
				.bolt-nut{
					 width: 100%;
					height: 19%;
					display: flex;
					flex-direction: column;
					padding: 10px 0;
					.serialcode,.date,.totalsum{
						font-size: 16px;
						width: 100%;
						view{
							display: inline-block;
							text-indent: 1em;
							font-size: 15px;
							color: gray;
						}
					}
					.totalsum{
						line-height:2rem;
						view{
							color:crimson;
							font-size:17px;
						}
					}
				}
			}
		}
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
				.u-image{
					    height: 12rem !important;
					    width: 11.5rem !important;
						margin-top:-1rem;
					    margin-left: 50%;
					    transform: translateX(-50%);
				}
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
	}
	.uni-page-body{
		height:100%;
	}
	uni-page-body{
		height:100%;
	}
</style>
