/**
 * Мэдээний агуулга дахь барааны блок.
 *
 * Админ текстийн дундуур `[бараа ...]` гэсэн тэмдэглэгээ тавихад тэр байранд
 * барааны зурвас гарна. Тэмдэглэгээ нь:
 *
 *   [бараа ангилал=cement-binder]          — ангиллаар
 *   [бараа ангилал=cement-binder тоо=3]    — тоог нь хязгаарлаж
 *   [бараа sku=CEM-MAK-PC425,BLK-MAK-AAC600] — нэрлэж сонгосон бараа
 */

export type PostBlock =
  | { kind: 'text'; value: string }
  | { kind: 'products'; categorySlug: string | null; skus: string[]; limit: number };

const TOKEN = /\[\s*бараа([^\]]*)\]/gi;
const DEFAULT_LIMIT = 4;

const parseToken = (raw: string): PostBlock => {
  const attrs = raw.trim();

  const category = /ангилал\s*=\s*([^\s\]]+)/i.exec(attrs);
  const sku = /sku\s*=\s*([^\]]+?)(?=\s+\p{L}+\s*=|$)/iu.exec(attrs);
  const limit = /тоо\s*=\s*(\d+)/i.exec(attrs);

  return {
    kind: 'products',
    categorySlug: category ? category[1].trim() : null,
    skus: sku
      ? sku[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    limit: limit ? Math.max(1, Math.min(12, Number(limit[1]))) : DEFAULT_LIMIT,
  };
};

/** Агуулгыг текст ба барааны блок болгон хуваана. */
export const parsePostBody = (body: string): PostBlock[] => {
  const blocks: PostBlock[] = [];
  let last = 0;

  TOKEN.lastIndex = 0;
  for (let m = TOKEN.exec(body); m !== null; m = TOKEN.exec(body)) {
    const before = body.slice(last, m.index);
    if (before.trim()) blocks.push({ kind: 'text', value: before });
    blocks.push(parseToken(m[1]));
    last = m.index + m[0].length;
  }

  const tail = body.slice(last);
  if (tail.trim()) blocks.push({ kind: 'text', value: tail });

  return blocks;
};

/** Текстийг хоосон мөрөөр нь догол мөр болгоно. */
export const toParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
