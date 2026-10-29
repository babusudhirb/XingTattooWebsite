import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

import { initClickTracking, track } from "@/lib/track";

/**
 * Google Tag Manager (VITE_GTM_ID) or, failing that, GA4 gtag.js (VITE_GA_ID) — never
 * both, production builds only, nothing at all when neither ID is set. Consent Mode v2
 * defaults are set before the tag loads: analytics granted, all ad storage denied.
 */
const env = import.meta.env;
const GTM_ID =
  env.PROD && /^GTM-[A-Z0-9]+$/.test(env["VITE_GTM_ID"] ?? "") ? env["VITE_GTM_ID"] : "";
const GA_ID =
  env.PROD && !GTM_ID && /^G-[A-Z0-9]+$/.test(env["VITE_GA_ID"] ?? "") ? env["VITE_GA_ID"] : "";
const TAG_ON = Boolean(GTM_ID || GA_ID);

const CONSENT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
document.documentElement.dataset.tag='${GTM_ID ? "gtm" : "ga"}';`;

const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

const GA_SNIPPET = `gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`;

/** In <head>: consent defaults, then the GTM loader or gtag.js (async). */
export function GoogleTagHead() {
  if (!TAG_ON) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: CONSENT }} />
      {GTM_ID ? (
        <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
      ) : (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
          <script dangerouslySetInnerHTML={{ __html: GA_SNIPPET }} />
        </>
      )}
    </>
  );
}

/** First thing in <body>: GTM's no-JS iframe. */
export function GoogleTagNoscript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

/**
 * SPA page views (one per navigation, the first load included, never twice) and the
 * delegated data-track click listener.
 */
export function GoogleTagEvents() {
  const router = useRouter();
  useEffect(() => {
    if (!TAG_ON) return;
    let last = "";
    const pageView = () => {
      const { pathname, search } = window.location;
      const key = pathname + search;
      if (key === last) return;
      last = key;
      track("page_view", {
        page_location: window.location.href,
        page_path: pathname,
        page_title: document.title,
      });
    };
    pageView();
    // onResolved fires after the new route's head (title) has been applied
    const unsubscribe = router.subscribe("onResolved", () => requestAnimationFrame(pageView));
    const stopClicks = initClickTracking();
    return () => {
      unsubscribe();
      stopClicks();
    };
  }, [router]);
  return null;
}
