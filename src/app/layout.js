import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import BiblioBot from "@/Components/BiblioBot";
import { Toaster } from "react-hot-toast";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "📚 BiblioDrop",
  description: "Modern Online Book Delivery Management System",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.className}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
        <BiblioBot />
        <Toaster />
      </body>
    </html>
  );
}
