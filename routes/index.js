var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
const ejs = require('ejs');



/* GET home page. */
router.get('/', function (req, res, next) {
  dbConn.query('SELECT ol_id,date_format(ol_fecha_inicio_laborales, "%d-%m-%Y") as ol_fecha_inicio_laborales,date_format(ol_fecha_inicio_convocatoria, "%d-%m-%Y") as ol_fecha_inicio_convocatoria,date_format(ol_fecha_fin_convocatoria, "%d-%m-%Y") as ol_fecha_fin_convocatoria,ol_titulo,ol_descripcion,ol_horario,ol_salario,ol_estado,u.us_usuario FROM oferta_laboral ol, empresas e , usuario u WHERE e.em_id=ol.ol_ep_id AND u.us_id=e.ep_us_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('index', { data: '' });
    } else {
      res.render('index', { data: rows });
    }
  });
});
router.get('/oferta', function (req, res, next) {
  dbConn.query('SELECT ol_id,date_format(ol_fecha_inicio_laborales, "%d-%m-%Y") as ol_fecha_inicio_laborales,date_format(ol_fecha_inicio_convocatoria, "%d-%m-%Y") as ol_fecha_inicio_convocatoria,date_format(ol_fecha_fin, "%d-%m-%Y") as ol_fecha_fin,ol_titulo,ol_descripcion,ol_horario,ol_salario,ol_estado,u.usu_nombre_razon_social,u.usu_usuario FROM oferta_laboral ol, empresas e , usuario u WHERE e.em_id=ol.ol_em_id AND u.usu_id=e.em_usu_id', function (err, rows) {

    if (err) {
      req.flash('error', err);
      res.render('oferta', { data: '' });
    } else {
      res.render('oferta', { data: rows });
    }
  });
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
        if (rol === 1 ) {
          res.redirect("/institucion/index"); // Redirecciona a la página de administración si el rol es igual a 1
        } else if (rol === 2  ) {
          res.redirect("/egresado/index"); // Redirecciona a la página de categorías si el rol es igual a 2
        } else if (rol === 3) {
          res.redirect("/empresa/index"); // Redirecciona a la página de empresa si el rol es igual a 3
        } else if (rol === 4) {
          res.redirect("/docente/index"); // Redirecciona a la página de docente si el rol es igual a 4
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
    res.render('institucion/index'); // Renderiza la vista de categorías para el administrador desde la carpeta "oferta/admin"
  } else {
    console.log("Acceso no autorizado");
    res.redirect("/login");
  }
});

router.get('/egresado/index', function(req, res, next) {
  var rol = req.session.rol;
  if (rol === 2) {
    res.render('egresado/index'); // Renderiza la vista de categorías para el egresado desde la carpeta "oferta"
  } else {
    console.log("Acceso no autorizado");
    res.redirect("/login");
  }
});

router.get('/empresa/index', function(req, res, next) {
  var rol = req.session.rol;
  if (rol === 3) {
    res.render('empresa/index'); // Renderiza la vista de empresa desde la carpeta "oferta"
  } else {
    console.log("Acceso no autorizado");
    res.redirect("/login");
  }
});

router.get('/docente/index', function(req, res, next) {
  var rol = req.session.rol;
  if (rol === 4) {
    res.render('docente/index'); // Renderiza la vista de docente desde la carpeta "oferta"
  } else {
    console.log("Acceso no autorizado");
    res.redirect("/login");
  }
});

//-------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/empresa/dashboard', function(req, res, next) {
  if(req.session.admin){
    res.render('empresa/index');
  }
  else{
    res.redirect("/login");
  }
});

router.get('/empresa/logout',function(req, res){
  req.session.destroy();
  res.redirect("/");
});



router.get('/docente', function(req, res, next) {
  if(req.session.admin){
    res.render('docente/index');
  }
  else{
    res.redirect("/login");
  }
});

router.get('/docente/logout',function(req, res){
  req.session.destroy();
  res.redirect("/");
});



//------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/egresado/dashboard', function(req, res, next) {
  if(req.session.admin){
    res.render('egresado/index');
  }
  else{
    res.redirect("/login");
  }
});

router.get('/egresado/logout',function(req, res){
  req.session.destroy();
  res.redirect("/");
});

//------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/institucion/dashboard', function(req, res, next) {
  if(req.session.admin){
    res.render('institucion/index');
  }
  else{
    res.redirect("/login");
  }
});

router.get('/institucion/logout',function(req, res){
  req.session.destroy();
  res.redirect("/");
});
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM egresados',function(err,rows){
      if(err) {
          req.flash('error', err);
          res.render('index',{data:''});   
      }else {
          res.render('index',{data:rows});
          console.log("holaaaa hata aqui llegaste perrra xd");
      }
  });
});

router.post('/search', function(req, res, next) {

  let name=req.body.search;

  dbConn.query("SELECT * FROM egresados WHERE nombrs LIKE ?", ['%' + name + '%'], function(err, rows) {
    if(err) {
          req.flash('error', err);
          res.render('index',{data:''});   
      }else {
          res.render('index',{data:rows});
      }
  });
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




module.exports = router;