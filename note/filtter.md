#### 时间过滤

> ```js
> const formatTime = date => {
>   const year = date.getFullYear()
>   const month = date.getMonth() + 1
>   const day = date.getDate()
>   const hour = date.getHours()
>   const minute = date.getMinutes()
>   const second = date.getSeconds()
> 
>   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
> }
> 
> const formatNumber = n => {
>   n = n.toString()
>   return n[1] ? n : '0' + n
> }
> 
> module.exports = {
>   formatTime: formatTime
> }
> ```

#### 表单验证

> ```javascript
> const regObj = {
>     phone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
> }
> 
> function regexCheck(config) {
>     if (!config.value || config.value === null) return showToast(config.des + '不能为空');
>     for (let key in regObj) {
>         if (key === config.type) {
>             if (!regObj[key].test(config.value)) {
>                 return showToast(config.des + '格式不正确');
>             } else {
>                 return true;
>             }
>         } else {
>             return true;
>         }
>     }
> }
> 
> function showToast(title) {
>     wx.showToast({
>         title: title,
>         icon: 'none',
>         duration: 2000
>     })
> }
> module.exports = {
>     regexCheck: regexCheck,
> }
> ```