/**
 * 这里是书籍列表模块
 * @type {[type]}
 */

var bookListModule = angular.module("BookListModule", []);
bookListModule.controller('BookListCtrl', function($scope, $http, $state, $stateParams) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.books = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    //这里可以根据路由上传递过来的bookType参数加载不同的数据
    console.log($stateParams);
    $scope.getPagedDataAsync = function(pageSize, page, searchText) {
        setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('../data/books' + $stateParams.bookType + '.json')
                    .success(function(largeLoad) {
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data, page, pageSize);
                    });
            } else {
                $http.get('../data/books' + $stateParams.bookType + '.json')
                    .success(function(largeLoad) {
                        $scope.setPagingData(largeLoad, page, pageSize);
                    });
            }
        }, 1000);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'books',
        rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            '<div ng-cell></div>' +
            '</div></div>',
        multiSelect: false,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEdit: true,
        enablePinning: true,
        columnDefs: [{
            field: 'index',
            displayName: '序号',
            width: 60,
            pinnable: false,
            sortable: false
        }, {
            field: 'name',
            displayName: '书名',
            enableCellEdit: true
        }, {
            field: 'author',
            displayName: '作者',
            enableCellEdit: true,
            width: 220
        }, {
            field: 'pubTime',
            displayName: '出版日期',
            enableCellEdit: true,
            width: 120
        }, {
            field: 'price',
            displayName: '定价',
            enableCellEdit: true,
            width: 120,
            cellFilter: 'currency:"￥"'
        }, {
            field: 'bookId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a ui-sref="bookdetail({bookId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
        }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
});


/**
 * 这里是书籍详情模块
 * @type {[type]} detialMoudle
 */

var bookDetailModule = angular.module("BookDetailModule", []);
bookDetailModule.controller('BookDetailCtrl', function($scope, $http, $state, $stateParams) {
    console.log($stateParams);
    //请模仿上面的代码，用$http到后台获取数据，把这里的例子实现完整
    
});

/**
 * 左侧 menu 菜单
 */

angular.module('routerApp').controller('AccordionCtrl', function ($scope) {

});


/********************************************************************************************************************
 *                                                      客户列表页
 ********************************************************************************************************************/

