import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express from 'express';
import { appRouter } from './trpc/index.js';
import { createContext } from './trpc/context.js';
import { TRPCError } from '@trpc/server';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, type, path, input, ctx, req }) => {
      console.error('Error:', {
        type,
        path,
        input,
        error: error.message,
        stack: error.stack,
      });
      if (error instanceof TRPCError) {
        // Handle tRPC errors
        console.error('tRPC error:', error.code, error.message);
      } else {
        // Handle other errors
        console.error('Unknown error:', error);
      }
    },
  })
);

app.listen({port, host: "0.0.0.0"}, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
