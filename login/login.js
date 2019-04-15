//登录验证
function checkLogin(){
    var account = $('#account').val();
    var password = $('#password').val();
    // console.log(account);
    // console.log(password);

    if(account === '' || password === ''){
        alert('账号或密码不能为空');
        return;
    }

    $.ajax({
        method:'post',
        url:'http://127.0.0.1:8080/login',
        contentType:'application/json;charset=utf-8', 
        dataType:'json',
        data:JSON.stringify({
            account:account,
            password:password
        })
    }).done(function(msg){
        //console.log(msg);
        if(msg.code === 0){
            alert('登录成功');
            window.location.href = 'file:///G:/%E6%96%87%E6%A1%A3/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1/ProcessMonitorWeb/index.html?account=' + account;
        }else if(msg.code === 1){
            alert('密码错误')
        }else if(msg.code === 2){
            alert('用户不存在，请先注册');
        }
    });
}

//注册账号
function registeredAccount(){
    //console.log(window.location);
    window.location.href = 'file:///G:/%E6%96%87%E6%A1%A3/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1/ProcessMonitorWeb/registered/registered.html';
}

//改变登陆方式
function changeLoginMethod(obj){
    var method = $(obj).text();
    if(method === '二维码登陆'){
        $('#loginByAccount').css('display','none');
        $('#loginByQrcode').css('display','block');
        $(obj).text('账号密码登陆');
        //获取二维码图片
        getQrCodeFromServer();


    }else if(method === '账号密码登陆'){
        $('#loginByQrcode').css('display','none');
        $('#loginByAccount').css('display','block');
        $(obj).text('二维码登陆');
    }
    //console.log(method);
}

//获取二维码图片
function getQrCodeFromServer(){
    $.ajax({
        method:'get',
        url:'http://127.0.0.1:8080/getQrCodeImageBase64'
    }).done(function(msg){
        console.log(msg.uuid);
        imgUrl = 'data:image/jpg;base64,'+msg.qrCodeInBase64;
        $('#qrCodeImg').prop('src',imgUrl);
        pollingQrCodeStatus(msg.uuid);
    })
}

//轮询二维码扫描状态
function pollingQrCodeStatus(uuid){
    var timeId = setInterval(function(){
        console.log('polling');
        $.ajax({
            method:'get',
            url:'http://127.0.0.1:8080/queryQrCodeScanStatus',
            data:{
                uuid:uuid
            }
        }).done(function(msg){
            if(msg.scanStatus === 0){
                var account = msg.account;
                clearInterval(timeId);
                console.log('polling success : ' + account);
                window.location.href = 'file:///G:/%E6%96%87%E6%A1%A3/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1/ProcessMonitorWeb/index.html?account=' + account;
            }
        })
    },200);
}