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