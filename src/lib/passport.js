const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const pool = require('../database');
const helpers = require('../lib/helpers');
//////////// L O G I N //////////////////////////

passport.use('local.signin', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, user, password, done) =>{
    const rows = await pool.query('SELECT * FROM admins WHERE user = ?', [user]);
    if(rows.length > 0 ){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success','Welcome' + user.user));
        }else{
            done(null, false, req.flash('message','Contraseña Invalido'));
        }
    }else{
        return done(null, false, req.flash('message','Usuario no existe'));
    }
}));
//

//////// A U T H E N T I F I C A T I O N ///////
passport.use('local.signup', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, user, password, done) => {
    const { nombre, apellido, rol } = req.body;
    const newUser = {
        user,
        password,
        nombre,
        apellido,
        rol
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO admins SET ?', [newUser]);
    newUser.id = result.insertId;
    console.log(newUser.id);
    return done(null, newUser);


}));


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM admins WHERE id = ?', [id]);

    done(null, rows[0]);
  });
  