import { Inter } from 'next/font/google'
import './globals.css'
import VisitorTracker from '@/components/VisitorTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SwapStates - Trade Homes Across State Lines',
  description: 'Find homeowners who want to swap homes with you. Skip the slow market and expensive agent fees.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VisitorTracker />
        {children}
      </body>
    </html>
  )
}
