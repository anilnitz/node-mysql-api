module.exports = app => {
  const home = require("../controllers/homeController.js");
  var router = require("express").Router();
  const multer = require('multer')
  const storage = multer.diskStorage({
    destination: 'public/nftImages',
    filename: function (req, file, cb) {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, Date.now() + file.originalname)
      }
      else {
        cb(new Error('Please upload in jpg/jpeg/png format'))
      }
    }
  })
  const upload = multer({ storage: storage })
  router.post('/upload', upload.fields([{ name: 'nftImage' }]),async(req,res)=>{
    console.log(req.body);
  })
  // Create a new user
  router.post("/register",upload.fields([{ name: 'nftImage' }]), home.register);
  // Create a new home
  router.post("/login", home.login);
  // Retrieve all user
  router.get("/getalluser", home.findAll);
  // Retrieve a single user with id
  router.get("/getuserdetails/:id", home.findOne);
  // Update a user with id
  router.put("/:id", home.update);
  // Delete a user with id
  router.delete("/:id", home.delete);
  // Delete all user
  router.delete("/", home.deleteAll);
  app.use('/api', router);
};