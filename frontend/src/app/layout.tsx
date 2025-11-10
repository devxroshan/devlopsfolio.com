import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";


// Components
import Navbar from "./components/Navbar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "devlopsfolio",
  description: "A platform to showcase projects and skills. Get hired today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased vsc-initialized`}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
