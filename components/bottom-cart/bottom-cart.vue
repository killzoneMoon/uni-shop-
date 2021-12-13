<template>
	<view   >
		<view class='u-skeleton bottom-cart'>
			<view @click="collect" class="collection u-skeleton-fillet">
				<u-icon :name="collecticon?'star':'star-fill'" :color="collectIcon?'yellow':''"></u-icon>
				<view>收藏</view>
			</view>
			<view @click="toCart" class="cart  u-skeleton-fillet">
				<u-icon name="shopping-cart"></u-icon>
				<view>购物车</view>
				<view class="sign" v-if="cartCount" >{{cartCount}}</view>
			</view>
			<view></view>
			<view v-if="item.stock" @click="addCart" class="button  u-skeleton-rect">
				加入购物车
			</view>
			<view v-else class="button u-skeleton-rect" style="background-color: gray; ">售罄</view>
			<view class="button  u-skeleton-rect">
				立即购买
			</view>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<u-loading mode="circle" :vertical="true" text="加载中" textSize="18" color="blue" :show="reqLoading" ></u-loading>
	</view>
</template>

<script>
	export default {
		name:"bottom-cart",
		data(){
			return{
				src:require('./images/star.png'),
				src_:require('./images/star-fill.png'),
				collectIcon:false,
				cartCount:0,
				loading:true,
				reqLoading:false,
			}
		},
		props:{
			item:{
				default:()=>{
					return{
						query:{}
					}
				}
			},
			isCollect:{
				default:false,
				type:Boolean
			}
		},
		mounted(){
			if(this.$bus.userObj || this.$store.state.userObj.id){
				this.$nextTick(function(){
					setTimeout(this._initData,500)
				})
			}
		},
		methods:{
			toCart(){
				this.$u.route({
					type:"switchTab",
					url:"pages/cart/cart"
				})
			},
			async collect(){
				if(!(this.$bus.userObj || this.$store.state.userObj.id)){
					uni.showToast({
						title:'请先登录',
						icon:"none"
					})
					return
				}
				this.switchCollectIcon()
				if(this.collectIcon){
					this.$u.toast('收藏成功')
				}else{
					this.$u.toast('取消收藏')
				}
				const {loginInfo} = this.$store.state
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('switchCollectBook',{token:loginInfo,id:this.$route.query.id})
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.post(`/api/collects/goods/${this.$bus.bookInfo.goods.id}`).then(res=>{},err=>{
					this.$u.get('/api/collects').then(res=>{},err=>{
						this.$bus.collections = err
					})
				})
				//#endif
			},
			async addCart(){
				//#ifdef MP-WEIXIN
				if(!this.$bus.userObj){
					uni.showToast({
						title:'请先登录',
						icon:"none"
					})
					return
				}
				//#endif
				
				//#ifndef MP-WEIXIN
				if(!this.$store.state.userObj.id){
					uni.showToast({
						title:'请先登录',
						icon:"none"
					})
					return
				}
				//#endif
				
				this.reqLoading = true
				
			//#ifndef MP-WEIXIN
			const {loginInfo} = this.$store.state
				if(await this.$store.dispatch('addToCart',{token:loginInfo,goods_id:this.$route.query.id})){
					await this._initData()
					this.reqLoading = false
					this.$u.toast('已加入购物车')
				}
				//#endif
				//#ifdef MP-WEIXIN
					await this.$u.post('/api/carts',{goods_id:this.$bus.bookInfo.goods.id}).then(res=>{},async err=>{
						this.$u.put(`/api/carts/${this.$bus.cartInfo.data.id}`,{num:1}).then(res=>{},async err=>{
							this.$u.get('api/carts',{include:'goods'}).then(res=>{},async err=>{
								this.$bus.cartInfo = err
								if(err){
									await this._initData()
									this.$u.toast('已加入购物车')
								}
								this.reqLoading = false
							})
						})
					})
				//#endif
			},
			
			switchCollectIcon(){
					this.collectIcon = !this.collectIcon
			},
			_initData(){
				this.loading=false
				let {item} = this
				setTimeout(()=>{
					this.collectIcon = this.isCollect
				},200)
				if(this.$u.utils.isLogin()){
					//#ifndef MP-WEIXIN
					this.cartCount = this.$store.state.cartInfo.data.length
					//#endif
					//#ifdef MP-WEIXIN
					this.cartCount = this.$bus.cartInfo.data.length
					//#endif
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';
	.u-loading{
		position: absolute;
		top: 50%;
	    left: 50%;
	}
	.bottom-cart{
		  display: flex;
	      height: 50px;
	      width: 100%;
	      padding: 5px 5px;
	      position: fixed;
	      bottom: 0;
	      background: white;
	      align-items: center;
		.collection,.cart{
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
			max-width: 50px;
			float: left;
			margin: 0 10px;
			width: 12%;
			.pic{
			    flex: 2;
			    height: 32px !important;
			    transform: scale(0.6);
			}
			view{
				flex: 0.7;
			    font-size: 12px;
			    color: gray;
			    height: 0px;
			    transform: translateY(-6px);
			}
			.sign{
			    height: 12px;
			    color: white;
			    background: red;
			    border-radius: 7px;
			    position: absolute;
			    bottom: 37px;
			    left: 110px;
			    font-size: 12px;
			    text-align: center;
			    line-height: 12px;
			    padding: 0 5px;
			}
		}
		>view{
			float: left;
		}
		.button{
		    margin: 0 10px;
		    border-radius: 20px;
		    height: 50%;
		    font-size: 16px;
		    padding: 5px;
		    color: white;
		    transform: translateX(46%);
		}
		.button{
			background-color:$uni-color-error ;
		}
		.button:last-child{
			background-color:$u-type-warning ;
		}
	}
</style>
