import '@/styles/globals.css'
import { ApolloProvider } from "@apollo/client"
import { useClient } from "@lib/client"
import type { AppProps } from 'next/app'

export default function App ( { Component,pageProps }: AppProps ) {
  const client=useClient()
  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
}
