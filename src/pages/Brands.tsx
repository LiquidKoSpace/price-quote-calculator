import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search } from 'lucide-react';
import { brandsApi } from '@/lib/api';
import { categories } from '@/lib/mockData';
import BrandCard from '@/components/BrandCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import Reveal from '@/components/Reveal';

const Brands = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: brands, isLoading } = useQuery({
    queryKey: ['brands', selectedCategory],
    queryFn: () => brandsApi.getBrands(selectedCategory),
  });

  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    if (!searchQuery.trim()) return brands;

    const query = searchQuery.toLowerCase();
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(query) ||
      brand.description.toLowerCase().includes(query) ||
      brand.location.toLowerCase().includes(query)
    );
  }, [brands, searchQuery]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container-luxury">
          {/* Header */}
          <div className="mb-12">
            <Reveal width="100%">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Discover Premium Brands
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore our curated collection of exceptional local brands and producers.
                Filter by category to find the perfect match for your retail needs.
              </p>
            </Reveal>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <Reveal width="100%" delay={100}>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search brands by name, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-base rounded-full border-border"
                />
              </div>
            </Reveal>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <Reveal width="100%" delay={200}>
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Filter by Category</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                    px-6 py-3 rounded-full font-medium transition-all
                    ${selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }
                  `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Brands Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="luxury-card animate-pulse">
                  <div className="h-64 bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBrands && filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredBrands.map((brand, index) => (
                <Reveal key={brand.id} delay={index * 50}>
                  <BrandCard brand={brand} className="h-full" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No brands found. Try adjusting your search or filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Brands;
