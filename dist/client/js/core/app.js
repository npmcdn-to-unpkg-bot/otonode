"use strict";angular.module("oto",["ngCookies","ui.router","ui.bootstrap","ngTable","angularFileUpload","oto.filters"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){var e=routingConfig.accessLevels;a.state("public",{"abstract":!0,template:"<ui-view/>",data:{access:e["public"]}}).state("public.404",{url:"/404/",templateUrl:"404"}).state("public.401",{url:"/401/",templateUrl:"401"}),a.state("anon",{"abstract":!0,template:"<ui-view/>",data:{access:e.anon}}).state("anon.login",{url:"/login/",templateUrl:"login",controller:"LoginCtrl"}),a.state("user",{"abstract":!0,template:"<ui-view/>",data:{access:e.user}}).state("user.home",{url:"/",templateUrl:"home",controller:"HomeCtrl"}).state("user.automation",{url:"/automation/",templateUrl:"automation",controller:"AutomationCtrl"}).state("user.notes",{url:"/notes/",templateUrl:"notes/card-list"}).state("user.household",{"abstract":!0,url:"/household/",template:"<ui-view/>",data:{subnav:"household/subnav"}}).state("user.household.compensate",{url:"",templateUrl:"household/compensate",controller:"CompensateCtrl"}).state("user.household.kitties",{url:"kitties/",templateUrl:"household/kitties",controller:"KittiesCtrl"}).state("user.watchlist",{"abstract":!0,url:"/watchlist/",template:"<ui-view/>",data:{subnav:"watchlist/subnav"}}).state("user.watchlist.series",{url:"series/",templateUrl:"watchlist/series",controller:"SeriesCtrl"}),a.state("admin",{"abstract":!0,template:"<ui-view/>",data:{access:e.admin}}).state("admin.admin",{url:"/admin/",templateUrl:"admin"}),b.when("/watchlist/","/watchlist/series"),b.otherwise("/404"),b.rule(function(a,b){if("file"!==b.protocol()){var c,d=b.path(),e=b.search();if("/"!==d[d.length-1])return 0===Object.keys(e).length?d+"/":(c=[],angular.forEach(e,function(a,b){c.push(b+"="+a)}),d+"/?"+c.join("&"))}}),c.html5Mode(!0),d.interceptors.push(["$q","$location",function(a,b){return{responseError:function(c){return 401===c.status||403===c.status?(b.path("/401"),a.reject(c)):a.reject(c)}}}])}]).run(["$rootScope","$state","Auth",function(a,b,c){a.core={},a.core.subnav=null,a.$on("$stateChangeStart",function(d,e,f,g,h){e.data.subnav?a.core.subnav=e.data.subnav:a.core.subnav=null,c.authorize(e.data.access)||(a.error="Seems like you tried accessing a route you don't have access to...",d.preventDefault(),"^"===g.url&&(c.isLoggedIn()?(b.go("user.home"),a.error=""):(a.error=null,a.core.savedLocation=e.url,b.go("anon.login"))))})}]);