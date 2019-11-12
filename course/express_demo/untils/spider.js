const puppeteer = require('puppeteer');
const fs = require('fs');
var images = require("images");
const chalk = require('chalk');
const log = console.log;
var db = require('../config/mysql')
const TOTAL_PAGE = 50 // 定义需要爬取的网页数量，对应页面下部的跳转链接
async function main() {
    // 首先通过Puppeteer启动一个浏览器环境
    const browser = await puppeteer.launch()
    log(chalk.green('服务正常启动'))
    // 使用 try catch 捕获异步中的错误进行统一的错误处理
    try {
        // 打开一个新的页面
        const page = await browser.newPage()
        // 监听页面内部的console消息
        page.on('console', msg => {
            if (typeof msg === 'object') {
                console.dir(msg)
            } else {
                log(chalk.blue(msg))
            }
        })

        await page.goto('http://www.pianshen.com')
        log(chalk.yellow('进入首页'))
        let [{ titleslink, numPagination }] = await handleHome()

        async function dowload(titleslink, i) {
            await page.goto(titleslink, { timeout: 0, waitUntil: "domcontentloaded" })
            log(chalk.green(`'第${i}条${titleslink} ,开始处理'`))
            // 处理数据，这个函数的实现在下面
            await handleData()
            log(chalk.green(`'第${i}条${titleslink} ,处理完毕'`))
        }
        for (let j = 0; j < numPagination.length; j++) {
            await page.waitFor(4000)
            await page.goto(numPagination[j], { timeout: 0, waitUntil: "domcontentloaded" })
            log(chalk.green(`'进入第${j}页'`))
            let [{ titleslink }] = await handleHome()
            for (let i = 0; i < titleslink.length; i++) {
                await page.waitFor(6000)
                await dowload(titleslink[i], i)
                console.log(numPagination[j], titleslink[i])
            }
        }





        // 所有的数据爬取完毕后关闭浏览器
        await browser.close()
        log(chalk.green('服务正常结束'))

        // 这是一个在内部声明的函数，之所以在内部声明而不是外部，是因为在内部可以获取相关的上下文信息，如果在外部声明我还要传入 page 这个对象
        async function handleData() {
            // 现在我们进入浏览器内部搞些事情，通过page.evaluate方法，该方法的参数是一个函数，这个函数将会在页面内部运行，这个函数的返回的数据将会以Promise的形式返回到外部 
            const list = await page.evaluate(() => {

                // 先声明一个用于存储爬取数据的数组
                const writeDataList = []

                let itemList = document.querySelector('.col-md-8');
                let writeData = {
                    content: undefined,
                    title: undefined,
                    keyWords: undefined,
                    link: undefined,
                    images: undefined
                }
                let title = itemList.getElementsByTagName('h2')[0]
                title = title.getElementsByTagName('span')[0]
                writeData.title = title.innerText

                let keyWords = itemList.getElementsByTagName('p')[0]
                if (keyWords) {
                    keyWords = keyWords.getElementsByTagName('a')
                    let tem = [];
                    for (let index = 0; index < keyWords.length; index++) {
                        tem.push(keyWords[index].innerText)
                    }
                    writeData.keyWords = tem.join("|")
                }

                let link = itemList.querySelector('.article-source-link2222')
                writeData.link = link.getElementsByTagName('a')[0].innerText

                let content = itemList.querySelector('.htmledit_views') || itemList.querySelector('.markdown_views')
                writeData.content = content.innerHTML

                let images = content.getElementsByTagName('img')

                let temArray = [];
                for (let index = 0; index < images.length; index++) {
                    temArray.push(images[index].getAttribute('src'))
                }
                writeData.images = temArray.join(',')
                writeDataList.push(writeData)
                // 当前页面所有的返回给外部环境 
                return writeDataList

            })
            let { title, content, images, link, keyWords } = list[0];
            let sql1 = 'SELECT title FROM article WHERE `title`=?'
            db.query(sql1, [title])
                .then(results => {
                    if (results.length >= 1) {
                        return;
                    } else {
                        page.on('response', async response => {
                            const matches = /.*\.(jpg|png|svg|gif|JPEG)$/.exec(response.url());
                            if (matches && (matches.length === 2)) {
                                const extension = matches[0];
                                let temArr = extension.split('pianshen.com/')[1]
                                temArr = temArr.split('/')
                                extension.slice('http://images4.pianshen.com/')
                                const buffer = await response.buffer()
                                    .catch(err => {
                                        // log(chalk.red(err));
                                    });
                                if (temArr[0] !== "images") {
                                    // try {
                                    //     fs.mkdirSync(`public/images/${temArr[0]}`);
                                    // } catch (err) {
                                    //     log(chalk.red(err))
                                    //     fs.mkdirSync(`public/images/${temArr[0]}`);
                                    // }
                                    // try {
                                    //     fs.writeFileSync(`public/images/${temArr[0]}/${temArr[2]}`, buffer, 'base64');
                                    // } catch (err) {
                                    //     log(chalk.red(err))
                                    // }
                                    fs.mkdir(`public/images/${temArr[0]}`, { recursive: true }, (err) => {
                                        if (err) log(chalk.red(err));
                                        fs.writeFileSync(`public/images/${temArr[0]}/${temArr[2]}`, buffer, 'base64');
                                    });
                                    // log(chalk.yellow(temArr))
                                }
                            }
                        });
                        let sql = 'INSERT INTO `article`(`cid`,`title`,`content`,`created_at`,`updated_at`,`images`,`link`,`keyWords`,`content_type`) VALUES(?,?,?,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),?,?,?,?)';
                        db.query(sql, [26, title, content, images, link, keyWords, 1])
                            .then(results => {
                                log(chalk.yellow('写入数据库完毕'))
                            })
                            .catch(message => {
                                log(chalk.red(message))
                            })
                    }
                })
                .catch(message => {
                    log(chalk.red(message))
                })
        }
        async function handleHome() {
            const list = await page.evaluate(() => {
                const homeList = [];
                let writeHomeList = {
                    titleslink: undefined,
                    numPagination: undefined
                }

                let homeDome = document.querySelector(".col-md-8");
                let header = homeDome.getElementsByTagName("header");
                let titleslink = []
                for (let i = 0; i < header.length; i++) {
                    titleslink.push(header[i].getElementsByTagName("a")[0].href)
                }
                writeHomeList.titleslink = titleslink

                let pages = homeDome.querySelector('.pagination')
                if (pages) {
                    let li = pages.getElementsByTagName('li')
                    let numArr = [];
                    for (let i = 0; i < li.length; i++) {
                        numArr.push(li[i].getElementsByTagName('a')[0].href)
                    }
                    writeHomeList.numPagination = numArr
                }

                homeList.push(writeHomeList)
                return homeList
            })
            // log(list)
            return list
        }



    }
    catch (error) {
        // 出现任何错误，打印错误消息并且关闭浏览器
        console.log(error)
        log(chalk.red('服务意外终止'))
        await browser.close()
    } finally {
        // 最后要退出进程
        process.exit(0)
    }
}
main()