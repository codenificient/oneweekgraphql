// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { PrismaClient } from "@prisma/client"
import { readFileSync } from 'fs'
import { createSchema,createYoga } from 'graphql-yoga'
import type { NextApiRequest,NextApiResponse } from 'next'
import { join } from 'path'
import { Resolvers } from '../../../types'

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
      let cart=await prisma.cart.findUnique( {
        where: {
          id
        }
      } )
      if ( !cart ) {
        cart=await prisma.cart.create( {
          data: { id }
        } )
      }
      return cart
    },
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
      return items.reduce((total, item) => total + item.quantity || 1, 0)
    },
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