var app = angular.module('exingcai_captain_web');

app.filter('comType', function() {
    return function(input) {
        var newValue;
        switch (input) {
            case "1":
                newValue = "物流企业";
                break;
            case "2":
                newValue = "仓储企业";
                break;
            case "3":
                newValue = "贸易企业";
                break;
        }
        return newValue;
    };
});

app.constant('CONTRACT_BATCH_STATUS', {
  NOT_HANDLED: 100,
  HANDLING: 200,
  HANDLED: 300
});
app.filter('contractBatchStatus', function (CONTRACT_BATCH_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case CONTRACT_BATCH_STATUS.NOT_HANDLED: newValue = "未处理"; break;
      case CONTRACT_BATCH_STATUS.HANDLING: newValue = "处理中"; break;
      case CONTRACT_BATCH_STATUS.HANDLED: newValue = "已处理"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('WAREHOUSE_STATUS', {
  WAIT_FOR_INIT: 100,
  UN_AVAILABLE: 300,
  AVAILABLE: 200
});
app.filter('warehouseStatusFilter', function (WAREHOUSE_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case WAREHOUSE_STATUS.WAIT_FOR_INIT: newValue = "初始化"; break;
      case WAREHOUSE_STATUS.UN_AVAILABLE: newValue = "停用"; break;
      case WAREHOUSE_STATUS.AVAILABLE: newValue = "可用"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('CARGO_RECIEVE_STATUS', {
  NOT_REACHED: 100,
  REACHED: 110,
});
app.filter('cargoRecieveStatusFilter', function (CARGO_RECIEVE_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case CARGO_RECIEVE_STATUS.NOT_REACHED: newValue = "待收货"; break;
      case CARGO_RECIEVE_STATUS.REACHED: newValue = "已到货"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});
app.constant('CARGO_TRANSFER_STATUS', {
  not_transfer: 100,
  in_transfer: 110,
  transferd: 120,
});
app.filter('cargoTransferStatusFilter', function (CARGO_TRANSFER_STATUS) {
  return function (input) { 
    var newValue;
    switch (input) {
      case CARGO_TRANSFER_STATUS.not_transfer: newValue = "未处理"; break;
      case CARGO_TRANSFER_STATUS.in_transfer: newValue = "转让中"; break;
      case CARGO_TRANSFER_STATUS.transferd: newValue = "已转让"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('CARGO_SEND_STATUS', {
  WAIT_FOR_DELIVERY: 100,
  SHIPPING: 110,
  DELIVERED: 120
});
app.filter('cargoSendStatusFilter', function (CARGO_SEND_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case CARGO_SEND_STATUS.WAIT_FOR_DELIVERY: newValue = "待发货"; break;
      case CARGO_SEND_STATUS.SHIPPING: newValue = "核对无误、装货中"; break;
      case CARGO_SEND_STATUS.DELIVERED: newValue = "已发货"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('CARGO_OUT_STATUS', {
  WAIT_FOR_HANDLING: 100,
  WAIT_FOR_SHIPPING: 110,
  WAIT_FOR_CONFIRM: 120,
  SHIPPED:120,
  CONFIRM_YES: 130,
  CONFIRM_NO: 140
});
app.filter('cargoOutStatusFilter', function (CARGO_OUT_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case CARGO_OUT_STATUS.WAIT_FOR_HANDLING: newValue = "待处理"; break;
      case CARGO_OUT_STATUS.WAIT_FOR_CONFIRM: newValue = "待确认"; break;
      case CARGO_OUT_STATUS.CONFIRM_YES: newValue = "司机确认无误"; break;
      case CARGO_OUT_STATUS.CONFIRM_NO: newValue = "司机确认有误"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('CARGO_IN_STATUS', {
  WAIT_FOR_HANDLING: 100,
  WAIT_FOR_STORING: 110,
  STORED: 120
});
app.filter('cargoInStatusFilter', function (CARGO_IN_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case CARGO_IN_STATUS.WAIT_FOR_HANDLING: newValue = "待处理"; break;
      case CARGO_IN_STATUS.WAIT_FOR_STORING: newValue = "待入库"; break;
      case CARGO_IN_STATUS.STORED: newValue = "已入库"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('TRANSFER_STATUS', {
  WAIT_FOR_HANDLING: "100",
  HANDLING: "110",
  TRANSFER_SUCCESS: "120"
});
app.filter('transferStatusFilter', function (TRANSFER_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case TRANSFER_STATUS.WAIT_FOR_HANDLING: newValue = "待处理"; break;
      case TRANSFER_STATUS.HANDLING: newValue = "处理中"; break;
      case TRANSFER_STATUS.TRANSFER_SUCCESS: newValue = "转让成功"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('TRANSFER__NOTICE_STATUS', {
  NOT_CONFIRMED: "100",
  CONFIRMED: "110",
});
app.filter('transferNoticeStatusFilter', function (TRANSFER__NOTICE_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case TRANSFER__NOTICE_STATUS.NOT_CONFIRMED: newValue = "未确认"; break;
      case TRANSFER__NOTICE_STATUS.CONFIRMED: newValue = "已确认"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('STOCK_STATUS', {
  AVAILABLE: "100",
  FREEZE: "200",
  ON_THE_WAY: "300"
});
app.filter('stockStatusFilter', function (STOCK_STATUS) {
  return function (input) {
    var newValue;
    switch (input) {
      case STOCK_STATUS.AVAILABLE: newValue = "可用"; break;
      case STOCK_STATUS.FREEZE: newValue = "冻结"; break;
      case STOCK_STATUS.ON_THE_WAY: newValue = "在途"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('WAREHOUSE_TYPE', {
  FLOOR_WAREHOUSE: 1,
  PLATFORM_WAREHOUSE: 2,
  RAISED_PLATFORM_WAREHOUSE: 3
});
app.filter('warehouseTypeFilter', function (WAREHOUSE_TYPE) {
  return function (input) {
    var newValue;
    switch (input) {
      case WAREHOUSE_TYPE.FLOOR_WAREHOUSE: newValue = "楼层仓"; break;
      case WAREHOUSE_TYPE.PLATFORM_WAREHOUSE: newValue = "平台仓"; break;
      case WAREHOUSE_TYPE.RAISED_PLATFORM_WAREHOUSE: newValue = "高台仓"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});

app.constant('ACCEPT_TYPE',{
  PONDERATION:100,
  COPY_CODE:200
})
app.filter('acceptTypeFilter', function (ACCEPT_TYPE) {
  return function (input) {
    var newValue;
    switch (input) {
      case ACCEPT_TYPE.PONDERATION: newValue = "过磅"; break;
      case ACCEPT_TYPE.COPY_CODE: newValue = "抄码"; break;
      default: newValue = "错误状态";
    }
    return newValue;
  };
});
app.constant('VERIFY_TYPE',{
  EXACT_WEIGHT:1,
  ESTIMATE_WEIGHT:0
})

app.constant('SYSTEM',{
  CAPTAIN:"1",
  HULK_WAREHOUSE:"2",
  HULK_ENTERPRISE:"3"
})

app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);
        
      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop]&&item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }
        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }
    return out;
  };
});

app.run(function ($rootScope, CONTRACT_BATCH_STATUS, WAREHOUSE_STATUS, 
CARGO_RECIEVE_STATUS, CARGO_SEND_STATUS, CARGO_OUT_STATUS, CARGO_IN_STATUS, 
TRANSFER_STATUS, TRANSFER__NOTICE_STATUS, STOCK_STATUS, WAREHOUSE_TYPE,ACCEPT_TYPE,
VERIFY_TYPE,SYSTEM) {
  $rootScope.CONTRACT_BATCH_STATUS = CONTRACT_BATCH_STATUS;
  $rootScope.WAREHOUSE_STATUS = WAREHOUSE_STATUS;
  $rootScope.CARGO_RECIEVE_STATUS = CARGO_RECIEVE_STATUS;
  $rootScope.CARGO_SEND_STATUS = CARGO_SEND_STATUS;
  $rootScope.CARGO_OUT_STATUS = CARGO_OUT_STATUS;
  $rootScope.CARGO_IN_STATUS = CARGO_IN_STATUS;
  $rootScope.TRANSFER_STATUS = TRANSFER_STATUS;
  $rootScope.TRANSFER__NOTICE_STATUS = TRANSFER__NOTICE_STATUS;
  $rootScope.STOCK_STATUS = STOCK_STATUS;
  $rootScope.WAREHOUSE_TYPE = WAREHOUSE_TYPE;
  $rootScope.ACCEPT_TYPE = ACCEPT_TYPE;
  $rootScope.VERIFY_TYPE = VERIFY_TYPE;
  $rootScope.SYSTEM = SYSTEM;
});