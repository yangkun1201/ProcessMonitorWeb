
var checkAccount = true;
var checkUsername = true;
var checkPassword = true;
var checkPhone = true;

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

function testInput(obj){
    //console.log(obj)
    var placeholder = $(obj).prop('placeholder');
    var value = $(obj).val();
    placeholder = placeholder.split('不')[0];
    if(value === ''){
        $(obj).prop('placeholder',placeholder + '不能为空');
        $(obj).css('border-color','#FF0000');
    }else{
        $(obj).css('border-color','');
    }

    checkAccount = true;
    checkUsername = true;
    checkPassword = true;
    checkPhone = true;

    //console.log(placeholder);
    if(placeholder === '账号'){
        //判断账号是否已存在
        $.ajax({
            method:'get',
            url:'http://127.0.0.1:8080/checkAccountExist',
            data:{
                account:value
            }
        }).done(function(msg){
            // console.log(msg);
            if(msg.isExist === 1){
                alert('该账号已存在');
                checkAccount = false;
                $(obj).val('');
            }
        });

    }else if(placeholder === '用户名'){

    }else if(placeholder === '密码'){

    }else if(placeholder === '手机号码'){
        if(value.length !== 11 || !value.startsWith('1')){
            //alert('手机号码不合法');
            checkPhone = false;
        }
        
    }

}