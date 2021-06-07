
var config = require('config')
var cors = require('cors')

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Enable all cors request
app.use(cors())

// Set up mongoose connection
password=1234
let dev_db_url = 'mongodb+srv://test-user:'+password+'@cluster0.hntoj.mongodb.net/blockbound?retryWrites=true&w=majority';

let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB , {
    useNewUrlParser: true, useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//api routes

const { configInfo, version, catch404 } = require('./routes')
const { confirmed, unconfirmed } = require('./routes/internal')
const { create, show, update } = require('./routes/actions') 

const { sessionInfo, orderFullfill, payment } = require('./routes/stripe')

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get('/api', (req, res) => res.send({}))
app.get('/api/v1/config', configInfo)
app.get('/api/v1/version', version)
app.get('/api/internal/latest/confirmed', confirmed)
app.get('/api/internal/latest/unconfirmed', unconfirmed)

app.get('/api/v1/status/', show) // status resource that accepts a query parameter
app.get('/api/v1/status/:hash', show)
app.post('/api/v1/status/', update)
app.post('/api/v1/register', create)

//app.post('/api/payment/create-checkout-session', sessionInfo)
//app.post('/api/webhook', orderFullfill);

//stripe payment routes
app.post('/api/paymentapi',payment);

app.get('api/*', catch404)


let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
