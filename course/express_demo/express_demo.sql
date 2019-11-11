/*
 Navicat Premium Data Transfer

 Source Server         : server_name
 Source Server Type    : MySQL
 Source Server Version : 80017
 Source Host           : localhost:3306
 Source Schema         : express_demo

 Target Server Type    : MySQL
 Target Server Version : 80017
 File Encoding         : 65001

 Date: 08/11/2019 13:26:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `fullname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '男' COMMENT '性别',
  `tel` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号码',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '../images/avatar/default.jpg' COMMENT '头像',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '管理员' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', '123', NULL, '女', NULL, NULL, '../images/avatar/default.jpg');
INSERT INTO `admin` VALUES (2, 'admin', '123456', '黄小米', '女', '13475829262', 'nn880328@126.com', '/images/avatar/13308790-d43a-11e9-aeb1-a170b6278dcc.jpg');
INSERT INTO `admin` VALUES (3, 'moz', '123', '罗志祥', '男', '15863008280', 'nn880328@126.com', '../images/avatar/default.jpg');

-- ----------------------------
-- Table structure for admin_role
-- ----------------------------
DROP TABLE IF EXISTS `admin_role`;
CREATE TABLE `admin_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '用户id',
  `role_id` int(11) NULL DEFAULT NULL COMMENT '角色id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Fixed;

-- ----------------------------
-- Records of admin_role
-- ----------------------------
INSERT INTO `admin_role` VALUES (2, 2, 2);
INSERT INTO `admin_role` VALUES (1, 1, 1);

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '分类id',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标题',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '摘要',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '正文',
  `created_at` timestamp(0) NULL DEFAULT NULL COMMENT '发表日期',
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新日期',
  `images` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '图片',
  `link` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '来源',
  `keyWords` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '关键字',
  `count` int(255) NULL DEFAULT NULL COMMENT '查看次数',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_article_cid_category_id`(`cid`) USING BTREE,
  CONSTRAINT `fk_article_cid_category_id` FOREIGN KEY (`cid`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES (10, 1, '百度向今日头条索赔9000万，称其不正当竞争窃取搜索结果', '今日头条(北京字节跳动科技有限公司)因大量窃取百度“TOP1” 搜索产品结果，被百度以不正当竞争为由起诉到北京市海淀区人民法院，要求字节跳动立即停止侵权，赔偿相关经济损失及合理支出共计人民币9000万元，并连续30天在其App及网站首页道歉。', '<p>科技先生4月26日讯，今日头条(北京字节跳动科技有限公司)因大量窃取百度“TOP1” 搜索产品结果，被百度以不正当竞争为由起诉到北京市海淀区人民法院，要求字节跳动立即停止侵权，赔偿相关经济损失及合理支出共计人民币9000万元，并连续30天在其App及网站首页道歉。</p><p>除民事起诉外，百度也同时向法院提交了行为禁止保全申请书。</p><div><br></div><p>百度方面向法院出示的一些证据中显示：在今日头条搜索 “螃蟹和西红柿吃会中毒吗”，首个搜索结果中的图片上打着百度LOGO水印;而搜索“1立方厘米水等于多少升”，首条搜索结果中，嵌入了“抄自百度”的字眼。百度方面表示，这些是百度为防止TOP1搜索结果被抄袭预先打下的“防伪标记”。</p><p>百度方面表示，“TOP1”产品，是百度 2017 年初推出的“搜索结果首条直接满足”搜索产品的简称。不同于传统搜索用URL(链接地址)满足用户搜索需求，TOP1产品创造性地在搜索结果首位，将用户所寻找的答案或者查找的资源直接展示给用户，提升用户获取信息的效率。</p><div><br></div><p>TOP1 产品属于百度在AI领域的前瞻性探索，需要极高的技术运用，也需要强大的生态运营能力，百度为此投入了大量人力物力。</p><p>而在今日头条“头条搜索”服务的搜索结果中，存在大量盗用百度“TOP1产品”搜索结果的内容，盗用内容既包括百度公司运用算法和历史数据挖掘出的匹配用户需求的TOP1搜索结果，也包括百度花费大量成本与生态合作伙伴一起运营的TOP1搜索结果。</p><p>百度认为，这种行为是对自己技术及劳动成果的公然窃取，已经构成侵权。</p>', '2019-04-26 14:55:21', '2019-11-06 13:50:14', '/images/details/355a67c0-67f0-11e9-b7fb-3d2cafb359a4.jpeg', '', '', 1);
INSERT INTO `article` VALUES (11, 1, '亚马逊2019第一季度财报：净利润同比增长118% AWS业务增速迅猛', '根据这份财报显示，亚马逊销售额增速不错。第一季度总净销售额为597亿美元，高于市场预期596.53亿美元，对比去年同期为510.42亿美元同比增长17%。', '<p>美股研究社最新消息 亚马逊在周四盘后发布2019财年第一季度的财报。</p><p>根据这份财报显示，亚马逊销售额增速不错。第一季度总净销售额为597亿美元，高于市场预期596.53亿美元，对比去年同期为510.42亿美元同比增长17%。</p><p>本季度亚马逊各条业务增长都不错，其中北美地区净销售额为358.12亿美元，去年同期为307.25亿美元；线上商店销售额为294.98亿美元，去年同期为269.39亿美元；国际净销售额为161.92亿美元，去年同期为148.75亿美元。</p><div><br></div><p>净利润方面，亚马逊第一季度净利润为35.61亿美元，高于市场预期23.81亿美元，达到去年同期16.29亿美元的2倍以上，同比增长118%。</p><p>其中，季度广告服务以及其他销售额为27.16亿美元，去年同期为20.31亿美元；季度AWS运营利润增速迅猛达到22.23亿美元，去年同期为14亿美元，同比增长近59%。</p><p>第一季度EPS 7.09美元，市场预期4.67美元。</p><p>目前，亚马逊预计第二季度总销售额为595-635亿美元，预计第二季度运营利润为26-36亿美元。受财报利好消息影响，目前亚马逊盘后涨幅已经超过1%.</p>', '2019-04-26 14:56:54', '2019-11-06 00:40:54', '/images/details/6f70b4a0-67f0-11e9-b7fb-3d2cafb359a4.jpeg', '', '', NULL);
INSERT INTO `article` VALUES (12, 1, 'markdown', 'markdown', '# Vue编写markdown或者展示markdown\r\n\r\n## 1、介绍mavonEditor\r\n\r\n>官网：https://md.zhystar.com/\r\n>github：https://github.com/hinesboy/mavonEditor\r\n\r\nmavonEditor是基于Vue的markdown 编辑器插件，支持自定义界面，代码高亮，图片上传，这些在`github`中都有写到，相关资料可以去`github`查看\r\n\r\n## 2、安装mavonEditor\r\n\r\n```\r\n$ npm install mavon-editor --save 或者\r\n$ yarn add mavon-editor\r\n```\r\n\r\n在`main.js`中\r\n\r\n```\r\nimport mavonEditor from \'mavon-editor\'\r\nimport \'mavon-editor/dist/css/index.css\'\r\nVue.use(mavonEditor)\r\n```\r\n\r\n## 3、使用mavonEditor编辑markdown\r\n\r\n在`.vue`文件中\r\n\r\n```\r\n<template>\r\n    <div>\r\n        <mavon-editor v-model=\"value\"/>\r\n    </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n    data() {\r\n        return {\r\n            value: \'\',\r\n            defaultData: \"preview\"\r\n        };\r\n    },\r\n};\r\n</script>\r\n```\r\n\r\n打开页面显示可编辑的页面\r\n\r\n![20180828145144186](C:\\Users\\ThinkPad\\Desktop\\20180828145144186.png)\r\n\r\n| **name 名称** | **type 类型** | **default 默认值**                                           |\r\n| ------------- | ------------- | ------------------------------------------------------------ |\r\n| language      | zh-CN         | 语言选择，暂支持 zh-CN: 中文简体 ， en: 英文 ， fr: 法语, pt-BR: 葡萄牙语, ru: 俄语 |\r\n\r\n', '2019-10-18 14:39:53', '2019-11-05 17:07:52', NULL, 'https://blog.csdn.net/weixin_43728574/article/details/102574258', 'k|亚马逊', 3);
INSERT INTO `article` VALUES (14, 26, '微信小程序使用字体图标', '项目中常常需要使用到字体图标，微信小程序中使用字体图标与在平常的web前端中类似但是又有区别。下面以使用阿里图标为例子讲解如何在微信小程序中使用字体图标。', '```css\n/* This stylesheet generated by Transfonter (https://transfonter.org) on July 3, 2017 11:03 AM */\n \n@font-face {\n	font-family: \'iconfont\';\n	src: url(data:font/truetype;charset=utf-8;base64,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IyA8IC4jOLEkARQrLbA6LLEJBCVCsAAWsAQlsAQlIC5HI0cjYSCwBCNCsAZFKyCwYFBYILBAUVizAiADIBuzAiYDGllCQiMgR7AEQ7CAYmAgsAArIIqKYSCwAkNgZCOwA0NhZFBYsAJDYRuwA0NgWbADJbCAYmGwAiVGYTgjIDwjOBshICBGI0ewACsjYTghWbEkARQrLbA7LLAuKy6xJAEUKy2wPCywLyshIyAgPLAEI0IjOLEkARQrsARDLrAkKy2wPSywABUgR7AAI0KyAAEBFRQTLrAqKi2wPiywABUgR7AAI0KyAAEBFRQTLrAqKi2wPyyxAAEUE7ArKi2wQCywLSotsEEssAAWRSMgLiBGiiNhOLEkARQrLbBCLLAJI0KwQSstsEMssgAAOistsEQssgABOistsEUssgEAOistsEYssgEBOistsEcssgAAOystsEgssgABOystsEkssgEAOystsEossgEBOystsEsssgAANystsEwssgABNystsE0ssgEANystsE4ssgEBNystsE8ssgAAOSstsFAssgABOSstsFEssgEAOSstsFIssgEBOSstsFMssgAAPCstsFQssgABPCstsFUssgEAPCstsFYssgEBPCstsFcssgAAOCstsFgssgABOCstsFkssgEAOCstsFossgEBOCstsFsssDArLrEkARQrLbBcLLAwK7A0Ky2wXSywMCuwNSstsF4ssAAWsDArsDYrLbBfLLAxKy6xJAEUKy2wYCywMSuwNCstsGEssDErsDUrLbBiLLAxK7A2Ky2wYyywMisusSQBFCstsGQssDIrsDQrLbBlLLAyK7A1Ky2wZiywMiuwNistsGcssDMrLrEkARQrLbBoLLAzK7A0Ky2waSywMyuwNSstsGossDMrsDYrLbBrLCuwCGWwAyRQeLABFTAtAABLuADIUlixAQGOWbkIAAgAYyCwASNEILADI3CwDkUgIEu4AA5RS7AGU1pYsDQbsChZYGYgilVYsAIlYbABRWMjYrACI0SzCgkFBCuzCgsFBCuzDg8FBCtZsgQoCUVSRLMKDQYEK7EGAUSxJAGIUViwQIhYsQYDRLEmAYhRWLgEAIhYsQYBRFlZWVm4Af+FsASNsQUARAAAAAAAAAAAAAAAAAAAAAAAAAAAMgAyAxj/4QNS/ywDGP/hA1L/LAAAAAAAAAAA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) format(\'truetype\');\n	font-weight: 500;\n	font-style: normal;\n}\n \n.iconfont {\n  font-family:\"iconfont\" !important;\n  font-size:16px;\n  font-style:normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n \n.icon-search:before { content: \"\\e611\"; }\n \n.icon-youjiantou:before { content: \"\\e603\"; }\n \n.icon-daifukuan:before { content: \"\\e684\"; }\n \n.icon-daishouhuo:before { content: \"\\e642\"; }\n \n.icon-wode:before { content: \"\\e606\"; }\n \n.icon-icon:before { content: \"\\e64b\"; }\n \n.icon-diliweizhishezhi:before { content: \"\\e616\"; }\n \n.icon-daifahuo:before { content: \"\\e678\"; }\n \n.icon-daipingjia:before { content: \"\\e619\"; }\n \n.icon-shouye:before { content: \"\\e69d\"; }\n\n```\n![20170703185559892.png](http://localhost:3000/images/articleImg/d0288d10-f79f-11e9-9713-89c63d91179c_720.png)\n', '2019-10-26 11:27:57', '2019-11-06 09:07:09', NULL, 'https://blog.csdn.net/nongweiyilady/article/details/74244362', 'k|亚马逊', 1);
INSERT INTO `article` VALUES (16, 26, '微信搜一搜和好物圈接入指南', '', '#### 微信搜一搜\n\n##### 接入级别\n\n![官方区规则权益](http://p.qpic.cn/hottopic/0/1570717208e9dd2797018cad79186e03e8c5aec8dc/0)\n\n##### 自定义模板\n\n​	开发者可通过各类自定义模板，将小程序内的服务和内容信息以API形式接入微信平台，便于用户搜索直达。\n\n##### 即将开放小程序内容接入\n\n​	针对认证小程序后续会开放内容接入功能，支持小程序的优质内容通过API接口的形式接入到搜一搜内容库，内容审核通过并上线后会被用户在微信搜一搜入口下搜索到。该功能还在开发中，后续会对外开放。\n\n#### 好物圈\n\n##### 接入条件\n\n1. 小程序已开通微信支付；\n2. 小程序不属于金融、游戏、医疗等类目。\n\n##### 接入方式\n\n​	开发者可通过以下API接入好物圈：\n\n1. [订单接口](https://wsad.weixin.qq.com/wsad/zh_CN/htmledition/order/html/document/orderlist/import.part.html)：将用户的订单信息同步至好物圈\n\n2. [收藏接口](https://wsad.weixin.qq.com/wsad/zh_CN/htmledition/order/html/document/cartlist/import.part.html)：将用户的购物车信息导入好物圈\n\n3. [物品信息](https://wsad.weixin.qq.com/wsad/zh_CN/htmledition/order/html/document/goods/update.part.html)：更新物品相关信息，如上下架状态、是否售罄、价格变化、可配送范围等。\n\n4. 同时，开发者还可以在小程序中使用[推荐接口](https://wsad.weixin.qq.com/wsad/zh_CN/htmledition/order/html/document/share/index.html)，方便用户直接将物品推荐到好物圈。\n\n   开发者调用微信公众平台接口需[获取access_token](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183)。第三方平台代小程序接入好物圈[接入指引](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=11538030024LfQB7&version=1&lang=zh_CN&platform=2)。', '2019-10-29 09:12:12', '2019-10-29 09:13:52', NULL, '', '接入指引|好物圈|自定义模板|搜一搜', NULL);

