const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    'total_amount': '{{#? TOTALAMOUNT}}',
    'max_id': '{{#? MAXID}}',
    'receiveslip_id': '{{#? RECEIVESLIPID}}',
    'receiveslip_code': '{{#? RECEIVESLIPCODE}}',
    'receive_type_id': '{{#? RECEIVETYPEID}}',
    'receive_type_name': '{{#? RECEIVETYPENAME}}',
    'cashier_name': '{{#? CASHIERNAME}}',
    'cashier_id': '{{#? CASHIERID}}',
    'customer_name': '{{#? CUSTOMERNAME}}',
    'order_no': '{{#? ORDERNO}}',
    'total_money': '{{TOTALMONEY}}',
    'user_id': '{{USERID}}',
    'user_name': '{{USERNAME}}',
    'fullname': '{{FULLNAME}}',
    'notes': '{{NOTES}}',
    'descriptions': '{{DESCRIPTIONS}}',
    'payment_date': '{{PAYMENTDATE}}',

    'is_active': '{{#? ISACTIVE ? 1 : 0}}',

    'order_id': '{{#? ORDERID}}',
    'order_no': '{{#? ORDERNO}}',
    'customer_name': '{{#? CUSTOMERNAME}}',
    'created_date': '{{#? CREATEDDATE}}',
    'total_amount': '{{#? TOTALAMOUNT}}',
    'order_total_money': '{{#? ORDERTOTALMONEY}}',
    'sum_total_money': '{{#? SUMTOTALMONEY}}',
    'sum_paid': '{{#? SUMPAID}}',
    'debt_collection': '{{#? DEBTCOLLECTION}}',

    'image_receipt_id': '{{#? IMAGERECEIPTID}}',
    // 'picture_url':`${config.domain_cdn}{{PICTUREURL}}`,
    'created_user': '{{#? CREATEDUSER}}',
    'created_date': '{{#? CREATEDDATE}}',
    'receiveslip_id': '{{#? RECEIVESLIPID}}',
    'phone_number': '{{#? PHONENUMBER}}',
    'total_money_text': '{{#? TOTALMONEYTEXT}}',
    'full_name': '{{#? FULLNAME}}',
    'company_name': '{{#? COMPANYNAME}}',
    'address_full': '{{#? ADDRESSFULL}}',
    'customer_code': '{{#? CUSTOMERCODE}}',
    'orders': '{{#? ORDERS}}',
    'debit_date': '{{#? DEBITDATE}}',
    'debit_detail_id': '{{#? DEBITDETAILID}}',

    'company_id': '{{#? COMPANYID}}',
    'company_name': '{{#? COMPANYNAME}}',
    'business_id': '{{#? BUSINESSID}}',
    'business_name': '{{#? BUSINESSNAME}}',

    'payment_type': '{{#? PAYMENTTYPE}}',

    'picture_url': [
        {
            "{{#if IMAGEURL}}": `${config.domain_cdn}{{IMAGEURL}}`,
        },
        {
            "{{#else}}": null,
        },
    ],
    'picture_alias': '{{#? IMAGEALIAS}}',
    'receiveslip_image_id': '{{#? RECEIVESLIPIMAGEID}}',

    'payment_status' : '{{PAYMENTSTATUS ? 1 : 0}}',
    'bank_account_id' : '{{#? BANKACCOUNTID}}',
  
    'payment_status_name': '{{#? PAYMENTSTATUSNAME}}',
    'payment_type_name': '{{#? PAYMENTTYPENAME}}',
  
    'is_review' : '{{ISREVIEW ? ISREVIEW : 0}}',
  
    'receiver_type': '{{#? RECEIVERTYPE}}',
    'receiver': '{{#? RECEIVER}}',
    'receiver_id': '{{#? RECEIVERID}}',
    'receiver_name': '{{#? RECEIVERNAME}}',

    'payer_id': '{{#? PAYERID}}',
    'payer_name': '{{#? PAYERNAME}}',
};

let transform = new Transform(template);

const detail = (user) => {
    return transform.transform(user, [
        'total_amount', 'receiveslip_id', 'receiveslip_code', 'receive_type_id', 'receive_type_name', 'user_id', 'fullname',
        'notes', 'descriptions', 'payment_date', 'total_money', 'is_active', 'user_name',
        'order_total_money', 'company_id', 'business_id', 'payment_type', 'cashier_id',
        'bank_account_id',
        'payment_status',
        'is_review',
        'company_name',
        'business_name',
        'payment_status_name',
        'payment_type_name',
        'receiver_type',
        'receiver_id',
        'receiver_name',
        'payer_id',
        'payer_name'
    ]);
};

const detailPictures = (user) => {
    return transform.transform(user, [
        'image_receipt_id', 'picture_url', 'created_user', 'created_date', 'receiveslip_id',
    ]);
};

const detailDebitOrder = (user) => {
    return transform.transform(user, [
        'receiveslip_id', 'order_no', 'customer_name', 'total_amount', 'sum_paid', 'debt_collection', 'order_id'
    ]);
};

const list = (receiveslips = []) => {
    return transform.transform(receiveslips, [
        'receiveslip_id', 'receiveslip_code', 'receive_type_id', 'receive_type_name', 'is_active',
        'cashier_name', 'total_money', 'order_no', 'customer_name', 'payment_date', 'orders', 'company_name', 'business_name',
        'payment_status_name',
        'payment_type_name',
        'is_review', 'receiver'
    ]);
};

const listOrder = (orders = [], isDetail = false) => {
    if (isDetail) return transform.transform(orders, [
        'order_id', 'order_no', 'total_amount', 'customer_name', 'debt_collection'
    ]);
    return transform.transform(orders, [
        'order_id', 'order_no', 'created_date', 'total_amount', 'customer_name', 'customer_code', 'debit_date', 'debit_detail_id'
    ]);
};



