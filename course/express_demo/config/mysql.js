const mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'express_demo',
    multipleStatements: true,
    debug: true,
});
//常规SQL
let query = function (sql, arr = [], callback) {
    return new Promise((resolve, reject)=>{
        //建立链接
        pool.getConnection(function (err, connection) {
            if (err) reject(err.message);
            connection.query(sql, arr, function (error, results, fields) {
                //将链接返回到连接池中，准备由其他人重复使用
                connection.release();
                if (error) reject(error.message);
                //执行回调函数，将数据返回
                else resolve(results)

            });
        });
    })
};
module.exports = {
    query,
    pool
}