const path = require('path'),
    fs = require('fs'),
    express = require('express'),
    scrapeIOL = require('./scraper-bot/IOL'),
    scrapeMaverick = require('./scraper-bot/botMaverick'),
    scrapeENCA = require('./scraper-bot/botENCA'),
    topStories = require('./scraper-bot/botTopStories'),
    eventLogger = require('./middleware/logEvents'),
    errorHandler = require('./middleware/errorLogger'),
    corsOptions = require('./config/corsOptions'),
    cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors(corsOptions));

const data_news = require('./news/enca/news.json'),
    data_lifestyle = require('./news/enca/lifestyle.json'),
    data_business = require('./news/enca/business.json'),
    data_sports1 = require('./news/enca/sports.json'),
    data_sports2 = require('./news/maverick/sports.json'),
    data_top_stories = require('./news/enca/topStories.json');
    


const startInterval = async () => {
  while (true) {
    try{
      await scrapeENCA('https://www.enca.com/news','news.json');
      await scrapeENCA('https://www.enca.com/lifestyle','lifestyle.json');
      await scrapeENCA('https://www.enca.com/business','business.json');
      await scrapeENCA('https://www.enca.com/sports','sports.json');
      await scrapeENCA('https://www.enca.com/opinion','opinion.json');
      await topStories('https://www.enca.com','topStories.json');
      //await scrapeIOL('https://iol.co.za/business','business.json');
      await scrapeMaverick('https://www.dailymaverick.co.za/section/sport','sports.json');
    }catch(err){
      console.log(err);
      eventLogger(err,'errorLogger.txt');
    }
    
    await new Promise(resolve => setTimeout(resolve, 3600000));
  }
};

startInterval();



app.get('/', async (req ,res) => {
  try{
    res.status(200).json(data_top_stories);
  }catch(err){
    console.log(err);
    res.status(500);
  }
})

app.get('/news', async (req, res) => {
  try{
    res.status(200).json(data_news);
  }catch(err){
    console.log(err);
  }
})

app.get('/sports', async (req,res) => {
  try{
    res.status(200).json({ data_sports1, data_sports2 });
  }catch(err){
    console.log(err);
    res.status(500);
  }
})

app.get('/business', async (req,res) => {
  try{
    res.status(200).json(data_business);
  }catch(err){
    console.error(err);
    res.status(500);
  }
})

app.get('/lifestyle', async (req, res) => {
  try{
    res.status(200).json(data_lifestyle);
  }catch(err){
    console.error(err);
    res.status(500);
  }
})


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname,'views','404.html'))
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));