const maxId = (code = []) => {
    return transform.transform(code, [
        'max_id'
    ]);
};

const genReceiveSlipCode = (code = []) => {
    return transform.transform(code, [
        'receiveslip_code',
    ]);
};


const detailToPrint = (receiveslips = []) => {
    return transform.transform(receiveslips, [
        'full_name', 'company_name', 'receiveslip_code', 'total_money', 'address_full',
        'total_money_text', 'payment_date', 'total_money', 'phone_number', 'descriptions'
    ]);
};


const receiveslipPrint = (order) => {
    const transform = new Transform({
        'customer_name': '{{#? FULLNAME}}',
        'customer_address': '{{#? ADDRESSFULL}}',
        'total_money': '{{#? TOTALMONEY}}',
        'total_money_text': '{{#? TOTALMONEYTEXT}}',
        'print_date': '{{#? PRINTDATE}}',
        'note': '{{#? DESCRIPTIONS}}',
        'receiveslip_no': '{{#? RECEIVESLIPCODE}}',
        'company_name': '{{#? COMPANYNAME}}',
        'company_address': '{{#? COMPANYADDRESS}}',
    })
    return transform.transform(order, [
        'customer_name',
        'customer_address',
        'total_money_text',
        'total_money',
        'print_date',
        'note',
        'receiveslip_no',
        'company_name',
        'company_address'
    ]);
}

const statistic = (data) => {
    const transform = new Transform({
        'total_money': '{{#? TOTALMONEY}}',
        'total_money_in_month': '{{#? TOTALMONEYINMONTH}}',
        'total_order': '{{#? TOTALORDER}}',
        'total_money_cash': '{{#? TOTALMONEYCASH}}',
        'total_money_transfer': '{{#? TOTALMONEYTRANSFER}}',
    })
    return transform.transform(data, [
        'total_money_in_month',
        'total_money',
        'total_order',
        'total_money_cash',
        'total_money_transfer'
    ]);
}

const pictures = (_pictures) => {
    return transform.transform(_pictures, [
        'receiveslip_image_id', 'picture_url', 'picture_alias', 'receiveslip_id'
    ]);
};


const receiveType = (_d) => {
    const transform = new Transform({
        'id': '{{#? ID}}',
        'value': '{{#? ID}}',
        'name': '{{#? NAME}}',
        'label': '{{#? NAME}}',
        'is_auto_review': '{{ ISAUTOREVIEW ? 1 : 0}}'
    })
    return transform.transform(_d, [
        'id', 'name', 'value', 'label', 'is_auto_review'
    ]);
};

const reviewList = (offworkType = []) => {
    const template = {
        'review_date': '{{#? REVIEWEDDATE}}',
        'review_note': '{{#? REVIEWNOTE}}',
        'is_auto_review': '{{ISAUTOREVIEW ? 1 : 0}}',
        'is_review': '{{ISREVIEW ? ISREVIEW : 0}}',
        'review_user_full_name': '{{#? REVIEWUSERFULLNAME}}',
        'review_user': '{{#? REVIEWUSER}}',
        'default_picture_url': `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
        'review_level_name': '{{#? REVIEWLEVELNAME}}',
        'review_level_id': '{{#? REVIEWLEVELID}}',
        'review_list_id': '{{#? REVIEWLISTID}}'
    }
    let transform = new Transform(template);
    return transform.transform(offworkType, [
        'review_date', 'note', 'is_auto_review', 'is_review', 'review_user_full_name', 'review_user',
        'default_picture_url', 'review_level_name', 'review_level_id', 'review_list_id', 'review_note'
    ]);
};

const reviewUsers = (users = []) => {
    const template = {
        'user_id': '{{#? USERID}}',
        'username': '{{#? USERNAME}}',
        'user_name': '{{#? USERNAME}}',
        'full_name': '{{#? FULLNAME}}',
        'review_level_id': '{{#? REVIEWLEVELID}}'
    }
    let transform = new Transform(template);
    return transform.transform(users, [
        'user_id', 'full_name', 'username', 'user_name', 'is_review', 'review_level_id'
    ]);
};

const receiverOptions = (options = []) => {
    const template = {
        'id': '{{#? ID}}',
        'name': '{{#? NAME}}',
        'phone_number': '{{#? PHONENUMBER}}',
        'type': '{{#? TYPE}}'
    }
    let transform = new Transform(template);
    return transform.transform(options, [
        'id', 'name', 'phone_number', 'type'
    ]);
};

const files = (_files) => {
    const transform = new Transform({
        'file_id': '{{#? FILEID}}',
        'file_module_id': '{{#? FILEMODULEID}}',
        'file_url': [
            {
                "{{#if FILEURL}}": `${config.domain_cdn}{{FILEURL}}`,
            },
            {
                "{{#else}}": null,
            },
        ],
        'file_url': '{{#? FILEURL}}',
        'file_ext': '{{#? FILEEXT}}',
        'file_mime': '{{#? FILEMIME}}',
        'is_delete': '{{ ISDELETE ? 1 : 0}}',
        'file_name': '{{#? FILENAME}}',
    })
    return transform.transform(_files, [
        'file_id', 'file_module_id', 'file_url', 'file_url', 'file_ext', 'file_mime', 'is_delete', 'file_name'
    ]);
};

module.exports = {
    detail,
    list,
    maxId,
    listOrder,
    detailDebitOrder,
    detailPictures,
    genReceiveSlipCode,
    detailToPrint,
    receiveslipPrint,
    statistic,
    pictures,
    files,
    receiveType,
    reviewList,
    reviewUsers,
    receiverOptions,
};