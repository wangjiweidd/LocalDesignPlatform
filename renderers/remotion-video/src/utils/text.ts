export const splitKeyword = (text: string, keyword: string) => {
  const i = text.indexOf(keyword);
  if (i < 0) return {before: text, keyword: '', after: ''};
  return {before: text.slice(0, i), keyword, after: text.slice(i + keyword.length)};
};

/** Parse strings like "78%", "3x", "2.5M" into a number and suffix. */
export const parseDataValue = (raw: string): {number: number; suffix: string} => {
  const m = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return {number: 0, suffix: raw};
  return {number: parseFloat(m[1]), suffix: m[2]};
};
