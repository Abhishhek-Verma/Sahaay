const express = require("express");
const analyzeMessage = require("../services/huggingface");
const generateReply = require("../utils/responseGenerator");
const ChatHistory = require("../models/ChatHistory");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Chat endpoint - works with or without authentication
router.post("/", optionalAuth, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    let predictions;
    let bestPrediction;
    let useFallback = false;

    // Try Hugging Face API first
    try {
      predictions = await analyzeMessage(message);
      bestPrediction = predictions.reduce((a, b) =>
        a.score > b.score ? a : b
      );
    } catch (hfError) {
      console.error("Hugging Face API failed, using fallback:", hfError.message);
      useFallback = true;
      
      // Fallback classification based on keywords
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself')) {
        bestPrediction = { label: 'crisis', score: 0.95 };
      } else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
        bestPrediction = { label: 'anxiety', score: 0.85 };
      } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) {
        bestPrediction = { label: 'stress', score: 0.80 };
      } else if (lowerMessage.includes('sad') || lowerMessage.includes('depress')) {
        bestPrediction = { label: 'depression', score: 0.78 };
      } else {
        bestPrediction = { label: 'general', score: 0.70 };
      }
    }

    const reply = generateReply(bestPrediction);

    // Determine severity
    const lowerMessage = message.toLowerCase();
    let severity = 'low';
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself'];
    const highKeywords = ['panic', 'can\'t breathe', 'emergency'];
    
    if (crisisKeywords.some(k => lowerMessage.includes(k))) {
      severity = 'crisis';
    } else if (highKeywords.some(k => lowerMessage.includes(k))) {
      severity = 'high';
    } else if (bestPrediction.score > 0.8) {
      severity = 'medium';
    }

    // Save to database if user is authenticated
    if (req.user) {
      try {
        await ChatHistory.create({
          userId: req.user.clerkId,
          userMessage: message,
          botReply: reply,
          detectedState: bestPrediction.label,
          confidence: bestPrediction.score,
          severity: severity,
          flagged: severity === 'crisis' || severity === 'high',
        });
      } catch (dbError) {
        console.error('Failed to save chat history:', dbError);
      }
    }

    res.json({
      userMessage: message,
      detectedState: bestPrediction.label,
      confidence: bestPrediction.score,
      botReply: reply,
      severity: severity,
      usedFallback: useFallback,
    });
  } catch (err) {
    console.error('Chat route error:', err);
    res.status(500).json({ 
      error: "AI processing failed",
      message: err.message 
    });
  }
});

// Get chat history (requires authentication)
router.get("/history", optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const limit = parseInt(req.query.limit) || 50;
    const chats = await ChatHistory.find({ userId: req.user.clerkId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ chats });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

module.exports = router;
