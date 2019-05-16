import '../sass/common.scss'

import {getData,postData} from '../js/lib/util'
import '../js/lib/components/addPeople'

var vm = new Vue({
    el: '#vueApp',
    data: function(){
        return {
            orginfo: {
                id: "",
                //上级ID
                parentId: "",
                //机构名称
                orgName: "",
                //机构代码
                orgNum: "",
                //国家
                address1: "",
                //省/市/自治区
                address2: "",
                //市/县/区
                address3: "",
                //地址
                address4: "",
                //网站主页
                httpsite: "",
                //web服务
                webserver: "",
                //email
                email: "",
                //主题风格
                orgImgFoldername: "",
                //图片ICO
                imgIco: "",
            },
            testValue: "",
            showAddPeople: false
        }

    },
    created: function(){
        this.getFormData()
    },
    mounted(){
        $('body').fadeIn(100)
    },
    methods: {
        getFormData: function(cb){
            var _this = this
            getData('/sys/org/getorginfo',{},function(res){
                _this.orginfo = res.data
                if(_this.orginfo.imgIco){
                    $('#logo', window.parent.document).attr('src',_this.orginfo.imgIco)
                }
                cb && cb()
            })
        },
        uploadsuccess: function (ret) {
            this.orginfo.imgIco = ret.data.relpath
            this.$message({
                message: '上传成功',
                type: 'success'
            });
        },
        onSaveClick: function(){
            var _this = this
            getData('/sys/org/updatebyorg',this.orginfo,function(res){
                _this.getFormData(function(){
                    _this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                })
            })
        },
        handleIconClick: function(){
            this.showAddPeople = true
        },
        addPeopleConfirm: function(data){
            this.showAddPeople = false
        },
        addPeopleCancel: function (data) {
            this.showAddPeople = false
        }
    }
})