import { Header } from "@c/Header"
import { ProductList } from "@c/ProductList"
import { Product,products } from "@lib/products"
import type { GetStaticProps,InferGetStaticPropsType,NextPage } from "next"

export const getStaticProps: GetStaticProps<{
  products: Product[]
}>=async () => ( {
  props: {
    products: products.slice( 0,10 ),
  },
} )

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>>=( {
  products,
} ) => {
  return (
    <div>
      <Header />
      <main>
        <section>
          <ProductList products={products} />
        </section>
      </main>
    </div>
  )
}

export default Home
