//////////////////////// NECESSARY IMPORTS ///////////////////////
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const port = process.env.PORT || 5000;
const MongoStore = require('connect-mongo');
var bcrypt = require('bcryptjs');
var moment = require('moment-timezone');
var sanitize = require('mongo-sanitize');
var validator = require('validator');

const cors = require('cors')
app.use(cors({credentials: true, origin: true}));

//////////////////////// SETTING UP CONNECTION TO DATABASE ///////////////////////
const mongoose = require('mongoose');
const db = mongoose.connection;

//handle Mongo error, log any errors that occur
db.on('error', console.error);

// bind a function to perform when the database has been opened
db.once('open', function() {
  console.log("Connected to DB!");
});

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// process is a global object referring to the system process running this
// code, when you press CTRL-C to stop Node, this closes the connection
process.on('SIGINT', function() {
   mongoose.connection.close(function () {
       console.log('DB connection closed');
       process.exit(0);
   });
});

const url = "mongodb+srv://webapps:ABC123@cluster0-jqqcm.mongodb.net/test?retryWrites=true";
const options = {
    user: 'webapps',
    pass: 'ABC123',
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
};

mongoose.Promise = Promise;
mongoose.connect(url, options);

var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Test that backend is connected.
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.listen(5000, function(){
    console.log('- Server listening on port 5000');
});

//////////////////////// DEFINE SCHEMAS ///////////////////////
var RewardSchema = new mongoose.Schema({
  goalCount: Number,
  actualCount: Number,
  sessionid: String,
  desc: String,
  img_path: String
});

var MedicineSchema = new mongoose.Schema({
  medicine: String,
  medicineid: String,
  description: String,
  dates: [{type: String}],
  sunday: Boolean,
  monday: Boolean,
  tuesday: Boolean,
  wednesday: Boolean,
  thursday: Boolean,
  friday: Boolean,
  saturday: Boolean,
  checked: Boolean
});

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar_path: String
});

var DatesSchema = new mongoose.Schema({
  sessionid: String,
  completed_dates: [{type: String}]
});

// Check user hashed password against login password.
UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}

// Hash password before sending to database.
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return console.log(err)
        }

        user.password = hash;
        next();
    })
});

//////////////////////// CREATE THE MODELS ///////////////////////
var Reward = mongoose.model('Reward', RewardSchema);

var User = mongoose.model('User', UserSchema);

var Medicine = mongoose.model('Medicine', MedicineSchema);

var Dates = mongoose.model('Dates', DatesSchema);


//////////////////////// POST AND GET REQUESTS BELOW ///////////////////////

app.post('/createAvatar', function(req, res, next){
  User.updateOne( { _id: req.session.userId },
                  {avatar_path: req.body.img_path}, function(err, response){
                    if (err){
                      return console.log(err);
                    }

                    res.send("avatar-updated");
                  });
});

// Fetches a user's avatar from the database.
app.get('/getAvatar', function(req, res, next){
  User.findById(req.session.userId)
  .exec((err, data) => {
    if (err){
      return console.log(err)
    }
    res.json(data);
  });
});

// Creates a reward for a user.
app.post('/createReward', function(req, res, next){
  var insert = new Reward ( {
      goalCount: parseInt(req.body.goalCount),
      actualCount: 0,
      sessionid: req.session.userId,
      desc: req.body.desc,
      img_path: req.body.img_path
  });

  insert.save(function(err, response){
      if (err){
          return console.log(err);
        }
        res.send(insert);
      });

});

// Fetches a user's reward from the database.
app.get('/getReward', function(req, res, next){
  Reward.find({sessionid: req.session.userId})
  .exec((err, data) => {
    if (err){
      return console.log(err)
    }
      res.json(data);
  });
});

