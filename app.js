const express = require("express");
const bodyParser = require("body-parser");
const consolidate = require('consolidate');
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vertrigo",
    database: "system_manager"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

let app = new express();
let port = 8181;

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
app.listen(port, () => {
    console.log(`Server started on port` + port);
});