import '../sass/common.scss'

import { getData, postData } from '../js/lib/util'

import '../js/lib/components/tree'

new Vue({
    el: '#vueApp',
    delimiters: ['${', '}'],
    data : function() {
        return {
            form: {
                labelPosition: 'right',
                deptName: '',
                deptCode: '',
                encode: '',
                orgCode: '',
                fiOrder: '',
                empnum: '',
                isVisible: ''
            },
            treeSearchInput: '',
            showSearch: false,
            searchData: [],
            searchLoading: false,
            dwList: {
                model: '',
                options: []
            },
            positionList: {
                model: '',
                options: []
            },
            tableData: []
        }
    },
    created: function () {
        this.getPositionData();
    },
    mounted(){
        $('body').fadeIn(100)
    },
    computed: {
        filterSearchData: function(){
            var input = this.treeSearchInput,
                searchData = this.searchData
            if(typeof searchData === Object){
                var data = searchData.map(function(item,index){
                    if(item.deptName.indexOf(input) > -1){
                        return item.deptName.replace(input,'<span>'+ input +'</span>')
                    }else{
                        return item.deptName
                    }
                })
                return data
            }else{
                return ['<p class="text-center">' + searchData + '</p>']
            }

        }
    },
    methods: {
        btnInsert:function(){
            // 获取界面文本框的值
            //"
            var _this = this;
            /*ajaxData("/sys/dept/insert",'post',{
                "deptName": _this.form.deptName,
                "deptNum":_this.form.deptNum,
                "encode":_this.form.encode,
                "encode":_this.form.encode,
                "dwId":_this.form.dwList.model,
                "orgCode":_this.form.orgCode,
                "fiOrder":_this.form.fiOrder,
                "empnum":_this.form.empnum,
                "mPositionId":_this.positionList.model,
                "isVisible":_this.form.isVisible,
            },function(res){
                // 重新加载树
                alert('ok');
            });*/
            console.log(_this.positionList.model)
            postData("/sys/dept/insert",'post',{
                "deptName": _this.form.deptName,
                "deptNum":_this.form.deptNum,
                "encode":_this.form.encode,
                "encode":_this.form.encode,
                "orgCode":_this.form.orgCode,
                "fiOrder":_this.form.fiOrder,
                "empnum":_this.form.empnum,
                "mPositionId":_this.positionList.model,
                "isVisible":_this.form.isVisible,
            },function(res){
                // 重新加载树
                alert('ok');
            });
        },
        tableRowClassName:function(row, rowIndex ) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        handleOpen:function(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose:function(key, keyPath) {
            console.log(key, keyPath);
        },
        handleTreeSearch:function () {
            var vm = this
            this.showSearch = true
            this.searchLoading = true
            getData('/sys/dept/getByDeptNameList',{
                'deptName': this.treeSearchInput
            },function(res){
                if(res.data.length){
                    vm.searchData = res.data
                }else{
                    vm.searchData = '无相关数据'
                }
                vm.searchLoading = false
            })
        },
        onSearchInputBlur: function(){
            this.showSearch = false
        },
        onSearchListClick:function(index){
            var vm = this
            var data = vm.searchData
            console.log(data[index])
            this.treeSearchInput = data[index].deptName
            this.showSearch = false
        },
        getPositionData: function () {
            var vm = this;
           /* $.ajax({
                url : "/sys/dept/getPositionData", 　
                type : 'get',　　　　　　　　
                data : {},
                dataType : 'json',
                success: function(res){　　　<!--回调函数 -->
                    //console.log(res.data);   <!-- 浏览器控制台显示返回内容（建议使用） !-->
                    vm.positionList.options = res.data;
                }
            });*/
            getData("/sys/dept/getPositionData",{},function (res) {
                // console.log(res.data);
                vm.positionList.options = res.data.map(function (item,index) {
                    return {
                        value: item.id,
                        label: item.positionName
                    }
                });
                console.log(vm.positionList.options)
            });
        },
        getDwData: function () {
            var vm = this;
            getData("/sys/dept/getDwData",{},function (res) {
                vm.dwList.options = res.data.map(function (item,index) {
                    return {
                        value: item.id,
                        positionName: item.positionName
                    }
                });
            });

        }

    }
})