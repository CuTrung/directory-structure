require('dotenv').config();
const OffWorkService = require('./app/module/offwork/offwork.service');

(async () => {
    try {
        await OffWorkService.update()
    } catch (error) {

        console.log(error)
    }
})();
