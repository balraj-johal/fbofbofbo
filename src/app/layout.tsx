import type { Metadata } from "next";

import RootBody from "@/components/RootBody";

export const metadata: Metadata = {
  title: "Next 13 Starter",
  description: "CHANGE ME :)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <RootBody>{children}</RootBody>
    </html>
  );
}
