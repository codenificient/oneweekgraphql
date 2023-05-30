// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { PrismaClient } from "@prisma/client"
import currencyFormatter from 'currency-formatter'
import { readFileSync } from 'fs'
import { GraphQLError } from "graphql"
import { createSchema,createYoga } from 'graphql-yoga'
import type { NextApiRequest,NextApiResponse } from 'next'
import { join } from 'path'

import { findOrCreateCart } from "../../../lib/cart"
import prisma from "../../../lib/prisma"
import { stripe } from "../../../lib/stripe"
import { CartItem,Resolvers } from '../../../types'

const currencyCode="USD"

export const config={
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false
  }
}

export type GraphQLContext={
  prisma: PrismaClient
}

export async function createContext (): Promise<GraphQLContext> {
  return { prisma }
}

const typeDefs=readFileSync( join( process.cwd(),'schema.graphql' ),{ encoding: 'utf8' } )

const resolvers: Resolvers={
  Query: {
    cart: async ( _,{ id },{ prisma } ) => {
      return await findOrCreateCart( prisma,id )
    },
    carts: async ( _,__,{ prisma } ) => {
      return await prisma.cart.findMany()
    }
  },
  Cart: {
    items: async ( { id },_,{ prisma } ) => {
      const items=await prisma.cart.findUnique( {
        where: { id }
      } ).items()
      return items
    },
    totalItems: async ( { id },_,{ prisma } ) => {
      const items=await prisma.cart.findUnique( {
        where: { id }
      } ).items()
      return items.reduce( ( total: number,item: CartItem ) => total+item.quantity||1,0 )
    },
    subTotal: async ( { id },_,{ prisma } ) => {
      const items=await prisma.cart.findUnique( { where: { id } } ).items()
      const amount=items?.reduce( ( total: number,item ) => total+item.price*item.quantity||0,0 )??0
      return { formatted: currencyFormatter.format( amount/100,{ code: currency } ),amount }
    }
  },
  CartItem: {
    unitTotal: item => {
      const amount=item.price
      return {
        amount,
        formatted: currencyFormatter.format( amount/100,{ code: currencyCode } )
      }
    },
    lineTotal: item => {
      const amount=item.price*item.quantity
      return {
        amount,
        formatted: currencyFormatter.format( amount/100,{ code: currencyCode } )
      }
    },
  },
  Mutation: {
    addItem: async ( _,{ input },{ prisma } ) => {
      const cart=await findOrCreateCart( prisma,input.cartId )
      await prisma.cartItem.upsert( {
        create: {
          cartId: cart.id,
          id: input.id,
          name: input.name,
          description: input.description,
          image: input.image,
          price: input.price,
          quantity: input.quantity||1,
        },
        update: {
          quantity: {
            increment: input.quantity||1
          }
        },
        where: {
          id_cartId: {
            id: input.id,
            cartId: cart.id
          }
        }
      } )
      return cart
    },
    removeItem: async ( _,{ input },{ prisma } ) => {
      const { cartId }=await prisma.cartItem.delete( {
        where: {
          id_cartId: {
            id: input.id,
            cartId: input.cartId
          }
        },
        select: {
          cartId: true,
        }
      } )
      return findOrCreateCart( prisma,cartId )
    },
    increaseCartItem: async ( _,{ input },{ prisma } ) => {
      const { cartId }=await prisma.cartItem.update( {
        data: {
          quantity: {
            increment: 1
          }
        },
        where: {
          id_cartId: {
            id: input.id,
            cartId: input.cartId
          }
        },
        select: {
          cartId: true,
        }
      } )
      return findOrCreateCart( prisma,cartId )

    },
    decreaseCartItem: async ( _,{ input },{ prisma } ) => {
      const { cartId,quantity }=await prisma.cartItem.update( {
        data: {
          quantity: {
            decrement: 1
          }
        },
        where: {
          id_cartId: {
            id: input.id,
            cartId: input.cartId
          }
        },
        select: {
          cartId: true,
          quantity: true,
        }
      } )
      if ( quantity<=0 ) {
        await prisma.cartItem.update( {
          where: {
            id_cartId: {
              id: input.id,
              cartId: input.cartId
            }
          },
          data: {
            quantity: {
              set: 0
            }
          }
        } )
      }
      return findOrCreateCart( prisma,cartId )
    },
    createCheckoutSession: async ( _,{ input },{ prisma } ) => {
      const { cartId }=input
      const cart=await findOrCreateCart( prisma,cartId )

      if ( !cart ) {
        throw new GraphQLError( "Cart not found" )
      }

      const cartItems=await prisma.cart.findUnique( {
        where: {
          id: cartId
        }
      } ).items()

      if ( !cartItems||cartItems.length===0 ) {
        throw new GraphQLError( "Cart is empty" )

      }

      const line_items=cartItems.map( lineItem => ( {
        quantity: lineItem.quantity,
        price_data: {
          currency: currencyCode,
          unit_amount: lineItem.price,
          product_data: {
            name: lineItem.name,
            description: lineItem.description||undefined,
            images: lineItem.image? [ lineItem.image ]:[]
          }
        }
      } ) )

      const session=await stripe.checkout.sessions.create( {
        line_items,
        mode: 'payment',
        metadata: {
          cartId: cart.id
        },
        success_url: "http://localhost:3000/thankyou?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/cart?cancelled=true",
      } )
      return {
        id: session.id,
        url: session.url,
      }
    }
  }
}

const schema=createSchema( {
  typeDefs,
  resolvers
} )

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>( {
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
  context: createContext()
} )