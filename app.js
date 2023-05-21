var express=require('express')
var mongoose=require('mongoose');
var bodyParser=require("body-parser");
var ejs=require('ejs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'info@tierslimited.com',
      pass: '4kcQzPLpuQqN'
    }
  });

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://DreamLightAdmin:Dreamlight123@ac-k8rregz-shard-00-00.e1d21o9.mongodb.net:27017,ac-k8rregz-shard-00-01.e1d21o9.mongodb.net:27017,ac-k8rregz-shard-00-02.e1d21o9.mongodb.net:27017/DreamLight?ssl=true&replicaSet=atlas-4sg2xh-shard-0&authSource=admin&retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
var db=mongoose.connection;
db.on('error',()=>console.log('error'))
db.once('open',()=>console.log('connected'))
const app=express();
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":'*'
    })
    return res.redirect('index.html')
}).listen(4000)
console.log('Listening 4000')
app.post("/jobs",(req,res)=>{
    var jobtitle=req.body.jobtitle;
    var jobaddress=req.body.jobaddress;
    var companydes=req.body.companydes;
    var jobdes=req.body.jobdes;
    var requirments=req.body.requirments;
    var qual=req.body.qual;
    var Other=req.body.Other;
    var data={
        "jobtitle":jobtitle,
        "jobaddress":jobaddress,
        "companydes":companydes,
        "jobdes":jobdes,
        "requirments":requirments,
        "qual":qual,
        "Other":Other,
    }
    db.collection('jobs').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log('Record Insered');
    });
    return res.redirect('Addjob.html');
})

app.post("/blogs",(req,res)=>{
    var blogspic=req.body.blogspic;
    var blogtitle=req.body.blogtitle;
    var blogswriter=req.body.blogswriter;
    var blogdes=req.body.blogdes;
    const date = new Date();
    var data={
        "blogspic":blogspic,
        "blogtitle":blogtitle,
        "blogswriter":blogswriter,
        "blogdes":blogdes,
        "date":date.toDateString(),
    }
    db.collection('blogs').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log('Record Insered');
    });
    return res.redirect('Addblogs.html');
})

const jobSchema=new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    cnic:String,
    starting:String,
    city:String,
    esalary:String,
    resumelink:String,
})
const contactSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    emails:String,
    phonenumber:String,
    comments:String,
})
const quoteSchema= new mongoose.Schema({
    Firstname:String,
    Lastname:String,
    email:String,
    contact:String,
    companyName:String,
    bugdet:String,
    service:String,
    detail:String,
    status:String,
})
const Jobrequest=new mongoose.model('Jobrequest',jobSchema)
const Contact=new mongoose.model('Contact',contactSchema)
const Quote=new mongoose.model('Quote',quoteSchema)
app.set('view engine','ejs')

app.get('/dreamjobrequest',function(req,res){
    Jobrequest.find({},function(err,JR){
        if(err){
            console.log(err)
        }
        else{
            console.log(JR)
            res.send(JR);
        }
    })
})


const blogsSchema={
    blogspic:String,
    blogtitle:String,
    blogswriter:String,
    blogdes:String,
    date:String,
}
const Blog=mongoose.model('blogs',blogsSchema)
app.get('/currentblogs',function(req,res){
    Blog.find({},function(err,blog){
        if(err){
            console.log(err)
        }
        else{
            res.send(blog);
        }
    })
})

app.get('/deleteblog/:id',function(req,res){
    Blog.deleteOne({_id:req.params.id},function(err,blog){
        if(err){
            console.log('error')
        }
        else{
            Blog.find({},function(err,blogs){
                if(err){
                    console.log(err)
                }
                else{
                    res.render('currentblogs.ejs',{blogslist:blogs});
                }
            })
        }
    })
})

app.get('/gotoupdate/:id',function(req,res){
    Blog.find({_id:req.params.id},function(err,blog){
        if(err){
            console.log(err)
        }
        else{
            res.send(blog);
        }
    })
})

app.post('/updatedblog',function(req,res){
    const date = new Date();
    Blog.updateOne({_id:req.body.blogid},{
        "blogspic":req.body.blogspic,
        "blogtitle":req.body.blogtitle,
        "blogswriter":req.body.blogswriter,
        "blogdes":req.body.blogdes,
        "date":date.toDateString(),
    },function(err,blog){
        if(err){
            console.log(err)
        }
        else{
            Blog.find({},function(err,blogs){
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('http://localhost:4000/currentblogs.html');
                }
            })
        }
    })
})

app.get('/requestedprojects',function(req,res){
    Quote.find({},function(err,quote){
        if(err){
            console.log(err)
        }
        else{
            res.render('requestedprojects.ejs',{projects:quote})
        }
    })
})

app.get('/inprogressprojects',function(req,res){
    Quote.find({},function(err,quote){
        if(err){
            console.log(err)
        }
        else{
            res.send(quote);
        }
    })
})

app.get('/completedProjects',function(req,res){
    Quote.find({},function(err,data){
        if(err){
            console.log(err)
        }
        else{
            res.send(data);
        }
    })
})

app.get('/messages',function(req,res){
    Contact.find({},function(err,messgae){
        if(err){
            console.log(err)
        }
        else{
            res.send(messgae);
        }
    })
})

app.get('/requestedprojectsapproval/:id',function(req,res){
    Quote.updateOne({_id:req.params.id},{status:"In Progress"},function(err,request){
        if(err){
            console.log(err)
        }
        else{
            Quote.find({},function(err,quote){
                if(err){
                    console.log(err)
                }
                else{
                    res.render('requestedprojects.ejs',{projects:quote})
                }
            })
        }
    })
})

