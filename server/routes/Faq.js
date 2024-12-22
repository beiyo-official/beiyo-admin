const express = require("express");
const router = express.Router();
const OpenAI = require("openai")

const FAQ = require("../models/Faq");


// const openai = new OpenAI(
//     {
//         apiKey:process.env.OPENAI_API_KEY
//     }
// );

// Search FAQ for a relevant answer and use OpenAI for fallback
router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    // Find all FAQs
    const faqs = await FAQ.find();
    let answer = null;

    // Search through FAQ questions
    faqs.forEach((faq) => {
      faq.questions.forEach((q) => {
        if (q.question.toLowerCase().includes(query.toLowerCase())) {
          answer = q.answer;
        }
      });
    });

    if (answer) {
      // FAQ-based response
      return res.status(200).json({ success: true, answer });
    }

    // // No FAQ match found, use OpenAI to generate a response
    // const openAiResponse = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo", // Use gpt-4 or gpt-3.5-turbo
    //   messages: [
    //     { role: "system", content: "You are a helpful assistant for Beiyo." },
    //     { role: "user", content: query },
    //   ],
    // });

    // const aiAnswer = openAiResponse.data.choices[0].message.content.trim();
    // res.status(200).json({ success: true, answer: aiAnswer });
  } catch (error) {
    console.error("Error handling query:", error);
    res.status(500).json({
      success: false,
      error: "Error generating response",
      details: error.message,
    });
  }
});



// Route to upload FAQs
router.post("/upload", async (req, res) => {
  try {
    const { faqs } = req.body;

    if (!faqs || !Array.isArray(faqs)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ data" });
    }

    // Save FAQs to the database
    for (const faq of faqs) {
      const { category, questions } = faq;

      // Check if category already exists
      const existingCategory = await FAQ.findOne({ category });

      if (existingCategory) {
        // Update the existing category with new questions
        existingCategory.questions.push(...questions);
        await existingCategory.save();
      } else {
        // Create a new category with questions
        const newFAQ = new FAQ({ category, questions });
        await newFAQ.save();
      }
    }

    res.status(200).json({ success: true, message: "FAQs uploaded successfully" });
  } catch (error) {
    console.error("Error uploading FAQs:", error);
    res.status(500).json({ success: false, message: "Error uploading FAQs", error: error.message });
  }
});



module.exports = router;
