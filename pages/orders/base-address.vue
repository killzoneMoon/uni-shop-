<template>
	<transition
	appear
	name="animate__animated animate__slideInLeft"
	enter-active-class="animate__flipInX"
	leave-active-class="animate__flipOutX"
	>
		<view>
			<u-form
						:model="form"
						labelPosition="left"
						:rules="rules"
						ref="uForm"
				>
					<u-form-item
							label="姓名"
							prop="name"
							borderBottom
							 required
					>
						<u-input
								v-model="form.name"
						></u-input>
					</u-form-item>
					<u-form-item
							label="城市"
							prop="locationStr"
							borderBottom
							 required
					>
						<u-input
								v-model="form.locationStr"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择城市"
								@click.native="openActionSheet"
								@click="openActionSheet"
						></u-input>
						<u-icon
								slot="right"
								name="arrow-right"
						></u-icon>
					</u-form-item>
					<u-form-item
							label="电话"
							prop="phone"
							borderBottom
							 required
					>
						<u-input
								v-model="form.phone"
								placeholder="电话"
						></u-input>
					</u-form-item>
						<u-form-item
								label="地址"
								prop="address"
								borderBottom
								 required
						>
							<u-input
							v-model="form.address"
							placeholder="详细地址"></u-input>
					</u-form-item >

					<u-form-item 
					v-show="showDefaultButton"
					labelWidth="70"
					label="默认"
					prop="is_default"
					borderBottom
					 required
					>
						<u-switch v-model="is_default" @change="changeDefault"></u-switch>
					</u-form-item>
				</u-form>
				
				<!-- 城市选择区 -->
					<!-- <view class="u-demo">
						<view class="u-demo-wrap">
							<view class="u-demo-area">
								<city-select v-model="value" @city-change="cityChange" @change="cityChange"></city-select>
							</view>
						</view>
					</view> -->
					<!-- 城市选择区 -->
				
				<!-- 我创建的城市选择去 -->
				<transition
				name="slide"
				>
					<view  v-show="value" class="mine-city-selector-mask">
						<view class="mine-city-selector">
							<view class="close-button" @click="closeActionSheet">x</view>
							<view class="content-wrap">
								<view class="content" style="display: flex;">
									<!-- 第一列,省 -->
									<scroll-view class="column" :scroll-y="true" style="height: 100%;width: 33%">
										<u-cell-group>
											<u-cell-item v-for="(item,index) in provinces" :title="item.label" :arrow="false" :index="index" :key="index"
											@click="provinceChange">
												<u-icon v-if="isChooseP&&province===index" slot="right-icon" size="34" name="checkbox-mark"></u-icon>
											</u-cell-item>
										</u-cell-group>
									</scroll-view>
									<!-- 第一列,省 -->
									
									<!-- 第二列,市 -->
									<scroll-view  class="column" :scroll-y="true" style="width:33%;height: 100%">
										<u-cell-group v-if="isChooseP">
											<u-cell-item v-for="(item,index) in citys" :title="item.label" :arrow="false" :index="index" :key="index"
											@click="cityChange">
												<u-icon v-if="isChooseC&&city===index" slot="right-icon" size="34" name="checkbox-mark"></u-icon>
											</u-cell-item>
										</u-cell-group>
									</scroll-view>
									<!-- 第二列,市 -->
									
									<!-- 第三列,区 -->
									<scroll-view  class="column" :scroll-y="true" style="height: 100%;width:33%">
										<u-cell-group v-if="isChooseC">
											<u-cell-item v-for="(item,index) in areas" :title="item.label" :arrow="false" :index="index" :key="index"
											@click="areaChange">
												<u-icon v-if="isChooseA&&area===index" slot="right-icon" size="34" name="checkbox-mark"></u-icon>
											</u-cell-item>
										</u-cell-group>
									</scroll-view>
									<!-- 第三列,区 -->
								</view>
							</view>
						</view>
					</view>
				</transition>
				<!-- 我创建的城市选择去 -->
				<u-button class="submit" @click="addNewAddress">
					提交
				</u-button>
		</view>
	</transition>
</template>

