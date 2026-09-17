import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertHub - Subdomain-Based Certificate Management System",
  description:
    "Multi-portal certificate generation and management system supporting Nikah/Marriage, Birth, Appreciation, Course Completion, and Membership certificates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