-- ----------------------------
-- Table structure for article_tag
-- ----------------------------
DROP TABLE IF EXISTS `article_tag`;
CREATE TABLE `article_tag`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '博客ID',
  `tag_id` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '标签ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '博客to标签中间表' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分类名称',
  `pid` int(10) NOT NULL COMMENT '父级id',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '图标路径',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '前端', 0, NULL);
INSERT INTO `category` VALUES (2, '后端', 0, NULL);
INSERT INTO `category` VALUES (3, '开发工具', 0, NULL);
INSERT INTO `category` VALUES (6, 'CSS', 1, NULL);
INSERT INTO `category` VALUES (7, 'JavaScript', 1, NULL);
INSERT INTO `category` VALUES (10, 'HTML', 1, NULL);
INSERT INTO `category` VALUES (11, 'Node.js', 2, NULL);
INSERT INTO `category` VALUES (25, 'VSCode', 3, NULL);
INSERT INTO `category` VALUES (26, '小程序', 1, NULL);

-- ----------------------------
-- Table structure for ips
-- ----------------------------
DROP TABLE IF EXISTS `ips`;
CREATE TABLE `ips`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'users表的name',
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_ips_name_users_name`(`name`) USING BTREE,
  CONSTRAINT `fk_ips_name_users_name` FOREIGN KEY (`name`) REFERENCES `users` (`name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ips
