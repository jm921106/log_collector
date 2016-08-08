var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/db';

exports.connect = function() {

    mongoose.connect(dbURI);

    mongoose.connection.on('connected', function() {
        console.log('Succeed to connect DB : ' + dbURI);
    });

    mongoose.connection.on('error', function(err) {
        console.log('Failed tp connect DB! ' + err);
    });

    mongoose.connection.on('disconnected', function(){
        console.log('DB connection has disconnected!');
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function(){
            console.log('App process gone!');
            process.exit(0);
        });
    });
};