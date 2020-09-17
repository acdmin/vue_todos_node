var express = require('express');
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/todos', { useNewUrlParser: true });
// mongoose.connect('mongodb+srv://mytest:wms159753...@cluster0-cf2c3.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
var conn = mongoose.connection;
conn.once('connected', () => {
    console.log('数据库连接成功!!!');
});