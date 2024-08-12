import express, { Request, Response } from 'express';
import { createUser, isAdmin } from './services/dataService';
import { User } from './models/user';

const app = express();
app.use(express.json());

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
