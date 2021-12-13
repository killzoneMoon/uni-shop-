<template>
	<view class="cart-item-wrap">
		<view class="cart-item">
			<view class="select-icon-wrap" v-if="item.goods.stock"  @click="checkItem(item.id)">
				<view class="select-icon" :class="item.is_checked === 1?'highlight':''">
					<u-icon name="checkbox-mark" class="checkbox-mark" color="white"></u-icon>
				</view>
			</view>
			<view class="sold-out" v-else>已售罄</view>
			<view class="details" @click="toUrl('pages/goods/show?id='+item.goods.id)">
				<u-image class="book-url" height="130px" width="100px" :src="item.goods.cover_url"></u-image>
				<view class="minor-details">
					<view class="book-title">{{item.goods.title}}</view>
					<view class="category">{{item.goods.description.length>19?item.goods.description.slice(0,19)+'...':item.goods.description}}</view>
					<view class="price">${{item.goods.price}}</view>
					<view v-if="item.goods.stock" class='options'>
						<u-number-box 
						@click.native.stop
						@minus="changeCartItemCount"
						@plus="changeCartItemCount"
						:max="item.goods.stock"
						:disabled="ifDisable"
						:min="1" 
						name="u-number-box" 
						class="u-number-box"
						integer
						v-model:value="num"
						disabledInput
						></u-number-box>
						<u-icon 
						v-on:click.native.stop="deleteItem" 
						name="trash" 
						class="trash" 
						color="red"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" text="修改成功" overlay/>
		<u-loading mode="circle" v-show="loading" style="
		    position: absolute;
			right: 3.4rem;
			    bottom: 0.1rem;
		"
		color="blue"
		></u-loading>
	</view>
</template>

<script>
	export default {
		name:'CartItem',
		props:{
			item:{
				required:true,
				type:Object,
			}
		},
		data(){
			return{
				num:1,
				loading:false,
				ifDisable:false
			}
		},
		beforeMount(){
			this.num = this.item.num
		},
		methods:{
			async changeCartItemCount(){
				this.loading = true
				this.ifDisable = true
				const {num,item} = this
				this.params = {cart:item.id,num}
				//#ifndef MP-WEIXIN
				// await this.$store.dispatch('changeCartItemCount',{token:this.$store.state.loginInfo,params:this.params}).then(res=>{
				// 	this.$emit('_initCartInfo')
				// 	setTimeout(()=>{
				// 		this.loading = false
				// 		this.ifDisable = false
				// 	},700)
				// },rej=>{
				// 	this.loading = false
				// 	this.ifDisable = false
				// 	uni.showToast({
				// 		title:"操作失败",
				// 		icon:"none"
				// 	})
				// })
				// #endif
				this.$u.put(`/api/carts/${this.item.id}`,{num}).then(res=>{},err=>{
					this.$emit('_initCartInfo')
					setTimeout(()=>{
						this.loading = false
						this.ifDisable = false
					},700)
					this.$u.get('/api/carts').then(res=>{},err=>{})
				})
			},
			async checkItem(id){
				this.$emit('checkingCartItem',id)
			},
			toUrl(url){
				this.$u.route({
					url
				})
			},
			async deleteItem(){
				// #ifndef MP-WEIXIN
				if(!confirm('将商品移除'))return
				//#endif
				this.params = {
					cart:this.item.id
				}
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('deleteCartItem',{token:this.$store.state.loginInfo,params:this.params})
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.delete(`/api/carts/${this.item.id}`).then(res=>{},err=>{})
				//#endif
				await this.$emit('_initCartInfo')
				this.$refs.uToast.show({
					title:'移除成功',
					type:'error'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';
	.cart-item-wrap{
		position:relative;
		margin-bottom:10px;
		.cart-item{
			width: 100%;
			display: flex;
			position:relative;
			.select-icon-wrap{
				    flex: 10%;
				    position: relative;
				    display: flex;
				    align-items: center;
				.select-icon{
					transition:all 0.5s;
					margin-left: 50%;
					transform: translateX(-50%);
					width: 20px;
					height: 20px;
					border-radius:10px;
					background: gray;
					position:relative;
					.checkbox-mark{
						transform: scale(0.6);
						position: absolute;
						    top: -3px;
						    left: -3px;
					}
				}
				.highlight{
					background-color: $uni-color-primary!important;
				}
			}
			.sold-out{
				    font-size: 15px;
				    width: 19%;
				    height: 100%;
				    text-align: center;
				    line-height: 4rem;
				    color: gray;
			}
			.details{
				flex:8;
				height: 100%;
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
					.book-title,.category{
						font-size: 12px;
						flex: 1;
					}
					.category{
						color: gray;
					}
					.price{
						    flex: 3;
						    font-size: 30rpx;
						    text-align: bottom;
						    color: red;
						    margin-top: 48%;
					}
					.options{
						position: absolute;
						bottom: 4rpx;
						right: 4rpx;
						.trash{
							transform: translateY(18%) translateX(12%) scale(0.8);
						}
					}
				}
			}
		}
	}
	
	
</style>
