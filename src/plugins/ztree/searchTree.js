

var tree_type_search_url = new HashMap();
tree_type_search_url.put("dept_tree", "/sys/tree/getByDeptNameList,/sys/tree/getByDeptIdByParentIds");
tree_type_search_url.put("dw_tree", "/sys/tree/getByDwNameList,/sys/tree/getByDwIdByParentIds");
tree_type_search_url.put("dept_tree_name", "deptName");
tree_type_search_url.put("dw_tree_name", "dwName");

function ajax(api, method, param, cb) {
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

function getData(api, param, cb) {
    ajax(api, 'GET', param, cb)
}

function postData(api, param, cb) {
    ajax(api, 'POST', param, cb)
}

function getInputVal() {
    return $('.search-input input').val()
}

//高亮显示搜索关键字
function highLightKeyWord(data) {
    var input = getInputVal()
    var temp = data.map(function (item, index) {

        var name = tree_type_search_url.get(_treeLoadType_to_searchjs + "_name");
        if (item[name].indexOf(input) > -1) {
            return {
                id: item.id,
                parentId: item.parentId,
                deptName: item[name].replace(input, '<span>' + input + '</span>')
            }
        } else {
            return {
                id: item.id,
                parentId: item.parentId,
                deptName: item[name]
            }
        }
    })
    return temp
}

//渲染列表
function render(data) {
    var html = ''
    if (typeof data === 'string') {
        html = '<li><p class="text-center">' + data + '</p></li>'
    } else {
        for (var i = 0; i < data.length; i++) {
            html += '<li data-parentId="' + data[i].parentId + '" data-id="' + data[i].id + '">' + data[i].deptName + '</li>'
        }
    }
    $('.search-list ul').html(html)
    $('.search-list').show()
}

//点击搜索列表
function bindListEvent($btn) {
    var $listItem = $btn.parents('.search-wrapper').find('li')
    $listItem.on('click', function () {
        var deptId = $(this).attr('data-id');
        getData(tree_type_search_url.get(_treeLoadType_to_searchjs).split(",")[1], {
            'rootId': deptId
        }, function (ret) {
            var parentId = ret.data;
            locationDept(deptId, parentId);
            //$('.search-input input').val($(this).text())
            $('.search-list').hide()
        })
    })
}

//初始化事件
function initSearchEvents() {
    //输入框事件处理
    $(document).on('click', function (e) {
        if (e.target.nodeName === 'INPUT') return
        $('.search-input input').blur();
    })
    $('.search-input input').on('blur', function () {
        $('.search-list').hide()
    })

    //搜索图标点击
    $('.btn-tree-search').on("click", function () {
        if (getInputVal() === "") return
        var $this = $(this)
        getData(tree_type_search_url.get(_treeLoadType_to_searchjs).split(",")[0], {
            'keyWord': getInputVal()
        }, function (res) {
            if (res.data.length) {
                render(highLightKeyWord(res.data))
                bindListEvent($this)
            } else {
                render('无相关数据')
            }
        })
    })
}
