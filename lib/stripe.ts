import Stripe from 'stripe'

export const stripe=new Stripe( process.env.STRIPE_SECRET_KEY as string,{ apiVersion: "2020-08-27" } )

// ci5Ux^hxsMDmzD8pYBwZpmwTS3MQ8#aia54@9#SMU$8z62rFd*bECReiAT8U*Cepy