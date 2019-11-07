### 数组循环遍历

1. for...in

   ```javascript
   var a = [1, 2, 3];
   a.foo = true;
   
   for (var key in a) {
     console.log(key);
   }
   ```

   > `for...in`不仅会遍历数组所有的数字键，还会遍历非数字键。上面代码在遍历数组时，也遍历到了非整数键`foo`。

2. 跳过数组空位

   ```javascript
   var a = [, , ,];
   
   a.forEach(function (x, i) {
     console.log(i + '. ' + x);
   })
   // 不产生任何输出
   
   for (var i in a) {
     console.log(i);
   }
   // 不产生任何输出
   
   Object.keys(a)
   // []
   ```

   > 数组的某个位置是空位，与某个位置是`undefined`，是不一样的。如果是空位，使用数组的`forEach`方法、`for...in`结构、以及`Object.keys`方法进行遍历，空位都会被跳过。
   
3. for...of + Object

   ```javascript
   function distinct(a, b) {
       let arr = a.concat(b)
       let result = []
       let obj = {}
   
       for (let i of arr) {
           if (!obj[i]) {
               result.push(i)
               obj[i] = 1
           }
       }
   
       return result
   }
   ```

   > 数组去重首选。15W条测试数据16ms,150w条数据93ms

4. new Set()

   ```javascript
   function distinct(a, b) {
       return Array.from(new Set([...a, ...b]))
   }
   ```

   > 数组去重次选。15W条测试数据57ms,150w条数据678ms

### 运算符

1. #### 	逗号运算符

   ```javascript
   'a', 'b' // "b"
   
   var x = 0;
   var y = (x++, 10);
   x // 1
   y // 10
   ```

   > 逗号运算符用于对两个表达式求值，并返回后一个表达式的值。上面代码中，逗号运算符返回后一个表达式的值。逗号运算符的一个用途是，在返回一个值之前，进行一些辅助操作。

   ```javascript
   var value = (console.log('Hi!'), true);
   // Hi!
   
   value // true
   ```

   > 上面代码中，先执行逗号之前的操作，然后返回逗号后面的值。

2. 运算符优先级

   运算符的优先级从高到低依次为：小于等于（`<=`)、严格相等（`===`）、或（`||`）、三元（`?:`）、等号（`=`）
   
3. #### 三元运算符

   ```javascript
   w = x = y = z;
   q = a ? b : c ? d : e ? f : g;
   ```

   ```javascript
   w = (x = (y = z));
   q = a ? b : (c ? d : (e ? f : g));
   ```

   > 上面的两行代码，各有三个等号运算符和三个三元运算符，都是先计算最右边的那个运算符。
   >
   > 少数运算符的计算顺序是从右到左，即从右边开始计算，这叫做运算符的“右结合”（right-to-left associativity）。其中，最主要的是赋值运算符（`=`）和三元条件运算符（`?:`）以及指数运算符（`**`）
###我喜欢python
