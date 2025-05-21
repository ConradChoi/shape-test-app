import axios from 'axios';
import { ShapeAnalysis } from '../types';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeShapeImage = async (imageBase64: string): Promise<ShapeAnalysis> => {
  try {
    console.log('API Key:', API_KEY); // API 키 확인용 로그
    console.log('Image Base64:', imageBase64.substring(0, 100) + '...'); // 이미지 데이터 확인용 로그

    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes shape psychology test images."
          },
          {
            role: "user",
            content: `Please analyze this shape psychology test image and provide the analysis in the following JSON format:
            {
              "firstShape": "description of first shape",
              "secondShape": "description of second shape",
              "thirdShape": "description of third shape",
              "fourthShape": "description of fourth shape"
            }
            
            Image URL: ${imageBase64}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }
    });

    console.log('API Response:', response.data); // API 응답 확인용 로그

    const content = response.data.choices[0].message.content;
    const analysis = JSON.parse(content);
    
    return {
      firstShape: analysis.firstShape,
      secondShape: analysis.secondShape,
      thirdShape: analysis.thirdShape,
      fourthShape: analysis.fourthShape
    };
  } catch (error) {
    console.error('Error analyzing shape image:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    throw error;
  }
}; 