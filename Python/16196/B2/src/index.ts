import express from 'express';
import expressWinston from 'express-winston';
import logger from './utils/logger';
import { createUser, isAdmin } from './services/dataService';
import { User } from './models/user';

const app = express();

// Middleware to log HTTP requests
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: true,
}));

app.use(express.json());

app.post('/user', (req: express.Request, res: express.Response) => {
  const user: User = createUser(req.body);
  logger.info(`User created: ${JSON.stringify(user)}`);
  res.json(user);
});

app.get('/user/:id', (req: express.Request, res: express.Response) => {
  const user: User = {
    id: Number(req.params.id),
    name: 'Sample User',
    email: 'sample@example.com',
    role: 'user'
  };
  if (isAdmin(user)) {
    logger.info(`Admin user accessed: ${user.id}`);
    res.send('Admin user');
  } else {
    logger.info(`Regular user accessed: ${user.id}`);
    res.send('Regular user');
  }
});
app.get('/', (req, res) => {
  logger.info('This is an info log');
  logger.error('This is an error log');
  res.send('Hello World!');
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('An error occurred');
});

app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});