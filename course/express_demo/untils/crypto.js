const crypto = require('crypto');
// AES对称加解密 http://nodejs.cn/api/crypto.html#crypto_hash_update_data_inputencoding
// AES 有三种长度 128位、192位、256位，这三种的区别，主要来自于密钥的长度，16字节密钥=128位，24字节密钥=192位，32字节密钥=256位
const key = '63c005dbcc70cea58f2143f619cc6a3f'; //32位
const iv = '63c005dbcc70cea5'; //16位
const algorithm = 'aes-256-cbc'

function decrypt(data) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
}
function encrypt(data) {
    const cipheriv = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipheriv.update(data, 'utf8', 'hex');
    encrypted += cipheriv.final('hex');
    return encrypted
}
module.exports = {
    encrypt,
    decrypt,
    crypto
}