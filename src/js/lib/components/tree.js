
var template = `
    <div class="tree-wrapper">
        <div class="search-wrapper">
            <div class="search-input">
                <input type="text" placeholder="请输入搜索内容" />
                <i class="icon-search btn-tree-search"></i>
            </div>
            <div class="search-list" style="display: none;">
                <ul></ul>
            </div>
        </div>
        <ul :id="domId" class="ztree"></ul>
    </div>    
`

Vue.component('z-tree', {
    props: {
        domId: {
            type: String,
            default: ''
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            $("#" + this.domId).initDeptTree({
                treeType : "dept_tree",//树类型：dept_tree 部门组织树  dw_tree 单位组织树
                rootId : 21,
                chkOrNot : false,
                loadingSelector : "TreeLogindata",
                onClick : this.zTreeOnClick,
                onRightClick : this.zTreeononRightClick//如果要右键菜单功能此处必写
            });
        },
        zTreeOnClick(){
            this.$emit('zTreeOnClick',event, treeId, treeNode)
        },
        zTreeononRightClick(){
            this.$emit('zTreeononRightClick',event, treeId, treeNode)
        }
    },
    template: template
})