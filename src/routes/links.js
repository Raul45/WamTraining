const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');


router.get('/add', isLoggedIn, (req,res)=>{
    res.render('links/add');
});

router.post('/add', async (req,res) => {
   const {nombre_competencia, nombre_organizador, 
    nombre_gym, direccion_gym, rol} = req.body;
   const newCompetition = {
       nombre_competencia,
       nombre_organizador,
       nombre_gym,
       direccion_gym,
       rol,
       user_id: req.user.id
   };
   console.log(newCompetition);
   await pool.query('INSERT INTO competencias set ?', [newCompetition]);
   req.flash('success','Agregado con exito');
   res.redirect('/links/');

});

router.get('/', async (req, res) => {
    const compes = await pool.query('SELECT * FROM competencias WHERE user_id = ?',[req.user.id]);
    res.render('links/list',
    {compes}
    );

});

router.get('/delete/:id', async (req, res) =>{

    const { id } = req.params;
    console.log(id);
    await pool.query('DELETE FROM competencias WHERE id_competencia = ?',[id]);
    req.flash('success', 'Removido con éxito');
    res.redirect('/links/');

});
router.get('/edit/:id', async (req, res) =>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM competencias WHERE id_competencia = ?', [id]);
    res.render('links/edit',{
        links:links[0]
    });
    
});
router.post('/edit/:id', async (req, res) =>{
    const { id } = req.params;
    const { nombre_competencia, nombre_organizador,nombre_gym,direccion_gym,rol} =req.body;
    const newCompetition = {
        nombre_competencia, 
        nombre_organizador,
        nombre_gym,
        direccion_gym,
        rol
    }

    await pool.query('UPDATE competencias SET ? WHERE id_competencia = ? ', [newCompetition, id]);
    req.flash('success','Actualizado con exito');
    res.redirect('/links/');

});
module.exports = router;