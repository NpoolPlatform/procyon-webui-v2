import { defineStore } from 'pinia'
import {
  doActionWithError,
  InvalidID,
  remain
} from 'npool-cli-v2'
import {
  Order,
  GetOrderRequest,
  GetOrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse
} from './types'
import { API, OrderTimeoutSeconds, PaymentState } from './const'

export const useLocalOrderStore = defineStore('localorder', {
  state: () => ({
    Orders: [] as Array<Order>,
    CurrentOrder: {} as Order,
    Total: 0
  }),
  getters: {
    getOrderByID () {
      return (id:string) => {
        return this.Orders.find((order) => order.ID === id)
      }
    },
    getOrderState () {
      return (order: Order) => {
        if (!order) {
          return 'MSG_ERROR'
        }
        const now = new Date().getTime() / 1000
        if (order.ID === InvalidID) {
          return 'MSG_INVALID_PAYMENT'
        }
        if (order.State === PaymentState.PAYMENT_TIMEOUT) {
          return 'MSG_CANCELED_BY_TIMEOUT'
        }
        if (order.State === PaymentState.WAIT_PAYMENT && now < order.CreatedAt + OrderTimeoutSeconds) {
          return remain(order.CreatedAt + OrderTimeoutSeconds)
        }
        if (order.State === PaymentState.EXPIRED) {
          return 'MSG_PAYMENT_FAIL'
        }
        if (order.State === PaymentState.CANCELED) {
          return 'MSG_PAYMENT_CANCELED'
        }
        if (order.State === PaymentState.PAID) {
          return 'MSG_WAIT_FOR_START'
        }
        if (order.End < now) {
          return 'MSG_DONE'
        }
        return 'MSG_IN_SERVICE'
      }
    },
    orderPaid (): (order: Order) => boolean {
      return (order: Order) => {
        return order.State === PaymentState.PAID
      }
    },
    validateOrder () {
      return (order: Order) => {
        if (!order) {
          return false
        }
        const now = new Date().getTime() / 1000
        if (!order.PaidAt) {
          return false
        }
        if (order.State === PaymentState.PAYMENT_TIMEOUT) {
          return false
        }
        if (order.State === PaymentState.PAID && now < order.CreatedAt + OrderTimeoutSeconds) {
          return true
        }
        if (order.State === PaymentState.EXPIRED) {
          return false
        }
        return true
      }
    }
  },
  actions: {
    getOrders (req: GetOrdersRequest, done: (error: boolean) => void) {
      doActionWithError<GetOrdersRequest, GetOrdersResponse>(
        API.GET_ORDERS,
        req,
        req.Message,
        (resp: GetOrdersResponse): void => {
          this.Orders.push(...resp.Infos)
          this.Total = resp.Total
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    createOrder (req: CreateOrderRequest, handler: (orderID: string, paymentID: string, error: boolean) => void) {
      doActionWithError<CreateOrderRequest, CreateOrderResponse>(
        API.CREATE_ORDERS,
        req,
        req.Message,
        (resp: CreateOrderResponse): void => {
          this.CurrentOrder = resp.Info
          handler(resp.Info.ID, resp.Info.PaymentID, false)
        },
        () => {
          handler('', '', true)
        }
      )
    },
    updateOrder (req: UpdateOrderRequest, done: (error: boolean) => void) {
      doActionWithError<UpdateOrderRequest, UpdateOrderResponse>(
        API.UPDATE_ORDER,
        req,
        req.Message,
        (resp: UpdateOrderResponse): void => {
          console.log(resp.Info)
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    getOrder (req: GetOrderRequest, done: (error: boolean) => void) {
      doActionWithError<GetOrderRequest, GetOrderResponse>(
        API.GET_ORDER,
        req,
        req.Message,
        (resp: GetOrderResponse): void => {
          const index = this.Orders.findIndex((el) => el.ID === resp.Info.ID)
          this.Orders.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false)
        },
        () => {
          done(true)
        }
      )
    }
  }

})

export * from './types'
