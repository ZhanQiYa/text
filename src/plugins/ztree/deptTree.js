/**
 * 使用说明
 * <link rel="stylesheet" href="../../plugins/zTree/css/zTreeStyle.css">
 * <script src="../../plugins/zTree/js/jquery.ztree.all-3.5.min.js"></script>
 * 1,	js引用:deptTree.js  如果需要搜索请引入：<script src="../../js/modules/comm/searchTree.js"></script>
 * 2,	页面:
 *			<div class="search-wrapper">
 *				<div class="search-input">
 *					<input type="text" placeholder="请输入搜索内容" />
 *					<i class="icon-search btn-tree-search"></i>
 *				</div>
 *				<div class="search-list" style="display: none;">
 *					<ul></ul>
 *				</div>
 *			</div>
 *
 *			<ul id="deptTreeCommon" class="ztree"></ul>
 *
 * 3,	js初始化:
 * 	 		$("#treeDemo").initDeptTree({
				treeType : "dept_tree",//树类型：dept_tree 部门组织树  dw_tree 单位组织树
				rootId : -1,//小于0 就取当前登录用户的为根节点
				chkOrNot : false,
				loadingSelector : "TreeLogindata",//加载login id
				onClick : zTreeOnClick  //点击事件回掉函数
				onRightClick : zTreeononRightClick//如果要右键菜单功能此处必写
			});
 *			
 *			//客户树节点的点击事件,
 *			function zTreeOnClick(event, treeId, treeNode) {
 *				console.info(treeId);
 *				console.info(treeNode);
 *			};
 *	4,扩展功能
 *		右键菜单功能本js之下引入 <script src="../../js/modules/comm/treerightmeun.js"></script>
 *		回调方法 1.callbackTreeAdd 新增节点
 *				2.callbackTreeDel 删除节点
 * 	 
 */

