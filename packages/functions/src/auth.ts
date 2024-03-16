import { AuthHandler, GoogleAdapter } from 'sst/node/auth'

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: 'oidc',
      clientID: 'XXXX',
      onSuccess: async tokenset => {
        const claims = tokenset.claims()
        const email = claims.email
        const domain = email?.split('@')[1]

        if (domain === 'h5p.group') {
          return {
            statusCode: 200,
            body: JSON.stringify(claims),
          }
        } else {
          return {
            statusCode: 403,
            body: 'Unauthorized',
          }
        }
      },
    }),
  },
})
