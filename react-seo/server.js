'use strict';

var express = require('express'),
    expressHbs = require('express-handlebars'),
    enrouten = require('express-enrouten'),
    app = express(),
    port = process.env.PORT || 3000;

//set view engine
app.engine('hbs', expressHbs({
    extname:'.hbs',
    defaultLayout:'main.hbs',
    helpers: require("./public/js/handlebar-helpers/helpers.js").helpers, // same file that gets used on our client
    partialsDir: "views/partials/", // same as default, I just like to be explicit
    layoutsDir: "views/layouts/" // same as default, I just like to be explicit
}));

app.set('view engine', 'hbs');

//disable etag headers on response
app.disable('etag');

//static files
app.use(express.static('./build'));

app.use(enrouten({ directory: 'controllers' }));

app.listen(port, function() {
  console.log("Server start ... Listening on port 3000");
});
