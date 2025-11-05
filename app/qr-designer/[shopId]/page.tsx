'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Shop } from '@/lib/types';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Card from '@/components/Card';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

export default function QRDesignerPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId as string;
  const printRef = useRef<HTMLDivElement>(null);

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [customQRCode, setCustomQRCode] = useState<string>('');
  
  // Design settings
  const [topText, setTopText] = useState('Scan to Upload Files');
  const [bottomText, setBottomText] = useState('Quick & Easy File Transfer');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#1f2937');
  const [accentColor, setAccentColor] = useState('#ff6b35');
  const [qrDarkColor, setQrDarkColor] = useState('#000000');
  const [qrLightColor, setQrLightColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [showLogo, setShowLogo] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [instruction1, setInstruction1] = useState('📱 Open your camera');
  const [instruction2, setInstruction2] = useState('📷 Point at the QR code');
  const [instruction3, setInstruction3] = useState('📤 Upload your files');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopDoc = await getDoc(doc(db, 'shops', shopId));
        if (shopDoc.exists()) {
          const shopData = {
            id: shopDoc.id,
            ...shopDoc.data(),
            createdAt: shopDoc.data().createdAt?.toDate() || new Date(),
          } as Shop;
          setShop(shopData);
          setBottomText(shopData.name);
        } else {
          toast.error('Shop not found');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load shop');
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId, router]);

  // Generate custom colored QR code
  useEffect(() => {
    if (!shop) return;
    
    const generateQR = async () => {
      try {
        const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/upload/${shopId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(uploadUrl, {
          width: 512,
          margin: 2,
          color: {
            dark: qrDarkColor,
            light: qrLightColor,
          },
        });
        setCustomQRCode(qrCodeDataUrl);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    };

    generateQR();
  }, [shop, shopId, qrDarkColor, qrLightColor]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: bgColor,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `${shop?.name || 'qr-code'}-printable.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Downloaded! 💾');
    } catch (error) {
      console.error('Failed to download:', error);
      toast.error('Failed to download');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return null;
  }

  return (
    <>
      {/* Editor Interface - Hidden in print */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 print:hidden">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 QR Code Designer</h1>
              <p className="text-gray-600">Create a beautiful printable QR code page</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard#shops')}>
              ← Back
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6">
              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>✏️</span>
                  <span>Text Settings</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Top Text</label>
                    <input
                      type="text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bottom Text</label>
                    <input
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="48"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎨</span>
                  <span>Color Settings</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Dark Color</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={qrDarkColor}
                        onChange={(e) => setQrDarkColor(e.target.value)}
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={qrDarkColor}
                        onChange={(e) => setQrDarkColor(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Light Color</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={qrLightColor}
                        onChange={(e) => setQrLightColor(e.target.value)}
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={qrLightColor}
                        onChange={(e) => setQrLightColor(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>⚙️</span>
                  <span>Display Options</span>
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showLogo}
                      onChange={(e) => setShowLogo(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-orange focus:ring-orange"
                    />
                    <span className="text-gray-700">Show Logo</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInstructions}
                      onChange={(e) => setShowInstructions(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-orange focus:ring-orange"
                    />
                    <span className="text-gray-700">Show Instructions</span>
                  </label>

                  {showInstructions && (
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instruction 1</label>
                        <input
                          type="text"
                          value={instruction1}
                          onChange={(e) => setInstruction1(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instruction 2</label>
                        <input
                          type="text"
                          value={instruction2}
                          onChange={(e) => setInstruction2(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instruction 3</label>
                        <input
                          type="text"
                          value={instruction3}
                          onChange={(e) => setInstruction3(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Preview Panel */}
            <div>
              <Card className="sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>👁️</span>
                  <span>Preview</span>
                </h3>
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden relative">
                  {/* Action Buttons on Preview */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={handleDownload}
                      className="w-10 h-10 bg-white hover:bg-orange text-orange hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                      title="Download"
                    >
                      <span className="text-lg">💾</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="w-10 h-10 bg-white hover:bg-orange text-orange hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                      title="Print"
                    >
                      <span className="text-lg">🖨️</span>
                    </button>
                  </div>
                  
                  <div 
                    ref={printRef}
                    className="aspect-[8.5/11] flex flex-col items-center justify-center p-8"
                    style={{ 
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    {showLogo && (
                      <div className="mb-6">
                        <img src="/logo.jpg" alt="Logo" className="h-16 w-auto" />
                      </div>
                    )}

                    <h1 
                      className="font-bold text-center mb-8"
                      style={{ 
                        fontSize: `${fontSize}px`,
                        color: textColor,
                      }}
                    >
                      {topText}
                    </h1>

                    {customQRCode && (
                      <div 
                        className="bg-white p-6 rounded-2xl shadow-xl mb-8"
                        style={{ borderColor: accentColor, borderWidth: '4px' }}
                      >
                        <img src={customQRCode} alt="QR Code" className="w-64 h-64" />
                      </div>
                    )}

                    <h2 
                      className="font-bold text-center mb-6"
                      style={{ 
                        fontSize: `${fontSize * 0.8}px`,
                        color: accentColor,
                      }}
                    >
                      {bottomText}
                    </h2>

                    {showInstructions && (
                      <div 
                        className="text-center space-y-2"
                        style={{ fontSize: `${fontSize * 0.5}px` }}
                      >
                        <p>{instruction1}</p>
                        <p>{instruction2}</p>
                        <p>{instruction3}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Print Layout - Only visible when printing */}
      <div className="hidden print:block">
        <div 
          className="w-full h-screen flex flex-col items-center justify-center p-16"
          style={{ 
            backgroundColor: bgColor,
            color: textColor,
          }}
        >
          {showLogo && (
            <div className="mb-12">
              <img src="/logo.jpg" alt="Logo" className="h-24 w-auto" />
            </div>
          )}

          <h1 
            className="font-bold text-center mb-16"
            style={{ 
              fontSize: `${fontSize * 1.5}px`,
              color: textColor,
            }}
          >
            {topText}
          </h1>

          {customQRCode && (
            <div 
              className="bg-white p-12 rounded-3xl shadow-2xl mb-16"
              style={{ borderColor: accentColor, borderWidth: '6px' }}
            >
              <img src={customQRCode} alt="QR Code" className="w-96 h-96" />
            </div>
          )}

          <h2 
            className="font-bold text-center mb-12"
            style={{ 
              fontSize: `${fontSize * 1.2}px`,
              color: accentColor,
            }}
          >
            {bottomText}
          </h2>

          {showInstructions && (
            <div 
              className="text-center space-y-4"
              style={{ fontSize: `${fontSize * 0.8}px` }}
            >
              <p>{instruction1}</p>
              <p>{instruction2}</p>
              <p>{instruction3}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: letter;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </>
  );
}
