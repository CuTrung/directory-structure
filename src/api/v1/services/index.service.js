const { resFormat } = require("../utils/api.util");
const { mysqlService } = require("./db/sql.service")
const { select, insert } = mysqlService();
module.exports = {
    getStudent: async () => {
        const [row, fields] = await select('student');
        return resFormat({
            message: 'Get student success',
            data: row
        });
    },
    createStudent: async (student) => {
        const [row, fields] = await insert('student', student);
        return resFormat({
            message: 'Created student success',
            data: {
                username: student.username
            }
        });
    },
}