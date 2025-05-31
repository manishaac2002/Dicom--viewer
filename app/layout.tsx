import type { Metadata } from "next";
import './global.css';

export const metadata: Metadata = {
  title: "Dicom viwer app",
  description: "This project done by Manisha A C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
