import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';

const SYSTEM_PROMPT = `You are a friendly and knowledgeable assistant for SR Constructions, a trusted real estate company in Visakhapatnam, Andhra Pradesh, India.

COMPANY DETAILS:
- Name: SR Constructions
- Founded: 2007 (19+ years of experience)
- Speciality: Residential apartments, plot layouts, commercial projects
- Office: Shop 5, Vuda Shopping Centre, Sector-7, MVP Colony, Visakhapatnam, AP 530017
- Phone: +91 99088 34499
- Email: srconstructions64@gmail.com
- Tagline: "From Vision to Reality — You Dream, We Build"

ONGOING PROJECTS (currently available):
1. Sai Ram Elite — Pendurthi, Visakhapatnam (Plot Layout)
2. Green Valley Plots — Anakapalle (Plot Layout)
3. Sunrise Township — Bheemunipatnam (Residential)
4. SR Prime Plots — Kommadi (Plot Layout)
5. Coastal Greens — Vizianagaram Highway (Plot Layout)

PAST PROJECTS (delivered & sold out):
Vijaya Enclave, Sri Sai Enclave, Sai Ram Enclave, Sri Sai Ram Residency, Suryodaya Enclave, Aditya Nagar, Sri Venkateswara Nagar, Rushikonda Heights, Sai Teja Enclave, Bhavani Nagar — all across Visakhapatnam.

YOUR ROLE:
- Answer questions about SR Constructions, projects, locations, and availability
- Help visitors understand which project suits their needs
- Encourage interested buyers to fill the contact form or call +91 99088 34499
- Be warm, professional, and concise (2-4 sentences per reply)
- For pricing, say rates vary by plot/unit size and to contact the team for current pricing
- If you don't know something specific, say so honestly and suggest calling the team

DO NOT discuss competitors, make up prices, or go off-topic from real estate and SR Constructions.`;

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.7,
      maxOutputTokens: 512,
    });

    const langchainMessages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...messages.map((m) =>
        m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
      ),
    ];

    const response = await model.invoke(langchainMessages);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ reply: response.content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
