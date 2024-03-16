import { StackContext, NextjsSite, Table, Auth, Api } from 'sst/constructs'

export function Default({ stack }: StackContext) {
  const table = new Table(stack, 'counter', {
    fields: {
      counter: 'string',
    },
    primaryIndex: { partitionKey: 'counter' },
  })
  const api = new Api(stack, 'api', {
    routes: {
      // 'GET /': 'packages/functions/src/time.handler',
      'POST /': 'packages/functions/src/auth.handler',
    },
  })
  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth.handler',
    },
  })
  const site = new NextjsSite(stack, 'site', {
    path: 'packages/web',
    bind: [table, api],
  })
  stack.addOutputs({
    ApiUrl: api.url,
    SiteUrl: site.url,
  })
  auth.attach(stack, {
    api,
    prefix: '/auth', // optional
  })
}
