const express = require('express');
const tradecontroller = require('../controllers/tradecontroller');
const {isLoggedIn,isAuthor,isValidUser,isOfferedBy} = require('../middlewares/auth');
const {validateId, validateitem,validateResult} = require('../middlewares/validator');

const traderouter = express.Router();

//Get /newTrade.ejs
traderouter.get('/newTrade',isLoggedIn, tradecontroller.newpro);
//mainrouter.get('/newTrade.ejs',(req,res)=>{res.send('Get newTrade.ejs');});

//Get /editTrade.ejs
//traderouter.get('/editTradeform',tradecontroller.editTrade);

//get full list - this is index
traderouter.get('/',tradecontroller.listtrade);

//create new item
traderouter.post('/',isLoggedIn,validateitem, validateResult, tradecontroller.create);

//Get /trade.ejs item details
traderouter.get('/:id', validateId,tradecontroller.showdetails);

//get the edit form
traderouter.get('/:id/edit', validateId, isLoggedIn, isAuthor, tradecontroller.editTrade);

traderouter.put('/:id', validateId, isLoggedIn, isAuthor, validateitem, validateResult, tradecontroller.update);

//mainrouter.get('/trade.ejs',(req,res)=>{res.send('Get trade.ejs');});

traderouter.delete('/:id',validateId, isLoggedIn, isAuthor, tradecontroller.delete);

//To save or watch the trade
traderouter.post( "/:id/save", validateId, isLoggedIn, validateResult, tradecontroller.save);

// To unsave a saved trade
traderouter.delete( "/:id/savedelete", validateId, isLoggedIn, isValidUser, tradecontroller.savedelete);

// Trade button route
traderouter.get("/:id/trade", validateId, isLoggedIn, tradecontroller.trade);

// Trade button route
traderouter.get("/:id/tradeitem", isLoggedIn, tradecontroller.tradeitem);

//Manage trade
traderouter.get("/:id/manage", validateId, isLoggedIn, tradecontroller.manage);

//delete manage request
traderouter.delete( "/:id/deletemanageoffer",validateId, tradecontroller.deletemanageoffer);

// delete offer/ cancel it in profile 
traderouter.delete( "/:id/deleteoffer",validateId,  isLoggedIn, isOfferedBy,tradecontroller.deleteoffer);

// accept a trade request
traderouter.get("/:id/accept", validateId, isLoggedIn, tradecontroller.accept);

//reject a trade request
traderouter.get("/:id/reject", validateId, isLoggedIn, tradecontroller.reject);


//Get /trades.ejs
//traderouter.get('/trades',tradecontroller.trades);
//mainrouter.get('/trades.ejs',(req,res)=>{res.send('Get trades.ejs');});


module.exports = traderouter;
