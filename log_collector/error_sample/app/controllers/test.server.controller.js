

exports.render = function (req, res) {
    res.render('test_page', {});
}

exports.test = function(req, res) {
    console.log(req.body.age)
}
