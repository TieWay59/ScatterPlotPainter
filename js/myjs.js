/* exported beginSSP, clearButton, returenButton,infoButton,calcButton*/

function objKeySort(obj) {//排序的函数
  const newkey = Object.keys(obj).sort();
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  const newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}

//初始化数组和对象
let d1 = [];
let d2 = [];
let info = [];
let oto = {};
let co = [];
let mp = {};
let dtls = [];
let tmp1, tmp2, tmp3;
let chart;
let colorSet;

                                                                                            //读入本地ColorSet
$.ajax({
  url: "data/generator/ColorSet.json",
  dataType: "json",
  async: true,
  crossDomain: true,
  success: function(data) {
    colorSet = data;
  },
  error: function(XMLHttpRequest, status) {
    switch (status) {
      case "error":
        alert("颜色丢失");
        break;
      default:
        alert("访问异常");
        break;
    }
  }
});
                                                                                            //文件上传
window.onload = function() {
  let input = document.getElementById("data1");         //得到上传按钮的对象
  //console.log(info);                                            //测试用
  input.onchange = function() {                                   //给按钮的onchange写一个读取函数
    const file = this.files[0];                                   //其实是可以扩展到多文件上传的，不过我们就选第一个，也就是下标0
    if (!!file) {                                                 //!!是一个js的语法，表示后面的变量不是null/undefined/空串，实用写法。
      const reader = new FileReader();                            //实例化一个FileReader对象
      reader.readAsText(file, "gbk");                         //借助 FileReader 的方法，按照文本格式读入文件，第二个参数是编码方式（可空）
      reader.onload = function() {
        tmp1 = this.result;                                       //然后在FileReader的onload方法里，刚刚读入的文件能以文本的形式得到了
                                                                  //注意这个对象还是文本，不能拿来直接用，但首先你可以把它带出来。
      };
    }
  };
  input = document.getElementById("data2");
                                                                                            //console.log(f);
  input.onchange = function() {
    const file = this.files[0];
    if (!!file) {
      const reader = new FileReader();
      reader.readAsText(file, "gbk");                                  
      reader.onload = function() {
        tmp2 = this.result;
                                                                                            //console.log(this.result);                                     
      };
    }
  };
  input = document.getElementById("data3");
                                                                                            //console.log(f);
  input.onchange = function() {
    const file = this.files[0];
    if (!!file) {
      const reader = new FileReader();
      reader.readAsText(file, "gbk");                                 
                                                                                            //??gbk or UTF-8
      reader.onload = function() {
        tmp3 = this.result;
                                                                                            //console.log(this.result);                                     
      };
    }
  };
};


let myDate;
let time1, time2;

