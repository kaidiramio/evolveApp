module.exports = function(app, passport, db) {


  const { ObjectId } = require('mongodb') //gives access to _id in mongodb

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/', (req, res) => {
       // name of array is result inside this scope
      db.collection('messages').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {fact: result})

    // respond with the rendering of our ejs (we've passed all of our array/objects into messages)..which ejs responds with HTML and includes all the content we got back from out database

    // ejs is a templating language -> job is to have a template that we plug data into and then gives us an HTML file that displays to the user. 
    // can't build out data if we hardcode out HTML 
  })
})

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('profilePage').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            // mood: result
          })
        })
    });
    
// AFFIRMATION SECTION =========================

app.get("/affirmations", isLoggedIn, function (req, res) {
  db.collection('intentions')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.render("affirmations.ejs", {
        user : req.user,
        intentionRecord: result,
      });
    });
});


   // REFLECT SECTION =========================
   app.get('/reflect', function(req, res) {
    db.collection('messagesMood').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('reflect.ejs', {
        user : req.user,
        mood: result
      })
    })
  });


  // Daily ritual SECTION =========================
  app.get('/dailyRituals', function(req, res) {
    db.collection('dailyRituals').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('dailyRituals.ejs', {
        user : req.user,
        // rituals: result
      })
    })
  }); 

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board AFFIRMATION PAGE routes ===============================================================

app.post("/intentionForm", isLoggedIn, (req, res) => {
  db.collection('intentions').insertOne(
    // { 
    //   _id: ObjectId( req.body.msgId)
    // },
    { 
      // userID: req.user,
      date: req.body.date,
      name: req.body.name,
      note: req.body.note 
    },
    (err, result) => {
      if (err) return console.log(err);
      console.log("saved to Mongo DB");
      res.redirect("/affirmations");
    }
  )
});

// EDIT POST
app.post("/edit", isLoggedIn, (req, res) => {
  db.collection('intentions').findOneAndUpdate(
      { 
        _id: ObjectId( req.body.msgId)
      },
      { $set: {
          date: req.body.date,
          name: req.body.name,
          note: req.body.note,
      }   
  },
  {
      sort: {_id: -1},  
      upsert: false
  }, (err, result) => {
      if (err) return res.send(err)
      res.redirect("/affirmations")        
  })
});  

// DELETE

app.delete('/intention-delete', isLoggedIn, (req, res) => {
  db.collection('intentions').findOneAndDelete(
    {
      _id: ObjectId( req.body._id)
      }, 
      (err, result) => {
    if (err) return res.send(500, err)
    res.send('Your Intention has been deleted!')
  }) 
})

// message board REFLECT PAGE routes ===============================================================
    app.post('/messagesMood', (req, res) => {
      db.collection('messagesMood').save({date: req.body.date, time: req.body.time, msg: req.body.msg}, (err, result) => {
        if (err) return console.log(err)
         console.log('saved to database')
        res.redirect('/reflect')
      })
    })

    app.post('/reflect', (req, res) => {
      db.collection('messagesMood').insertOne({date: req.body.date, time: req.body.time, msg: req.body.msg}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/reflect')
      })
    })

    app.delete('/mood-delete', isLoggedIn, (req, res) => {
      db.collection('messagesMood').findOneAndDelete(
        {
          _id: ObjectId( req.body._id)
          }, 
          (err, result) => {
        if (err) return res.send(500, err)
        res.send('Your Intention has been deleted!')
      }) 
    })



    // ***********MESSAGE BOARD DAILY RITUALS (not functional right now was just playing around) **********

    // app.put('/addChecked', (req, res) => {
    //   db.collection(collectionName)
    //   .findOneAndUpdate({ _id: ObjectId(req.body.postObjectID)}, 
    //   {
    //     $set: {
    //       complete: true,
    //       thisUser: req.user.local.firstName
    //     }
    //   },
    //    {
    //     sort: {_id: -1}, //Sorts documents in db ascending (1) or descending (-1)
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    // app.put('/removeChecked', (req, res) => {
    //   db.collection(collectionName)
    //   .findOneAndUpdate({ _id: ObjectId(req.body.postObjectID)}, 
    //   {
    //     $set: {
    //       complete: false,

    //     }
    //   },
    //    {
    //     sort: {_id: -1}, //Sorts documents in db ascending (1) or descending (-1)
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })


    // app.delete('/deleteOrder', (req, res) => {
    //   db.collection(collectionName).findOneAndDelete({ _id: ObjectId(req.body.postObjectID)}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) don't touch this and sign up ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
