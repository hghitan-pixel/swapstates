import './globals.css'

export const metadata = {
  title: 'SwapStates | Trade Homes Across America',
  description: 'Find someone who wants to live where you are, while you move where they are.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
