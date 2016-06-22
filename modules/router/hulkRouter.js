'use strict';
var enterprise = require("pages/main/enterprise/enterprise");
var account = require("pages/main/account/account");
var deliveryBatchList = require("pages/main-hulk/delivery/deliveryBatchList");
var deliveryBatchAdd = require("pages/main-hulk/delivery/deliveryBatchAdd");
var deliveryBatchDt = require("pages/main-hulk/delivery/deliveryBatchDt");
var acceptGoodsList = require("pages/main-hulk/acceptGoods/acceptGoodsList");
var addAcceptGoods = require("pages/main-hulk/acceptGoods/addAcceptGoods");
var acceptGoodsDt = require("pages/main-hulk/acceptGoods/acceptGoodsDt");
var godownEntryList = require("pages/main-hulk/godownEntry/godownEntryList");
var transferBatchList = require("pages/main-hulk/transferOrder/transferBatchList");
var addTransferBatch = require("pages/main-hulk/transferOrder/addTransferBatch");
var transferOrderList = require("pages/main-hulk/transferOrder/transferOrderList");
var transferOrderAdd = require("pages/main-hulk/transferOrder/transferOrderAdd");
var transferBatchDt = require("pages/main-hulk/transferOrder/transferBatchDt"); 
var transferOrderAddWH = require("pages/main-hulk/transferOrder/transferOrderAddWH");
var stockList = require("pages/main-hulk/stock/stockList");
var shippingList = require("pages/main-hulk/shipping/shippingList");
var warehouseList = require("pages/main-hulk/warehouse/warehouseList");
var warehouseDt = require("pages/main-hulk/warehouse/warehouseDt");
var addForm = require("pages/main-hulk/warehouse/addForm");
var agreementList = require("pages/main-hulk/agreement/agreementList");
var editWarehouseAgree = require("pages/main-hulk/agreement/editWarehouseAgree");

var addCategory = require("pages/main-hulk/category/addCategory"); 

var addCategory = require("pages/main-hulk/category/addCategory");
var cargoTransferReportList = require("pages/main-hulk/report/cargoTransferReportList");
var storageReportList = require("pages/main-hulk/report/storageReportList");
var cargoInReportList = require("pages/main-hulk/report/cargoInReportList");
var cargoOutReportList = require("pages/main-hulk/report/cargoOutReportList");

var feeCaculate = require("pages/main-hulk/agreement/feeCaculate");
var feeCaculateDtl = require("pages/main-hulk/agreement/feeCaculateDtl");


var app = angular.module('exingcai_captain_web');
app.config(function($stateProvider, $urlRouterProvider, $controllerProvider) {
  $urlRouterProvider.otherwise('/index');

  $stateProvider
  // .state("index",acceptGoodsList)
  .state("deliveryBatchList",deliveryBatchList)

  .state("acceptGoodsList",acceptGoodsList)
  .state("addAcceptGoods",addAcceptGoods)
  .state("acceptGoodsDt",acceptGoodsDt)
  .state("godownEntryList",godownEntryList)
  .state("deliveryBatchAdd",deliveryBatchAdd)
  .state("shippingList",shippingList)
  .state("deliveryBatchDt",deliveryBatchDt)
  .state("transferBatchList",transferBatchList)
  .state("addTransferBatch",addTransferBatch)
  .state("transferOrderList",transferOrderList)
  .state("transferOrderAdd",transferOrderAdd)

  .state("transferBatchDt",transferBatchDt)
  .state("transferOrderAddWH",transferOrderAddWH)
  .state("stockList",stockList)
  .state("warehouseList",warehouseList)
  .state("warehouseDt",warehouseDt)
  .state("addForm",addForm)
  .state("account",account)
  .state("index",enterprise)
  .state("agreementList",agreementList)


  .state("feeCaculate",feeCaculate)
  .state("feeCaculateDtl",feeCaculateDtl)


  .state("editWarehouseAgree",editWarehouseAgree)
  .state("addCategory",addCategory)

  .state("cargoTransferReportList",cargoTransferReportList)
  .state("storageReportList",storageReportList)
  .state("cargoInReportList",cargoInReportList)
  .state("cargoOutReportList",cargoOutReportList);


  app.register = {
    controller: $controllerProvider.register
  };
});
