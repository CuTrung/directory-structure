require("dotenv").config();
const Joi = require("joi");
const { convertEnvToArray } = require("../common/utils/array.util");

const rules = {
  NODE_ENV: ["develop*", "staging", "production", "testing"],
  APP_URL: [],
  DOMAIN_CDN: [],
  DOMAIN_SERVICE: [],
};

const addRules = () => {
  const envsRule = Object.keys(rules);
  const result = {};
  for (const envVar of envsRule) {
    let valueValid = rules[envVar];
    if (typeof valueValid !== "string" && valueValid.length === 0) {
      result[envVar] = Joi.string().required();
      continue;
    }
    let defaultValueIndex = 0;
    valueValid =
      valueValid instanceof Array
        ? valueValid.map((item, index) => {
            if (item.includes("*")) {
              defaultValueIndex = index;
              return item.replace("*", "");
            }
            return item.toString();
          })
        : [valueValid.toString()];

    result[envVar] = Joi.string()
      .valid(valueValid)
      .default(valueValid[defaultValueIndex]);
  }
  return result;
};

const initValidate = () => {
  const listEnv = {};
  for (let [key, value] of Object.entries(process.env)) {
    if (key[0] !== "_") continue;
    key = key.slice(1);
    listEnv[key] = value;
  }
  const { error, value } = Joi.validate(
    listEnv,
    Joi.object(addRules()).unknown().required(),
  );
  return { error, value };
};

module.exports = function initConfigEnvs() {
  const { error, value } = initValidate();
  if (error) throw new Error(`Config validation error: ${error.message}`);
  Object.assign(global, {
    ...value,
    APP_DIR_ROOT: __dirname.replace("config", ""),
    WHITE_LIST: convertEnvToArray(value.WHITE_LIST),
  });
};
