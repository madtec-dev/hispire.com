var express = require('express');
var router = express.Router();
var email = require('.././config/email.js');


/* GET home page. */

function render(template, data, req, res) {
  if ( req.headers['x-pjax']) {
    data.layout = null;
    res.render(template, data);
  }
  else {
    res.render(template, data);
  };

}

router.get('/', function(req, res) {
  render('index', { title: 'MADTEC | Consulting - Websites - Applications - Online marketing' }, req, res);
});

router.get('/about', function(req, res) {
  render('about', { title: 'MADTEC | About us' }, req, res);
});

router.get('/contact', function(req, res) {
  render('contact', { title: 'MADTEC | Get in touch!' }, req, res);
});

router.get('/services', function(req, res) {
  render('services', { title: 'MADTEC | What we do' }, req, res);
});

router.get('/services/branding', function(req, res) {
  render('service-branding', { title: 'MADTEC | Create' }, req, res);
});

router.get('/services/develop', function(req, res) {
  render('service-develop', { title: 'MADTEC | Create' }, req, res);
});
router.get('/services/story', function(req, res) {
  render('service-story', { title: 'MADTEC | Create' }, req, res);
});
router.get('/services/promote', function(req, res) {
  render('service-promote', { title: 'MADTEC | Create' }, req, res);
});

router.get('/trophies', function(req, res) {
  render('porfolio', { title: 'MADTEC | Trophy room' }, req, res);
});

router.get('/trophies/finca', function(req, res) {
  render('trophy-finca', { title: 'MADTEC | Trophies - Finca el molar' }, req, res);
});

router.get('/trophies/apicatando', function(req, res) {
  render('trophy-apicatando', { title: 'MADTEC | Trophies - Apicatando' }, req, res);
});


router.get('/start-project', function(req, res) {
  render('start-project', { title: "MADTEC | Let's start something incredible" }, req, res);
});

function parseFiles(files) {
  var filesArray = [].concat(files);
  var parsedFiles = [];
  console.log(filesArray);
  if(filesArray[0] != undefined) {
    for(var i=0;i<filesArray.length;i++) {
      console.log(filesArray[i][0]);
      var file = {
        filename: filesArray[i].originalname ,
        path: filesArray[i].path
      }
      parsedFiles.push(file);
    }
  } else {
    parsedFiles = [];
  }
  return parsedFiles;
}

router.post('/start-project', function(req, res, next) {
  console.log('BODY', req.body);
  console.log('FILES', req.files);
  if (req.files) {
    var projectFiles = Object.keys(req.files)
      .map(function(i) {
        return { filename: req.files[i].originalname,
               path: req.files[i].path
               }
      })
  }
  console.log(projectFiles);
  var message = {
      from: req.body.name + ' <' + req.body.email + '>' ,
      to: 'projects@madtec.co',
      //replace it with id you want to send multiple must be separated by ,(comma)
      subject: 'Project request',
      //generateTextFromHTML: true,
      text: "From: "+ req.body.name + "\n" +
      "Company: "+ req.body.company + "\n" +
      "Email: "+ req.body.email + "\n" +
      "Phone: "+ req.body.phone + "\n" +
      "Budget: "+ req.body.budget + "\n" +
      "Timeframe: "+ req.body.timeframe + "\n" +
      "Details: \n\n"+ req.body.details,
      html: "<p><b>From: </b>" + req.body.name +
      "</p> <p><b>Company: </b>"+ req.body.company +
      "</p> <p><b>Email: </b>"+ req.body.email +
      "</p> <p><b>Phone: </b>"+ req.body.phone +
      "</p> <p><b>Budget: </b>"+ req.body.budget +
      "</p> <p><b>Timeframe: </b>"+ req.body.timeframe +
      "</p> <h4>Details: </h4><p>"+ req.body.details + "</p>",
      attachments: projectFiles
  }

  //TODO remove images after email is sent
  email.sendMail(message, function(err) {
      if(err) {
        res.status(500);
        console.log(err);
        res.send('Error sending email: ' + err);
      } else {
        res.status(200);
        res.send('Project sent!');
      }
    });
});

module.exports = router;
