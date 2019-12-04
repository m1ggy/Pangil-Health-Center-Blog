const mongoose = require('mongoose')
var Schema = mongoose.Schema;
const commentSchema = new Schema({
   author:{
        type:String
        
    },
  content:{
        type:String
        
    },
   postID:{
        type:Number
    },
    date:{
        type:Date
    }
    
})
mongoose.models = {}
const comments = mongoose.model('Comments',commentSchema) 
module.exports = comments