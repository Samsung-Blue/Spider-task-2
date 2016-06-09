var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  port : '8801',
  database : 'student'
});
connection.connect(function(err){
    if(err)
        console.log("Error has occurred while connecting to database");
    else
        console.log("Database connected");
});
connection.query('CREATE TABLE students(Rollno int UNIQUE,Name varchar(50),Dept varchar(5),Email varchar(100),Address varchar(100),About varchar(100),CONSTRAINT chk CHECK(dept=CSE OR dept=ECE OR dept=CIVIL OR dept=CHEM OR dept=EEE OR dept=ICE OR dept=PROD OR dept=META OR dept=MECH))',function(err,result){
    if(err)
        throw err;
    else
        console.log("Table created!");
});
app.get('/',function(req,res){
   displayForm(res);
});
app.post('/',function(req,res){
    if(req.body.submit==='view')
    {
    connection.query('SELECT * FROM students',function(err,rows,fields){
       if(!err)
         res.send(rows);
       else
           console.log("Error has occurred");
    });
    }
    else if(req.body.submit==='add')
    {
        var post={
            rollno : req.body.roll,
            name : req.body.name,
            dept : req.body.dept,
            email : req.body.email,
            address : req.body.address,
            about : req.body.about
        };
        connection.query('INSERT INTO students SET ?',post,function(err,result){
            if(!err)
            {
                console.log("Inserted");
                displayForm(res);
            }
            else
                console.log("Error has occurred");
                
        });
    }
});
function displayForm(res)
{
    fs.readFile('form.html',function(err,data){
        if(!err)
        {
            res.writeHead(200,{'Content-Type':'text/html','Content-Length':'data.length'});
            res.write(data);
            res.end();
        }
        else
        {
            res.writeHead(404,{'Content-Type':'text/plain'});
            res.write("404 File not found");
            res.end();
        }
    });
}
app.listen(8081);
console.log("Server is running");