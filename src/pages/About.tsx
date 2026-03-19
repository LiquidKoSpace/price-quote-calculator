import { CheckCircle2, Users, TrendingUp, Target, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

const About = () => {
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
            <div className="max-w-5xl mx-auto text-center pt-[5dvh] ">


              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-8 tracking-tight leading-tight">
                Your trusted partner in <br />
                <span className="text-cta">brand discovery</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Connecting exceptional local brands with quality retailers across the nation
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container-luxury">
          <Reveal width="100%">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Liquid Ko Space Distribution acts as a B2B matchmaker, bridging the gap between
                outstanding local brands and discerning store owners. We believe that exceptional
                products deserve to be discovered by the right audience.
              </p>
              <p className="text-lg text-muted-foreground">
                Our platform simplifies the discovery and connection process, making it easy for
                retailers to find premium local brands while giving producers a channel to reach
                stores that value quality and excellence.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Strategic Partners Section */}
      <section className="py-16 bg-gradient-to-br from-gray-950 to-black text-white">
        <div className="container-luxury">
          <Reveal width="100%">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Strategic Partners
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                We collaborate with industry leaders to provide a comprehensive ecosystem for brand growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Reveal delay={100} className="h-full">
                <a
                  href="https://ab4ir.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-card p-8 group transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cta/50 shadow-lg hover:shadow-xl h-full"
                >
                  <img
                    src="https://ab4ir.org/wp-content/uploads/2025/08/admin-ajax.png"
                    alt="AB4IR Logo"
                    className="h-16 object-contain mb-4 filter  group-hover:scale-105 transition-all duration-300"
                  />
                  <h3 className="text-xl font-serif font-bold text-white mb-2">
                    AB4IR
                  </h3>
                  <p className="text-gray-300 mb-4 flex-grow">
                    A Digital Innovation Hub empowering entrepreneurs through incubation, technology training, and market access. They bridge the digital divide and foster growth in the creative and ICT sectors.
                  </p>
                  <span className="text-sm font-medium text-cta uppercase tracking-wider flex items-center">
                    Digital Innovation Hub <ExternalLink className="ml-2 w-4 h-4 text-cta" />
                  </span>
                </a>
              </Reveal>

              <Reveal delay={200} className="h-full">
                <a
                  href="https://retailreadyconsultants.co.za/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-card p-8 group transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cta/50 shadow-lg hover:shadow-xl h-full"
                >
                  <img
                    src="https://retailreadyconsultants.co.za/logo.png"
                    alt="Retail Ready Consultants Logo"
                    className="h-16 object-contain mb-4 filter  group-hover:scale-105 transition-all duration-300"
                  />
                  <h3 className="text-xl font-serif font-bold text-white mb-2">
                    Retail Ready Consultants
                  </h3>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Experts in guiding premium brands into the South African retail market. They provide strategic placement, business acumen development, and personalized consultation to ensure retail success.
                  </p>
                  <span className="text-sm font-medium text-cta uppercase tracking-wider flex items-center">
                    Retail Expansion Experts <ExternalLink className="ml-2 w-4 h-4 text-cta" />
                  </span>
                </a>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>


      {/* What We Do Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We specialize in curating and connecting the best local brands with retail partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Reveal delay={100} className="text-center p-6 bg-background rounded-lg">
              <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-cta/80" />
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Quality Curation
              </h3>
              <p className="text-sm text-muted-foreground">
                Hand-selecting premium local brands that meet our excellence standards
              </p>
            </Reveal>

            <Reveal delay={200} className="text-center p-6 bg-background rounded-lg">
              <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-cta/80" />
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Strategic Matching
              </h3>
              <p className="text-sm text-muted-foreground">
                Pairing the right brands with retailers for mutual success
              </p>
            </Reveal>

            <Reveal delay={300} className="text-center p-6 bg-background rounded-lg">
              <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-cta/80" />
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Growth Support
              </h3>
              <p className="text-sm text-muted-foreground">
                Providing ongoing resources and wholesale pricing opportunities
              </p>
            </Reveal>

            <Reveal delay={400} className="text-center p-6 bg-background rounded-lg">
              <div className="w-14 h-14 mx-auto mb-4 bg-accent/30 rounded-2xl flex items-center justify-center">
                <Target className="w-7 h-7 text-cta/80" />
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                Vendor Management
              </h3>
              <p className="text-sm text-muted-foreground">
                Coordinating relationships between brands and retail partners
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-12 text-center">
              Our Values
            </h2>

            <div className="space-y-8">
              <Reveal delay={100} width="100%">
                <div className="luxury-card p-8">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    Excellence First
                  </h3>
                  <p className="text-muted-foreground">
                    We only work with brands that demonstrate exceptional quality and craftsmanship.
                    Every producer on our platform has been carefully vetted to ensure they meet our
                    high standards.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={200} width="100%">
                <div className="luxury-card p-8">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    Authentic Connections
                  </h3>
                  <p className="text-muted-foreground">
                    We believe in creating genuine partnerships between brands and retailers that
                    benefit both parties. Our matching process ensures alignment in values, quality
                    standards, and business objectives.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300} width="100%">
                <div className="luxury-card p-8">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    Local Support
                  </h3>
                  <p className="text-muted-foreground">
                    Supporting local businesses is at the heart of what we do. We're committed to
                    helping regional brands reach their full potential while keeping commerce
                    connected to community.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-background">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from the brands and retailers who have found success through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay={100} className="h-full">
              <div className="luxury-card p-8 h-full">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-cta" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-4">
                    "Liquid Ko Space helped us connect with premium retailers we never would have reached on our own. The quality of partnerships has been exceptional."
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sarah Mitchell</p>
                  <p className="text-sm text-muted-foreground">Founder, Artisan Goods Co.</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} className="h-full">
              <div className="luxury-card p-8 h-full">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-cta" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-4">
                    "As a retailer, finding quality local brands used to be time-consuming. This platform made it simple to discover exactly what we were looking for."
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">James Chen</p>
                  <p className="text-sm text-muted-foreground">Owner, Urban Market</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300} className="h-full">
              <div className="luxury-card p-8 h-full">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-cta" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-4">
                    "The team at Liquid Ko Space truly understands both sides of the business. They've been instrumental in our growth strategy."
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Maya Patel</p>
                  <p className="text-sm text-muted-foreground">CEO, Heritage Brands</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