angular.module('customerlistMoudle',[]).controller('CustomerCtrl', function ($scope,$http,$uibModal,$alert) {
     /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
    $scope.show = false;
    $scope.allShow = false;
    $scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow;
    }
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }
    }    
    /*分页*/
    $scope.itemsPerPage = 5;
    // $scope.totalItems = 6;
    $scope.currentPage = 1;

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /*客户状态*/
        $scope.progress = data.progress;
        /* 客户标签*/
        $scope.tags = data.tags;


    })
    /*线索*/
    $http({
        url:'data/customers.json',
        method:'GET'
    }).success(function(data){
        $scope.customers=data.customers;   
    })

    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        $http({
            method: 'POST',
            url: 'http://localhost/angularcode/src/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: value
        }).success(function(data){
            console.log('success')
        })
        
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }
    /*标签过滤*/
    $scope.tagSortFuc = function(value){
        $scope.tagSort = value;
    }

    /*选择客户状态*/
    $scope.selectProgress = function(value,progress){
        value.progress = progress.value;
        $http({
            method: 'POST',
            url: 'http://localhost/angularcode/src/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: value
        }).success(function(data){
           
        })

    }
    /* 单个移动分组*/
    $scope.perMoveGroup = function(value,selected){
        var index = findIndex(value,$scope.customers);
        $scope.customers[index].group = selected.value;
    }
    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
        
    }

    /***************************** 以下是顶部导航栏批量操作 **************************************/

    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.customers){
            $scope.customers[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.customers){
                $scope.checkArr.push($scope.customers[i]);
                $scope.customers[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.customers);
            $scope.customers[index].isTop = true;      //固定
            $scope.customers[index].isChecked = false;  //去掉标记位，也就是去掉勾
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.customers);
            $scope.customers[index].isTop = false;      //取消固定
            $scope.customers[index].isChecked = false;  //去掉标记位，也就是去掉勾
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 移动分组 ----批量操作 */
    $scope.moveGroup = function(value,selected){
        for(var i in value){
            var index = findIndex(value[i],$scope.customers);
            $scope.customers[index].group = selected.value;
            $scope.customers[index].isChecked = false;  //去掉标记位
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //关闭顶部导航栏
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteClue = function(value){
        var deleteConfirm = confirm('您确定要删除来之不易的线索信息吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.customers);
                $scope.customers.splice(index,1);   //删除
                $scope.customers[index].isChecked = false;  //去掉标记位
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800,"remind":[{"date":today,}]};     //初始空数据
    /* 客户设置 */
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

});

/********************************************************************************************************************
 *                                                      客户详情页
 ********************************************************************************************************************/
angular.module("detialMoudle", ['ngSanitize', 'ui.select']).controller('CustomerDetialCtrl', function($scope, $http, $state, $stateParams,$uibModal) {
    //客户星级提示
    // $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');
    $scope.sexs = [
            {"value":"0","label":"男"},
            {"value":"1","label":"女"}
        ];

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 国家/地区 */
        $scope.states = data.states;
        /* 国家/地区 */
        $scope.sts =data.sts;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        /* 客户标签*/
        $scope.tags = data.tags;

    })

    /* 客户详情对象 */
    $http({
        url:'data/cluedetial.json',
        method:'GET'
    }).success(function(data){
        $scope.customer=data;   
    })
    
    /* 添加联系人 */
    $scope.cusadd = function(){
        $scope.customer.peoples.push({sex:'0',isImportant:false,isEdit:false});     //默认未收藏联系人，可编辑状态
    }
    /* 删除联系人 */
    $scope.cusdel = function(index){
        if ($scope.customer.peoples.length >1){
            var deleteConfirm = confirm('您确定要删除此联系人？');
            if(deleteConfirm){
                $scope.customer.peoples.splice(index,1);
            }
        }
    }
    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[value].splice(index,1);
        }
    }
    /* 完成日程 */
    $scope.schecomp = function(index,value){
        var now_date = new Date();
        var completeData = $scope.customer[value][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }
    /* 撤销日程 */
    $scope.schereply = function(index,value){
        $scope.customer.schedule.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }

    /* 修改商机弹窗 */
    $scope.openBusiness = function (index) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop:'static',
            templateUrl: 'business.html',
            controller: 'ModalBusinessCtrl',
            resolve: {
                business: function () {
                    return $scope.customer.business[index];
                }
            }
        });
        
    }

    /* 客户标签 */
    $scope.counter = 0;
    $scope.onSelectCallback = function (item, model){
        $scope.counter++;
        $scope.eventResult = {item: item, model: model};
    };

    $scope.removed = function (item, model) {
        $scope.lastRemoved = {
            item: item,
            model: model
        };
    };
      // 新标签转换
    $scope.tagTransform = function (newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase()+'@email.com',
            age: 'unknown',
            country: 'unknown'
        };
        return item;
    };

    /***************************** 以下是添加日程弹窗 *****************************/
    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800,"remind":[{"date":today,}]};     //初始空数据
    /* 客户设置 */
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })

    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

    /***************************** 以下是修改日程弹窗 *****************************/

    /*日程单条数据 */
    $scope.editSchedule = function(value){
        $scope.scheduleModal = value;
    }
    $scope.saveEditSchedule = function(value){
        value.schedule[$scope.editIndex] = $scope.scheduleModal;
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleEditSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.scheduleModal = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }
});


/********************************************************************************************************************
 *                                                      添加客户页面
 ********************************************************************************************************************/
