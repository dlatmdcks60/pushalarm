const config = require('../config.js');
const mysql = require('mysql').createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.dbname,
    charset: config.db.charset,
    dateStrings: 'date',
    multipleStatements: true
});
mysql.connect((err) => {
    if (!err) {
        console.log('Mysql Database Connected');
    } else {
        console.log('Mysql Connect Error', err);
    }
});

function generateRandomString(length) { //랜덤한 문자뽑기 (영소문)
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}

exports.dataInsert = (data) => {
    const insertQuery = `INSERT INTO save (msgId, msgTitle, msgContent, serverType, serverIp, datetime, success) VALUES (${mysql.escape(generateRandomString(15))}, ${mysql.escape(data.title)}, ${mysql.escape(data.msg)}, ${mysql.escape(data.type)}, ${mysql.escape(data.ip)}, now(), ${mysql.escape(data.suc)})`;
    mysql.query(insertQuery, (err) => {
        if (err) console.log(err)
    });
}

exports.getData = (page) => {
    const pageData = Number(page) * 30;
    return new Promise((res) => {
        const selectQuery = `SELECT * FROM save ORDER BY datetime DESC LIMIT ${pageData}, 30;`;
        mysql.query(selectQuery, (err, rows) => {
            if (!err) {
                res({
                    result: true,
                    data: rows
                });
            } else {
                res({
                    result: false,
                    data: []
                });
            }
        });
    });
}

exports.getUserData = (data) => {
    return new Promise((res) => {
        const selectQuery = `SELECT * FROM userData WHERE userId = ${mysql.escape(data.userId)}`;
        mysql.query(selectQuery, (err, rows) => {
            if (!err) {
                res({
                    result: true,
                    data: rows[0]
                });
            } else {
                res({
                    result: false
                });
            }
        });
    });
}

exports.getUserDataUpdate = (data) => {
    return new Promise((res) => {
        const updateQuery = `UPDATE userData SET endpoint = ${mysql.escape(data.endpoint)}, p256dh = ${mysql.escape(data.p256dh)}, auth = ${mysql.escape(data.auth)} WHERE userId = ${mysql.escape(data.userId)}`;
        mysql.query(updateQuery, (err, rows) => {
            if (!err) {
                res({
                    result: true
                });
            } else {
                res({
                    result: false
                });
            }
        });
    });
}