"use strict";
const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const db = require('./config/db');
const route = require('./routes/main.route');

db.connect();
const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extends: true}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(methodOverride('_method'));

route(app);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})