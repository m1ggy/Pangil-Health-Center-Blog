const express = require('express');
const app = express();
const expresslayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const Chart = require('./models/chart')
const LocalStrategy = require('passport-local').Strategy;
const methodOverride = require('method-override')
// Passport Config
const user = {
    username:'admin',
    password:'admin',
    id:1
}
passport.use(new LocalStrategy(
    function(username, password, done) {
       if(username==user.username&&password==user.password){
           return done(null, user)
       }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, nickname: "test"})
  });
  

//DB
const db = require('./config/keys').MongoURI;
//Connecting to MongoDB Atlas Server
mongoose.connect(db, { useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>console.log('DB Connected'))
.catch(error=> console.log(error))
//EJS
const port = process.env.PORT || 3000;
app.use(expresslayouts);
app.set('view engine', 'ejs');

//Body Parser
app.use(express.urlencoded({extended:false}));


// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());

  //method-override middleware
  app.use(methodOverride('_method'))

  //Routes
  const articleRouter = require('./routes/articles')
  app.use('/blog', articleRouter)
  const dashboardRouter = require('./routes/dashboard')
  app.use('/dashboard', dashboardRouter)

app.get('/', (req, res)=>{

    Chart.find((err,chart)=>{
       
            if(err){
                res.render(err)
            
            }else{
                res.render('index',{ 
                    data1:chart[chart.length-1].data1,
                    data2:chart[chart.length-1].data2,
                    label1:chart[chart.length-1].Label1,
                    label2:chart[chart.length-1].Label2,
                    desc:chart[chart.length-1].content
            })
            }


    })
   
})

app.get('/login', checkNotAuthenticated, (req,res)=>{
    res.render('login')
})
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'

  })
  )

app.use(express.json())

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }


app.listen(port, console.log(`server started on port ${port}`))