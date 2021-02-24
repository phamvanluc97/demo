const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;
const handlebars = require('express-handlebars');
const route = require('./routes');
const db = require('./app/config/db');
const session = require('express-session');
const http = require('http').Server(app);
http.listen(port);
const io = require('socket.io')(http);

db.connect();
app.use(express.static(path.join(__dirname, 'resources/public')));
app.use(methodOverride('_method'));

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      //secure: true
    },
  }),
);
require('./middleware/localsmiddleware')(app);

io.on('connection', (socket) => {
  socket.on('ClientSendData', (data) => {
    io.emit('ClientSendData', data);
  });
});

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

//app.use(morgan('combined'));
app.engine(
  'hbs',
  handlebars({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
    },
  }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

route(app);

// app.listen(port, () => {
//   console.log(`App listening at http://localhost:${port}`);
// });
