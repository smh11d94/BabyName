import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, params } = body;

    if (action === 'generateMeaning') {
      const { name } = params;
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative name expert that provides unique and interesting meanings and origins of names. Always strive to give fresh, insightful perspectives on names."
          },
          {
            role: "user",
            content: `What is the meaning and origin of the name "${name}"? Please provide a concise response.`
          }
        ],
        temperature: 0.9,
        max_tokens: 150
      });

      return NextResponse.json({
        meaning: response.choices[0].message.content || "Meaning not found"
      });
    }

    if (action === 'generateSuggestion') {
      const { heritage, meanings, gender, length, firstLetter, popularity } = params;
      const prompt = `You are a specialized baby name expert. Generate THREE COMPLETELY UNIQUE AND CREATIVE baby names following these criteria in strict order of priority. Never repeat previously suggested names and aim for originality with each suggestion:

1. GENDER (HIGHEST PRIORITY):
   - Must be a ${gender} name
   - This is the most important criterion and must be strictly followed

2. HERITAGE/ORIGIN (SECOND PRIORITY):
   - Must come from one of these cultures: ${heritage.join(' or ')}
   - The name should have a genuine connection to the selected heritage(s)
   - Be creative and consider unique or lesser-known names from these cultures
   - Include the name written in its original script (if applicable)

3. MEANING (THIRD PRIORITY):
   - Must embody one or more of these meanings: ${meanings.join(' or ')}
   - Explain specifically how the name reflects these meanings
   - Look for unique interpretations and connections

4. ADDITIONAL PREFERENCES (LOWER PRIORITY):
   ${length ? `- Length: ${length} name preferred` : ''}
   ${firstLetter ? `- Should start with: ${firstLetter}` : ''}
   ${popularity ? `- Popularity level: ${popularity}` : ''}

Each suggestion must be completely unique and not commonly used. Focus on creative, meaningful names that might be overlooked but perfectly match the criteria.

Respond with exactly 3 names in this format:

NAME1: [first name]
ORIGINAL_SCRIPT1: [name in original script if applicable]
ORIGIN1: [specific cultural origin]
MEANING1: [specific meaning and how it relates to requested meanings]
EXPLANATION1: [why this name fits all criteria]

NAME2: [second name]
ORIGINAL_SCRIPT2: [name in original script if applicable]
ORIGIN2: [specific cultural origin]
MEANING2: [specific meaning and how it relates to requested meanings]
EXPLANATION2: [why this name fits all criteria]

NAME3: [third name]
ORIGINAL_SCRIPT3: [name in original script if applicable]
ORIGIN3: [specific cultural origin]
MEANING3: [specific meaning and how it relates to requested meanings]
EXPLANATION3: [why this name fits all criteria]`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative baby name expert specializing in unique and meaningful names from all cultures. For each request, generate completely new and different names, never repeating previous suggestions. Focus on originality while ensuring the names are beautiful and meaningful. Avoid common or overused names unless specifically requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.95,
        max_tokens: 800
      });

      const content = response.choices[0].message.content || "";
      const lines = content.split('\n').filter(Boolean);
      
      const names = [];
      for (let i = 1; i <= 3; i++) {
        const nameStart = lines.findIndex(line => line.startsWith(`NAME${i}:`));
        if (nameStart !== -1) {
          const nextNameStart = i < 3 ? lines.findIndex(line => line.startsWith(`NAME${i + 1}:`)) : lines.length;
          const nameSection = lines.slice(nameStart, nextNameStart !== -1 ? nextNameStart : undefined);
          
          const name = nameSection.find(line => line.startsWith(`NAME${i}:`))?.replace(`NAME${i}:`, '').trim() || '';
          const originalScript = nameSection.find(line => line.startsWith(`ORIGINAL_SCRIPT${i}:`))?.replace(`ORIGINAL_SCRIPT${i}:`, '').trim() || '';
          const origin = nameSection.find(line => line.startsWith(`ORIGIN${i}:`))?.replace(`ORIGIN${i}:`, '').trim() || '';
          const meaning = nameSection.find(line => line.startsWith(`MEANING${i}:`))?.replace(`MEANING${i}:`, '').trim() || '';
          const explanation = nameSection.find(line => line.startsWith(`EXPLANATION${i}:`))?.replace(`EXPLANATION${i}:`, '').trim() || '';
          
          names.push({ name, originalScript, origin, meaning, explanation });
        }
      }

      return NextResponse.json({ names });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 