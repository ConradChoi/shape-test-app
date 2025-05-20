import axios from 'axios';
import { ShapeAnalysis } from '../types';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeShapeImage = async (imageBase64: string): Promise<ShapeAnalysis> => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "이 도형심리 검사지에서 1차, 2차, 3차, 4차 도형을 순서대로 찾아서 알려줘. 각 도형의 특징을 간단히 설명하고, JSON 형식으로 응답해줘. 형식: { firstShape: '도형 설명', secondShape: '도형 설명', thirdShape: '도형 설명', fourthShape: '도형 설명' }"
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

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
    throw error;
  }
}; 