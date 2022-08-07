import { defineStore } from 'pinia'
import { doActionWithError } from 'npool-cli-v2'
import {
  LocalOrder, GetOrderRequest, GetOrderResponse, CreateOrderRequest, CreateOrderResponse
} from './types'
import { API } from './const'

export const useLocalOrderStore = defineStore('localorder', {
  state: () => ({
    Orders: [] as Array<LocalOrder>,
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
        if (!order.PaidAt) {
          return 'MSG_INVALID_PAYMENT'
        }
        // if (order.PaidAt && order.State === PaymentState.TIMEOUT as string) {
        //   return 'MSG_CANCELED_BY_TIMEOUT'
        // }
        // if (order.PaidAt && order.State === PaymentState.WAIT && now < order.CreatedAt + OrderTimeoutSeconds) {
        //   return remain(order.CreatedAt + OrderTimeoutSeconds)
        // }
        // if (order.PaidAt && order.State === PaymentState.FAIL) {
        //   return 'MSG_PAYMENT_FAIL'
        // }
        // if (order.PaidAt && order.State === PaymentState.CANCELED) {
        //   return 'MSG_PAYMENT_CANCELED'
        // }
        if (now < order.Start) {
          return 'MSG_WAIT_FOR_START'
        }
        if (order.End < now) {
          return 'MSG_DONE'
        }
        return 'MSG_IN_SERVICE'
      }
    },
    validateOrder () {
      return (order: LocalOrder) => {
        if (!order) {
          return false
        }
        // const now = new Date().getTime() / 1000
        if (!order.PaidAt) {
          return false
        }
        // if (order.PaidAt && order.State === PaymentState.TIMEOUT) {
        //   return false
        // }
        // if (order.PaidAt && order.State === PaymentState.WAIT && now < order.CreatedAt + OrderTimeoutSeconds) {
        //   return true
        // }
        // if (order.PaidAt && order.State === PaymentState.FAIL) {
        //   return false
        // }
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
          this.Orders = resp.Infos
          this.Total = resp.Total
          done(false)
        },
        () => {
          done(true)
        }
      )
    },
    addOrder (req: CreateOrderRequest, done: (error: boolean) => void) {
      doActionWithError<CreateOrderRequest, CreateOrderResponse>(
        API.GET_ORDERS,
        req,
        req.Message,
        (resp: CreateOrderResponse): void => {
          // this.Orders = resp.Infos
          // this.Total = resp.Total
          console.log(resp.Infos)
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