angular.module("customeraddMoudle", ['ngSanitize', 'ui.select']).controller('CustomerAddCtrl', function($scope, $http, $state, $stateParams,$uibModal) {
    //客户星级提示
    // $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');
    $scope.sexs = [
            {"value":"0","label":"男"},
            {"value":"1","label":"女"}
        ];

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 国家/地区 */
        $scope.states = data.states;
        /* 国家/地区 */
        $scope.sts =data.sts;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        /* 客户标签*/
        $scope.tags = data.tags;

    })

    /* 客户详情对象 */
    $http({
        url:'data/clueadd.json',
        method:'GET'
    }).success(function(data){
        $scope.customer=data;   
    })
    
    /* 添加联系人 */
    $scope.cusadd = function(){
        $scope.customer.peoples.push({sex:'0',isImportant:false,isEdit:false});     //默认未收藏联系人，可编辑状态
    }
    /* 删除联系人 */
    $scope.cusdel = function(index){
        if ($scope.customer.peoples.length >1){
            var deleteConfirm = confirm('您确定要删除此联系人？');
            if(deleteConfirm){
                $scope.customer.peoples.splice(index,1);
            }
        }
    }
    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[value].splice(index,1);
        }
    }
    /* 完成日程 */
    $scope.schecomp = function(index,value){
        var now_date = new Date();
        var completeData = $scope.customer[value][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }
    /* 撤销日程 */
    $scope.schereply = function(index,value){
        $scope.customer.schedule.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }

    /* 修改商机弹窗 */
    $scope.openBusiness = function (index) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop:'static',
            templateUrl: 'business.html',
            controller: 'ModalBusinessCtrl',
            resolve: {
                business: function () {
                    return $scope.customer.business[index];
                }
            }
        });
        
    }

    /* 客户标签 */
    $scope.counter = 0;
    $scope.onSelectCallback = function (item, model){
        $scope.counter++;
        $scope.eventResult = {item: item, model: model};
    };

    $scope.removed = function (item, model) {
        $scope.lastRemoved = {
            item: item,
            model: model
        };
    };
      // 新标签转换
    $scope.tagTransform = function (newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase()+'@email.com',
            age: 'unknown',
            country: 'unknown'
        };
        return item;
    };

    /***************************** 以下是添加日程弹窗 *****************************/
    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800,"remind":[{"date":today,}]};     //初始空数据
    /* 客户设置 */
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

    /***************************** 以下是修改日程弹窗 *****************************/

    /*日程单条数据 */
    $scope.editSchedule = function(value){
        $scope.scheduleModal = value;
    }
    $scope.saveEditSchedule = function(value){
        value.schedule[$scope.editIndex] = $scope.scheduleModal;
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleEditSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.scheduleModal = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }
});
/********************************************************************************************************************
 *                                                      潜在客户列表页
 ********************************************************************************************************************/
angular.module('clueMoudle',[]).controller('ClueCtrl', function ($scope,$http,$uibModal,$alert) {
    /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
    $scope.show = false;
    $scope.allShow = false;
    $scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow;
    }
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }
    }    
    /*分页*/
    $scope.itemsPerPage = 5;
    // $scope.totalItems = 6;
    $scope.currentPage = 1;

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /*客户状态*/
        $scope.progress = data.progress;
        /* 客户标签*/
        $scope.tags = data.tags;

    })
    /*线索*/
    $http({
        url:'data/clue.json',
        method:'GET'
    }).success(function(data){
        $scope.clues=data.clue;   
    })

    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        $http({
            method: 'POST',
            url: 'http://localhost/angularcode/src/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: value
        }).success(function(data){
            console.log('success')
        })
        
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }
    /*标签过滤*/
    $scope.tagSortFuc = function(value){
        $scope.tagSort = value;
    }
    /*选择客户状态*/
    $scope.selectProgress = function(value,progress){
        value.progress = progress.value;
        $http({
            method: 'POST',
            url: 'http://localhost/angularcode/src/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: value
        }).success(function(data){
           
        })

    }
    /*转化为客户*/
    $scope.changeCustomer = function(value){
        var index = findIndex(value,$scope.clues);
        // var index = $scope.clues.indexOf(value);
        $scope.clues.splice(index,1);
        
        $http({
            method: 'POST',
            url: 'http://localhost/angularcode/src/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: value
        }).success(function(data){
            $scope.changeAlert('转化为客户成功！','请至<a ui-sref="web.customer" href="#/web/customer">我的客户</a>页面查看');
        })
        
    }

    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
        
    }

    /***************************** 以下是顶部导航栏批量操作 **************************************/

    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.clues){
            $scope.clues[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.clues){
                $scope.checkArr.push($scope.clues[i]);
                $scope.clues[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.clues);
            $scope.clues[index].isTop = true;      //固定
            $scope.clues[index].isChecked = false;  //去掉标记位，也就是去掉勾
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.clues);
            $scope.clues[index].isTop = false;      //取消固定
            $scope.clues[index].isChecked = false;  //去掉标记位，也就是去掉勾
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 移动分组 ----批量操作 */
    $scope.moveGroup = function(value,selected){
        for(var i in value){
            var index = findIndex(value[i],$scope.clues);
            $scope.clues[index].group = selected.value;
            $scope.clues[index].isChecked = false;  //去掉标记位
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //关闭顶部导航栏
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteClue = function(value){
        var deleteConfirm = confirm('您确定要删除来之不易的线索信息吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.clues);
                $scope.clues.splice(index,1);   //删除
                $scope.clues[index].isChecked = false;  //去掉标记位
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }
    /*转化为客户 ----批量操作*/
    $scope.changeCustomerAll = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.clues);   //在clues中的索引
            $scope.clues.splice(index,1);   //删除掉这条记录            
            $scope.clues[index].isChecked = false;  //去掉标记位
        }
        /* 服务器发请求 */
            $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
                $scope.changeAlert('转化为客户成功！','请至<a ui-sref="web.customer" href="#/web/customer">我的客户</a>页面查看');
            })
        $scope.checkArr.splice(0,$scope.checkArr.length); 
        console.log($scope.checkArr)
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800,"remind":[{"date":today,}]};     //初始空数据
    /* 客户设置 */
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

})

