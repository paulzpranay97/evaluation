const express=require("express")


const {PostsModel}=require("../model/posts.model")
const postsRouter=express.Router()
const jwt=require("jsonwebtoken")


postsRouter.get("/", async (req,res)=>{
  const {device,device1,device2}=req.query
  try {
      let query = {};
  
      if (device) {
        query.device = { $regex: new RegExp(device, "i") };
      }
  
      if (device1 && device2) {
          const regexStr = device1 + '|' + device2;
          query.device = { $regex: new RegExp(regexStr, "i") };
      // query.device = {$in: [device1,device2]};
      }
  
      const data = await PostsModel.find(query);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
})


// add the posts of perticular user /posts/add

postsRouter.post("/add", async (req, res) => {
    const payload = req.body;
    try {
      const posts = new PostsModel(payload);
      // await posts.save()
      res.status(200).send(await posts.save());
    } catch (err) {
      res.status(400).send({ msg: "Post is not created", err: err.message });
      
    }
    
  });





postsRouter.patch("/update/:id", async (req,res) =>{
    const id = req.params.id;
    const change = req.body;
  
    const note = await PostsModel.findOne({ _id: id });
    const user_id_in_posts = note.userID;
    const user_id_req = req.body.userID;
  
    try {
      if (user_id_req !== user_id_in_posts) {
        res.send({ msg: "you are not authorized" });
      } else {
        await PostsModel.findByIdAndUpdate({ _id: id }, change);
        res.send("update the data");
      }
    } catch (error) {
      res.send({ msg: "something went wrong", error: error.message });
      console.log(error)
    }
})





postsRouter.delete("/delete/:id", async (req,res) =>{
    const id = req.params.id;
    const change = req.body;
  
    const note = await PostsModel.findOne({ _id: id });
    const user_id_in_posts = note.userID;
    const user_id_req = req.body.userID;
  
    try {
      if (user_id_req !== user_id_in_posts) {
        res.send({ msg: "you are not authorized" });
      } else {
        const posts=await PostsModel.findByIdAndDelete({ _id: id }, change)
       
        res.send(posts);
      }
    } catch (error) {
      res.send({ msg: "something went wrong", error: error.message });
      console.log(error)
    }
})


// maximum no. of Comment keep the route as /posts/top
postsRouter.get('/top', async (req, res) => {
    try {
      
      const posts = await PostsModel.find({});
  
      
      const sorted = posts.sort((a, b) => b.no_of_comments - a.no_of_comments);
  
    //**here if want to show the 1 result than put this over res res.send(sorted[i]);
      res.send(sorted);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Server error' });
    //   console.log(err);
    }
  });

// // /filter by divices

postsRouter.get("/id/:id", async (req, res) => {
  const id = req.params.id;
  try {
  const data= await PostsModel.find({ _id: id });
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});



  

module.exports={
    postsRouter
}