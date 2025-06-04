"use client";

import Providers from "./Providers";
import PageWrapper from "./PageWrapper/PageWrapper";
import Splash from "./Splash/Splash";

export default function ClientLayout({ children }) {
  return (
    <div suppressHydrationWarning={true}>
      <Providers>
        <Splash />

        <PageWrapper>{children}</PageWrapper>
      </Providers>
    </div>
  );
}
