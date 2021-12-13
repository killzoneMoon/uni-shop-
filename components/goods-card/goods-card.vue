<template>
		<view>
			<view class="u-skeleton">
				<u-image class="u-skeleton-fillet goods-card-image" width="100px" height='130px' :src="item.cover_url"></u-image>
				<view class="details">
					<view class="title u-skeleton-rect">
						{{item.title}}
					</view>
					<view class='price_sales u-skeleton-rect'>
						¥{{item.price}}
						<view class="sales" v-show="showSales" @click="toShow">
							销量:{{item.sales}}
						</view>	
					</view>
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		name:"goodsCard",
		props:{
			showSales:{
				default:true
			},
			item:{
				type:Object,
				default(){
					return {}
				}
			},
			loading:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
			}
		},
		methods:{
			toUrl(url){
				this.$u.route({
					url,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-card-image{
		transform: translateX(-50%);
		margin-left: 50%;
		display:inline-block;
		.u-image{
			color:green;
		}
	}
	.details{
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 10px;
			view{
				color: gray;
				font-size: 13px;
				margin: 2px;
				flex: 1;
			}
			.title{
			    white-space: nowrap;
			    overflow: hidden;
			    width: 8rem!important;
			    text-overflow: ellipsis;
			    font-size: 17px;
			    color: black;
			}
			.price_sales{
			    width: 91%;
			    color: #fa3534;
				height: 20px;
				line-height: 20px;
				margin: 8px 0;
			    font-size: 16px;
				.sales{
				    display: inline-block;
				    float: right;
				    height: 20px;
				    line-height: 20px;
				}
			}
		}
</style>
