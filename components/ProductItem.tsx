import Image from "next/image"
import { HTMLProps } from "react"

import { Product } from "@lib/products"

export function ProductItem ( {
	product: { price,src,title },
}: HTMLProps<HTMLDivElement>&{
	product: Product
} ) {
	return (
		<div className="relative flex items-center justify-center w-full h-full p-4 group overflow-clip">
			<div className="absolute top-0 left-0 z-10">
				<div className="p-2 text-2xl font-semibold bg-white border-b border-black">
					{title}
				</div>
				<div className="z-10 p-2 text-sm bg-white w-fit">
					${price/100} USD
				</div>
			</div>
			<Image
				className="w-full h-full transition duration-500 transform motion-safe:group-focus:scale-110 motion-safe:group-hover:scale-110"
				src={src}
				alt={title}
				layout="fill"
				objectFit="cover"
			/>
		</div>
	)
}
