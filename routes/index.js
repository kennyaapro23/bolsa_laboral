var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var user = req.body.user;
  var password = req.body.password;
  dbConn.query("SELECT * FROM usuario WHERE us_usuario = ? AND us_password = ?", [user, password], function(err, rows) {
    if (err) {
      console.log(err);
    } else {
      if (rows.length) {
        req.session.id = rows[0].us_id;
        req.session.user = rows[0].us_usuario;
        req.session.password = rows[0].us_password;
        req.session.rol = rows[0].us_rol;
        
        var rol = rows[0].us_rol;
        if (rol ===1 ) {
          res.redirect("/institucion/index"); // Redirecciona a la página de administración si el rol es igual a 1
        } else if (rol === 2  ) {
          res.redirect("/egresado/egresado-add"); // Redirecciona a la página de categorías si el rol es igual a 2
        } else if (rol === 3) {
          res.redirect("/empresa/empresa"); // Redirecciona a la página de empresa si el rol es igual a 3
        } else if (rol === 4) {
          res.redirect("/docente/docente"); // Redirecciona a la página de docente si el rol es igual a 4
        } else {
          console.log("Rol desconocido");
          res.redirect("/login");
        }
      } else {
        console.log("Usuario no encontrado");
        res.redirect("/");
      }
    }
  });
});

router.get('/institucion/index', function(req, res, next) {
  var rol = req.session.rol;
  if (rol === 1) {
    res.render('institucion/index'); // Renderiza la vista de categorías para el administrador desde la carpeta "institucion"
  } else {
    console.log("Acceso no autorizado");
    res.redirect("/login");
  }
});

router.get('/egresado/egresado-add', function(req, res, next) {
  var rol = req.session.rol;
  if (rol === 2) {
    res.render('egresado/egresado-add'); // Renderiza la vista de categorías para el egresado desde la carpeta "oferta"
  } else {
    console.log("Acceso no autorizado");
    res.redirect("/login");
  }
});

router.get('/Empresa/empresa', function(req, res, next) {
  var rol = req.session.rol;
  if (rol === 3) {
    res.render('Empresa/empresa'); // Renderiza la vista de empresa desde la carpeta "oferta"
  } else {
    console.log("Acceso no autorizado");
    res.redirect("/login");
  }
});

router.get('/Docente/docente', function(req, res, next) {
  var rol = req.session.rol;
  if (rol === 4) {
    res.render('Docente/docente'); // Renderiza la vista de docente desde la carpeta "oferta"
  } else {
    console.log("Acceso no autorizado");
    res.redirect("/login");
  }
});




module.exports = router;