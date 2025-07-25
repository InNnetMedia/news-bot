const fs = require('fs'),
    fsPromises = require('fs').promises,
    { v4:uuid } = require('uuid'),
    path = require('path'),
    { format } = require('date-fns');


const eventLogger = async (message, filename) => {
    const date = `${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`;
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
        await fsPromises.mkdir(path.join(__dirname,'..','logs'));
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',filename), `${uuid()}\t${date}\t${message}\n`);

    }catch(err){
        console.error(err);
    }
    
}



module.exports = eventLogger 