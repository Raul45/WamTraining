const mysql = require('mysql');
const { promisify } = require('util')

const {database} = require('./keys');

//Pool es el metodo mas cercano a producción de mysql
const pool = mysql.createPool(database);
pool.getConnection((err, connection)=>{
    if(err){    
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database was closed');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has many connection');
        
        }if(err.code === 'ECONNREFUSED'){
            console.error('DATABSE CONNECTION WAS REFUSED');
        }
    }
    if(connection) connection.release();
    console.log('Db is conected');
    return;
});

// promisify permitte hacer asincronas las funciones
//sql
pool.query = promisify(pool.query);

module.exports = pool;