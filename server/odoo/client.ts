/**
 * Odoo 18 External API (JSON-RPC) client.
 *
 * ЗӨВХӨН серверт ажиллана. ODOO_API_KEY хэзээ ч хөтөч рүү очихгүй.
 *
 * Транспорт нь энэ файлд тусгаарлагдсан: `/jsonrpc` нь Odoo 22 дээр
 * устгагдах тул тэр үед зөвхөн `rpc()` функцийг External JSON-2 API руу
 * сольсноор бусад код хэвээр ажиллана.
 *
 * Docs: https://www.odoo.com/documentation/18.0/developer/reference/external_api.html
 */

const url = () => requireEnv("ODOO_URL").replace(/\/+$/, "");
const db = () => requireEnv("ODOO_DB");
const username = () => requireEnv("ODOO_USERNAME");
const apiKey = () => requireEnv("ODOO_API_KEY");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new OdooError(`${name} орчны хувьсагч тохируулаагүй байна`);
  return value;
}

export function odooConfigured(): boolean {
  return Boolean(
    process.env.ODOO_URL &&
      process.env.ODOO_DB &&
      process.env.ODOO_USERNAME &&
      process.env.ODOO_API_KEY,
  );
}

export class OdooError extends Error {
  constructor(
    message: string,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = "OdooError";
  }
}

type JsonRpcResponse<T> = {
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: { name?: string; message?: string; debug?: string };
  };
};

let requestId = 0;

async function rpc<T>(
  service: "common" | "object",
  method: string,
  args: unknown[],
): Promise<T> {
  const response = await fetch(`${url()}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      id: ++requestId,
      params: { service, method, args },
    }),
  });

  if (!response.ok) {
    throw new OdooError(`Odoo HTTP ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as JsonRpcResponse<T>;

  if (payload.error) {
    const detail =
      payload.error.data?.message ?? payload.error.message ?? "Тодорхойгүй алдаа";
    throw new OdooError(`Odoo: ${detail}`, payload.error.data);
  }

  return payload.result as T;
}

/** Нэвтрэлт шаардлагагүй — холболт шалгахад ашиглана. */
export function serverVersion(): Promise<{ server_version: string }> {
  return rpc("common", "version", []);
}

/**
 * uid-г процессын хугацаанд кэшлэнэ. Алдаа гарвал кэш цэвэрлэгдэж,
 * дараагийн дуудлагад дахин нэвтэрнэ.
 */
let uidPromise: Promise<number> | null = null;

export function authenticate(): Promise<number> {
  if (uidPromise) return uidPromise;

  uidPromise = rpc<number | false>("common", "authenticate", [
    db(),
    username(),
    apiKey(),
    {},
  ]).then((uid) => {
    if (!uid) {
      throw new OdooError(
        "Odoo-д нэвтэрч чадсангүй. ODOO_DB / ODOO_USERNAME / ODOO_API_KEY-г шалгана уу.",
      );
    }
    return uid;
  });

  uidPromise.catch(() => {
    uidPromise = null;
  });

  return uidPromise;
}

/**
 * Дуудаж болох модель/методын цагаан жагсаалт.
 *
 * Хөтчөөс ирсэн хүсэлт дурын модель дуудахаас сэргийлнэ. Шинэ боломж
 * нэмэх бүрд энд ухамсартайгаар нэмнэ.
 */
const ALLOWED: Record<string, ReadonlySet<string>> = {
  "product.template": new Set(["search_read", "search_count", "read"]),
  "product.product": new Set(["search_read", "read"]),
  "product.public.category": new Set(["search_read"]),
  "product.pricelist.item": new Set(["search_read"]),
  "stock.quant": new Set(["read_group"]),
  "stock.warehouse": new Set(["search_read"]),
  "stock.picking": new Set(["search_read"]),
};

/** Odoo модель дээр метод дуудна. */
export async function execute<T>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {},
): Promise<T> {
  if (method.startsWith("_")) {
    // Odoo хувийн методыг RPC-ээр хориглодог; эрт бөгөөд ойлгомжтой алдаа өгөх.
    throw new OdooError(`Хувийн метод RPC-ээр дуудагдахгүй: ${model}.${method}`);
  }
  if (!ALLOWED[model]?.has(method)) {
    throw new OdooError(`Зөвшөөрөгдөөгүй дуудлага: ${model}.${method}`);
  }

  const uid = await authenticate();
  return rpc<T>("object", "execute_kw", [
    db(),
    uid,
    apiKey(),
    model,
    method,
    args,
    kwargs,
  ]);
}

export type SearchReadOptions = {
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
  context?: Record<string, unknown>;
};

export function searchRead<T>(
  model: string,
  domain: unknown[] = [],
  options: SearchReadOptions = {},
): Promise<T[]> {
  return execute<T[]>(model, "search_read", [domain], stripUndefined(options));
}

export function searchCount(model: string, domain: unknown[] = []): Promise<number> {
  return execute<number>(model, "search_count", [domain]);
}

/**
 * Бүлэглэсэн уншилт. Үлдэгдлийг агуулах тус бүрээр нэг дуудлагаар авахад
 * ашиглагдана — 5.2-р хэсгийг үзнэ үү.
 */
export function readGroup<T>(
  model: string,
  domain: unknown[],
  fields: string[],
  groupBy: string[],
): Promise<T[]> {
  return execute<T[]>(model, "read_group", [domain, fields, groupBy], {
    lazy: false,
  });
}

function stripUndefined<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as T;
}
