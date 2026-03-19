import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Calculator, Trash2, Plus, Copy, RotateCcw, Truck, MapPin, Package,
  Percent, DollarSign, Weight, Settings, Loader2, Navigation, Key, Download, Save, Library, Search
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  DEFAULT_RATE_TIERS,
  MINIMUM_SHIPPING_CHARGE,
  calculateDistanceFromCoords,
  calculateShippingCost,
  type RateTier,
} from "@/lib/shippingData";
import { exportQuoteToPDF, exportQuoteToExcel, type QuoteExportData } from "@/lib/exportUtils";
import * as XLSX from "xlsx";

// ── Types ──────────────────────────────────────────────────────────────────

interface ProductLine {
  id: string;
  name: string;
  description: string;
  unitCost: number;
  weightKg: number;
  markupPercent: number; // Individual markup
  quantity: number;
}

interface ShippingAddress {
  unitNumber: string;
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface GeoResult {
  lat: number;
  lng: number;
  formatted: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const uid = () => crypto.randomUUID();

const fmt = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);

const emptyProduct = (): ProductLine => ({
  id: uid(),
  name: "",
  description: "",
  unitCost: 0,
  weightKg: 0,
  markupPercent: 30, // Default 30%
  quantity: 1,
});

const emptyAddress = (): ShippingAddress => ({
  unitNumber: "",
  streetAddress: "",
  suburb: "",
  city: "",
  province: "",
  postalCode: "",
  country: "South Africa",
});

const buildAddressString = (addr: ShippingAddress): string => {
  const parts = [
    addr.unitNumber,
    addr.streetAddress,
    addr.suburb,
    addr.city,
    addr.province,
    addr.postalCode,
    addr.country,
  ].filter(Boolean);
  return parts.join(", ");
};

// ── OpenStreetMap & TomTom Routing/Geocoding ────────────────────────────────────────

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_API_KEY || "";

async function geocodeAddressTomTom(address: string): Promise<GeoResult | null> {
  if (!TOMTOM_KEY) return null;
  const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_KEY}&countrySet=ZA&limit=1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.position.lat,
        lng: result.position.lon,
        formatted: result.address.freeformAddress || address,
      };
    }
  } catch (error) {
    console.error("Geocoding failed", error);
  }
  return null;
}

// TomTom route distance (returns km)
async function getRouteDistance(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number | null> {
  if (!TOMTOM_KEY) return null;
  const url = `https://api.tomtom.com/routing/1/calculateRoute/${lat1},${lng1}:${lat2},${lng2}/json?key=${TOMTOM_KEY}&routeType=fastest&traffic=false`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.routes && data.routes.length > 0) {
      return data.routes[0].summary.lengthInMeters / 1000;
    }
  } catch (error) {
    console.error("Routing failed", error);
  }
  return null;
}

// SA provinces for dropdown
const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
  "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

// ── Component ──────────────────────────────────────────────────────────────

