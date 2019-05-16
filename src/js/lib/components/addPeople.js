
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        var dialogHeaderEl = el.querySelector('.el-dialog__header');
        var dragDom = el.querySelector('.el-dialog');
        dialogHeaderEl.style.cursor = 'move';

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        var sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
        dialogHeaderEl.onmousedown = function(e) {
            // 鼠标按下，计算当前元素距离可视区的距离
            var disX = e.clientX - dialogHeaderEl.offsetLeft;
            var disY = e.clientY - dialogHeaderEl.offsetTop;

            // 获取到的值带px 正则匹配替换
            var styL, styT;

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
            } else {
                styL = +sty.left.replace(/\px/g, '');
                styT = +sty.top.replace(/\px/g, '');
            };

            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离
                var l = e.clientX - disX;
                var t = e.clientY - disY;
                // 移动当前元素
                dragDom.style.left = l + styL + 'px';
                dragDom.style.top = t + styT + 'px';

                //将此时的位置传出去
                //binding.value({x:e.pageX,y:e.pageY})
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
    bind(el, binding, vnode, oldVnode) {
        var dragDom = binding.value.$el.querySelector('.el-dialog');

        el.onmousedown = function(e) {

            // 鼠标按下，计算当前元素距离可视区的距离
            var disX = e.clientX - el.offsetLeft;

            document.onmousemove = function (e) {
                e.preventDefault(); // 移动时禁用默认事件

                // 通过事件委托，计算移动的距离
                var l = e.clientX - disX;
                dragDom.style.width = l + 'px';
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})

var addPeopleTemplate =`
<el-dialog v-dialogDrag width="70%" @open="open" @close="close" :title="title" :visible.sync="visible">
       <el-row class="content-container">
           <el-col v-if="hasTree" :span="6" class="add-people-tree">
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
                   <ul id="dialogTree" class="ztree"></ul>
               </div>
               
           </el-col>
           <el-col :span="18" class="content-inner pt15">
               <el-form :inline="true" :model="formInline" @submit.native.prevent>
                 <el-form-item label="快速搜索：">
                   <el-input v-model="formInline.input" placeholder="请输入账号/姓名/手机号"></el-input>
                 </el-form-item>
                 <el-form-item>
                   <el-button type="primary" @click="onTableQuery">查询</el-button>
                 </el-form-item>
               </el-form>
               <el-table 
                   class="add-people-table"
                   ref="singleTable" 
                   :data="tableData" 
                   border 
                   highlight-current-row 
                   @current-change="handleCurrentChange" 
                   @row-dblclick="confirm"
                   style="width: 100%">
                       <el-table-column type="index" width="50"></el-table-column>
                       <el-table-column prop="account" label="账号"></el-table-column>
                       <el-table-column prop="userName" label="姓名"></el-table-column>
                       <el-table-column prop="deptName" label="部门名称"></el-table-column>
                       <el-table-column prop="positionName" label="职位"></el-table-column>
                       <el-table-column prop="tel" label="手机号码"></el-table-column>
               </el-table> 
               <el-pagination
                   @current-change="handlePageChange"
                   :current-page.sync="pagination.currentPage"
                   :page-size="10"
                   layout="total, prev, pager, next"
                   :total="pagination.total">
               </el-pagination>
           </el-col>
       </el-row>    
       <div slot="footer" class="dialog-footer">
           <el-button @click="cancel">取 消</el-button>
           <el-button type="primary" @click="confirm">确 定</el-button>
       </div>
   </el-dialog>
   `

Vue.component('add-people', {
    props: {
        title: {
            type: String,
            default: ''
        },
        visible: {
            type: Boolean,
            default: false
        },
        hasTree: {
            type: Boolean,
            default: true
        }
    },
    mounted(){

    },
    data () {
        return {
            visible: false,
            formInline: {
                input: ''
            },
            tableData: [],
            currentRow: [],
            keyWord: '',
            deptId: '',
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: ''
            }
        }
    },
    methods: {
        initTree(){
            this.$nextTick(function () {
                $("#dialogTree").initDeptTree({
                    treeType : "dept_tree",//树类型：dept_tree 部门组织树  dw_tree 单位组织树
                    rootId : 21,
                    chkOrNot : false,
                    loadingSelector : "TreeLogindata",
                    onClick : this.zTreeOnClick
                })
            })
        },
        zTreeOnClick(event, treeId, treeNode){
            console.log(treeNode)
            this.deptId = treeNode.id
            this.getData()
        },
        _getData(param,cb){
            getData('/sys/user/list',param,function(res){
                cb(res)
            })
        },
        getData(pageNo){
            var _this = this
            _this._getData({
                keyWord: _this.keyWord,
                pageNo: pageNo || 1,
                pageSize: 10,
                deptId: _this.deptId
            },function(res){
                _this.tableData = res.data.records
                _this.pagination.total = res.data.total
            })
        },
        open(){
            this.getData()
            if(this.hasTree){
                this.initTree()
            }
        },
        close(){
            this.$emit('cancel','cancel')
        },
        cancel(){
            this.$emit('cancel','cancel')
        },
        confirm(){
            if(this.tableData.length === 0){
                this.close()
            }else{
                if(this.currentRow.length === 0){
                    this.$message('请选择一行数据');
                }else{
                    this.$emit('confirm',this.currentRow)
                }
            }
        },
        handleCurrentChange(currentRow){
            this.currentRow = currentRow
        },
        handlePageChange(page){
            this.getData(page)
        },
        onTableQuery () {
            this.keyWord = this.formInline.input
            this.getData()
        }
    },
    template: addPeopleTemplate
})