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
 


app.get('/', async (req ,res) => {
  try{
    const data = await topStories('https://www.enca.com');
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500);
  }
})

app.get('/news', async (req, res) => {
  try{
    const data = await scrapeENCA('https://www.enca.com/news')
    res.status(200).json(data);
  }catch(err){
    console.log(err);
  }
})

app.get('/sports', async (req,res) => {
  try{
    const data = await scrapeMaverick('https://www.dailymaverick.co.za/section/sport');
    res.status(200).json(data);
  }catch(err){
    console.log(err);
    res.status(500);
  }
})

app.get('/business', async (req,res) => {
  try{
    const data = await scrapeENCA('https://www.enca.com/business');
    res.status(200).json(data);
  }catch(err){
    console.error(err);
    res.status(500);
  }
})

app.get('/lifestyle', async (req, res) => {
  try{
    const data = await scrapeENCA('https://www.enca.com/lifestyle');
    res.status(200).json(data);
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