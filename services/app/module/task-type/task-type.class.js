const Transform = require('../../common/helpers/transform.helper');

const list = (data = []) => {
  const _template = {
    task_type_id: '{{#? TASKTYPEID }}',
    type_name: '{{#? TYPENAME }}',
    is_filter_once: '{{ ISFILTERONCE ? 1: 0 }}',
    is_filter_daily: '{{ ISFILTERDAILY ? 1 : 0 }}',
    is_filter_monthly: '{{ ISFILTERMONTHLY ? 1 : 0 }}',
    time_value: '{{#? TIMEVALUE }}',
    time_value_daily: '{{#? TIMEVALUEDAILY }}',
    time_value_monthly: '{{#? TIMEVALUEMONTHLY }}',
    time_value_once: '{{#? TIMEVALUEONCE }}',
    date_value: '{{#? DATEVALUE }}',
    description: '{{#? DESCRIPTION }}',
    created_date: '{{#? CREATEDDATEVIEW }}',
    is_active: '{{ ISACTIVE? 1: 0 }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listTaskType = (data = []) => {
  const _template = {
    task_work_follow_id: '{{#? task_work_follow_id }}',
    task_work_follow_name: '{{#? task_work_follow_name }}',
    is_active: '{{#? is_active }}',
    order_index: '{{#? order_index }}',
    is_complete: '{{#? is_complete }}',
    create_date: '{{#? create_date }}',
    description: '{{#? description }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listTaskWorkflow = (data = []) => {
  const _template = {
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    work_flow_name: '{{#? WORKFLOWNAME}}',
    description: '{{#? DESCRIPTION}}',
    order_index: '{{ ORDERINDEX}}',
    type_purchase: '{{ TYPEPURCHASE ? 1 : 0 }}',
    is_complete: '{{ ISCOMPLETE ? 1 : 0 }}',
    is_active: '{{ ISACTIVE ? 1 : 0 }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listCondition = (data = []) => {
  const _template = {
    condition_id: '{{#? CONDITIONID}}',
    condition_name: '{{#? CONDITIONNAME}}',
    is_database: '{{ ISDATABASE ? 1 : 0 }}',
    task_work_flow_id: '{{#? TASKWORKFLOWID}}',
    condition_value_list: '{{#? CONDITIONVALUELIST.split("|")}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listUser = (data = []) => {
  const _template = {
    task_type_id: '{{#? TASKTYPEID}}',
    user_name: '{{#? USERNAME }}',
    value_ratio: '{{#? VALUERATIO }}',
    full_name: '{{#? FULLNAME}}',
    department_id: '{{#? DEPARTMENTID}}',
    department_name: '{{#? DEPARTMENTNAME}}',
    position_name: '{{#? POSITIONNAME}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const listModel = (data = []) => {
  const _template = {
    task_type_id: '{{#? TASKTYPEID}}',
    model_id: '{{#? MODELID}}',
    id: '{{#? MODELID}}',
    value: '{{#? MODELID}}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getById = (data = {}) => {
  const _template = {
    task_type_id: '{{#? TASKTYPEID }}',
    type_name: '{{#? TYPENAME }}',
    description: '{{#? DESCRIPTION }}',
    add_function_id: '{{#? ADDFUNCTIONID }}',
    edit_function_id: '{{#? EDITFUNCTIONID }}',
    edit_all_function_id: '{{#? EDITALLFUNCTIONID }}',
    delete_function_id: '{{#? DELETEFUNCTIONID }}',
    delete_all_function_id: '{{#? DELETEALLFUNCTIONID }}',
    is_birthday: '{{ ISBIRTHDAY ? 1 : 0 }}',
    is_wedding_anniversary: '{{ ISWEDDINGANNIVERSARY ? 1 : 0 }}',
    is_time_not_buying: '{{ ISTIMENOTBUYING ? 1 : 0 }}',
    value_time_not_buying: '{{#? VALUETIMENOTBUYING }}',
    is_final_buy: '{{ ISFINALBUY ? 1 : 0 }}',
    time_final_buy_from: '{{#? TIMEFINALBUYFROM }}',
    is_filter_daily: '{{ ISFILTERDAILY ? 1 : 0 }}',
    is_filter_monthly: '{{ ISFILTERMONTHLY ? 1 : 0 }}',
    time_value: '{{#? TIMEVALUE }}',
    time_value_daily: '{{#? TIMEVALUEDAILY }}',
    time_value_monthly: '{{#? TIMEVALUEMONTHLY }}',
    date_value: '{{#? DATEVALUE }}',
    receiver_id: '{{#? RECEIVERID }}',
    is_birthday_relatives: '{{ ISBIRTHDAYRELATIVES ? 1 : 0 }}',
    is_number_of_buying: '{{ ISNUMBEROFBUYING ? 1 : 0 }}',
    value_number_of_buying_from: '{{#? VALUENUMBEROFBUYINGFROM }}',
    type_time_not_buying: '{{#? TYPETIMENOTBUYING }}',
    is_after_the_last_care: '{{ ISAFTERTHELASTCARE ? 1 : 0 }}',
    value_after_the_last_care: '{{#? VALUEAFTERTHELASTCARE }}',
    type_after_the_last_care: '{{#? TYPEAFTERTHELASTCARE }}',
    is_total_money_spending: '{{ ISTOTALMONEYSPENDING ? 1 : 0 }}',
    value_number_of_buying_to: '{{#? VALUENUMBEROFBUYINGTO }}',
    value_total_money_spending_from: '{{#? VALUETOTALMONEYSPENDINGFROM }}',
    value_total_money_spending_to: '{{#? VALUETOTALMONEYSPENDINGTO }}',
    is_total_current_point: '{{ ISTOTALCURRENTPOINT ? 1 : 0 }}',
    value_total_current_point_from: '{{#? VALUETOTALCURRENTPOINTFROM }}',
    value_total_current_point_to: '{{#? VALUETOTALCURRENTPOINTTO }}',
    is_after_upgrade: '{{ ISAFTERUPGRADE ? 1 : 0 }}',
    value_date_after_upgrade: '{{#? VALUEDATEAFTERUPGRADE }}',
    is_current_workflow: '{{ ISCURRENTWORKFLOW ? 1 : 0 }}',
    task_workflow_id: '{{#? TASKWORKFLOWID }}',
    is_product_hobbies: '{{ ISPRODUCTHOBBIES ? 1 : 0 }}',
    model_id: '{{#? MODELID }}',
    is_task_type_auto: '{{ ISTASKTYPEAUTO ? 1 : 0 }}',
    time_final_buy_to: '{{#? TIMEFINALBUYTO }}',
    is_equal_divide: '{{ ISEQUALDIVIDE ? 1 : 0 }}',
    is_ratio_divide: '{{ ISRATIODIVIDE ? 1 : 0 }}',
    is_get_data: '{{ ISGETDATA ? 1 : 0 }}',
    is_divide: '{{#? ISDIVDIDE }}',
    is_filter_once: '{{ ISFILTERONCE ? 1: 0 }}',

    is_active: '{{ ISACTIVE ? 1 : 0 }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const getListCondition = (data = []) => {
  const _template = {
    condition_id: '{{#? CONDITIONID }}',
    condition_name: '{{#? CONDITIONNAME }}',
    is_database: '{{ ISDATABASE ? 1 : 0 }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

const TASK_TEMPLATE = {
  task_id: '{{#? TASKID}}',
  task_name: '{{#? TASKNAME}}',
  task_type_id: '{{#? TASKTYPEID}}',
  parent_id: '{{#? PARENTID}}',
  start_date: '{{#? STARTDATE}}',
  end_date: '{{#? ENDDATE}}',
  description: '{{#? DESCRIPTION}}',

  company_id: '{{#? COMPANYID}}',
  department_id: '{{#? DEPARTMENTID}}',
  store_id: '{{#? STOREID}}',
  supervisor_user: '{{#? SUPERVISORNAME}}',
  supervisor_name: '{{#? SUPERVISORNAMETEXT}}',
  staff_user: '{{#? USERNAME}}',
  staff_name: '{{#? USERNAMETEXT}}',

  is_complete: '{{ISCOMPLETED ? 1 : 0}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  is_system: '{{ISSYSTEM ? 1 : 0}}',

  company_name: '{{#? COMPANYNAME}}',
  task_type_name: '{{#? TASKTYPENAME}}',
  working_form_name: '{{#? WORKINGFORMNAME}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',

  member_id: '{{#? MEMBERID}}',
  data_leads_id: '{{#? DATALEADSID}}',
  customer_code: '{{#? CUSTOMERCODE}}',
  full_name: '{{#? FULLNAME}}',
  gender: '{{GENDER ? 1 : 0}}',
  birthday: '{{#? BIRTHDAY}}',
  hobbies: '{{#? HOBBIES}}',
  phone_number: '{{#? PHONENUMBER}}',
  email: '{{#? EMAIL}}',
  customer_id: '{{#? CUSTOMERID}}',
  customer_name: '{{#? CUSTOMERNAME}}',
  total_customer: '{{#? TOTALCUSTOMER}}',
  total_customer_complete: '{{#? TOTALCUSTOMERCOMPLETE}}',
  customer_type_name: '{{#? CUSTOMERTYPENAME}}',
  address: '{{#? ADDRESS}}',
  type_purchase: '{{#? TYPE_PURCHASE}}',
  total_task: '{{#? TOTATLTASK}}',
  total_task_complete: '{{#? TOTATLTASKCOMPLETE}}',

  task_detail_id: '{{#? TASKDETAILID}}',

  task_detail_id: '{{#? TASKDETAILID}}',

  workflow_id: '{{#? TASKWORKFLOWID}}',
  workflow_name: '{{#? WORKFLOWNAME}}',

  comment_id: '{{#? COMMENTID}}',
  comment_content: '{{#? COMMENTCONTENT}}',

  product_id: '{{#? PRODUCTID}}',
  product_name: '{{#? PRODUCTNAME}}',
  task_workflow_name: '{{#? TASKWORKFLOWNAME}}',
  task_workflow_old_name: '{{#? TASKWORKFLOWOLDNAME}}',
  content_sms: '{{#? CONTENTSMS}}',
  call_type: '{{#? CALLTYPE}}',
  subject: '{{#? SUBJECT}}',
  event_start_date_time: '{{#? EVENTSTARTDATETIME}}',
  event_end_date_time: '{{#? EVENTENDDATETIME}}',
  duration: '{{#? DURATION}}',
  content_meeting: '{{#? CONTENTMEETING}}',
  location: '{{#? LOCATION}}',
  campaign_name: '{{#? CAMPAIGNNAME}}',
  list_name: '{{#? LISTNAME}}',
  sender_name: '{{#? SENDERNAME}}',
  sender_email: '{{#? SENDEREMAIL}}',
  status: '{{#? STATUS}}',
  content_sms: '{{#? CONTENTSMS}}',
};

const taskDetail = (data = {}) => {
  return new Transform(TASK_TEMPLATE).transform(data, [
    'task_id',
    'task_name',
    'task_type_id',
    'parent_id',
    'start_date',
    'end_date',
    'description',

    'company_id',
    'department_id',
    'store_id',
    'supervisor_user',
    'supervisor_name',
    'staff_user',
    'staff_name',

    'is_active',
    'is_system',
  ]);
};

const workflowList = (list = []) => {
  return new Transform(TASK_TEMPLATE).transform(list, ['workflow_id', 'workflow_name']);
};

const listSendEmail = (data = []) => {
  const _template = {
    task_detail_id: '{{#? TASKDETAILID}}',
    member_id: '{{#? MEMBERID}}',
    data_leads_id: '{{#? DATALEADSID}}',
    task_workflow_id: '{{#? TASKWORKFLOWID}}',
    task_workflow_date: '{{#? TASKWFLOWDATE}}',
    task_type_id: '{{#? TASKTYPEID}}',
    task_type_wflow_email_id: '{{#? TASKTYPEWFLOWEMAILID}}',
    type_name: '{{#? TYPENAME}}',
    mail_supplier_id: '{{#? MAILSUPPLIERID}}',
    mail_from: '{{#? MAILFROM}}',
    mail_subject: '{{#? MAILSUBJECT}}',
    mail_from_name: '{{#? MAILFROMNAME}}',
    mail_reply: '{{#? MAILREPLY}}',
    email_template_id: '{{#? EMAILTEMPLATEID}}',
    email_template_html: '{{#? EMAILTEMPLATEHTML}}',
    send_date: '{{#? SENDDATE}}',
  };

  return new Transform(_template).transform(data, Object.keys(_template));
};

const listTemplate = (data = []) => {
  const _template = {
    member_id: '{{#? MEMBERID}}',
    data_leads_id: '{{#? DATALEADSID}}',
    full_name: '{{#? FULLNAME}}',
    birthday: '{{#? BIRTHDAY}}',
    email: '{{#? EMAIL}}',
    phone_number: '{{#? PHONENUMBER}}',
  };

  return new Transform(_template).transform(data, Object.keys(_template));
};

const listSendSMS = (data = []) => {
  const _template = {
    task_detail_id: '{{#? TASKDETAILID}}',
    member_id: '{{#? MEMBERID}}',
    data_leads_id: '{{#? DATALEADSID}}',
    task_workflow_id: '{{#? TASKWORKFLOWID}}',
    task_type_id: '{{#? TASKTYPEID}}',
    task_type_wflow_sms_id: '{{#? TASKTYPEWFLOWSMSID}}',
    type_name: '{{#? TYPENAME}}',
    brand_name: '{{#? BRANDNAME}}',
    sms_template_id: '{{#? SMSTEMPLATEID}}',
    content_sms: '{{#? CONTENTSMS}}',
    send_date: '{{#? SENDDATE}}',
  };

  return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
  // task type
  list,
  listTaskType,
  getById,
  listTaskWorkflow,
  listUser,
  listModel,
  getListCondition,
  listCondition,

  // task
  taskDetail,
  workflowList,
  listSendEmail,
  listSendSMS,
  listTemplate
};
