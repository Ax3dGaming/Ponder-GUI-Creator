import PlayerNameJava from './PlayerName/PlayerName.js';
import PlayerNameReact from './PlayerName/PlayerName.jsx';

import HealthJava from './Health/Health.js';
import HealthReact from './Health/Health.jsx';

import XpJava from './Xp/Xp.js';
import XpReact from './Xp/Xp.jsx';

import XPosJava from './XPos/XPos.js';
import XPosReact from './XPos/XPos.jsx';

import YPosJava from './YPos/YPos.js';
import YPosReact from './YPos/YPos.jsx';

import ZPosJava from './ZPos/ZPos.js';
import ZPosReact from './ZPos/ZPos.jsx';

// Registry maps placeholder strings (e.g. "%player_name%") to their definitions
export const Placeholders = {
  '%player_name%': {
    java: PlayerNameJava,
    react: PlayerNameReact
  },
  '%health%': {
    java: HealthJava,
    react: HealthReact
  },
  '%xp%': {
    java: XpJava,
    react: XpReact
  },
  '%x_pos%': {
    java: XPosJava,
    react: XPosReact
  },
  '%y_pos%': {
    java: YPosJava,
    react: YPosReact
  },
  '%z_pos%': {
    java: ZPosJava,
    react: ZPosReact
  },
};

export const parsePlaceholdersJavaText = (text) => {
  if (!text) return `Component.literal("")`;

  let remainingText = text;
  const parts = [];

  while (remainingText.length > 0) {
    let earliestIdx = -1;
    let earliestPlaceholder = null;

    for (const placeholder in Placeholders) {
      const idx = remainingText.indexOf(placeholder);
      if (idx !== -1 && (earliestIdx === -1 || idx < earliestIdx)) {
        earliestIdx = idx;
        earliestPlaceholder = placeholder;
      }
    }

    if (earliestIdx === -1) {
      parts.push(`Component.literal("${remainingText.replace(/"/g, '\\"')}")`);
      break;
    }

    if (earliestIdx > 0) {
      parts.push(`Component.literal("${remainingText.substring(0, earliestIdx).replace(/"/g, '\\"')}")`);
    }

    parts.push(`Component.literal(String.valueOf(${Placeholders[earliestPlaceholder].java.getRawExpression()}))`);
    remainingText = remainingText.substring(earliestIdx + earliestPlaceholder.length);
  }

  if (parts.length === 0) return `Component.empty()`;
  if (parts.length === 1) return parts[0];

  return parts[0] + parts.slice(1).map(p => `.append(${p})`).join('');
};

export const parsePlaceholdersJavaRaw = (text) => {
  if (typeof text !== 'string') return text;
  let result = text;
  for (const placeholder in Placeholders) {
    result = result.split(placeholder).join(Placeholders[placeholder].java.getRawExpression());
  }
  return result;
};

export const parsePlaceholdersReact = (text) => {
  if (!text) return text;
  let result = text;
  for (const placeholder in Placeholders) {
    result = result.split(placeholder).join(Placeholders[placeholder].react.getMockText());
  }
  return result;
};
