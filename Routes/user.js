const router=require("express").Router();
const cloudinary=require('../Utils/cloudinary');
const upload=require('../Utils/multer');
const User=require('../model/user');

router.post('/', upload.single('image'), async(req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const result = await cloudinary.uploader.upload(req.file.path);

    let user = new User({
      name: req.body.name,
      avatar: result.secure_url,
      cloudinary_id: result.public_id
    });

    await user.save();

    res.json(user);

  } catch(err) {
    console.log("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/",async(req,res)=>{
    try{
        let user = await User.find();
        res.json(user);
    }catch(err){
        comsole/log(err);
    }

});
router.delete("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);

    // Delete user from database
    await user.deleteOne(); // <-- updated from remove()

    res.json({ message: "User deleted successfully", user });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      name: req.body.name || user.name,
      avatar: result?.secure_url || user.avatar,
      cloudinary_id: result?.public_id || user.cloudinary_id,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});
module.exports=router