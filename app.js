const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path=require('path')
app.use(bodyParser.json());
app.use(express.static('public')); // Assuming your HTML file is in the "public" directory

let surveyData = [];
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
