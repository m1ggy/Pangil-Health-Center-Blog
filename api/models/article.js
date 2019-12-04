const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
    title:{
        type:String
        
    },
   author:{
        type:String
        
    },
    content:{
        type:String
    },
    postID:{
        type:Number
    }
})

const Article = mongoose.model('Article',articleSchema) 
module.exports = Article