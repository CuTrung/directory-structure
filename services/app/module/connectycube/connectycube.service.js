const PROCEDURE_NAME = require('../../common/const/procedure-name.const');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');
const crypto = require('crypto');
const fetch = require('node-fetch');
const config = require('../../../config/config');
const { generateCreateSessionParams, signParams} = require('../../common/helpers/cube.helper');

const API_CREATE_SESSION = `${config.connectycube.api}/session`;
const API_CREATE_USER = `${config.connectycube.api}/users`;

const createSession = () => {
    let sessionParams = generateCreateSessionParams(null)
    sessionParams.signature = signParams(sessionParams, config.connectycube.creds.authSecret)
    return new Promise((resolve, reject) => {
        fetch(API_CREATE_SESSION, {
        method: 'POST', body: JSON.stringify(sessionParams),
        headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(json => {
            const token = json.session.token;
            resolve(token);
        })
        .catch((error) => reject(error))
    })
}

const createAccountConnectyCube = async (token, payload) => {
    const { member_id, prefix, full_name = '' } = payload;
    const body = {
        "user": {
            "login": `${prefix}${member_id}`,
            "password": `${member_id}-${prefix}-zokoi`,
            "email": `${member_id}@zokoi.vn`,
            "full_name": full_name||member_id
          }
    }
    return new Promise((resolve, reject) => {
        fetch(API_CREATE_USER, { 
            method: 'POST', body: JSON.stringify(body),
            headers: {
                'CB-Token': token,
                'Content-Type': 'application/json'   
            }
        })
        .then(res => res.json())
        .then(json => {
           if(!json.user || !json.user.id){
                return reject(JSON.stringify(json));
           }
           else {
            const cube_id = json.user.id;
            resolve({...payload, ...{cube_id}})
           }
        })
        .catch(error => reject(error))
    })
}

const createAccount = async payload => {
    try {
        const token = await createSession();
        const res = await createAccountConnectyCube(token, payload);
        return res;
    } catch (error) {
        console.log(error);
        logger.error(error, {'function': 'connectycube.service:createAccount'});
        return null;
    }
}

module.exports = {
  createAccount
};
