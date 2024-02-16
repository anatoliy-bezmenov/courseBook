const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const routes = require('./routes');
const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();

// Below 2 lines are middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authMiddleware);

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');
// app.set('views', path.resolve('views/')); // no need since src folder is not being used

app.use(routes);

// // TODO Change database name

// mongoose.connect('mongodb://127.0.0.1:27017/course-book'); // I'm on linux and does not work with
// // localhost to me

// mongoose.connection.on('connected', () => console.log('DB is connected'));
// mongoose.connection.on('disconnected', () => console.log('DB is disconnected'));
// mongoose.connection.on('error', (err) => console.log(err));

port = 3000;
mongoose.connect(`mongodb://127.0.0.1:27017/course-book`).then(() => {
    console.log(`DB Connected`);
    // First wait for database to connect and then the server to connect after database is connected
    app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`));
}).catch((err) => {
    console.log(`Cannot connect to DB`);
    console.log(err);
});

// port = 3000;

// app.listen(port, () => console.log('App is listening on http://localhost:3000'));