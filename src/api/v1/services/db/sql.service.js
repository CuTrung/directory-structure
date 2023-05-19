const { db } = require("@src/configs/db.config");
module.exports = {
    mysqlService: () => {
        const execQuery = async (query, arrData) => {
            let data = null;
            try {
                console.log(`${query} |||||| ${arrData}`);
                data = await db.mySQL.query(query, arrData);
            } catch (error) {
                console.log(">>> ~ file: sql.service.js:9 ~ execQuery ~ error: ", error)
            }
            return data;
        }

        const isStringMySQL = (value) => {
            const DATA_TYPE_STRING_MYSQL = ['VARCHAR', 'TEXT'];
            return DATA_TYPE_STRING_MYSQL.includes(value.split('(')[0].replace(" ", "").toUpperCase());
        }

        // Khi có timestamp sẽ tự động tạo 2 cột createdAt and updatedAt
        const createTable = async (tableName, fields, { timestamp } = {}) => {
            const columns = [];
            for (const [key, value] of Object.entries(fields)) {
                if (isStringMySQL(value)) {
                    columns.push(`${key} ${value} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
                } else {
                    columns.push(`${key} ${value}`)
                }
            }

            if (timestamp) {
                columns.push('createdAt DATETIME DEFAULT CURRENT_TIMESTAMP', 'updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }

            const query = `CREATE TABLE IF NOT EXISTS ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, ${columns.join(", ")}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;

            return await execQuery(query);
        }

        const select = async (table, { fields = "*", queryAtTheEnd = "" } = {}) => {
            const query = `SELECT ${fields} FROM ${table} ${queryAtTheEnd}`;
            return await execQuery(query);
        }

        const bulkInsert = async (table, listFields) => {
            const columnsName = Object.keys(listFields[0]);
            const values = listFields.map(field => Object.values(field))
            const query = `INSERT INTO ${table} (${columnsName.join(", ")}) VALUES ?`;
            return await execQuery(query, [values]);
        }

        const insert = async (table, fields) => {
            return await bulkInsert(table, [fields]);
        }

        const update = async (table, fields, whereCondition = "") => {
            const dataSet = Object.entries(fields).map((item) => `${item[0]} = ?`).join(", ");
            const query = `UPDATE ${table} SET ${dataSet} ${whereCondition}`;
            return await execQuery(query, Object.values(fields));
        }

        const _delete = async (table, whereCondition = "") => {
            const query = `DELETE FROM ${table} ${whereCondition}`;
            return await execQuery(query);
        }

        return {
            select, insert, bulkInsert, update, _delete, createTable
        }
    }
}