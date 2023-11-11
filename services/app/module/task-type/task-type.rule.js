const Joi = require('joi');

const ruleCreate = {
  task_type_id: Joi.number().integer().min(1).allow(null),
  type_name: Joi.string().max(250).required(),
  description: Joi.string().max(2000).required(),
  add_function_id: Joi.string().max(400).allow(null),
  edit_function_id: Joi.string().max(400).allow(null),
  edit_all_function_id: Joi.string().max(400).allow(null),
  delete_function_id: Joi.string().max(400).allow(null),
  delete_all_function_id: Joi.string().max(400).allow(null),
  is_birthday: Joi.number().valid(0, 1).allow(null),
  is_wedding_anniversary: Joi.number().valid(0, 1).allow(null),
  is_time_not_buying: Joi.number().valid(0, 1).allow(null),
  value_time_not_buying: Joi.number().integer().allow(null),
  is_final_buy: Joi.number().valid(0, 1).allow(null),
  time_final_buy_from: Joi.string().allow(null),
  is_filter_daily: Joi.number().valid(0, 1).allow(null),
  is_filter_monthly: Joi.number().valid(0, 1).allow(null),
  time_value: Joi.string().allow(null),
  date_value: Joi.number().integer().allow(null),
  receiver_id: Joi.number().integer().allow(null),
  is_birthday_relatives: Joi.number().valid(0, 1).allow(null),
  is_number_of_buying: Joi.number().integer().allow(null),
  value_number_of_buying_from: Joi.number().integer().allow(null),
  type_time_not_buying: Joi.number().integer().allow(null),
  is_after_the_last_care: Joi.number().valid(0, 1).allow(null),
  value_after_the_last_care: Joi.number().integer().allow(null),
  type_after_the_last_care: Joi.number().integer().allow(null),
  is_total_money_spending: Joi.number().valid(0, 1).allow(null),
  value_number_of_buying_to: Joi.number().integer().allow(null),
  value_total_money_spending_from: Joi.number().precision(2).allow(null),
  value_total_money_spending_to: Joi.number().precision(2).allow(null),
  is_total_current_point: Joi.number().valid(0, 1).allow(null),
  value_total_current_point_from: Joi.number().integer().allow(null),
  value_total_current_point_to: Joi.number().integer().allow(null),
  is_after_upgrade: Joi.number().valid(0, 1).allow(null),
  value_date_after_upgrade: Joi.number().integer().allow(null),
  is_current_workflow: Joi.number().valid(0, 1).allow(null),
  task_workflow_id: Joi.number().integer().allow(null),
  is_product_hobbies: Joi.number().valid(0, 1).allow(null),
  is_task_type_auto: Joi.number().valid(0, 1).allow(null),
  time_final_buy_to: Joi.string().allow(null),
  is_equal_divide: Joi.number().valid(0, 1).allow(null),
  is_ratio_divide: Joi.number().valid(0, 1).allow(null),
  is_get_data: Joi.number().valid(0, 1).allow(null),
  is_filter_once: Joi.number().valid(0, 1).allow(null),
  task_wflow_list: Joi.array().items(
    Joi.object({
      task_work_flow_id: Joi.number().required(),
      type_purchase: Joi.number().required(),
      is_complete: Joi.number().required(),
    })
  ).allow(null),
  is_active: Joi.number().valid(0, 1).required(),
};

const createOrUpdateCondition = {
  condition_id: Joi.number().integer().min(1).allow(null),
  condition_name: Joi.string().max(50).required(),
  is_database: Joi.number().valid(0, 1).allow(null),
  is_active: Joi.number().valid(0, 1).required(),
}

const rules = {
    create: {
        body: ruleCreate,
    },
    update: {
        body: ruleCreate,
    },
    createOrUpdateCondition: {
      body: createOrUpdateCondition
    }
};

module.exports = rules;
