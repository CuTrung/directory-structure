const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    'created_date': '{{#? CREATEDDATE  }}',
    'created_user': '{{#? CREATEDUSER  }}',
    'department_id': '{{#? DEPARTMENTID  }}',
    'time_can_off_policy_id': '{{#? TIMECANOFFPOLICYID }}',
    'time_can_off_policy_name': '{{#? TIMECANOFFPOLICYNAME  }}',
    'company_name': '{{#? COMPANYNAME  }}',
    'company_id': '{{#? COMPANYID  }}',
    'id': '{{#? ID  }}',
    'name': '{{#? NAME  }}',
    'value': '{{#? VALUE  }}',
    'label': '{{#? LABEL  }}',
    'is_active': '{{ISACTIVE ? 1 : 0 }}',
    'block_id': '{{#? BLOCKID  }}',
    'block_name': '{{#? BLOCKNAME  }}',
    'department_name': '{{#? DEPARTMENTNAME  }}',
    'store_id': '{{#? STOREID  }}',
    'store_name': '{{#? STORENAME  }}',

    'monthly_time_can_off': '{{#? MONTHLYTIMECANOFF  }}',
    'monthly_time_can_off_unit': '{{#? MONTHLYTIMECANOFFUNIT  }}',
    'monthly_time_can_off_cycle': '{{#? MONTHLYTIMECANOFFCYCLE  }}',
    'seniority_time_can_off': '{{#? SENIORITYTIMECANOFF  }}',
    'time_can_off_unit': '{{#? TIMECANOFFUNIT  }}',
    'time_can_off_cycle': '{{#? TIMECANOFFCYCLE  }}',
    'reset_time_can_off_date': '{{#? RESETTIMECANOFFDATE  }}',
    'reset_time_can_off_cycle': '{{#? RESETTIMECANOFFCYCLE  }}',
    'is_system': '{{ISSYSTEM  ? 1 : 0   }}',

};

let transform = new Transform(template);



const list = (offworkmanagement = []) => {
    return transform.transform(offworkmanagement, [
        'time_can_off_policy_id', 'time_can_off_policy_name', 'company_name', 'is_active','monthly_time_can_off',
        'monthly_time_can_off_unit','monthly_time_can_off_cycle','seniority_time_can_off','time_can_off_unit',
        'time_can_off_cycle','reset_time_can_off_date','reset_time_can_off_cycle','is_system','is_active','company_id'
    ]);
};
const block = (blocks = [])=>{
    return transform.transform(blocks, [
        'block_id', 'block_name'
    ]);
}
const department = (departments = [])=>{
    return transform.transform(departments, [
        'department_id', 'department_name'
    ]);
}
const store = (stores = [])=>{
    return transform.transform(stores, [
        'store_id', 'store_name'
    ]);
}

module.exports = {
    list,
    block,
    department,
    store,
};