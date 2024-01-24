

//Get /index
//mainrouter.get('/',(req,res)=>{res.send('Get index.ejs');});

//Get /index
exports.index = (req,res)=>{
    res.render('./index');
    //res.send('Get index.ejs');
    };

//Get /newTrade.ejs
exports.newTrade = (req,res)=>{
res.render('./newTrade');
  };

//Get /trade.ejs
exports.trade = (req,res)=>{
    res.render('./trade');
    };

//Get /trades.ejs
exports.trades = (req,res)=>{
    res.render('./trades');
    };

//Get /about.ejs
exports.about =(req,res)=>{
    res.render('./about');
    };

//Get /contact.ejs 
exports.contact =(req,res)=>{
    res.render('./contact');
    };