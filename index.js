const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));
app.use ('/static', express.static ('static'))
app.use('/', routes);

var allowCors = function(req, res, next){

	res.header('Access-Control-Allow-Origin', '127.0.0.0:3000');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Credentials', 'true');

	next();
}

app.use(allowCors);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});