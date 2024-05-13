import axios from 'axios';

export const ChatService = async message => {
  try {
    const response = await axios.post(
      `${process.env.API_URL}?key=${process.env.API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseData = response.data;
    const responseText =
      responseData.candidates[0]?.content?.parts[0]?.text || '';

    return responseText;
  } catch (error) {
    console.error('entro aca ChatService error:', error);
    return 'Sorry, I am not available right now.';
  }
};
