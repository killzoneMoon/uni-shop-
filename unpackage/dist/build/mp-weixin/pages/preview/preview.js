(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/preview/preview"],{"01c7":function(t,n,e){"use strict";e.d(n,"b",(function(){return o})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){return r}));var r={uImage:function(){return e.e("components/u-image/u-image").then(e.bind(null,"112a"))},cartBottom:function(){return e.e("components/cart-bottom/cart-bottom").then(e.bind(null,"aac3"))}},o=function(){var t=this,n=t.$createElement;t._self._c},u=[]},"0cd0":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r,o=u(e("a34a"));function u(t){return t&&t.__esModule?t:{default:t}}function i(t,n,e,r,o,u,i){try{var c=t[u](i),a=c.value}catch(s){return void e(s)}c.done?n(a):Promise.resolve(a).then(r,o)}function c(t){return function(){var n=this,e=arguments;return new Promise((function(r,o){var u=t.apply(n,e);function c(t){i(u,r,o,c,a,"next",t)}function a(t){i(u,r,o,c,a,"throw",t)}c(void 0)}))}}var a={name:"preview",beforeMount:function(){var t=this;this._initOrdersList(),this.$u._initPreview=function(){t._initOrdersList()}},data:function(){return{ordersList:{},QrcodeUrl:"",skeletonLoading:!0,orderInfo:{}}},methods:{toUrl:function(t){this.$u.route({url:t})},toPayment:function(){var n=this;return c(o.default.mark((function e(){var u,i;return o.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return u="",e.next=3,n.$u.get("/api/address").then((function(t){}),(function(t){t.data.forEach((function(t){t.is_default&&(u=t.id)}))}));case 3:return e.next=5,n.$u.post("/api/orders",{address_id:u}).then((function(t){}),function(){var e=c(o.default.mark((function e(u){return o.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.showToast({title:"下单成功"}),n.orderInfo=u,e.next=4,n.$u.get("api/orders/".concat(u.id,"/pay"),{type:"aliyun"}).then((function(t){}),(function(t){i="https://api.shop.eduwork.cn"+t.qr_code_url,r.QrcodeUrl="https://api.shop.eduwork.cn"+t.qr_code_url}));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 5:r.WXShowQrcode(i);case 6:case"end":return e.stop()}}),e)})))()},WXShowQrcode:function(t){this.QrcodeUrl=t},closeQrcode:function(){clearInterval(this.statusTimer),this.QrcodeUrl="",this.$u.route({url:"pages/cart/cart",type:"switchTab"})},showQrcode:function(){this.QrcodeUrl="https://api.shop.eduwork.cn"+this.$store.state.Qrcode.qr_code_url},_initOrdersList:function(){var t=this;return c(o.default.mark((function n(){return o.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return r=t,n.next=3,t.$u.get("/api/orders/preview").then((function(t){}),(function(n){t.ordersList=n}));case 3:t.skeletonLoading=!1;case 4:case"end":return n.stop()}}),n)})))()}},computed:{_initAddress:function(){var t="";return this.ordersList.address.forEach((function(n){n.is_default&&(t=n)})),t},is_default_exist:function(){var t=!1;return this.ordersList.address.forEach((function(n){n.is_default&&(t=!0)})),t}}};n.default=a}).call(this,e("543d")["default"])},"801a":function(t,n,e){"use strict";e.r(n);var r=e("0cd0"),o=e.n(r);for(var u in r)"default"!==u&&function(t){e.d(n,t,(function(){return r[t]}))}(u);n["default"]=o.a},8628:function(t,n,e){"use strict";var r=e("f34d"),o=e.n(r);o.a},a1f2:function(t,n,e){"use strict";e.r(n);var r=e("01c7"),o=e("801a");for(var u in o)"default"!==u&&function(t){e.d(n,t,(function(){return o[t]}))}(u);e("8628");var i,c=e("f0c5"),a=Object(c["a"])(o["default"],r["b"],r["c"],!1,null,"344cd655",null,!1,r["a"],i);n["default"]=a.exports},a99c:function(t,n,e){"use strict";(function(t){e("6f4b");r(e("66fd"));var n=r(e("a1f2"));function r(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])},f34d:function(t,n,e){}},[["a99c","common/runtime","common/vendor"]]]);