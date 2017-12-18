$(function(){
	
	var obj = {};
	obj.cus_no = $("input[name='cus_no']").val();
	obj.wxpublic_no = $("input[name='wxpublic_no']").val();
	obj.dynamicurl = window.location.href;
	
	// 向后台发送处理数据
	$.ajax({
		type: "post", //用POST方式传输
		url:  "../wx/accessJsConfig.do",//目标地址
		data : obj,
		dataType : "json",//数据格式:JSON
		success: function(msg){
			if(msg.status){
				wx.config({
				    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: msg.data.appid, // 必填，公众号的唯一标识
				    timestamp: msg.data.timestamp, // 必填，生成签名的时间戳
				    nonceStr:  msg.data.nonceStr, // 必填，生成签名的随机串
				    signature: msg.data.signature,// 必填，签名，见附录1
				    jsApiList: [// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		                // 所有要调用的 API 都要加到这个列表中
		                'getLocation',
		                'scanQRCode',
		                'chooseImage',
		                'previewImage',
		                'uploadImage',
		                'downloadImage'
		                ] 
				});
				
				wx.ready(function(){
					//alert("wx.ready:success");
				});
				
				wx.error(function(res){
					alert("wx.error:"+JSON.stringify(res));
				});
				
			} else {
				alert(msg.message);
			}
		}
	});
	
	
})
