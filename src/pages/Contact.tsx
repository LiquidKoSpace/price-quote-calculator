import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
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
            <div className="max-w-4xl mx-auto text-center  ">

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-8 tracking-tight leading-tight">
                Let's <span className="text-cta">connect</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Have questions? We'd love to hear from you. Get in touch with our team.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-background overflow-x-hidden">
        <div className="container-luxury">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Details */}
              <Reveal direction="right" width="100%">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                    Get In Touch
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Whether you're a retailer looking for quality brands or a producer seeking distribution,
                    we're here to help you make the right connections.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-cta/80" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <a
                          href="mailto:info@liquidkospace.co.za"
                          className="text-muted-foreground hover:text-cta/80 transition-colors"
                        >
                          info@liquidkospace.co.za
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-cta/80" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                        <a
                          href="tel:+27835238896"
                          className="text-muted-foreground hover:text-cta/80 transition-colors"
                        >
                          083 523 8896
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-cta/80" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Location</h3>
                        <p className="text-muted-foreground">
                          South Africa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Contact Card */}
              <Reveal direction="left" width="100%">
                <div className="bg-foreground rounded-2xl p-8 text-background">
                  <h2 className="text-2xl font-serif font-bold mb-4">
                    Let's Work Together
                  </h2>
                  <p className="text-background/80 mb-6">
                    Ready to discover premium brands or list your products?
                    Reach out to us and let's start building a successful partnership.
                  </p>

                  <div className="space-y-4">
                    <a
                      href="mailto:info@liquidkospace.co.za"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-cta text-white rounded-full font-semibold hover:scale-105 transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      Send Us an Email
                    </a>

                    <a
                      href="tel:+27835238896"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-background/10 text-background border border-background/20 rounded-full font-semibold hover:bg-background/20 transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      Call Us
                    </a>
                  </div>

                  <p className="text-sm text-background/60 mt-6 text-center">
                    We typically respond within 24 hours
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
