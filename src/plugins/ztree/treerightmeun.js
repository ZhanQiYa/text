
var rMenuHtml = '<div id="rMenu">';
    rMenuHtml+='<ul>';
    rMenuHtml+='<li id="m_add" onclick="addTreeNode();">新增</li>';
    rMenuHtml+='<li id="m_del" onclick="removeTreeNode();">删除</li>';
    rMenuHtml+=' </ul>';
    rMenuHtml+=' </div>';
$("body").append(rMenuHtml);
var treeObj, rMenu;


function zTreeononRightClick(event, treeId, treeNode) {
    treeObj = $.fn.zTree.getZTreeObj(treeId);
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
        treeObj.cancelSelectedNode();
        showRMenu("root", event.clientX, event.clientY);
    } else if (treeNode && !treeNode.noR) {
        treeObj.selectNode(treeNode);
        showRMenu("node", event.clientX, event.clientY);
    }
}
function showRMenu(type, x, y) {


    rMenu = $("#rMenu");
    $("#rMenu ul").show();
    if (type=="root") {
        $("#m_del").hide();
        $("#m_check").hide();
        $("#m_unCheck").hide();
    } else {
        $("#m_del").show();
        $("#m_check").show();
        $("#m_unCheck").show();
    }

    y += document.body.scrollTop;
    x += document.body.scrollLeft;
    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

    $("body").bind("mousedown", onBodyMouseDown);
}
function onBodyMouseDown(event){
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
        rMenu.css({"visibility" : "hidden"});
    }
}
function hideRMenu() {
    if (rMenu) rMenu.css({"visibility": "hidden"});
    $("body").unbind("mousedown", onBodyMouseDown);
}

function addTreeNode() {
    hideRMenu();
    /*var newNode = { name:"增加test"};
    if (treeObj.getSelectedNodes()[0]) {
        newNode.checked = treeObj.getSelectedNodes()[0].checked;
        treeObj.addNodes(treeObj.getSelectedNodes()[0], newNode);
    } else {
        treeObj.addNodes(null, newNode);
    }*/
    var selectNodes = treeObj.getSelectedNodes()[0];
    callbackTreeAdd(treeObj,selectNodes)
}
function removeTreeNode() {
    hideRMenu();
    var selectNodes = treeObj.getSelectedNodes();
    callbackTreeDel(treeObj,selectNodes)
}