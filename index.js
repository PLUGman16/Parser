const puppeteer = require('puppeteer');
const cheerio = require('cherio');

const url = 'https://yandex.ru/news?utm_source=main_stripe_big'

async function main () {
    const browser = await puppeteer.launch({
        headless: false        
    })
    const page = await browser.newPage()
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    })
    await page.goto(url, {
        waitUntil: 'networkidle2'
    })
    //await page.screenshot({path: 'yandex.jpg'})
    //получаем всю HTML разметку сайта
    const content = await page.content()
    //загружаем скачанную разметку в cheerio
    const $ = cheerio.load(content)
    //этот массив нужен для того чтобы хранить заголовки новостей
    const tittles = []
    $('.mg-card__link').slice(0, 5).each((idx, elem) => {
        const tittle = $(elem).text()

        tittles.push(tittle)
    })



    await browser.close()
    console.log(tittles)
}
main()