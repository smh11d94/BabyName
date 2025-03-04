export async function generateNameMeaning(name: string): Promise<string> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generateMeaning',
        params: { name }
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.meaning;
  } catch (error) {
    console.error('Error generating name meaning:', error);
    return "Unable to fetch name meaning at this time";
  }
}

interface NameSuggestion {
  name: string;
  origin: string;
  meaning: string;
  explanation: string;
}

export async function generateNameSuggestion(criteria: {
  heritage: string[];
  meanings: string[];
  gender: string;
  length?: string;
  firstLetter?: string;
  popularity?: string;
}): Promise<{ names: NameSuggestion[] }> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generateSuggestion',
        params: criteria
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating name suggestion:', error);
    return {
      names: []
    };
  }
} 