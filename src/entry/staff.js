import '../sass/common.scss'

import {getData,postData} from '../js/lib/util'

var vueApp = new Vue({
    delimiters: ['${', '}'],
    el: '#vueApp',
    mounted(){
        $('body').fadeIn(100)
    },
    data: function () {
        return {
            form: {
                input: ''
            },
            pages: 1,
            pageSize: 10,
            total: 0,
            tableSelected: [],
            tableData: [{
                userName: 'admin1'
            },{
                userName: 'admin2'
            },{
                userName: 'admin3'
            },{
                userName: 'admin4'
            },{
                userName: 'admin5'
            },{
                userName: 'admin6'
            },{
                userName: 'admin7'
            },{
                userName: 'admin8'
            },{
                userName: 'admin9'
            },],
            currentPage: 1,
            dialog: {
                title: '',
                visible: false,
                form: {
                    userNum: '',
                    userName: '',
                    loginStyle: '',
                    deptName: '',
                    positionName: '',
                    account: '',
                    isactive: '',
                    islogin: '',
                    isrtx: '',
                    isInvisible: '',
                    ischecklocal: '',
                    rightassign: '',
                    ipRightname: '',
                    userGrade_desc: '',
                    tel: '',
                    fax: '',
                    hometel: '',
                    provinceId: '',
                    cityId: '',
                    postcode: '',
                    email: '',
                    idcard: '',
                    sex: '',
                    birthday: '',
                    comdate: '',
                    stature: '',
                    nation: '',
                    nativeplace: '',
                    registerplace: '',
                    education: '',
                    speciality: '',
                    college: '',
                    graduate: '',
                    title: '',
                    party: '',
                    foreignlan1Id: '',
                    foreignlan1level: '',
                    foreignlan1Id: '',
                    foreignlan2level: '',
                    yearleaves: '',
                    smsMonthnum: ''
                }
            }
        }
    },
    created: function(){
        this.getTableData()
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            
        },
        getTableData: function(){
            this._getData({
                keyWord: '',
                pageNo: 1,
                pageSize: 10,
                deptId: ''
            })
        },
        handleSelectionChange: function(rows){
            this.tableSelected = rows
        },
        onQuery: function(){
            this._getData({
                keyWord: this.form.input,
                pageNo: 1,
                pageSize: 10,
                deptId: ''
            })
        },
        onAdd: function(){
            this.dialog.title = '新增'
            this.dialog.visible = true
        },
        onEdit: function(){
            var _this = this
            var tableSelected = _this.tableSelected
            if(tableSelected.length === 0){
                _this.$message({
                    duration: 2000,
                    type: 'warning',
                    message: '请选择需要修改的数据'
                })
                return
            }
        },
        onDelete: function(){
            var _this = this
            var tableSelected = _this.tableSelected
            if(tableSelected.length === 0){
                _this.$message({
                    duration: 2000,
                    type: 'warning',
                    message: '请选择需要删除的数据'
                })
                return
            }
            _this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(function(){
                for(var j=0;j<tableSelected.length;j++){
                    _this.tableData = _this.tableData.filter(function(item){
                        return item != tableSelected[j]
                    })
                }
                _this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }).catch(function(){
                _this.$message({
                  type: 'info',
                  message: '已取消删除'
                })          
              });
            
        },
        _getData: function(param){
            var _this = this
            getData('/sys/user/list',param,function(res){
                _this.tableData = res.data.records
                _this.total = res.data.total
                _this.currentPage = res.data.current
                _this.pages = res.data.pages
                _this.pageSize = res.data.size
            })
        },
    }
})