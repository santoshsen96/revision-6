const mongoose=require("mongoose")

const commentSchema = mongoose.Schema({
    content: String,
    name: String,
    
   
});

const blogSchema=mongoose.Schema({
   
    title:String,
    content:String,
    category:String,
    user:String,
    userID:String,
    date: { type: Date, default: Date.now },
    likes:Number,
    comments:[commentSchema]
},{
    versionKey:false
})

const blogModel=mongoose.model("blog",blogSchema)

module.exports={
    blogModel
}