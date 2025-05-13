import { Inter } from "next/font/google";
import Providers from "../components/Providers";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Algora - The Fusion of Art and Algorithms",
  description: "Where creativity meets artificial intelligence to redefine the boundaries of digital expression",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressBar />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
