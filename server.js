const express = require("express");
const bodyParser = require("body-parser");
const consolidate = require('consolidate');
const mysqlInst = require('mysql');
const dropbox = require('dropbox');
const fetch = require('isomorphic-fetch');
const settings = require('./config/settings');
var environment = "dev";
const MySQLParams = settings.mysqlParams(environment);
const AppParams = settings.appsettings(environment);
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
    resp.send("<h1>Welcome to NodeJs server app</h1>");
});

app.get("/dropbox", function (req, resp) {

    var dbx = new dropbox.Dropbox({
        accessToken: AppParams.dropbox.accessToken,
        fetch: fetch
    });
    let result = dbx.filesListFolder({
            path: '/projects/'
        })
        .then(function (response) {
            response.entries.forEach(function (item) {
                console.log(item.path_lower);
            });
            resp.json(response.entries);
        })
        .catch(function (error) {
            console.log(error.error);
        });

});

app.get("/rest/apps/list/:id", (req, resp) => {
    resp.send('id: ' + req.params.id);
});

app.get("/rest/users/get/:id", (req, resp) => {
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        console.log(fields);
        resp.send(result);
    });
});

app.get('/render', (req, res) => {
    res.render('index', {
        title: 'Page title',
        text: 'Page text',
        features: [{
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