var exception_task = require('../models/exception.server.model.js');

// 기본화면으로 들어오는 페이지
exports.render = function (req, res) {
    res.render('exception_search', {
        data: [],
        logLevel: "logLevel",
        eName: "eName"
    });
};

//조건에 따른 데이터 검색
exports.search = function (req, res) {

    console.log("============test===========");
    console.log(req.body.logLevel);
    console.log(req.body.eName);
    console.log(req.body.sDate);
    console.log(req.body.eDate);
    console.log(req.body.eIP);
    console.log(req.body.lIP);
    console.log("============test===========");
    var sDateArray = req.body.sDate.split('/');
    var eDateArray = req.body.eDate.split('/');

    var reqLogLevel = req.body.logLevel;
    var reqEName = req.body.eName;
    var reqEIP = req.body.eIP;
    var reqLIP = req.body.lIP;
    if (req.body.logLevel == "all") {
        reqLogLevel = {'$in' : ['error','warn','info','debug']};
    }
    if (req.body.eName == "All") {
        reqEName = {'$in' : ['EvalError','SyntaxError','ReferenceError','RangeError', 'URIError', 'TypeError']};
    }
    if (req.body.eIP == "all") {
        reqEIP = {'$in' : ['203.249.127.43']};
    }
    if (req.body.lIP == "all") {
        reqLIP = {'$in' : ['192.9.44.183']};
    }

    console.log("============test===========");
    console.log(reqLogLevel);
    console.log(reqEName);
    console.log(reqEIP);
    console.log(reqLIP);
    console.log("============test===========");

    var datas = [];
    exception_task.find({ logLevel: reqLogLevel, eName: reqEName, eIP : reqEIP, lIP : reqLIP }, function (err, tasks) {

        if (err) return res.status(500).send({error: 'database Failure'});

        for (var i = 0; i < tasks.length; i++) {
            var log = tasks[i];
            switch(true) {
                case sDateArray[2]==eDateArray[2] :
                    console.log("case1");
                    if(log.Date.getMonth()+1 >= parseInt(sDateArray[0]) && log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
                        console.log(log.Date.getMonth()+1);
                        if(log.Date.getDate()>=parseInt(sDateArray[1]) && log.Date.getDate() <= parseInt(eDateArray[1])) {
                            datas.push(log);
                        }
                    }
                    break;
                default : // 다르면
                    console.log("case2");
                    if(parseInt(log.Date.getYear()+1900) == parseInt(sDateArray[2])) {
                        if(log.Date.getMonth()+1 >= parseInt(sDateArray[0])) {
                            if(log.Date.getDate()>=parseInt(sDateArray[1])) {
                                datas.push(log);
                            }
                        }
                    } else if (parseInt(log.Date.getYear()+1900) == parseInt(eDateArray[2])) {
                        if(log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
                            if(log.Date.getDate() <= parseInt(eDateArray[1])) {
                                datas.push(log);
                            }
                        }
                    } else if (parseInt(log.Date.getYear()+1900) > parseInt(sDateArray[2]) && parseInt(log.Date.getYear()+1900) < parseInt(eDateArray[2])) {
                        datas.push(log);
                    }
                    break;
            }
        }

        res.render('exception_search', {
            data: datas,
            logLevel: req.body.logLevel,
            eName: req.body.eName
        });
    });


    // if (logLevelAll == true) {
    //     if (eNameAll == true) {
    //         //query_1
    //         console.log("query_1");
    //         exception_task.find(function (err, tasks) {
    //
    //             if (err) return res.status(500).send({error: 'database Failure'});
    //
    //             for (var i = 0; i < tasks.length; i++) {
    //                 var log = tasks[i];
    //
    //                 switch(true) {
    //                     case sDateArray[2]==eDateArray[2] :
    //                         console.log("case1");
    //                         if(log.Date.getMonth()+1 >= parseInt(sDateArray[0]) && log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
    //                             console.log(log.Date.getMonth()+1);
    //                             if(log.Date.getDate()>=parseInt(sDateArray[1]) && log.Date.getDate() <= parseInt(eDateArray[1])) {
    //                                 datas.push(log);
    //                             }
    //                         }
    //                         break;
    //                     default : // 다르면
    //                         console.log("case2");
    //                         if(parseInt(log.Date.getYear()+1900) == parseInt(sDateArray[2])) {
    //                             if(log.Date.getMonth()+1 >= parseInt(sDateArray[0])) {
    //                                 if(log.Date.getDate()>=parseInt(sDateArray[1])) {
    //                                     datas.push(log);
    //                                 }
    //                             }
    //                         } else if (parseInt(log.Date.getYear()+1900) == parseInt(eDateArray[2])) {
    //                             if(log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
    //                                 if(log.Date.getDate() <= parseInt(eDateArray[1])) {
    //                                     datas.push(log);
    //                                 }
    //                             }
    //                         } else if (parseInt(log.Date.getYear()+1900) > parseInt(sDateArray[2]) && parseInt(log.Date.getYear()+1900) < parseInt(eDateArray[2])) {
    //                             datas.push(log);
    //                         }
    //                         break;
    //                 }
    //             }
    //
    //             //왜 꼭 datas를 여기 안에서만 읽을 수 있을까, 전역 변수인데...
    //             res.render('exception_search', {
    //                 data: datas,
    //                 logLevel: req.body.logLevel,
    //                 eName: req.body.eName
    //             });
    //         });
    //     } else {
    //         //query_2
    //         console.log("query_2");
    //         exception_task.find({eName: req.body.eName}, function (err, tasks) {
    //
    //             if (err) return res.status(500).send({error: 'database Failure'});
    //
    //             for (var i = 0; i < tasks.length; i++) {
    //                 var log = tasks[i];
    //                 switch(true) {
    //                     case sDateArray[2]==eDateArray[2] :
    //                         console.log("case1");
    //                         if(log.Date.getMonth()+1 >= parseInt(sDateArray[0]) && log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
    //                             console.log(log.Date.getMonth()+1);
    //                             if(log.Date.getDate()>=parseInt(sDateArray[1]) && log.Date.getDate() <= parseInt(eDateArray[1])) {
    //                                 datas.push(log);
    //                             }
    //                         }
    //                         break;
    //                     default : // 다르면
    //                         console.log("case2");
    //                         if(parseInt(log.Date.getYear()+1900) == parseInt(sDateArray[2])) {
    //                             if(log.Date.getMonth()+1 >= parseInt(sDateArray[0])) {
    //                                 if(log.Date.getDate()>=parseInt(sDateArray[1])) {
    //                                     datas.push(log);
    //                                 }
    //                             }
    //                         } else if (parseInt(log.Date.getYear()+1900) == parseInt(eDateArray[2])) {
    //                             if(log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
    //                                 if(log.Date.getDate() <= parseInt(eDateArray[1])) {
    //                                     datas.push(log);
    //                                 }
    //                             }
    //                         } else if (parseInt(log.Date.getYear()+1900) > parseInt(sDateArray[2]) && parseInt(log.Date.getYear()+1900) < parseInt(eDateArray[2])) {
    //                             datas.push(log);
    //                         }
    //                         break;
    //                 }
    //             }
    //
    //             res.render('exception_search', {
    //                 data: datas,
    //                 logLevel: req.body.logLevel,
    //                 eName: req.body.eName
    //             });
    //         });
    //     }
    // } else {
    //     if (eNameAll == true) {
    //         //query_3
    //         console.log("query_3");
    //         exception_task.find({logLevel: req.body.logLevel}, function (err, tasks) {
    //
    //             if (err) return res.status(500).send({error: 'database Failure'});
    //
    //             for (var i = 0; i < tasks.length; i++) {
    //                 var log = tasks[i];
    //                 switch(true) {
    //                     case sDateArray[2]==eDateArray[2] :
    //                         console.log("case1");
    //                         if(log.Date.getMonth()+1 >= parseInt(sDateArray[0]) && log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
    //                             console.log(log.Date.getMonth()+1);
    //                             if(log.Date.getDate()>=parseInt(sDateArray[1]) && log.Date.getDate() <= parseInt(eDateArray[1])) {
    //                                 datas.push(log);
    //                             }
    //                         }
    //                         break;
    //                     default : // 다르면
    //                         console.log("case2");
    //                         if(parseInt(log.Date.getYear()+1900) == parseInt(sDateArray[2])) {
    //                             if(log.Date.getMonth()+1 >= parseInt(sDateArray[0])) {
    //                                 if(log.Date.getDate()>=parseInt(sDateArray[1])) {
    //                                     datas.push(log);
    //                                 }
    //                             }
    //                         } else if (parseInt(log.Date.getYear()+1900) == parseInt(eDateArray[2])) {
    //                             if(log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
    //                                 if(log.Date.getDate() <= parseInt(eDateArray[1])) {
    //                                     datas.push(log);
    //                                 }
    //                             }
    //                         } else if (parseInt(log.Date.getYear()+1900) > parseInt(sDateArray[2]) && parseInt(log.Date.getYear()+1900) < parseInt(eDateArray[2])) {
    //                             datas.push(log);
    //                         }
    //                         break;
    //                 }
    //             }
    //
    //             res.render('exception_search', {
    //                 data: datas,
    //                 logLevel: req.body.logLevel,
    //                 eName: req.body.eName
    //             });
    //         });
    //     } else {
    //         //query_4
    //         console.log("query_4");
    //         exception_task.find({logLevel: req.body.logLevel, eName: req.body.eName}, function (err, tasks) {
    //
    //             if (err) return res.status(500).send({error: 'database Failure'});
    //
    //             for (var i = 0; i < tasks.length; i++) {
    //                 var log = tasks[i];
    //                 switch(true) {
    //                     case sDateArray[2]==eDateArray[2] :
    //                         console.log("case1");
    //                         if(log.Date.getMonth()+1 >= parseInt(sDateArray[0]) && log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
    //                             console.log(log.Date.getMonth()+1);
    //                             if(log.Date.getDate()>=parseInt(sDateArray[1]) && log.Date.getDate() <= parseInt(eDateArray[1])) {
    //                                 datas.push(log);
    //                             }
    //                         }
    //                         break;
    //                     default : // 다르면
    //                         console.log("case2");
    //                         if(parseInt(log.Date.getYear()+1900) == parseInt(sDateArray[2])) {
    //                             if(log.Date.getMonth()+1 >= parseInt(sDateArray[0])) {
    //                                 if(log.Date.getDate()>=parseInt(sDateArray[1])) {
    //                                     datas.push(log);
    //                                 }
    //                             }
    //                         } else if (parseInt(log.Date.getYear()+1900) == parseInt(eDateArray[2])) {
    //                             if(log.Date.getMonth()+1 <= parseInt(eDateArray[0])) {
    //                                 if(log.Date.getDate() <= parseInt(eDateArray[1])) {
    //                                     datas.push(log);
    //                                 }
    //                             }
    //                         } else if (parseInt(log.Date.getYear()+1900) > parseInt(sDateArray[2]) && parseInt(log.Date.getYear()+1900) < parseInt(eDateArray[2])) {
    //                             datas.push(log);
    //                         }
    //                         break;
    //                 }
    //             }
    //
    //             res.render('exception_search', {
    //                 data: datas,
    //                 logLevel: req.body.logLevel,
    //                 eName: req.body.eName
    //             });
    //         });
    //     } // else
    // } // else
}; // exports.search

