//jqGrid的配置信息
try {
    $.jgrid.defaults.width = 1000;
    $.jgrid.defaults.responsive = true;
    $.jgrid.defaults.styleUI = 'Bootstrap';
}catch(err){}


//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost/index.html?id=123
// T.p('id') --> 123;
var url = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
T.p = url;

//请求前缀
//var baseURL = "http://demo.open.renren.io/renren-fastplus/";
//var baseURL = "/renren-fastplus/";
var baseURL = "/";


//登录token
var token = localStorage.getItem("token");
if (token == 'null') {
    // parent.location.href = baseURL + 'login.html';
}

//jquery全局配置
$.ajaxSetup({
    dataType: "json",
    cache: false,
    headers: {
        "token": "b8d7020e9f0181a2bc7559bec75653d8"
    },
    // xhrFields: {
    //     withCredentials: true
    // },
    complete: function (xhr) {
        if (typeof(xhr.responseJSON) == "undefined")
            return true;

        //token过期，则跳转到登录页面
        if (xhr.responseJSON.code == 401) {
            // parent.location.href = baseURL + 'login.html';
        }
    }
});
try {
    //jqgrid全局配置
    $.extend($.jgrid.defaults, {
        ajaxGridOptions: {
            headers: {
                "token": token
            }
        }
    });
}catch(err){}
//获取URL参数
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//获取URL参数
$.serilizeUrlParam = function (url) {
    var urlObject = {};
    if (/\?/.test(url)) {
        var urlString = url.substring(url.indexOf("?") + 1);
        var urlArray = urlString.split("&");
        for (var i = 0, len = urlArray.length; i < len; i++) {
            var urlItem = urlArray[i];
            var item = urlItem.split("=");
            urlObject[item[0]] = item[1];
        }
        return urlObject;
    }
    return null;
}



//判断表单是否通过验证 created by wangzh 2018/04/18
$.fn.formValid = function () {
    return $(this).valid({
        errorPlacement: function (error, element) {
            element.parents('.formValue').addClass('has-error');
            element.parents('.has-error').find('i.error').remove();
            element.parents('.has-error').append('<i class="form-control-feedback fa fa-exclamation-circle error" data-placement="left" data-toggle="tooltip" title="' + error + '"></i>');
            $("[data-toggle='tooltip']").tooltip();
            if (element.parents('.input-group').hasClass('input-group')) {
                element.parents('.has-error').find('i.error').css('right', '33px');
            }
        },
        success: function (element) {
            element.parents('.has-error').find('i.error').remove();
            element.parent().removeClass('has-error');
        }
    });
};

/*
* 文件下载（仅支持已存在的文件）
* created by wangzh 2018/04/25
* @url:请求连接
* @data:格式("fileName=" + fileName + "&filePath=" + filePath);
* @method:get/post
* */
$.download = function (url, data, method) {
    if (url && data) {
        data = typeof data == 'string' ? data : jQuery.param(data);
        var inputs = '';
        $.each(data.split('&'), function () {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
        });
        $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
    }
    ;
};

//权限判断
function hasPermission(permission) {
    try {
        if (window.parent.permissions.indexOf(permission) > -1) {
            return true;
        } else {
            return false;
        }
    }catch (e) {

    }
    return false;
}

//弹窗子页面权限判断
function hasParentPermission(permission) {
    if (window.parent.parent.permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

//重写alert
window.alert = function (msg, callback) {
    parent.layer.alert(msg, function (index) {
        parent.layer.close(index);
        if (typeof(callback) === "function") {
            callback("ok");
        }
    });
}

//重写confirm式样框
window.confirm = function (msg, callback) {
    parent.layer.confirm(msg, {btn: ['确定', '取消']},
        function () {//确定事件
            if (typeof(callback) === "function") {
                callback("ok");
            }
        });
}

//选择一条记录
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        alert("请选择一条记录");
        return;
    }

    var selectedIDs = grid.getGridParam("selarrrow");
    if (selectedIDs.length > 1) {
        alert("只能选择一条记录");
        return;
    }

    return selectedIDs[0];
}

//选择多条记录
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        alert("请选择一条记录");
        return;
    }

    return grid.getGridParam("selarrrow");
}

