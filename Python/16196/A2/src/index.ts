import express, { Request, Response } from 'express';
import { createUser, isAdmin } from './services/dataService';
import { User } from './models/user';
import logger from './logger';
import loggerMiddleware from './middleware/loggerMiddleware';
const app = express();
app.use(express.json());
app.use(loggerMiddleware);
app.post('/user', (req: Request, res: Response) => {
  const user: User = createUser(req.body);
  res.json(user);
});

app.get('/user/:id', (req: Request, res: Response) => {
  const user: User = {
    id: Number(req.params.id),
    name: 'Sample User',
    email: 'sample@example.com',
    role: 'user'
  };
  if (isAdmin(user)) {
    res.send('Admin user');
  } else {
    res.send('Regular user');
  }
});

app.get('/', (req, res) => {
  logger.info('This is an info log');
  logger.error('This is an error log');
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
