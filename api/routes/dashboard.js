const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const Chart = require('../models/Chart')
const Comment = require('../models/Comments')
router.get('/', checkAuthenticated,(req,res)=>{
    Article.find((err,articles)=>{
        Chart.find((err,chart)=>{
       
            if(err){
                res.render(err)
            
            }else{
                res.render('dashboard',{articleCount:articles.length,data1:chart[chart.length-1].data1,
                    data2:chart[chart.length-1].data2,
                    label1:chart[chart.length-1].Label1,
                    label2:chart[chart.length-1].Label2,
                    desc:chart[chart.length-1].content})
            }


    })
        
    })
   
})
router.get('/articles', (req,res)=>{
    res.render('articles')
})

router.post('/articles', async (req,res)=>{
   await Article.find( async(err,articles)=>{
       if(articles.length==0){
        var articleID = 1
       }else{
        var articleID = articles[articles.length-1].postID+1 
       }
        
  
    const article = new Article({
        title: req.body.title,
        author: req.body.author,
       content: req.body.content,
       postID:articleID
    })
    try {
         await article.save()
        res.redirect('/blog')
      } catch (err) {
        res.status(400).json({ message: err.message })
      }
    })
})
router.get('/charts',(req,res)=>{
    res.render('charts')
})
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
router.post('/charts', async(req,res)=>{
       const newChart =   await new Chart({
           Label1:req.body.label1,
           Label2:req.body.label2,
           content:req.body.content,
           data1:req.body.data1,
           data2:req.body.data2,

       })
       try {
           newChart.save()
           res.render('charts')
       } catch (error) {
           res.send('error please go back to previous page.')
       }
})

router.get('/viewarticles', (req,res)=>{
    Article.find((err,articles)=>{
        if(err){
            console.log(err)
        }else{
            res.render('articlescrud',{articles:articles})
        }

    })
})

router.get('/viewarticles/:id', (req,res) =>{
    console.log(req.params.id)
    Article.find({postID:req.params.id},(err,articles)=>{
        console.log(articles)
        res.render('editarticle',{postID:req.params.id,articles:articles})
    })
})

router.post('/viewarticles/:id', async(req,res)=>{

     await Article.findOneAndUpdate({postID:req.params.id}, {title:req.body.title,author:req.body.author,content:req.body.content},{upsert:true})    
     res.redirect('/dashboard/viewarticles')
    })

router.post('/viewarticles/:id/delete', async (req,res)=>{
    Article.deleteOne({postID:req.params.id},()=>{
        Comment.deleteMany({postID:req.params.id},() =>{

        })
        
            res.redirect('/dashboard/viewarticles')
        
    })

})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
module.exports = router