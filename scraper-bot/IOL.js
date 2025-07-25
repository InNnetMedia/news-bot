const puppeteer = require('puppeteer-extra'),
    fs = require('fs'),
    StealthPlugIn = require('puppeteer-extra-plugin-stealth'),
    fsPromises = require('fs').promises,
    path = require('path'),
    eventLogger = require('../middleware/logEvents');


puppeteer.use(StealthPlugIn());


const scrapeIOL = async (url, filename) => {
    const browser = await puppeteer.launch({ userDataDir: './tmp', headless: true, args:['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
    });
   
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    

    const newsData = await page.evaluate(() => {
        const storyImg = document.querySelectorAll('.image_target__HkD5p.image_lazy__bktKn.image_visible__TpTD7'),
            storyDate = document.querySelectorAll('.attribution-and-updated_article-attribution-and-update__Iz7z_ time'),
            storyLink = document.querySelectorAll('.link_article-link__hbiqd'),
            bigStoryImg = document.querySelectorAll('.image_target__HkD5p img');

        const imgURL = [];
        const title = [];
        const date = [];
        const link = [];
        //imgURLbig = bigStoryImg.src;

        for (let i = 0; i < 100; i++) {

            if (storyImg[i]) {
                const bg = window.getComputedStyle(storyImg[i]).backgroundImage;
                const match = bg.match(/url\("(.*)"\)/);
                imgURL.push(match ? match[1] : null);
            }

            if (storyLink[i]) title.push(storyLink[i].innerText);
            if (storyDate[i]) date.push(storyDate[i].innerText);
            if (storyLink[i]) link.push(storyLink[i].href);
        }
        

        return { imgURL, title, date, link };
    });
    console.log(newsData)
    await browser.close();
    await fsPromises.writeFile(path.join(__dirname,'..','news','IOL',filename), JSON.stringify(newsData));
    await eventLogger(`${url}`, 'botProgress.txt');
    
    return newsData;
};



module.exports =  scrapeIOL