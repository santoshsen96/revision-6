const express=require("express")
const {blogModel}=require("../model/blogs.model")
const {auth} = require("../middleware/auth.middleware")
const { userModel } = require("../model/users.model")

const blogRouter=express.Router()


//blogRouter.use(auth)

blogRouter.post("/create",auth,async(req,res)=>{
    try{
        const blog=new blogModel(req.body)
        await blog.save()
        res.json({msg:"new blog added",blog:req.body})
    }catch(err){
        res.json({error:err.message})
    }
})

blogRouter.get("/",auth,async(req,res)=>{
    try{
        const blogs=await blogModel.find({userID:req.body.userID})
        res.send(blogs)
    }catch(err){
        res.json({error:err.message})
    }
})

blogRouter.patch("/update/:noteID",auth,async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {noteID} = req.params
    try{
        const note=await blogModel.findOne({_id:noteID})
        const userIDinNoteDoc=note.userID
        if(userIDinUserDoc===userIDinNoteDoc){
            await blogModel.findByIdAndUpdate({_id:noteID},req.body)
            res.json({msg:`${note.title} has updated`})
        }else{
            res.json({msg:"Not authorized"})
        }

    }catch(err){
        res.json({error:err})
    }
    
})

blogRouter.delete("/delete/:noteID",auth,async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {noteID} = req.params
    try{
        const note=await blogModel.findOne({_id:noteID})
        const userIDinNoteDoc=note.userID
        if(userIDinUserDoc===userIDinNoteDoc){
            await blogModel.findByIdAndDelete({_id:noteID})
            res.json({msg:`${note.title} has deleted`})
        }else{
            res.json({msg:"Not authorized"})
        }

    }catch(err){
        res.json({error:err})
    }
})

//filter by specialization
blogRouter.get('/category/:category', async(req, res) => {
    const {category} = req.params
    try{
        const blogs=await blogModel.find({category: category })
        res.send(blogs)
    }catch(err){
        res.json({error:err.message})
    }
  });
////search
  blogRouter.get('/search/:title', async (req, res) => {
    const {title} = req.params
    const searchTerm = req.params.title.toLowerCase();
    const searchedblogs = await blogModel.find({ title: { $regex: searchTerm, $options: 'i' } });
    res.json(searchedblogs);
  });

 // Sort by date
 blogRouter.get('/sort/date', async (req, res) => {
    const sortedblogs = await blogModel.find().sort({ date: 1 });
    res.json(sortedblogs);
  });

  ////likes
  blogRouter.patch('/:id/like', async (req, res) => {
    const blogId = req.params.id;
  
    try {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        { $inc: { likes: 1 } },
        { new: true }
      );
  
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
  
      res.json(blog);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });
////coment
blogRouter.patch('/:id/comment',auth, async (req, res) => {
    const blogId = req.params.id;
    const commentContent = req.body.comments[0].content;
  
    try {
      const blog = await blogModel.findById(blogId);
  
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
  
      blog.comments.push({ username:userModel._id , content: commentContent });
      await blog.save();
  
      res.json(blog);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });


module.exports={
    blogRouter
}