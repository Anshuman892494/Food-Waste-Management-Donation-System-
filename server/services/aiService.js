const Groq = require('groq-sdk');
const AIReport = require('../models/AIReport');

let groq;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
} else {
  console.warn('Warning: GROQ_API_KEY is missing. AI Analysis will be disabled.');
}

/**
 * Analyzes food donation using Groq AI to provide safety scores and redistribution logic.
 * @param {Object} donation - The donation object from the database.
 */
exports.analyzeDonation = async (donation) => {
  if (!groq) {
    console.error('AI Analysis skipped: Groq client not initialized.');
    return null;
  }
  try {
    const prompt = `
      As an expert food safety auditor and sustainability consultant for a Smart-City platform, 
      analyze the following food donation and provide a structured JSON response.

      DONATION DATA:
      - Food Name: ${donation.foodName}
      - Category: ${donation.category}
      - Quantity: ${donation.quantity}
      - Weight: ${donation.weight}kg
      - Storage Conditions: ${donation.storageConditions}
      - Time since creation: ${new Date() - donation.createdAt}ms
      - Expiry Time: ${donation.expiryTime}

      Respond ONLY in JSON with the following structure:
      {
        "freshnessScore": number (0-100),
        "shelfLifeEstimate": "string",
        "safetyScore": number (0-100),
        "recommendation": {
          "destination": "ngo" | "dairy" | "compost",
          "reasoning": "string"
        }
      }

      CRITICAL RULES:
      1. If shelf life < 6 hours, destination must be "dairy" or "compost".
      2. If category is non-veg and storage is ambient, safetyScore must be low.
      3. Reasoning should be professional and technical.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(chatCompletion.choices[0].message.content);

    // Save report to DB
    const report = await AIReport.create({
      donationId: donation._id,
      ...analysis,
      rawResponse: chatCompletion
    });

    return report;
  } catch (error) {
    console.error('Groq AI Analysis Error:', error);
    throw new Error('AI Analysis failed');
  }
};
