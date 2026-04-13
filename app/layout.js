import './globals.css'

export const metadata = {
  title: 'Galaxy Master — Eleven Labs',
  description: 'Back-office de la plateforme de gamification Planets',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
