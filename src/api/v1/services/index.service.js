const { serviceResult, SERVICE_STATUS } = require("@v1/utils/api.util");
const { mysqlService } = require("./db/sql.service")
const { select, insert } = mysqlService();
const { mongoDBService, redisService } = require("./db/nosql.service");
const { createModel, getModel } = mongoDBService();
const { get, setex, update } = redisService();
module.exports = {
    getStudent: async () => {
        const [row, fields] = await select('student');
        if (row.length > 0) {
            return serviceResult({
                status: SERVICE_STATUS.SUCCESS,
                message: 'Get student success',
                data: row
            });
        }
        return serviceResult({
            message: 'Get student error',
        });
    },
    createStudent: async (student) => {
        const [row, fields] = await insert('student', student);
        return serviceResult({
            message: 'Created student success',
            data: {
                username: student.username
            }
        });
    },
    getStudentMongo: async () => {
        return serviceResult({
            message: 'Get student mongo success'
        })
    }
}