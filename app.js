
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
mongoose.set('strictQuery', true);


const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true});

const articleSchema = {
    title:String,
    content:String
};

const Article = mongoose.model("Article",articleSchema);

////////////////////////////////////////Request targettig all the Articles/////////////////////////////////////////////////////////////////////

app.route("/articles")
.get(function (req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }
        else{
            res.send(err);
        }

    });
})
.post(function(req,res){
    
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully saved Document");
        }
        else {
            res.send(err);
        }
    });

})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the entry");

        }
        else{
            res.send(err);
        }
    });
});



  
////////////////////////////////////////////////////// Request targeting specific Article ///////////////////////////////////////////////////////




app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        res.send("No article matching the title");
    });
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title,content:req.body.content},
        function(err){
            if(!err){
                res.send("Successfully updated the doc");
            }
            else{
                res.send(err);
            }
            
        }
    );
})
.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("Successfully updated");
            }
            else{
                res.send(err);
            }
        }
    );
})
.delete(function(req,res){
Article.deleteOne(
    {title:req.params.articleTitle},
    function(err) {
        if(!err){
            res.send("Successfully deleted");
        }
    else 
    {
        res.send(err);
    }
}
    );
});


app.listen(3000,function(){
    console.log("Server is running on port 3000");
});


