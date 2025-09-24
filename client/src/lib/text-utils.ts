export interface ReadabilityScore {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  readingLevel: string;
}

export interface KeywordDensity {
  keyword: string;
  count: number;
  density: number;
}

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  readingTime: string;
  fileSize: string;
  readability?: ReadabilityScore;
  keywordDensity?: KeywordDensity[];
}

function calculateReadability(text: string, words: number, sentences: number): ReadabilityScore | undefined {
  if (words < 5 || sentences < 1) return undefined;

  // Count syllables in text (approximation)
  const syllables = text.toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .reduce((total, word) => {
      // Simple syllable counting algorithm
      let syllableCount = word.replace(/[^aeiouy]/g, '').length;
      if (word.endsWith('e') && syllableCount > 1) syllableCount--;
      if (word.match(/[aeiouy]{2,}/g)) {
        syllableCount -= (word.match(/[aeiouy]{2,}/g) || []).length;
      }
      return total + Math.max(1, syllableCount);
    }, 0);

  // Flesch Reading Ease Score
  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;
  const fleschReadingEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;

  // Determine reading level
  let readingLevel: string;
  if (fleschReadingEase >= 90) readingLevel = "Very Easy";
  else if (fleschReadingEase >= 80) readingLevel = "Easy";
  else if (fleschReadingEase >= 70) readingLevel = "Fairly Easy";
  else if (fleschReadingEase >= 60) readingLevel = "Standard";
  else if (fleschReadingEase >= 50) readingLevel = "Fairly Difficult";
  else if (fleschReadingEase >= 30) readingLevel = "Difficult";
  else readingLevel = "Very Difficult";

  return {
    fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
    fleschKincaidGrade: Math.max(0, fleschKincaidGrade),
    readingLevel,
  };
}

function calculateKeywordDensity(text: string, totalWords: number): KeywordDensity[] {
  if (totalWords < 3) return [];

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter out words shorter than 3 characters

  // Count word frequencies
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Calculate keyword density and get top 10 keywords
  const keywordDensity: KeywordDensity[] = Array.from(wordCount.entries())
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: (count / totalWords) * 100
    }))
    .filter(item => item.count > 1) // Only show words that appear more than once
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return keywordDensity;
}

export function calculateTextStats(text: string): TextStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).filter(p => p.trim()).length : 0;
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
  
  // Calculate reading time based on 200 words per minute
  const readingTimeMinutes = Math.ceil(words / 200);
  const readingTime = readingTimeMinutes < 1 ? `${Math.ceil(words / 200 * 60)}s` : `${readingTimeMinutes}m`;
  
  const fileSize = `${(new Blob([text]).size / 1024).toFixed(1)} KB`;

  // Enhanced analysis
  const readability = calculateReadability(text, words, sentences);
  const keywordDensity = calculateKeywordDensity(text, words);

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    sentences,
    readingTime,
    fileSize,
    readability,
    keywordDensity,
  };
}

export function convertText(text: string, conversion: string): string {
  switch (conversion) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    case 'camel':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
    case 'snake':
      return text.toLowerCase().replace(/\s+/g, '_');
    case 'kebab':
      return text.toLowerCase().replace(/\s+/g, '-');
    case 'capitalize':
      return text.replace(/\b\w/g, char => char.toUpperCase());
    case 'reverse':
      return text.split('').reverse().join('');
    case 'remove-spaces':
      return text.replace(/\s+/g, '');
    case 'remove-lines':
      return text.replace(/\n+/g, ' ');
    default:
      return text;
  }
}
