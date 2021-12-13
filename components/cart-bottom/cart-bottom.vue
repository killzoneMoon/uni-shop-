<template>
	<view>
		<view>
			{{_initSelect()}}
		</view>
		<view class="cart-bottom-wrap"  :class="zero">
			<view class="select-icon-wrap" v-if="cartInfo.length && buttonText!=='下单并支付'" >
				<view class="select-icon" v-selectAllChange @click="selectAll" :class="selectAllFlag?'highlight':''">
					<u-icon name="checkbox-mark" class="checkbox-mark" color="white"></u-icon>
				</view>
			</view>
			<view class="select-all" v-if="cartInfo.length && buttonText!=='下单并支付'">全选</view>
			<view class="total-sum">合计:</view>
			<view class="total" >
				<view class="fraction-figure">
					$
				</view>
				{{totalSum?totalSum:cartInfo.length?_initTotalSum:0}}.
				<view class="fraction-figure">00</view>
			</view>
			<view class="pay-button" @click="buttonEvent">
				{{buttonText}}
			</view>
		</view>
	</view>
</template>

<script>
	let _this
	export default{
		name:'CartBottom',
		props:{
			zero:{
				default:''
			},
			buttonEvent:{
				default:()=>{
					return
				}
			},
			buttonText:{
				default:'未填写文本'
			},
			cartInfo:{
				default:()=>{
					return []
				}
			},
			checkedItems:{
				default:()=>{
					return []
				}
			},
			totalSum:{
				type:Number,
				default:0
			},
			avalibleNum:{
				type:Number
			}
		},
		data(){
			return{
				selectAllFlag:false,
			}
		},
		methods:{
			_initSelect(){
				//#ifdef MP-WEIXIN
				this.$bus.selectAllIconChange = (flag)=>{
					this.selectAllFlag = flag
				}
				const {checkedItems} = this
				if(checkedItems.length===this.avalibleNum && this.avalibleNum){
					this.selectAllFlag = true
				}
				//#endif
				return ''
			},
			toUrl(url){
				this.$u.route({
					url
				})
			},
			async selectAll(){
				const {checkedItems,cartInfo} = this
				await this.$emit('selectAll',this.checkedItems.length===this.avalibleNum && !!this.avalibleNum)
				setTimeout(()=>{
					this.selectAllFlag = this.checkedItems.length===this.avalibleNum && !!this.avalibleNum
				},1500)
			},
			_initSelectIcon(){
				//初始化将selectIcon与cartitem改变所相关联的全局事件总线上的函数
				//#ifndef MP-WEIXIN
				this.$bus.$on('selectAllIconChange',(flag)=>{
					this.selectAllFlag = flag
				})
				//#endif
				
				const {checkedItems} = this
				if(checkedItems.length===this.avalibleNum && this.avalibleNum){
					this.selectAllFlag = true
				}
				return ''
			}
		},
		directives:{
			selectAllChange: {
			    // 指令的定义
			    inserted: function (el) {
				  _this._initSelectIcon()
			    }
			}
		},
		computed:{
			_initTotalSum(){
				_this = this
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
.zero{
	bottom:0!important;
}
.cart-bottom-wrap{
	position: fixed;
	bottom: 100rpx;
	padding: 0 20rpx;
	width: 100%;
	height: 100rpx;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	background-color: white;
	.select-icon-wrap{
		flex: 1;;
		.select-icon{
			margin-left: 50%;
			transform: translateX(-50%);
			width: 20px;
			height: 20px;
			border-radius:10px;
			background: gray;
			.checkbox-mark{
				transform: scale(0.6) translateY(-38%);
				margin-left: -10%;
			}
		}
		.highlight{
			background-color: $uni-color-primary!important;
		}
	}
	.total-sum,.select-all{
		font-size: 28rpx;
	}
	.select-all{
		flex: 2;
	}
	.total-sum{
		flex: 1;
		text-align: right;
		box-sizing: border-box;
		padding-right: 10rpx;
	}
	.total{
		flex: 2;
		color: crimson;
		font-size: 36rpx;
		.fraction-figure{
			    display: inline-block;
			    font-size: 24rpx;
		}
	}
	.pay-button{
		font-size: 26rpx;
		color: white;
		padding: 20rpx 60rpx;
		border-radius: 34rpx;
		background: crimson;
	}
}
</style>
