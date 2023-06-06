import type { GetServerSideProps,NextPage } from "next"
import { getCartId } from "../../lib/cart.client"
import { useGetCartQuery } from "../../types"
import { Header } from "@c/Header"

const Cart: NextPage<IProps>=( { cartId } ) => {
	const { data }=useGetCartQuery( { variables: { id: cartId } } )
	return (
		<div className="flex flex-col min-h-screen m-4">
			<Header />
			<main className="min-h-screen p-8">
				<div className="max-w-xl mx-auto space-y-8">
					<h1 className="text-4xl text-purple-600">Cart</h1>
					<div>Items: {data?.cart?.totalItems}</div>
					<div className="flex justify-between pt-4 border-t">
						<div>Subtotal</div>
						<div>{data?.cart?.subTotal.formatted}</div>
					</div>
				</div>
			</main>
		</div>
	)
}

interface IProps {
	cartId: string
}

export const getServerSideProps: GetServerSideProps<IProps>=async ( {
	req,
	res,
} ) => {
	const cartId=getCartId( { req,res } )
	return { props: { cartId } }
}

export default Cart
