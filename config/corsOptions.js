const whiteList = ['mysite.com'];

const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }else{
            callback(Error('Not Allowed By cors'));
        }
        
    },
    optionsSuccessStatus:200
}

module.exports = corsOptions;