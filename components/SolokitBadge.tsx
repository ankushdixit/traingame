"use client";

import Script from "next/script";

export function SolokitBadge() {
  return (
    <>
      <Script src="https://getsolokit.com/badge.js" strategy="lazyOnload" />
      <div id="solokit-badge" data-theme="light" data-position="fixed" />
    </>
  );
}
