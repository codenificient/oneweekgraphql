import { CartFragment } from "../types"
import { CartItem } from "./CartItem"

export function CartDetail ( {
	cart,
}: {
	cart: CartFragment|null|undefined
} ) {
	return (
		<div>
			<div className={`space-y-8 relative`}>
				{cart?.items.map( ( item ) => (
					<CartItem key={item.id} item={item} cartId={cart.id} />
				) )}
			</div>
			<div className="pt-4 my-4 border-t border-neutral-700">
				<div className="flex justify-between">
					<div>Subtotal</div>
					<div>{cart?.subTotal.formatted}</div>
				</div>
			</div>
			<div className="pt-4 border-t border-neutral-700">
				<div className="flex justify-between font-bold">
					<div>Total</div>
					<div className="">{cart?.subTotal.formatted}</div>
				</div>
			</div>
		</div>
	)
}
