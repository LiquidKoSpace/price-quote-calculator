import { mockBrands, Brand } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const brandsApi = {
  // Get all brands with optional category filter
  getBrands: async (category?: string): Promise<Brand[]> => {
    await delay(500); // Simulate network delay
    
    if (!category || category === 'all') {
      return mockBrands;
    }
    
    return mockBrands.filter(brand => brand.category === category);
  },

  // Get a single brand by slug
  getBrand: async (slug: string): Promise<Brand | undefined> => {
    await delay(300);
    return mockBrands.find(brand => brand.slug === slug);
  },

  // Get featured brands
  getFeaturedBrands: async (): Promise<Brand[]> => {
    await delay(400);
    return mockBrands.filter(brand => brand.featured);
  },

  // Submit contact inquiry (mock)
  submitInquiry: async (data: {
    brandId: string;
    name: string;
    email: string;
    company: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    await delay(800);
    
    // Simulate success response
    return {
      success: true,
      message: 'Your inquiry has been received. We\'ll be in touch within 24 hours.',
    };
  },
};
