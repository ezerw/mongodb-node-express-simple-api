let express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    productRoutes = require('./routes/product-routes');

// Load Config
let config = require('./config').get(process.env.NODE_ENV);

// Express
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));

// Mongo DB options
let options = {
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
}

// Mongo DB Connection
mongoose.connect(config.database, options);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// Don't log on test env
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// Routes
app.get("/", (req, res) => res.json({message: "Welcome to the API"}));

app.route("/products")
    .get(productRoutes.getProducts)
    .post(productRoutes.storeProduct);

app.route("/products/:id")
    .get(productRoutes.getProduct)
    .delete(productRoutes.deleteProduct)
    .put(productRoutes.updateProduct);

app.listen(config.port);
module.exports = app; // for testing
