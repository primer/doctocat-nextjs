import {AppProps} from 'next/app'
import '@primer/doctocat-nextjs/css/global.css'
import '@primer/doctocat-nextjs/css/code-block-overrides.css'

function CustomApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />
}

export default CustomApp
