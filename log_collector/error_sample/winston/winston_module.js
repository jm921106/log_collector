var winston = require('winston');
var moment = require('moment');
var os = require('os');
var externalip = require('externalip');

// Mongoose
var error_task = require('../app/models/exception.server.model.js'); // schema

// winston 객체
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug', // error < warn < info < debug
            colorize: true,
            label: "logger"
        })

        /**
         * file
         */
        // , new (winston.transports.File)({
        //     level: 'debug',
        //     json: true,
        //     timestamp: function () {
        //         return moment().format("YYYY-MM_DD HH:mm:ss.SSS");
        //     },
        //     dirname : './logfile/',
        //     filename: 'info_file.log'
        // })

        /**
         * transport mongoDB.
         */
        // ,new (winston.transports.MongoDB) ({
        //
        // })

        /**
         * winston-daily-rotate-file
         */
        // ,new(require('winston-daily-rotate-file'))({
        //     level:'info',
        //     datePattern:'yyyy-MM-dd.log'   
        //     filename:'daily_file_'
        // });
    ],
    exceptionHandlers: [ // winston.log에 대한 error처리
        new winston.transports.File({
            dirname: './logfile/exception/',
            filename: 'exceptions.log',
            json: true,
            timestamp: function () {
                return moment().format("YYYY-MM_DD HH:mm:ss.SSS");
            },
        })
    ]
});

// how to get LocalIP address
var interfaces = os.networkInterfaces();
var LocalIPs = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            LocalIPs.push(address.address);
        }
    }
}

// how to get ExternalIP address
var externalIP = "";
externalip(function (err, ip) {
    externalIP = ip;
});

//logger listener - mongoose save
logger.on('logging', function (transport, level, msg, meta) {

    // console.log(meta.stack.name);

    if (meta.toString() != "[object Object]") { // meta data가 있어야 데이터를 저장하도록 처리
        if (level == 'error') { // error level만 데이터를 저장하도록 처리
            //mongoose에 log데이터 저장
            new error_task({
                Date: Date.now(),
                eIP: externalIP,
                lIP: LocalIPs[0],
                logLevel: level,
                logMessage: msg,
                eName: meta.name,
                eMessage: meta.message,
                eStack: meta.stack
            }).save();

            console.log('[Succeed to create new task] ' + msg);
        }
    }
});

//uncaughtException Handler
// process.on('uncaughtException', function(err) {
//     logger.error(err.toString());
//     //process가 계속 진행되어야 한다.
// });

//사용법
// winston.info("[winston module 사용법]");
// winston.info("winston.log('info', 'content');");
// winston.info("winston.info('content');");
//
// winston.info("[winston level]");
// winston.error("winston.error('content');");
// winston.warn("winston.warn('content');");
// winston.info("winston.info('content');");
// winston.debug("winston.debug('content');");

module.exports = logger;