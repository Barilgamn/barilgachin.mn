import "dotenv/config";
import express from "express";
import {
  OdooError,
  odooConfigured,
  serverVersion,
  authenticate,
} from "./odoo/client.js";
import {
  countProducts,
  listCategories,
  listProducts,
  listWarehouses,
  stockByLocation,
} from "./odoo/catalog.js";

/**
 * BFF (backend-for-frontend).
 *
 * Хөтөч Odoo руу шууд хандах боломжгүй: API key задрах, CORS хаагдах, мөн
 * хөтчөөс ирсэн үнэд итгэж болохгүй. Бүх ERP дуудлага энэ давхаргаар дамжина.
 *
 * Дэлгэрэнгүйг docs/odoo-integration.md-ээс үзнэ үү.
 */

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3300);

/** Холболт шалгах: GET /api/odoo/health */
app.get("/api/odoo/health", async (_req, res) => {
  try {
    const version = await serverVersion();
    if (!odooConfigured()) {
      return res.status(503).json({
        ok: false,
        configured: false,
        reachable: true,
        version: version.server_version,
        message: "ODOO_DB / ODOO_USERNAME / ODOO_API_KEY тохируулаагүй",
      });
    }
    const uid = await authenticate();
    res.json({ ok: true, configured: true, uid, version: version.server_version });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/categories", async (_req, res) => {
  try {
    res.json(await listCategories());
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/products", async (req, res) => {
  try {
    // Хөтчөөс ирсэн утгыг заавал хязгаарлана.
    const limit = clamp(Number(req.query.limit) || 100, 1, 200);
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const since = typeof req.query.since === "string" ? req.query.since : undefined;

    const [items, total] = await Promise.all([
      listProducts({ limit, offset, since }),
      countProducts(),
    ]);
    res.json({ items, total, limit, offset });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/stock", async (req, res) => {
  try {
    const ids = String(req.query.ids ?? "")
      .split(",")
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0)
      .slice(0, 200);

    if (ids.length === 0) {
      return res.status(400).json({ ok: false, message: "ids шаардлагатай" });
    }

    const [warehouses, groups] = await Promise.all([
      listWarehouses(),
      stockByLocation(ids),
    ]);
    res.json({ warehouses, groups });
  } catch (error) {
    sendError(res, error);
  }
});

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Odoo-гийн дотоод алдааны мэдээллийг хөтөч рүү бүтнээр нь гаргахгүй. */
function sendError(res: express.Response, error: unknown) {
  const isOdoo = error instanceof OdooError;
  if (!isOdoo) console.error(error);
  res.status(isOdoo ? 502 : 500).json({
    ok: false,
    message: isOdoo ? error.message : "Дотоод алдаа",
  });
}

app.listen(PORT, () => {
  console.log(`BFF ажиллаж байна: http://localhost:${PORT}`);
});