-- ----------------------------
INSERT INTO `ips` VALUES (4, '790943331@qq.com', '127.0.0.1', NULL, NULL);
INSERT INTO `ips` VALUES (7, '790943332@qq.com', '::1', NULL, NULL);
INSERT INTO `ips` VALUES (8, '2444447@qq.com', '127.0.0.1', NULL, NULL);
INSERT INTO `ips` VALUES (9, '2444446@qq.com', '12345', NULL, NULL);
INSERT INTO `ips` VALUES (10, '790943332@qq.com', '127.0.0.1', NULL, NULL);
INSERT INTO `ips` VALUES (11, '790943332@qq.com', '127.0.0.2', NULL, NULL);
INSERT INTO `ips` VALUES (12, '2444445@qq.com', '127.0.0.1', NULL, '2019-11-08 13:23:15');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `role_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, '超级管理员');
INSERT INTO `role` VALUES (2, '管理员');
INSERT INTO `role` VALUES (3, '编辑');
INSERT INTO `role` VALUES (4, '设计');

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '账户' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱做用户名',
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `tel` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号码',
  `created_at` timestamp(0) NULL DEFAULT NULL COMMENT '账户创建时间',
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '上次登录时间',
  `count` int(255) NULL DEFAULT NULL COMMENT '登录次数',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (7, '2444444@qq.com', '1234', 'yy', NULL, '2019-10-15 13:42:33', '2019-10-15 14:34:50', 2);
INSERT INTO `users` VALUES (8, '790943331@qq.com', '123', 'wf', NULL, '2019-10-15 13:50:30', '2019-11-08 12:18:32', 11);
INSERT INTO `users` VALUES (9, '2444445@qq.com', '1235', 'yy', NULL, '2019-10-15 14:35:28', '2019-11-08 13:23:15', 4);
INSERT INTO `users` VALUES (10, '2444446@qq.com', '1234', 'yy', NULL, '2019-10-15 14:36:22', '2019-11-08 12:56:46', 1);
INSERT INTO `users` VALUES (11, '2444447@qq.com', '1234', 'yy', NULL, '2019-10-15 14:46:31', '2019-11-08 12:51:19', 3);
INSERT INTO `users` VALUES (12, '790943332@qq.com', '1234', 'wf', NULL, '2019-10-15 14:57:20', '2019-11-08 13:05:58', 33);
INSERT INTO `users` VALUES (13, '790943341@qq.com', '1234', 'wf', NULL, '2019-10-15 15:33:07', '2019-10-15 15:33:07', 0);

-- ----------------------------
-- Procedure structure for article_hot
-- ----------------------------
DROP PROCEDURE IF EXISTS `article_hot`;
delimiter ;;
CREATE PROCEDURE `article_hot`(_id INT(255))
BEGIN
	DECLARE _count INT(255);
	SELECT `count` INTO _count FROM `article` WHERE `id` = _id;
	IF _count IS NULL THEN
		SET _count = 1;
	ELSE
		SET _count = _count+1;
	END IF;
	UPDATE `article` SET `count`= _count WHERE id = _id;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for login
-- ----------------------------
DROP PROCEDURE IF EXISTS `login`;
delimiter ;;
CREATE PROCEDURE `login`(_email VARCHAR(20),_emailCode VARCHAR(20),_nickname VARCHAR(20),_ip VARCHAR(255))
BEGIN
	DECLARE _name VARCHAR(255) DEFAULT NULL;
	DECLARE _count INT(255) DEFAULT 0;
	DECLARE _status CHAR(50) DEFAULT 0;
-- 	status:0密码错误,1新增用户,2再次登录用户
	DECLARE _temp VARCHAR(255) DEFAULT NULL;
	SELECT `name` INTO _name  FROM `users` WHERE `name` = _email;
	SELECT `count` INTO _count  FROM `users` WHERE `name` = _email;
	IF _name IS NULL THEN
	INSERT INTO `users`(`name`,`password`,`nickname`,`tel`,`created_at`,`updated_at`,`count`,`ip`) VALUES(_email,_emailCode,_nickname,null,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),_count);
	INSERT INTO `ips`(`ip`,`name`) VALUES(_ip,_email);
		set _status = 1;
		SELECT _status AS `status`;
	ELSE
		SELECT `password` INTO _temp  FROM `users` WHERE `name` = _email;
		IF _temp = _emailCode THEN
		  set _status = 2;
			set _count = _count + 1;
			set _temp = NULL;
			UPDATE `users` SET `count`= _count, `updated_at`= CURRENT_TIMESTAMP() WHERE `name` = _email;
			SELECT `ip` INTO _temp FROM `ips` WHERE `name` = _email AND `ip` = _ip;
				IF _temp IS NULL THEN
					INSERT INTO `ips`(`name`,`ip`,`created_at`,`updated_at`) VALUES(_email,_ip,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP());
				ELSEIF _temp != _ip THEN
					INSERT INTO `ips`(`name`,`ip`,`created_at`,`updated_at`) VALUES(_email,_ip,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP());
				ELSE
					UPDATE `ips` SET `updated_at`= CURRENT_TIMESTAMP() WHERE `name` = _email AND `ip` = _ip;
				END IF;
			SELECT _status AS `status`;
		ELSE
			SELECT _status AS `status`;
		END IF;
	END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
