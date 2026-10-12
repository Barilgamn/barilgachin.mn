export type UnitOfMeasure = 'шуудай 50кг' | 'шуудай 25кг' | 'тн' | 'ширхэг' | 'м²' | 'м³' | 'у/м' | 'палет' | 'хайрцаг' | 'боодол' | 'литр' | 'хувин 20л';

export type VehicleRequirement = 'any' | 'porter' | 'truck_5t' | 'heavy_crane' | 'mixer_truck';

export interface BulkPriceTier {
  minQty: number;
  price: number;
  discountPercent: number;
}

export interface StockLocation {
  branchId: string;
  branchName: string;
  qty: number;
  locationCode: string;
  address: string;
}

export interface TechnicalSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string; // Барааны код (жишээ нь 'CEM-MAK-PC425')
  barcode: string;
  name: string;
  mongolianName: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number; // MNT
  originalPrice?: number;
  uom: UnitOfMeasure;
  availableUoms?: UnitOfMeasure[];
  weightKg: number; // Single unit weight for freight calculations
  volumeM3?: number;
  bulkTiers: BulkPriceTier[];
  stockLocations: StockLocation[];
  totalStock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  fullDescription: string;
  techSpecs: TechnicalSpec[];
  mnsStandard?: string;
  originCountry: string;
  vehicleRequirement: VehicleRequirement;
  vehicleRecommendationText: string;
  isMNSCertified: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isEcoGreen?: boolean;
  odooSyncStatus: 'synced' | 'pending';
  odooProductId: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  subcategories: string[];
  image: string;
  productCount: number;
  featuredBrand?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUom: UnitOfMeasure;
  itemTotal: number;
  itemWeightTotal: number;
}

export interface FilterState {
  category: string;
  subcategory: string;
  searchQuery: string;
  brand: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  mnsOnly: boolean;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'name' | 'newest';
  selectedBranch: string;
}

export interface RFQRequest {
  id: string;
  rfqNumber: string;
  companyName: string;
  registerNumber: string;
  contactPerson: string;
  phone: string;
  email: string;
  projectLocation: string;
  items: {
    product: Product;
    quantity: number;
    targetPrice?: number;
    notes?: string;
  }[];
  deliveryNeeded: boolean;
  requiredDate: string;
  notes: string;
  createdAt: string;
  status: 'draft' | 'sent_to_odoo' | 'quoted' | 'approved';
  odooLeadId?: string;
  totalEstimatedAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  deliveryType: 'pickup' | 'delivery';
  selectedVehicle: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  totalWeightKg: number;
  paymentMethod: 'qpay' | 'socialpay' | 'khanbank' | 'storepay' | 'invoice_odoo';
  isVatCompany: boolean;
  companyRegister?: string;
  companyName?: string;
  status: 'confirmed' | 'preparing' | 'on_delivery' | 'completed';
  createdAt: string;
  odooSaleOrderRef: string;
  odooPickingRef: string;
  paymentStatus: 'paid' | 'pending';
}

export interface CalculationResult {
  title: string;
  category: string;
  summary: string;
  requiredMaterials: {
    product: Product;
    quantity: number;
    unit: string;
    estimatedCost: number;
    note: string;
  }[];
  totalEstimatedCost: number;
  totalWeight: number;
}