(function($) {
	$.fn.initDeptTree = function(options) {
		var tree_type_url=new HashMap();
		tree_type_url.put("dept_tree","/sys/tree/getDeptByIds,/sys/tree/getDeptByPid");
		tree_type_url.put("dw_tree","/sys/tree/getDwByIds,/sys/tree/getDwByPid");


		window._treeLoadType_to_searchjs = options.treeType;
		/**
		 * 客户树类型
		 */
		//var _dept_tree_type_arr = ["dept_tree" ];
		var _dept_tree_key;
		var _dept_setting;

		var _dept_fullParent = "";
		var _dept_locationDeptId = "";
		var _dept_parentNode = "";
		
		var _dept_search_colors = [];
		
		var defaults = {
			treeType :options.treeType,			//客户树类型
			treeId : $(this).attr("id"),				//treeId
			zNodes : null,
			async : true,								//加载方式,默认为同步加载
			rootId : "",							//首个节点ID
			search_btn_selector:"cusTreeSearchBtn",		//收索按钮ID
			search_input_selector : "cusTreeKey",		//收索文本框ID
			loadingSelector : "TreeLogindata",			//加载样式标签ID(树加载完毕之前)
			chkOrNot : false,							//树节点是否可勾选
			beforeClick : null,
			onClick : null,						//节点点击事件回调函数名称
			beforeCheck : null,					//用于捕获 勾选 或 取消勾选 之前的事件回调函数
			onCheck : null,						//用于捕获 checkbox / radio 被勾选 或 取消勾选的事件回调函数
			onMouseUp : null,
			onRightClick : null,
			zTreeOnAsyncSuccess : zTreeOnAsyncSuccess,
			needToSearch: true                 //是否需要搜索功能，默认为true
		};
		var opts = $.extend(defaults, options);
		/**
		 * 初始化setting
		 */
		function initDeptSetting() {
			_dept_setting = {
				async : {
					enable : true,
					type : "post",
					contentType : "application/x-www-form-urlencoded",
					url : tree_type_url.get(opts.treeType).split(",")[1],
					autoParam : [ "id=parentId"],
					dataFilter : ajaxDataFilter
				},
				view : {
					showLine : true,
					showTitle : true,
				    showIcon: true
				},
				check: {
					enable: opts.chkOrNot,
					chkStyle: "radio",
					radioType: "all"
				},
				data : {
					simpleData : {
						enable : true
					},
					keep : {
						parent : true
					}
				},
				callback : {
					beforeCheck : opts.beforeCheck,
					onCheck : opts.onCheck,
					beforeClick : opts.beforeClick,
					onClick : opts.onClick,
					onMouseUp : opts.onMouseUp,
					onRightClick : opts.onRightClick,
					onAsyncSuccess: opts.zTreeOnAsyncSuccess
				}
			}
		}
		
		/**
		 * 初始化树
		 */
		function initDeptTree() {
			initDeptSetting();

			if(opts.zNodes){
				initZnodesTreeData();
			}else{
				initTreeData();
			}

			if(opts.needToSearch){
				initSearchEvents()
			}else{
				$('.search-wrapper').hide()
			}
		}
		function initTreeData() {
			$.ajax({
				type : "post",
				async : opts.async,
				cache : true,
				dataType : "json",
				url : tree_type_url.get(opts.treeType).split(",")[0],
				data : {"rootId" : opts.rootId},
				success : function(ret) {
					if (ret.code == 0) {
						var treeObj = $.fn.zTree.init($("#" + opts.treeId),_dept_setting, ret.data);
						$("#" + opts.loadingSelector).hide();

						//默认展开第一级节点
						//var nodes = treeObj.getNodes();
						//treeObj.expandNode(nodes[0], true, false, false);
						return treeObj;
					}
				},
				error : function(e) {
					// ajaxError("customTree", e);
					console.log(e)
				}
			});
		}
		
		function initZnodesTreeData(){
			$.fn.zTree.init($("#" + opts.treeId),_dept_setting, opts.zNodes);
		}
		
		function beforeClick(treeId, treeNode, clickFlag){
			return !opts.chkOrNot;
		}
		
		function findParent(zTree, node) {
			//zTree.expandNode(node, true, false, false);
			var pNode = node.getParentNode();
			if (pNode != null) {
				nodeList.push(pNode);
				findParent(zTree, pNode);
			}
		}
		function filter(node) {
			return !node.isParent && node.isFirstNode;
		}
		function ajaxDataFilter(treeId, parentNode, responseData) {

			return responseData.data;
		}
		

		
		//定位部门
		window.locationDept =  function(deptId,fullParent){
			var treeObj = $.fn.zTree.getZTreeObj(opts.treeId);
			var parentArray = "";
			if(fullParent){
				_dept_fullParent = fullParent;
				parentArray = fullParent.substring(0,fullParent.length-1).split(',');
			}else{
				var node = treeObj.getNodesByParam("id", deptId, null);
				treeObj.expandNode(node, false,true);
				if(opts.chkOrNot){
					//
				}else{
					if(!opts.chkOrNot){
						if(opts.beforeClick){
							opts.beforeClick(opts.treeId,v,null);
						}
						if(opts.onClick){
							treeObj.selectNode(node[0],false);
							opts.onClick(null,opts.treeId,node[0]);
						}
					}else{
						//treeObj.checkNode(node[0],true,true);
						if(opts.beforeCheck){
							opts.beforeCheck(opts.treeId,node[0]);
						}
						if(opts.onCheck){
							treeObj.checkNode(node[0],true,true);
							opts.onCheck(null,opts.treeId,node[0]);
						}
						if(opts.beforeClick){
							opts.beforeClick(opts.treeId,node[0],null);
						}
						if(opts.onClick){
							opts.onClick(null,opts.treeId,node[0]);
						}
					}
				}

				return false;
			}
			if(deptId){
				var nodes = treeObj.getNodesByParam("id", deptId, _dept_parentNode);
				_dept_locationDeptId = deptId;
				var flag = true;
				if(nodes && nodes.length>0){
					$.each(nodes,function(i,v){
						if(v.fullParentId == fullParent){
							if(opts.treeId != opts.treeId){
								if(_dept_parentNode){
									treeObj.checkNode(_dept_parentNode,true,true,true,true);
								}else{
									if(v.getParentNode() && v.getParentNode().id == old_parentId){
										_dept_parentNode = v.getParentNode();
										//treeObj.checkNode(_dept_parentNode,true,true,true,true);
									}
								}
								//disableNode(treeId,userId);
							}else{
								treeObj.expandNode(v, false,true);

								if(!opts.chkOrNot){
									//treeObj.selectNode(defaultNode[0],false);
									if(opts.beforeClick){
										opts.beforeClick(opts.treeId,v,null);
									}
									if(opts.onClick){
										opts.onClick(null,opts.treeId,v);
									}
								}else{
									//treeObj.checkNode(v,true,true);
									if(opts.beforeCheck){
										opts.beforeCheck(opts.treeId,v);
									}
									if(opts.onCheck){
										treeObj.checkNode(v,true,true);
										opts.onCheck(null,opts.treeId,v);
									}
									if(opts.beforeClick){
										opts.beforeClick(opts.treeId,v,null);
									}
									if(opts.onClick){
										opts.onClick(null,opts.treeId,v);
									}
								}

								/*
								if(opts.onClick){
									treeObj.selectNode(v);
									opts.onClick(null,opts.treeId,v);
								}*/
							}
							_dept_locationDeptId = "";
							_dept_fullParent = "";
							_dept_parentNode = "";
							flag = false;
						}
					});
				}
				if(flag){
					if(parentArray && parentArray.length>0){
						//console.info("parentArray..........."+parentArray);
						$.each(parentArray,function(i,v){
							_dept_parentNode = treeObj.getNodeByParam("id", v, _dept_parentNode);
							if(_dept_parentNode){
								if(!_dept_parentNode.open){
									treeObj.expandNode(_dept_parentNode, true, false, true,true );
									if(!_dept_parentNode.zAsync){
										return false;
									}
								}
							}
						});
					}
				}
			}
		}
		

		function zTreeOnAsyncSuccess(event, treeId, treeNode){

			if(_dept_locationDeptId ){
				locationDept(_dept_locationDeptId,_dept_fullParent);

				var treeObj = $.fn.zTree.getZTreeObj(opts.treeId);
				var nodes = treeObj.getNodeByParam("id", _dept_locationDeptId);
				treeObj.cancelSelectedNode();
				treeObj.selectNode(nodes,true);
			}
		}
		return initDeptTree();
	}
})(jQuery);