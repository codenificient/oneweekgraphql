import { Product } from "@lib/products"
import { ProductItem } from "./ProductItem"
import { GetCartDocument,useAddToCartMutation } from "../types"

import { getCookie } from "cookies-next"

export function ProductDetail ( { product }: { product: Product|null } ) {
	const cartId=String( getCookie( "cartId" ) );
	const [ addToCart,{ loading } ]=useAddToCartMutation( {
		refetchQueries: [ GetCartDocument ],
	} );
	
	if ( !product ) {
		return null
	}
	return (
		<main className="grid grid-cols-4 h-[700px]">
			<div className="flex items-center justify-center col-span-3">
				<ProductItem product={product} />
			</div>
			<div className="p-8 space-y-4">
				<form
					className="p-8 space-y-4"
					onSubmit={( e ) => {
						e.preventDefault()
						addToCart( {
							variables: {
								input: {
									cartId,
									id: product.id,
									name: product.title,
									description: product.body,
									price: product.price,
									image: product.src,
								},
							},
						} )
					}}
				>
					<div dangerouslySetInnerHTML={{ __html: product.body }} />
					<button
						className="w-full px-6 py-4 text-white uppercase bg-black border border-black rounded hover:bg-white hover:text-black"

						type="submit"
					>
						{loading? "Adding to cart...":"Add to cart"}
					</button>
				</form>
			</div>
		</main>
	)
}
