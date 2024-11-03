const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth'); // Ensure this is correct
const goalRoutes = require('./routes/goals'); // Ensure this is correct

const app = express();
const PORT = process.env.PORT || 5001;
app.set('trust proxy', true);
app.enable('trust proxy');

const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'One')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'One', 'index.html'));
});


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: 'your_secret_key', // Use an actual secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res) => {
    res.status(404).send('Sorry, that route does not exist.');
});


// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Connect to MongoDB
const mongoURI = "mongodb+srv://nkyb123:Nkyrb1981@cluster0.jcgkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes.router); // This should be valid
app.use('/goals', goalRoutes); // This should also be valid

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});