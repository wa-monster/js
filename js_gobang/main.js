/**
 * Created by 杨阳阳 on 2018/2/12.
 */
var me=true;
var over=false;
var chessbord=new Array();
for(var i=0;i<15;i++){
    chessbord[i]=new Array();
    for(var j=0;j<15;j++){
        chessbord[i][j]=true;//表示可以落子
    }
}



//赢法数组
var win=new Array();
for(var i=0;i<15;i++){
    win[i]=new Array();
    for(var j=0;j<15;j++){
        win[i][j]=new Array();//表示可以落子
    }
}
var count=0;//多少种赢法
for(var i=0;i<15;i++){//在棋盘上竖线所有连成5个子的赢法；
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            win[i][j+k][count]=true;
        }
        count++;
    }
}

for(var i=0;i<15;i++){//在棋盘上横线所有连成5个子的赢法；
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            win[j+k][i][count]=true;
        }
        count++;
    }
}

for(var i=0;i<11;i++){//在棋盘上斜线所有连成5个子的赢法；
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            win[i+k][j+k][count]=true;
        }
        count++;
    }
}

for(var i=0;i<11;i++){//在棋盘上反斜线所有连成5个子的赢法；
    for(var j=4;j<15;j++){
        for(var k=0;k<5;k++){
            win[i+k][j-k][count]=true;
        }
        count++;
    }
}
console.log(count);

//赢法的统计数组
var mywin=new Array();
var computerwin=new Array();
for(var k=0;k<count;k++){
    mywin[k]=0;
    computerwin[k]=0;
}



var canvas=document.getElementById("chess");
var c=canvas.getContext("2d");
// var logo=new Image();//背景图片，水印效果
// logo.src="logo.jpg";
// logo.onload=function () {
//     c.drawImage(logo,0,0,450,450);
//     as();
// }
//moveTo是什么lineTo是什么，stroke()是什么 arc()是什么?
function as() {
    for(var i=0;i<15;i++){
        c.moveTo(15.5,15.5+i*30);//秘术0.5大法，原因，计算机像素最低1px，canvas画法以坐标为中心向两边扩散，会导致1px最后变成2px
        c.lineTo(435.5,15.5+i*30);
        c.stroke();
        c.moveTo(15.5+i*30,15.5);
        c.lineTo(15.5+i*30,435.5);
        c.stroke();
    }
}
as();
function drawchess(i,j,me) {
    c.beginPath();
    c.arc(15.5+i*30,15.5+j*30,15,0*Math.PI,2*Math.PI);
    var grident=c.createRadialGradient(15.5+i*30,15.5+j*30,15,15.5+i*30,15.5+j*30,5);
    if(me) {
        grident.addColorStop(0, "#0a0a0a");
        grident.addColorStop(1, "#636363");
        c.fillStyle = grident;
    }else{
        grident.addColorStop(0, "#9a9a9a");
        grident.addColorStop(1, "#f4f4f4");
        c.fillStyle = grident;
    }
    c.fill();
}

canvas.onclick=function (e) {
    if (over){
        return true;
    }
    var x=e.offsetX;
    var y=e.offsetY;
    var i=Math.floor(x/30);
    var j=Math.floor(y/30);
    if(chessbord[i][j]==true) {//条件判断主要用于下过子的地方不能在下
        chessbord[i][j]=false;
        drawchess(i, j, me);
        //判断赢没有
        for(var k=0;k<count;k++){
            if(win[i][j][k]){
                mywin[k]++;
                computerwin[k]=100;
                if(mywin[k]==5){
                    over=true;
                    alert("你赢了")
                }
            }
        }
        if(!over){
            me=!me;//取反
            computerAI();
        }
    }
}

function computerAI() {
    var myscore=[];
    var computerscore=[];
    var max=0;
    var u=0;
    var v=0;
    for(var i=0;i<15;i++){
        myscore[i]=[];
        computerscore[i]=[];
        for(var j=0;j<15;j++){
            myscore[i][j]=0;
            computerscore[i][j]=0;
        }
    }
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(chessbord[i][j]){
                for(var k=0;k<count;k++){
                    if(win[i][j][k]){
                        if(mywin[k]==1){
                            myscore[i][j]+=200;
                        }else if(mywin[k]==2){
                            myscore[i][j]+=400;
                        }else if(mywin[k]==3){
                            myscore[i][j]+=2000;
                        }else if(mywin[k]==4){
                            myscore[i][j]+=10000;
                        }
                        if(computerwin[k]==1){
                            computerscore[i][j]+=220;
                        }else if(computerwin[k]==2){
                            computerscore[i][j]+=420;
                        }else if(computerwin[k]==3){
                            computerscore[i][j]+=2100;
                        }else if(computerwin[k]==4){
                            computerscore[i][j]+=20000;
                        }
                    }
                }
                if(myscore[i][j]>max){
                    max=myscore[i][j];
                    u=i;
                    v=j;
                }else if(myscore[i][j]==max){
                    if(computerscore[i][j]>computerscore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
                if(computerscore[i][j]>max){
                    max=computerscore[i][j];
                    u=i;
                    v=j;
                }else if(computerscore[i][j]==max){
                    if(myscore[i][j]>myscore[u][v]){
                        u=i;
                        v=j;
                    }
                }
            }
        }
    }
    drawchess(u,v,me);
    chessbord[u][v]=false;
    for(var k=0;k<count;k++){
        if(win[u][v][k]){
            computerwin[k]++;
            mywin[k]=100;
            if(computerwin[k]==5){
                over=true;
                alert("计算机赢了")
            }
        }
    }
    if(!over){
        me=!me;//取反
    }
}

