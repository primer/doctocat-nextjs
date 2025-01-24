// eslint-disable-next-line filenames/match-regex
import type {AppProps} from 'next/app'
import '@primer/doctocat-nextjs/css/global.css'

export default function CustomApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />
}
