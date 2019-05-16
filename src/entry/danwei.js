import '../sass/common.scss'

import { getData, postData } from '../js/lib/util'

import '../js/lib/components/addPeople'
import '../js/lib/components/tree'

new Vue({
    el: '#vueApp',
    data() {
        const emptyForm = {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: '',
            dwnum: '',//单位全宗号
            fullname: '',//单位全称
            encode: '',//编码
            grade: '',//单位级别
            fi_order: '',//序号
            property: '',//单位属性
            class: '',//单位类别
            emp_name: '',//单位负责人
            address: '',//单位地址
            tel: '',//联系电话
            charge_name: '',//分级管理员
            id: '',
            org_id: '',
            parent_id: '',
            charge_id: '',
            emp_id: '',
            right_id: ''
        }
        return {
            form: emptyForm,
            addPeopleTitle: '',
            showAddPeople: false,
            currentModel: '',
            currentModelName:'',
            currentModelId:''
        }
    },
    mounted() {
        $('body').fadeIn(100)
    },
    methods: {
        handleIconClick: function (title, modelName, modelId) {
            this.currentModelName = modelName
            this.currentModelId = modelId
            this.addPeopleTitle = title + '选择'
            this.showAddPeople = true
        },
        addPeopleConfirm: function (data) {
            console.log(data)
            this.form[this.currentModelName] = data.userName;
            this.form[this.currentModelId] = data.userId;
            this.showAddPeople = false
        },
        addPeopleCancel: function (data) {
            this.showAddPeople = false
        },
        btnAdd() {
            postData('/sys/dw/insert', {
                id: 0,
                dwName: this.form.name,
                parentId: this.form.id,
                dwNum: this.form.dwnum,
                encode: this.form.encode,
                fullname: this.form.fullname,
                address: this.form.address,
                tel: this.form.tel,
                property: this.form.property,
                dwClass: this.form.class,
                fiOrder: this.form.fi_order,
                grade: this.form.grade,
                orgId: this.form.org_id,
                empId: this.form.emp_id,
                empName: this.form.emp_name,
                chargeId: this.form.charge_id,
                chargeName: this.form.charge_name
            }, res => {
                var treeObj = $.fn.zTree.getZTreeObj("deptTreeCommon")
                var pnode = treeObj.getNodeByParam("id", this.form.id)
                var newNodes = [{
                    id: res.data, pid: this.form.id,
                    name: this.form.name
                }]
                treeObj.addNodes(pnode, newNodes);
            })
        },
        btnUpdate() {
            postData('/sys/dw/update', {
                id: this.form.id,
                dwName: this.form.name,
                dwNum: this.form.dwnum,
                encode: this.form.encode,
                fullname: this.form.fullname,
                address: this.form.address,
                tel: this.form.tel,
                property: this.form.property,
                dwClass: this.form.class,
                fiOrder: this.form.fi_order,
                grade: this.form.grade,
                orgId: this.form.org_id,
                empId: this.form.emp_id,
                chargeId: this.form.charge_id,
                empName: this.form.emp_name,
                chargeName: this.form.charge_name
            }, res => {
                var treeObj = $.fn.zTree.getZTreeObj("deptTreeCommon");
                var node = treeObj.getNodeByParam("id", this.form.id, null);
                node.name = this.form.name;
                treeObj.updateNode(node);
            })
        },
        btnDelete() {
            var treeObj = $.fn.zTree.getZTreeObj("deptTreeCommon")
            postData('/sys/dw/delete', {
                id: this.form.id
            }, res => {
                var node = treeObj.getNodeByParam("id", this.form.id);
                var pnode = node.getParentNode();
                treeObj.removeNode(node);
                treeObj.refresh();
            })
        },
        getDwData(event, treeId, treeNode) {
            getData(`/sys/dw/getDwInfo?id=${treeNode.id}`, {}, res => {
                if (res.data != undefined) {
                    this.form.name = data.data.dwName;
                    this.form.id = data.data.id;
                    this.form.parent_id = data.data.parent_id;
                    this.form.dwnum = data.data.dwNum;
                    this.form.encode = data.data.encode;
                    this.form.fullname = data.data.fullname;
                    this.form.address = data.data.address;
                    this.form.tel = data.data.tel;
                    this.form.property = data.data.property;
                    this.form.class = data.data.dwClass;
                    this.form.fi_order = data.data.fiOrder;
                    this.form.grade = data.data.grade;
                    this.form.org_id = data.data.orgId;
                    this.form.emp_name = data.data.empName;
                    this.form.charge_name = data.data.chargeName
                }
            })
        }
    }
})   