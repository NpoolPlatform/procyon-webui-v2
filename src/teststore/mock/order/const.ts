enum API {
  GET_ORDERS = '/order/v1/get/orders',
  CREATE_ORDERS = '/order/v1/create/order',
  UPDATE_ORDER = '/order/v1/update/order',
  GET_ORDER = '/order/v1/get/order',
}
const OrderTimeoutSeconds = 6 * 60 * 60
enum PaymentState {
  DEFAULT_STATE = 'DefaultState',
  WAIT_PAYMENT = 'WaitPayment',
  PAID = 'Paid',
  PAYMENT_TIMEOUT = 'PaymentTimeout',
  USER_CANCELED = 'UserCanceled',
  CANCELED = 'Canceled',
  IN_SERVICE = 'inService',
  EXPIRED = 'Expired',
}
export { API, OrderTimeoutSeconds, PaymentState }
