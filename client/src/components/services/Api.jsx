import axios from 'axios';

const FETCHURI = "https://codemorph.onrender.com/api/v1"

// const FETCHURI = "http://localhost:4000/api/v1"

function generateUniqueId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function codeConverter (sourceCode,targetLanguage) {
  try {
    const response = await axios.post(`${FETCHURI}/language-converter`, {
      code: sourceCode,
      targetLanguage,
    });
    return response.data
  } catch (error) {
    console.error('Error converting code:', error);
  }
}

async function errorCorrector(code) {
  try {
    const response = await axios.post(`${FETCHURI}/error-corrector`, {
      code: code
    });
    return response.data
  } catch (error) {
    console.error('Error converting code:', error);
  }
}

export {generateUniqueId,codeConverter,errorCorrector}