import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CCM Revenue Calculator | Healthcare Industry Partners",
  description:
    "Discover how much Chronic Care Management revenue your practice is leaving on the table. Calculate your potential CCM income in minutes.",
  openGraph: {
    title: "CCM Revenue Calculator | Healthcare Industry Partners",
    description:
      "Most practices with 500+ Medicare patients miss $30,000-$150,000/year in CCM revenue. Find your exact number.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
