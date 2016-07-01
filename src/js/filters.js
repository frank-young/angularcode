routerApp.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);
        
      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      out = items;
    }

    return out;
  };
});

routerApp.filter('time', function(){
  return function(createtime){
    if(createtime){
      var nowdate = new Date(),
        now=Date.parse(nowdate),
        limit=now/1000-createtime/1000,
        content="",
        date = new Date(createtime),
        Y = date.getFullYear() + '-',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ',
        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':',
        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':',
        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());

      if(limit<60){
          content="刚刚";
      }else if(limit>=60 && limit<3600){
          content=Math.floor(limit/60)+"分钟前";
      }else if(limit>=43200&&date.getDate()!=nowdate.getDate()&&date.getDate()==nowdate.getDate()-1){
          content="昨天";
      }else if(limit>=3600 && limit<86400){
          content=Math.floor(limit/3600)+"小时前";
      }else if(date.getDate()!=nowdate.getDate()&&date.getDate()==nowdate.getDate()-2){
          content="2天前";
      }else if(date.getDate()!=nowdate.getDate()&&date.getDate()==nowdate.getDate()-3){
          content="3天前";
      }else if(date.getFullYear()!=nowdate.getFullYear()){
        content = Y+M+D; 
      }else{
        content = M+D; 
      }
        return content;
    }
  };

});

routerApp.filter('schetime', function(){
  return function(createtime){
    if(createtime){
      var nowdate = new Date(),
        now=Date.parse(nowdate),
        limit=now/1000-createtime/1000,
        content="",
        date = new Date(createtime),
        Y = date.getFullYear() + '-',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ',
        h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':',
        m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':',
        s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());

        content = Y+M+D; 
        return content;
    }
  };

});

routerApp.filter('offset', function() { 
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});