<script>
	import provinces from "uView UI已发布Sketch和Axure设计资源示例/uview-ui/libs/util/province.js";
	import citys from "uView UI已发布Sketch和Axure设计资源示例/uview-ui/libs/util/city.js";
	import areas from "uView UI已发布Sketch和Axure设计资源示例/uview-ui/libs/util/area.js";
	export default {
		name:'baseAddress',
		data(){
			return{
				p:"",
				c:"",
				a:"",
				
				cityValue: "",
				isChooseP: false, //是否已经选择了省
				province: 0, //省级下标
				provinces: provinces,
				isChooseC: false, //是否已经选择了市
				city: 0, //市级下标
				citys: citys[0],
				isChooseA: false, //是否已经选择了区
				area: 0, //区级下标
				areas: areas[0][0],
				tabsIndex: 0,
				
				height: 30,
				bgColor: this.$u.color.bgColor,
				marginTop: 30,
				marginBottom: 30,
				value: false,
				input: '',
				
				form: {
					name: '',
					phone: '',
					address:"",
					locationStr:"",
				},
				rules:{
					name: [
						{ 
							required: true, 
							whitespace:true,
							message: '请输入姓名', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
					phone: [
						{ 
							required: true, 
							pattern:/^1{1}[3-9]{1}[0-9]{9}$/ig,
							whitespace:true,
							message: '请务必输入正确格式的手机号', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
					address: [
						{ 
							required: true, 
							message: '详细地址是必须的', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
				},
				showDefaultButton:true,
				is_default:true,
				id:0,
				addressDetail:{},
			}
		},
		onReady() {
				this.$refs.uForm.setRules(this.rules);
		},
		onLoad(e) {
			if(e.id)this._initAddressDetail(e.id)
		},
		methods:{
			provinceChange(index) {
				this.isChooseP = true;
				this.isChooseC = false;
				this.isChooseA = false;
				this.province = index;
				this.citys = citys[index];
				this.tabsIndex = 1;
				this.p= this.provinces[index].label
			},
			cityChange(index) {
				this.isChooseC = true;
				this.isChooseA = false;
				this.city = index;
				this.areas = areas[this.province][index];
				this.tabsIndex = 2;
				this.c = this.citys[index].label
			},
			areaChange(e) {
				this.a = this.areas[e].label
				this.form.locationStr = this.p +"-"+ this.c +"-"+ this.a
				this.value = false
			},
			openActionSheet(){
				this.value = true
			},
			closeActionSheet(){
				this.value = false
			},
			async _initAddressDetail(id){
				let result
				//#ifndef MP-WEIXIN
				 result = await this.$store.dispatch('getAddressDetail',id)
				//#endif
				
				//#ifdef MP-WEIXIN
				await this.$u.get(`/api/address/${id}`).then(res=>{},err=>{
					result = err
				})
				//#endif
				
				
				this.addressDetail = result
				this.form.phone = result.phone
				this.form.locationStr = result.province+"-"+result.city+"-"+result.county
				this.is_default = !!result.is_default
				this.form.name = result.name
				this.form.address = result.address
				this.p = result.province
				this.c = result.city
				this.a = result.county
				if(this.is_default){
					this.showDefaultButton = false
				}
			},
			async alterAddress(params){
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('alterAddress',{params,address:this.addressDetail.id})
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.put(`/api/address/${this.addressDetail.id}`,params).then(res=>{},err=>{})
				//#endif
				uni.showToast({
					title:"修改成功",
					icon:"none"
				})
				this._initAddresses()
			},
			async addNewAddress(){
				this.$refs.uForm.validate(async(valid)=> {
					if (valid) {
						let {form:{phone,address,name},is_default,p,c,a} = this
						let params = {
								phone,
								county:a,
								city:c,
								province:p,
								name,
								address,
							}
						if(this.is_default){
							params.is_default = 1
						}
						if(this.addressDetail.id){
							this.alterAddress(params)
							return
						}
						//#ifndef MP-WEIXIN
						await this.$store.dispatch('addNewAddress',params)
						//#endif
						//#ifdef MP-WEIXIN
						await this.$u.post(`/api/address`,params).then(res=>{},err=>{})
						//#endif
						uni.showToast({
							title:"添加成功",
							icon:"none"
						})
						this._initAddresses()
						this.$u._initPreview()
					} else {
						uni.showToast({
							title:"验证失败",
							icon:"none"
						})
					}
				});
			},
			changeDefault(){
				if(!this.is_default){
					this.is_default = false
				}else{
					this.is_default = true
				}
			},
			async _initAddresses(){
				//#ifndef MP-WEIXIN
				await this.$store.dispatch('getAddresses')
				//#endif
				//#ifdef MP-WEIXIN
				await this.$u.get(`/api/address`).then(res=>{},err=>{
					this.$bus.addresses = err
				})
				//#endif
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import '../../theme.scss';
	@import '../../index.scss';
	.slide-enter-active{
	    animation:slide 0.4s;
	}
	.slide-leave-active{
	    animation:slide 0.4s reverse;
	}
	@keyframes slide {
	    from{
	        transform: translateY(100%);
	    }
	    to{
	        transform: translateY(0%);
	    }
	}
	
	.mine-city-selector-mask{
		height: 100%;
		    width: 100%;
		    position: fixed;
		    bottom: 0;
		    background: rgba(0,0,0,.3);
			.mine-city-selector{
			    height: 40%;
			    background-color: white;
			    width: 100%;
			    position: absolute;
			      perspective-origin: center bottom;
			      bottom: 0;
			      perspective: 100px;
			    border-top-left-radius: 10px;
			    border-top-right-radius: 10px;
				overflow: hidden;
				.close-button{
					    position: absolute;
					    top: 0%;
					    right: 4%;
					    font-size: 1rem;
					    color: gray;
					    font-family: cursive;
				}
				.content-wrap{
					.content{
					    background-color: white;
					    height: 80%;
					    position: absolute;
					    transform: rotateX(-3deg) translateY(16%);
					        width: 94%;
					        margin-left: 3%;
					}
				}
			}
			.mine-city-selector::after{
				content:"";
				height:7%;
				position:absolute;
				width:100%;
				background-color:white;
				bottom:0;
			}
	}
	
	
	
	.btn-wrap {
		margin: 100rpx 30rpx;
	}
	.u-form{
		    padding: 0 10px;
	}
	.submit{
		margin: 30px 0;
		width: 90%;
		margin-left: 2.5%;
		width: 96%;
		margin: 0 auto;
		background-color: $uni-color-primary;
		color: white;
	}
</style>
