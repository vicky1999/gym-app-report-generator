const express = require('express');
const cors = require('cors');

const app=express();
app.use(cors());
app.use(express.json());

app.get('/hello',(req,res) => {
    res.send("Hello World!");
})

app.get('/generate-pdf',(req,res) => {
    res.send("PDF Generating!");
})

app.listen(80,'0.0.0.0',() => {
    console.log("Listening on port 5000");
})