
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExceptionSchema = new Schema({
    //object_id
    
    Date : {
        type : Date,
        default : Date.now(),
        index : true
    },
    eIP : {
        type : String,
        trim : true
    },
    lIP : {
        type : String,
        trim : true
    },
    logLevel : {
        type : String,
        default : "error",
        trim : true
    },
    logMessage : {
        type : String,
        trim : true
    },
    eName : {
        type : Object,
        trim : true
    },
    eMessage : {
        type : Object,
        trim : true
    },
    eStack : {
        type : Object,
        trim : true
    }
});

module.exports = mongoose.model('Exception', ExceptionSchema);