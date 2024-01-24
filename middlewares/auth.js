const Story = require('../models/item')
const save_model = require("../models/tradeSave");
const offer_model = require("../models/tradeOffer");

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
    return next(); // moveon to the next middleware function
    }
else{
    req.flash('error', 'You are logged in already');
    return res.redirect('/users/profile');
    }
}

//track if use is authenticated
exports.isLoggedIn = (req, res, next) =>{
    if(req.session.user){
        return next(); // moveon to the next middleware function
        }
    else{
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
        }
}

//author of the story
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    Story.findById(id)
    .then(story=> {
        if(story){
        if(story.author == req.session.user){
            return next();
        }else{
            req.flash('error','Unauthorized to access the resource');
                return res.redirect('/');
        }
       }
    })
        .catch(err=> next(err));
}

// authorized user 
exports.isValidUser = (req, res, next) => {
    id = req.params.id;
    Story
      .findById(id)
      .then((item) => {
        let name = item.title;
        save_model
          .findOne({ title: name })
          .then((item) => {
            if (item) {
              if (item.SavedBy == req.session.user) {
                console.log("Authorized User");
                return next();
              } else {
                let err = new Error("You are not authorized to preform this action");
                err.status = 401;
                next(err);
              }
            } else {
              let error = new Error("No Item found with id  " + id);
              error.status = 404;
              next(error);
            }
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };

//checks user session
  exports.isOfferedBy = (req, res, next) => {
    id = req.params.id;
    Story
      .findById(id)
      .then((item) => {
        let name = item.title;
        offer_model
          .findOne({ title: name })
          .then((item) => {
            if (item) {
              if (item.OfferedBy == req.session.user) {
                console.log("Author is same as the user");
                return next();
              } else {
                let err = new Error("You are not authorized to preform this action");
                err.status = 401;
                next(err);
              }
            } else {
              let error = new Error("No Item found with id  " + id);
              error.status = 404;
              next(error);
            }
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };

