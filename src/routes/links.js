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
   //console.log(newCompetition);
   try{
   await pool.query('INSERT INTO competencias set ?', [newCompetition]);
   req.flash('success','Agregado con exito');
   res.redirect('/links/');
   }catch(e){
       req.flash('success','El nombre de la competencia no se puede repetir');
       res.redirect('/links/');
   }
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
    try{
    await pool.query('UPDATE competencias SET ? WHERE id_competencia = ? ', [newCompetition, id]);
    req.flash('success','Actualizado con exito');
    res.redirect('/links/');
    }catch(err){
        console.log(err);
        res.redirect('/links/');
    }
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
        gamertag, 
        categoria,
        procedencia, 
        celular, 
        edad,
        correo, 
        sexo, 
        estatura    
    } = req.body;
    const newCompetidor = {
        nombre, apellido, gamertag, categoria, procedencia,celular,correo, edad, sexo, estatura,id_admin: req.user.id
    }
    try{
    await pool.query('INSERT into competidores set ?',[newCompetidor]);
    req.flash('success','Agregado con exito');
    res.redirect('/profile/');
    } catch(err) {
        console.log(err);
        req.flash('success','Alias tiene que ser único');
        res.redirect('/profile/');
    }

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
        procedencia, 
        celular, 
        edad,
        correo, 
        sexo, 
        estatura } =req.body;
        const newCompetidor = {
            nombre, apellido, categoria,procedencia, celular,correo, edad, sexo, estatura,id_admin: req.user.id
        }

    
    try{
    await pool.query('UPDATE competidores SET ? WHERE id_competidor = ? ', [newCompetidor, id]);
    req.flash('success','Actualizado con exito');
    res.redirect('/profile/');
    }catch(err){
        res.redirect('/profile');
        req.flash('success','Algo salió mal porfavor intentelo de nuevo');
    }

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
     try{
     await pool.query('INSERT INTO resultados SET ?', [newResult]);
     req.flash('success','Agregado con éxito');
     res.redirect('/operacion/' + competencia);
     }catch(e){
         req.flash('success','Competidor ya cuenta con puntaje');
         res.redirect('/operacion/' + competencia);
     }
    });

//////////////// RUTAS DE GRAFICAS //////////////////////
    router.get('/grafos', async (req, res )=>{
        const m = await pool.query('SELECT COUNT(nombre) AS mm FROM `competidores` WHERE sexo = "M"');
        const f = await pool.query('SELECT COUNT(nombre) AS ff FROM `competidores` WHERE sexo = "F"');
        //const d = await pool.query('SELECT COUNT(procedencia) AS dd FROM `competidores` WHERE procedencia = "Durango"');
        //const n = await pool.query('SELECT COUNT(procedencia) AS nn FROM `competidores` WHERE procedencia = "NuevoLeon"');
        //const c = await pool.query('SELECT COUNT(procedencia) AS cc FROM `competidores` WHERE procedencia = "Coahuila"');
        //const t = await pool.query('SELECT COUNT(procedencia) AS tt FROM `competidores` WHERE procedencia = "Tamaulipas"');
        //const s = await pool.query('SELECT COUNT(procedencia) AS ss FROM `competidores` WHERE procedencia = "Sonora"');

        console.log(m,f);
        res.render('links/grafos',{
            m:m[0],     
            f:f[0]
            //d:d[0],
            //n:n[0],
            //c:c[0],
            //t:t[0],
            //s:s[0]
        });

    });

    router.post('/consultar', async  (req, res )=>{
        const {categoria} = req.body;
        console.log(categoria);
        
        res.redirect('/winners/' + categoria);
    });


module.exports = router;