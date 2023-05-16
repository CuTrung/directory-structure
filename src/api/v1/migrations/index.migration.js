const { execQuery } = require('../../../configs/database.config');

const isStringMySQL = (value) => {
    const DATA_TYPE_STRING_MYSQL = ['VARCHAR', 'TEXT'];
    return DATA_TYPE_STRING_MYSQL.includes(value.split('(')[0].replace(" ", "").toUpperCase());
}

const createTable = async (tableName, fields) => {
    let columns = [];
    for (const [key, value] of Object.entries(fields)) {
        if (isStringMySQL(value)) {
            columns.push(`${key} ${value} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
        } else {
            columns.push(`${key} ${value}`)
        }
    }

    const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ${columns.join(", ")}
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await execQuery(query);
}

const runMigrations = async () => {
    await createTable('new', {
        name: 'varchar(255)',
        age: 'int'
    });
}

module.exports = runMigrations;