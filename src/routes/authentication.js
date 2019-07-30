const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');

const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');


router.get('/signup', isLoggedIn, (req, res )=>{
    res.render('auth/singup');
});

router.post('/signup', passport.authenticate('local.signup',{
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));


router.get('/signin',isNotLoggedIn, (req, res, next )=>{
    res.render('auth/singin');
});
router.post('/signin', (req, res, next)=>{
    passport.authenticate('local.signin', {
        successRedirect:'/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});


router.get('/profile', isLoggedIn, async (req, res) =>{
    const compes = await pool.query('SELECT * FROM competidores WHERE id_admin = ?',[req.user.id]);
    res.render('profile',
    {compes});
});

router.get('/resultados',  async (req, res) =>{
    const compes = await pool.query('SELECT * FROM competencias');
    console.log(compes);
    res.render('resultados',{ 
        compes
     });
});
router.get('/winners/:categoria', async (req,res)=>{
    const { categoria } = req.params;
    console.log(categoria);
    const results = await pool.query('SELECT * FROM resultados WHERE competencia = ? ORDER BY final DESC',[categoria]);
    res.render('pintar',
    {
        results
    });
});
router.get('/operacion/:nombre', isLoggedIn, async (req, res) =>{
    const { nombre } = req.params;
    //console.log(nombre);
    const names = await pool.query('SELECT gamertag from competidores WHERE categoria = ?',[nombre]);
    const results = await pool.query('SELECT * FROM resultados WHERE competencia = ? ORDER BY final DESC',[nombre]);
    console.log(results);
    //console.log(names);
    res.render('operacion',{
        nombre,
        names,
        results
    });
});

router.get('/logout', (req,res) =>{
    req.logOut();
    res.redirect('/signin');
});
module.exports = router;