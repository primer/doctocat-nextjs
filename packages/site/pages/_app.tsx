// eslint-disable-next-line filenames/match-regex
import {AppProps} from 'next/app'
import '@primer/doctocat-nextjs/css/global.css'

function CustomApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />
}

export default CustomApp
