<template>
	<view v-if="bookInfo.goods">
		<goods-card :item="bookInfo.goods"></goods-card>
		<u-tabs 
		class="tabs"
		@change="sortChange"
		:current="currentTab" 
		bar-height="6" 
		bar-width="40" 
		active-color="#2979ff" 
		:list="tabs"
		:show-bar="true"
		style="margin-left: 50%;transform: translateX(-50%);display: inline-block;"
		></u-tabs>
		
		<transition
			appear
		  name="animate__animated animate__slideInLeft"
		  enter-active-class="animate__slideInLeft"
		  leave-active-class="animate__slideOutLeft"
			>
		<u-parse v-show="currentTab === 0" class="parse" :html="bookInfo.goods.details" ></u-parse>
		</transition>
		<!-- 评论列表 -->
		<transition
			appear
		  name="animate__animated animate__slideInLeft"
		  enter-active-class="animate__slideInLeft"
		  leave-active-class="animate__slideOutLeft"
			>
			<view  v-show="currentTab === 1">
				<view v-if="commentList.length " class="comment" v-for="(res, index) in commentList" :key="res.id">
					<view class="left"><image :src="res.url" mode="aspectFill"></image></view>
					<view class="right">
						<view class="top">
							<view class="name">{{ res.name }}</view>
						</view>
						<view class="content">{{ res.contentText }}</view>
						<view class="reply-box">
							<view class="item" v-for="(item, index) in res.replyList" :key="item.index">
								<view class="username">{{ item.name }}</view>
								<view class="text">{{ item.contentStr }}</view>
							</view>
						</view>
						<view class="bottom">
							{{ res.date }}
						</view>
					</view>
				</view>
			</view>
		</transition>
		<!-- 评论列表 -->
		
		<!-- 推荐商品 -->
		<transition
			appear
		  name="animate__animated animate__slideInLeft"
		  enter-active-class="animate__slideInRight"
		  leave-active-class="animate__slideOutRight"
			>
			<view v-if="cartInfo" class='content' v-show="currentTab===2" >
				<goods-card v-for="book in bookInfo.like_goods" @click.native="toUrl('/pages/goods/show?id='+book.id)" class="item" :item="book"></goods-card>
			</view>
		</transition>
		<!-- 推荐商品 -->
		
		<!-- 购物车导航 -->
		<bottom-cart v-if="cartInfo.data && bookInfo.goods" :isCollect="flag"  :item="bookInfo.goods"></bottom-cart>
		<!-- 购物车导航 -->
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data(){
			return{
				tabs:[
					{name:'商品详情'},
					{name:'商品评论',
					count:0},
					{name:'推荐商品'},
				],
				commentList: [],
				currentTab:0,
				bookInfo:{},
				//#ifdef MP-WEIXIN
				bookDetails:{},
				cartInfo:{},
				//#endif
				flag:false,
				page:1
			}
		},
		async beforeMount(){
			if(this.$bus.userObj || this.$store.state.userObj.id){
				await this._initCollections()
				this._initCart()
			}else{
				this.cartInfo.data = []
			}
		},
		onLoad(e) {
			this._initBookDetails(e.id)
			this.id = e.id
			this.page = e.page || 1
		},
		computed:{
			//#ifndef MP-WEIXIN
			...mapState(['bookDetails','cartInfo']),
			//#endif
		
		},
		methods:{
			async _initCollections(){
				await this.$u.get('/api/collects',{page:this.page}).then(res=>{},err=>{
					err.data.forEach(c=>{
						if(this.flag)return
						if(c.goods_id===Number(this.id)){
							this.flag = true
						}
					})
				})
			},
			toUrl(url){
				this.$u.route({
					type:"redirectTo",
					url
				})
			},
			async _initBookDetails(id){
				//#ifndef MP-WEIXIN
				const result = await this.$store.dispatch('getBookDetails',id)
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get(`/api/goods/${id}`).then(res=>{},err=>{
					this.bookDetails = err
					this.$bus.bookInfo = err
				})
				//#endif
				this.bookInfo = this.bookDetails
				const {goods} = this.bookInfo
				goods.comments.forEach(comment=>{
					const commentObj ={
						name:comment.user.name,
						contentText:comment.content,
						url:comment.user.avatar_url,
						id: comment.user_id,
						date:comment.created_at,
					}
					this.commentList.push(commentObj)
				})
				this.tabs[1].count = goods.comments.length
			},
			sortChange(index){
				this.currentTab = Number(index)
				this.toCategory(index)
			},
			toCategory(index){
				this.$u.route({
					url:'pages/index/index'
				})
			},
			async _initCart(){
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('getCart')
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get('/api/carts',{include:'goods'}).then(res=>{},err=>{
					this.cartInfo = err
					this.$bus.cartInfo = err
				})
				//#endif
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';
	.comment {
		display: flex;
		padding: 30rpx;
		position:absolute;
		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				.name {
					color: #5677fc;
				}
				.like {
					display: flex;
					align-items: center;
					color: #9a9a9a;
					font-size: 26rpx;
					.num {
						margin-right: 4rpx;
						color: #9a9a9a;
					}
				}
				.highlight {
					color: #5677fc;
					.num {
						color: #5677fc;
					}
				}
			}
			.content {
				margin-bottom: 10rpx;
			}
			.reply-box {
				background-color: rgb(242, 242, 242);
				border-radius: 12rpx;
				.item {
					padding: 20rpx;
					border-bottom: solid 2rpx $u-border-color;
					.username {
						font-size: 24rpx;
						color: #999999;
					}
				}
				.all-reply {
					padding: 20rpx;
					display: flex;
					color: #5677fc;
					align-items: center;
					.more {
						margin-left: 6rpx;
					}
				}
			}
			.bottom {
				margin-top: 20rpx;
				display: flex;
				font-size: 24rpx;
				color: #9a9a9a;
				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}
			}
		}
	}
	.content{
		display:flex;
		flex-wrap: wrap;
		background-color: whitesmoke;
		.item{
			flex: 48%;
			margin-bottom: 2%;;
			background-color: white;
			box-shadow: 0px 1px 4px rgba(0,0,0,.4);
		}
		.item:nth-of-type(2n){
			margin-left: 2%;
		}
	}
	.parse{
		    display: flex;
		    align-items: center;
		    flex-direction: column;
			padding:10px;
			box-sizing:border-box;
			font-size:15px;
	}
</style>