//处理数据绘制图表
function beginSSP() {
  if(check3===-1||check2===-1||check1===-1){
    alert("上传文件存在错误。");
    return;
  }                                                                                          //check3代表有传入info
  if (check1 === 0 || check2 === 0) {
    alert("文件g1，g2尚未正常上传。");
    return;
  }
                                                                                            //返回页头
  scrollTo(0, 0);
                                                                                            //先隐藏部分卡片
  document.getElementById("idOfInput").style.display = "none";
  document.getElementById("idOfReminder").style.display = "none";
  document.getElementById("idOfChart").style.display = "block";
  document.getElementById("idOfNotice").style.display = "block";
  document.getElementById("idOfOptions").style.display = "block";

                                                                                            //计时器开始
  myDate = new Date();
  time1 = myDate.getTime();
                                                                                            //解析文件
  d1 = JSON.parse(tmp1);
  d2 = JSON.parse(tmp2);
  //因为允许用户不上传info，所以要提防tmp3是undefined的情况
  if(tmp3!==undefined)
  info = JSON.parse(tmp3);
                                                                                            //统计点数
  let countDots = 0;
  //遍历info改成了遍历d1
  for (let p in d1) {
    //console.log(p.substring(2, p.length - 2));
                                                                                            //兼容R0···XX R0···XXX
    /*
    * 下面的代码思路是这样的：先假设当前p是R0X格式的字符串，然后去查找是否存在
    * 如果去掉两个末尾X的串在info存在，那就把p修正成去掉两个末尾的。
    * 如果去掉三个末尾X的串在info存在，那就把p修正成去掉三个末尾的。
    * */
    let R0_p_X=p;
    if(p[0]==='R'){
      let xxx;
      if (info[xxx = p.substring(2, p.length - 2)] !== undefined) {
        p = xxx;
      } else if (info[xxx=p.substring(2, p.length - 3)] !== undefined){
        p = xxx;
      }
  }
    if (d2[R0_p_X] === undefined) {
      continue;
    }
                                                                                            //如果没有info，一律归入default
    let nm = info[p] === undefined ? "default" : info[p].tissue;
    let dtl =  info[p] === undefined ? "" : info[p].detail;

    if (oto[nm] === undefined) {

      oto[nm] = nm + ".";
      co.push([nm]);
      dtls.push([nm]);
      mp[nm] = co.length - 1;

      co.push([nm + "."]);
      dtls.push([nm + "."]);
      mp[nm + "."] = co.length - 1;
    }
                                                                                            //console.log(mp[nm]);
    co[mp[nm]].push(d2[R0_p_X]);
    dtls[mp[nm]].push(p);
    co[mp[nm + "."]].push(d1[R0_p_X]);
                                                                                            // dtls[mp[nm + "_"]].push(info[p].detail);
                                                                                            //d1做x轴 存到nm+"_"的标记里；
    dtls[mp[nm + "."]].push(dtl);
    countDots++;
  }
                                                                                            //提示信息（反馈点数）
  const len_d1 = Object.getOwnPropertyNames(d1).length;
  const len_d2 = Object.getOwnPropertyNames(d2).length;
  const len_info = Object.getOwnPropertyNames(info).length;

  document.getElementById("AlarmFile1").innerHTML = d1name;
  document.getElementById("dotsOfFile1").innerHTML = len_d1;
  document.getElementById("AlarmFile2").innerHTML = d2name;
  document.getElementById("dotsOfFile2").innerHTML = len_d2;
  document.getElementById("AlarmFile3").innerHTML = infoname;
  document.getElementById("dotsOfFile3").innerHTML = len_info;

                                                                                            //c3接口

  //为给legend排序
  co.sort(function(a,b){
    if(a[0]<b[0]){
      return -1;
    }
    if(a[0]>b[0]){
      return 1;
    }
    return 0;
  });
  console.log(co);


  chart = c3.generate({
    transition: {
      duration: 500
    },
    padding: {
      left: 50,
      bottom:0,
      top:0,
    },
    size: {
      height: 1200
                                                                                            //width: 1200,
    },
    color: {
      pattern: colorSet
    },
    data: {
      xSort: false,
      order:null,                                                 
                                                                                           //关键选项不要给点排序
      xs: oto,
      columns: co,
      type: "scatter"
    },
    axis: {

      x: {
        centered: true,
        label: d1name,
        padding:0,                //标度的内边距，最小值最大值于外界的距离
        min: 0,                   //标度最小值
        tick: {
          culling: false,         //跳跃标度设置
          count: 30,              //标度个数
          fit: false,              //标度自适应
          format: function(x) {   //标度格式设置
            return Math.round(x * 10000) / 10000;
          }
        }
      },
      y: {
        culling: false,
        label: d2name,
        padding:0,
        min: 0,
        tick: {
          count: 30,
          fit: false,
          format: function(x) {
            return Math.round(x * 10000) / 10000;
          }
        }
      }
    },
    point: {                                                                                      //调整点的大小
      focus: {
        expand: {
          enabled: true,
          r: 5
        }
      }
    },
    legend:{
    },
    tooltip: {
      format: {
        title: function(d) {
                                                                                            //读取G1的坐标
          document.getElementById("_x").innerHTML = d;
        },
        value: function(value, ratio, id, index) {
          document.getElementById("_y").innerHTML = value;
          document.getElementById("_tissue").innerHTML = id;
          document.getElementById("_name").innerHTML = dtls[mp[id]][index + 1];
          document.getElementById("_detail").innerHTML =
            dtls[mp[id + "."]][index + 1];
        }
      }
    }
  });

  myDate = new Date();
  time2 = myDate.getTime();
  document.getElementById("usedTime").innerHTML = time2 - time1 + "ms";
  document.getElementById("dotsNum").innerHTML = countDots;
  infoButton();
  calcButton();
}

