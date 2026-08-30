export function formatMNT(amount: number): string {
  return new Intl.NumberFormat('mn-MN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' ₮';
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} тн (${kg.toLocaleString()} кг)`;
  }
  return `${kg.toLocaleString()} кг`;
}

export function getRecommendedVehicle(totalWeightKg: number): {
  type: string;
  name: string;
  capacity: string;
  estimatedFee: number;
  badgeColor: string;
  iconName: string;
  description: string;
} {
  if (totalWeightKg <= 50) {
    return {
      type: 'express',
      name: 'Шуурхай хүргэлт (Суудлын / Такси)',
      capacity: '50 кг хүртэл',
      estimatedFee: 10000,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconName: 'Car',
      description: 'Багаж, жижиг цахилгаан тоноглол зэрэг хөнгөн ачаанд тохиромжтой.',
    };
  }
  if (totalWeightKg <= 1200) {
    return {
      type: 'porter_1t',
      name: 'Хөнгөн ачааны Портер / Бонго',
      capacity: '1.2 тонн хүртэл',
      estimatedFee: 35000,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      iconName: 'Truck',
      description: '1-20 шуудай цемент, гипс, хөнгөн дулаалга, дотор засал.',
    };
  }
  if (totalWeightKg <= 3500) {
    return {
      type: 'truck_3t',
      name: '3.5 тоннын ачааны тэрэг (Mighty / Canter)',
      capacity: '3.5 тонн хүртэл',
      estimatedFee: 65000,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      iconName: 'Truck',
      description: '1-3 палет блок, 50 шуудай цемент, арматурын богино бэлдэц.',
    };
  }
  if (totalWeightKg <= 6000) {
    return {
      type: 'crane_5t',
      name: '5 тоннын Манипулятор (Крантай тэрэг)',
      capacity: '5.0 тонн хүртэл',
      estimatedFee: 120000,
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      iconName: 'Cpu',
      description: 'Палеттай блок, арматур, цементийг өргөж буулгах крантай.',
    };
  }
  return {
    type: 'heavy_10t',
    name: '10-20 тоннын Хүнд даацын чиргүүл / Крантай тэрэг',
    capacity: '10-25 тонн',
    estimatedFee: 220000,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    iconName: 'Layers',
    description: 'Төслийн хэмжээний их хэмжээний блок, арматур, задгай цемент.',
  };
}
