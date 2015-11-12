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

router.use(function (req, res, next) {
    // mustache helper
    res.locals.lg = '/';

    next();
});

router.param('locale', function(req, res, next, locale) {
  res.cookie('locale', locale);
  res.setLocale(locale);
  res.locals.lg =  '/' + req.getLocale()  + '/';
  next();
})

router.get('/', function(req, res) {
  render('index', { title: 'HISPIRE | ' + req.__('title') }, req, res);
});

router.get('/:locale?', function(req, res, next) {
  if (req.params.locale == 'es' || req.params.locale == 'en') {
    render('index', { title: 'HISPIRE | ' + req.__('title') }, req, res);
  }
  else next();
})


router.get('/:locale?/about', function(req, res) {
  render('about', { title: 'HISPIRE | ' + req.__('about title') }, req, res);
});

router.get('/:locale?/contact', function(req, res) {
  render('contact', { title: 'HISPIRE | ' + req.__('contact title') }, req, res);
});

router.get('/:locale?/services', function(req, res) {
  render('services', { title: 'HISPIRE | ' + req.__('services title') }, req, res);
});

/*router.get('/services/branding', function(req, res) {
  render('service-branding', { title: 'HISPIRE | Create' }, req, res);
});

router.get('/services/develop', function(req, res) {
  render('service-develop', { title: 'HISPIRE | Create' }, req, res);
});
router.get('/services/story', function(req, res) {
  render('service-story', { title: 'HISPIRE | Create' }, req, res);
});
router.get('/services/promote', function(req, res) {
  render('service-promote', { title: 'HISPIRE | Create' }, req, res);
});*/

router.get('/:locale?/portfolio', function(req, res) {
  render('portfolio', { title: 'HISPIRE | ' + req.__('portfolio title') }, req, res);
});

router.get('/:locale?/portfolio/finca', function(req, res) {
  render('portfolio-finca', { title: 'HISPIRE | ' + req.__('finca title') }, req, res);
});

router.get('/:locale?/portfolio/apicatando', function(req, res) {
  render('portfolio-apicatando', { title: 'HISPIRE | ' + req.__('apicatando title') }, req, res);
});


router.get('/:locale?/start-project', function(req, res) {
  render('start-project', { title: 'HISPIRE | ' + req.__('start project title') }, req, res);
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
