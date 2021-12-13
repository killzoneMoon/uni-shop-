import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import {
    reqCentreShop,
    reqUser,
    reqLogin,
    reqGoodsRecieve,
	reqRegister,
	reqLogOut,
	reqUpdateAvatar,
	reqOssToken,
	reqBookDetails,
	reqSwitchCollectBook,
	reqAddCart,
	reqCart,
	reqGoods,
	reqCheckCartItem,
	reqDeleteCartItem,
	reqChangeCartItemCount,
	reqOrdersPreview,
	reqAddresses,
	reqQrcode,
	reqCreateOrder,
	reqAddNewAddress,
	reqOrderDetails,
	reqOrderList,
	reqStatus,
	reqSendOut,
	reqDeliveryInfo,
	reqAddressDetail,
	reqSetDefaultAddress,
	reqAlterAddress,
	reqDeleteAddress,
	reqCollection
    } from '../api/index'
import {
    SETCENTRESHOP,
    SETUSER,
	SETLOGININFO,
	REMOVEUSERINFO,
	SETBOOKDETAILS,
	SETCART,
	SETGOODS,
	SETORDERSPREVIEW,
	SETADDRESSES,
	SETORDERINFO
} from './mutationType'

const store = new Vuex.Store({
    actions:{
        async getCentreShop(context,params){
            const result = await reqCentreShop(params)
            if(result.slides.length){
                context.commit(SETCENTRESHOP,{result,params})
            }
        },
        async getUser(context,{token,params}){
            const result = await reqUser(token,params)
            if(result.id){
				localStorage.setItem('uni-shop-userObj',JSON.stringify(result))
                context.commit(SETUSER,{result})
            }
        },
        async getLogin(context,params){
            const result = await reqLogin(params)
			context.commit(SETLOGININFO,{result})
			context.dispatch('getUser',{token:result})
        },
        async getGoodsRecieve(context){
            const result = await reqGoodsRecieve()
        },
		async getRegister(context,params){
			const result = await reqRegister(params)
			if(result===''){
				uni.showToast({
					title:"注册成功",
					icon:"success",
					duration:2000
				})
				context.dispatch('getLogin',params)
			}
		},
		async logOut(context,token){
			await reqLogOut(token)
			// #ifndef MP-WEIXIN
			localStorage.removeItem("uni-shop-userObj")
			localStorage.removeItem("uni-shop-userToken")
			// #endif
			context.commit(REMOVEUSERINFO)
		},
		async updateAvatar(context,{token,params}){
			await reqUpdateAvatar(token,params)
		},
		async getOssToken(context,token){
		 const result = await reqOssToken(token)
			context.commit('setOssToken',result)
		},
		async getBookDetails(context,id){
			const result = await reqBookDetails(id)
			context.commit(SETBOOKDETAILS,result)
		},
		async switchCollectBook(context,{token,id}){
			await reqSwitchCollectBook(token,id)
		},
		async addToCart(context,{token,goods_id,num=1}){
			const params = {
				goods_id,
				num
			}
			await reqAddCart(token,params).then(res=>{},rej=>{
				uni.showToast({
					title:"加入失败",
					type:"error",
				})
				return false
			})
			await context.dispatch('getCart')
			await reqChangeCartItemCount(token,context.state.cartInfo.data[0].id,params.num)
			return true
		},
		async getCart(context){
			const {loginInfo} = context.state
			const params = {
				include:'goods'
			}
			const result = await reqCart(loginInfo,params)
			context.commit(SETCART,result)
		},
		async getGoods(context,params){
			const result = await reqGoods(params)
			context.commit(SETGOODS,result)
		},
		async checkCartItem(context,{token,params}){
			await reqCheckCartItem(token,params)
		},
		async deleteCartItem(context,{token,params}){
			await reqDeleteCartItem(token,params)
		},
		async changeCartItemCount(context,{token,params}){
			await reqChangeCartItemCount(token,params.cart,params.num)
		},
		async getOrdersPreview(context){
			const result = await reqOrdersPreview(context.state.loginInfo)
			if(result.carts){
				context.commit(SETORDERSPREVIEW,result)
			}
		},
		async getAddresses(context){
			const result = await reqAddresses(context.state.loginInfo)
			if(result.data){
				context.commit(SETADDRESSES,result)
			}
		},
		async getQrcode(context,id){
			const result = await reqQrcode(context.state.loginInfo,id)
			context.commit('setQrcode',result)
		},
		async CreateOrder(context,address_id){
			const params = {
				address_id
			}
			const result = await reqCreateOrder(context.state.loginInfo,params)
			context.commit(SETORDERINFO,result)
		},
		async addNewAddress(context,params){
			const result = await reqAddNewAddress(context.state.loginInfo,params)
		},
		//得到订单列表中其中一个订单的详情信息
		async getOrderDetails(context,id){
			return await reqOrderDetails(context.state.loginInfo,id).then(res=>{
				if(res){
					return res
				}
			},err=>{
				uni.showToast({
					title:"订单地址不存在",
					icon:"none"
				})
				setTimeout(()=>{
					uni.navigateBack({})
				},1000)
			})
		},
		async getOrderList(context,params){
			const result = await 	reqOrderList(context.state.loginInfo,params).then(res=>{return res},err=>{return err})
			context.commit('setOrderList',result)
		},
		async getStatus(context,id){
			return await 	reqStatus(context.state.loginInfo,id)
		},
		async sendOut(context,order,params){
			await reqSendOut(context.state.loginInfo,order,params)
		},
		async getDeliveryInfo(context,order){
			const result = await reqDeliveryInfo(context.state.loginInfo,order)
		},
		async getAddressDetail(context,id){
			return await reqAddressDetail(context.state.loginInfo,id)
		},
		async setDefaultAddress(context,address){
			return await reqSetDefaultAddress(context.state.loginInfo,address)
		},
		async alterAddress(context,{address,params}){
			await reqAlterAddress(context.state.loginInfo,params,address)
		},
		async deleteAddress(context,id){
			await reqDeleteAddress(context.state.loginInfo,id)
		},
		async getCollections(context,params){
			const result = await reqCollection(context.state.loginInfo,params)
			context.commit('setCollections',result)
		},
	},
    mutations:{
		setCollections(state,result){
			state.collections = result
		},
		setOrderList(state,result){
			state.orderList = result
		},
        [SETCENTRESHOP](state,{result,params}){
			if(params.page!==1){
				state.centreShop.goods.data = state.centreShop.goods.data.concat(result.goods.data)
			}else{
				state.centreShop = result
			}
        },
        [SETUSER](state,{result}){
            state.userObj = result
        },
		[SETLOGININFO](state,{result}){
			state.loginInfo = result
			//  #ifndef MP-WEIXIN
			localStorage.setItem('uni-shop-userToken',JSON.stringify(result))
			// #endif
		},
		[REMOVEUSERINFO](state){
			state.userObj = {}
			state.loginInfo = {}
		},
		setOssToken(state,result){
			state.ossToken = result
		},
		[SETBOOKDETAILS](state,result){
			state.bookDetails = result
		},
		[SETCART](state,result){
			state.cartInfo = result
		},
		[SETGOODS](state,result){
			state.goods = result
		},
		[SETORDERSPREVIEW](state,result){
			state.ordersPreview = result
		},
		[SETADDRESSES](state,result){
			state.addresses = result.data
		},
		[SETORDERINFO](state,result){
			state.orderInfo = result
		},
		setQrcode(state,result){
			state.Qrcode = result
		}
    },
    state:{
        centreShop:{},
		Qrcode:{},
        // #ifndef MP-WEIXIN
        userObj:JSON.parse(localStorage.getItem('uni-shop-userObj')  || '{}'),
        // #endif
        // #ifdef MP-WEIXIN
        userObj:{},
        // #endif
		// #ifndef MP-WEIXIN
		loginInfo:JSON.parse(localStorage.getItem('uni-shop-userToken') || '{}'),
		// #endif
		// #ifdef MP-WEIXIN
		loginInfo:{},
		// #endif
		ossToken:{},
		bookDetails:{},
		cartInfo:{},
		goods:{},
		ordersPreview:{},
		addresses:[],
		orderInfo:{},
		orderList:{},
		collections:{}
    }
})
export default store