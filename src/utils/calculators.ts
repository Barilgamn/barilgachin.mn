import { PRODUCTS } from '../data/mockData';
import { CalculationResult } from '../types';

/**
 * 1. Хана, блокийн тооцоолуур
 * Тооцоолох: Ханын урт (м), өндөр (м), хаалга/цонхны талбай (м²), блокийн зузаан (200мм / 300мм)
 */
export function calculateWallBlocks(
  lengthM: number,
  heightM: number,
  openingsAreaM2: number,
  blockThicknessMm: number = 200
): CalculationResult {
  const grossArea = lengthM * heightM;
  const netArea = Math.max(1, grossArea - openingsAreaM2);
  const wallVolume = netArea * (blockThicknessMm / 1000);

  // D600 block (600x300x200mm = 0.036m3 / block, ~27.7 blocks per m3)
  const blocksPerM3 = 27.7;
  const exactBlockCount = wallVolume * blocksPerM3;
  const wastageFactor = 1.05; // 5% allowance for cuts
  const totalBlocks = Math.ceil(exactBlockCount * wastageFactor);

  // Block adhesive mortar: ~25kg bag covers ~1.2 m3 of masonry
  const adhesiveBags = Math.max(1, Math.ceil(wallVolume / 1.1));

  // Find products from catalog
  const blockProduct = PRODUCTS.find((p) => p.sku === 'BLK-MAK-AAC600') || PRODUCTS[1];
  const adhesiveProduct = PRODUCTS.find((p) => p.sku === 'ADH-KNAUF-FLIESEN') || PRODUCTS[5];

  const materials = [
    {
      product: blockProduct,
      quantity: totalBlocks,
      unit: 'ширхэг',
      estimatedCost: totalBlocks * blockProduct.price,
      note: `${netArea.toFixed(1)}м² ханын талбайд (5% тайралтын нөөц тооцсон)`,
    },
    {
      product: adhesiveProduct,
      quantity: adhesiveBags,
      unit: 'шуудай 25кг',
      estimatedCost: adhesiveBags * adhesiveProduct.price,
      note: `Өрлөгийн бэлэн наалдамхай цавуу (${wallVolume.toFixed(2)}м³ эзлэхүүнд)`,
    },
  ];

  const totalCost = materials.reduce((acc, m) => acc + m.estimatedCost, 0);
  const totalWeight =
    totalBlocks * blockProduct.weightKg + adhesiveBags * adhesiveProduct.weightKg;

  return {
    title: 'Хана, өрлөгийн блокийн тооцоо',
    category: 'Өрлөг, блок',
    summary: `Цэвэр талбай: ${netArea.toFixed(1)}м² (${wallVolume.toFixed(2)}м³ өрлөг) • Шаардагдах: ${totalBlocks}ш блок, ${adhesiveBags} шуудай цавуу`,
    requiredMaterials: materials,
    totalEstimatedCost: totalCost,
    totalWeight,
  };
}

/**
 * 2. Бетон зуурмагийн тооцоолуур
 * Тооцоолох: Бетоны эзлэхүүн (м³) -> Цемент M500, Элс, Хайрга, Ус
 * Стандарт M250 / B20 маркийн бетоны 1м³ дахь орц:
 * - Цемент: 340 кг (~6.8 шуудай)
 * - Элс: 0.55 м³ (~800 кг)
 * - Хайрга: 0.85 м³ (~1250 кг)
 * - Ус: 180-200 л
 */
export function calculateConcreteMix(volumeM3: number, concreteGrade: 'M200' | 'M250' | 'M300' = 'M250'): CalculationResult {
  const cementPerM3Kg = concreteGrade === 'M300' ? 380 : concreteGrade === 'M250' ? 340 : 290;
  const cementSacks = Math.ceil((volumeM3 * cementPerM3Kg) / 50);

  const cementProduct = PRODUCTS.find((p) => p.sku === 'CEM-MAK-PC425') || PRODUCTS[0];

  const materials = [
    {
      product: cementProduct,
      quantity: cementSacks,
      unit: 'шуудай 50кг',
      estimatedCost: cementSacks * cementProduct.price,
      note: `${volumeM3}м³ ${concreteGrade} маркийн бетонд шаардагдах портланд цемент`,
    },
  ];

  const totalCost = materials.reduce((acc, m) => acc + m.estimatedCost, 0);
  const totalWeight = cementSacks * cementProduct.weightKg;

  return {
    title: `Бетон зуурмагийн орц тооцоо (${concreteGrade})`,
    category: 'Бетон, зуурмаг',
    summary: `Эзлэхүүн: ${volumeM3}м³ цутгалт • Нийт цемент: ${(cementSacks * 0.05).toFixed(2)} тн (${cementSacks} шуудай)`,
    requiredMaterials: materials,
    totalEstimatedCost: totalCost,
    totalWeight,
  };
}

