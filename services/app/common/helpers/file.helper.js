const logger = require('../classes/logger.class');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../../config/config');


const uploadFormData = (base64) => {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('type', 'default');
        form.append('file', Buffer.from(base64.split(';base64,').pop(), 'base64'), { filename: 'document.png' })
        axios.post(`${config.domain_cdn}/upload`, form, { headers: { ...form.getHeaders(), ...{ 'Authorization': `APIKEY ${config.upload_apikey}` } } })
            .then(res => resolve(res.data))
            .catch(reject)
    })
}

const saveBase64 = async (base64) => {
    try {
        const res = await uploadFormData(base64);
        if (!res.data) throw new Error(res.message);
        return res.data && res.data.file ? res.data.file : null
    } catch (e) {
        logger.error(e, { 'function': 'fileHelper.saveBase64' });
        throw new Error(e.message || 'error')
    }
};

const downloadImgFB = async (url) => {
    const downloadReq = new Promise((resolve, reject) => {
        return axios
            .get(url, {
                responseType: 'arraybuffer'
            })
            .then(response => resolve(Buffer.from(response.data).toString('base64')))
            .catch(error => reject(error));
    });

    let imageUrl = null
    try {
        const base64 = await downloadReq;
        if (base64) {
            imageUrl = await saveBase64(base64)
        }
    } catch (error) {
        console.log(error)
        logger.error(error, {
            function: "file.helper.downloadImgFB",
        });
    }
    return imageUrl;
}

module.exports = {
    downloadImgFB
};
