import { Link } from 'react-router-dom';
import { ArrowRight, Store, TrendingUp, Users, Shield, Zap, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

const ForBrands = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg-light-2.jpg"
            alt="Premium Showroom Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
        </div>

        <div className="container-luxury relative z-10">
          <Reveal width="100%">
            <div className="max-w-5xl mx-auto text-center pt-[10dvh] ">

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-8 tracking-tight leading-tight">
                Looking for <br />
                <span className="text-cta">distribution?</span>
              </h1>

              <p className="text-lg md:text-xl text-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Get your products discovered and bought by national retailers
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/contact"
                  className="min-w-[200px] px-8 py-4 bg-cta text-white rounded-full font-bold hover:bg-cta/90 transition-all transform hover:scale-105 shadow-xl"
                >
                  List Your Brand
                </Link>
                <Link
                  to="/brands"
                  className="min-w-[200px] px-8 py-4 bg-white border border-gray-200 text-foreground rounded-full font-semibold hover:bg-gray-50 transition-all scale-100 hover:scale-105 shadow-sm"
                >
                  View Brands
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container-luxury">
          <Reveal width="100%">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
                Why List Your Brand With Us?
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                We help emerging brands connect with the right retail partners
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={100} className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                <Store className="w-7 h-7 text-cta/80" />
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Access Retailers
              </h3>
              <p className="text-sm text-muted-foreground">
                Connect with quality retailers actively seeking new products for their shelves
              </p>
            </Reveal>

            <Reveal delay={200} className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-cta/80" />
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Grow Sales
              </h3>
              <p className="text-sm text-muted-foreground">
                Expand your distribution network and increase revenue through new partnerships
              </p>
            </Reveal>

            <Reveal delay={300} className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-cta/80" />
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Build Relationships
              </h3>
              <p className="text-sm text-muted-foreground">
                We facilitate introductions and help nurture long-term retail partnerships
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="container-luxury">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Reveal delay={100} className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Apply
              </h3>
              <p className="text-sm text-muted-foreground">
                Submit your brand details and product information
              </p>
            </Reveal>

            <Reveal delay={200} className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Get Reviewed
              </h3>
              <p className="text-sm text-muted-foreground">
                Our team reviews your application for quality and fit
              </p>
            </Reveal>

            <Reveal delay={300} className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Get Listed
              </h3>
              <p className="text-sm text-muted-foreground">
                Your brand appears in our curated marketplace
              </p>
            </Reveal>

            <Reveal delay={400} className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Connect
              </h3>
              <p className="text-sm text-muted-foreground">
                Receive inquiries from interested retailers
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-secondary/30 overflow-x-hidden">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Reveal direction="left" className="relative">
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

            <Reveal direction="right">
              <div className="bg-primary/5 rounded-2xl p-8">
                <h3 className="text-xl font-serif font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-muted-foreground mb-6">
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

export default ForBrands;
