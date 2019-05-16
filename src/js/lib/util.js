function ajax(api,method,param,cb) {
    if(__DEV__){
        api = '/dev/' + api
    }
    $.ajax({
        type: method,
        url: api,
        data: param || {},
        dataType: "json",
        success: function (data) {
            cb(data)
        },
        error: function (e) {
            console.log(e);
        }
    })
}

export function getData(api,param,cb) {
    ajax(api,'GET',param,cb)
}

export function postData(api,param,cb) {
    ajax(api,'POST',param,cb)
}