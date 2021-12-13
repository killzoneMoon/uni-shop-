<template>
	<transition 	appear
		  name="animate__animated animate__slideInLeft"
		  enter-active-class="animate__slideInDown"
		  leave-active-class="animate__slideOutRight"
		  >
		<view>
			<view class="wrap u-skeleton">
				<u-swiper class="u-skeleton-rect u-swiper-wrap" width="15rem"  :list="imgList"></u-swiper>
				<u-tabs  
				class="tabs u-skeleton-rect"
				@change="sortChange" 
				:current="currentTab" 
				bar-height="6" 
				bar-width="40" 
				active-color="#2979ff" 
				:list="sortList"
				></u-tabs>
				<view class="goods wrapper">
					<view class="content " >
						<view @click="toUrl('pages/goods/show?id='+book.id)" class="item u-skeleton-rect"  v-for="book in books">
							<goods-card :loading="loading" :item='book' ></goods-card>
						</view>
						<u-loadmore class="loadmore" :status="status" />
					</view>
				</view>
			</view>
			<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		</view>
	</transition>
</template>

	
<script>
	import {mapState} from 'vuex'
	export default {
		name:"index",
		data() {
			return {
				imgList: [],
				sortList:[
				{name:'默认',},
				{name:'销量',},
				{name:'推荐',},
				{name:'最新',}
				],
				currentTab:0,
				books:[{},{},{},{},{},{},{},{}],
				page:1,
				status: 'loadmore',
				loading:true,
			}
		},
		beforeMount(){
			this.$nextTick(function(){
				this._initCentreShop()
			})
			//#ifdef MP-WEIXIN
			this.__proto__.__proto__.$bus = this.__proto__
			//#endif
		},
		mounted(){
			if(this.$bus.nomore)return
			this.$u.utils.isLogin()
		},
		onLoad(){
			// #ifndef MP-WEIXIN
			const page = getCurrentPages().pop()
			const {options,route} = page
			const optionsKeys = Object.keys(options)
			let params = ''
			if(optionsKeys.length){
				params = optionsKeys.reduce((total,current)=>{
					return `${total}${current}=${options[current]}&`
				},"?")
				params = params.slice(0,-1)
			}
			localStorage.setItem('back_url',route+params)
			// #endif
		},
		computed:{
			// #ifndef MP-WEIXIN
			...mapState(['centreShop']),
			// #endif
		},
		methods:{
			toUrl(url){
				this.$u.route({
					url
				})
			},
			async _initCentreShop(index=0,clicked=false){
				const {page} = this
				
				let params = {
					page,
					sales:0,
					recommend:0,
					new:0,
				}
				
				
			
				
				//判断排序类别
				if(index===1)params.sales = 1
				if(index===2)params.recommend = 1
				if(index===3)params.new = 1
			
			
			
			// #ifdef MP-WEIXIN
				this.$u.get( 'https://api.shop.eduwork.cn/api/index',params).then(res=>{},err=>{
					let {slides,goods} = err
					this.imgList = []
					slides.forEach((pic)=>{
						this.imgList.push(pic.img_url)
					})	
					if(page===1){
						this.books = []
					}
					goods.data.forEach(b=>{
						this.books.push(b)
					})
					this.loading = false
				})
			// #endif
			
				
				// #ifndef MP-WEIXIN
				//处理除默认外的其他排序出现多页展示的情况
				if(page!==1 && clicked){
					for(let i = 1; i<=page ; i++){
						params.page = i
						await this.$store.dispatch('getCentreShop',params)
					}
				}else{
					await this.$store.dispatch('getCentreShop',params)
				}
				//将vuex state 里面的数据放入组件的属性中
				if(this.centreShop.slides){
					const {slides,goods} = this.centreShop
					this.imgList = []
					slides.forEach((pic)=>{
						this.imgList.push(pic.img_url)
					})	
					
					this.books = goods.data
				}
				if(this.loading){
					this.loading = false
				}
				// #endif
			},
			sortChange(index,){
				this.currentTab = index
				this.page = 1
				this._initCentreShop(index,true)
			},
		},
		onReachBottom(){
			if(this.page>5){
				this.status = 'nomore'
			}else{
				this.status = 'loading'
				this.page += 1
				this._initCentreShop(this.currentTab)
			}
		},
		watch:{
			books:{
				handler(){
					this.status = 'loadmore'
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	// #ifdef MP-WEIXIN 
	.u-image{
		    width: 100px;
		    margin: 0 30%;
		    height: 130px;
	}
	// #endif
	.loadmore{
		    position: absolute;
		    left: 34%;
		   bottom: 155px;
	}
	.wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.u-swiper-wrap{
			height: 10%;
			width: 15rem;
		}
		.goods{
			width: 100%;
			height: 16.3rem;
			margin: 0;
			padding: 0;
			transform: none;
			position:relative;
			white-space:nowrap;
			.content{
				display:inline-block;
			    background-color: whitesmoke;
			    padding: 0 3px;
			    box-sizing: border-box;
			    flex-wrap: wrap;
				width:100%;
				padding-bottom:200px;
				position: absolute;
				.item{
					    margin-bottom: 10px;
					    display: inline-block;
					    width: calc(50% - 5px);
					    box-sizing: border-box;
					    background-color: white;
					    box-shadow: 0px 3px 3px rgba(0,0,0,.4);
					    float: left;
				}
				.item:nth-of-type(2n){
					margin-left:10px;
				}
				.u-load-more-wrap{
					    position: absolute;
					    bottom: 25px;
						margin-left: 50%;
						transform:translateX(-50%);
						margin-bottom:140px!important;
				}
			}
		}
	}

</style>
