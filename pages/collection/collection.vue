<template>
	<view>
		<u-empty text="数据为空" v-if="!collects.length" mode="favor"></u-empty>
		<view class="wrap" v-else>
			<view class="content">
				<view class="item-wrap" @click="toUrl('pages/goods/show?id='+item.goods.id+'&page='+item.current_page)" v-for="item in collects">
					<goods-card :item="item.goods" :showSales="false"></goods-card>
					<view class="remove" @click.stop="removeCollection(item.goods.id)">移除</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name:"collection",
		beforeMount(){
			this._initCollections()
		},
		onReachBottom() {
			if(this.collections.meta.pagination.total-this.collects.length>0){
				this.page++
				this._initCollections()
			}
		},
		onShow(){
			//#ifdef MP-WEIXIN
			if(this.$bus.collections){
				this.collections = this.$bus.collections
				this.collects = this.collections.data
			}
			//#endif
		},
		data(){
			return{
				collections:{},
				collects:[],
				page:1
			}
		},
		methods:{
			toUrl(url){
				this.$u.route({
					url
				})
			},
			async _initCollections(){
				const params = {
					page:this.page
				}
				//#ifndef MP-WEIXIN
				
				await this.$store.dispatch('getCollections',params).then(res=>{
					this.collections = this.$store.state.collections
				})
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get('/api/collects',params).then(res=>{},err=>{
					this.$bus.collections = err
					this.collections = err
				})
				//#endif
				if(this.page===1)this.collects = []
				this.collections.data.forEach(c=>{
					c.current_page = this.collections.meta.pagination.current_page
					this.collects.push(c)
				})
			},
			async removeCollection(id){
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('switchCollectBook',{token:this.$store.state.loginInfo,id:id})
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.post(`/api/collects/goods/${id}`,{}).then(res=>{},err=>{
					this.collects.forEach(c=>{
						if(c.goods.id===id){
							this.collects.splice(this.collects.indexOf(c),1)
							this.$bus.collections.data.splice(this.collects.indexOf(c),1)
						}
					})
				})
				//#endif
				uni.showToast({
					title:"已取消收藏",
					icon:"none"
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	uni-page-body{
		height:100%;
	}

	.wrap{
		height: 100%;
		.content{
			height:100%;
			display:flex;
			flex-wrap: wrap;
			.item-wrap{
				position:relative;
				    flex: 44.5%;
					width:44.5%;
				    border-radius: 5px;
				    box-shadow: 1px 1px 4px rgba(0,0,0,.2);
				    margin-bottom: 5%;
					.remove{
						      font-size: 13px;
						      background: crimson;
						      color: white;
						      display: inline-block;
						      position: absolute;
						      right: 14%;
						      padding: 1px 5px;
						      border-radius: 4px;
						      bottom: 8%;
					}
			}
			.item-wrap:nth-of-type(2n){
				margin-left: 5%;
			}
		}
	}
</style>