// Increments a user's reward count. Also determines if they reached the reward.
app.post('/incrementReward', function(req, res, next){
    Reward.find({ sessionid: req.session.userId })
        .exec((err, data ) => {
           if (data.length === 0){
               res.send("No reward exists, don't increment")
           }
           else {
                Reward.findOneAndUpdate(
                   { sessionid: req.session.userId },
                   { $inc: {actualCount: 1}},  function(err, doc){
                       if (err){
                           console.log(err)
                       }

                       Reward.find({sessionid: req.session.userId })
                           .exec((err, data) => {
                               if (data[0].actualCount >= data[0].goalCount){

                                   Reward.deleteMany({sessionid: req.session.userId}, function(err){
                                       if(err) {
                                           return console.log(error)
                                       }
                                   })
                                   res.send("goal");
                               }
                               else {
                                   res.send("no-goal")
                               }
                           });
                         });
                 }
        });
});

// Fetches all completed dates from database.
app.get('/getCompleted', function(req, res, next){
  Dates.find({sessionid: req.session.userId})
  .exec((err, data) => {
    if (err){
      return console.log(err)
    }
      res.json(data);
  });
});

// Adds a completed date to the database.
app.post('/addDate', function(req, res, next){
  var date = moment().tz("America/New_York");
  var dow = date.day()
  var day_of_week = days[dow];

  Medicine.findOneAndUpdate(
    { $and: [{ medicine: req.body.medicine }, {medicineid: req.session.userId }]},
    { $set: {checked: true},  $push: {dates: req.body.date} },  function(err, doc){

    if (err){
      return console.log(err)
    }

    Medicine.find( {$and: [{medicineid : req.session.userId},{checked: true}]})
    .exec((err, checked_data) => {
        var num_checked = checked_data.length

        Medicine.find( {$and: [ {medicineid : req.session.userId}, { [day_of_week]: true}] })
        .exec((err, today_data) => {
            var num_today = today_data.length

            if (num_checked >= num_today){
              // insert the moment into the dates schema.
              var completed = moment().tz("America/New_York").format("YYYY/MM/DD");
              // create entry if not already exists, otherwise, update.
              Dates.updateOne( { sessionid: req.session.userId },
                              {$push: {completed_dates: completed}},
                              { upsert : true }, function(err, response){
                                if (err){
                                  return console.log(err);
                                }

                                res.send("equal")
                              });
            }
            else{
              res.send("not-equal");
            }
        });
    });
  });
});

// Verifies a user's password. Used for things like verifying checkoff or deletion.
app.post('/verifyPassword', function (req, res, next) {
  var clean_password = sanitize(req.body.password)
  User.findById(req.session.userId)
      .exec(function (err, user) {
          if (err) {
              return console.log(error)
          } else if (!user) {
              var err = new Error('User not found.');
              return console.log(err)
          }
          bcrypt.compare(clean_password, user.password, function (err, result) {
              if (result === true) {
                  res.send("OK")
              } else {
                  res.send("Wrong password")
                }
            })
        });
  });


// Fetches all dates for which a particular medicine associated with a particular user has been taken.
app.get('/getDate', function(req, res, next){
  Medicine.find({$and: [{ medicine: req.query.name }, {medicineid: req.session.userId }]})
  .exec((err, data) => {
    if (err){
      return console.log(err)
    }
    res.json(data);
  });
});

// Returns only the medicines to be taken today for the user's home page.
app.post('/resetCheck', function(req, res, next){
  Medicine.findOneAndUpdate(
    { $and: [{ medicine: req.body.medicine }, {medicineid: req.session.userId }]},
    { checked: false},  function(err, doc){
    if (err){
      return console.log(err)
    }
    return res.send("succesfully reset.");
  });
});

// Returns only the medicines to be taken today for the user's home page.
app.get('/getMedicine', function(req, res, next){
  var date = moment().tz("America/New_York");
  var dow = date.day();
  var day_of_week = days[dow];

  Medicine.find( {$and: [{medicineid: req.session.userId}, {[day_of_week]: true} ]} )
  .exec((err, data) => {
    if (err){
      return console.log(err)
    }
      res.json(data);
  });
});

