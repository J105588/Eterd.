import type { Metadata } from "next";
import { Inter, Outfit, Zen_Old_Mincho } from "next/font/google";
import "../globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import StructuredData from "@/components/seo/StructuredData";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mincho = Zen_Old_Mincho({ 
  weight: ["400", "700", "900"], 
  subsets: ["latin"], 
  variable: "--font-mincho" 
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  
  return {
    title: {
      default: dict.seo.home.title,
      template: `%s | Eterd.`,
    },
    description: dict.seo.home.description,
    keywords: ["Eterd", "Label", "Music", "Creator", "Art", "Eternal Dream"],
    authors: [{ name: "Eterd." }],
    openGraph: {
      type: "website",
      siteName: "Eterd.",
      title: dict.seo.home.title,
      description: dict.seo.home.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo.home.title,
      description: dict.seo.home.description,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://eterd.vercel.app"),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'ja': '/ja',
        'en': '/en',
        'x-default': '/ja', // default to Japanese
      },
    },
    verification: {
      google: 'ebc974919646a276',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "Eterd.",
    "url": "https://eterd.vercel.app",
    "logo": "https://eterd.vercel.app/icon.png",
    "description": dict.seo.home.description,
    "sameAs": [
      "https://twitter.com/Eterd_jp", // Placeholder, check if I can find actual links
    ],
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <StructuredData data={organizationData} />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${mincho.variable} font-sans antialiased text-foreground selection:bg-black selection:text-white`}>
        <LayoutWrapper lang={lang as Locale} dict={dict}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
