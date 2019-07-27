const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');


router.get('/add', isLoggedIn, async (req,res)=>{
    const acmons = await pool.query('SELECT nombre FROM admins WHERE id = ?',[req.user.id]);
    console.log(acmons);
    res.render('links/add',
    {acmons});
});
router.post('/add', async (req,res) => {
   const {nombre_competencia, nombre_organizador, 
    nombre_gym, direccion_gym} = req.body;
   const newCompetition = {
       nombre_competencia,
       nombre_organizador,
       nombre_gym,
       direccion_gym,
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
    const competiti = await pool.query('SELECT nombre_competencia FROM competencias WHERE id_competencia = ?',[id]);
    console.log(competiti);
    await pool.query('DELETE FROM competencias WHERE id_competencia = ?',[id]);
    //await pool.query('DELETE FROM competidores WHERE categoria = ?',[competiti]);
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

///////////////// RUTAS DE USUARIOS //////////////////
router.get('/adduser', async (req, res) =>{
    const compes = await pool.query('SELECT nombre_competencia from competencias WHERE user_id = ?', [req.user.id]);
    //console.log(compes);
    res.render('links/adduser',
    {compes});

});
router.post('/adduser', async (req, res) =>{
    //console.log(req.body);
    const { nombre, 
        apellido, 
        categoria, 
        celular, 
        edad,
        correo, 
        sexo, 
        estatura    
    } = req.body;
    const newCompetidor = {
        nombre, apellido, categoria, celular,correo, edad, sexo, estatura,id_admin: req.user.id
    }
    await pool.query('INSERT into competidores set ?',[newCompetidor]);
    req.flash('success','Agregado con exito');
    res.redirect('/profile/');
});

router.get('/deleteu/:id', async (req, res) =>{
    
    const { id } = req.params;
    console.log(id);
    await pool.query('DELETE FROM competidores WHERE id_competidor = ?',[id]);
    req.flash('success', 'Removido con éxito');
    res.redirect('/profile/');

});

router.get('/editu/:id', async (req, res) =>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM competidores WHERE id_competidor = ?', [id]);
    const compes = await pool.query('SELECT nombre_competencia from competencias WHERE user_id = ?', [req.user.id]);
    res.render('links/editu',{
        links:links[0],
        compes
    });
    
});
router.post('/editu/:id', async (req, res) =>{
    const { id } = req.params;
    const { nombre, 
        apellido, 
        categoria, 
        celular, 
        edad,
        correo, 
        sexo, 
        estatura } =req.body;
        const newCompetidor = {
            nombre, apellido, categoria, celular,correo, edad, sexo, estatura,id_admin: req.user.id
        }

    await pool.query('UPDATE competidores SET ? WHERE id_competidor = ? ', [newCompetidor, id]);
    req.flash('success','Actualizado con exito');
    res.redirect('/profile/');

});

///////////////// OPERACION DE RESLTADOS /////////////////
router.post('/result', async (req, res )=>{
    const { 
        competencia,
        competidor,
        hashUno,
        pUno,
        hashDos,
        pDos,
        hashTres,
        pTres
     } = req.body;

     const wodUno = parseInt(hashUno);
     const puntosUno = parseInt(pUno); 
     const wodDos = parseInt(hashDos);
     const puntosDos = parseInt(pDos);
     const wodTres = parseInt(hashTres);
     const puntosTres = parseInt(pTres);
     
   
     const final = puntosUno + puntosDos + puntosTres;
     console.log(final);
     const newResult = {
        competencia,
        competidor,
        wodUno,puntosUno,wodDos,puntosDos,wodTres,puntosTres,
        final
     }

     await pool.query('INSERT INTO resultados SET ?', [newResult]);
     res.redirect('/resultados');
    });

//////////////// RUTAS DE GRAFICAS //////////////////////
    router.get('/grafos', async (req, res )=>{
        const m = await pool.query('SELECT COUNT(nombre) AS mm FROM `competidores` WHERE sexo = "M"');
        const f = await pool.query('SELECT COUNT(nombre) AS ff FROM `competidores` WHERE sexo = "F"');
        console.log(m,f);
        res.render('links/grafos',{
            m:m[0],     
            f:f[0]
        });

    });

    router.post('/consultar', async  (req, res )=>{
        const {categoria} = req.body;
        console.log(categoria);
        
        res.redirect('/winners/' + categoria);
    });


module.exports = router;