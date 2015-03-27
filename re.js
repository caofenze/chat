// var appid = 'cqvid84b63ncn7tdwkcn2x4a15ij9j11v25vqn88tnxzdjt8';
var appid  = 'o4p47qlfvm3acmsphwx1y1erzonucqpedg09hhfm4ntypqxr';
//替换成一个你自己的appid
//var clientId = $('#sender').val() || 'testuser' + Math.random();
var rt;
var conv;
var toPeerId;
function addWatchingPeer(peers) {

  for (var i = 0; i < peers.length; i++) {
    if (!peers[i]) {
      return;
    }
    $('#toPeer').append(peers[i]);
  }
}

function render(data) {
	//var index = $(".talkTo a").text().split(0)[1];
	//console.log(index);

    var e = new Date, 
    	time = "";
    
    time += e.getFullYear() + "-", 
    time += e.getMonth() + 1 + "-", 
    time += e.getDate() + "  ", 
    time += e.getHours() + ":", 
    time += e.getMinutes() + ":", 
	time += e.getSeconds();
	
	var msg;
	var name;

	if(data && typeof data.msg != 'undefined'){
		msg = data.msg.msg;
		name = data.fromPeerId;
	}else{
		msg = $("#textarea").val();
		name = $("#sender").val();
	}

    
    //发送内容部分
    var tpl = '<div class="message_box mes-'+name+'" style="display: block;">'
              +"<div class='message clearfix'>"
          		 +"<div class='user-logo'>"
          		 	+"<img src='http://cdn.lianjia.com/pc/asset/img/new-version/default_block.png'/>" 
          		 +"</div>" 
          		 +"<div class='wrap-text'>" 
          		 	+"<h5 class='clearfix'>"+name+"</h5>"
          		 	+"<div>"+msg+"</div>"
          		 +"</div>" 
          		 +"<div class='wrap-ri'>" 
          		 	+"<div clsss='clearfix'>"
          		 		+"<span>"+time+"</span>"
          		 	+"</div>"
          		 +"</div>"
          		 +"<div style='clear:both;'></div>" 
          	+"</div>";
    //内容区域
    var chatCon = $("#chatCon");
    

	if(null!==msg && ""!=msg){
    chatCon.append(tpl);

		$(".chat01_content").scrollTop($(".chat01_content .message_box").length*$(".mes-"+name).height());
		$("#textarea").val("");
		//message();
	}else{
		alert("请输入内容!")
	}
}
//hover右侧
$(".chat03_content li").mouseover(function() {
    $(this).addClass("hover").siblings().removeClass("hover")
}).mouseout(function() {
    $(this).removeClass("hover").siblings().removeClass("hover")
});
//右侧选人
$(".chat03_content li").dblclick(function() {
    var index = $(this).index() + 1;
    $(".chat01_content").scrollTop(0);
    $(this).addClass("choosed").siblings().removeClass("choosed");
    $(".talkTo a").text($(this).children(".chat03_name").text());
    $(".mes" + index).show().siblings().hide();

});

document.onkeydown = function(a) {
    
    var b = document.all ? window.event : a;

    return 13 == b.keyCode ? ($("#sendBtn").trigger("click"), !1) : void 0
};


//======基本初始化==========
$('#new').click(function() {
      // 创建聊天实例（支持单页多实例）
  rt = AV.realtime({
      // 强将 appId 换为自己的 appId
      appId: appid,
      // appId: 'pyon3kvufmleg773ahop2i7zy0tz2rfjx5bh82n7h5jzuwjg',
      clientId: $('#sender').val() || 'testuser' + Math.random(),
      // 是否开启服务器端认证
      // auth: authFun
  });
  rt.on('close', function(event) {
    //可以在这里进行重连 自行设置重连策略
    alert('connection closed');
    $('#connect-status').text('已关闭');
    $('.online').removeClass('online').addClass('offline');
  });
  // --------------- chat 相关监听 ---------------
  rt.on('message', function(data) {
    console.log(data);
    if(data.fromPeerId != $('#sender').val()){
    	//收到消息时触发
      render(data);
    }
    
  });
  rt.on('online', function(peers) {
    //watcher online
    for (var i = 0; i < peers.length; i++) {
      $('#peer-' + peers[i]).removeClass('offline');
      $('#peer-' + peers[i]).addClass('online');
    }
  });
  rt.on('offline', function(peers) {
    //watcher offline
    for (var i = 0; i < peers.length; i++) {
      $('#peer-' + peers[i]).removeClass('online');
      $('#peer-' + peers[i]).addClass('offline');
    }
  });
});
//==========打开==============
$('#open').click(function() {
    rt = AV.realtime({
          // 强将 appId 换为自己的 appId
          appId: appid,
          // appId: 'pyon3kvufmleg773ahop2i7zy0tz2rfjx5bh82n7h5jzuwjg',
          clientId: $('#sender').val() || 'testuser' + Math.random(),
          // 是否开启服务器端认证
          // auth: authFun
      });
    $('#allwatcher').empty();
    $("#toPeer").empty();

    addWatchingPeer($('#watchingPeer').val().split(','));
    
    rt.on('open', function() {
       console.log('与服务器连接成功！');
       $('#status').append('Opened');
       $('#status').append('<br>');
       $('#connect-status').text('已连接');
       
       //右侧列表插入对话人员

       var tpl = '<li data-id="'+$("#watchingPeer").val()+'">'
                      +'<label class="online">'
                      +'</label>'
                      +'<a href="javascript:;">'
                          +'<img src="img/head/2013.jpg">'
                      +'</a>'
                      +'<a href="javascript:;" class="chat03_name">'
                          + $("#watchingPeer").val()
                      +'</a>'
                  +'</li>';
       if($("#personCon li").attr("data-id") == $("#toPeer").text()){
         return;
       }else{
          $("#personCon").append(tpl);
           //开启服务
           conv = rt.conv({
              // 人员的 id
              members: [
                  $("#toPeer").text()
              ],
              // 默认的数据，可以放 Conversation 名字等
              data: {
                  m: 123
              }
          }, function(data) {
              if (data) {
                  //console.log('Conversation 创建成功!', data);
              }
          });
       }
       
    });

});

$('#close').click(function() {
  rt = AV.realtime({
      // 强将 appId 换为自己的 appId
      appId: appid,
      // appId: 'pyon3kvufmleg773ahop2i7zy0tz2rfjx5bh82n7h5jzuwjg',
      clientId: $('#sender').val() || 'testuser' + Math.random(),
      // 是否开启服务器端认证
      // auth: authFun
  });

  rt.on('close', function() {
     console.log('与服务器已经断开！');
  });
});
//========发送信息==========
$('#sendBtn').on("click",function() {
   
  conv.send({
      msg : $("#textarea").val()
  },function(){
    render();
  });
  
  
});

