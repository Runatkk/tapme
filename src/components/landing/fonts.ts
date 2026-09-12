import { Abhaya_Libre, Source_Sans_3 } from "next/font/google";

export const headingFont = Abhaya_Libre({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-landing-heading",
});

export const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-landing-body",
});
