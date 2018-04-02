
let express = require('express');
let app = express();



app.use(express.static("public"));


app.get("/", function(req, res){
	res.sendFile('public/index.html');
});

app.listen(3838, function(){
   console.log("Server is fine!");
});