/********************************************************************************************************************
 *                                                      潜在客户详情页
 ********************************************************************************************************************/

angular.module("cluedetialMoudle", ['ngSanitize', 'ui.select']).controller('ClueDetialCtrl', function($scope, $http, $state, $stateParams,$uibModal) {
    //客户星级提示
    // $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');
    $scope.sexs = [
            {"value":"0","label":"男"},
            {"value":"1","label":"女"}
        ];

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 国家/地区 */
        $scope.states = data.states;
        /* 国家/地区 */
        $scope.sts =data.sts;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        /* 客户标签*/
        $scope.tags = data.tags;

    })

    /* 客户详情对象 */
    $http({
        url:'data/cluedetial.json',
        method:'GET'
    }).success(function(data){
        $scope.customer=data;   
    })
    
    /* 添加联系人 */
    $scope.cusadd = function(){
        $scope.customer.peoples.push({sex:'0',isImportant:false,isEdit:false});     //默认未收藏联系人，可编辑状态
    }
    /* 删除联系人 */
    $scope.cusdel = function(index){
        if ($scope.customer.peoples.length >1){
            var deleteConfirm = confirm('您确定要删除此联系人？');
            if(deleteConfirm){
                $scope.customer.peoples.splice(index,1);
            }
        }
    }
    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[value].splice(index,1);
        }
    }
    /* 完成日程 */
    $scope.schecomp = function(index,value){
        var now_date = new Date();
        var completeData = $scope.customer[value][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }
    /* 撤销日程 */
    $scope.schereply = function(index,value){
        $scope.customer.schedule.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }

    /* 客户标签 */
    $scope.counter = 0;
    $scope.onSelectCallback = function (item, model){
        $scope.counter++;
        $scope.eventResult = {item: item, model: model};
    };

    $scope.removed = function (item, model) {
        $scope.lastRemoved = {
            item: item,
            model: model
        };
    };
      // 新标签转换
    $scope.tagTransform = function (newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase()+'@email.com',
            age: 'unknown',
            country: 'unknown'
        };
        return item;
    };

    /***************************** 以下是添加日程弹窗 *****************************/

    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800,"remind":[{"date":today,}]};     //初始空数据
    /* 客户设置 */
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

    /***************************** 以下是修改日程弹窗 *****************************/

    /*日程单条数据 */
    $scope.editSchedule = function(value){
        $scope.scheduleModal = value;
    }
    $scope.saveEditSchedule = function(value){
        value.schedule[$scope.editIndex] = $scope.scheduleModal;
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleEditSchedule();    
    }
    /* 添加日程提醒 */
    $scope.remindaddModal = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddelModal = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }

    
});
/********************************************************************************************************************
 *                                                      添加潜在客户
 ********************************************************************************************************************/

