
  // src/models/Order.ts
  interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
  }
  
  interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
  }
  
  enum OrderStatus {
    Pending = 'pending',
    Processing = 'processing',
    Shipped = 'shipped',
    Delivered = 'delivered'
  }