import { Inter } from 'next/font/google'

const inter=Inter( { subsets: [ 'latin' ] } )

export default function Home () {
  return (
    <h1
      className={`text-red-500 my-5 text-center ${inter.className}`}
    >

      Welcome to NEXTJS



    </h1>
  )
}
