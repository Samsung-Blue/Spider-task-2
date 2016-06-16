/* global newform */

var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var pass;
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'infinity',
  port : '8801',
  database : 'student'
});
connection.connect(function(err){
    if(err)
        console.log("Error has occurred while connecting to database");
    else
        console.log("Database connected");
});
connection.query('DROP TABLE students',function(err,result){
    });
connection.query('CREATE TABLE students(Rollno int UNIQUE,Name varchar(50),Dept varchar(5),Email varchar(100),Address varchar(100),About varchar(100),passcode varchar(5) UNIQUE)',function(err,result){
    if(err)
        throw err;
    else
        console.log("Table created!");
});
app.get('/',function(req,res){
   displayForm(res);
});
app.post('/',function(req,res){
    if(req.body.submit==='Search')
    {
        var roll = req.body.rollno;
    connection.query('SELECT * FROM students WHERE Rollno = ?',roll,function(err,rows,fields){
       if(!err)
          res.send(rows);
       else
           console.log("Error has occurred");
    });
    }
    else if(req.body.submit==='Add')
    {
        var post={
            rollno : req.body.roll,
            name : req.body.name,
            dept : req.body.dept,
            email : req.body.email,
            address : req.body.address,
            about : req.body.about,
            passcode : Math.floor(900*Math.random())
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
    else if(req.body.submit==='Edit')
    {
        console.log("Edit!!!");
        pass=req.body.passcode;
        connection.query('UPDATE students SET Rollno=?, Name=?, Dept = ?,Email=?,Address=?,About=? WHERE passcode = ?',[req.body.rollnew,req.body.namenew,req.body.deptnew,req.body.emailnew,req.body.addressnew,req.body.aboutnew,pass],function(err,result){
        if(!err)
        {
            console.log("Updated");
            console.log(req.body.rollnew);
        }
        else
            console.log("Error has occured");
    });
    displayForm(res);
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