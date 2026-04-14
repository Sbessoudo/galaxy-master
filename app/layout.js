import './globals.css'

export const metadata = {
  title: 'Galaxy Master — Eleven Labs',
  description: 'Back-office de la plateforme de gamification Planets',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;900&family=Work+Sans:wght@300;400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="h-full">{children}</body>
    </html>
  )
}
