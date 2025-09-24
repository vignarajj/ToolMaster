export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  readingTime: string;
  fileSize: string;
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

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    sentences,
    readingTime,
    fileSize,
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
