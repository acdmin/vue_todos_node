var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var TodoModel = require('../models/todo');

// var query=Cat.find({});

// query.where({age:30});
// query.sort({ name: 'asc', age: -1 });
// //query.and({_id:"123456222"});
// query.or([{_id:"123456fff222"},{_id:"123456222"}]);
// //query.limit(3); //限制条数
// //query.skip(3)   //开始数 ，通过计算可是实现分页
// //query.friends('name')
// query.exec(function(err,docs){
//     console.log(docs);
// })

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({
        code: 0,
        msg: 'todo api'
    })
});

/* 获取列表 */
router.get('/getTodoList', function (req, res, next) {
    var {page_num, page_size} = req.query;
    var query = { isDel: 0 }
    TodoModel.countDocuments(query).exec(function(err, count){
        TodoModel.find(query, function(err2, todos){
            let _todos = [];
            todos.map(item => {
                _todos.push({
                    id: item._id,
                    title: item.title,
                    create_time: item.create_time,
                    isDel: item.isDel,
                    done: item.done
                })
            })
            console.log(_todos)
            if(!err2){
                res.send({
                    code: 0,
                    total: Math.ceil(count/page_size),
                    data: _todos
                })
            }else{
                res.send({
                    code: 1,
                    msg: '数据获取异常'
                })
            }
        }).sort({create_time: -1}).skip((page_num-1)*page_size).limit(Number(page_size))
    })
});

/* 添加todo 单条添加 */
router.post('/add', function (req, res, next) {
    var {title} = req.body, next = true;
    TodoModel.find({}, function(err, todos){
        // console.log(todos)
        if( !todos.some(item=>{return item.title==title}) ){
            new TodoModel({title, create_time: new Date().getTime()}).save((err, todo) => {
                if(!err){
                    res.send({
                        code: 0,
                        msg: '保存成功',
                        data: {
                            id: todo._id,
                            title: todo.title,
                            create_time: todo.create_time,
                            isDel: todo.isDel,
                            done: todo.done
                        }
                    })
                }else{
                    res.send({
                        code: 1,
                        msg: '保存失败'
                    })
                }
            })
        }else{
            res.send({
                code: 1,
                msg: '不可重复添加'
            })
        }
    })
});

/* 通过id获取 */
router.get('/todo/:id', function (req, res, next) {
    var {id} = req.params;
    TodoModel.findOne({_id: id}, function(err, todo){
        if(!err){
            res.send({
                code: 0,
                data: todo
            })
        }else{
            res.send({
                code: 1,
                msg: '查无该记录'
            })
        }
    })
});

/* 修改 */
router.post('/todoEdit', function (req, res, next) {
    var {id, title} = req.body;
    console.log(id, title)
    TodoModel.findByIdAndUpdate({_id: id}, {$set: {title: title, create_time: new Date().getTime()}}, function(err, todo){
        if(!err){
            let _todo = todo;
            _todo.id = todo._id;
            _todo.title = title;
            _todo.create_time = new Date().getTime();
            res.send({
                code: 0,
                data: _todo,
                msg: '修改成功'
            })
        }else{
            res.send({
                code: 1,
                msg: '修改失败'
            })
        }
    })
});

/* 完成一个记录 */
router.post('/todoDone', function (req, res, next) {
    var {id} = req.body;
    TodoModel.findByIdAndUpdate({_id: id}, {$set: {done: 1}}, false, (err2, todo) => {
        if(!err2){
            res.send({
                code: 0,
                data: {
                    id: todo._id,
                    title: todo.title,
                    create_time: todo.create_time,
                    isDel: todo.isDel,
                    done: todo.done
                },
                msg: '修改成功'
            })
        }else{
            res.send({
                code: 1,
                msg: '修改失败'
            })
        }
    });
});

//sc.exe create MongoDB binPath="\"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe\" --service --config=\"C:\Program Files\MongoDB\Server\4.0\mongod.cfg\"" DisplayName="MongoDB" start="auto"

//mongod --config "C:\Program Files\MongoDB\Server\4.0\mongo.conf"

//mongod --config "C:\Program Files\MongoDB\Server\4.0\mongo.conf" --install --serviceName "MongoDB"

/* 删除一个记录 */ //findByIdAndUpdate
router.post('/todoDelete', function (req, res, next) {
    var {id} = req.body;
    TodoModel.findByIdAndUpdate({_id: id}, {$set: {isDel: 1}},  (err, todo) => {
        if(!err){
            res.send({
                code: 0,
                msg: '删除成功'
            })
        }else{
            res.send({
                code: 1,
                msg: '该记录不存在'
            })
        }
    })
});

/* 批量删除和批量恢复 */
router.post('/betchHandle', function (req, res, next) {
    //batchStatus // 0.批量完成 1.批量恢复 2.批量删除
    let {batchStatus, ids} = req.body,
        batchStr = ''
        query = null;
        ids = ids.map(item=>{return {_id: item.id}})
    switch(batchStatus){
        case 0:
            batchStr = '批量完成';
            query = {$set: { done: 1 }};
        break;
        case 1:
            batchStr = '批量恢复';
            query = {$set: { done: 0 }};
        break;
        case 2:
            batchStr = '批量删除';
            query = {$set: { isDel: 1 }};
        break;
    }
    try{
        ids.forEach((item) => {
            TodoModel.updateOne(item, query, (err, todo) => {})
        })
    }catch(err){
        res.send({code: 1, msg: '操作异常'})
    }finally{
        res.send({code: 0, msg: `${batchStr}成功`})
    }
});

/* 恢复已删除记录 */ //findByIdAndRemove
router.post('/todoReback', function (req, res, next) {
    var {id} = req.body;
    TodoModel.findOneAndUpdate({_id: id}, {$set: {done: 0}}, (err, todo) => {
        if(!err){
            res.send({
                code: 0,
                msg: '恢复成功'
            })
        }else{
            res.send({
                code: 1,
                msg: '恢复失败'
            })
        }
    })
});

module.exports = router;