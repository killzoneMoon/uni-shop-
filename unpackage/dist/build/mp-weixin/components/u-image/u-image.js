(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/u-image/u-image"],{"112a":function(t,e,i){"use strict";i.r(e);var r=i("9094"),o=i("53d3");for(var n in o)"default"!==n&&function(t){i.d(e,t,(function(){return o[t]}))}(n);i("4ebc");var a,u=i("f0c5"),d=Object(u["a"])(o["default"],r["b"],r["c"],!1,null,"7c5597d6",null,!1,r["a"],a);e["default"]=d.exports},"4ebc":function(t,e,i){"use strict";var r=i("5cb5"),o=i.n(r);o.a},"53d3":function(t,e,i){"use strict";i.r(e);var r=i("797c"),o=i.n(r);for(var n in r)"default"!==n&&function(t){i.d(e,t,(function(){return r[t]}))}(n);e["default"]=o.a},"5cb5":function(t,e,i){},"797c":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r={name:"u-image",props:{src:{type:String,default:""},mode:{type:String,default:"aspectFill"},width:{type:[String,Number],default:"100%"},height:{type:[String,Number],default:"auto"},shape:{type:String,default:"square"},borderRadius:{type:[String,Number],default:0},lazyLoad:{type:Boolean,default:!0},showMenuByLongpress:{type:Boolean,default:!0},loadingIcon:{type:String,default:"photo"},errorIcon:{type:String,default:"error-circle"},showLoading:{type:Boolean,default:!0},showError:{type:Boolean,default:!0},fade:{type:Boolean,default:!0},webp:{type:Boolean,default:!1},duration:{type:[String,Number],default:500},bgColor:{type:String,default:"#f3f4f6"}},data:function(){return{isError:!1,loading:!0,opacity:1,durationTime:this.duration,backgroundStyle:{}}},watch:{src:{immediate:!0,handler:function(t){t?this.isError=!1:(this.isError=!0,this.loading=!1)}}},computed:{wrapStyle:function(){var t={};return t.width=this.$u.addUnit(this.width),t.height=this.$u.addUnit(this.height),t.borderRadius="circle"==this.shape?"50%":this.$u.addUnit(this.borderRadius),t.overflow=this.borderRadius>0?"hidden":"visible",this.fade&&(t.opacity=this.opacity,t.transition="opacity ".concat(Number(this.durationTime)/1e3,"s ease-in-out")),t}},methods:{onClick:function(){this.$emit("click")},onErrorHandler:function(t){this.loading=!1,this.isError=!0,this.$emit("error",t)},onLoadHandler:function(){var t=this;if(this.loading=!1,this.isError=!1,this.$emit("load"),!this.fade)return this.removeBgColor();this.opacity=0,this.durationTime=0,setTimeout((function(){t.durationTime=t.duration,t.opacity=1,setTimeout((function(){t.removeBgColor()}),t.durationTime)}),50)},removeBgColor:function(){this.backgroundStyle={backgroundColor:"transparent"}}}};e.default=r},9094:function(t,e,i){"use strict";i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return n})),i.d(e,"a",(function(){return r}));var r={uIcon:function(){return i.e("components/u-icon/u-icon").then(i.bind(null,"ce91"))}},o=function(){var t=this,e=t.$createElement,i=(t._self._c,t.__get_style([t.wrapStyle,t.backgroundStyle])),r=t.isError||"circle"==t.shape?null:t.$u.addUnit(t.borderRadius),o=t.showLoading&&t.loading&&"circle"!=t.shape?t.$u.addUnit(t.borderRadius):null,n=t.showError&&t.isError&&!t.loading&&"circle"!=t.shape?t.$u.addUnit(t.borderRadius):null;t.$mp.data=Object.assign({},{$root:{s0:i,g0:r,g1:o,g2:n}})},n=[]}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/u-image/u-image-create-component',
    {
        'components/u-image/u-image-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("112a"))
        })
    },
    [['components/u-image/u-image-create-component']]
]);