$.dateFormat = function (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function formatDate(cellvalue, options, rowObject) {
    cellvalue = cellvalue.replace("T", " ");
    return cellvalue;
}

//格式化时间，去.0
function formateTime(value){
    if(value) return value.split(".")[0];
    return "";
}

function formatLocalDateTime(value) {
    if(value){
        value = value.split(".")[0].replace("T", " ");
        return value;
    }
    return "";
}

var CommUtil = {
    appId: null,
    preURL: null,
    defaultImgURL: null,
    uploadPath: null,
    isNull: function (value) {
        if (value == "" || value == undefined) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(value);
    },
    getStrLen: function (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            } else {
                len += 1;
            }
        }
        return len;
    },
    //得到要显示的字段，返回json
    colStaus: function (colKey) {
        $.ajax({
            url: "/table/queryByTableKey",
            data: {tableKey: colKey},
            type: "post",
            success: function (r) {
                if (0 == r.code) {
                    //var jsonDemo = '{ "projectName": false, "userNickName": true }';
                    var jsonDisplayInfo = r.sysTable.displayInfo;
                    return JSON.parse(jsonDisplayInfo);
                } else {
                    alert("查询失败");
                }
            },
            error: function () {
                alert("请求失败");
            }
        });

    },
    //保存要显示的字段
    colSave: function (colKey, jsonDisplayInfo) {
        $.ajax({
            url: "/table/save",
            data: {tableKey: colKey, displayInfo: jsonDisplayInfo},
            type: "post",
            success: function (r) {
                if (0 == r.code) {
                    alert("保存成功");
                } else {
                    alert("保存失败");
                }
            },
            error: function () {
                alert("请求失败");
            }
        });
    },
    getImgFilePath: function () {    //加载图片上传服务所需信息
        $.ajax({
            url: baseURL + "CommonController/getImgFilePath",
            type: "post",
            async: false,
            success: function (r) {
                if (0 == r.code) {
                    CommUtil.appId = r.appId;
                    CommUtil.preURL = r.preURL;
                    CommUtil.defaultImgURL = r.defaultImgURL;
                    CommUtil.uploadPath = r.uploadPath;
                } else {
                    alert("加载图片上传服务所需信息失败");
                }
            },
            error: function () {
                alert("请求失败");
            }
        });
    }
}

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (s, i) {
        return args[i];
    });
}

function getDay(day) {
    var today = new Date();
    today.setDate(today.getDate() + day); //注意，这行是关键代码

    var tYear = today.getFullYear();
    var tMonth = today.getMonth() + 1;
    var tDate = today.getDate();
    var strMonth = '' + tMonth;
    var strDate = '' + tDate;
    if (tMonth < 10)
        strMonth = '0' + tMonth;
    if (tDate < 10)
        strDate = '0' + tDate;
    return '{0}-{1}-{2}'.format(tYear, strMonth, strDate);
}

function getCurrentMonthFirstDate() {
    var date = new Date();
    date.setDate(1);
    var tYear = date.getFullYear();
    var tMonth = date.getMonth() + 1;
    var tDate = date.getDate();
    var strMonth = tMonth;
    var strDate = tDate;
    if (tMonth < 10)
        strMonth = '0' + tMonth;
    if (tDate < 10)
        strDate = '0' + tDate;
    return '{0}-{1}-{2}'.format(tYear, strMonth, strDate);
}

function getDateTime(day) {
    var today = new Date();
    today.setDate(today.getDate() + day);

    var tYear = today.getFullYear();
    var tMonth = today.getMonth() + 1;
    var strMonth = '' + tMonth;
    if (tMonth < 10)
        strMonth = '0' + tMonth;
    var tDate = today.getDate();
    var strDate = '' + tDate;
    if (tDate < 10)
        strDate = '0' + tDate;
    var tHour = today.getHours();
    var strHour = '' + tHour;
    if (tHour < 10)
        strHour = '0' + tHour;

    var tMinute = today.getMinutes();
    var strMinute = '' + tMinute;
    if (tMinute < 10)
        strMinute = '0' + tMinute;

    var tSecond = today.getSeconds();
    var strSecond = '' + tSecond;
    if (tSecond < 10)
        strSecond = '0' + tSecond;
    return '{0}-{1}-{2} {3}:{4}:{5}'.format(tYear, strMonth, strDate, strHour, strMinute, strSecond);
}

