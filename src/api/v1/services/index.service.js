const { resFormat, RES_STATUS } = require("../utils/api.util");
const { mysqlService } = require("./db/sql.service")
const { select, insert } = mysqlService();
const { mongoDBService, redisService } = require("./db/nosql.service");
const { createModel, getModel } = mongoDBService();
const { get, setex, update } = redisService();
module.exports = {
    getStudent: async () => {
        const [row, fields] = await select('student');
        if (row.length > 0) {
            return resFormat({
                message: 'Get student success',
                data: row
            });
        }
        return resFormat({
            message: 'Get student error',
            status: RES_STATUS.ERROR
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
    getStudentMongo: async () => {
        return resFormat({
            message: 'Get student mongo success'
        })
    }
}