import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import bookRoutes from './router';



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/books', bookRoutes);

const MONGO = "mongodb://127.0.0.1:27017/altBookTracker";

mongoose.connect(MONGO).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log(`🚀 Server on http://localhost:5000`));
}).catch(err => {
  console.error('❌ MongoDB error:', err?.message || err);
});
