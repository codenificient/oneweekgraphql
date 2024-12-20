import Link from "next/link"
import { Product } from "../lib/products"
import { ProductItem } from "./ProductItem"

export function ProductList ( { products }: { products: Product[] } ) {
	return (
		<ul className="grid grid-flow-row-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{products.slice( 0,100 ).map( ( product,index ) => (
				<ProductLink key={index} product={product} />
			) )}
		</ul>
	)
}

export function ProductLink ( { product }: { product: Product } ) {
	return (
		<Link href={`/products/${product.slug}`} key={product.slug}>
			<a style={{ height: 500 }} className="bg-gray-400">
				<ProductItem product={product} />
			</a>
		</Link>
	)
}