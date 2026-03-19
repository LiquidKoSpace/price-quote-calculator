import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, Instagram, Globe, Facebook, Mail, Building2, User, MessageSquare } from 'lucide-react';
import { brandsApi } from '@/lib/api';
import { categories } from '@/lib/mockData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Reveal from '@/components/Reveal';

const BrandDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const inquiryFormRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const { data: brand, isLoading } = useQuery({
    queryKey: ['brand', slug],
    queryFn: () => brandsApi.getBrand(slug!),
    enabled: !!slug,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;

    // Format WhatsApp message with all form data
    const whatsappMessage = `*New Wholesale Inquiry*

*Brand Interested In:* ${brand.name}
*Price Range:* R${brand.priceRange.min} - R${brand.priceRange.max}

*Store Owner Details:*
*Name:* ${formData.name}
*Email:* ${formData.email}
*Company:* ${formData.company}

*Message:*
${formData.message}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // WhatsApp API URL (remove + from phone number for the URL)
    const whatsappUrl = `https://wa.me/27835238896?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Show success toast
    toast({
      title: 'Opening WhatsApp...',
      description: 'Your inquiry will be sent via WhatsApp.',
    });

    // Reset form and close
    setFormData({ name: '', email: '', company: '', message: '' });
    setShowInquiryForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container-luxury">
            <div className="animate-pulse space-y-8">
              <div className="h-96 bg-muted rounded-lg" />
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container-luxury text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">Brand Not Found</h1>
            <Link to="/brands" className="text-accent hover:underline">
              Return to Brands
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = categories.find(c => c.id === brand.category)?.name || brand.category;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container-luxury">
          {/* Back Button */}
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Brands
          </Link>

          {/* Hero Image */}
          <Reveal width="100%" className="mb-12">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <img
                src={brand.heroImage}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex md:items-end md:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-2">
                      {brand.name}
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-primary-foreground/90">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{brand.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Est. {brand.founded}</span>
                      </div>
                    </div>
                  </div>
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="w-24 h-24 rounded-xl object-contain border-4 border-primary-foreground/20"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <Reveal width="100%">
                <section>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">About the Brand</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{brand.description}</p>
                </section>
              </Reveal>

              {/* Specialties */}
              <Reveal width="100%" delay={100}>
                <section>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-3">
                    {brand.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-4 py-2 bg-accent/30 text-cta font-medium rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Lifestyle Gallery */}
              {brand.lifestyleImages && brand.lifestyleImages.length > 0 && (
                <Reveal width="100%" delay={200}>
                  <section>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Lifestyle Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {brand.lifestyleImages.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden luxury-card">
                          <img
                            src={image}
                            alt={`${brand.name} lifestyle ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {/* Product Gallery */}
              {brand.productImages && brand.productImages.length > 0 && (
                <Reveal width="100%" delay={300}>
                  <section>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Product Showcase</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {brand.productImages.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden luxury-card">
                          <img
                            src={image}
                            alt={`${brand.name} product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8 overflow-x-hidden">
              {/* Price Range */}
              <Reveal width="100%" delay={100} direction="left">
                <div className="luxury-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Retail Price Range</h3>
                  <p className="text-3xl font-serif font-bold text-cta mb-2">
                    R{brand.priceRange.min} - R{brand.priceRange.max}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Wholesale pricing available upon inquiry
                  </p>
                </div>
              </Reveal>

              {/* Category */}
              <Reveal width="100%" delay={200} direction="left">
                <div className="luxury-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Category</h3>
                  <p className="text-foreground font-medium">{categoryName}</p>
                </div>
              </Reveal>

              {/* Social Media */}
              <Reveal width="100%" delay={300} direction="left">
                <div className="luxury-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Connect</h3>
                  <div className="space-y-3">
                    {brand.socialMedia.instagram && (
                      <a
                        href={`https://instagram.com/${brand.socialMedia.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                        <span>{brand.socialMedia.instagram}</span>
                      </a>
                    )}
                    {brand.socialMedia.facebook && (
                      <a
                        href={`https://facebook.com/${brand.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                        <span>{brand.socialMedia.facebook}</span>
                      </a>
                    )}
                    {brand.socialMedia.website && (
                      <a
                        href={`https://${brand.socialMedia.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                        <span>{brand.socialMedia.website}</span>
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* CTA */}
              <Reveal width="100%" delay={400} direction="left">
                <div className="luxury-card p-6 bg-accent/5">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Interested in Wholesale?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Contact us to learn about wholesale pricing, minimum order quantities, and exclusive retailer benefits.
                  </p>
                  <Button
                    onClick={() => {
                      const willShow = !showInquiryForm;
                      setShowInquiryForm(willShow);
                      if (willShow) {
                        setTimeout(() => {
                          inquiryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }
                    }}
                    variant="cta"
                    className="w-full"
                  >
                    {showInquiryForm ? 'Hide Form' : 'Request Details'}
                  </Button>
                </div>
              </Reveal>

              {/* Inquiry Form */}
              {showInquiryForm && (
                <div ref={inquiryFormRef} className="luxury-card p-6 scroll-mt-24">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Send Inquiry</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4" />
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your Store"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your retail needs..."
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Send Inquiry
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrandDetail;