//呈现图表卡片
                                                                                     //功能按钮
function returenButton() {
  window.location.reload();
  scrollTo(0, 0);
}

function infoButton() {
  $("#idOfChart").css("margin-top", "500px");
  document.getElementById("idOfInfo").style.display = "block";
  scrollTo(0, 0);
}

function calcButton() {
  function AnsNode(val, id, n) {
    this.val = val;
    this.id = id;
    this.n = n;
  }

  function compareNode(property) {
    return function(a, b) {
      if (a["n"] <= 2) return 10000000.0;
      if (b["n"] <= 2) return -10000000.0;
      const value1 = Math.abs(a[property]);
      const value2 = Math.abs(b[property]);
      return value2 - value1;
    };
  }

  let ans =[];

  myDate = new Date();
  time1 = myDate.getTime();


  for (let i = 0; i < co.length; i += 2) {
    let x = co[i];
    let y = co[i + 1];
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let sum_yy = 0;
    let n = x.length - 1;
    for (let j = 1; j < x.length; j++) {
      sum_x += x[j];
      sum_y += y[j];
      sum_xx += x[j] * x[j];
      sum_xy += x[j] * y[j];
      sum_yy += y[j] * y[j];
    }
    let t_ans = n * sum_xy - sum_x * sum_y;
    t_ans /= Math.sqrt(n * sum_xx - sum_x * sum_x);
    t_ans /= Math.sqrt(n * sum_yy - sum_y * sum_y);
    ans.push(new AnsNode(t_ans, x[0], n));
  }
  //---all---
  {
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;
    let sum_yy = 0;
    let n=0;
    for (let i = 0; i < co.length; i += 2) {
      let x = co[i];
      let y = co[i + 1];
      n += x.length - 1;
      for (let j = 1; j < x.length; j++) {
        sum_x += x[j];
        sum_y += y[j];
        sum_xx += x[j] * x[j];
        sum_xy += x[j] * y[j];
        sum_yy += y[j] * y[j];
      }
    }
    let t_ans = n * sum_xy - sum_x * sum_y;
    t_ans /= Math.sqrt(n * sum_xx - sum_x * sum_x);
    t_ans /= Math.sqrt(n * sum_yy - sum_y * sum_y);
    ans.push(new AnsNode(t_ans, "OverAll", n));
  }
  //---------

  ans = ans.sort(compareNode("val"));
  myDate = new Date();
  time2 = myDate.getTime();

  if (ans.length > 0) {
    document.getElementById("idOfRelat").innerHTML +=
      "<br>* 计算用时: " + (time2 - time1) + "ms";
    document.getElementById("tableOfR").innerHTML +=
      "<tr><td>tissue</td><td>点数</td><td>相关系数</td>";
  }
  for (const p in ans) {
    let tableItem = "<tr>";
    tableItem += "<td>" + ans[p].id + "</td>";
    tableItem += "<td>" + ans[p].n + "</td>";
    if (ans[p].n <= 2) {
      tableItem += "<td>数据量不足</td>";
    } else {
      tableItem += "<td>" + ans[p].val.toFixed(8) + "</td>";
    }
    tableItem += "</tr>";
    document.getElementById("tableOfR").innerHTML += tableItem;
  }
  document.getElementById("idOfRelat").style.display = "block";
                                                                                            //console.log(ans.sort(compareNode("val")));
}

function hideAllButton() {
  chart.hide();
}

function dispAllButton() {
  chart.show();
}
