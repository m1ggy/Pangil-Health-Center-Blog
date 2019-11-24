const express = require('express');
const app = express();
const port = 3000;


app.get('/',(req,res,err)=>{
    console.error(err)
      res
      .status(200)
      .json({message:'Hello from the server!',app:'Pangil Health Center Blog Post'});
})

app.listen(port, ()=>{
    console.log(`App is running on ${port}...`);
})