const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const langCoverter = async(req,res)=> {
    const {targetLanguage,code} = req.body
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt = `
    Convert the following code to ${targetLanguage} code without explanations and give only the code:
    ${code}
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        console.log(text);
        res.status(200).json(text);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }  
  }

module.exports = {langCoverter}