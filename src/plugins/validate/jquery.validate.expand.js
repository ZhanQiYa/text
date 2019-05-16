$(function () {
    //手机号码
    jQuery.validator.addMethod("Mobile", function (value, element) {
        var length = value.length;
        var regPhone = /^1([3578]\d|4[57])\d{8}$/;
        return this.optional(element) || (length == 11 && regPhone.test(value));
    }, "请正确填写您的手机号码。");

    //邮编
    jQuery.validator.addMethod("ZipCode", function (value, element) {
        var tel = /^[0-9]{6}$/;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写您的邮政编码");

    //正整数
    jQuery.validator.addMethod("PositInteger", function (value, element) {
        var tel = /^[1-9]+\d*$/;
        return this.optional(element) || (tel.test(value));
    }, "值必须为正整数");

    //整数
    jQuery.validator.addMethod("PositInt", function (value, element) {
        var tel = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/;
        return this.optional(element) || (tel.test(value));
    }, "值必须为整数");

    //保留2位小数
    jQuery.validator.addMethod("PositDouble", function (value, element) {
        var tel = /^\d+(\.\d{1,2})?$/;
        return this.optional(element) || (tel.test(value));
    }, "值必须为数字且小数点后最多2位");

    jQuery.validator.addMethod("PositZero", function (value, element) {
        var tel = /^\d*\.{0,1}\d{0,4}$/;
        return this.optional(element) || (tel.test(value));
    }, "值必须为输入整数和小数");
});