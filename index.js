
//获取当前用户
var account = '';
// 定义变量
var label = [];
var curTime = [];
var totalTime = [];
var data = [];
var chartType = "bar";
//获取ip
var ip = localStorage.getItem('ip');
console.log(ip);

//获取计时数据
function getTimeData(){
    $.ajax({
        method:"GET",
        url:ip+"getAppTimeInfo",
        data:{
            account:account
        }
    }).done(function(msg){
        //console.log(msg);
        msg.forEach(element => {
            label.push(element.soft);
            curTime.push(element.curTime);
            totalTime.push(element.totalTime);
        });
        // console.log(label);
        // console.log(curTime);
        // console.log(totalTime);
        data = curTime;
        drawChart(label,data,chartType);
    });
}



//绘制图表
function drawChart(label,data,type){

    //清除原有图表
    $('#myChart').remove(); 
    $('#chartContainer').append('<canvas id="myChart"><canvas>');
    //绘图
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: label,
            datasets: [{
                label: '# of Votes',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

//显示当前用时
function showCurTime(){
    data = curTime;
    drawChart(label,data,chartType);
    $('#showCurTime').css('background-color','aquamarine');
    $('#showTotalTime').css('background-color','white');
}

//显示累计用时
function showTotalTime(){
    data = totalTime;
    drawChart(label,data,chartType);
    $('#showCurTime').css('background-color','white');
    $('#showTotalTime').css('background-color','aquamarine');
}


$(document).ready(function(){


    //获取已登陆账号
    if(window.location.href.indexOf('?')!==-1){
        var params = window.location.href.split('?')[1];
        var paramName = params.split('=')[0];
        var paramValue = params.split('=')[1];
        console.log(paramValue);
        account = paramValue;
        if(account !== ''){
            $('#loginBtn').text('当前用户: '+account);           
        }else{
            $('#loginBtn').text('登录');     
        }
    }
   
    //加载图表及配置信息
    getMonitorSoftsInfo();
    getTimeData();

    //修改图表类型
    $('#chartType').change(function(msg){
        var obj = $('#chartType');
        var selected=$(this).children('option:selected').val()
        //console.log(selected);
        chartType = selected;
        drawChart(label,data,chartType);
    })
});

//获取监控软件信息
function getMonitorSoftsInfo(){
    $.ajax({
        method:'get',
        url:ip+'getAppConfigInfo'
    }).done(function(msg){
        //console.log(msg)
        msg.forEach(element => {
            //console.log(element.name);
            var node = '<div class="col-lg-6 col-sm-8 CenteredContainer">'
            + '<input type="checkbox" value='+element.id+'>'
            + '<label class="checkboxLabel">'
            + element.name
            + '</label>'
            + '<button class="btn btn-light btn-xl js-scroll-trigger class="col-lg-2 col-sm-2""  onclick="deleteCheckbox(this)">删除</button>'
            +'</div>'

            $('#softsConfig').append(node);
        });
        var node = '<div class="softsConfigBtnDiv">'
        +'<button class="btn btn-light btn-xl js-scroll-trigger" onclick="submitSoftsConfigInfo()">确认</button>'
        +'<button class="btn btn-light btn-xl js-scroll-trigger" onclick="resetSoftsConfigInfo()">重置</button>'
        +'</div>';
        $('#softsConfig').append(node);
        //勾选原有的软件
        $.ajax({
            method:'get',
            url:ip+'getUserInfoByAccount',
            data:{
                account:account
            }
        }).done(function(msg){
            var softs = msg.softs.split(',');
            //删除末位多余元素
            softs.pop();
            //console.log(softs);
            var parentNode = $('#softsConfig');
            var childs = parentNode[0].childNodes;
            childs.forEach(element => {
                if(element.nodeName === 'DIV'){
                    var checkbox = element.childNodes[0];
                    //console.log($(checkbox).prop('value'));
                    if(softs.indexOf($(checkbox).prop('value')) !== -1){
                        $(checkbox).prop('checked',true);
                    }
                }
               
            });
        });
    
    });
}

//提交软件配置信息
function submitSoftsConfigInfo(){
    var softs = '';
    var parentNode = $('#softsConfig');
    var childs = parentNode[0].childNodes;
    childs.forEach(element => {
        if(element.nodeName === 'DIV'){
            var checkbox = element.childNodes[0];
            if($(checkbox).prop('checked') === true){
                softs += $(checkbox).prop('value') + ',';
            }
        }
    });
    //console.log(softs);

    //更新到服务端数据库
    $.ajax({
        method:'post',
        url:ip+'updateUserSofts',
        data:{
            account:account,
            softs:softs
        }
    }).done(function(msg){
        if(msg.status === 'ok'){
            alert('设置成功');
        }else{
            alert('设置失败');
        }
    });
}

//重置软件配置信息
function resetSoftsConfigInfo(){
    var softs = '';
    var parentNode = $('#softsConfig');
    var childs = parentNode[0].childNodes;
    childs.forEach(element => {
        if(element.nodeName === 'DIV'){
            var checkbox = element.childNodes[0];
            $(checkbox).prop('checked',false); 
        }
    });
    //console.log(softs);

    //更新到服务端数据库
    $.ajax({
        method:'post',
        url:ip+'updateUserSofts',
        data:{
            account:account,
            softs:softs
        }
    }).done(function(msg){
        if(msg.status === 'ok'){
            alert('重置成功');
        }else{
            alert('重置失败');
        }
    });
}

//打开增加监控软件窗口
function showSoftsConfigDialog(){
    var popUp = $('#popupDialog');
    popUp.css('visibility','visible');
    popUp.css('top','200px');
    popUp.css('left','530px');
    popUp.css('width','400px');
    popUp.css('height','210px');
}

//关闭增加监控软件窗口
function closePopupDialog(){
    var popUp = $('#popupDialog');
    popUp.css('visibility','hidden');
    //console.log('closePopupDialog');
}

//增加监控软件
function addSoftsConfig(){
    var name = $('#name').val();
    var processName = $('#processName').val();
    // console.log(name);
    // console.log(processName);
    $.ajax({
        method:'post',
        url:ip+'addSoftsConfig',
        data:{
            name:name,
            processname:processName
        }
    }).done(function(msg){
        if(msg.status === 'ok'){
            var parentNode = $('#softsConfig');
            parentNode.empty();
            getMonitorSoftsInfo();
            alert('增加监控软件成功');
            closePopupDialog();
           
        }

    });
}

//删除多选框
function deleteCheckbox(obj){
    var parentNode = $(obj)[0].parentNode;
    var childNode = $(parentNode)[0].childNodes[0];
    // console.log($(childNode).prop('value'));
    // console.log($(childNode).prop('checked'));
    if($(childNode).prop('checked') === true){
        alert('删除前，请先取消勾选该软件');
    }else{
        //console.log($(childNode).prop('value'));
        var value = $(childNode).prop('value');
        //向服务端删除数据
        $.ajax({
            method:'post',
            url:ip+'deleteSoftsConfigById',
            data:{
                id:value
            }
        }).done(function(msg){
            if(msg.status === 'ok'){
                alert('删除配置软件成功');
                $(parentNode).remove();
            }
        });

        
    }
}

//登录按钮鼠标悬停事件
function loginMouseOver(obj){
    //console.log($(obj).text());
    var curText = $(obj).text();
    if(curText.indexOf(':')!==-1){
        $(obj).text('注销');
    }
}
//登录按钮鼠标离开事件
function loginMouseOut(obj){
    console.log($(obj).text());
    var curText = $(obj).text();
    if(curText.indexOf('注销')!==-1){
        $(obj).text('当前用户: '+account);
    }
}
loginMouseOut