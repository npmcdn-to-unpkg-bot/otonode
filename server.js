var express =       require('express')
    , http =        require('http')
    , passport =    require('passport')
    , path =        require('path')
    , User =        require('./server/core/models/User.js')
    , _ =           require('underscore')
    , mongoose =    require('mongoose');

/**
 * Define environment. Can be pre-set via grunt already
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';


//Initialize system variables
var config = require('./config/config');

// Bootstrap db connection
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/**
 * Configure app
 */

var app = module.exports = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/client/js/core');


//Not sure from mean
   app.set('showStackError', true); //Necessary?
   //Mean uses dynamic helpers. what are those?
//End not sure

//Taken over from MEAN
   app.locals.pretty = true;
    // Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
   app.use(express.compress({
      filter: function(req, res) {
         return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
      },
      // Levels are specified in a range of 0 to 9, where-as 0 is
      // no compression and 9 is best compression, but slowest
      level: 9
   }));

   // Only use logger for development environment
   if (process.env.NODE_ENV === 'development') {
      app.use(express.logger('dev'));
   }

   app.enable('jsonp callback');
//END taken over

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.cookieParser());
app.use(express.cookieSession(
      {
         secret: config.sessionSecret
      }
   )
);

app.configure('development', 'production', function() {
    app.use(express.csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
});

/**
 * AUTHENTICATION
 */

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);
passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

/**
 * CORE ROUTES
 */
var routes = require('./server/core/routes/coreRoutes');

/**
 * add API ROUTES
 */
_.extend(routes, require('./server/household/routes'));

/**
 * Load routes
 */
require('./server/core/setupRouting.js')(app, routes);


/**
 * Start Server
 */
app.set('port', process.env.PORT || config.port);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});