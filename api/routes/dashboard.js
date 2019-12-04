const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const Chart = require('../models/Chart')

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
        var articleID = articles.length+1 
  
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

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
module.exports = router