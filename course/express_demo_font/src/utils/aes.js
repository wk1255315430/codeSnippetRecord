const CryptoJS = require("crypto-js");

//加密方法 https://code.google.com/archive/p/crypto-js/
const key = CryptoJS.enc.Utf8.parse("63c005dbcc70cea58f2143f619cc6a3f"); //转成utf8字符串
const iv = CryptoJS.enc.Utf8.parse("63c005dbcc70cea5");
/**
 * AES 有三种长度 128位、192位、256位，这三种的区别，主要来自于密钥的长度，16字节密钥=128位，24字节密钥=192位，32字节密钥=256位
 * 长度	 密钥长度  向量长度
   128位	16	    16
   192位	24	    16
   256位	32	    16
 *iv：在crypto-js使用初始化向量(iv)时，自动生成256位的密钥
 *CryptoJS supports AES-128, AES-192, and AES-256. It will pick the variant by the size of the key you pass in. If you use a passphrase, then it will generate a 256-bit key.
 *mode：在cryppto-js中,加密方式有CBC (the default) CFB CTR OFB ECB
 *padding: 在cryppto-js中，填充种类有Pkcs7 (the default) Iso97971 AnsiX923 Iso10126 ZeroPadding NoPadding
 * @param {String} data //加密的字符串
 * @returns 密文
 */
function encrypt(data) {
  let srcs = CryptoJS.enc.Utf8.parse(data);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}
// 解密
function decrypt(data) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export default {
  decrypt,
  encrypt
};