function getDateFormat(value) {
    if (value == null)
        return '';
    var tempDateTime = new Date(value.replace(/-/g, "/"));
    var tYear = tempDateTime.getFullYear();
    var tMonth = tempDateTime.getMonth() + 1;
    var strMonth = '' + tMonth;
    if (tMonth < 10)
        strMonth = '0' + tMonth;
    var tDate = tempDateTime.getDate();
    var strDate = '' + tDate;
    if (tDate < 10)
        strDate = '0' + tDate;
    return '{0}-{1}-{2}'.format(tYear, strMonth, strDate);
}

function isInteger(obj) {
    return (obj | 0) === obj
}

//根据状态获取分配结果
function getGiveStatusText(status) {
    if (status == "0")
        return "未分配";
    else if (status == "1")
        return "已分配";
    else if (status == "2")
        return "系统回收";
    else if (status == "3")
        return "人工回收";
    else if (status == "4")
        return "回收可分配";
    else
        return "";
}


function dateFtt(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//时:分:秒
function formatTime(value) {
    if (value == undefined || value == "" || value == null) return "00:00:00";
    if (value == 0) return "00:00:00";
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if (secondTime > 60) {
        minuteTime = parseInt(secondTime / 60);
        secondTime = parseInt(secondTime % 60);
        if (minuteTime > 60) {
            hourTime = parseInt(minuteTime / 60);
            minuteTime = parseInt(minuteTime % 60);
        }
    }

    var minute_time = parseInt(minuteTime);
    if (minute_time < 10)
        minute_time = "0" + minute_time;
    var hour_time = parseInt(hourTime);
    if (hour_time < 10)
        hour_time = "0" + hour_time;
    var second_time = parseInt(secondTime);
    if (second_time < 10)
        second_time = "0" + second_time;

    return hour_time + ":" + minute_time + ":" + second_time;
}

//秒转时:分:秒
//source :https://blog.csdn.net/chritina/article/details/69397810
function secToTime(s) {
    if (s <= 0) return 0;
    var t;
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour < 10) {
        t = '0' + hour + ":";
    } else {
        t = hour + ":";
    }

    if (min < 10) {
        t += "0";
    }
    t += min + ":";
    if (sec < 10) {
        t += "0";
    }
    t += sec;
    return t;
}


//时分秒
function formatSeconds(value) {
    if (value == undefined || value == "" || value == null) return;
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var result = "" + parseInt(secondTime) + "秒";

    if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
    }
    if (hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
    }
    return result;
}

function getJstxRecordPath(callId) {
    var callIdStr = callId.substring(0, callId.indexOf(".")) + "000";
    callIdStr = callIdStr.trim();
    var longtime = Number(callIdStr);
    var ym = dateFtt(new Date(longtime), "yy-MM");
    var d = dateFtt(new Date(longtime), "dd");
    return "http://jishi.yinliancn.com/record/" + ym + "/" + d + "/" + callId + ".mp3";
}

// 获取当月时间第一天
function getCurrentMonthFirst() {
    var date = new Date();
    date.setDate(1);
    return date;
}

//获取上个月的1号
function getLastMonthFirst() {
    var date = new Date();
    var lastMonthFirst = new Date(date.getFullYear(),date.getMonth()-1,1);
    return lastMonthFirst;
}


//获取某日期，通过month和day计算
function getDayByMonthNDay(month, day) {
    var date = new Date();
    var dateByCount = new Date(date.getFullYear(),date.getMonth()+month,date.getDate()+day);
    return dateByCount;
}


//格式化手机号码
function mobilePhoneFormat(mobilePhone, options, row) {
    if (mobilePhone) {
        var first = mobilePhone.substring(0, 3);
        var last = mobilePhone.substring(mobilePhone.length - 4, mobilePhone.length);
        return first + '****' + last;
    }
    return '';
}

