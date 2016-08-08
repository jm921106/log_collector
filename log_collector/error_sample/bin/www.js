#!/usr/bin/env node

var cluster = require('cluster');
var winston = require('../winston/winston_module');

/*
 * Server 진행도중 발생하는 uncaughtException 처리
 * */
process.on('uncaughtException', function (err) {
    winston.error("Server Listening On 중 발생한 Error", err);

    /*
    * cluster worker 재시작
    * */
    // try {
    //     var killtimer = setTimeout(function() {
    //             process.exit(1);
    //      }, 30000);
    //     killtimer.unref();
    //     server.close();
    //     cluster.worker.disconnect();
    //     res.statusCode = 500;
    //     res.setHeader('content-type', 'text/plain');
    //     res.end('Oops, there was a problem!\n');
    // } catch (er2) {
    //     // oh well, not much we can do at this point.
    //     console.error('Error sending 500!', er2.stack);
    // }
});

// /*
//  * cluster가 master일때
//  * */
// if (cluster.isMaster) {
//     cluster.fork();
//     cluster.on('disconnect', function(worker) {
//         console.error('disconnect!');
//         cluster.fork();
//     });
// } else {
    /*
    * cluster가 worker일때
    * */
    try {
        /*
         * createServer Code 진행코드
         * */
        var app = require('../app');
        var debug = require('debug')('error_template:server');
        var http = require('http');
        var port = normalizePort(process.env.PORT || '7777');
        app.set('port', port);
        var server = http.createServer(app);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        function normalizePort(val) {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                return port;
            }

            return false;
        }
        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }
        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);
        }

    } catch (err) {
        /*
         * Server가 실행되는 중에 발생하는 Error
         * [Server가 실행되지 않았기 때문에 Mongoose에 저장되지 않음]
         * */
        winston.error("server error 에 대한 처리", err);
    }

// } //cluster

