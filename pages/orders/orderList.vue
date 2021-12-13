<template>
	<view>
		<u-tabs
		class="tabs u-skeleton-rect"
		@change="sortChange" 
		:current="currentTab" 
		bar-height="4" 
		bar-width="60" 
		active-color="crimson" 
		:list="sortList"
		style="
		width: 100%;
		"
		></u-tabs>
		<view class="content">
			<view class="order" v-if="orders.length" @click="toUrl(`pages/orders/details?id=${order.id}`)" v-for="order in orders">
				<view class="header">
					<view class="totalCount">共计{{order.goods.data.length}}件商品</view>
					<view class="payStatus">未支付</view>
				</view>
				<view class="items">
					<view class="details" v-for="(item,index) in order.goods.data">
						<u-image width="100px" height="130px" class="book-url" :src="item.cover_url"></u-image>
						<view class="minor-details">
							<view class="book-title">{{item.description.slice(0,20)}}</view>
							<view class="price">${{item.price}}</view>
							<view class="count">x {{order.orderDetails.data[index].num}}</view>
						</view>
					</view>
				</view>
				<view class="footer">
					<view class="date">{{order.created_at}} </view>
					<view class="pay-now">去付款</view>
				</view>
			</view>
			<view class="empty" v-if="orders.length===0" >
				<u-empty mode="order" text="暂无订单详情"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		beforeMount() {
			this._initOderList()
		},
		name:"orderList",
		methods:{
			toUrl(url){
				this.$u.route({
					url
				})
			},
			sortChange(index){
				this.currentTab = index
				this.orders = []
				this._initOderList()
			},
			async _initOderList(){
				const {page,title,currentTab} = this
				const params = {
					page,
					title,
					status:currentTab+1,
					include:"goods,user,orderDetails"
				}
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('getOrderList',params).then(res=>{
					this.orderList = this.$store.state.orderList
					this.$store.state.orderList.data.forEach(o=>{
						this.orders.push(o)
					})	
				},err=>{
					uni.showToast({
						title:"订单地址不存在",
						icon:"none"
					})
					uni.navigateBack({
						
					})
				})
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get('/api/orders',params).then(res=>{},err=>{
					if(err.status){
						uni.showToast({
							title:err.status.message,
							icon:"none"
						})
						this.$u.route({
							type:"navigateBack"
						})
					}else{
						this.orderList = err
						this.orderList.data.forEach(o=>{
							this.orders.push(o)
						})
					}
				})
				//#endif
				
			}
		},
		onReachBottom() {
			if(this.page<this.orderList.meta.pagination.total_pages){
				this.page++
				this._initOderList()
			}
		},
		data(){
			return{
				orders:[],
				page:1,
				title:'',
				orderList:{},
				currentTab:0,
				sortList:[
				{name:'待付款',},
				{name:'已支付',},
				{name:'待收货',},
				{name:'已完成',},
				{name:'已过期',}
				],
			}
		},
	}
</script>

<style lang="scss" scoped>
.content{
	height:84%;
	width:100%;
	.order{
	   margin: 10px;
	   border-radius: 10px;
	   box-shadow: 1px 2px 4px rgba(0,0,0,.2);
	   padding: 10px;
		.header{
			height: 7%;
			display: flex;
			align-items: center;
			width:100%;
			margin-bottom:1rem;
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
		}
		.items{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			.details{
				display: flex;
				margin-bottom:1rem;
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
		.footer{
			.pay-now{
				    display: inline-block;
				    font-size: 15px;
				    color: white;
				    background: green;
				    padding: 5px;
				    border-radius: 2px;
				    float: right;
			}
			.date{
				    font-size: 15px;
				    color: gray;
				    display: inline-block;
			}
		}
	}
	
</style>
