import "./globals.css";

export const metadata = {
  title: "TraumaStats",
  description: "Smite In-House Tracker"
};

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}