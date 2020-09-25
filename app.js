const express = require('express');
const bodyparser = require('body-parser');

const mongoose= require("mongoose");
const lodash=require('lodash')
const app = express();
app.set('view engine','ejs')
app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static('public'))
mongoose.connect("mongodb+srv://anaparty33:May@1995@cluster0.abgoa.mongodb.net/TodolistDB?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true})
const itemsSchema=new mongoose.Schema({

  name:String
});
const Item=mongoose.model("Item",itemsSchema)

var size;
const item1= new Item({
  name:"Study java"
});
const item2= new Item({
  name:"Study javascript"
});
const item3= new Item({
  name:"Apply jobs"
});

const listSchema=mongoose.Schema(
  {
    name:String,
    items:[itemsSchema]
  })
  const Customlist=mongoose.model("itemlist",listSchema);


app.get('/', function(req,res)
{
  Item.find(function(err,results){
    
   if(results.length==0)
      {
        Item.insertMany([item1,item2,item3],function(err){
          if(err){console.log(err);}
          else{console.log("successfully inserted");}
          
        })
        res.redirect('/')
      }
      else
      {
        console.log(results);
        res.render('list',{headingList:"Today",newListeIem:results  })
      }
      
    }
  )
 
 
})
app.post('/',function(req, res)
{
  console.log(req.body);
  
  const addedItem=req.body.newItem;
  const buttonName=req.body.button;
   //getting what is in input box
  const enteredItem=new Item(
    {
      name:addedItem
    });
    
  if(buttonName=="Today")
  {
    enteredItem.save();
    res.redirect('/')
  }
  else
  {
    Customlist.findOne({name:buttonName},function(err,resultdoc)
    {
        resultdoc.items.push(enteredItem);
        resultdoc.save();
        res.redirect('/'+ buttonName);
      
    })
  }
 
})
app.get('/:routeId',function(req,res)
{
  console.log(req.params.routeId);
  const customListroute=lodash.capitalize(req.params.routeId);
  //checking the name from db 
  Customlist.findOne({name:customListroute},function(err,result)
  {
    if(!err)
    {
      if(!result)
      {
        console.log("does not exist");
        const list=new Customlist({

          name:customListroute,
          items:[item1,item2,item3]
        })
        list.save();
        res.redirect("/"+customListroute)
      }
      else{
        console.log("alreay exists");
        res.render("list",{headingList:customListroute,newListeIem:result.items})
      }
      
    }
    
    
  })
  
  

  


});

app.get('/about',function(req, res)
{
  res.render('about')
})

app.post('/delete',function(req,res)
{
  console.log(req.body.checkbox);
 var toDeleteItem= req.body.checkbox;
 var listName=req.body.hiddenInput

 // delete the list items in custom list
 if(listName==="Today")
 {
   //delete from original list
   Item.deleteOne({name:toDeleteItem},function(err)
 {
   if(err){console.log(err);}
  else{console.log("deleted");}
 })
 res.redirect("/");
 }
 // delete items from custom list
 else
 {
  Customlist.findOneAndUpdate({name:listName},{$pull:{items:{name:toDeleteItem}}},function(err,res)
  {
    
  });
  res.redirect('/'+ listName);
 }
 
})
// app.post('/work',function(req,res)
// {
//
//
// })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function()
{

  console.log('server is running');
})
