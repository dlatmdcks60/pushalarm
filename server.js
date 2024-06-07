const fs = require('fs');
const options = {
  key: fs.readFileSync(""),
  cert: fs.readFileSync(""),
  ca: fs.readFileSync(""),
  minVersion: "TLSv1.2"
};
const config = require("./config.js");
const mysqlHandler = require('./js/mysql.js');
const path = require('path');
const bodyParser = require("body-parser");
const express = require("express");
const cors = require('cors');
const app = express();
const https = require('https').createServer(options, app);
const admin = require("firebase-admin");
const webpush = require('web-push');
const serviceAccount = require("./firebase/json데이터 삽입");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.static(path.join(__dirname, 'js')));
app.set("views", path.join(__dirname, "./html/view"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static("html"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors({
  origin: "*"
}));

app.get("/", (req, res) => {
  res.render("index.html", {});
});
/* ========================================================= */
const vapidKeys = {
  publicKey: "",
  privateKey: "",
};

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


app.post('/push', (req, res) => {
  const payload = JSON.stringify({
    title: req.body.title,
    body: req.body.msg
  });
  let clientIP = req.ip;
  if (clientIP.substr(0, 7) === '::ffff:') {
    clientIP = clientIP.substr(7);
  }
  if (req.body.title && req.body.msg && req.body.server) {
    mysqlHandler.getUserData().then(dbRes => {
      const subscription = {
        endpoint: dbRes.data.endpoint,
        keys: {
          p256dh: dbRes.data.p256dh,
          auth: dbRes.data.auth,
        },
      };

      webpush.sendNotification(subscription, payload)
        .then(() => {
          mysqlHandler.dataInsert({
            title: req.body.title,
            msg: req.body.msg,
            type: req.body.server,
            ip: clientIP,
            suc: 1
          });
          res.status(200).json({});
        })
        .catch((error) => {
          mysqlHandler.dataInsert({
            title: req.body.title,
            msg: req.body.msg,
            type: req.body.server,
            ip: clientIP,
            suc: 0
          });
          console.error('Error sending notification:', error);
          res.status(500).json({
            error: 'Error sending notification'
          });
        });
    });
  } else {
    res.status(500).json({
      error: 'Error Invalid Data'
    });
  }
});
app.post('/get', (req, res) => {
  mysqlHandler.getUserDataUpdate({
    endpoint: req.body.data.endpoint,
    p256dh: req.body.data.keys.p256dh,
    auth: req.body.data.keys.auth
  }).then(dbRes => {
    res.json(dbRes.result);
  });
});

app.post('/getData', (req, res) => {
  const page = req.body.page;
  mysqlHandler.getData(page).then(dbRes => {
    res.json(dbRes);
  });
});

/* ========================================================= */
https.listen(config.port.port, () => {
  console.log(`Push API Server Start! - ${config.port.port}`);
});