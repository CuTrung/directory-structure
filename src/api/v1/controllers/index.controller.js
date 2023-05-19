const { getStudent, createStudent, getStudentMongo } = require("@v1/services/index.service")
const { resFormat, RES_STATUS } = require("@v1/utils/api.util")
const { validateRequest } = require("@v1/validations/index.validation")

module.exports = {
    getStudent: async (req, res) => {
        const data = await getStudent();
        return res.status(data.status === RES_STATUS.SUCCESS ? 200 : 500).json(data);
    },
    createStudent: async (req, res) => {
        const messagesError = validateRequest({
            username: 'required|string:(min:5)'
        }, req.body)
        if (messagesError.length > 0) {
            return res.status(400).json(resFormat({
                message: messagesError.join(""),
            }))
        }
        return res.status(data.status === RES_STATUS.SUCCESS ? 200 : 500).json(await createStudent(req.body));
    },
    getStudentMongo: async (req, res) => {
        const data = await getStudentMongo();
        return res.status(data.status === RES_STATUS.SUCCESS ? 200 : 500).json(data);
    }
}