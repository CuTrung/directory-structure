const { db } = require("@src/configs/db.config");
const TYPE_JOIN = {
    INNER_JOIN: 'INNER JOIN',
    LEFT_JOIN: 'LEFT JOIN',
    RIGHT_JOIN: 'RIGHT JOIN',
    CROSS_JOIN: 'CROSS JOIN',
}
const Op = {
    AND: 'AND',
    OR: 'OR'
}
const that = module.exports = {
    TYPE_JOIN,
    Op,
    mysqlService: () => {

        const execQuery = async ({ query, data = "", connection }) => {
            let dataExec = [];
            // Ko bắt try catch để được chạy vào try catch của transaction
            if (connection) {
                console.log(`${query} |||||| ${data}`);
                dataExec = await (connection ?? db.mySQL).query(query, data);
                return dataExec;
            }

            try {
                console.log(`${query} |||||| ${data}`);
                dataExec = await db.mySQL.query(query, data);
            } catch (error) {
                console.log(">>> ~ file: sql.service.js:9 ~ execQuery ~ error: ", error)
            }
            return dataExec;
        }

        // Khi có timestamp sẽ tự động tạo 2 cột createdAt and updatedAt
        const createTable = async (table, { fields = {}, timestamp }) => {
            const isStringMySQL = (value) => {
                const DATA_TYPE_STRING_MYSQL = ['VARCHAR', 'TEXT'];
                return DATA_TYPE_STRING_MYSQL.includes(value.split('(')[0].replace(" ", "").toUpperCase());
            }

            const columns = [];
            for (const [key, value] of Object.entries(fields)) {
                if (isStringMySQL(value)) {
                    columns.push(`\`${key}\` ${value} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
                } else {
                    columns.push(`\`${key}\` ${value}`)
                }
            }

            if (timestamp) {
                columns.push('createdAt DATETIME DEFAULT CURRENT_TIMESTAMP', 'updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }

            const query = `CREATE TABLE IF NOT EXISTS ${table} (id INT AUTO_INCREMENT PRIMARY KEY, ${columns.join(", ")}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
            const [rows] = await execQuery({ query });
            return rows;
        }

        const mergeCondition = (condition) => {
            if (condition === undefined) return "";
            const op = condition && Object.keys(condition)[0];

            const { AND: dataAnd, OR: dataOr } = condition;
            const dataLoop = dataAnd ?? dataOr ?? "";
            return dataLoop && `WHERE `.concat(
                dataLoop.map((field) => Object.keys(field).map((key) => `${key} = ${field[key].toString().includes("@") ? `"${field[key]}"` : field[key]}`).join(` ${op} `))
            );
        }

        const select = async (table, { fields = ['*'], queryAtTheEnd, connection, where: condition } = {}) => {
            const query = `SELECT ${fields.join(", ")} FROM ${table} ${queryAtTheEnd ?? mergeCondition(condition)}`;
            const [rows] = await execQuery({ query, connection });
            return rows;
        }

        const insert = async (table, { data = [], fields, connection }) => {
            if (data.length === 0) return;
            const nonColumns = ['id', 'createdAt', 'updatedAt'];
            const itemDefault = (await execQuery({ query: `DESCRIBE ${table}` }))[0]
                ?.reduce((acc, cur) =>
                    nonColumns.includes(cur.Field) ? acc
                        : {
                            ...acc,
                            [cur.Field]: cur.Default ?? cur.Null === 'YES' ? null : ""
                        },
                    {})

            const values = data.map((field) => Object.values({
                ...itemDefault,
                ...field
            }));

            const columns = Object.keys(itemDefault);
            const lastInsertId = await execQuery({ query: `SELECT MAX(id) as id FROM ${table};` }).then(([result]) => result[0].id);

            const query = `INSERT INTO ${table} (${columns.join(", ")}) VALUES ?`;
            const insertedIds = await execQuery({ query, data: [values], connection }).then(([dataInserted]) =>
                new Promise((resolve, reject) => {
                    const insertResults = [];
                    for (let i = lastInsertId + 1; i <= lastInsertId + dataInserted.affectedRows; i++) {
                        insertResults.push(i);
                    }
                    resolve(insertResults);
                })
            );

            return await select(table, { fields: fields ?? columns, queryAtTheEnd: `WHERE id IN (${insertedIds.join(", ")})` });
        }

        const update = async (table, { data = {}, queryAtTheEnd, connection, fields, where: condition }) => {
            if (Object.keys(data).length === 0) return;
            const dataSet = Object.entries(data).map((item) => `${item[0]} = ?`).join(", ");
            const query = `UPDATE ${table} SET ${dataSet} ${queryAtTheEnd ?? mergeCondition(condition)}`;
            await execQuery({ query, data: Object.values(data), connection });

            const dataUpdated = await select(table, {
                fields: fields ?? Object.keys('id' in data ? data : { ...data, id: null }),
                connection,
                queryAtTheEnd,
                where: condition
            })
            return dataUpdated
        }

        const _delete = async (table, { queryAtTheEnd, connection, where: condition }) => {
            const query = `DELETE FROM ${table} ${queryAtTheEnd ?? mergeCondition(condition)}`;
            const [rows] = await execQuery({ query, connection });
            if (rows?.affectedRows)
                return await select(table, {
                    where: condition,
                    queryAtTheEnd,
                    connection
                });
            return null;
        }

        const transaction = async (cb) => {
            const connection = await db.mySQL.getConnection();
            let data;
            try {
                await connection.beginTransaction();
                data = await cb(connection);
                await connection.commit();
            } catch (error) {
                console.log(">>> ~ file: sql.service.js:140 ~ transaction ~ error: ", error)
                await connection.rollback();
            } finally {
                connection.release();
            }
            return data;
        }

        const dropAllTables = async () => {
            const querySelect = `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = '${process.env.DB_MYSQL_NAME}'`;
            const [rows] = await execQuery({ query: querySelect })
            return await execQuery({ query: `DROP TABLE ${rows.map(item => item.TABLE_NAME).join(", ")}` });
        }

        return {
            createTable, select, insert, update, _delete, transaction, dropAllTables
        }
    }
}