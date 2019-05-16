//校验逾期天数输入合法性
function validateOverDueDaysInput(dayStart, dayEnd) {
    var daysInputNum = 0;
    var msg = '逾期天数输入非法';
    if (dayStart != null && typeof dayStart != 'undefined' && dayStart.length > 0) {
        if (isNaN(dayStart)) {
            alert(msg);
            return false;
        }
        dayStart = dayStart * 1;
        if (dayStart <= 0 || dayStart > 99999) {
            alert(msg);
            return false;
        }
        daysInputNum++;

    }
    if (dayStart != null && typeof dayEnd != 'undefined' && dayEnd.length > 0) {
        if (isNaN(dayEnd)) {
            alert(msg);
            return false;
        }
        dayEnd = dayEnd * 1;
        if (dayEnd <= 0 || dayEnd > 99999) {
            alert(msg);
            return false;
        }
        daysInputNum++;
    }
    if (daysInputNum == 2 && dayStart > dayEnd) {
        alert(msg);
        return false;
    }
    return true;
}

//校验手机号码
function validateTelNoInput(telNo) {
    if (telNo != null && typeof telNo != 'undefined' && telNo.length > 0) {
        if (!/^\d{11}$/.test(telNo)) {
            alert('电话号码输入非法');
            return false;
        }
    }
    return true;
}