'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "QR Code File Transfer",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Professional QR code file transfer solution for print shops. Customers scan and upload files instantly without email or USB drives.",
            "operatingSystem": "Web-based",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "500"
            }
          })
        }}
      />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group shrink-0">
              <img 
                src="/logo.jpg" 
                alt="QR Code File Transfer" 
                className="h-10 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300" 
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-10 mx-auto">
              <a href="#features" className="text-gray-700 hover:text-orange transition-colors font-medium text-sm">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-orange transition-colors font-medium text-sm">
                Pricing
              </a>
              <a href="#security" className="text-gray-700 hover:text-orange transition-colors font-medium text-sm">
                Security
              </a>
              <a href="#faq" className="text-gray-700 hover:text-orange transition-colors font-medium text-sm">
                FAQ
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <Button 
                  variant="outline" 
                  className="hidden sm:block border-2 border-gray-200 text-gray-700 hover:border-orange hover:text-orange hover:bg-orange/5 transition-all duration-300 rounded-full px-6 font-medium"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  variant="primary" 
                  className="bg-orange hover:bg-orange-600 text-white shadow-lg shadow-orange/20 border-0 transform hover:scale-105 transition-all duration-300 rounded-full px-8 font-semibold"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-gray-50 to-white pt-32 pb-24">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-20 right-10 w-72 h-72 bg-orange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 border border-orange/20 rounded-full text-sm font-medium text-orange">
              <span className="w-2 h-2 bg-orange rounded-full animate-pulse"></span>
              The Modern File Transfer Solution
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-gray-900 leading-[1.1] tracking-tight">
            QR Code File Transfer
            <br />
            <span className="text-orange">for Print Shops</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Streamline your workflow with instant file uploads. No emails, no USB drives, no hassle.
            <br />
            <span className="text-gray-500">Just scan, upload, and print.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/signup">
              <Button size="lg" variant="primary" className="w-full sm:w-auto bg-orange hover:bg-orange-600 text-white shadow-lg shadow-orange/25 border-0 transform hover:scale-105 transition-all duration-300 px-10 py-4 text-lg font-semibold rounded-full">
                <span className="flex items-center gap-3">
                  Start Free Trial
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:border-orange hover:text-orange hover:bg-orange/5 transform hover:scale-105 transition-all duration-300 px-10 py-4 text-lg font-medium rounded-full">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-orange/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-600 font-medium">No app required</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-orange/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-600 font-medium">Works on any device</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-orange/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-600 font-medium">Setup in 5 minutes</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-linear-to-r from-orange to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20">
              <div className="aspect-video bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner flex items-center justify-center overflow-hidden relative">
                <img 
                  src="/hero.jpg" 
                  alt="QR File Send Dashboard" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </section>

      {/* How QR Code File Transfer Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-orange/10 text-orange text-sm font-semibold rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Simple, Fast, Professional
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Transform your print shop workflow in three easy steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ProcessStep
              number="1"
              title="Generate Your QR Code"
              description="Create a unique QR code for your print shop in seconds. Customize it with your branding and download it to print or display digitally."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              }
            />
            <ProcessStep
              number="2"
              title="Customers Scan & Upload"
              description="Customers simply scan your QR code with their smartphone camera. They're instantly directed to a secure upload page where they can select and transfer files directly from their device."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              }
            />
            <ProcessStep
              number="3"
              title="Receive Files Instantly"
              description="Files appear in your dashboard immediately. View, download, and manage all customer submissions in one centralized location. Track order status and communicate with customers effortlessly."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-orange/10 text-orange text-sm font-semibold rounded-full mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Powerful features designed specifically for modern print shops
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Instant File Transfer"
              description="QR code file transfer eliminates waiting time. Files upload in seconds, not minutes. No more corrupted email attachments or failed transfers."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Secure & Private"
              description="Enterprise-grade encryption protects customer files. Each QR code file transfer is secure, tracked, and compliant with data protection standards."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              title="Mobile-First Design"
              description="Customers use their smartphone camera to scan and upload. No app downloads required. Works on iPhone, Android, and all modern devices."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="All File Types Supported"
              description="Accept PDFs, images, Word documents, and more. Our QR code file transfer system handles any format your customers need to print."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
              title="Real-Time Dashboard"
              description="Monitor incoming files as they arrive. Organize by customer, date, or project. Download files individually or in batches for processing."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              }
              title="Custom Branded QR Codes"
              description="Add your logo and colors to QR codes. Create a professional impression while maintaining the functionality of instant file transfer."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-orange/10 text-orange text-sm font-semibold rounded-full mb-4">
              Benefits
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Print Shop
            </h2>
            <p className="text-xl text-gray-600 font-light">
              See how QR code file transfer improves efficiency and customer satisfaction
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div className="space-y-8">
              <BenefitItem
                title="Save Time & Reduce Errors"
                description="Eliminate the back-and-forth of email attachments. No more asking customers to resend files or dealing with wrong versions. QR code file transfer delivers files directly to your dashboard with customer information attached."
              />
              <BenefitItem
                title="Improve Customer Experience"
                description="Modern customers expect convenience. Let them upload files from their phone while standing in your shop or before they arrive. QR code file transfer creates a seamless, professional experience that sets you apart."
              />
              <BenefitItem
                title="Increase Order Volume"
                description="Process more orders in less time. The simplified workflow means you can handle higher volumes without adding staff. QR code file transfer pays for itself by improving throughput."
              />
              <BenefitItem
                title="Go Digital, Stay Organized"
                description="Stop juggling USB drives, email accounts, and physical media. All files in one secure location with automatic organization by customer and date."
              />
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="aspect-square bg-linear-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-orange-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-400 font-medium">Benefits Visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Perfect for Every Print Business
            </h2>
            <p className="text-xl text-gray-600">
              QR code file transfer works for businesses of all sizes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <UseCaseCard
              title="Local Print Shops"
              description="Serve walk-in customers faster with instant QR code file uploads. Perfect for flyers, business cards, and everyday printing."
              icon="🖨️"
            />
            <UseCaseCard
              title="Copy Centers"
              description="Handle high-volume document printing efficiently. Students and businesses can send files before arriving."
              icon="📄"
            />
            <UseCaseCard
              title="Photo Printing Services"
              description="Accept high-resolution images directly from customer phones. No quality loss from email compression."
              icon="📸"
            />
            <UseCaseCard
              title="Sign & Banner Shops"
              description="Receive large design files without file size limitations. Perfect for custom signage projects."
              icon="🪧"
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              QR Code File Transfer vs Traditional Methods
            </h2>
            <p className="text-xl text-gray-600">
              See why modern print shops are switching to QR code solutions
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Method</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Speed</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Convenience</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">File Size</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Organization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-orange-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">QR Code File Transfer</td>
                    <td className="px-6 py-4 text-center text-2xl">⚡</td>
                    <td className="px-6 py-4 text-center text-2xl">✅</td>
                    <td className="px-6 py-4 text-center text-2xl">💯</td>
                    <td className="px-6 py-4 text-center text-2xl">⭐</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Email Attachments</td>
                    <td className="px-6 py-4 text-center text-2xl">🐌</td>
                    <td className="px-6 py-4 text-center text-2xl">❌</td>
                    <td className="px-6 py-4 text-center text-2xl">⚠️</td>
                    <td className="px-6 py-4 text-center text-2xl">❌</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">USB Drives</td>
                    <td className="px-6 py-4 text-center text-2xl">⏱️</td>
                    <td className="px-6 py-4 text-center text-2xl">❌</td>
                    <td className="px-6 py-4 text-center text-2xl">✅</td>
                    <td className="px-6 py-4 text-center text-2xl">❌</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Cloud Links</td>
                    <td className="px-6 py-4 text-center text-2xl">⏱️</td>
                    <td className="px-6 py-4 text-center text-2xl">⚠️</td>
                    <td className="px-6 py-4 text-center text-2xl">✅</td>
                    <td className="px-6 py-4 text-center text-2xl">⚠️</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-orange/10 text-orange text-sm font-semibold rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Everything you need to know about QR code file transfer
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            <FAQItem
              question="What is QR code file transfer?"
              answer="QR code file transfer is a modern method that allows customers to upload files to your print shop by simply scanning a QR code with their smartphone. It eliminates the need for email, USB drives, or physical media. The QR code links directly to a secure upload page where customers can select and send files instantly."
            />
            <FAQItem
              question="How secure is QR code file transfer?"
              answer="Our QR code file transfer system uses enterprise-grade encryption to protect all file uploads. Each transfer is secured with HTTPS, and files are stored in isolated, protected storage. We comply with industry-standard data protection practices, ensuring your customers' documents remain private and secure."
            />
            <FAQItem
              question="Do customers need to install an app?"
              answer="No. One of the biggest advantages of QR code file transfer is that it works entirely through the web browser. Customers simply scan the QR code with their phone's camera app (built into all modern smartphones), and they're taken to the upload page. No downloads, no registration required."
            />
            <FAQItem
              question="What file types can be transferred via QR code?"
              answer="Our QR code file transfer system supports all common file formats including PDF, JPG, PNG, DOCX, XLSX, PPTX, AI, PSD, and more. There are no restrictions on file types, making it perfect for any print shop service from documents to high-resolution photos and design files."
            />
            <FAQItem
              question="How quickly does QR code file transfer work?"
              answer="File transfers typically complete in seconds. Unlike email attachments that can take minutes to send and receive, QR code file transfer uploads files directly to your dashboard in real-time. You'll receive a notification as soon as files arrive, allowing you to start processing orders immediately."
            />
            <FAQItem
              question="Can I customize my QR code?"
              answer="Yes! You can customize your QR code with your print shop's branding, including logos and colors. Custom QR codes look more professional and help build trust with customers while maintaining full QR code file transfer functionality."
            />
            <FAQItem
              question="What happens if a customer's internet connection drops during transfer?"
              answer="Our QR code file transfer system includes automatic retry functionality. If a connection is interrupted, the upload will automatically resume once the connection is restored. Customers don't need to start over, ensuring reliable file delivery even with unstable connections."
            />
            <FAQItem
              question="How much does QR code file transfer cost?"
              answer="We offer flexible pricing plans designed for print shops of all sizes. Start with a free trial to test the QR code file transfer system with your customers. Paid plans start at affordable monthly rates with no long-term contracts required."
            />
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-orange/10 text-orange text-sm font-semibold rounded-full mb-4">
              Security
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Enterprise-Grade Protection
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Bank-level encryption and industry-leading security for your peace of mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <SecurityFeature
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="256-Bit SSL Encryption"
              description="Every QR code file transfer is encrypted end-to-end using military-grade AES-256 encryption. Files are secure from the moment of upload to download."
            />
            <SecurityFeature
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="GDPR & Privacy Compliant"
              description="Our QR code file transfer system fully complies with GDPR, CCPA, and international data protection regulations. Customer data is never sold or shared."
            />
            <SecurityFeature
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              }
              title="Secure Cloud Storage"
              description="Files uploaded via QR code file transfer are stored in isolated, enterprise-grade cloud storage with automatic backups and 99.9% uptime guarantee."
            />
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-orange rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Automatic File Expiration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Set custom retention policies for your QR code file transfer uploads. Files can automatically delete after a specified time period, ensuring compliance with data minimization principles and reducing storage liability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration & Compatibility Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              QR Code File Transfer Works Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              Universal compatibility means your customers can upload files from any device, any browser, anywhere
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            <CompatibilityCard
              icon="📱"
              title="iPhone & iOS"
              description="Native camera app QR scanning on iOS 11+. Upload files directly from Photos, Files, or iCloud Drive."
            />
            <CompatibilityCard
              icon="🤖"
              title="Android Devices"
              description="Built-in QR code scanning on Android 9+. Access files from Google Drive, Gallery, or local storage."
            />
            <CompatibilityCard
              icon="💻"
              title="Desktop Computers"
              description="Windows, Mac, and Linux support. Upload files via drag-and-drop or traditional file selection."
            />
            <CompatibilityCard
              icon="🌐"
              title="All Browsers"
              description="Works perfectly on Chrome, Safari, Firefox, Edge, and all modern web browsers."
            />
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Seamless Integration Options
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <IntegrationFeature
                title="Cloud Storage Integration"
                description="Connect your QR code file transfer system with Google Drive, Dropbox, or OneDrive for automatic file synchronization."
              />
              <IntegrationFeature
                title="Workflow Automation"
                description="Integrate with Zapier or Make (formerly Integromat) to trigger actions when files are received via QR code."
              />
              <IntegrationFeature
                title="Email Notifications"
                description="Get instant email alerts when customers upload files through your QR code file transfer system."
              />
              <IntegrationFeature
                title="API Access"
                description="Developer-friendly REST API for custom integrations with your existing print shop management software."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Transparency Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-orange/10 text-orange text-sm font-semibold rounded-full mb-4">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 font-light">
              No hidden fees. No surprises. Choose the perfect plan for your print shop.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <PricingCard
              name="Starter"
              price="Free"
              period=""
              description="Perfect for testing QR code file transfer"
              features={[
                "1 QR code",
                "Up to 50 file uploads/month",
                "5GB storage",
                "Email support",
                "Basic analytics"
              ]}
              highlighted={false}
            />
            <PricingCard
              name="Professional"
              price="$29"
              period="/month"
              description="For established print shops"
              features={[
                "Unlimited QR codes",
                "Up to 500 file uploads/month",
                "50GB storage",
                "Priority support",
                "Advanced analytics",
                "Custom branding",
                "API access"
              ]}
              highlighted={true}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              period=""
              description="For high-volume operations"
              features={[
                "Everything in Professional",
                "Unlimited uploads",
                "Unlimited storage",
                "Dedicated account manager",
                "Custom integrations",
                "SLA guarantee",
                "Training & onboarding"
              ]}
              highlighted={false}
            />
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              All plans include free 14-day trial. No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials Section */}
      <section className="bg-linear-to-br from-orange-50 to-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Print Shops Love Our QR Code File Transfer
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real businesses using QR code file transfer daily
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <TestimonialCard
              quote="QR code file transfer has completely transformed how we receive customer files. We've cut processing time by 60% and customers love how easy it is."
              author="Sarah Mitchell"
              role="Owner, QuickPrint Express"
              metric="60% faster processing"
            />
            <TestimonialCard
              quote="No more dealing with corrupted email attachments or incompatible file formats. The QR code file transfer system just works, every single time."
              author="James Chen"
              role="Manager, Downtown Copy Center"
              metric="Zero failed transfers"
            />
            <TestimonialCard
              quote="Our customers were hesitant at first, but now they prefer QR code file transfer. It's faster than email and they don't need to remember passwords or create accounts."
              author="Maria Rodriguez"
              role="Director, PrintHub Solutions"
              metric="95% customer satisfaction"
            />
          </div>
        </div>
      </section>

      {/* Getting Started Guide Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get Started with QR Code File Transfer in Minutes
            </h2>
            <p className="text-xl text-gray-600">
              Follow our simple setup guide and start receiving files immediately
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            <SetupStep
              number="1"
              title="Create Your Account"
              description="Sign up for free in 30 seconds. No credit card required, no complicated forms. Just your email and you're ready to go."
              time="30 seconds"
            />
            <SetupStep
              number="2"
              title="Generate Your QR Code"
              description="Use our QR code designer to create a branded QR code for file transfer. Add your logo, choose colors, and customize the upload page with your shop information."
              time="2 minutes"
            />
            <SetupStep
              number="3"
              title="Display Your QR Code"
              description="Download your QR code and display it at your counter, in windows, or on receipts. We provide printable templates in multiple sizes."
              time="1 minute"
            />
            <SetupStep
              number="4"
              title="Start Receiving Files"
              description="That's it! Customers scan, upload, and you receive files instantly in your dashboard. Monitor uploads in real-time and download when ready to print."
              time="Instant"
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/signup">
              <Button size="lg" variant="primary">
                Start Your Free Trial Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Print Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of print shops using QR code file transfer daily
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-orange mb-2">2,500+</div>
              <div className="text-gray-300">Print Shops</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-orange mb-2">500K+</div>
              <div className="text-gray-300">Files Transferred</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-orange mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-orange mb-2">4.9★</div>
              <div className="text-gray-300">Customer Rating</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            <TrustBadge
              icon={
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              }
              title="ISO 27001 Certified"
              description="Information security management"
            />
            <TrustBadge
              icon={
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              }
              title="GDPR Compliant"
              description="Full data protection compliance"
            />
            <TrustBadge
              icon={
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              }
              title="24/7 Support"
              description="Always here to help you succeed"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-orange via-purple-500 to-orange-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0tOCAyOGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-8"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Ready to Get Started?
              </span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-[1.1]">
              Transform Your Print Shop
              <br />
              <span className="text-white/90">Starting Today</span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-14 text-white leading-relaxed max-w-2xl mx-auto font-light">
              Join 2,500+ print shops already streamlining their workflow
              <br />
              <span className="text-white/95">No credit card required • Setup in 5 minutes</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/signup">
                <button className="w-full sm:w-auto bg-white text-orange hover:bg-gray-50 border-0 shadow-2xl px-10 py-4 text-lg font-bold rounded-full transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2.5">
                  Start Free Trial
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <Link href="/signin">
                <button className="w-full sm:w-auto border-4 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-purple-600 px-10 py-4 text-lg font-bold rounded-full transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center shadow-lg">
                  Sign In
                </button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-10 text-white text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">No credit card required</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-orange to-purple-500 rounded-2xl blur-lg opacity-60"></div>
                  <div className="relative w-12 h-12 bg-linear-to-br from-orange to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <span className="text-2xl font-bold">QRFileSend</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                The modern QR code file transfer solution for print shops. Streamline your workflow, eliminate USB hassles, and deliver exceptional customer experience.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#security" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#integrations" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Use Cases
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                    System Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} QRFileSend. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Cookie Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  GDPR
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-orange/30 hover:shadow-xl transition-all duration-300 h-full">
        <div className="w-14 h-14 bg-orange/10 rounded-xl flex items-center justify-center mb-6 text-orange group-hover:bg-orange group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function ProcessStep({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: parseInt(number) * 0.1 }}
      className="relative group"
    >
      {/* Connection line for desktop */}
      {number !== "3" && (
        <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gray-200"></div>
      )}
      
      <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-orange/30 hover:shadow-lg transition-all duration-300 h-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm">
            {number}
          </div>
          <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center text-orange shrink-0">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function BenefitItem({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex gap-4"
    >
      <div className="shrink-0">
        <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function UseCaseCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-3">{question}</h3>
      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </motion.div>
  );
}

function SecurityFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
    >
      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function CompatibilityCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function IntegrationFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0">
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-orange" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  highlighted 
}: { 
  name: string; 
  price: string; 
  period: string; 
  description: string; 
  features: string[]; 
  highlighted: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-orange text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      
      <div className={`relative rounded-2xl p-8 border-2 ${
        highlighted 
          ? 'bg-orange text-white border-orange shadow-xl' 
          : 'bg-white text-gray-900 border-gray-200 hover:border-orange/30 hover:shadow-lg'
      } transition-all duration-300`}
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className={`text-sm mb-6 ${highlighted ? 'text-white' : 'text-gray-600'}`}>
            {description}
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold">{price}</span>
            {period && <span className={`text-lg ${highlighted ? 'text-white' : 'text-gray-600'}`}>{period}</span>}
          </div>
        </div>
        <ul className="space-y-4 mb-10">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${highlighted ? 'bg-white/25' : 'bg-orange/10'}`}>
                <svg 
                  className={`w-3 h-3 ${highlighted ? 'text-white' : 'text-orange'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`text-base leading-relaxed ${highlighted ? 'font-medium' : ''}`}>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="/signup">
          {highlighted ? (
            <button className="w-full transform hover:scale-105 transition-all duration-300 rounded-full font-bold bg-white text-orange-600 hover:bg-gray-50 border-0 shadow-lg px-8 py-4 text-lg">
              Get Started
            </button>
          ) : (
            <button className="w-full transform hover:scale-105 transition-all duration-300 rounded-full font-bold bg-orange text-white hover:bg-orange-600 border-0 px-8 py-4 text-lg">
              Get Started
            </button>
          )}
        </Link>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ 
  quote, 
  author, 
  role, 
  metric 
}: { 
  quote: string; 
  author: string; 
  role: string; 
  metric: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-linear-to-br from-orange to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      
      <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 group-hover:border-transparent group-hover:shadow-2xl transition-all duration-300">
        <div className="mb-6">
          <div className="w-12 h-12 bg-linear-to-br from-orange to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
        </div>
        <p className="text-gray-700 mb-6 leading-relaxed text-lg italic">"{quote}"</p>
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div>
            <p className="font-bold text-gray-900 mb-1">{author}</p>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
          <div className="bg-linear-to-r from-orange to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
            {metric}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SetupStep({ 
  number, 
  title, 
  description, 
  time 
}: { 
  number: string; 
  title: string; 
  description: string; 
  time: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-orange text-white rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h3>
            <span className="bg-orange-50 text-orange px-3 py-1 rounded-full text-sm font-semibold shrink-0 ml-4">
              {time}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function TrustBadge({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}

