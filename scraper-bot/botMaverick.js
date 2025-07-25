const puppeteer = require('puppeteer'),
    fs = require('fs'),
    fsPromises = require('fs').promises,
    path = require('path'),
    eventLogger = require('../middleware/logEvents');

    


const scrapeMaverick = async (url,filename) => {
    const browser = await puppeteer.launch({ userDataDir: './tmp', headless: true, args:['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.mouse.wheel({deltaY:9000});
    

    const newsData = await page.evaluate(() => {
        const storyImg = document.querySelectorAll('.media-left img');
        const storyTitle = document.querySelectorAll('.media-body h1');
        const storyDate = document.querySelectorAll('.date'),
            storyLink = document.querySelectorAll('.media-item.Sport a')


        const imgURL = [];
        const title = [];
        const date = [];
        const link = [];

        for (let i = 0; i < 21; i++) {
            if (storyImg[i]) imgURL.push(storyImg[i].src);
            if (storyTitle[i]) title.push(storyTitle[i].innerText);
            if (storyDate[i]) date.push(storyDate[i].innerText);
            if (storyLink[i]) link.push(storyLink[i].href);
        }

        return { imgURL, title, date, link };
    });
    console.log(newsData)
    await browser.close();
    await fsPromises.writeFile(path.join(__dirname,'..','news', 'maverick',filename), JSON.stringify(newsData));
    await eventLogger(`${url}`, 'botProgress.txt');
};



module.exports =  scrapeMaverick