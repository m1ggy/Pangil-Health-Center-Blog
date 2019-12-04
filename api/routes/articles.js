const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const Comment = require('../models/Comments')

router.get('/', (req, res)=>{
  Article.find((err,articles)=>{
        if(articles.length<=0){
            res.send('database empty :(')
        }
        else{
            res.render('blogpost',{
                latestTitle: articles[articles.length-1].title,         
                postID:articles[articles.length-1].postID,
                name:articles[articles.length-1].author,
                postIDLink:articles[articles.length-1].postID,
                articles:articles
                
                
            })
        }
    })
    
})
router.get('/post/:id',(req,res)=>{
    Comment.find({postID:req.params.id},(err,comment)=>{ 
    Article.find((err,articles)=>{
        if(err) console.log(err)
        else{
            res.render('blogentry',{
                title:articles[req.params.id-1].title.toLowerCase(),
                author:articles[req.params.id-1].author.toLowerCase(),
                main:articles[req.params.id-1].content,
                postID:req.params.id,
                comments:comment
            })
            
           
        }
    })
})
    
})
router.post('/post/:id', (req,res)=>{
    const newComment = new Comment({
        author:req.body.author,
        content:req.body.content,
        postID:req.params.id,
        date:Date.now()
    })
    try {
        newComment.save()
        res.redirect(`${req.params.id}`)
    } catch (error) {
        
    }
})

module.exports = router