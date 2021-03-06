const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();

const db = process.env.MONGO_MLAB_URI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));

// Routes
app.use('/user', require('./routes/user'));
app.use('/product', require('./routes/product'));

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app build folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + 'client/build/index.html'), err => {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
}

// Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
