import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <meta charSet="UTF-8" />

        {/* SEO Meta Tags - Default values, can be overridden per page */}
        <meta name="description" content="Civiglio - Scopri luoghi, storie e audioguide interattive. Esplora il patrimonio culturale attraverso contenuti audio creati da guide esperte." />
        <meta name="keywords" content="audioguide, guide turistiche, luoghi storici, cultura, patrimonio, turismo, audio tour" />
        <meta name="author" content="Civiglio" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Civiglio" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* External CSS Dependencies */}
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rbyDn92a1DqWOw9vWG2MFoays0sgObmWazO5BQPiFucnnEAjpAB+/Sw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Local CSS Files */}
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/bootstrap-grid.css" />
        <link rel="stylesheet" href="/css/icons.css" />
        <link rel="stylesheet" href="/css/plugins/revolutionslider.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/audioplayer.css" />
        <link rel="stylesheet" href="/css/carousel.css" />
      </Head>
      <body className="homepage-4 inner-pages">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