angular.module("clueaddMoudle", ['ngSanitize', 'ui.select']).controller('ClueAddCtrl', function($scope, $http, $state, $stateParams,$uibModal) {
    //客户星级提示
    // $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');
    $scope.sexs = [
            {"value":"0","label":"男"},
            {"value":"1","label":"女"}
        ];

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 国家/地区 */
        $scope.states = data.states;
        /* 国家/地区 */
        $scope.sts =data.sts;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        /* 客户标签*/
        $scope.tags = data.tags;

        /* 客户标签*/
        $scope.tags = data.tags;

    })

    /* 客户详情对象 */
    $http({
        url:'data/clueadd.json',
        method:'GET'
    }).success(function(data){
        $scope.customer=data;   
    })

    /* 添加联系人 */
    $scope.cusadd = function(){
        $scope.customer.peoples.push({sex:'0',isImportant:false,isEdit:false});     //默认未收藏联系人，可编辑状态
    }
    /* 删除联系人 */
    $scope.cusdel = function(index){
        if ($scope.customer.peoples.length >1){
            var deleteConfirm = confirm('您确定要删除此联系人？');
            if(deleteConfirm){
                $scope.customer.peoples.splice(index,1);
            }
        }
    }
    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[value].splice(index,1);
        }
    }
    /* 完成日程 */
    $scope.schecomp = function(index,value){
        var now_date = new Date();
        var completeData = $scope.customer[value][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }
    /* 撤销日程 */
    $scope.schereply = function(index,value){
        $scope.customer.schedule.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800,"remind":[{"date":today,}]};     //初始空数据
    /* 客户设置 */
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

    /***************************** 以下是修改日程弹窗 *****************************/

    /*日程单条数据 */
    $scope.editSchedule = function(value){
        $scope.scheduleModal = value;
    }
    $scope.saveEditSchedule = function(value){
        value.schedule[$scope.editIndex] = $scope.scheduleModal;
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleEditSchedule();    
    }
    /* 添加日程提醒 */
    $scope.remindaddModal = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddelModal = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }

    
});

/********************************************************************************************************************
 *                                                      项目列表页
 ********************************************************************************************************************/
angular.module("businessMoudle", []).controller('BusinessCtrl', function($scope, $http, $modal) {
    /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
    $scope.show = false;
    $scope.allShow = false;
    $scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow;
    }
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }
    }    
    /*分页*/
    $scope.itemsPerPage = 5;
    // $scope.totalItems = 6;
    $scope.currentPage = 1;

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
         /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 国家/地区 */
        $scope.states = data.states;
        /* 国家/地区 */
        $scope.sts =data.sts;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        /* 客户标签*/
        $scope.tags = data.tags;

        $scope.status = data.status;
    })
    $http({
        url:'data/company.json',
        method:'GET'
    }).success(function(data){
        $scope.company = data.company;
    })

    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    
    /*项目*/
    $http({
        url:'data/business.json',
        method:'GET'
    }).success(function(data){
        $scope.business=data.business;   
    })

    
        
    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        $http({
            method: 'POST',
            url: 'http://localhost/angularcode/src/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: value
        }).success(function(data){
            console.log('success')
        })
        
    }

    /* 选择项目状态*/
    $scope.checkStatus = function(index,value){
        value.status = index;
        var date = new Date();
        var businessStatus = {
            "bname":value.bname,
            "people":value.people,
            "status":value.status,
            "selectPerson":"0", 
            "time":date,
        }
        value.business.unshift(businessStatus);
        console.log(value.business)     // 这里将会添加到推进历史
    }

    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
        
    }

    /***************************** 以下是顶部导航栏批量操作 **************************************/

    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.business){
            $scope.business[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.business){
                $scope.checkArr.push($scope.business[i]);
                $scope.business[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.business);
            $scope.business[index].isTop = true;      //固定
            $scope.business[index].isChecked = false;  //去掉标记位，也就是去掉勾
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.business);
            $scope.business[index].isTop = false;      //取消固定
            $scope.business[index].isChecked = false;  //去掉标记位，也就是去掉勾
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }

    /* 删除栏目 ----批量操作 */
    $scope.deleteClue = function(value){
        var deleteConfirm = confirm('您确定要删除来之不易的线索信息吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.business);
                $scope.business.splice(index,1);   //删除
                $scope.business[index].isChecked = false;  //去掉标记位
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800000,"remind":[{"date":today,}]};     //初始空数据
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

})

