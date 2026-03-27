import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'google-translate-api-x';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  // We can dynamically import translations.js since it's an ES module
  // Wait, translations.js imports from './config' which is also an ES module.
  // We'll just run this script with Node.js using ES modules.
  const { MESSAGES } = await import('../lib/i18n/translations.js');
  const en = MESSAGES.en;

  const GT_MAP = {
    mr: 'mr', bn: 'bn', ta: 'ta', te: 'te', kn: 'kn', ml: 'ml', pa: 'pa', or: 'or', gu: 'gu'
  };

  const result = {};
  
  for (const loc of Object.keys(GT_MAP)) {
    result[loc] = {};
    const gtLoc = GT_MAP[loc];
    console.log(`\nTranslating for ${loc} (GT: ${gtLoc})...`);
    
    for (const [section, keysObj] of Object.entries(en)) {
      result[loc][section] = {};
      const keys = Object.keys(keysObj);
      const texts = keys.map(k => {
        let text = keysObj[k];
        // Protect {placeholder} syntax
        return text.replace(/\{(\w+)\}/g, '<span class="$1"></span>');
      });
      
      if (texts.length === 0) continue;
      
      try {
        const res = await translate(texts, { to: gtLoc });
        const translatedArray = Array.isArray(res) ? res.map(x => x.text) : [res.text];
        
        for (let i = 0; i < translatedArray.length; i++) {
          let transText = translatedArray[i];
          transText = transText
            .replace(/<span class="(\w+)"><\/span>/gi, '{$1}')
            .replace(/<span class="(\w+)"> <\/span>/gi, '{$1}')
            .replace(/<span class="(\w+)" \/>/gi, '{$1}')
            .replace(/<span class="(\w+)"\/>/gi, '{$1}');
          result[loc][section][keys[i]] = transText;
        }
        console.log(`  - ${section}: translated ${translatedArray.length} items`);
      } catch (e) {
        console.error(`  - Failed to translate ${section}:`, e.message);
      }
    }
  }

  // add raj using hi as base since raj isn't directly on GT API or is complex, actually wait, GT API does not support raj. I'll just skip generating raj, it will fallback to hi. Or I'll just copy hi.
  result['raj'] = MESSAGES.hi;

  const outPath = path.join(__dirname, '..', 'lib', 'i18n', 'generated-locales.js');
  const outCode = `export const GENERATED_LOCALES = ${JSON.stringify(result, null, 2)};`;
  fs.writeFileSync(outPath, outCode, 'utf8');
  console.log("Done generating locales:", outPath);
}

run();
