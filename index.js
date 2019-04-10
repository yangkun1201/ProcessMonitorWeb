//获取当前用户
var account = '1';
// 定义变量
var label = [];
var curTime = [];
var totalTime = [];
var data = [];
var chartType = "bar";
//获取数据
$.ajax({
    method:"GET",
    url:"http://127.0.0.1:8080/getAppTimeInfo",
    data:{
        account:account
    }
}).done(function(msg){
    console.log(msg);
    msg.forEach(element => {
        label.push(element.soft);
        curTime.push(element.curTime);
        totalTime.push(element.totalTime);
    });
    console.log(label);
    console.log(curTime);
    console.log(totalTime);
    data = curTime;
    drawChart(label,data,chartType);
});

//绘制图表
function drawChart(label,data,type){

    //清楚原有图表
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

//修改图表类型
$(document).ready(function(){
    $('#chartType').change(function(msg){
        var obj = $('#chartType');
        var selected=$(this).children('option:selected').val()
        console.log(selected);
        chartType = selected;
        drawChart(label,data,chartType);
    })
});