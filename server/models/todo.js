var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isDel: {
        type: Number,
        default: 0
    },
    done: {
        type: Number,
        default: 0
    },
    create_time: {
        type: Number,
        required: true,
        default: new Date().getTime()
    }
});

module.exports = mongoose.model('todo', todoSchema);