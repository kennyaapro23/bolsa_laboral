var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET home page. */
router.get('/institucion/ofertas', function(req, res, next) {
    console.log("noooo");
    dbConn.query('SELECT * FROM oferta_laboral ORDER BY id DESC', function(err, rows) {
        if(err) {
            req.flash('error', err);
            console.log("noooo");
            res.render('/institucion/ofertas', { data: '' });
        } else {
            res.render('institucion/ofertas', { data: rows });
        }
    });
});

router.get('/institucion/ofertas', function(req, res, next) {
    console.log("noooo");
    res.redirect('/institucion/ofertas');
});



router.post('/categorias-add', function(req, res, next) { 

    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    //console.log(nombre);

        var form_data = {
            nombre: nombre,
            descripcion: descripcion
        }
        
        // insert query
        dbConn.query('INSERT INTO categorias SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
            } else {                
                req.flash('success', 'categoria registrada satisfactoriamente');
                res.redirect('../admin/categorias');
            }
        })
 
});
router.get('/categorias-edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('SELECT * FROM categorias WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('admin/categorias')
        }
        else {
            res.render('admin/categorias-edit', {
                id: rows[0].id, 
                nombre: rows[0].nombre, 
                descripcion: rows[0].descripcion, 
            })
        }
    })

 
});
router.post('/categorias-edit/:id', function(req, res, next) {
    let id = req.params.id;
    //console.log(id);
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;
    
 
        var form_data = {
            nombre: nombre,
            descripcion: descripcion
        }

        dbConn.query('UPDATE categorias SET ? WHERE id = ' + id, form_data, function(err, result) {

            if (err) {

                req.flash('error', err)
            } else {
                req.flash('success', 'Categoria actualizada correctamente');
                res.redirect('../categorias');
            }
        })
    })
    router.get('/categorias-del/(:id)', function(req, res, next) {

        let id = req.params.id;
         
        dbConn.query('DELETE FROM categorias WHERE id = ' + id, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.redirect('../categorias')
            } else {
                req.flash('success', 'registro eliminado ID = ' + id)
                res.redirect('../categorias')
            }
        })
    })
    




module.exports = router;