app.get('/projectcompletion/:id',function(req,res){
    Quote.updateOne({_id:req.params.id},{status:"Completed"},function(err,request){
        if(err){
            console.log(err)
        }
        else{
            Quote.find({},function(err,quote){
                if(err){
                    console.log(err)
                }
                else{
                    res.render('inprogress.ejs',{projects:quote})
                }
            })
        }
    })
})

app.get('/rejectproject/:id',function(req,res){
    Quote.deleteOne({_id:req.params.id},function(err,request){
        if(err){
            console.log(err)
        }
        else{
            Quote.find({},function(err,quote){
                if(err){
                    console.log(err)
                }
                else{
                    res.render('requestedprojects.ejs',{projects:quote})
                }
            })
        }
    })
})

app.get('/rejectedproject/:id',function(req,res){
    Quote.deleteOne({_id:req.params.id},function(err,request){
        if(err){
            console.log(err)
        }
        else{
            Quote.find({},function(err,quote){
                if(err){
                    console.log(err)
                }
                else{
                    res.render('inprogress.ejs',{projects:quote})
                }
            })
        }
    })
})
const loginSchema=new mongoose.Schema({
    Username:String,
    Password:String,
})
const Credential =new mongoose.model('Credential',loginSchema)
app.post('/signin',function(req,res){
    console.log(req.body)
    Credential.find({},function(err,job){
        if(err){
            console.log(err)
        }
        else{
            var Username=req.body.username;
            var password=req.body.password;
            const hashuser = crypto.createHash('sha256').update(Username).digest('hex');
            const hashpass = crypto.createHash('sha256').update(password).digest('hex');
            if(hashuser==job[0].Username && hashpass==job[0].Password){
                res.redirect('/dashboard.html')
            }
            else{
                res.redirect('/index.html')   
            }
        }
    })
})

const applySchema=new mongoose.Schema({
    JobTitle:String,
    Firstname:String,
    Lastname:String,
    email:String,
    address:String,
    contact:String,
    imagelink:String,
    Education:Array,
    ExperienceTitle:String,
    Company:String,
    olocation:String,
    ESdate:String,
    Eedate:String,
    Linkedin:String,
    Facebook:String,
    Twitter:String,
    Website:String,
    Resumelink:String,
    Message:String,
})
const Jobapplication=new mongoose.model('Jobapplication',applySchema)
app.get('/viewapplication',function(req,res){
    Jobapplication.find({},function(err,applications){
        if(err){
            console.log(err)
        }
        else{
            console.log(applications)
            res.send(applications);
        }
    })
})

app.get('/viewapplication/:id',function(req,res){
    Jobapplication.find({_id:req.params.id},function(err,applications){
        if(err){
            console.log(err)
        }
        else{
            res.send(applications);
        }
    })
})

app.get('/sendemail/:to',function(req,res){
    res.render('replyemail.ejs',{From:req.params.from,To:req.params.to})
})

app.post('/email',function(req,res){
    var toemail=req.body.to;
    var subject=req.body.subject;
    var body=req.body.bodymes;
    var mailOptions = {
        from: 'TIERS Limited<info@tierslimited.com>',
        to: toemail,
        subject: subject,
        html:`
        <!DOCTYPE html>
        <html>

        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
            <!-- Font Awesome -->
            <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            rel="stylesheet"
            />
            <!-- Google Fonts -->
            <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="stylesheet"
            />
            <!-- MDB -->
            <link
            href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.1.0/mdb.min.css"
            rel="stylesheet"
            />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <style type="text/css">
                @media screen {
                    @font-face {
                        font-family: 'Lato';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                    }

                    @font-face {
                        font-family: 'Lato';
                        font-style: normal;
                        font-weight: 700;
                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                    }

                    @font-face {
                        font-family: 'Lato';
                        font-style: italic;
                        font-weight: 400;
                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                    }

                    @font-face {
                        font-family: 'Lato';
                        font-style: italic;
                        font-weight: 700;
                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                    }
                }

                /* CLIENT-SPECIFIC STYLES */
                body,
                table,
                td,
                a {
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }

                table,
                td {
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }

                img {
                    -ms-interpolation-mode: bicubic;
                }

                /* RESET STYLES */
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                }

                table {
                    border-collapse: collapse !important;
                }

                body {
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                }

                /* iOS BLUE LINKS */
                a[x-apple-data-detectors] {
                    color: #357fff !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }

                /* MOBILE STYLES */
                @media screen and (max-width:600px) {
                    h1 {
                        font-size: 32px !important;
                        line-height: 32px !important;
                    }
                }

                /* ANDROID CENTER FIX */
                div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                }
                
            </style>
        </head>

        <body style="background-color: #357fff; margin: 0 !important; padding: 0 !important;">
            <!-- HIDDEN PREHEADER TEXT -->
            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> 
            </div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <!-- LOGO -->
                <tr>
                    <td bgcolor="#357fff" align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#357fff" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                    <h1 style="font-size: 48px; font-weight: 400; margin: 2;color: #357fff;">TIERS Limited</h1> <img src="https://wallpaperaccess.com/full/4391662.jpg" width="125" height="120" style="display: block; border: 0px;" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                    <p style="margin: 0;text-align:justify;">${body}</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
        </body>
        </html>
        `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    }); 
    Contact.find({},function(err,messgae){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('http://localhost:4000/contactforms.html')
        }
    })
})