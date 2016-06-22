'use strict';
var vehicleDemand = require("pages/main/vehicleDemand/vehicleDemandList");
var vehicleDemandDt = require("pages/main/vehicleDemand/vehicleDemandDt");
var vehicleDemandAdd = require("pages/main/vehicleDemand/vehicleDemandAdd");
var vehicleDispatch = require("pages/main/vehicleDispatch/vehicleDispatchList");
var GPSList = require("pages/main/GPS/GPSList");
var GPSDt = require("pages/main/GPS/GPSDt");
var vehicleList = require("pages/main/vehicle/vehicleList");
var vehicleDt = require("pages/main/vehicle/vehicleDt");
var vehicleEdit = require("pages/main/vehicle/vehicleEdit");
var deliverList = require("pages/main/deliver/deliverList");
var deliverDt = require("pages/main/deliver/deliverDt");
var deliverDtEdit = require("pages/main/deliver/deliverDtEdit");
var enterprise = require("pages/main/enterprise/enterprise");
var account = require("pages/main/account/account");

var driverList=require("pages/main/driver/driverList");
var driverDt=require("pages/main/driver/driverDt");
var driverEdit=require("pages/main/driver/driverEdit");
var editTransportAgree = require("pages/main-hulk/agreement/editTransportAgree");
var agreementList = require("pages/main-hulk/agreement/agreementList"); 


var mainFrame = require("pages/main/mainFrame/mainFrame");
var login = require("pages/login/login");

var app = angular.module('exingcai_captain_web');

app.config(function($stateProvider, $urlRouterProvider, $controllerProvider) {
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state("index", enterprise)
        .state("vehicleDemand", vehicleDemand)
        .state("vehicleDemandDt", vehicleDemandDt)
        .state("vehicleDemandAdd", vehicleDemandAdd)
        .state("vehicleDispatch", vehicleDispatch)
        .state('GPSList', GPSList)
        .state('GPSDt', GPSDt)
        .state('vehicleList', vehicleList)
        .state('vehicleDt', vehicleDt)
        .state('vehicleEdit', vehicleEdit)
        .state('driverEdit', driverEdit)
        .state("account", account)
        .state('driverList', driverList)
        .state('driverDt', driverDt)
        

   .state('deliverList',deliverList)
   .state('deliverDt',deliverDt)
   .state('deliverDtEdit',deliverDtEdit)
   .state("agreementList",agreementList)
   .state("editTransportAgree",editTransportAgree)


    //$urlRouterProvider.when("", login);


    // Application routes 物流仓库与登录在一个系统
    // $stateProvider
    //  .state("index",mainFrame)

    //  .state("login",login)

    //  .state('index.dispatch', dispatchOrderList)
    //  .state('index.product', product)
    //  .state('index.productAdd',productAdd);




    app.register = {
        controller: $controllerProvider.register
    };
});


// myApp.config(function ($stateProvider, $urlRouterProvider) {

//      $urlRouterProvider.when("", "/PageTab");

//      $stateProvider
//         .state("PageTab", {
//             url: "/PageTab",
//             templateUrl: "PageTab.html"
//         })
//         .state("PageTab.Page1", {
//             url:"/Page1",
//             templateUrl: "Page-1.html"
//         })
//         .state("PageTab.Page2", {
//             url:"/Page2",
//             templateUrl: "Page-2.html"
//         })
//         .state("PageTab.Page3", {
//             url:"/Page3",
//             templateUrl: "Page3.html"
//         });
// });
