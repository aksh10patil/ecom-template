import React from 'react';
import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-teal-500 text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-6 flex-shrink-0">
                <img src="/api/placeholder/24/16" alt="India flag" className="rounded-sm" />
              </div>
              <p>500 Terry Fancine Street, India, IN 736227</p>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-6 flex-shrink-0">
                <img src="/api/placeholder/24/16" alt="US flag" className="rounded-sm" />
              </div>
              <p>500 Terry Fancine Street, US, 736227</p>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Mail size={18} className="flex-shrink-0" />
              <div>
                <span className="font-semibold">Mail: </span>
                <a href="mailto:Support@Vaasturemedies.in" className="hover:underline">
                  Support@Vaasturemedies.in
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <Phone size={18} className="flex-shrink-0" />
              <div>
                <span className="font-semibold">Tel: </span>
                <a href="tel:+919999593214" className="hover:underline">
                  +91-9999593214
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Follow Us:</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-teal-200">
                  <Facebook size={24} />
                </a>
                <a href="#" className="hover:text-teal-200">
                  <Instagram size={24} />
                </a>
                <a href="#" className="hover:text-teal-200">
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:underline">Offers</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Orders</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Vastu Wallet</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Terms and Condition</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Reach Out to Us!</h2>
            <form>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full p-2 border-b border-white bg-transparent focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full p-2 border-b border-white bg-transparent focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <input 
                  type="tel" 
                  placeholder="Phone" 
                  className="w-full p-2 border-b border-white bg-transparent focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <textarea 
                  placeholder="Message" 
                  rows={4}
                  className="w-full p-2 border-b border-white bg-transparent focus:outline-none resize-none"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-12 rounded-full transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-12 pt-6 border-t border-teal-400">
          <p>Copyright © 2023 Vaastu Remedies. All Right Reserved.</p>
        </div>
      </div>
    </footer>
  );
}