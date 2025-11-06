import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "QR Code File Transfer for Print Shops | Secure File Upload System 2025",
  description: "Professional QR code file transfer solution for print shops. Customers scan & upload files instantly - no email, no USB drives. Secure, GDPR compliant, and easy to use. 2,500+ print shops trust us. Start free trial today.",
  keywords: "qr code file transfer, print shop file upload, qr code upload, file transfer system, print shop software, document upload, qr file sharing, instant file transfer, print shop technology, secure file transfer, qr code scanner, mobile file upload",
  openGraph: {
    title: "QR Code File Transfer for Print Shops | Instant Secure Upload",
    description: "Transform your print shop with instant QR code file transfer. Customers scan, upload, and you receive files in seconds. 2,500+ shops trust us.",
    type: "website",
    siteName: "QR File Transfer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: "QR File Transfer Team" }],
  category: "Business Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1a1a1a',
                borderRadius: '1rem',
                padding: '1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#ff6b35',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
