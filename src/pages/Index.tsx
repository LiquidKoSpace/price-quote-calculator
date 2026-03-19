import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Users, TrendingUp, Store, Shield, Zap, Globe } from 'lucide-react';
import { brandsApi } from '@/lib/api';
import BrandCard from '@/components/BrandCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

const Index = () => {
  const { data: featuredBrands, isLoading } = useQuery({
    queryKey: ['featured-brands'],
    queryFn: brandsApi.getFeaturedBrands,
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/djnz3asha/image/upload/v1766353721/Gemini_Generated_Image_faoq3ofaoq3ofaoq_bxd2ua.png"
            alt="Premium Local Brands Showcase"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-cta/20" />
        </div>

        <div className="container-luxury relative z-10">
          <div className="max-w-5xl mx-auto text-center pt-[10dvh]">
            <Reveal width="100%">
              <h1 className=" text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-secondary mb-8 tracking-tight leading-tight">
                Where Stores Find <br />
                <span className="text-cta">High-Margin</span> Local Brands
              </h1>
            </Reveal>

            <Reveal width="100%" delay={200}>
              <p className="text-xl md:text-2xl text-secondary/90 mb-12 max-w-3xl mx-auto  leading-relaxed">
                We distribute and showcase curated local brands to the right buyers.
              </p>
            </Reveal>

            <Reveal width="100%" delay={400}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pb-8">
                <Link
                  to="/brands"
                  className="min-w-[200px] px-8 py-5 bg-cta/90 text-background rounded-full font-bold hover:bg-foreground/90 transition-all transform hover:scale-105 shadow-xl"
                >
                  Discover Brands
                </Link>
                <Link
                  to="/for-brands"
                  className="min-w-[200px] px-8 py-5 bg-white border border-gray-200 text-foreground rounded-full font-semibold hover:bg-gray-50 transition-all"
                >
                  List Your Brand
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-12">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Featured Brands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium local brands
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredBrands?.map((brand, index) => (
                  <Reveal key={brand.id} delay={index * 100}>
                    <BrandCard brand={brand} />
                  </Reveal>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/brands"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-cta text-white rounded-full font-semibold hover:scale-105 transition-all"
                >
                  View All Brands
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container-luxury">
          <div className="text-center mb-8">
            <Reveal width="100%">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
                Why Choose Liquid Ko Space?
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                We make it simple to discover and connect with the right partners for your business
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={100} className="h-full">
              <div className="text-center p-6 h-full">
                <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-cta/80" />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                  Vendor Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Every brand is hand-selected for excellence, ensuring you only work with the best local producers
                </p>
              </div>
            </Reveal>

            <Reveal delay={200} className="h-full">
              <div className="text-center p-6 h-full">
                <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-cta/80" />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                  Perfect Matches
                </h3>
                <p className="text-sm text-muted-foreground">
                  We coordinate and connect the right brands with the right retailers for mutual success
                </p>
              </div>
            </Reveal>

            <Reveal delay={300} className="h-full">
              <div className="text-center p-6 h-full">
                <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-cta/80" />
                </div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                  Grow Revenue
                </h3>
                <p className="text-sm text-muted-foreground">
                  Access wholesale pricing, exclusive deals, and ongoing support for long-term partnerships
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-primary text-primary-foreground">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal width="100%">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                Ready to Find Your Perfect Match?
              </h2>
              <p className="text-base text-primary-foreground/90 mb-6">
                Whether you're a retailer looking for quality brands or a producer seeking the right distribution channels,
                we're here to make the connection.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Brand Owners Hero Section - Light Theme */}
      <section className="py-16 bg-background">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal width="100%">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Are you a brand looking for distribution?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get your products discovered and bought by national retailers
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-cta text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                List Your Brand
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why List Your Brand Section - Dark Theme */}
      <section className="py-12 bg-foreground text-background">
        <div className="container-luxury">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">
              Why List Your Brand With Us?
            </h2>
            <p className="text-base text-background/70 max-w-2xl mx-auto">
              We help emerging brands connect with the right retail partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={100} className="h-full">
              <div className="text-center p-6 h-full">
                <div className="w-14 h-14 mx-auto mb-4 bg-background/10 rounded-2xl flex items-center justify-center">
                  <Store className="w-7 h-7 text-cta" />
                </div>
                <h3 className="text-lg font-serif font-bold mb-2">
                  Access Retailers
                </h3>
                <p className="text-sm text-background/70">
                  Connect with quality retailers actively seeking new products for their shelves
                </p>
              </div>
            </Reveal>

            <Reveal delay={200} className="h-full">
              <div className="text-center p-6 h-full">
                <div className="w-14 h-14 mx-auto mb-4 bg-background/10 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-cta" />
                </div>
                <h3 className="text-lg font-serif font-bold mb-2">
                  Grow Sales
                </h3>
                <p className="text-sm text-background/70">
                  Expand your distribution network and increase revenue through new partnerships
                </p>
              </div>
            </Reveal>

            <Reveal delay={300} className="h-full">
              <div className="text-center p-6 h-full">
                <div className="w-14 h-14 mx-auto mb-4 bg-background/10 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-cta" />
                </div>
                <h3 className="text-lg font-serif font-bold mb-2">
                  Build Relationships
                </h3>
                <p className="text-sm text-background/70">
                  We facilitate introductions and help nurture long-term retail partnerships
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section - Light Theme */}
      <section className="py-12 bg-background overflow-x-hidden">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Reveal>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                  Everything You Need to Succeed
                </h2>
                <p className="text-muted-foreground mb-6">
                  We provide the tools and exposure your brand needs to thrive in the retail market.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-cta/80 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Verified Retailers</h4>
                      <p className="text-sm text-muted-foreground">All retailers on our platform are verified and vetted</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-cta/80 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Quick Setup</h4>
                      <p className="text-sm text-muted-foreground">Get your brand listed within days, not weeks</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-cta/80 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">National Reach</h4>
                      <p className="text-sm text-muted-foreground">Access retailers across the country</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} direction="left">
              <div className="bg-foreground rounded-2xl p-8">
                <h3 className="text-xl font-serif font-bold text-background mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-background/80 mb-6">
                  Join hundreds of brands already growing their retail presence through Liquid Ko Space.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cta text-white rounded-full font-semibold hover:scale-105 transition-all"
                >
                  List Your Brand
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
