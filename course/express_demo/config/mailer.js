// 封装邮件发送接口
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.googlemail.com',
    port: 465,
    secureConnection: true,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'xzschc66@gmail.com',
        pass: 'huawei2019'
    }
})
function mailOptions(mailCode, to, subject) {
    return {
        from: '"测试邮件" <xzschc66@gmail.com>',
        to: to || '15563646873@163.com',
        subject: subject || '邮箱验证码',
        html: `您的邮箱验证码为：<p>${mailCode}</p>`
    }
}
let send = function (mailCode, to, subject) {
    let mailOption = mailOptions(mailCode, to, subject)
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    })
};

module.exports = {
    send
}
// let mailCode = "嘻嘻"  nodemailer.send(mailCode);