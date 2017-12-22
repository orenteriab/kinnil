// config/database.js
// TODO: modificar esto, se tienen las variables para logearse a mysql en varias partes, hay que ponerlas solo en un lugar
module.exports = {
    'connectionLimit': 5000,
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': 'FundableD0ubles'
    },
	'database': 'kinnil',
    'users_table': 'users'
};