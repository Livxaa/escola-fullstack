import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Escola Estadual — Excelência em Educação",
  description:
    "Página inicial da Escola Estadual. Formando cidadãos com excelência acadêmica, valores humanistas e visão de futuro.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
