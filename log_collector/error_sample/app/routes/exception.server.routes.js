
var server = require('../controllers/exception.server.controller.js');

exports.route = function(app){
    app.get('/',  server.render);
    app.post('/search', server.search);
};
