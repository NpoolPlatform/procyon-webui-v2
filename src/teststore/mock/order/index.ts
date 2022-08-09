import { defineStore } from 'pinia'
import { doActionWithError, InvalidID, remain } from 'npool-cli-v2'
import {
  LocalOrder, GetOrderRequest, GetOrderResponse, CreateOrderRequest, CreateOrderResponse, UpdateOrderRequest, UpdateOrderResponse, GetSingleOrderRequest, GetSingleOrderResponse
} from './types'
import { API, OrderTimeoutSeconds, PaymentState } from './const'

export const useLocalOrderStore = defineStore('localorder', {
  state: () => ({
    Orders: [] as Array<LocalOrder>,
    CurrentOrder: {} as LocalOrder,
    Total: 0
  }),
  getters: {
    getOrderByID () {
      return (id:string) => {
        return this.Orders.find((order) => order.ID === id)
      }
    },
    getOrderState () {
      return (order: LocalOrder) => {
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
    orderPaid (): (order: LocalOrder) => boolean {
      return (order: LocalOrder) => {
        return order.State === PaymentState.PAID
      }
    },
    validateOrder () {
      return (order: LocalOrder) => {
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
    getOrders (req: GetOrderRequest, done: (error: boolean) => void) {
      doActionWithError<GetOrderRequest, GetOrderResponse>(
        API.GET_ORDERS,
        req,
        req.Message,
        (resp: GetOrderResponse): void => {
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
    getOrder (req: GetSingleOrderRequest, done: (error: boolean) => void) {
      doActionWithError<GetSingleOrderRequest, GetSingleOrderResponse>(
        API.GET_ORDER,
        req,
        req.Message,
        (resp: GetSingleOrderResponse): void => {
          let existItem = this.Orders.find((el) => el.ID === resp.Info.ID)
          if (!existItem) {
            this.Orders.push(resp.Info)
          } else {
            existItem = { ...resp.Info }
          }
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
