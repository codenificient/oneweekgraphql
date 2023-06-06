import { GetServerSideProps,NextPage } from "next"
import Stripe from "stripe"
import { Header } from "@c/Header"
import { stripe } from "@lib/stripe"

const ThankYou: NextPage<IProps>=( { session } ) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
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
