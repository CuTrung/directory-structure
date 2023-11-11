const Transform = require('../../common/helpers/transform.helper');

const listToScheduleSendSMS = (data = []) => {
  const _template = {
    pre_order_id: '{{#? PREORDERID }}',
    pre_order_no: '{{#? PREORDERNO }}',
    deposit: '{{#? DEPOSIT }}',
    customer_name: '{{#? CUSTOMERNAME }}',
    phone_number: '{{#? PHONENUMBER }}',
    delivery_type: '{{#? DELIVERYTYPE }}',
    receive_store_id: '{{#? RECEIVESTOREID }}',
    transaction_id: '{{#? TRANSACTIONID }}',
    ip_address: '{{#? IPADDRESS }}',
    product_id: '{{#? PRODUCTID }}',
    quantity: '{{#? QUANTITY }}',
    pre_lot_number_id: '{{#? PRELOTNUMBERID }}',
    order_no: '{{#? ORDERNO }}',
    order_id: '{{#? ORDERID }}',
    total_amount: '{{#? TOTALAMOUNT }}',
    receiving_date: '{{#? RECEIVINGDATE }}',
    send_date: '{{#? SENDDATE }}',
  };
  return new Transform(_template).transform(data, Object.keys(_template));
};

module.exports = {
  listToScheduleSendSMS,
};
