<template>
	<view>
		<view class="empty" v-if="!cartInfo.length">
			<u-empty text="数据为空" mode="car"></u-empty>
		</view>
		<view class="content" v-else>
			<cart-item @_initCartInfo="_initCartInfo" @checkingCartItem="handleCheckingCartItem" name="cart-item" :item="item" v-for="(item,index) in cartInfo"></cart-item>
		</view>
		<view class="cart-bottom-nav">
			
			<cart-bottom buttonText="下单" :buttonEvent="toPreview" 
			 :zero="zero"
			 :avalibleNum='avalibleNum'  @selectAll="selectAll" :cartInfo="cartInfo" :checkedItems="checkedItems"></cart-bottom>
		</view>
		<u-loading mode="flower" text="加载中" v-show="loading" class="loading"></u-loading>
		<u-toast ref="uToast" text="修改成功" overlay/>
	</view>
</template>

<script>
	export default {
		name:'Cart',
		data(){
			return {
				cartInfo:[],
				checkedItems:[],
				loading:false,
				avalibleNum:0,
				//#ifdef MP-WEIXIN
				zero:"zero",
				//#endif
				//#ifndef MP-WEIXIN
				zero:"",
				//#endif
			}
		},
		onShow(){
			this._initCartInfo()
		},
		beforeMount() {
			//#ifdef MP-WEIXIN
			this.$on('changeItemCheck',(selectAllFlag)=>{
				this.$bus.selectAllIconChange(selectAllFlag)
			})
			// #endif
			//#ifndef MP-WEIXIN
			this.$bus.$on('changeItemCheck',(selectAllFlag)=>{
				this.$bus.$emit('selectAllIconChange',selectAllFlag)
			})
			// #endif
		},
		methods:{
			toUrl(url){
				this.$u.route({
					url
				})
			},
			toPreview(){
				if(this._initTotalSum){
					this.toUrl('pages/preview/preview')
				}else{
					uni.showToast({
						title:"请最少选择一件商品",
						icon:'none',
					})
				}
			},
			async _initCartInfo(){
				//#ifndef MP-WEIXIN
				if(!this.$store.state.userObj.id){
					uni.showToast({
						title:'请先登录',
						icon:"none"
					})
					return
				}
				//#endif
				//#ifdef MP-WEIXIN
				if(!this.$bus.userObj){
					uni.showToast({
						title:'请先登录',
						icon:"none"
					})
					return
				}
				//#endif
				this.$bus.soldOutBookIds = []
			// #ifndef MP-WEIXIN
			// await this.$store.dispatch('getCart')
			// this.cartInfo = this.$store.state.cartInfo.data
			const {token_type,access_token} = this.$store.state.loginInfo
			await this.$u.get('/api/carts',{include:'goods'},{
				Authorization:token_type+" "+access_token
			}).then(res=>{},err=>{
				this.cartInfo = err.data
			})
			// #endif
			
			// #ifdef MP-WEIXIN
			const {token_type,access_token} = this.$bus.userToken
			await this.$u.get('/api/carts',{include:'goods'},{
				Authorization:token_type+" "+access_token
			}).then(res=>{},err=>{
				this.cartInfo = err.data
			})
			// #endif
			
			
				this.checkedItems = []
				for(let i=0;i<this.cartInfo.length;i++){
					if(this.cartInfo[i].is_checked === 1){
						if(this.cartInfo[i].goods.stock){
							this.checkedItems.push(this.cartInfo[i].id)
						}
					}
					if(this.cartInfo[i].goods.stock===0){
						this.$bus.soldOutBookIds.push(this.cartInfo[i].goods.id)
						this.cartInfo[i].is_checked = false
					}
				}
				this.avalibleNum = 0
				this.cartInfo.forEach(c=>{
					this.avalibleNum += c.goods.stock?1:0
				})
			},
			async selectAll(flag){
				if(flag){
					this.checkedItems = []
				}else{
						this.cartInfo.forEach(c=>{
						if(c.goods.stock){
							this.checkedItems.push(c.id)
						}
					})
				}
				await this.sendCheckingReq()
			},
			async sendCheckingReq(){
				this.loading = true
				this.params = {
					cart_ids:this.checkedItems
				}
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('checkCartItem',{token:this.$store.state.loginInfo,params:this.params})
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.patch('/api/carts/checked',this.params).then(res=>{},err=>{})
				//#endif
				await this._initCartInfo()
				this.loading = false
				this.$refs.uToast.show({
					title:'修改成功',
				})
			},
			async handleCheckingCartItem(id){
				//将绑定在事件总线上的处理全选按钮响应的事件激活
				
				if(this.checkedItems.indexOf(id) === -1){
					this.checkedItems.push(id)
				}else{
					this.checkedItems.splice(this.checkedItems.indexOf(id),1)
				}
				await this.sendCheckingReq()
				//#ifndef MP-WEIXIN
				this.$bus.$emit('changeItemCheck',this.checkedItems.length===this.avalibleNum && this.avalibleNum !== 0)
				// #endif
				//#ifdef MP-WEIXIN
				this.$emit('changeItemCheck',this.checkedItems.length===this.avalibleNum && this.avalibleNum !== 0)
				// #endif
			}
		},
		computed:{
			_initTotalSum(){
			    let num = 0
				this.cartInfo.forEach(c=>{
					if(c.is_checked===1){
						num += c.goods.price*c.num
					}
				})
				return num
			},
		}
	}
	</script>
	
	<style lang="scss" scoped>
		.loading{
			width: 30px!important;
			position: absolute;
			height: 30px!important;
			margin-top: -44%;
			margin-left: 50%;
		}
		.content{
			margin-bottom: 50px;
		}
		.empty{
			    font-size: 16px;
			    width: 80px;
			    margin: 40% auto;
				color:$uni-color-primary;
		}
	</style>