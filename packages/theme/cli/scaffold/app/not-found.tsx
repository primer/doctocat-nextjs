import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{maxWidth: 720, margin: '10vh auto', padding: 24}}>
      <h1>Page not found</h1>
      <p>The requested documentation page does not exist.</p>
      <Link href="/">Return to the homepage</Link>
    </main>
  )
}
