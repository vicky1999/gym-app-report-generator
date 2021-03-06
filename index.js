const express = require('express');
const cors = require('cors');
const fs=require('fs');
const pdf=require('pdf-creator-node');

const app=express();
app.use(cors());
app.use(express.json());

const html=fs.readFileSync('template.html','utf-8');

app.get('/hello',(req,res) => {
    res.send("Hello World!");
})

app.get('/generate-pdf',(req,res) => {
    //res.send("hello world!");
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        "footer": {
            "height": "28mm",
            "contents": {
                default: '<center><span style="color: #444;">{{page}}</span>/<span>{{pages}}</span></center>', 
            }
        }
    };
    var document = {
        html: html,
        data: {
            pretest: {
                height: 165,
                weight: 68
            },
            postest: {
                height: 169,
                weight: 66
            }
        },
        path: "./output.pdf"
    };
    pdf.create(document, options)
    .then(response => {
        //console.log(res)
        var data =fs.readFileSync('./output.pdf');
        res.contentType("application/pdf");
        res.send(data);
    })
    .catch(error => {
        console.error(error)
    });
})

app.listen(3000,'0.0.0.0',() => {
    console.log("Listening on port 5000");
})
