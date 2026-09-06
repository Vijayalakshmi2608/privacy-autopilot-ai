/* Local PII detection + redaction engine (MVP).
 * Architecture note: this module is the seam where ONNX Runtime Web /
 * Transformers.js NER models can be plugged in later — detect() already
 * returns typed entities with spans and confidence. */

export interface PiiEntity {
  type: "name" | "email" | "phone" | "password" | "account" | "address";
  label: string;
  value: string;
  confidence: number; // demo confidence values
  token: string; // replacement token
}

interface Rule {
  type: PiiEntity["type"];
  label: string;
  pattern: RegExp;
  confidence: number;
}

const RULES: Rule[] = [
  { type: "email", label: "Email", pattern: /[\w.+-]+@[\w-]+\.[\w.]+/g, confidence: 98 },
  { type: "phone", label: "Phone", pattern: /\+?\d[\d\s-]{8,}\d/g, confidence: 96 },
  { type: "password", label: "Password", pattern: /(?<=password:\s*)\S+/gi, confidence: 100 },
  { type: "account", label: "Account No.", pattern: /(?<=account (number|no\.?):\s*)\d+/gi, confidence: 94 },
  { type: "name", label: "Name", pattern: /(?<=name:\s*)[A-Z][a-z]+ [A-Z][a-z]+/gi, confidence: 91 },
  { type: "address", label: "Address", pattern: /(?<=address:\s*).+/gi, confidence: 89 },
];

export function detectPii(text: string): PiiEntity[] {
  const found: PiiEntity[] = [];
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.pattern.exec(text)) !== null) {
      found.push({
        type: rule.type,
        label: rule.label,
        value: m[0],
        confidence: rule.confidence,
        token: `[${rule.type.toUpperCase()}_REDACTED]`,
      });
    }
  }
  return found;
}

export function redactText(text: string, entities: PiiEntity[]): string {
  let out = text;
  // Replace longest values first to avoid partial overlaps.
  const sorted = [...entities].sort((a, b) => b.value.length - a.value.length);
  for (const e of sorted) out = out.split(e.value).join(e.token);
  return out;
}
