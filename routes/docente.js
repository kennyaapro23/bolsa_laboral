var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/docente', function(req, res, next) {
    dbConn.query('SELECT * FROM oferta_laboral ORDER BY ol_id desc',function(err,rows){
        if(err) {
            req.flash('error', err);
            res.render('docente/docente',{data:''});   
        }else {
            res.render('docente/docente',{data:rows});
        }
    });
});

router.get('/docente-add', function(req, res, next) {
    res.render('docente/docente-add');
});

router.post('/docente-add', function(req, res, next) {
    
    let fl = req.body.fl;
    let fi = req.body.fi;
    let fc = req.body.fc;
    let titulo = req.body.titulo;
    let descripcion = req.body.descripcion;
    let horario = req.body.horario;
    let salario = req.body.salario;
    let estado = req.body.estado;
    let empresa = req.body.empresa;
    
    
    var form_data = {
        ol_fecha_inicio_labores: fl,
        ol_fecha_inicio_convocatoria: fi, 
        ol_fecha_fin_convocatoria: fc,
        ol_titulo: titulo,
        ol_descripcion: descripcion,
        ol_horario: horario,
        ol_salario: salario,
        ol_estado: estado,
        ol_ep_id: empresa

        
    }


    dbConn.query('INSERT INTO oferta_laboral SET ?', form_data, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
        } else {                
            req.flash('success', 'categoria registrada satisfactoriamente');
            res.redirect('../docente/docente');
        }
    })
    });



router.get('/docente-edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    //console.log(id);
    dbConn.query('SELECT * FROM oferta_laboral WHERE ol_id='+id,function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Ninguna categoria tiene el id = '+id)
            res.redirect('docente/docente')
        }
        else {
            res.render('docente/docente-edit', {
                id: rows[0].ol_id,
                fl: rows[0].ol_fecha_inicio_labores,
                fi: rows[0].ol_fecha_inicio_convocatoria,
                fc: rows[0].ol_fecha_fin_convocatoria,
                titulo: rows[0].ol_titulo,
                descripcion: rows[0].ol_descripcion,
                horario: rows[0].ol_horario,
                salario: rows[0].ol_salario,
                estado: rows[0].ol_estado,
                empresa: rows[0].ol_ep_id
            })
        }
    })
});

router.post('/docente-edit/:id', function(req, res, next) {
    let id = req.params.id;
    let fl = req.body.fl;
    let fi = req.body.fi;
    let fc = req.body.fc;
    let titulo = req.body.titulo;
    let descripcion = req.body.descripcion;
    let horario = req.body.horario;
    let salario = req.body.salario;
    let estado = req.body.estado;
    let empresa = req.body.empresa;

    var form_data = {
        ol_fecha_inicio_labores: fl,
        ol_fecha_inicio_convocatoria: fi, 
        ol_fecha_fin_convocatoria: fc,
        ol_titulo: titulo,
        ol_descripcion: descripcion,
        ol_horario: horario,
        ol_salario: salario,
        ol_estado: estado,
        ol_ep_id: empresa
    }
    dbConn.query('UPDATE oferta_laboral SET ? WHERE ol_id='+id,form_data,function(err, result) {
        if (err) {
            req.flash('error', err);
        } else {
            req.flash('success', 'Categoria actualizada correctamente');
            res.redirect('../docente');
        }
    })
    
});

router.get('/docente-del/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM oferta_laboral WHERE ol_id='+id,function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('../docente')
        } else {
            req.flash('success', 'Registro eliminado con ID = ' + id)
            res.redirect('../docente')
        }
    })
});

//Lista postulaciones
router.get('/postulaciones', function(req, res, next) {
    dbConn.query('SELECT * FROM postulacion ORDER BY pc_id desc',function(err,rows){
        if(err) {
            req.flash('error', err);
            res.render('docente/postulaciones',{data:''});   
        }else {
            res.render('docente/postulaciones',{data:rows});
        }
    });
});


  // Añadir postulacion
  router.post('/postulacion-add', function (req, res, next) {
  
    let eg = req.body.eg;
    let ol = req.body.ol;
    let ganador = req.body.ganador;
    let puntaje = req.body.puntaje;
  
    var form_data = {
      pc_eg_id: eg,
      pc_ol_id: ol,
      pc_ganador: ganador,
      pc_puntaje: puntaje
     
    }
  
    dbConn.query('INSERT INTO usuario SET ?', form_data, function (err, result) {
      if (err) {
        req.flash('error', err)
      } else {
        req.flash('success', 'Usuario agregado con exito');
        res.redirect('../admin/usuario');
      }
    })
  });

module.exports = router;
