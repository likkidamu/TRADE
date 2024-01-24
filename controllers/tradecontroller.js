const model = require('../models/item');
const { redirect } = require('express/lib/response');
const save_model = require("../models/tradeSave");
const offer_model = require("../models/tradeOffer");

//Get /newTradeform.ejs
exports.newpro = (req,res)=>{
res.render('./trades/newTrade');
  };
  
//get full list
/*exports.listtrade = (req,res) => {
  let trade = model.find();
  res.render('./trades/trades',{trade});
}*/
exports.listtrade = (req, res, next)=>{
  //res.send('send all stories');
  model.find()
  .then(stories=>res.render('./trades/trades', {stories}))
  .catch(err=>next(err));
};

//Get trade item details (trade.ejs) content
/*exports.showdetails = (req,res,next) => {
  let id = req.params.id;
  let item = model.findById(id);
  if(item) {
  res.render('./trades/trade',{item});
  } else{
    let err = new Error('Cannot find trade with id ' + id);
    err.status = 404;
    next(err);
  }
}*/

exports.showdetails = (req, res, next)=>{
  let id = req.params.id;
  //an object id is a 24-bit string
  model.findById(id).populate('author', 'firstName lastName')
  .then(story=>{
      if(story) {
         return res.render('./trades/trade', {story});
      } else {
          let err = new Error('Cannot find a trade with id ' + id);
          err.status = 404;
          next(err);
      }
  })
  .catch(err=>next(err));  
};


//Get /editTradeform.ejs

exports.editTrade = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .then((story) => {
      res.render("./trades/editTradeform", { story });
    })
    .catch((err) => {
      next(err);
    });
};


/*exports.editTrade = (req,res,next)=>{
  let id = req.params.id;
  let item = model.findById(id);
  if(item) {
  res.render('./trades/editTradeform',{item});
  } else{
    let err = new Error('Cannot find trade with id ' + id);
    err.status = 404;
    next(err);
  }
    };*/


//update item details
/*exports.update = (req,res,next)=>{
  let story = req.body;
    let id = req.params.id;
    if(model.updateById(id, story)) {
        res.redirect('/trades/'+id);
  } else{
    let err = new Error('Cannot find trade with id ' + id);
    err.status = 404;
    next(err);
  }
    };*/

  exports.update = (req, res, next) => {
    let story = req.body;
    let id = req.params.id;
    model
      .findByIdAndUpdate(id, story, { useFindAndModify: false,runValidators: true,})
      .then((story) => {
        req.flash("success", "Succesfully updated a trade ");
        res.redirect("/trades/" + id);
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          err.status = 400;
        }
        next(err);
      });
  };


// Delete item
/*exports.delete = (req,res,next) => {
  // res.send('delete a exiting trade ', req.params.id)
  let id = req.params.id
  if(model.deleteById(id)){
      res.redirect('/trades');
  }
  else{
    let err = new Error('Cannot find trade with id ' + id);
    err.status = 404;
    next(err);
  }
}*/

exports.delete = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .then((item) => {
      let name = item.offerItem;
      Promise.all([
        offer_model.findOneAndDelete(
          { title: name },
          { useFindAndModify: false }
        ),
        model.findByIdAndDelete(id, { useFindAndModify: false }),
        model.findOneAndUpdate({title:name},{status:"Available", Offered:false})
      ])
        .then((results) => {
          const [offer, item, item2] = results;
        })
        .catch((err) => {
          next(err);
        });
      req.flash("success", "Succesfully deleted a Trade");
      res.redirect("/trades");
    })
    .catch((err) => {
      next(err);
    });
};

exports.create = (req, res, next)=>{
 
  let story = new model(req.body); 
  story.author = req.session.user;
  story.status = "Available";
  story.offerItem = "";
  story.Saved = false;
  story.Offered = false;
  story.save() // insert the document to the db
  .then((story)=> {
    req.flash("success", "Succesfully created a new Trade");
      res.redirect('/trades');
  } )
  .catch(err=>{
      if(err.name ==='ValidationError') {
          err.status = 400;
          req.flash('error', err.message);
            res.redirect('back');
      }
      next(err);
  });
};


