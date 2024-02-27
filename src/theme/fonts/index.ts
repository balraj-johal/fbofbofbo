import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const FONT_VARIABLES = [inter.variable].join(" ");
