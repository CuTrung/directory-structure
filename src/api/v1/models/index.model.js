const { mysqlService } = require("../services/db/sql.service")
const { createTable } = mysqlService();

createTable('New', {
    username: 'varchar(255)',
    password: 'varchar(255)',
}, { timestamp: true });