// Returns all medicines for the user's profile page.
app.get('/getProfileMedicine', function(req, res, next){
    Medicine.find({medicineid: req.session.userId})
        .exec((err, data) => {
            if (err){
                return console.log(err)
            }
            res.json(data);
        });
});

// Handles when users delete their medication.
app.post('/deleteMedication', function(req, res, next){
  User.findById(req.session.userId)
      .exec(function (err, user) {
          if (err) {
              return console.log(error)
          } else if (!user) {
              var err = new Error('User not found.');
              return console.log(err)
          }

          bcrypt.compare(req.body.password, user.password, function (err, result) {
              if (result === true) {

                  Medicine.deleteMany({medicine: req.body.medicine}, function(err){
                    if(err) {
                      return console.log(error)
                    }
                    else {
                    res.send("OK-deleted!")
                    }
                  })

              } else {
                  res.send("Wrong password")
                }
        });
      });
  });

// Handles when users edit their medication.
app.post('/editMedication', function(req, res, next){
  Medicine.findOneAndUpdate(
    { $and: [{ medicine: sanitize(req.body.medicine) }, {medicineid: req.session.userId }]},
    { description: req.body.description,
      medicine: req.body.update,
      sunday: req.body.sunday,
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
      friday: req.body.friday,
      saturday: req.body.saturday
    },  function(err, doc){
    if (err){
      return console.log(err)
    }
    return res.send("succesfully saved");
  });
});

// Handles when users add medicine to their account.
app.post('/addMedicine', function(req, res, next){
  var insert = new Medicine ( {
      medicine: req.body.medicine,
      medicineid: req.session.userId,
      dates: [],
      description: req.body.medDesc,
      sunday: req.body.sunday,
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
      friday: req.body.friday,
      saturday: req.body.saturday,
      checked: false
  });

  insert.save(function(err, response){
      if (err){
          return console.log(err);
        }
      res.send(insert)
  });
});


// Handles users signing up.
app.post('/signup', function (req, res, next) {
    if (validator.isEmpty(req.body.email) || validator.isEmpty(req.body.username) ||
        validator.isEmpty(req.body.password) || validator.isEmpty(req.body.confPassword)){
          res.send("empty");
        }
    else if (!validator.isEmail(req.body.email)){
        res.send("not-email");
    }
    else if (req.body.password !== req.body.confPassword) {
        res.send("passwords dont match");
    }

    else if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.confPassword) {

        User.findOne({username: sanitize(req.body.username)})
            .exec(function (err, user) {
                  if (err) {
                      return console.log(err)
                  }
                  else if (user) {
                      res.send("User already exists")
                  }
                  else{
                    var insert = new User({
                        email: sanitize(req.body.email),
                        username: sanitize(req.body.username),
                        password: sanitize(req.body.password),
                        avatar_path: ''
                    });

                    insert.save(function (err, response) {
                        if (err) {
                            return console.log(err);
                        }
                        req.session.userId = response._id;
                        res.send("success");
                    });
                  }
              });
    }
    else{
        res.send("filler");
    }
});

// From /login, this will return SUCCESS if user can log in.
app.get('/profile', function (req, res, next) {
    User.findById( req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return console.log("error");
            } else {
                if (user === null) {
                    var err = new Error('Not authorized.');
                    return res.send(err);
                } else {
                    return res.send("success");
                }
            }
        });
});

// Handles logging in.
app.post('/login', function (req, res, next) {
    if (req.body.username && req.body.password) {
        var clean_username = sanitize(req.body.username);
        var clean_password = sanitize(req.body.password);

        User.authenticate(clean_username, clean_password, function (error, user) {
            if (error || !user) {
                res.send("Wrong username or password.");
            } else {
                req.session.userId = user._id;
                req.session.save()
                return res.redirect('/profile');
            }
        });
    } else {
        res.send('empty');
    }
});

// Handles logging out.
app.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.send("redirect")
            }
        });
    }
});
