const mongoose = require('mongoose')
var Schema = mongoose.Schema;
const ChartSchema = new Schema({
    Label1:{
        type:String
        
    },
   Label2:{
        type:String
        
    },
    content:{
        type:String
    },
    data1:{
        type:Number
    },
    data2:{
        type:Number
    }
})
mongoose.models = {}
const chart = mongoose.model('Chart',ChartSchema) 
module.exports = chart