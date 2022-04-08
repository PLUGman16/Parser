const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

//Искомый материал
const search = 'Риддик'
const urlKinopoisk = 'https://www.kinopoisk.ru/'
//результат поиска кинопоиск
const urlKinopoiskInput = `https://www.kinopoisk.ru/index.php?kp_query=${search}`

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
    await page.goto(urlKinopoiskInput)
    /*await page.screenshot({
        path: 'screen.png'
    })*/
    //Получаем HTML страницы
    const content = await page.content()
    //Скармливаем страницу cheerio
    const $ = cheerio.load(content)
    //Массив для хранения результата парсинга
    const tittles = []

    //Парсим 4 первых названия из поиска
    $('.name').slice(0, 4).each((idx, elem) => {
        const tittle = {
            tittle: $(elem).text()
        }
        tittles.push(tittle)
    })
    //Парсим 4 первых ссылки из поиска
    $('.name a').slice(0, 4).each((idx, elem) => {
        const tittle = $(elem).attr('href')

        tittles[idx].link = tittle
    })
    //Парсим 4 первые ссылки на картинки из поиска
    $('.element p a img').slice(0, 4).each((idx, elem) => {
        const tittle = $(elem).attr('src')

        tittles[idx].img = tittle
    })
    console.log(tittles)
    console.log(`${urlKinopoisk}${tittles[0].link}`)
    await browser.close()
}
main()