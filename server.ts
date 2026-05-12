import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API setup for Chatbot
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Chatbot endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const chat = model.startChat({
        history: history || [],
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to get AI response' });
    }
  });

  // Email Confirmation endpoint
  app.post('/api/confirm-order', async (req, res) => {
    const { order, customerEmail, customerName } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured. Skipping email.');
      return res.json({ success: true, message: 'Order confirmed (email not sent due to missing credentials)' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"NeoAkiba Store" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'Your Anime Figure Order Has Been Confirmed! - NeoAkiba',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0d0d12; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #bc13fe;">Arigatou, ${customerName}!</h2>
          <p>Your order at <strong>NeoAkiba</strong> has been successfully placed.</p>
          <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Total Amount:</strong> $${order.total}</p>
            <h3>Items:</h3>
            <ul>
              ${order.items.map((item: any) => `<li>${item.name} (x${item.quantity}) - $${item.price}</li>`).join('')}
            </ul>
          </div>
          <p>We are preparing your collectibles for shipment. Expect a tracking link soon!</p>
          <footer style="margin-top: 20px; font-size: 12px; color: #888;">
            NeoAkiba - Premium Anime Merchandise
          </footer>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Confirmation email sent' });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: 'Failed to send confirmation email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
