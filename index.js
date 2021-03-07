const express = require('express');
const cors = require('cors');
const fs=require('fs');
const pdf=require('pdf-creator-node');

const app=express();
app.use(cors());
app.use(express.json());

const html=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        table { 
            width: 750px; 
            border-collapse: collapse; 
            margin:50px auto;
            }

        /* Zebra striping */
        tr:nth-of-type(odd) { 
            background: #eee; 
            }

        th { 
            background: #37535c; 
            color: white; 
            font-weight: bold; 
            }

        td, th { 
            padding: 10px; 
            border: 1px solid #ccc; 
            text-align: left; 
            font-size: 18px;
            }

        /* 
        Max width before this PARTICULAR table gets nasty
        This query will take effect for any screen smaller than 760px
        and also iPads specifically.
        */
        @media 
        only screen and (max-width: 760px),
        (min-device-width: 768px) and (max-device-width: 1024px)  {

            table { 
                width: 100%; 
            }

            /* Force table to not be like tables anymore */
            table, thead, tbody, th, td, tr { 
                display: block; 
            }
            
            /* Hide table headers (but not display: none;, for accessibility) */
            thead tr { 
                position: absolute;
                top: -9999px;
                left: -9999px;
            }
            
            tr { border: 1px solid #ccc; }
            
            td { 
                /* Behave  like a "row" */
                border: none;
                border-bottom: 1px solid #eee; 
                position: relative;
                padding-left: 50%; 
            }

            td:before { 
                /* Now like a table header */
                position: absolute;
                /* Top/left values mimic padding */
                top: 6px;
                left: 6px;
                width: 45%; 
                padding-right: 10px; 
                white-space: nowrap;
                /* Label the data */
                content: attr(data-column);

                color: #000;
                font-weight: bold;
            }
        }
    </style>
</head>
<body>
    <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Test</th>
            <th scope="col">Pre Test Result</th>
            <th scope="col">Post Test Result</th>
            <th scope="col">Overall Test Result</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">1</th>
                <td>Height</td>
                <td>{{this.pretest.height}}</td>
                <td>{{this.postest.height}}</td>
                <td>--</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Weight</td>
                <td>{{this.pretest.weight}}</td>
                <td>{{this.postest.weight}}</td>
                <td>--</td>
            </tr>
        </tbody>
      </table>
    </body>
</html>

`;

app.get("/",(req,res) => {
    res.send("Hiii///");
})

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

app.listen(800,'0.0.0.0',() => {
    console.log("Listening on port 5000");
})
