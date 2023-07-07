var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET home page. */
router.get('/egresado', function(req, res, next) {
    dbConn.query('SELECT * FROM oferta_laboral ORDER BY ol_id desc',function(err,rows){
        if(err) {
            req.flash('error', err);
            res.render('egresado/egresado',{data:''});   
        }else {
            res.render('egresado/egresado',{data:rows});
        }
    });
});

router.get('/egresado-add', function(req, res, next) {
    res.render('egresado/egresado-add');
});

router.post('/egresado-add', function(req, res, next) {
    
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
            res.redirect('../egresado/egresado');
        }
    })
    });



router.get('/egresado-edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    //console.log(id);
    dbConn.query('SELECT * FROM oferta_laboral WHERE ol_id='+id,function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Ninguna categoria tiene el id = '+id)
            res.redirect('egresado/egresado')
        }
        else {
            res.render('egresado/egresado-edit', {
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

router.post('/egresado-edit/:id', function(req, res, next) {
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
            res.redirect('../egresado');
        }
    })
    
});

router.get('/egresado-del/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM oferta_laboral WHERE ol_id='+id,function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('../egresado')
        } else {
            req.flash('success', 'Registro eliminado con ID = ' + id)
            res.redirect('../egresado')
        }
    })
});

module.exports = router;


