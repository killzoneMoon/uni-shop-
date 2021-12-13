// #ifndef MP-WEIXIN
import ajax from './ajax'

const BASE_URL = 'https://api.shop.eduwork.cn'

export const reqCentreShop = (params)=>ajax(`${BASE_URL}/api/index`,params)

export const reqUser = (token,params)=>ajax(`${BASE_URL}/api/user`,params,params?'PUT':"GET",{Authorization:token.token_type + " " +token.access_token})

export const reqLogin = (params)=>ajax(`${BASE_URL}/api/auth/login`,params,'POST')

export const reqGoodsRecieve = ()=>ajax(`${BASE_URL}/api/orders/1/confirm`,{},'PATCH',headers)

export const reqRegister = (params)=>ajax(`${BASE_URL}/api/auth/register`,params,'POST')

export const reqLogOut = (token)=>ajax(`${BASE_URL}/api/auth/logout`,{},'POST',{Authorization:token.token_type+" "+token.access_token})

export const reqUpdateAvatar = (token,params)=>ajax(`${BASE_URL}/api/user/avatar`,params,'PATCH',{Authorization:token.token_type+" "+token.access_token})

export const reqOssToken = (token)=>ajax(`${BASE_URL}/api/auth/oss/token`,{},'GET',{Authorization:token.token_type+" "+token.access_token})

export const reqBookDetails = (id)=>ajax(`${BASE_URL}/api/goods/${id}`)

export const reqSwitchCollectBook = (token,id)=>ajax(`${BASE_URL}/api/collects/goods/${id}`,{},"POST",{Authorization:token.token_type+" "+token.access_token})

export const reqAddCart = (token,params)=>ajax(`${BASE_URL}/api/carts`,params,"POST",{Authorization:token.token_type+" "+token.access_token})

export const reqCart = (token,params)=>ajax(`${BASE_URL}/api/carts`,params,"GET",{Authorization:token.token_type+" "+token.access_token})

export const reqGoods = (params={})=>ajax(`${BASE_URL}/api/goods?`,params,"GET")

export const reqCheckCartItem = (token,params)=>ajax(`${BASE_URL}/api/carts/checked`,params,"PATCH",{Authorization:token.token_type+" "+token.access_token})

export const reqDeleteCartItem = (token,params)=>ajax(`${BASE_URL}/api/carts/${params.cart}`,{},"DELETE",{Authorization:token.token_type+" "+token.access_token})

export const reqChangeCartItemCount = (token,cart,num)=>ajax(`${BASE_URL}/api/carts/${cart}`,{num},"PUT",{Authorization:token.token_type+" "+token.access_token})

export const reqOrdersPreview = (token)=>ajax(`${BASE_URL}/api/orders/preview`,{},"GET",{Authorization:token.token_type+" "+token.access_token})

export const reqAddresses = (token)=>ajax(`${BASE_URL}/api/address`,{},"GET",{Authorization:token.token_type+" "+token.access_token})

export const reqQrcode = (token,order,type="aliyun")=>ajax(`${BASE_URL}/api/orders/${order}/pay`,{type},"GET",{Authorization:token.token_type+" "+token.access_token})

export const reqCreateOrder = (token,params)=>ajax(`${BASE_URL}/api/orders`,params,"POST",{Authorization:token.token_type+" "+token.access_token})

export const reqAddNewAddress = (token,params)=>ajax(`${BASE_URL}/api/address`,params,"POST",{Authorization:token.token_type+" "+token.access_token})

export const reqOrderDetails = (token,order)=>ajax(`${BASE_URL}/api/orders/${order}?include=goods,orderDetails.goods,address`,{},"GET",{Authorization:token.token_type+" "+token.access_token})

export const reqOrderList = (token,params)=>ajax(`${BASE_URL}/api/orders`,params,"GET",{Authorization:token.token_type+" "+token.access_token})

//循环请求status的api,直到返回结果变化或停止支付时终止定时器
export const reqStatus = (token,order)=>ajax(`${BASE_URL}/api/orders/${order}/status`,{},"GET",{Authorization:token.token_type+" "+token.access_token})

// 发送货物api为后台api,需要使用super@a.com 123123 账户发送请求
export const reqSendOut = (token,order,params)=>ajax(`${BASE_URL}/api/admin/orders/${order}/post`,params,"PATCH",{Authorization:token.token_type+" "+token.access_token})

export const reqDeliveryInfo = (token,order)=>ajax(`${BASE_URL}/api/orders/${order}/express`,{},"PATCH",{Authorization:token.token_type+" "+token.access_token})

export const reqAddressDetail = (token,address)=>ajax(`${BASE_URL}/api/address/${address}`,{},"GET",{Authorization:token.token_type+" "+token.access_token})

export const reqSetDefaultAddress = (token,address)=>ajax(`${BASE_URL}/api/address/${address}/default`,{},"PATCH",{Authorization:token.token_type+" "+token.access_token})

export const reqAlterAddress = (token,params,address)=>ajax(`${BASE_URL}/api/address/${address}`,params,"PUT",{Authorization:token.token_type+" "+token.access_token})

export const reqDeleteAddress = (token,address)=>ajax(`${BASE_URL}/api/address/${address}`,{},"DELETE",{Authorization:token.token_type+" "+token.access_token})

export const reqCollection = (token,params)=>ajax(`${BASE_URL}/api/collects`,params,"GET",{Authorization:token.token_type+" "+token.access_token})
// #endif