//将金额转化成千分位形式，保留2位小数
function toThousands(num) {
    if (num == null || num == "") {
        return "0.00";
    }
    num = num.toFixed(2);
    num = num + '';
    if (!num.includes('.')) {
        num += '.'
    }
    return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ',';
    }).replace(/\.$/, '');
}

//获取上个月的今天
function getLastMonthToday() {
    var now = new Date();
    var year = now.getFullYear();//getYear()+1900=getFullYear()
    var month = now.getMonth() + 1;//0-11表示1-12月
    var day = now.getDate();
    if (parseInt(month) < 10) {
        month = "0" + month;
    }
    if (parseInt(day) < 10) {
        day = "0" + day;
    }

    now = year + '-' + month + '-' + day;

    if (parseInt(month) == 1) {//如果是1月份，则取上一年的12月份
        return (parseInt(year) - 1) + '-12-' + day;
    }

    var preSize = new Date(year, parseInt(month) - 1, 0).getDate();//上月总天数
    if (preSize < parseInt(day)) {//上月总天数<本月日期，比如3月的30日，在2月中没有30
        return year + '-' + month + '-01';
    }

    if (parseInt(month) <= 10) {
        return year + '-0' + (parseInt(month) - 1) + '-' + day;
    } else {
        return year + '-' + (parseInt(month) - 1) + '-' + day;
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function daysJian() {
    var date = new Date();//获取当前时间
    date.setDate(date.getDate() - 7);//设置天数 -1 天
    return date.Format("yyyy-MM-dd");
}

function playCallRecord(callId,supplierCode) {
    parent.layer.open({
        title: "录音播放",
        type: 2,
        area: ['550px', '240px'],
        fixed: false, //不固定
        shade: 0,
        maxmin:true,
        shadeClose: true,
        content: '/call/audioPlay.html?callId={0}&supplierCode={1}'.format(callId, supplierCode)
    });
}
function subStringByLength(val,strLength) {
    if(!val)
        return "";
    if(val&&val.length>strLength)
        return val.substr(0,strLength)
    else
        return val;
}

///获取jqGrid所有选择的Id值
///gridId: jqGrid的ID
///valueIdColName：需要获取的值的列名 (这个方法有bug，返回的不是列值而是id，因为已经有调用所以新写一个)
function getGridSelValues(gridId,valueIdColName)
{
    //获取选择行数据
    var selRows = $("#jqGrid").getGridParam('selarrrow');
    if (selRows.length <= 0) {
        return "-1";
    }
    var selRowArray = selRows.toString().split(',');
    if (selRowArray.length <= 0) {
        return "-1";
    }

    var sel_row = [];
    $.each(selRowArray, function (index, obj) {
        var cell_status = $("#jqGrid").jqGrid('getCell', obj, valueIdColName);//列值
        sel_row.push(obj);
    });

    if (sel_row.length <= 0) {
        return "-1";
    }
    selRows = sel_row.join(',');
    return selRows;
}

function getGridSelValuesNew(gridId, valueIdColName)
{
    //获取选择行数据
    var selRows = $("#jqGrid").getGridParam('selarrrow');
    if (selRows.length <= 0) {
        return "-1";
    }
    var selRowArray = selRows.toString().split(',');
    if (selRowArray.length <= 0) {
        return "-1";
    }

    var sel_row = [];
    $.each(selRowArray, function (index, obj) {
        var cell_value = $("#jqGrid").jqGrid('getCell', obj, valueIdColName);//列值
        sel_row.push(cell_value);
    });

    if (sel_row.length <= 0) {
        return "-1";
    }
    selRows = sel_row.join(',');
    return selRows;
}

Date.prototype.add = function (part, value) {
    value *= 1;
    if (isNaN(value)) {
        value = 0;
    }
    switch (part) {
        case "y":
            this.setFullYear(this.getFullYear() + value);
            break;
        case "m":
            this.setMonth(this.getMonth() + value);
            break;
        case "d":
            this.setDate(this.getDate() + value);
            break;
        case "h":
            this.setHours(this.getHours() + value);
            break;
        case "n":
            this.setMinutes(this.getMinutes() + value);
            break;
        case "s":
            this.setSeconds(this.getSeconds() + value);
            break;
        default:

    }
}
String.prototype.trim = function (char, type) {
    if (char) {
        if (type == 'left') {
            return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
        } else if (type == 'right') {
            return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
        }
        return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};


//乘法 解决精度问题
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

function getLastYearToday(){
    var vCurDate=new Date();
    vCurDate.setYear(vCurDate.getFullYear() - 1);
    return vCurDate;
}

function addDateMonth(date, offset) {
    if (date instanceof Date && !isNaN(offset)) {
        var givenMonth = date.getMonth();
        var newMonth = givenMonth + offset;
        date.setMonth(newMonth);
        return date;
    }
    throw Error('argument type error');
}

function formatFixedTwo(val, options, rowObject) {
    if(!isNaN(val)&&!isInteger(val))
        return val.toFixed(2);
    else
        return val;
}
function formatFixedTwoPercent(val, options, rowObject) {
    if(!isNaN(val))
    {
        if(isInteger(val*100))
            return accMul(val,100)+'%';
        else
            return accMul(val,100).toFixed(2)+'%';
    }
    else
        return '';
}

//获取上个月的第一天和最后一天
function getLastMonthFirstLast() {

    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if(month==0)
    {
        month=12;
        year=year-1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var firstDay = year + "-" + month + "-" + "01";//上个月的第一天


    var myDate = new Date(year, month, 0);
    var lastDay = year + "-" + month + "-" + myDate.getDate();//上个月的最后一天

    var params = {};
    params.firstDay = firstDay;
    params.lastDay = lastDay;

    return params;
}
function isPoneAvailable(str) {
    var myreg=/^[1]\d{10}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 格式化日期时间
 * @param dateee
 * @returns {string}
 */
function formatDateTime(dateee) {
    var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
    return date;
}


/**
 * 获取date日期month个月前后的日期
 * @param date
 * @param month
 */
function transformationDate(date,month){
    var strDate;
    var oldDate= strToDate(date);
    var newDate = strToDate(date);
    newDate.setMonth(newDate.getMonth() + month);
    var yy1 = newDate.getFullYear();
    var mm1 = newDate.getMonth()+1;//因为getMonth（）返回值是 0（一月） 到 11（十二月） 之间的一个整数。所以要给其加1
    var dd1 = newDate.getDate();
    if (mm1 < 10 ) {
        mm1 = '0'+ mm1;
    }
    if (dd1 < 10) {
        dd1 = '0' + dd1;
    }
    //预计结束日期=开始日期+期限
    if(oldDate.getDate()==newDate.getDate()){  //月末,getDaysInMonth()获取该月的最后一天
        var strDate= yy1+"-"+mm1+"-"+dd1;
    }else{
        var strDate= yy1+"-"+newDate.getMonth()+"-"+new Date(yy1,newDate.getMonth(),0).getDate();
    }
   return strDate;
}
function strToDate(str)
{
    var val=Date.parse(str);
    var newDate=new Date(val);
    return newDate;
}



/**
 *
 * 描述：js实现的map方法
 *
 * @returns {Map}
 */
function HashMap() {
    var struct = function(key, value) {
        this.key = key;
        this.value = value;
    };
    // 添加map键值对
    var put = function(key, value) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                this.arr[i].value = value;
                return;
            }
        }
        ;
        this.arr[this.arr.length] = new struct(key, value);
    };
    // 根据key获取value
    var get = function(key) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i].key === key) {
                return this.arr[i].value;
            }
        }
        return null;
    };
    // 根据key删除
    var remove = function(key) {
        var v;
        for (var i = 0; i < this.arr.length; i++) {
            v = this.arr.pop();
            if (v.key === key) {
                continue;
            }
            this.arr.unshift(v);
        }
    };
    // 获取map键值对个数
    var size = function() {
        return this.arr.length;
    };
    // 判断map是否为空
    var isEmpty = function() {
        return this.arr.length <= 0;
    };

    var keySet = function(){
        var keys = [];
        for (var i = 0; i < this.arr.length; i++) {
            keys[i] = this.arr[i].key;
        }
        return keys;
    };

    this.arr = new Array();
    this.get = get;
    this.put = put;
    this.remove = remove;
    this.size = size;
    this.isEmpty = isEmpty;
    this.keySet = keySet;
}
