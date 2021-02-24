
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

//express constructor initialized
const app = express();


//multer for upload of file
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
});
var product_img='';


// To be understood by yourself
const readImage = path => {
  //reads the entire contents of a file.
  //readFileSync() is synchronous and blocks execution until finished.
  const imageBuffer = fs.readFileSync(path);
  //Given the encoded bytes of an image,
  //it returns a 3D or 4D tensor of the decoded image. Supports BMP, GIF, JPEG and PNG formats.
  const tfimage = tfnode.node.decodeImage(imageBuffer);
  return tfimage;
}
// To be understood by yourself
const imageClassification = async path => {
  const image = readImage(path);
  // Load the model.
  const mobilenetModel = await mobilenet.load();
  // Classify the image.
  const predictions = await mobilenetModel.classify(image);
  console.log('Classification Results:', predictions);
  return predictions
}

//if (process.argv.length !== 3) throw new Error('Incorrect arguments: node classify.js <IMAGE_FILE>');

//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//set folder public as static folder for static file
//app.use('/assets', express.static(__dirname + '/public'));
app.use(express.static('public'));

//Route for login and authentication
app.get('/', (req, res) => {

  res.render('classify.hbs');

});



//route for homepage
app.get('/classify',async (req, res) => {
  
    const predictions=await imageClassification('E:\Fifth Semester\Advance Programming (AP)\Labs'+product_img);
    if(predictions){
      var results={
        product_img:product_img,
        class:predictions[0].className,
        probability: Number((predictions[0].probability * 100).toFixed(1))
      }
       // console.log(results.product_img);
      res.render('classify.hbs',{
        results: results
      });
     // console.log(results.object);
    }else{
      console.log('none');
    }
    
});




//route for insert data
app.post('/upload', upload.single('object_img'), (req, res) => {
  
    //var product_img= '/assets/imgs/' + req.file.originalname;
    product_img= '/imgs/' + req.file.originalname;
    var results={
      product_img:product_img
    }
    console.log(results);
    res.render('classify.hbs',{
      results: results
    });
  
  
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});




