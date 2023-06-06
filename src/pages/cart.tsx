import type { GetServerSideProps,NextPage } from "next"
import { getCartId } from "@lib/cart.client"
import { useCreateCheckoutSessionMutation,useGetCartQuery } from "../../types"
import { Header } from "@c/Header"
import { CartDetail } from "@c/CartDetail"
import { useRouter } from "next/router"
import { CartError } from "@c/CartError"

const Cart: NextPage<IProps>=( { cartId } ) => {
	const { data }=useGetCartQuery( { variables: { id: cartId } } )
	const router=useRouter()
	const [ createCheckoutSession,{ loading: creatingCheckoutSession,error } ]=
		useCreateCheckoutSessionMutation( {
			variables: {
				input: {
					cartId,
				},
			},
			onCompleted: ( data ) => {
				if ( data?.createCheckoutSession?.url ) {
					router.push( data.createCheckoutSession?.url )
				}
			},
		} )
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="min-h-screen p-8">
				<div className="max-w-xl mx-auto space-y-8">
					<h1 className="text-4xl">Cart</h1>
					<CartError error={error} />
					<CartDetail cart={data?.cart} />
					<div>
						<button
							onClick={( e ) => {
								e.preventDefault()
								createCheckoutSession()
							}}
							disabled={creatingCheckoutSession}
							className="w-full p-1 font-light border border-neutral-700 hover:bg-black hover:text-white"
						>
							{creatingCheckoutSession
								? "Redirecting to Checkout"
								:"Go to Checkout"}
						</button>
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
