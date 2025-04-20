const express = require("express")
const cors = require("cors");
const path = require("path")


const connectDB = require('./config/db')
const app = express();
const port = 4000;


app.use(cors());
app.use(express.json());

connectDB();


app.get('/' , (req , res ) => {
    res.send('Server works fine!');
});

app.listen(port , () => {
    console.log(`App listening at http://localhost:${port}`);
});