const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
  'is_active': '{{#? ISACTIVE}}',
  'created_user': '{{#? CREATEDUSER}}',
  'created_date': '{{#? CREATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'is_deleted': '{{#? ISDELETED}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'expend_type_id': '{{#? EXPENDTYPEID}}',
  'expend_type_name': '{{#? EXPENDTYPENAME}}',
  'user_id': '{{#? USERID}}',
  'user_name': '{{#? USERNAME}}',
  'first_name': '{{#? FIRSTNAME}}',
  'last_name': '{{#? LASTNAME}}',
  'department_id': '{{#? DEPARTMENTID}}',
  'department_name': '{{#? DEPARTMENTNAME}}',
  'total' : '{{#? TOTAL}}',
  'paymentslip_id' : '{{#? PAYMENTSLIPID}}',
  'paymentslip_code' : '{{#? PAYMENTSLIPCODE}}',
  'expend_type_name' : '{{#? EXPENDTYPENAME}}',
  'total_money' : '{{#? TOTALMONEY}}',
  'payer' : '{{#? PAYER}}',
  'receiver' : '{{#? RECEIVER}}',
  'payment_date' : '{{#? PAYMENTDATE}}',
  'expend_type_id' : '{{#? EXPENDTYPEID}}',
  'description' : '{{#? DESCRIPTIONS}}',
  'payer_id' : '{{#? PAYERID}}',
  'receiver_id' : '{{#? RECEIVERID}}',
  'payer_department_id' : '{{#? PAYERDEPARTMENTID}}',
  'payer_department_name' : '{{#? PAYERDEPARTMENTNAME}}',
  'receiver_department_id' : '{{#? RECEIVERDEPARTMENTID}}',
  'receiver_department_name' : '{{#? RECEIVERDEPARTMENTNAME}}',
  'payer_name' : '{{#? PAYERNAME}}',
  'receiver_name' : '{{#? RECEIVERNAME}}',
  'notes' : '{{#? NOTES}}',
  'image_url' : '{{#? IMAGEURL}}',

  'business_name' : '{{#? BUSINESSNAME}}',
  'company_name' : '{{#? COMPANYNAME}}',

  'business_id' : '{{#? BUSINESSID}}',
  'company_id' : '{{#? COMPANYID}}',
  'payment_type' : '{{#? PAYMENTTYPE}}',
  'payment_status' : '{{PAYMENTSTATUS ? 1 : 0}}',
  'bank_account_id' : '{{#? BANKACCOUNTID}}',

  'payment_status_name': '{{#? PAYMENTSTATUSNAME}}',
  'payment_type_name': '{{#? PAYMENTTYPENAME}}',

  'is_review' : '{{ISREVIEW ? ISREVIEW : 0}}',

  'receiver_type': '{{#? RECEIVERTYPE}}',

};

let transform = new Transform(template);

const list = (users = []) => {
  return transform.transform(users, [
    'is_active', 
    'created_date', 
    'paymentslip_id',
    'paymentslip_code',
    'expend_type_name',
    'total_money',
    'payer',
    'receiver',
    'payment_date',
    'business_name',
    'company_name',
    'payment_status_name',
    'payment_type_name',
    'is_review'
  ]);
};

const detail = (data) => {
  return transform.transform(data, [
    'is_active', 
    'description',
    'paymentslip_id',
    'paymentslip_code',
    'expend_type_name',
    'total_money',
    'payment_date',
    'payer_id',
    'receiver_id',
    'payer_name',
    'receiver_name',
    'notes',
    'expend_type_id',
    'pictures',
    'company_id',
    'business_id',
    'payment_type',
    'bank_account_id',
    'payment_status',
    'is_review',
    'company_name',
    'business_name',
    'payment_status_name',
    'payment_type_name',
    'user_name',
    'receiver_type'
  ]);
};


const getOptionsExpendType = (data = []) => {
  return transform.transform(data, [
    'expend_type_id',
    'expend_type_name',
  ]);
};

const getOptionsPayer = (data = []) => {
  return transform.transform(data, [
    'user_id',
    'user_name',
    'first_name',
    'last_name',
    'department_id',
    'department_name'
  ]);
};

const getCountByDate = (data = []) => {
  return transform.transform(data, [
    'total',
  ]);
};

const getPaymentSlipImage = (data = []) => {
  return transform.transform(data, [
    'image_url',
  ]);
};

const paymentslipPrint = (order) => {
    const transform = new Transform({
        'customer_name': '{{#? FULLNAME}}',
        'customer_address': '{{#? ADDRESSFULL}}',
        'total_money': '{{#? TOTALMONEY}}',
        'total_money_text': '{{#? TOTALMONEYTEXT}}',
        'print_date': '{{#? PRINTDATE}}',
        'note': '{{#? DESCRIPTION}}',
        'paymentslip_no': '{{#? PAYMENTSLIPCODE}}',
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
        'paymentslip_no',
        'company_name',
        'company_address'
    ]);
  }

  const statistic = (data) => {
    const transform = new Transform({
        'total_money': '{{#? TOTALMONEY}}',
        'total_money_in_month': '{{#? TOTALMONEYINMONTH}}',
        'highest_month': '{{#? HIGHESTMONTH}}',
        'total_money_highest_month': '{{#? TOTALMONEYHIGHESTMONTH}}',
        'total_money_cash': '{{#? TOTALMONEYCASH}}',
        'total_money_transfer': '{{#? TOTALMONEYTRANSFER}}',
    })
    return transform.transform(data, [
        'total_money_in_month',
        'total_money',
        'total_money_highest_month',
        'highest_month',
        'total_money_cash',
        'total_money_transfer'
    ]);
}

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

const expendType = (_d) => {
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

module.exports = {
  detail,
  list,
  getOptionsExpendType,
  getOptionsPayer,
  getCountByDate,
  getPaymentSlipImage,
  paymentslipPrint,
  statistic,
  files,
  expendType,
  reviewList,
  reviewUsers,
  receiverOptions,
  
};

