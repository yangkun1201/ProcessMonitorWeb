
var checkAccount = true;
var checkUsername = true;
var checkPassword = true;
var checkPhone = true;
var checkVerificationCode = true;
var waitTime = 60;
var verificationCode = '';

function registeredAccount(){
    var account = $('#account').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var phone = $('#phone').val();
    
    if(!checkAccount){
        alert('账号不合法');
        return;
    }
    if(!checkUsername){
        alert('用户不合法');
        return;
    }
    if(!checkPassword){
        alert('密码不合法');
        return;
    }
    if(!checkPhone){
        alert('手机号码不合法');
        return;
    }

    $.ajax({
        method:'post',
        url:'http://127.0.0.1:8080/registeredAccount',
        contentType:'application/json;charset=utf-8',
        dataType:'json',
        data:JSON.stringify({
            account:account,
            username:username,
            password:password,
            phone:phone,
            softs:''
        })
    }).done(function(msg){
        // console.log(msg);
        if(msg.status === 'ok'){
            alert('注册成功');
            window.location.href="file:///G:/%E6%96%87%E6%A1%A3/%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1/ProcessMonitorWeb/login/login.html";
        }
    });

}


function getVerificationCode(){
    var phone = $('#phone').val();
    //验证手机号码格式
    if(phone.length !== 11 || !phone.startsWith('1')){
        alert('手机号码不合法');
        return;
    }
    $('#verificationBtn').attr('disabled',true);
    var timerId = setInterval(function(){
        $('#verificationBtn').text(waitTime+'秒后重试');
        //console.log(waitTime);
        waitTime--;
        if(waitTime === 0){
            clearInterval(timerId);
            $('#verificationBtn').text('获取验证码');
            $('#verificationBtn').attr('disabled',false);
            waitTime = 60;
        }
    },1000);
    //调用服务端的短信服务
    $.ajax({
        method:'get',
        url:'http://127.0.0.1:8080/sendSms',
        data:{
            phone:phone
        }
    }).done(function(msg){
        console.log(msg);
        verificationCode = msg.verificationCode;
    })
}

//检测账号
function checkAccountInput(obj){
    checkAccount = true;
    var data = $(obj).val();
    //判断账号是否为空
    if(data === ''){
        alert('账号不能为空');
        checkAccount = false;
        $(obj).css('border-color','#FF0000');
        return;
    }
    //判断账号是否已存在
    $.ajax({
        method:'get',
        url:'http://127.0.0.1:8080/checkAccountExist',
        data:{
            account:data
        }
    }).done(function(msg){
        // console.log(msg);
        if(msg.isExist === 1){
            alert('该账号已存在');
            checkAccount = false;
            $(obj).css('border-color','#FF0000');
            $(obj).val('');
        }else{
            $(obj).css('border-color','#07DC00');
        }
    });
}

//检测用户名
function checkUsernameInput(obj){
    checkUsername = true;
    var data = $(obj).val();
    if(data === ''){
        alert('用户名不能为空');
        $(obj).css('border-color','#FF0000');
        checkUsername = false;
        return;
    }
    $(obj).css('border-color','#07DC00');
}

//检测密码
function checkPasswordInput(obj){
    checkPassword = true;
    var data = $(obj).val();
    if(data === ''){
        alert('密码不能为空');
        $(obj).css('border-color','#FF0000');
        checkPassword = false;
        return;
    }else if(data.length < 6){
        alert('密码不能少于6位');
        $(obj).css('border-color','#FF0000');
        checkPassword = false;
        return;
    }
    $(obj).css('border-color','#07DC00');
}

//检测手机号码
function checkPhoneInput(obj){
    checkPhone = true;
    var data = $(obj).val();
    if(data === ''){
        alert('手机号码不能为空');
        $(obj).css('border-color','#FF0000');
        checkPhone = false;
        return;
    }else if(data.length !== 11 || !data.startsWith('1')){
        alert('手机号码不合法');
        $(obj).css('border-color','#FF0000');
        checkPhone = false;
        return;
    }
    $(obj).css('border-color','#07DC00');
}

//检测验证码
function checkVerificationCodeInput(obj){
    checkVerificationCode = true;
    var data = $(obj).val();
    if(data === ''){
        alert('验证不能为空');
        $(obj).css('border-color','#FF0000');
        checkVerificationCode = false;
        return;
    }else if(data !== verificationCode){
        alert('验证码不正确');
        $(obj).css('border-color','#FF0000');
        checkVerificationCode = false;
        return;
     }
    $(obj).css('border-color','#07DC00');
}