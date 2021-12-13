<template>
<view>
	<u-swipe-action class="swipe" :index="index" 
	:disabled="prePage!=='pages/center/center'"
	v-if="addresses.length"
			v-for="addr,index in addresses" :key="addr.id"
			@click="swipeActionClick" @open="open"
			:options="options"
			btn-width="154"
		>
		<view class="phone-address" style="
		     border-bottom: 1px solid whitesmoke;
		     width: 100%;
		     padding: 0 10px;
		     box-sizing: border-box;
		     display: inline-block;
		     position: relative;
		"
		@click="setDefaultWhenPay(addr.id)"
		>
			<view style="
			width: 100%;
			display: inline-block;
			transform: translateY(48%);
				">
				<view style="font-size:16px;float:left">{{addr.phone}}</view>
				<view v-show="addr.is_default" style="
					padding: 1px 5px;
				    font-size: 14px;
				    float: left;
				    background: crimson;
				    border-radius: 3px;
				    color: white;
				    margin-left: 10px;
				">默认</view>
			</view>
			<view style="
				font-size: 15px;
				color:gray;
				transform: translateY(48%);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 13rem;"
			>{{addr.province+addr.city+addr.county+addr.address}}</view>
		<u-icon name="edit-pen"
		 @click.native.stop="toUrl('pages/orders/base-address?id='+addr.id)" 
		 style="
		    position: absolute;
		    top: 33%;
		    right: 5%;
		    font-size: 19px;
			"></u-icon>
			<view class="item u-border-bottom">
			</view>
		</view>
	</u-swipe-action>
	<u-empty text="地址为空" mode="address" v-if="!addresses.length"></u-empty>
	<view class="add-new-address" @click="toUrl('pages/orders/base-address')">+ 新建收货地址</view>
</view>
</template>

<script>
export default {
	name:"addresses",
	beforeMount(){
		this._initAddresses()
	},
	onLoad(e) {
		this.prePage = e.prePage
	},

	data(){
		return{
			disabled: false,
			btnWidth: 180,
			show: false,
			options: [
				{
					text: '设为默认',
					style: {
						backgroundColor: '#005500'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			addresses:[],
			prePage:"",
		}
	},
	onShow() {
		//#ifndef MP-WEIXIN
		this.addresses = this.$store.state.addresses
		//#endif
		//#ifdef MP-WEIXIN
		this.addresses = this.$bus.addresses.data
		//#endif
	},
	methods:{
		setDefaultWhenPay(id){
			if(this.prePage!=="pages/center/center"){
				this.setDefault(id)
			}
		},
		swipeActionClick(index,deleteAddress){
			const id = this.addresses[index].id
			if(deleteAddress){
				//#ifndef MP-WEIXIN
				if(!confirm('确定'))return
				//#endif
				this.deleteAddress(id)
				this.addresses.splice(index,1)
			}else{
				if(this.addresses[index].is_default)return
				this.setDefault(id)
			}
		},
		deleteAddress(id){
			//#ifndef MP-WEIXIN
			this.$store.dispatch('deleteAddress',id).then(res=>{
				uni.showToast({
					title:"删除成功",
					icon:"none"
				})
			})
			//#endif
			//#ifdef MP-WEIXIN
			this.$u.delete(`/api/address/${id}`).then(res=>{},err=>{
				uni.showToast({
					title:"删除成功",
					icon:"none"
				})
			})
			//#endif
		},
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.addresses[index].show = true;
			this.addresses.map((val, idx) => {
				if(index != idx) this.addresses[idx].show = false;
			})
		},
		async _initAddresses(){
			//#ifndef MP-WEIXIN
			await this.$store.dispatch('getAddresses')
			this.addresses = this.$store.state.addresses
			//#endif
			//#ifdef MP-WEIXIN
			await this.$u.get('/api/address').then(res=>{},err=>{
				this.addresses = err.data
			})
			//#endif
		},
		async setDefault(id){
			//#ifndef MP-WEIXIN
			await this.$store.dispatch('setDefaultAddress',id)
			//#endif
			//#ifdef MP-WEIXIN
			await this.$u.patch(`/api/address/${id}/default`).then(res=>{},err=>{})
			//#endif
			uni.showToast({
				title:'默认设置完毕',
				icon:"none"
			})
			await this._initAddresses()
			if(this.prePage!=="pages/center/center"){
				this.toUrl('pages/preview/preview')
			}
		},
		toUrl(url){
			this.$u.route({
				url
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';
	.item {
			display: flex;
			padding: 20rpx;
		}
		
		image {
			width: 120rpx;
			flex: 0 0 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
			border-radius: 12rpx;
		}
		
		.title {
			text-align: left;
			font-size: 28rpx;
			color: $u-content-color;
		}
		.list-wrap{
			flex:1;
		}
		
	  .u-page {
	        padding: 0;
	    }
	
	    .u-demo-block__title {
	        padding: 10px 0 2px 15px;
	    }

	    .swipe-action {
	        &__content {
	             padding: 25rpx 0;
	    
	            &__text {
	                 font-size: 15px;
	                 color: $u-main-color;
	                 padding-left: 30rpx;
	             }
	        }
	    }
	.address{
		        display: flex;
		        width: 100%;
		        height: 2.3rem;
		        padding: 10px;
		        box-sizing: border-box;
		        position: relative;
		        border-bottom: 1px solid whitesmoke;
			.details{
				display: flex;
				flex-direction: column;
				height: 100%;
				flex: 1;
				.title{
					font-size: 14px;
					    color: gray;
				}
				.phone{
					font-size: 18px;
					float:left;
				}
				.default-sign{
					float: left;
					font-size: 12px;
					margin-top: 1%;
					padding: 1px 4px;
					border-radius: 11px;
					background: crimson;
					color: white;
				}
			}
			.pen{
				    position: absolute;
				    top: 38%;
				    right: 4%;
				    font-size: 19px;
			}
	}
	.add-new-address{
		position: fixed;
		    bottom: 10px;
		    font-size: 15px;
		    color: white;
		    background: crimson;
		    margin-left: 50%;
		    width: 80%;
		    transform: translateX(-50%);
		    padding: 10px 0;
		    text-align: center;
		    border-radius: 20px;
	}
	.u-swipe-del{
		transform:translateY(-13%);
	}
</style>
