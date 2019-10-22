#### 封装请求

1. 新建一个js文件后

   ```javascript
   function http(options){
   	options.dataType = "json";
       var success = options.success;
       options.success = function(result){
           if(result.message !== "") alert(result.message);
           switch(result.status){
               case 200:
                   success(result.data);
                   break;
               case 401:
                   Cookies.set('target',window.location.href);
                   window.location.href = 'login.html'
                   break;
               default:
                   break;
           }
       }
       http(options);
   }
   ```

2. 调用封装后请求

   ```javascript
   http({
       type:'post',
       url:'/cart/list',
       success:function(data){
       alert('信息获取成功')
       }
   })
   ```

   