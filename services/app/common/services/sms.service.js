
const CryptoJS = require('crypto-js');
const config = require('../../../config/config');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const ServiceResponse = require('../../common/responses/service.response');
const apiHelper = require('../../common/helpers/api.helper');
// check connect sms
const checkConnection = async () => {
    try {

        const signmh = CryptoJS.MD5(config.sendSms.pass).toString();
        const sign = CryptoJS.MD5(config.sendSms.loginName + '-' + signmh).toString();
        const requestArgs = {
            loginName: config.sendSms.loginName,
            sign: sign,
        };
        const url = config.sendSms.url;
        const wsdlOptions = {
            attributesKey: '$attributes',
            overrideRootElement: {
                namespace: '',
                xmlnsAttributes: [{
                    name: 'xmlns',
                    value: 'http://api.abenla.com/',
                }],
            },
        };
        const resultService = await callSoap(url, wsdlOptions, requestArgs, 'CheckConnection');
        return new ServiceResponse(true, '', {
            'data': resultService.CheckConnectionResult,
        });
    } catch (error) {
        return new ServiceResponse(false, '', '');
    }
};
// GetBrandName
const getBrandName = async () => {
    try {
        const signmh = CryptoJS.MD5(config.sendSms.pass).toString();
        const sign = CryptoJS.MD5(config.sendSms.loginName + '-' + signmh).toString();
        const requestArgs = {
            loginName: config.sendSms.loginName,
            sign: sign,
        };
        const url = config.sendSms.url;
        const wsdlOptions = {
            attributesKey: '$attributes',
            overrideRootElement: {
                namespace: '',
                xmlnsAttributes: [{
                    name: 'xmlns',
                    value: 'http://api.abenla.com/',
                }],
            },
        };
        const resultService = await callSoap(url, wsdlOptions, requestArgs, 'GetBrandName');
        return new ServiceResponse(true, '', {
            'data': resultService.GetBrandNameResult,
        });
    } catch (error) {
        return new ServiceResponse(false, '', '');
    }
};
//GetServiceTypeList 
const getServiceTypeList = async () => {
    try {

        const signmh = CryptoJS.MD5(config.sendSms.pass).toString();
        const sign = CryptoJS.MD5(config.sendSms.loginName + '-' + signmh).toString();
        const requestArgs = {
            loginName: config.sendSms.loginName,
            sign: sign,
        };
        const url = config.sendSms.url;
        const wsdlOptions = {
            attributesKey: '$attributes',
            overrideRootElement: {
                namespace: '',
                xmlnsAttributes: [{
                    name: 'xmlns',
                    value: 'http://api.abenla.com/',
                }],
            },
        };
        const resultService = await callSoap(url, wsdlOptions, requestArgs, 'GetServiceTypeList');
        return new ServiceResponse(true, '', {
            'data': resultService.GetServiceTypeListResult,
        });

    } catch (error) {
        return new ServiceResponse(false, '', '');
    }
};

const sendSms = async (bodyParams = {}) => {
    try {
        const checkConnectioncall = await checkConnection();
        if (checkConnectioncall.getData().data.Code !== '106') {
            return new ServiceResponse(false, RESPONSE_MSG.SENDSMS.SENDSMS_CHECKCONNECTION_FAILED);
        }
        const pass = CryptoJS.MD5(config.sendSms.pass).toString();
        const brandNameCall = await getBrandName();
        if (brandNameCall.getData().data.Code !== '106') {
            return new ServiceResponse(false, RESPONSE_MSG.SENDSMS.SENDSMS_GETBRANDNAME_FAILED);
        }
        const brandName = brandNameCall.getData().data.BrandNameList.string[1];
        const serviceTypeCall = await getServiceTypeList();
        if (serviceTypeCall.getData().data.Code !== '106') {
            return new ServiceResponse(false, RESPONSE_MSG.SENDSMS.SENDSMS_GETSERVICETYPELIST_FAILED);
        }
        const serviceType = serviceTypeCall.getData().data.ServiceTypeList.SubServiceType[1].ServiceTypeId;
        const signmh = config.sendSms.loginName + '-' + pass + '-' + brandName + '-' + serviceType;
        const signsms = CryptoJS.MD5(signmh).toString();
        const listSms = apiHelper.getValueFromObject(bodyParams, 'list_sms');
        const objContent = [];
        if (listSms && listSms.length > 0) {
            for (let i = 0; i < listSms.length; i++) {
                const item = listSms[i];
                const sms = {};
                sms.PhoneNumber = apiHelper.getValueFromObject(item, 'phone_number');
                sms.Message = apiHelper.getValueFromObject(item, 'message');
                sms.SmsGuid = apiHelper.getValueFromObject(item, 'data_leads_sms_id');
                sms.ContentType = apiHelper.getValueFromObject(item, 'content_type');
                objContent.push(sms);
            }
        }
        const requestArgs = {
            loginName: config.sendSms.loginName,
            brandName: brandName,
            serviceTypeId: serviceType,
            content: JSON.stringify(objContent),
            sign: signsms,
        };
        const url = config.sendSms.url;
        const wsdlOptions = {
            attributesKey: '$attributes',
            overrideRootElement: {
                namespace: '',
                xmlnsAttributes: [{
                    name: 'xmlns',
                    value: 'http://api.abenla.com/',
                }],
            },
        };
        const resultService = await callSoap(url, wsdlOptions, requestArgs, 'SendSms2');
        return new ServiceResponse(true, '', {
            'data': resultService.SendSms2Result,
        });

    } catch (error) {
        return new ServiceResponse(false, '', '');
    }
};
const callSoap = async (url, wsdlOptions, requestArgs, functionName) => {
    try {
        return new Promise((resolve, reject) => {
            const soap = require('soap');
            soap.createClient(url, wsdlOptions, (err, client) => {
                if (err) {
                    return resolve(null);
                }
                else {
                    const method = client[functionName];
                    method(requestArgs, (err, result, envelope, soapHeader) => {
                        //response envelope string XMl
                        //console.log(soapHeader);
                        if (err) {
                            return resolve(null);
                        }
                        return resolve(result);
                    });
                }
            });
        });
    } catch (error) {
        return null;
    }
};

module.exports = {
    checkConnection,
    getBrandName,
    getServiceTypeList,
    sendSms,
};

