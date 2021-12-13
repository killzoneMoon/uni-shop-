		
	
const install = (Vue,vm)=>{
	const isLogin = async()=>{
		let userToken
		let userObj
		//#ifdef MP-WEIXIN
		userObj = JSON.parse(uni.getStorageSync('uni-shop-userObj') || '{}')
		//#endif
		// #ifndef MP-WEIXIN
		userObj = JSON.parse(localStorage.getItem('uni-shop-userObj')  || '{}')
		//#endif
		if(userObj.id){
			// #ifndef MP-WEIXIN
		userToken = JSON.parse(localStorage.getItem('uni-shop-userToken')  || '{}')
		const userInfo = await vm.$store.dispatch('getUser',{token:userToken}).then(res=>{},rej=>{
				vm.$u.toast('您的账号已过期,请重新登录')
				setTimeout(()=>{
					vm.$u.route({
						type:"redirectTo",
						url: 'pages/auth/login',
					})
				},1000)
			})
			//#endif
			//#ifdef MP-WEIXIN
			vm.$bus.userToken = JSON.parse(uni.getStorageSync('uni-shop-userToken'))
			await vm.$u.get('/api/user',{},{
				Authorization:vm.$bus.userToken.token_type+" "+vm.$bus.userToken.access_token
			}).then(res=>{},err=>{
					if(!err.name){
						vm.$u.toast('您的账号已过期,请重新登录')
						setTimeout(()=>{
							vm.$u.route({
								type:"redirectTo",
								url: 'pages/auth/login',
							})
						},1000)
					}else{
						vm.$bus.userObj = JSON.parse(uni.getStorageSync('uni-shop-userObj') || '{}')
						vm.$bus.userToken = JSON.parse(uni.getStorageSync('uni-shop-userToken') || '{}')
						vm.$u.http.interceptor.request = (config) => {
							config.header.Authorization = vm.$bus.userToken.token_type+" "+vm.$bus.userToken.access_token
							if(config.url == '/api/auth/login') config.header.noToken = true;
							return config;
						}
					}
				})
				vm.$bus.history = (getCurrentPages()[0] || {}).route
				return true
				//#endif
		}else{
			vm.$u.toast('请登录')
			if(!vm.$bus.nomore){
				vm.$bus.nomore = true
				setTimeout(()=>{
					vm.$u.route({
						type:"redirectTo",
						url: 'pages/auth/passwordLogin',
					})
				},1000)
			}
			return false
		}
	}
	vm.$u.login = ({password,email})=>{
		return vm.$u.post('/api/auth/login',{email,password}).then(res=>{},err=>{
			uni.setStorageSync('uni-shop-userToken',err)
			//#ifndef MP-WEIXIN
			vm.$store.state.loginInfo = err
			localStorage.setItem('uni-shop-userToken',JSON.stringify(err))
			//#endif
			
			vm.$bus.userToken = err
			vm.$u.get('/api/user',{},{
				Authorization:err.token_type+" "+err.access_token
			}).then(res=>{},err=>{
				//#ifndef MP-WEIXIN
				vm.$store.state.userObj = err
				localStorage.setItem('uni-shop-userObj',err)
				//#endif
				vm.userObj = err				
				vm.$bus.userObj = err				
				uni.setStorageSync('uni-shop-userObj',err)
			})
		})
		
		
		
	}
	vm.$u.utils = {
		isLogin
	}
}


export default {
	install
}