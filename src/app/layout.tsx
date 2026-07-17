import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "¿Quién Quiere Ser Bendecido? | Misión Cristiana Elim",
  description: "Juego de trivia bíblica para la vigilia juvenil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          // Se aplica antes de pintar para evitar el parpadeo del tema incorrecto.
          dangerouslySetInnerHTML={{
            __html: `try {
              var t = localStorage.getItem("vigilia-theme");
              if (t === "dark") document.documentElement.classList.add("dark");
            } catch (e) {}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
