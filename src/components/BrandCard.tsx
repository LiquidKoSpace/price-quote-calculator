import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Brand } from '@/lib/mockData';

interface BrandCardProps {
  brand: Brand;
  className?: string;
}

const BrandCard = ({ brand, className }: BrandCardProps) => {
  return (
    <Link to={`/brands/${brand.slug}`} className={`luxury-card group block ${className}`}>
      <div className="relative h-64 overflow-hidden w-full">
        <img
          src={brand.heroImage}
          alt={brand.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-primary-foreground text-sm line-clamp-2">
            {brand.description}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-1 group-hover:text-cta transition-colors">
              {brand.name}
            </h3>
            <p className="text-sm text-muted-foreground">{brand.location}</p>
          </div>
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            className="w-12 h-12 rounded-lg object-contain"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {brand.specialties.slice(0, 2).map((specialty) => (
            <span
              key={specialty}
              className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Price Range</p>
            <p className="text-lg font-semibold text-foreground">
              R{brand.priceRange.min} - R{brand.priceRange.max}
            </p>
          </div>
          <div className="flex items-center gap-2 text-cta font-medium group-hover:gap-3 transition-all">
            View Details
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BrandCard;
