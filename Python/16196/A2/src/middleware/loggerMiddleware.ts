// src/middleware/loggerMiddleware.ts
import express from 'express';
import logger from '../logger';

const loggerMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
};

export default loggerMiddleware;