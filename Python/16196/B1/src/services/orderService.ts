// src/services/orderService.ts
import { Order, OrderStatus } from '../models/Order';

class OrderService {
  private orders: Order[] = [];

  addOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...order,
      id: this.generateOrderId(),
      createdAt: new Date(),
      status: OrderStatus.Pending
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Order | undefined {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
    return order;
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.orders.filter(o => o.status === status);
  }

  private generateOrderId(): number {
    return Math.floor(Math.random() * 1000000);
  }
}