// Adding to watchlist
exports.save = (req, res, next) => {
  console.log("in save");
  let id = req.params.id;
  model.findByIdAndUpdate(
      id,
      { Saved: true },
      {
        useFindAndModify: false,
        runValidators: true,
      }
    )
    .then((item) => {
      let name = item.title;
      let newSaveItem = new save_model({
        title: item.title,
        category: item.category,
        status: item.status,
      });
      newSaveItem.SavedBy = req.session.user;
      save_model
        .findOne({ title: name })
        .then((item) => {
          if (!item) {
            newSaveItem
              .save()
              .then((newSaveItem) => {
                req.flash("success", "Trade Added to Watchlist");
                res.redirect("/users/profile");
              })
              .catch((err) => {
                if (err.name === "ValidationError") {
                  err.status = 400;
                }
                next(err);
              });
          } else {
            req.flash("error", "Trade is already saved");
            res.redirect("/save");
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

// Remove from watchlist

exports.savedelete = (req, res, next) => {
  console.log("in save delete");
  let id = req.params.id;
  model
    .findByIdAndUpdate(id, { Saved: false })
    .then((story) => {
      let name = story.title;
      save_model
        .findOneAndDelete({ title: name }, { useFindAndModify: false })
        .then((save) => {
          req.flash("success", "Trade removed from the Watchlist");
          res.redirect("back");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};


/// Trading an item button functionality
exports.trade = (req, res, next) => {
  console.log("in trade");
  let user = req.session.user;
  let iD = req.params.id;
  model.findByIdAndUpdate(
  iD,
      { status: "Offer Pending", Offered: true },
      {
        useFindAndModify: false,
        runValidators: true,
      }
    )
    .then((item) => {
      let newOfferItem = new offer_model({
        title: item.title,
        status: "Offer Pending",
        category: item.category,
        OfferedBy: user,
      });
      newOfferItem.save().then((offer) => {
        model
          .find({ author: user})
          .then((items) => {
            res.render("./trades/productTrade", { items });
          })
          .catch((err) => {
            next(err);
          });
      });
    })
    .catch((err) => {
      next(err);
    })
    .catch((err) => {
      next(err);
    });
};

exports.tradeitem = (req, res, next) => {
  console.log("in trade item");
  let id = req.params.id;
  let user = req.session.user;
  Promise.all([
    model.findByIdAndUpdate(
      id,
      { status: "Offer Pending" },
      {
        useFindAndModify: false,
        runValidators: true,
      }
    ),
    offer_model.findOne({ OfferedBy: user }).sort({ _id: -1 }),
  ])
    .then((results) => {
      const [item, Offered] = results;
      let name = Offered.title;
      model
        .findByIdAndUpdate(
          id,
          { offerItem: name },
          {
            useFindAndModify: false,
            runValidators: true,
          }
        )
        .then((item) => {
          req.flash("success", "Trade offer successfully created for a Trade");
          res.redirect("/users/profile");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// manage button functionality
exports.manage = (req, res, next) => {
  console.log("in manage offer function");
  let id = req.params.id;
  let user = req.session.user;
  model
    .findById(id)
    .then((item) => {
      if (item.offerItem === "") {
        let name = item.title;
        model
          .findOne({ offerItem: name })
          .then((item) => {
            res.render("./trades/manage", { item });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        let name = item.offerItem;
        offer_model
          .findOne({ title: name })
          .then((offer) => {
            res.render("./trades/manageTrade", { item, offer });
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

// deleting the manage offer request
exports.deletemanageoffer = (req, res, next) => {
  console.log("in manage-offer delete");
  let id = req.params.id;
  model
    .findByIdAndUpdate(id, { status: "Available", offerItem: "" })
    .then((item) => {
      let name = item.offerItem;
      Promise.all([
        offer_model.findOneAndDelete({ title: name }),
        model.findOneAndUpdate(
          { title: name },
          { status: "Available", Offered: false }
        ),
      ])
        .then((results) => {
          const [offer, item] = results;
          req.flash("success", "Trade offer is cancelled");
          res.redirect("/users/profile");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// profile delete offer request

exports.deleteoffer = (req, res, next) => {
  console.log("in offer delete");
  let id = req.params.id;
  model
    .findByIdAndUpdate(
      id,
      { status: "Available", Offered: false },
      {
        useFindAndModify: false,
        runValidators: true,
      }
    )
    .then((item) => {
      let name = item.title;

      Promise.all([
        model.findOneAndUpdate(
          { offerItem: name },
          { status: "Available", offerItem: "" }
        ),
        offer_model.findOneAndDelete(
          { title: name },
          { useFindAndModify: false }
        ),
      ])
        .then((results) => {
          const [item, offer] = results;
          req.flash("success", "Trade offer has been cancelled");
          res.redirect("/users/profile");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// Accept an offer
exports.accept = (req, res, next) => {
  console.log("in accept");
  let id = req.params.id;
  model
    .findByIdAndUpdate(
      id,
      { status: "Traded" },
      {
        useFindAndModify: false,
        runValidators: true,
      }
    )
    .then((item) => {
      let name = item.offerItem;

      Promise.all([
        model.findOneAndUpdate(
          { title: name },
          { status: "Traded" },
          {
            useFindAndModify: false,
            runValidators: true,
          }
        ),
        offer_model.findOneAndDelete(
          { title: name },
          { useFindAndModify: false }
        ),
      ])
        .then((results) => {
          const [item, offer] = results;
          req.flash("success", "Trade offer has been successfully accepted");
          res.redirect("/users/profile");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

// Reject an offer
exports.reject = (req, res, next) => {
  console.log("in reject");
  let id = req.params.id;
  model
    .findByIdAndUpdate(
      id,
      { status: "Available", offerItem: "" },
      {
        useFindAndModify: false,
        runValidators: true,
      }
    )
    .then((item) => {
      let name = item.offerItem;
      Promise.all([
        model.findOneAndUpdate(
          { title: name },
          { status: "Available", Offered:false },
          {
            useFindAndModify: false,
            runValidators: true,
          }
        ),
        offer_model.findOneAndDelete({ title: name }),
      ])
        .then((results) => {
          const [item, offer] = results;
          let name = item.title;
          let status = item.status;
          if (item.Saved) {
            save_model
              .findOneAndUpdate(
                { title: name },
                { status: status },
                {
                  useFindAndModify: false,
                  runValidators: true,
                }
              )
              .then((save) => {})
              .catch((err) => {
                next(err);
              });
          }
          req.flash("success", "Trade offer has been rejected");
          res.redirect("/users/profile");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};