/**
 * 3. Дулаалгын эрдэс хөвөн тооцоолуур
 * Тооцоолох: Дулаалах талбай (м²), Зузаан (50мм / 100мм), Давхарга
 */
export function calculateInsulation(areaM2: number, thicknessMm: number = 100): CalculationResult {
  // 1 bundle of KNAUF RW100 covers 5.76 m2
  const coveragePerBundle = thicknessMm === 100 ? 5.76 : 11.52;
  const wastage = 1.05;
  const bundles = Math.ceil((areaM2 / coveragePerBundle) * wastage);

  const insulationProduct = PRODUCTS.find((p) => p.sku === 'INS-KNAUF-RW100') || PRODUCTS[3];

  const materials = [
    {
      product: insulationProduct,
      quantity: bundles,
      unit: 'боодол',
      estimatedCost: bundles * insulationProduct.price,
      note: `${areaM2}м² талбайд ${thicknessMm}мм базальт эрдэс дулаалга (5% нөөцтэй)`,
    },
  ];

  const totalCost = materials.reduce((acc, m) => acc + m.estimatedCost, 0);
  const totalWeight = bundles * insulationProduct.weightKg;

  return {
    title: `Барилгын дулаалгын тооцоо (${thicknessMm}мм)`,
    category: 'Дулаалга',
    summary: `Талбай: ${areaM2}м² • Нийт ${bundles} боодол KNAUF базальт хөвөн (${(bundles * coveragePerBundle).toFixed(1)}м²)`,
    requiredMaterials: materials,
    totalEstimatedCost: totalCost,
    totalWeight,
  };
}

/**
 * 4. Плита ба Цавууны тооцоолуур
 * Тооцоолох: Шал/ханын талбай (м²), Наах арга, Хаягдал (7-10%)
 */
export function calculateTiling(areaM2: number): CalculationResult {
  // Adhesive: ~4 kg/m2 -> 25kg bag covers ~6 m2
  const adhesiveBags = Math.ceil((areaM2 * 4) / 25);
  const adhesiveProduct = PRODUCTS.find((p) => p.sku === 'ADH-KNAUF-FLIESEN') || PRODUCTS[5];

  const materials = [
    {
      product: adhesiveProduct,
      quantity: adhesiveBags,
      unit: 'шуудай 25кг',
      estimatedCost: adhesiveBags * adhesiveProduct.price,
      note: `${areaM2}м² талбайд шаардагдах хүчитгэсэн плитаны цавуу (зарцуулалт 4кг/м²)`,
    },
  ];

  const totalCost = materials.reduce((acc, m) => acc + m.estimatedCost, 0);
  const totalWeight = adhesiveBags * adhesiveProduct.weightKg;

  return {
    title: 'Плита наах цавууны тооцоо',
    category: 'Плита, засал',
    summary: `Талбай: ${areaM2}м² • Нийт ${adhesiveBags} шуудай (25кг) KNAUF Fliesen цавуу`,
    requiredMaterials: materials,
    totalEstimatedCost: totalCost,
    totalWeight,
  };
}

/**
 * 5. Будаг, эмульсийн тооцоолуур
 * Тооцоолох: Будах ханын нийт талбай (м²), Давхаргын тоо (2 үе)
 */
export function calculatePaint(areaM2: number, coats: number = 2): CalculationResult {
  // 1 bucket 18L covers ~80 m2 in 2 coats (or 160m2 in 1 coat)
  const totalPaintArea = areaM2 * coats;
  const buckets = Math.max(1, Math.ceil(totalPaintArea / 160));

  const paintProduct = PRODUCTS.find((p) => p.sku === 'PNT-TIK-LUMI20') || PRODUCTS[4];

  const materials = [
    {
      product: paintProduct,
      quantity: buckets,
      unit: 'хувин 20л',
      estimatedCost: buckets * paintProduct.price,
      note: `${areaM2}м² ханыг ${coats} үе будахад (Нийт ${totalPaintArea}м² гадаргуу)`,
    },
  ];

  const totalCost = materials.reduce((acc, m) => acc + m.estimatedCost, 0);
  const totalWeight = buckets * paintProduct.weightKg;

  return {
    title: `Дотор ханын будаг тооцоо (${coats} үе)`,
    category: 'Будаг, засал',
    summary: `Талбай: ${areaM2}м² (${coats} үе) • Нийт ${buckets} хувин (18л) Tikkurila Luja будаг`,
    requiredMaterials: materials,
    totalEstimatedCost: totalCost,
    totalWeight,
  };
}