/********************************************************************************************************************
 *                                                      项目详情页
 ********************************************************************************************************************/

angular.module("businessdetialMoudle", []).controller('BusinessDetialCtrl', function($scope, $http, $state, $stateParams,$uibModal) {
    //客户星级提示
    // $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');
    $scope.sexs = [
            {"value":"0","label":"男"},
            {"value":"1","label":"女"}
        ];

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 国家/地区 */
        $scope.states = data.states;
        /* 国家/地区 */
        $scope.sts =data.sts;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;

        /* 推进状态*/
        $scope.status = data.status;
    })
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    $http({
        url:'data/company.json',
        method:'GET'
    }).success(function(data){
        /*   自定义 -- 公司*/
        $scope.company = data.company;
    })

    /* 客户详情对象 */
    $http({
        url:'data/businessdetial.json',
        method:'GET'
    }).success(function(data){
        $scope.customer=data;   
    })

    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[value].splice(index,1);
        }
    }
    /* 完成日程 */
    $scope.schecomp = function(index,value){
        var now_date = new Date();
        var completeData = $scope.customer[value][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }
    /* 撤销日程 */
    $scope.schereply = function(index,value){
        $scope.customer.schedule.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }

    /* 选择项目状态*/
    $scope.checkStatus = function(value){
        $scope.customer.status = value;
        var date = new Date();
        var businessStatus = {
            "bname":$scope.customer.bname,
            "people":$scope.customer.people,
            "status":$scope.customer.status,
            "selectPerson":"0", 
            "time":date,
        }
        $scope.customer.business.unshift(businessStatus);
    }
    $scope.compareStatus = function(e){
        return e.value >$scope.customer.status;
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800,"remind":[{"date":today,}]};     //初始空数据
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

    /***************************** 以下是修改日程弹窗 *****************************/

    /*日程单条数据 */
    $scope.editSchedule = function(value){
        $scope.scheduleModal = value;
    }
    $scope.saveEditSchedule = function(value){
        value.schedule[$scope.editIndex] = $scope.scheduleModal;
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleEditSchedule();    
    }
    /* 添加日程提醒 */
    $scope.remindaddModal = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddelModal = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }

    
});

/********************************************************************************************************************
 *                                                      添加项目页
 ********************************************************************************************************************/

angular.module("businessaddMoudle", []).controller('BusinessAddCtrl', function($scope, $http, $state, $stateParams,$uibModal) {
    $scope.sexs = [
            {"value":"0","label":"男"},
            {"value":"1","label":"女"}
        ];

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 国家/地区 */
        $scope.states = data.states;
        /* 国家/地区 */
        $scope.sts =data.sts;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;

        /* 推进状态*/
        $scope.status = data.status;
    })
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    $http({
        url:'data/company.json',
        method:'GET'
    }).success(function(data){
        /*   自定义 -- 公司*/
        $scope.company = data.company;
    })

    /* 客户详情对象 */
    $http({
        url:'data/businessadd.json',
        method:'GET'
    }).success(function(data){
        $scope.customer=data;   
    })

    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[value].splice(index,1);
        }
    }
    /* 完成日程 */
    $scope.schecomp = function(index,value){
        var now_date = new Date();
        var completeData = $scope.customer[value][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }
    /* 撤销日程 */
    $scope.schereply = function(index,value){
        $scope.customer.schedule.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }

    /* 选择项目状态*/
    $scope.checkStatus = function(value){
        $scope.customer.status = value;
    }
    $scope.compareStatus = function(e){
        return e.value >$scope.customer.status;
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today+172800,"remind":[{"date":today,}]};     //初始空数据
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

    /***************************** 以下是修改日程弹窗 *****************************/

    /*日程单条数据 */
    $scope.editSchedule = function(value){
        $scope.scheduleModal = value;
    }
    $scope.saveEditSchedule = function(value){
        value.schedule[$scope.editIndex] = $scope.scheduleModal;
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleEditSchedule();    
    }
    /* 添加日程提醒 */
    $scope.remindaddModal = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddelModal = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    }
    
});

