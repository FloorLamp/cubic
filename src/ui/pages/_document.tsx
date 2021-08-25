import Document, { Head, Html, Main, NextScript } from "next/document";

const fullTitle = "Cubic";
const description = "Art";
const imageUrl = "";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content={fullTitle} />
          <link rel="icon" href="/img/cubic.svg" />
          <meta property="og:type" content="website" />
          <meta name="title" content={fullTitle} />
          <meta property="og:title" content={fullTitle} />
          <meta property="twitter:title" content={fullTitle} />

          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={imageUrl} />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:description" content={description} />
          <meta property="twitter:image" content={imageUrl} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
