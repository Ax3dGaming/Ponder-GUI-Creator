import React from 'react';

const formatCodes = {
  '0': { color: '#000000' },
  '1': { color: '#0000AA' },
  '2': { color: '#00AA00' },
  '3': { color: '#00AAAA' },
  '4': { color: '#AA0000' },
  '5': { color: '#AA00AA' },
  '6': { color: '#FFAA00' },
  '7': { color: '#AAAAAA' },
  '8': { color: '#555555' },
  '9': { color: '#5555FF' },
  'a': { color: '#55FF55' },
  'b': { color: '#55FFFF' },
  'c': { color: '#FF5555' },
  'd': { color: '#FF55FF' },
  'e': { color: '#FFFF55' },
  'f': { color: '#FFFFFF' },
  'l': { fontWeight: 'bold' },
  'o': { fontStyle: 'italic' },
  'm': { textDecoration: 'line-through' },
  'n': { textDecoration: 'underline' },
  'r': { color: 'inherit', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' }
};

export const parseMinecraftFormatting = (text) => {
  if (!text) return text;
  
  const parts = text.split(/(§[0-9a-fk-or])/i);
  let currentStyle = {};
  const elements = [];

  parts.forEach((part, index) => {
    if (part.toLowerCase().startsWith('§')) {
      const code = part.charAt(1).toLowerCase();
      if (code === 'r') {
        currentStyle = {}; // Reset
      } else if (formatCodes[code]) {
        currentStyle = { ...currentStyle, ...formatCodes[code] };
      }
    } else if (part.length > 0) {
      elements.push(
        <span key={index} style={{ ...currentStyle }}>
          {part}
        </span>
      );
    }
  });

  return elements;
};
