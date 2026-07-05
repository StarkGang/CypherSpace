import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: {
    default: "Cypher Space - NSSCE",
    template: "%s | Cypher Space",
  },
  description: "Cypher Space brings together students passionate about blockchain to learn, build, research, and share knowledge at NSSCE.",
  keywords: ["Blockchain", "Blockchain Community", "NSSCE", "Cypher Space", "Web3", "Students", "Research", "Tech Club"],
  authors: [{ name: "Cypher Space Team" }],
  creator: "Cypher Space",
  icons: {
    icon: [
      { url: "/logo.svg", sizes: "48x48", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Cypher Space - NSSCE",
    description: "Cypher Space brings together students passionate about blockchain to learn, build, research, and share knowledge at NSSCE.",
    siteName: "Cypher Space",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cypher Space - NSSCE",
    description: "Cypher Space brings together students passionate about blockchain to learn, build, research, and share knowledge at NSSCE.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { cookies } from "next/headers";
import { AuthProvider } from "../lib/auth";
import { ThemeProvider } from "../components/ThemeProvider";
import LaunchProvider from "../components/layout/LaunchProvider";
import { getSettings } from "../lib/data";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const isDark = theme === "dark";
  const settings = await getSettings();

  return (
    <html lang="en" className={isDark ? "dark" : ""}>
      <head>
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xdklqu5yg4");
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <LaunchProvider settings={settings}>
              {children}
            </LaunchProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