const PriceQuoteCalculator = () => {
  const { toast } = useToast();

  // Product lines
  const [products, setProducts] = useState<ProductLine[]>([emptyProduct()]);

  // Catalog
  const [savedCatalog, setSavedCatalog] = useState<ProductLine[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").order("name");
        if (error) throw error;
        
        if (data) {
          const formatted = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            description: d.description || "",
            unitCost: Number(d.unit_cost),
            weightKg: Number(d.weight_kg) || 0,
            markupPercent: Number(d.markup_percent || 30),
            quantity: 1,
          }));
          setSavedCatalog(formatted);
        }
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setIsLoadingCatalog(false);
      }
    };
    fetchCatalog();
  }, []);

  const saveToCatalog = async (p: ProductLine) => {
    if (!p.name.trim()) {
      toast({ title: "Name required", description: "Please enter a product name before saving.", variant: "destructive" });
      return;
    }

    let dbId = uid();
    const existingItem = savedCatalog.find((x) => x.name.toLowerCase() === p.name.trim().toLowerCase());
    if (existingItem) {
      dbId = existingItem.id;
    }

    try {
      const { error } = await supabase.from("products").upsert({
        id: dbId,
        name: p.name.trim(),
        description: p.description,
        unit_cost: p.unitCost,
        weight_kg: p.weightKg,
        markup_percent: p.markupPercent
      } as any);

      if (error) throw error;

      if (existingItem) {
        setSavedCatalog(savedCatalog.map(x => x.id === dbId ? { ...x, unitCost: p.unitCost, weightKg: p.weightKg, description: p.description, markupPercent: p.markupPercent } : x));
        toast({ title: "Updated in Catalog", description: `"${p.name}" has been updated.` });
      } else {
        setSavedCatalog([...savedCatalog, { ...p, id: dbId, quantity: 1 }]);
        toast({ title: "Saved to Database", description: `"${p.name}" has been securely saved.` });
      }
    } catch (err) {
      console.error("Save error:", err);
      toast({ title: "Save Failed", description: "Could not save to the database. Have you run the SQL script?", variant: "destructive" });
    }
  };

  const loadFromCatalog = (catalogItem: ProductLine) => {
    setProducts((p) => [...p, { ...catalogItem, id: uid(), quantity: 1 }]);
    toast({ title: "Added to Quote", description: `"${catalogItem.name}" was added.` });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          toast({ title: "Empty file", description: "No data found in the uploaded file.", variant: "destructive" });
          return;
        }

        const loadingToast = toast({ title: "Importing...", description: `Processing ${data.length} products...` });

        const formatted = data.map((row: any) => {
          // Fuzzy mapping for common headers
          const name = row["Product Name"] || row["name"] || row["Name"] || "";
          const desc = row["Product Description"] || row["description"] || row["Description"] || "";
          const cost = parseFloat(row["Unit Cost (R)"] || row["unit_cost"] || row["Cost"] || row["Unit Cost"] || "0");
          const weight = parseFloat(row["Weight (kg)"] || row["weight_kg"] || row["Weight"] || row["Weight (kg)"] || "0");
          const markup = parseFloat(row["Markup %"] || row["markup_percent"] || row["Markup"] || "30");

          return {
            id: uid(),
            name: String(name).trim(),
            description: String(desc).trim(),
            unit_cost: cost,
            weight_kg: weight,
            markup_percent: markup
          };
        }).filter(item => item.name); // must have a name

        const { error } = await supabase.from("products").upsert(formatted as any);
        if (error) throw error;

        // Refresh catalog
        const { data: newData } = await supabase.from("products").select("*").order("name");
        if (newData) {
          setSavedCatalog(newData.map((d: any) => ({
            id: d.id,
            name: d.name,
            description: d.description || "",
            unitCost: Number(d.unit_cost),
            weightKg: Number(d.weight_kg) || 0,
            markupPercent: Number(d.markup_percent || 30),
            quantity: 1,
          })));
        }

        toast({ title: "Import Successful!", description: `Succesfully imported ${formatted.length} products to your catalog.` });
      } catch (err) {
        console.error("Bulk upload error:", err);
        toast({ title: "Import Failed", description: "Make sure your headers match (e.g. 'Product Name', 'Unit Cost (R)').", variant: "destructive" });
      } finally {
        e.target.value = ""; // clear input
      }
    };
    reader.readAsBinaryString(file);
  };

  // Labour
  const [labourValue, setLabourValue] = useState(0);
  const [labourIsPercent, setLabourIsPercent] = useState(false);

  // Shipping addresses
  const [originAddr, setOriginAddr] = useState<ShippingAddress>(emptyAddress());
  const [destAddr, setDestAddr] = useState<ShippingAddress>(emptyAddress());
  const [weight, setWeight] = useState(1);
  const [shippingOverride, setShippingOverride] = useState(false);
  const [customShipping, setCustomShipping] = useState(0);

  // Geocoding results
  const [originGeo, setOriginGeo] = useState<GeoResult | null>(null);
  const [destGeo, setDestGeo] = useState<GeoResult | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Editable rate tiers
  const [rateTiers, setRateTiers] = useState<RateTier[]>(() =>
    DEFAULT_RATE_TIERS.map((t) => ({ ...t }))
  );

  // Markup removed as global state
  // const [markupPercent, setMarkupPercent] = useState(30);

  // ── Derived values ─────

  const productsTotal = useMemo(
    () => products.reduce((sum, p) => sum + p.unitCost * p.quantity, 0),
    [products]
  );

  const labourCost = useMemo(
    () => (labourIsPercent ? (labourValue / 100) * productsTotal : labourValue),
    [labourValue, labourIsPercent, productsTotal]
  );

  const [distanceKm, setDistanceKm] = useState(0);

  // Auto-calculate weight from products
  const totalProductsWeight = useMemo(
    () => products.reduce((sum, p) => sum + (p.weightKg * p.quantity), 0),
    [products]
  );

  // Sync weight if not manually overridden (optional)
  useEffect(() => {
    if (!shippingOverride) {
      setWeight(totalProductsWeight);
    }
  }, [totalProductsWeight, shippingOverride]);

  // If geo changes (e.g. from reset), clear distance
  useEffect(() => {
    if (!originGeo || !destGeo) setDistanceKm(0);
  }, [originGeo, destGeo]);

  const shippingCost = useMemo(() => {
    if (shippingOverride) return customShipping;
    if (distanceKm <= 0) return 0;
    return calculateShippingCost(distanceKm, weight, rateTiers);
  }, [shippingOverride, customShipping, distanceKm, weight, rateTiers]);

  // ── MARKUP & TOTALS ─────
  
  // Total Markup is the sum of markups for each product
  const markupAmount = useMemo(
    () => products.reduce((sum, p) => sum + (p.unitCost * p.quantity * (p.markupPercent / 100)), 0),
    [products]
  );
  
  const subtotal = productsTotal + markupAmount; // total cost + total profit markup
  const finalPrice = subtotal + labourCost + shippingCost;

  // Active rate tier
  const activeTier = useMemo(() => {
    if (distanceKm <= 0) return null;
    return rateTiers.find((t) => distanceKm <= t.maxDistanceKm) ?? rateTiers[rateTiers.length - 1];
  }, [distanceKm, rateTiers]);

  // ── Product handlers ─────

  const addProduct = useCallback(() => setProducts((p) => [...p, emptyProduct()]), []);
  const removeProduct = useCallback(
    (id: string) => setProducts((p) => (p.length === 1 ? [emptyProduct()] : p.filter((x) => x.id !== id))),
    []
  );
  const updateProduct = useCallback(
    (id: string, field: keyof ProductLine, value: string | number) =>
      setProducts((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x))),
    []
  );

  // ── Geocoding handler ─────

  const handleCalculateDistance = async () => {
    const originStr = buildAddressString(originAddr);
    const destStr = buildAddressString(destAddr);

    if (!originStr || !destStr) {
      toast({ title: "Addresses required", description: "Please fill in at least the city for both origin and destination.", variant: "destructive" });
      return;
    }
    
    if (!TOMTOM_KEY && (!originGeo || !destGeo)) {
      toast({ title: "API Key Required", description: "The TomTom API key is missing from your .env.local file.", variant: "destructive" });
      return;
    }

    setIsGeocoding(true);
    try {
      // If we already captured the exact geo from autocomplete, use it!
      // Otherwise fallback to TomTom for a fresh geocoding request.
      const oGeo = originGeo || await geocodeAddressTomTom(originStr);
      const dGeo = destGeo || await geocodeAddressTomTom(destStr);

      if (!oGeo) {
        toast({ title: "Origin not found", description: `Could not geocode: "${originStr}"`, variant: "destructive" });
      }
      if (!dGeo) {
        toast({ title: "Destination not found", description: `Could not geocode: "${destStr}"`, variant: "destructive" });
      }

      setOriginGeo(oGeo);
      setDestGeo(dGeo);

      if (oGeo && dGeo) {
        const routeDist = await getRouteDistance(oGeo.lat, oGeo.lng, dGeo.lat, dGeo.lng);
        if (routeDist !== null) {
          setDistanceKm(Math.round(routeDist));
          toast({ title: "Distance calculated!", description: `Route resolved successfully via TomTom.` });
        } else {
          // Fallback
          const fallback = calculateDistanceFromCoords(oGeo.lat, oGeo.lng, dGeo.lat, dGeo.lng);
          setDistanceKm(fallback);
          toast({ title: "Distance estimated", description: `Used straight-line estimation as route calculation failed.` });
        }
      }
    } catch (err) {
      toast({ title: "Geocoding error", description: String(err), variant: "destructive" });
    } finally {
      setIsGeocoding(false);
    }
  };

  // ── Rate tier update ─────

  const updateTierRate = (index: number, field: "baseRate" | "incrementalFee", val: number) => {
    setRateTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: val } : t))
    );
  };

  // ── Reset ─────

  const resetAll = () => {
    setProducts([emptyProduct()]);
    setLabourValue(0);
    setLabourIsPercent(false);
    setOriginAddr(emptyAddress());
    setDestAddr(emptyAddress());
    setOriginGeo(null);
    setDestGeo(null);
    setDistanceKm(0);
    setWeight(0);
    setShippingOverride(false);
    setCustomShipping(0);
    setRateTiers(DEFAULT_RATE_TIERS.map((t) => ({ ...t })));
  };

  // ── Copy Quote ─────

  const copyQuote = async () => {
    let text = "═══ PRICE QUOTE ═══\n\n";
    text += "PRODUCTS\n";
    products.forEach((p) => {
      const sub = p.unitCost * p.quantity * (1 + p.markupPercent / 100);
      text += `  • ${p.name || "Unnamed"} (${p.weightKg}kg)${p.description ? ` — ${p.description}` : ""}\n`;
      text += `    ${p.quantity} × ${fmt(p.unitCost)} (+${p.markupPercent}% markup) = ${fmt(sub)}\n`;
    });
    text += `  Products Total Cost: ${fmt(productsTotal)}\n`;
    text += `  Total Profit Markup: ${fmt(markupAmount)}\n`;
    text += `  Selling Price of Goods: ${fmt(subtotal)}\n\n`;
    text += `LABOUR: ${fmt(labourCost)}${labourIsPercent ? ` (${labourValue}%)` : ""}\n\n`;
    text += `SHIPPING\n`;
    text += `  From: ${(originGeo?.formatted ?? buildAddressString(originAddr)) || "—"}\n`;
    text += `  To:   ${(destGeo?.formatted ?? buildAddressString(destAddr)) || "—"}\n`;
    text += `  Distance: ~${distanceKm.toLocaleString()} km\n`;
    text += `  Weight: ${weight} kg\n`;
    text += `  Cost: ${fmt(shippingCost)}\n\n`;
    text += `──────────────\n`;
    text += `FINAL SELLING PRICE: ${fmt(finalPrice)}\n`;

    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Quote copied!", description: "The price quote has been copied to your clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy to clipboard.", variant: "destructive" });
    }
  };

  // ── Export ─────

  const getExportData = (): QuoteExportData => ({
    products: products.map(p => ({
      name: p.name,
      description: p.description,
      unitCost: p.unitCost,
      weightKg: p.weightKg,
      markupPercent: p.markupPercent,
      quantity: p.quantity
    })),
    productsTotal,
    markupAmount,
    subtotal,
    labourIsPercent,
    labourValue,
    labourCost,
    originStr: originGeo?.formatted ?? buildAddressString(originAddr),
    destStr: destGeo?.formatted ?? buildAddressString(destAddr),
    distanceKm,
    weight,
    shippingCost,
    finalPrice
  });

  const handleExportPDF = () => {
    exportQuoteToPDF(getExportData());
    toast({ title: "PDF Exported", description: "Your price quote has been saved as a PDF." });
  };

  const handleExportExcel = () => {
    exportQuoteToExcel(getExportData());
    toast({ title: "Excel Exported", description: "Your price quote has been saved as an Excel file." });
  };

  // ── Address Form sub-component ─────

  const AddressForm = ({
    title,
    icon,
    address,
    setAddress,
    geoResult,
    setGeoResult,
  }: {
    title: string;
    icon: React.ReactNode;
    address: ShippingAddress;
    setAddress: (addr: ShippingAddress) => void;
    geoResult: GeoResult | null;
    setGeoResult?: (val: GeoResult | null) => void;
  }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
      if (!query || query.length < 3) {
        setSuggestions([]);
        return;
      }
      const delayFn = setTimeout(async () => {
        if (!TOMTOM_KEY) return;
        setIsSearching(true);
        try {
          const res = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${TOMTOM_KEY}&countrySet=ZA&limit=5`);
          const data = await res.json();
          if (data && data.results) {
            setSuggestions(data.results);
          }
        } catch (e) {
          console.error("Autocomplete error", e);
        } finally {
          setIsSearching(false);
        }
      }, 400);

      return () => clearTimeout(delayFn);
    }, [query]);

    const handleSelect = (result: any) => {
      const addrData = result.address || {};
      const pos = result.position || {};
      
      const text = addrData.streetName || addrData.street || result.poi?.name || "";
      const suburb = addrData.municipalitySubdivision || addrData.localName || "";
      const city = addrData.municipality || "";
      const province = addrData.countrySubdivision || "";
      const postcode = addrData.postalCode || "";
      const formatted = addrData.freeformAddress || "";

      setAddress({
        ...address,
        streetAddress: text,
        suburb: suburb,
        city: city,
        province: province,
        postalCode: postcode,
        country: "South Africa"
      });

      if (setGeoResult) {
        setGeoResult({
          lat: pos.lat,
          lng: pos.lon,
          formatted: formatted
        });
      }
      setQuery(formatted);
      setShowSuggestions(false);
    };

    const update = (field: keyof ShippingAddress, val: string) =>
      setAddress({ ...address, [field]: val });

    return (
      <div className="space-y-3">
        <Label className="text-xs text-gray-400 flex items-center gap-1">{icon}{title}</Label>
        
        {/* Autocomplete Search input */}
        <div className="relative">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-md focus-within:ring-1 focus-within:ring-amber-500/50 transition-all">
            <Search className="w-4 h-4 text-gray-400 ml-3" />
            <Input
              className="bg-transparent border-0 text-white placeholder:text-gray-500 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder={TOMTOM_KEY ? "Search / auto-fill address..." : "TomTom API Key missing from .env"}
              disabled={!TOMTOM_KEY}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                if (setGeoResult && geoResult) setGeoResult(null); // clear geometry if they start searching new string
              }}
              onFocus={() => { if (query) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {isSearching && <Loader2 className="w-4 h-4 text-gray-400 mr-3 animate-spin" />}
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 top-full inset-x-0 mt-1 bg-gray-800 border border-white/10 rounded-md shadow-xl overflow-hidden max-h-64 overflow-y-auto">
              {suggestions.map((s, idx) => {
                const title = s.poi?.name || s.address?.streetName || s.address?.freeformAddress || "Unknown Place";
                const subtitle = s.address?.freeformAddress || "";
                return (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-0"
                    onClick={() => handleSelect(s)}
                  >
                    <div className="font-medium">{title}</div>
                    <div className="text-xs text-gray-500 truncate">{subtitle}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-2">
            <Input
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm"
              placeholder="Unit / Complex"
              value={address.unitNumber}
              onChange={(e) => update("unitNumber", e.target.value)}
            />
          </div>
          <div className="col-span-4">
            <Input
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm"
              placeholder="Street Address"
              value={address.streetAddress}
              onChange={(e) => update("streetAddress", e.target.value)}
            />
          </div>
          <div className="col-span-3">
            <Input
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm"
              placeholder="Suburb"
              value={address.suburb}
              onChange={(e) => update("suburb", e.target.value)}
            />
          </div>
          <div className="col-span-3">
            <Input
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm"
              placeholder="City / Town"
              value={address.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <div className="col-span-3">
            <select
              className="w-full h-9 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              value={address.province}
              onChange={(e) => update("province", e.target.value)}
            >
              <option value="" className="bg-gray-900">Province</option>
              {SA_PROVINCES.map((p) => (
                <option key={p} value={p} className="bg-gray-900">{p}</option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <Input
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
            />
          </div>
        </div>
        {geoResult && (
          <div className="text-xs text-emerald-400/80 bg-emerald-500/5 rounded px-3 py-1.5 border border-emerald-500/10">
            ✓ Resolved: {geoResult.formatted}
          </div>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="pt-10 pb-6 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
            <Calculator className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            Price Quote Calculator
          </h1>
        </div>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          Calculate selling prices with product costs, profit markup, labour, and distance-based shipping.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN: Inputs ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ─── 1. Product Line Items ─── */}
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-lg shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-300">
                <Package className="w-5 h-5" /> Product Line Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="bg-white/[0.03] rounded-lg p-3 border border-white/5 transition-all hover:border-white/10 space-y-3"
                >
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <Label className="text-xs text-gray-400 mb-1 block">Product Name</Label>
                      <div className="relative group">
                        <Input
                          placeholder="Scan or type product name..."
                          value={p.name}
                          onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-9 group-hover:border-amber-500/30 transition-colors"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-amber-500/50 transition-colors" />
                      </div>
                    </div>

                    <div className="w-24">
                      <Label className="text-xs text-gray-400 mb-1 block">Unit Cost (R)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={p.unitCost || ""}
                        onChange={(e) => updateProduct(p.id, "unitCost", parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="w-20">
                      <Label className="text-xs text-gray-400 mb-1 block">Markup %</Label>
                      <Input
                        type="number"
                        min={0}
                        value={p.markupPercent || ""}
                        onChange={(e) => updateProduct(p.id, "markupPercent", parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-amber-500/20 text-amber-300 focus:border-amber-500"
                      />
                    </div>

                    <div className="w-20">
                      <Label className="text-xs text-gray-400 mb-1 block">Weight (kg)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.1}
                        value={p.weightKg || ""}
                        onChange={(e) => updateProduct(p.id, "weightKg", parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="w-20">
                      <Label className="text-xs text-gray-400 mb-1 block">Qty</Label>
                      <Input
                        id={`product-qty-${p.id}`}
                        type="number"
                        min={1}
                        className="bg-white/5 border-white/10 text-white px-2 text-center"
                        value={p.quantity || ""}
                        onChange={(e) => updateProduct(p.id, "quantity", parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex justify-end gap-1">
                      {i === 0 && <Label className="text-xs text-transparent mb-1 block">×</Label>}
                      <Button
                        id={`save-product-${p.id}`}
                        variant="ghost"
                        size="icon"
                        title="Save to Catalog"
                        className="text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 h-9 w-9"
                        onClick={() => saveToCatalog(p)}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        id={`remove-product-${p.id}`}
                        variant="ghost"
                        size="icon"
                        title="Remove"
                        className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 h-9 w-9"
                        onClick={() => removeProduct(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="col-span-12 sm:col-span-2 text-right">
                      {i === 0 && <Label className="text-xs text-gray-400 mb-1 block">Subtotal</Label>}
                      <span className="text-sm font-medium text-emerald-400 block py-2">
                        {fmt(p.unitCost * p.quantity)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12">
                      <Input
                        className="bg-white/2 border-white/5 text-xs text-gray-400 h-8"
                        placeholder="Product Description (optional)..."
                        value={p.description || ""}
                        onChange={(e) => updateProduct(p.id, "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  id="add-product-btn"
                  variant="outline"
                  className="w-full border-dashed border-white/20 text-gray-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all"
                  onClick={addProduct}
                >
                  <Plus className="w-4 h-4 mr-2" /> Blank Product
                </Button>

                {savedCatalog.length > 0 ? (
                  <select
                    className="w-full h-10 rounded-md bg-white/5 border-dashed border border-white/20 text-gray-400 text-sm px-3 hover:text-amber-300 hover:border-amber-500/40 focus:outline-none transition-all cursor-pointer"
                    onChange={(e) => {
                      if (e.target.value) {
                        const item = savedCatalog.find((x) => x.id === e.target.value);
                        if (item) loadFromCatalog(item);
                        e.target.value = ""; // reset select
                      }
                    }}
                  >
                    <option value="" className="bg-gray-900">╵+ Add from Catalog...</option>
                    {savedCatalog.map((p) => (
                      <option key={p.id} value={p.id} className="bg-gray-900">
                        {p.name} (R{p.unitCost})
                      </option>
                    ))}
                  </select>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full border-dashed border-white/20 text-gray-600 cursor-not-allowed"
                  >
                    <Library className="w-4 h-4 mr-2" /> Catalog Empty
                  </Button>
                )}
                
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="bulk-import-input"
                    className="hidden"
                    accept=".csv, .xlsx, .xls"
                    onChange={handleBulkUpload}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("bulk-import-input")?.click()}
                    className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Download className="w-4 h-4 mr-2 rotate-180" /> Bulk Import (Excel/CSV)
                  </Button>
                  <p className="text-[10px] text-gray-600 text-center italic">
                    Headers: "Product Name", "Unit Cost (R)", "Weight (kg)"
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <span className="text-sm text-gray-400">
                  Products Total:{" "}
                  <span className="text-lg font-semibold text-white">{fmt(productsTotal)}</span>
                </span>
              </div>
            </CardContent>
          </Card>



          {/* ─── 3. Labour Cost ─── */}
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-lg shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-300">
                <DollarSign className="w-5 h-5" /> Labour Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-gray-400 mb-1 block">
                    {labourIsPercent ? "Percentage of Products Total" : "Flat Fee (R)"}
                  </Label>
                  <Input
                    id="labour-input"
                    type="number"
                    min={0}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="0"
                    value={labourValue || ""}
                    onChange={(e) => setLabourValue(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center gap-3 pb-1">
                  <Label className="text-xs text-gray-400 cursor-pointer" htmlFor="labour-toggle">
                    Flat
                  </Label>
                  <Switch
                    id="labour-toggle"
                    checked={labourIsPercent}
                    onCheckedChange={setLabourIsPercent}
                    className="data-[state=checked]:bg-amber-500"
                  />
                  <Label className="text-xs text-gray-400 cursor-pointer" htmlFor="labour-toggle">
                    %
                  </Label>
                </div>
                <div className="text-right sm:pb-1">
                  <span className="text-sm text-gray-400">
                    Labour:{" "}
                    <span className="text-white font-medium">{fmt(labourCost)}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─── 4. Shipping ─── */}
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-lg shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-300">
                <Truck className="w-5 h-5" /> Distance-Based Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Origin address */}
              <AddressForm
                title="Origin Address (Warehouse / Head Office)"
                icon={<MapPin className="w-3 h-3" />}
                address={originAddr}
                setAddress={(a) => { setOriginAddr(a); setOriginGeo(null); }}
                geoResult={originGeo}
                setGeoResult={setOriginGeo}
              />

              <Separator className="bg-white/5" />

              {/* Destination address */}
              <AddressForm
                title="Delivery Address (Customer)"
                icon={<Navigation className="w-3 h-3" />}
                address={destAddr}
                setAddress={(a) => { setDestAddr(a); setDestGeo(null); }}
                geoResult={destGeo}
                setGeoResult={setDestGeo}
              />

              {/* Calculate distance button */}
              <Button
                id="calc-distance-btn"
                onClick={handleCalculateDistance}
                disabled={isGeocoding}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium transition-all"
              >
                {isGeocoding ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Geocoding…</>
                ) : (
                  <><MapPin className="w-4 h-4 mr-2" /> Calculate Distance (Free Routing)</>
                )}
              </Button>

              {/* Distance result + weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">
                    <Weight className="w-3 h-3 inline mr-1" />Shipment Weight (kg)
                  </Label>
                  <Input
                    id="weight-input"
                    type="number"
                    min={0.1}
                    step={0.1}
                    className="bg-white/5 border-white/10 text-white"
                    value={weight || ""}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  {distanceKm > 0 && (
                    <div className="bg-white/[0.04] rounded-lg px-4 py-3 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-gray-400">Routed Distance (km)</Label>
                        <Input
                          type="number"
                          min={0}
                          className="h-7 w-24 bg-white/5 border-white/10 text-white text-sm px-2 text-right"
                          value={distanceKm || ""}
                          onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      {activeTier && !shippingOverride && (
                        <div className="text-xs text-gray-400 text-right">
                          Matched Tier:{" "}
                          <span className="text-amber-300">{activeTier.label}</span>{" "}
                          (@ {fmt(activeTier.baseRate)} Base)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Override toggle */}
              <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3 border border-white/5">
                <Label className="text-sm text-gray-300 cursor-pointer" htmlFor="shipping-override">
                  Override with custom shipping amount
                </Label>
                <Switch
                  id="shipping-override"
                  checked={shippingOverride}
                  onCheckedChange={setShippingOverride}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>

              {shippingOverride && (
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Custom Shipping (R)</Label>
                  <Input
                    id="custom-shipping-input"
                    type="number"
                    min={0}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="0.00"
                    value={customShipping || ""}
                    onChange={(e) => setCustomShipping(parseFloat(e.target.value) || 0)}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <span className="text-sm text-gray-400">
                  Shipping:{" "}
                  <span className="text-white font-medium">{fmt(shippingCost)}</span>
                </span>
              </div>

              {/* ─── Editable Rate Tiers ─── */}
              {!shippingOverride && (
                <div className="bg-white/[0.02] rounded-lg border border-white/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Shipping Rate Tiers</span>
                    <span className="text-xs text-gray-600">(editable)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {rateTiers.map((t, i) => (
                      <div
                        key={i}
                        className={`rounded-md px-3 py-2.5 border transition-all ${
                          activeTier === t
                            ? "bg-amber-500/10 border-amber-500/30"
                            : "bg-white/[0.02] border-white/5"
                        }`}
                      >
                        <div className={`text-xs font-medium mb-1.5 ${activeTier === t ? "text-amber-300" : "text-gray-400"}`}>
                          {t.label}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 w-8">Base:</span>
                            <span className="text-xs text-gray-500">R</span>
                            <Input
                              type="number"
                              min={0}
                              className="h-6 bg-white/5 border-white/10 text-white text-xs px-1 w-14"
                              value={t.baseRate}
                              onChange={(e) => updateTierRate(i, "baseRate", parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-[10px] text-gray-500">(up to 5kg)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 w-8">Excess:</span>
                            <span className="text-xs text-gray-500">R</span>
                            <Input
                              type="number"
                              min={0}
                              step={0.1}
                              className="h-6 bg-white/5 border-white/10 text-white text-xs px-1 w-14"
                              value={t.incrementalFee}
                              onChange={(e) => updateTierRate(i, "incrementalFee", parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-[10px] text-gray-500">/kg extra</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN: Quote Summary ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-amber-500/20 backdrop-blur-xl shadow-2xl shadow-amber-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-center bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  Quote Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Breakdown rows */}
                <div className="space-y-3">
                  <SummaryRow label="Products Total" value={productsTotal} />
                  <SummaryRow 
                    label="Profit Markup (Itemized)" 
                    value={markupAmount} 
                    highlight 
                  />
                  <Separator className="bg-white/10" />
                  <SummaryRow label="Products + Markup" value={subtotal} bold />
                  <SummaryRow label={`Labour${labourIsPercent ? ` (${labourValue}%)` : ""}`} value={labourCost} />
                  <SummaryRow 
                    label="Shipping" 
                    value={shippingCost} 
                    subLabel={!shippingOverride && activeTier ? `${fmt(activeTier.baseRate)} Base + ${fmt(Math.max(0, weight - 5) * activeTier.incrementalFee)} Excess` : ""}
                  />
                  <Separator className="bg-amber-500/30" />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-base font-bold text-white">Final Selling Price</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                      {fmt(finalPrice)}
                    </span>
                  </div>
                </div>

                {/* Margin info */}
                {finalPrice > 0 && productsTotal + markupAmount > 0 && (
                  <div className="bg-white/[0.04] rounded-lg px-4 py-3 border border-white/5 text-center">
                    <div className="text-xs text-gray-400">Total Profit Margin</div>
                    <div className="text-lg font-semibold text-emerald-400">
                      {`${((markupAmount / (productsTotal + markupAmount)) * 100).toFixed(1)}%`}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    id="copy-quote-btn"
                    onClick={copyQuote}
                    className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold transition-all"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button
                    id="export-pdf-btn"
                    onClick={handleExportPDF}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    id="export-excel-btn"
                    onClick={handleExportExcel}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    id="reset-btn"
                    variant="outline"
                    onClick={resetAll}
                    className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Summary Row sub-component ──────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  bold,
  highlight,
  subLabel,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
  subLabel?: string;
}) {
  return (
    <div className={`flex justify-between items-center ${subLabel ? "items-start" : "items-center"}`}>
      <div className="flex flex-col">
        <span className={`text-sm ${bold ? "font-semibold text-white" : "text-gray-400"}`}>{label}</span>
        {subLabel && <span className="text-[10px] text-gray-500 italic">{subLabel}</span>}
      </div>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-amber-300" : bold ? "text-white" : "text-gray-300"
        }`}
      >
        {fmt(value)}
      </span>
    </div>
  );
}

export default PriceQuoteCalculator;
