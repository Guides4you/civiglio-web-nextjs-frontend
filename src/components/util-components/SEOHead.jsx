import Head from 'next/head';

/**
 * SEO Head Component
 * Reusable component for SEO meta tags
 */
export default function SEOHead({
  title = 'Civiglio Web',
  description = 'Civiglio Web - Guida audio interattiva per scoprire il territorio',
  keywords = 'civiglio, guida audio, turismo, cultura, territorio',
  ogImage = '/img/og-image.jpg',
  ogUrl,
  noindex = false
}) {
  const fullTitle = title === 'Civiglio Web' ? title : `${title} | Civiglio Web`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Charset */}
      <meta charSet="utf-8" />
    </Head>
  );
}
