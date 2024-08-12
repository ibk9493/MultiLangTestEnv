// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import { OrderService } from './services/orderService';

const app = express();
const orderService = new OrderService();

app.use(express.json());

app.post('/orders', (req: Request, res: Response) => {
  const newOrder = orderService.addOrder(req.body);
  res.status(201).json(newOrder);
});

app.put('/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedOrder = orderService.updateOrderStatus(Number(id), status);
  if (updatedOrder) {
    res.json(updatedOrder);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});