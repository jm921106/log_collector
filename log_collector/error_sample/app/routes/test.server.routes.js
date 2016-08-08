
var test = require('../controllers/test.server.controller.js');

exports.route = function(app){
    app.get('/test',  test.render);
    app.post('/test', test.test);
};
