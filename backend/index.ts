import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Tuit Backend API is running');
});

app.get('/foods', async (req: Request, res: Response) => {
  try {
    const foods = await prisma.food.findMany();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

app.post('/foods', async (req: Request, res: Response) => {
  const { name, calories, protein, carbs, fat } = req.body;
  try {
    const newFood = await prisma.food.create({
      data: { name, calories, protein, carbs, fat },
    });
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create food' });
  }
});

app.get('/meal-logs', async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'Missing userId param' });

  try {
    const logs = await prisma.mealLog.findMany({
      where: { userId },
      include: { food: true },
      orderBy: { date: 'desc' },
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal logs' });
  }
});

app.post('/meal-logs', async (req: Request, res: Response) => {
  const { userId, foodId, quantity, date } = req.body;
  try {
    const log = await prisma.mealLog.create({
      data: {
        userId,
        foodId,
        quantity,
        date: new Date(date),
      },
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meal log' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
