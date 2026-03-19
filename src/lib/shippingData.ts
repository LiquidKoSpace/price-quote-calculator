// ── South African city coordinates & distance-based shipping calculations ──

export interface City {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
}

export interface RateTier {
  maxDistanceKm: number; // use Infinity for the final tier
  baseRate: number;      // Fixed cost for up to 5kg
  incrementalFee: number; // Cost per kg for weight over 5kg
  label: string;
}

// ~30 major SA cities/towns with approximate coordinates
export const SA_CITIES: City[] = [
  { id: "johannesburg", name: "Johannesburg", province: "Gauteng", lat: -26.2041, lng: 28.0473 },
  { id: "pretoria", name: "Pretoria", province: "Gauteng", lat: -25.7479, lng: 28.2293 },
  { id: "centurion", name: "Centurion", province: "Gauteng", lat: -25.8603, lng: 28.1894 },
  { id: "sandton", name: "Sandton", province: "Gauteng", lat: -26.1076, lng: 28.0567 },
  { id: "springs", name: "Springs", province: "Gauteng", lat: -26.2528, lng: 28.4428 },
  { id: "benoni", name: "Benoni", province: "Gauteng", lat: -26.1886, lng: 28.3206 },
  { id: "boksburg", name: "Boksburg", province: "Gauteng", lat: -26.2124, lng: 28.2556 },
  { id: "vereeniging", name: "Vereeniging", province: "Gauteng", lat: -26.6736, lng: 27.9318 },
  { id: "cape_town", name: "Cape Town", province: "Western Cape", lat: -33.9249, lng: 18.4241 },
  { id: "stellenbosch", name: "Stellenbosch", province: "Western Cape", lat: -33.9346, lng: 18.8602 },
  { id: "paarl", name: "Paarl", province: "Western Cape", lat: -33.7340, lng: 18.9699 },
  { id: "george", name: "George", province: "Western Cape", lat: -33.9631, lng: 22.4617 },
  { id: "worcester", name: "Worcester", province: "Western Cape", lat: -33.6468, lng: 19.4481 },
  { id: "durban", name: "Durban", province: "KwaZulu-Natal", lat: -29.8587, lng: 31.0218 },
  { id: "pietermaritzburg", name: "Pietermaritzburg", province: "KwaZulu-Natal", lat: -29.6006, lng: 30.3794 },
  { id: "richards_bay", name: "Richards Bay", province: "KwaZulu-Natal", lat: -28.7807, lng: 32.0383 },
  { id: "port_elizabeth", name: "Gqeberha (Port Elizabeth)", province: "Eastern Cape", lat: -33.9608, lng: 25.6022 },
  { id: "east_london", name: "East London", province: "Eastern Cape", lat: -33.0153, lng: 27.9116 },
  { id: "mthatha", name: "Mthatha", province: "Eastern Cape", lat: -31.5890, lng: 28.7844 },
  { id: "bloemfontein", name: "Bloemfontein", province: "Free State", lat: -29.0852, lng: 26.1596 },
  { id: "welkom", name: "Welkom", province: "Free State", lat: -27.9767, lng: 26.7135 },
  { id: "polokwane", name: "Polokwane", province: "Limpopo", lat: -23.9045, lng: 29.4689 },
  { id: "tzaneen", name: "Tzaneen", province: "Limpopo", lat: -23.8325, lng: 30.1633 },
  { id: "nelspruit", name: "Mbombela (Nelspruit)", province: "Mpumalanga", lat: -25.4753, lng: 30.9694 },
  { id: "witbank", name: "Emalahleni (Witbank)", province: "Mpumalanga", lat: -25.8715, lng: 29.2331 },
  { id: "middelburg_mp", name: "Middelburg (Mpumalanga)", province: "Mpumalanga", lat: -25.7749, lng: 29.4632 },
  { id: "rustenburg", name: "Rustenburg", province: "North West", lat: -25.6715, lng: 27.2420 },
  { id: "klerksdorp", name: "Klerksdorp", province: "North West", lat: -26.8521, lng: 26.6667 },
  { id: "kimberley", name: "Kimberley", province: "Northern Cape", lat: -28.7282, lng: 24.7499 },
  { id: "upington", name: "Upington", province: "Northern Cape", lat: -28.4572, lng: 21.2567 },
];

export const DEFAULT_RATE_TIERS: RateTier[] = [
  { maxDistanceKm: 50, baseRate: 95, incrementalFee: 6.5, label: "0 – 50 km" },
  { maxDistanceKm: 200, baseRate: 125, incrementalFee: 8.5, label: "51 – 200 km" },
  { maxDistanceKm: 500, baseRate: 160, incrementalFee: 11, label: "201 – 500 km" },
  { maxDistanceKm: 1000, baseRate: 195, incrementalFee: 14, label: "501 – 1 000 km" },
  { maxDistanceKm: 1500, baseRate: 235, incrementalFee: 17, label: "1 001 – 1 500 km" },
  { maxDistanceKm: Infinity, baseRate: 285, incrementalFee: 21, label: "1 500 km +" },
];

export const SHIPPING_BASE_WEIGHT_LIMIT = 5; // 5kg included in base rate
export const MINIMUM_SHIPPING_CHARGE = 0; // The base rate is essentially the minimum now

/**
 * Haversine distance between two coordinates in kilometres.
 */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Approximate road distance from raw coordinates.
 * Uses Haversine × 1.3 factor to account for road routing.
 */
export function calculateDistanceFromCoords(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const straightLine = haversineKm(lat1, lng1, lat2, lng2);
  return Math.round(straightLine * 1.3);
}

/**
 * Approximate road distance between two cities by ID.
 * Uses Haversine × 1.3 factor to account for road routing.
 */
export function calculateDistance(originId: string, destinationId: string): number {
  if (originId === destinationId) return 0;

  const origin = SA_CITIES.find((c) => c.id === originId);
  const dest = SA_CITIES.find((c) => c.id === destinationId);
  if (!origin || !dest) return 0;

  return calculateDistanceFromCoords(origin.lat, origin.lng, dest.lat, dest.lng);
}

export function calculateShippingCost(
  distanceKm: number,
  weightKg: number,
  rateTiers: RateTier[] = DEFAULT_RATE_TIERS,
  baseWeightLimit: number = SHIPPING_BASE_WEIGHT_LIMIT
): number {
  if (distanceKm <= 0 || weightKg <= 0) return 0;

  const tier = rateTiers.find((t) => distanceKm <= t.maxDistanceKm) ?? rateTiers[rateTiers.length - 1];
  
  // Logic: Base Rate + (Remaining Weight * Incremental Fee)
  const excessWeight = Math.max(0, weightKg - baseWeightLimit);
  const cost = tier.baseRate + (excessWeight * tier.incrementalFee);
  
  return cost;
}
