import '../sass/common.scss'
import '../sass/index.scss'

import {getData,postData} from '../js/lib/util'

new Vue({
    el: '#index',
    delimiters: ['${', '}'],
    created: function () {
        this.getMenuList();
        this.getUser();
    },
    data(){
        return{
            iframeSrc: 'main.html',
            user: {},
            menuList: {},
            roleList: {},
            main: "main.html",
            password: '',
            newPassword: '',
            navTitle: "欢迎页",
            menuActive: '1',
            menuData: [
                {
                    iconCls: 'el-icon-s-home',
                    title: '首页',
                    link: 'main.html'
                },
                {
                    iconCls: 'el-icon-menu',
                    title: '部门设置',
                    link: 'dept.html'
                },
                {
                    iconCls: 'el-icon-document',
                    title: '单位管理',
                    link: 'danwei.html'
                },
                {
                    iconCls: 'el-icon-document',
                    title: '机构管理',
                    link: 'organization.html'
                },
                {
                    iconCls: 'el-icon-document',
                    title: '岗位设置',
                    link: 'position.html'
                },
                {
                    iconCls: 'el-icon-document',
                    title: '人员管理',
                    link: 'staff.html'
                },
            ]
        }
    },
    computed: {
        contentStyle(){
            return {
                height: $(window).height() - 101 + 'px'
            }
        }
    },
    methods: {
        getMenuList: function () {
            // $.getJSON(baseURL + "sys/menu/nav", function (r) {
            //     vm.menuList = r.menuList;
            //     window.permissions = r.permissions;

            //     //路由
            //     var router = new Router();
            //     routerList(router, vm.menuList);
            //     router.add('#particulars/postLoanDetails.html', function () {
            //         var url = window.location.hash;
            //         vm.main = url.replace('#', '');
            //         vm.navTitle = '';
            //     });
            //     router.start();
            // });
            getData("sys/menu/nav",{},function(res){
                console.log(res)
            })
        },
        getUser: function () {
            $.getJSON(baseURL + "sys/user/info", function (r) {
                vm.user = r.user;
            });
        },
        updatePassword: function () {
            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "修改密码",
                area: ['550px', '270px'],
                shadeClose: false,
                content: jQuery("#passwordLayer"),
                btn: ['修改', '取消'],
                btn1: function (index) {
                    var data = "password=" + vm.password + "&newPassword=" + vm.newPassword;
                    $.ajax({
                        type: "POST",
                        url: baseURL + "sys/user/password",
                        data: data,
                        dataType: "json",
                        success: function (r) {
                            if (r.code == 0) {
                                layer.close(index);
                                layer.alert('修改成功', function () {
                                    location.reload();
                                });
                            } else {
                                layer.alert(r.msg);
                            }
                        }
                    });
                }
            });
        },
        logout: function () {
            var token = localStorage.getItem("token");
            $.ajax({
                type: "POST",
                url: baseURL + "sys/logout/logoutUpdateTime",
                data:{"token":token},
                dataType: "json",
                success:function (ret) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("loginStatus");

                    setTimeout(function () {
                        location.href = baseURL + 'login.html';
                    },500);
                }
            });
        },
        getRoleList: function () {
            $.get(baseURL + "sys/role/select", function (r) {
                vm.roleList = r.list;
            });
        },
        showUserInfo: function () {
            this.getRoleList();
            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "用户信息",
                area: ['550px', '470px'],
                shadeClose: false,
                content: jQuery("#userInfoLayer"),
                btn: ['修改', '取消'],
                btn1: function (index) {
                    $.ajax({
                        type: "POST",
                        url: baseURL + "sys/user/updateBasicInfo",
                        data: JSON.stringify(vm.user),
                        dataType: "json",
                        contentType: "application/json",
                        success: function (r) {
                            if (r.code == 0) {
                                layer.close(index);
                                layer.alert('修改成功', function () {
                                    location.reload();
                                });
                            } else {
                                layer.alert(r.msg);
                            }
                        }
                    });
                }
            });
        },
        donate: function () {
            layer.open({
                type: 2,
                title: false,
                area: ['806px', '467px'],
                closeBtn: 1,
                shadeClose: false,
                content: ['', 'no']
            });
        },
        onMenuClick(linkUrl){
            // $('#index_frame').attr('src',linkUrl)
            this.iframeSrc = linkUrl
        }
    }
})