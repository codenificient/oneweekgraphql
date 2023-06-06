import { removeCookies } from "cookies-next"
import { GetServerSideProps,NextPage } from "next"
import Router from "next/router"
import Stripe from "stripe"
import { CartDetail } from "@c/CartDetail"
import { Header } from "@c/Header"
import { stripe } from "@lib/stripe"
import { useGetCartQuery } from "../../types"

const ThankYou: NextPage<IProps>=( { session } ) => {
	const { data }=useGetCartQuery( {
		variables: { id: session?.metadata?.cartId! },
		skip: !session?.metadata?.cartId,
	} )
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="grid flex-1 max-w-4xl min-h-full grid-cols-2 mx-auto space-y-8">
				<div className="p-8 space-y-4 border-r border-neutral-700">
					<h1 className="text-4xl">Thanks!</h1>
					<p>Your order is confirmed!</p>
					<p>You&apos;ll receive an email when it&apos;s ready.</p>
					<p>
						Want to start a new order?{" "}
						<button
							className="font-bold text-pink-400 hover:text-pink-500"
							onClick={() => {
								removeCookies( "cartId" )
								Router.push( "/" )
							}}
						>
							Click here.
						</button>
					</p>
				</div>
				<div className="p-8">
					<CartDetail isReadOnly cart={data?.cart} />
				</div>
			</main>
		</div>
	)
}

interface IProps {
	session: Stripe.Checkout.Session|null
}

export const getServerSideProps: GetServerSideProps<IProps>=async ( {
	query,
} ) => {
	const sessionId=query.session_id
	const session=
		typeof sessionId==="string"
			? await stripe.checkout.sessions.retrieve( sessionId )
			:null
	return { props: { session } }
}

export default ThankYou
