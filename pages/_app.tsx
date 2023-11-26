import { AppProps } from "next/app";
import "../@primer-nextocat/css/global.css";
import "../@primer-nextocat/css/code-block-overrides.css";

function CustomApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default CustomApp;
