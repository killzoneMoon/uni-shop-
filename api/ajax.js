import axios from 'axios'
export default function ajax(url,params={},type="GET",headers={}){
        const reqAxios = function(type){
            type = type.toLowerCase()
		   return axios({
		       url,
		       params,
		       headers,
		       method:type
		   })
        }
        return new Promise((res,rej)=>{
        let promise
        promise = reqAxios(type)
        promise.then(response=>{
            res(response.data)
        },error=>{
            switch (error.response ? error.response.status : error) {
                case 400:
                    uni.showToast({
                        title:"服务器出现问题了,请稍后重试",
                        icon:"error",
                        duration:3000
                    })
                    break;
                case 401:
				let keys = Object.keys(error.response.data)
				console.log(error.response.data[keys[0]])
                    uni.showToast({
                        title:error.response.data[keys[0]],
                        icon:"error",
                        duration:3000
                    })
                    break;
                case 422:
				keys = Object.keys(error.response.data.errors)
					const title = error.response.data.errors[keys[0]][0]
                    uni.showToast({
                        title,
                        icon:"error",
                        duration:3000
                    })
                    break;
                default:
					uni.showToast({
						title:error,
						icon:"error",
						duration:3000
					})
                    break;
            }
            rej(error)
        })
    })
}