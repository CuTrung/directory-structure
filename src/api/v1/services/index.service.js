const { resFormat, RES_STATUS } = require("@v1/utils/api.util");
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
                status: RES_STATUS.SUCCESS,
                message: 'Get student success',
                data: row
            });
        }
        return resFormat({
            message: 'Get student error',
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