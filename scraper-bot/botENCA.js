const puppeteer = require('puppeteer'),
    path = require('path'),
    fs = require('fs'),
    fsPromises = require('fs').promises,
    eventLogger = require('../middleware/logEvents');

const loadMore = async (page,selector) => {
    for(i = 0; i <= 3; i++){
        await page.click(selector);
        await page.waitForNetworkIdle();
    }
}

const scrapeENCA = async (url, filename) => {
    const browser = await puppeteer.launch({ userDataDir: './tmp', headless: true, args:['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout:50000 });
    await loadMore(page,'.button[title="Load more items"]');
    

    const cardNews = await page.evaluate(() => { 
        const storyImg = document.querySelectorAll('.teaser_media .image img'),
            storyTitle = document.querySelectorAll('.card_heading .heading a span'),
            storyLink = document.querySelectorAll('.card_heading .heading a'),
            storyDate = document.querySelectorAll('.bk-homepage-watch-now.card-text-content .published-date');

        const imgURL = [];
        const title = [];
        const date = [];
        const link = [];

        for (let i = 0; i < 20; i++) {
            if (storyImg[i]) imgURL.push(storyImg[i].src);
            if (storyTitle[i]) title.push(storyTitle[i].innerText);
            if (storyDate[i]) date.push(storyDate[i].innerText);
            if (storyLink[i]) link.push(storyLink[i].href);
        }

        return { imgURL, title, date, link };       
    })


    const topStory = await page.evaluate(() => {
        const storyImg = document.querySelectorAll('.teaser_media .image img'),
            storyTitle = document.querySelectorAll('.tile-heading .heading span'),
            storyLink = document.querySelectorAll('.tile-body'),
            storyDate = document.querySelectorAll('.tile-content .published-date');

        const imgURL = [];
        const title = [];
        const date = [];
        const link = [];

        for (let i = 0; i < 1; i++) {
            if (storyImg[i]) imgURL.push(storyImg[i].src);
            if (storyTitle[i]) title.push(storyTitle[i].innerText);
            if (storyDate[i]) date.push(storyDate[i].innerText);
            if (storyLink[i]) link.push(storyLink[i].href);
        }

        return { imgURL, title, date, link };
    })

    console.log(topStory, cardNews)
    await browser.close();
    await fsPromises.writeFile(path.join(__dirname,'..','news','enca',filename),JSON.stringify({ topStory, cardNews }));
    await eventLogger(`${url}`, 'botProgress.txt');
}


module.exports = scrapeENCA