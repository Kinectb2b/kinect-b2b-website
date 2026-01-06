import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kinect B2B | Boutique Appointment Setting for Service Businesses",
  description: "We fill your calendar with qualified appointments. Boutique appointment setting for HVAC, plumbing, roofing, and service businesses. Founder-led. Results-guaranteed.",
  icons: {
    icon: '/my-logo.png',
    shortcut: '/my-logo.png',
    apple: '/my-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
