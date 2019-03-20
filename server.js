const express = require("express");
const bodyParser = require("body-parser");
const consolidate = require('consolidate');
const mysqlInst = require('mysql');
const settings = require('./config/settings');
const vSettings = new settings();
var environment = "dev";
const MySQLParams = vSettings.mysqlParams(environment);
const AppParams = vSettings.appsettings(environment);
let app = new express();

let con = mysqlInst.createConnection({
    host: MySQLParams["host"],
    user: MySQLParams["user"],
    password: MySQLParams["password"],
    database: MySQLParams["database"]
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});



app.use(bodyParser.json());
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

app.get("/", function (req, resp) {
    resp.send("root router");
});

app.get("/rest/apps/list/:id", (req, resp) => {
    resp.send('id: ' + req.params.id);
});

app.get("/rest/users/get/:id", (req, resp) => {
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        resp.send(result);
    });
});

app.get('/render', (req, res) => {
    res.render('index', {
        title: 'Page title',
        text: 'Page text',
        features: [
            {
                src: '/images/pages/img2.jpg'
            },
            {
                src: '/images/pages/img3.jpg'
            },
            {
                src: '/images/pages/img4.jpg'
            }
        ]
    });
});


// Start server
app.listen(AppParams.port, AppParams.host, () => {
    console.log(`Server running at http://${AppParams.host}:${AppParams.port}/`);
});