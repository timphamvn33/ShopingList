const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose"); 
const _ = require('lodash'); // using lodash library to capitalize the word

const date = require(__dirname+"/date.js")
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}))



app.use(express.static("public"));
// var item =["Buy food"]
// let workItems = []
// working on the mongodb
// connect to mondodb
mongoose.connect('mongodb+srv://admin-tim:Thuonghuyen55@cluster0.fo64y.mongodb.net/listShopingDB', {useNewUrlParser: true})
// create new items schema
const itemSchema = {
    name: String
}
// create new listSchema 
const listSchema = {
    name: String,
    items: [itemSchema]
}
// create mongoose model
const Item = mongoose.model("Item", itemSchema);
// create mongoose model base on new listSchema
const List = mongoose.model("List", listSchema);
// create new mongoose document
const item1 = new Item({name: "welcome to toDoList"})
const item2 = new Item({name: "Hit the + button to add a new item."})
const item3 = new Item({name: "<-- hit this to delete item."})

// call those mongoose documents into array
const defaultItems = [item1, item2, item3]
// insert the item documents into the items collection
// Item.insertMany(defaultItems, function(err){
//     if(err){
//         console.log(err)
//     }else{
//         console.log("Successfully")
//     }
// })
// let today = date.getDate()
app.get("/", function(req, res){
    
    // find all the data 
    Item.find({}, function(err, foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("Successfully")
                }
            })
            res.redirect("/")
        }
        else{

        res.render("doc", {listTitle: "Today", here: foundItems})
        }
    })
    
    

});

// post the action delete item 
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkBox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(req.body.checkBox, function(err){
            if(!err){
                
                res.redirect("/")
            }
            
        })
    }
    else{
        // find one and update in mongoose
        List.findOneAndUpdate(
            {name: listName}, 
            {$pull: {items: {_id: checkedItemId}}},
            function(err, foundList){
                if(!err){
                    res.redirect("/"+ listName)
                }
            }
        )
    }
    
}) 

//express lets we use route parameter to create a dynamic route 

app.get("/:customListName", function(req, res){
    var nameRoute = req.params.customListName;
    // create new mongoose list documents
    const list = new List({
        name: nameRoute,
        items: defaultItems
    })
    list.save()
    // moongose provide find one to find only 1 data
    List.findOne({name:nameRoute}, function(err, foundList){
        if(!err){
           if(!foundList){
               // create new list
               const newList = new List({
                   name: nameRoute,
                   items: defaultItems
               })
               newList.save()
               res.redirect("/"+ nameRoute);
           }
           else{
               res.render("doc", {listTitle:_.capitalize(foundList.name), here:foundList.items} )
           }
          
            
        }
    })
})

app.post("/", function(req, res){
    // request the new item
    
    const itemNAME = req.body.newItem;
    const listName = req.body.button;
    const newItem = new Item({name: itemNAME}) // add the input item as a new item
    
    if(listName === "Today"){
        newItem.save() // save the new item into the database 
        res.redirect("/")
    }
    else{
        List.findOne({name:listName}, function(err, foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/"+ listName)
        })
    }
   
    
    // if(req.body.button==="work"){
    //     workItems.push(i)
    //     res.redirect("/work")
    // }
    // else{
    //     item.push(i)
    //     res.redirect("/")
    // }

})



// app.get("/about", function(req, res){
//     res.render("about"); 
// })
app.post("/about", function(req, res){
    res.redirect("/")
})
// app.get("/work" , function(req, res){
//     res.render("doc", {listTitle: "work List", here: workItems})
// })
// app.post("/work", function(req, res){
//     let item = req.body.newItem;
//     workItems.push(item)
//     res.redirect("/work")
// })

// listen to heroku 
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("server works")
})