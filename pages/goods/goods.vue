<template>
	<transition 	appear
		  name="animate__animated animate__slideInLeft"
		  enter-active-class="animate__slideInDown"
		  leave-active-class="animate__slideOutRight"
		  >
	<view class="u-wrap"  v-if="tabbar.length">
		<view class="u-search-box">
			<u-search  v-model="keyword" class="u-search-text" @custom="searchItem" @clear="clearSearch" @keydown.enter.native="searchItem"></u-search>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view class="tabWrapper" v-for="(item,index) in tabbar">
					<view v-for="(child,index1) in item.children" :key="index1" class="u-tab-item" :class="[currentTab==index+'-'+index1 ? 'u-tab-item-active' : '']"
					 :data-current="0" @tap.stop="swichMenu(index+'-'+index1,index)">
						<text class="u-line-1">{{child.name}}</text>
					</view>
				</view>
			</scroll-view>
			
			<view class="wrapperMine">
				<view style="height:100%;overflow: scroll;" v-if="showEmpty">
					<u-empty key='1' style="height:72%"  text="暂无数据,看看下方推荐吧" ></u-empty>
					<block key='2' class="u-p-b-140 u-p-t-40" v-for="(item,index) in tabbar" :key="index">
						<scroll-view 
						:refresher-triggered="refresherTriggered"
						@refresherrefresh="bottomRefresh"
						@scrolltolower="changeRefresherTrigger"
						scroll-y="true" class="mineScroll scroll-Y" v-if="current==index" 
						>
							<view class="page-view">
								<view class="class-item">
									<view class="item-container">
										<view @click="toUrl('pages/goods/show?id='+item1.id)" class="thumb-box" v-for="(item1, index1) in item.foods" :key="index1">
											<image class="item-menu-image" :src="item1.cover_url" mode=""></image>
											<view class="item-menu-name">{{item1.title}}</view>
										</view>
									</view>
								</view>
							</view>
							<u-loadmore :status="loading" style="
								transform: translateY(-25px);
							"
							v-if="$store.state.goods.goods.data.length"></u-loadmore>
						</scroll-view>
					</block>
				</view>
				<block v-else key='2' class="u-p-b-140 u-p-t-40" v-for="(item,index) in tabbar" :key="index">
					<scroll-view 
					@scrolltolower="bottomRefresh"
					scroll-y="true" class="mineScroll scroll-Y" v-if="current==index" 
					>
						<view class="page-view">
							<view class="class-item">
								<view class="item-container">
									<view @click="toUrl('pages/goods/show?id='+item1.id)" class="thumb-box" v-for="(item1, index1) in item.foods" :key="index1">
										<image class="item-menu-image" :src="item1.cover_url" mode=""></image>
										<view class="item-menu-name">{{item1.title}}</view>
									</view>
								</view>
							</view>
						</view>
						<u-loadmore :status="loading" style="
							transform: translateY(-25px);
						"
						v-if="showLoadmore"></u-loadmore>
					</scroll-view>
				</block>
			</view>
		</view>
	</view>
	</transition>
</template>

