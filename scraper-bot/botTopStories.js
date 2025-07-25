const puppeteer = require('puppeteer'),
    fs = require('fs'),
    fsPromises = require('fs').promises,
    path = require('path'),
    eventLogger = require('../middleware/logEvents');



const topStories = async (url,filename) => {
    const browser = await puppeteer.launch({ userDataDir: './tmp', headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout:50000 });

    const newsData = await page.evaluate(() => {
        const storyImg = document.querySelectorAll('.image img');
        const storyTitle = document.querySelectorAll('.heading span');
        const storyDate = document.querySelectorAll('.published-date'); // Check if selector is correct
        const articleLink = document.querySelectorAll('.tile-body');

        const imgURL = [];
        const title = [];
        const date = [];
        const link = [];

        for (let i = 0; i < 3; i++) {
            if (storyImg[i]) imgURL.push(storyImg[i].src);
            if (storyTitle[i]) title.push(storyTitle[i].innerText);
            if (storyDate[i]) date.push(storyDate[i].innerText);
            if (articleLink[i]) link.push(articleLink[i].href);
        }

        return { imgURL, title, date, link };
    });

    const cardData = await page.evaluate(() => {
        const storyImg = document.querySelectorAll('.card-media img');
        const storyTitle = document.querySelectorAll('.card_heading a span');
        const storyDate = document.querySelectorAll('.card-body .published-date'); // Check if selector is correct
        const articleLink = document.querySelectorAll('.card_heading a');

        const imgURL = [];
        const title = [];
        const date = [];
        const link = [];

        for (let i = 0; i < 12; i++) {
            if (storyImg[i]) imgURL.push(storyImg[i].src);
            if (storyTitle[i]) title.push(storyTitle[i].innerText);
            if (storyDate[i]) date.push(storyDate[i].innerText);
            if (articleLink[i]) link.push(articleLink[i].href);
        }
        console.log('Card data...')
        return { imgURL, title, date, link };
    })

    console.log(cardData)
    await browser.close();
    await eventLogger(`${url}`, 'botProgress.txt');
    
    return { newsData, cardData }
};



module.exports =  topStories