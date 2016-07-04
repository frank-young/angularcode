var routerApp = angular.module('routerApp', [
        'ngAnimate',
        'ui.router',
        'ngGrid',
        'mgcrea.ngStrap',
        'ui.bootstrap',
        'detialMoudle',
        'customeraddMoudle',
        'customerlistMoudle',
        'clueMoudle',
        'cluedetialMoudle',
        'clueaddMoudle',
        'businessMoudle',
        'businessdetialMoudle'
        ]);   //'mgcrea.ngStrap',



/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
routerApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由。
 * ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
routerApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('index', {
            url: '/index',
            views: {
                '': {
                    templateUrl: 'tpls/home.html'
                },
                'main@index': {
                    templateUrl: 'tpls/loginForm.html'
                }
            }
        })
        .state('booklist', {
            url: '/{bookType:[0-9]{1,4}}',
            views: { //注意这里的写法，当一个页面上带有多个ui-view的时候如何进行命名和视图模板的加载动作
                '': {
                    templateUrl: 'tpls/bookList.html'
                },
                'booktype@booklist': {
                    templateUrl: 'tpls/bookType.html'
                },
                'bookgrid@booklist': {
                    templateUrl: 'tpls/bookGrid.html'
                }
            }
        })
        .state('addbook', {
            url: '/addbook',
            templateUrl: 'tpls/addBookForm.html'
        })
        .state('bookdetail', {
            url: '/bookdetail/:bookId', //注意这里在路由中传参数的方式
            templateUrl: 'tpls/bookDetail.html'
        })
        .state('web', {
            url: '/web',
            templateUrl: 'tpls/nav.html'
        })
        .state('web.clue', {
            url: '/clue',
            templateUrl: 'tpls/customer/clue.html'
        })
        .state('web.clueadd', {
            url: '/clueadd',
            templateUrl: 'tpls/customer/clueadd.html'
        })
        .state('web.cluedetial', {
            url: '/cluedetial/:id',
            templateUrl: 'tpls/customer/cluedetial.html'
        })
        .state('web.customer', {
            url: '/customer',
            templateUrl: 'tpls/customer/customer.html'
        })
        .state('web.customeradd', {
            url: '/customeradd',
            templateUrl: 'tpls/customer/customeradd.html'
        })
        .state('web.customerdetial', {
            url: '/customerdetial/:id',
            templateUrl: 'tpls/customer/customerdetial.html'
        })
        .state('web.business', {
            url: '/business',
            templateUrl: 'tpls/customer/business.html'
        })
        .state('web.businessadd', {
            url: '/businessadd',
            templateUrl: 'tpls/customer/businessadd.html'
        })
        .state('web.businessdetial', {
            url: '/businessdetial/:id',
            templateUrl: 'tpls/customer/businessdetial.html'
        })
        
});