<script>
	export default {
		data() {
			return {
				refresherTriggered:false,
				tabbar: [],
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				currentTab:'0-0',//使用currenttab代表当前选中的标签,current用来对应右侧的content区域显示对应的item
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				keyword:'',//搜索商品使用的名称
				page:1,
				recommend:0,
				sales:0,
				price:0,
				comments_count:0,
				loading:'loadmore',
				currentCategory:'区块链',
				showEmpty:false,
				showLoadmore:true,
			}
		},
		beforeMount(){
			this.$nextTick(function(){
				this._initGoods({
					title:this.currentCategory
				})
			})
		},
		methods: {
			changeRefresherTrigger(){
				this.refresherTriggered = true
				this.$nextTick(function(){
					this.refresherTriggered = false
				})
			},
			async bottomRefresh(){
				if(!this.showLoadmore)return
				if(this.tabbar[this.current].foods.length%10!==0){
					this.loading = 'nomore'
					return
				}
				let {sales,price,comments_count,keyword,_initGoods,currentCategory,currentTab} = this
				this.loading = 'loading'
				if(this.page<=5){
					this.page ++
				}else{
					this.loading = 'nomore'
					return
				}
				this.params = {
					title:currentTab==='-1-0'?keyword:currentCategory,
					page:this.page,
					sales,
					price,
					comments_count
				}
				await _initGoods(this.params)
				this.loading = 'loadmore'
			},
			clearSearch(){
				this.params = {
					title:'',
					page:1
				}
				this._initGoods(this.params)
			},
			searchItem(){
				this.tabbar[this.current].foods = []
				//当搜索时件currenttab改成不合理的数字,进而把标签的高亮效果移除
				if(this.currentTab!=='-1-0')this.currentTab='-1-0'
				this.params = {
					title:this.keyword
				}
				this._initGoods(this.params)
			},
			toUrl(url){
				this.$u.route({
					url
				})
			},
			async _initGoods(params={}){
				let goods
				// #ifndef MP-WEIXIN
				await this.$store.dispatch('getGoods',params)
				goods = this.$store.state.goods || {}
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get('/api/goods',params).then(res=>{},err=>{
					goods = err
					if(goods.goods.data.length){
						this.showLoadmore = true
					}else{
						this.showLoadmore = false
					}
				})
				//#endif
				
				// 遍历得到的分类结果并肩其添加到tabbar中
				if(this.tabbar.length === 0){
									
					goods.categories.forEach(c=>{
						c.foods = []
						this.tabbar.push(c)
					})
				}
				//b代表每一本书,遍历每一本书并添加到this.tabbar中的foods属性
				if(this.page===1){
					this.tabbar[this.current].foods = []
				}
				goods.goods.data.forEach(b=>{
					this.tabbar[this.current].foods.push(b)
				})
				if(!goods.goods.data.length){
					if(!this.showEmpty)this.showEmpty = true
					
					this.tabbar[this.current].foods = []
					goods.recommend_goods.forEach(b=>{
						this.tabbar[this.current].foods.push(b)
					})
				}else{
					if(this.showEmpty)this.showEmpty = false
				}
				
				this.current--
				this.current++
				
			},
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 点击左边的栏目切换
			async swichMenu(index,currentIndex) {
				if(index == this.currentTab) return ;
				if(this.page!==1)this.page = 1
				if(this.loading!=="loadmore")this.loading='loadmore'
				this.currentTab = index;
				this.current = currentIndex
				// 如果为0，意味着尚未初始化
				if(this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
				
				//使点击标签的时候出现与之对应的item
				const localmotive = parseInt(index.split('-')[0])
				const caboose = parseInt(index.split('-')[1])
				const params = {
					title:this.tabbar[localmotive].children[caboose].name,
					page:this.page
				}
				this.currentCategory = params.title
				this._initGoods(params)
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';
	.mineScroll{
		height: 100%;
	}
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top) - 50px);
		/* #endif */
		display: flex;
		flex-direction: column;
	}
	
	.u-search-box {
		padding: 18rpx 30rpx;
	}
	.uni-scroll-view-content{
	}

	.u-menu-wrap {
	    display: flex;
	    height: calc(100% );
	}
	.wrapperMine{
		    height: 92%;
			// overflow: scroll;
			width:75%;
			.u-loadmore-wrap{
				    background-color: transparent;
				    margin-bottom: 0px;
				    margin-top: 0px;
				    height: auto;
				    margin-left: 50%;
				    transform: translateX(-50%);
				    width: auto;
				    padding: 0 10px;
			}
	}
	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 25%;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	
	.page-view {
		padding: 16rpx;
	}
	
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}
	
	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}
	
	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
	}
	
	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
		height: 8rem;
		flex: 49%;
		    border-radius: 5px;
		    box-shadow: 2px 2px 4px rgba(0,0,0,.1);
	}.thumb-box:nth-of-type(2n){
		margin-left: 2%;
	}
	
	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
</style>
