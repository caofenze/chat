$(document).ready(function() {
	var img = "img/head/2024.jpg", 
    	c = "img/head/2015.jpg", 
    	d = "\u738b\u65ed";

    var appid  = 'o4p47qlfvm3acmsphwx1y1erzonucqpedg09hhfm4ntypqxr';
    //替换成一个你自己的appid
    //var clientId = $('#sender').val() || 'testuser' + Math.random();
    var rt;
    var conv;
    var toPeerId;

    function render() {
    	//发送表情
        function h() {

            -1 != msg.indexOf("*#emo_") && (msg = msg.replace("*#", "<img src='img/").replace("#*", ".gif'/>"), h())
        }
        //h();

        var index = $(".talkTo a").text().split(0)[1];

        var e = new Date, 
        	time = "";
        
        time += e.getFullYear() + "-", 
        time += e.getMonth() + 1 + "-", 
        time += e.getDate() + "  ", 
        time += e.getHours() + ":", 
        time += e.getMinutes() + ":", 
		time += e.getSeconds();

        var msg = $("#textarea").val();

        var tpl = "<div class='message clearfix'>"
	        		 +"<div class='user-logo'>"
	        		 	+"<img src='" + img + "'/>" 
	        		 +"</div>" 
	        		 +"<div class='wrap-text'>" 
	        		 	+"<h5 class='clearfix'>caofenze</h5>"
	        		 	+"<div>"+msg+"</div>"
	        		 +"</div>" 
	        		 +"<div class='wrap-ri'>" 
	        		 	+"<div clsss='clearfix'>"
	        		 		+"<span>"+time+"</span>"
	        		 	+"</div>"
	        		 +"</div>"
	        		 +"<div style='clear:both;'></div>" 
	        	+"</div>";

    	if(null!==msg && ""!=msg){
    		$(".mes" + index).append(tpl);
    		$(".chat01_content").scrollTop($(".mes" + index).height());
    		$("#textarea").val("");
    		//message();
    	}else{
    		alert("请输入内容!")
    	}
    }
    

    $(".close_btn").click(function() {
        $(".chatBox").hide();
    });

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

          //建立连接
          rt = AV.realtime({
              // 强将 appId 换为自己的 appId
              appId: appid,
              // appId: 'pyon3kvufmleg773ahop2i7zy0tz2rfjx5bh82n7h5jzuwjg',
              clientId: $('#sender').val() || 'testuser' + Math.random(),
              // 是否开启服务器端认证
              // auth: authFun
          });
          console.log(rt);
          
          rt.on('close', function(event) {
            //可以在这里进行重连 自行设置重连策略
            alert('connection closed');
            //console.log(event);
            //$('#connect-status').text('not connected');
            //$('.online').removeClass('online').addClass('offline');
          });
          // --------------- chat 相关监听 ---------------
          rt.on('message', function(data) {
            console.log(data);
            //收到消息时触发
            $('.mes'+$(".talkTo a").text().split(0)[1]).append(JSON.stringify(data));
            $('.mes'+$(".talkTo a").text().split(0)[1]).append('<br>');
            console.log(data);
          });

          //打开服务

          rt.on('open', function() {
               console.log('与服务器连接成功！');
               conv = rt.conv({
                    // 人员的 id
                    members: [
                        $(".talkTo a").text()
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
            });

    });

    //表情
    $(".ctb01").mouseover(function() {
        $(".wl_faces_box").show()
    }).mouseout(function() {
        $(".wl_faces_box").hide()
    });

    $(".wl_faces_box").mouseover(function() {
        $(".wl_faces_box").show()
    }).mouseout(function() {
        $(".wl_faces_box").hide()
    });

    $(".wl_faces_close").click(function() {
        $(".wl_faces_box").hide()
    });

    $(".wl_faces_main img").click(function() {
        var a = $(this).attr("src");
        $("#textarea").val($("#textarea").val() + "*#" + a.substr(a.indexOf("img/") + 4, 6) + "#*"), $("#textarea").focusEnd(), $(".wl_faces_box").hide()
    });

    $(".chat02_bar img").click(function() {
          
          conv.send({
              msg : $("#textarea").val()
          },function(){
            $('.mes'+$(".talkTo a").text().split(0)[1]).append(JSON.stringify({
              msg: $('#textarea').val(),
              toPeerId: $(".talkTo a").text()
            }));
          });
          //render();
    });

    document.onkeydown = function(a) {
        
        var b = document.all ? window.event : a;

        return 13 == b.keyCode ? (render(), !1) : void 0
    };

    $.fn.setCursorPosition = function(a) {
        return 0 == this.lengh ? this : $(this).setSelection(a, a)
    };

    $.fn.setSelection = function(a, b) {
        if (0 == this.lengh)
            return this;
        if (input = this[0], input.createTextRange) {
            var c = input.createTextRange();
            c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select()
        } else
            input.setSelectionRange && (input.focus(), input.setSelectionRange(a, b));
        return this
    };

    $.fn.focusEnd = function() {
        this.setCursorPosition(this.val().length)
    }
});
