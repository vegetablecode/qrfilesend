import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "QR File Send - Easy Print Shop File Uploads",
  description: "Upload files to your local print shop by scanning a QR code",
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
