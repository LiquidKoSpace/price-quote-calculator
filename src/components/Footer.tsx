import { Mail, Phone, ShoppingBag, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-luxury">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img
                src="/logo-white.png"
                alt="Kindred Brand Discovery Logo"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-primary-foreground/80 max-w-md">
              Connecting exceptional local brands with discerning retailers.
              We're the bridge between quality producers and stores that value excellence.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Discover Brands
                </Link>
              </li>
              <li>
                <Link to="/for-brands" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  List Your Brand
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@liquidkospace.co.za" className="hover:text-accent transition-colors">
                  info@liquidkospace.co.za
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <a href="tel:+27835238896" className="hover:text-accent transition-colors">
                  083 523 8896
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Instagram className="w-4 h-4" />
                <a href="https://www.instagram.com/liquidkospace/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  Instagram
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M12.94,1.61V15.78a2.83,2.83,0,0,1-2.83,2.83h0a2.83,2.83,0,0,1-2.83-2.83h0a2.84,2.84,0,0,1,2.83-2.84h0V9.17h0A6.61,6.61,0,0,0,3.5,15.78h0a6.61,6.61,0,0,0,6.61,6.61h0a6.61,6.61,0,0,0,6.61-6.61V9.17l.2.1a8.08,8.08,0,0,0,3.58.84h0V6.33l-.11,0a4.84,4.84,0,0,1-3.67-4.7H12.94Z" stroke="currentColor" strokeLinejoin="round"></path>
                  </g>
                </svg>
                <a href="https://www.tiktok.com/@liquidkospace?_r=1&_t=ZS-91rtHhLUA4d" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  TikTok
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Linkedin className="w-4 h-4" />
                <a href="https://www.linkedin.com/company/liquid-ko-space/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 py-6 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Liquid Ko Space Distribution. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
