const { getStudent, createStudent } = require("../services/index.service")
const { resFormat } = require("../utils/api.util")
const { validateRequest } = require("../validations/index.validation")

module.exports = {
    getStudent: async (req, res) => {
        return res.status(200).json(await getStudent())
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
        return res.status(200).json(await createStudent(req.body));
    }

}