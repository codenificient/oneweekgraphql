import Link from "next/link"
import { removeCookies } from "cookies-next"
import { ExclamationCircle } from "./ExclamationCircle"

export function CartError ( { error }: { error: Error|undefined } ) {
	if ( !error ) {
		return null
	}
	return (
		<div className="p-4 bg-red-500 rounded">
			<div className="flex items-center gap-2">
				<ExclamationCircle />
				<div className="flex items-center justify-between flex-1">
					{error.message}
					{error.message==="Cart is empty"? (
						<Link href="/">
							<a className="p-1 px-2 border border-black rounded hover:bg-red-300">
								Keep browsing
							</a>
						</Link>
					):null}
					{error.message==="Invalid cart"? (
						<button
							onClick={() => {
								removeCookies( "cartId" )
								window.location.reload()
							}}
							className="p-1 px-2 border border-black rounded hover:bg-red-300"
						>
							Empty cache and reload
						</button>
					):null}
				</div>
			</div>
		</div>
	)
}
