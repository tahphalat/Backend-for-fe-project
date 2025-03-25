const nocache = require("nocacheA");
app.use(nocache());


const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const { xss } = require('express-xss-sanitizer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const connectDB = require('./config/db'); 

//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const cars = require('./routes/cars')
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');


//Mount routers
//Body parser

app.use(express.json());


app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
const limiter = rateLimit({
    windowsMs: 10 * 60 * 1000,//10 mins
    max: 100
});
app.use(limiter);
app.use(hpp());
app.use(cors());


app.use('/api/v1/cars', cars);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/auth', auth);
//Cookie parser
app.use(cookieParser());





const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});


