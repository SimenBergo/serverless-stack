import styles from '@/styles/Home.module.css'
import { Table } from 'sst/node/table'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetCommand, UpdateCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Button } from '@tremor/react'
import Link from 'next/link'

export default function Home({ count }: { count: number }) {
  console.log('This site has been visited ', count, ' times.')
  return (
    <main className='min-h-screen flex flex-col items-center'>
      <h1 className='text-6xl font-bold mt-20'>Welcome to Serverless Stack</h1>
      <p className='text-2xl mt-5'>This site has been visited {count} times.</p>
      <Link href='/auth/google/authorize'>
        <Button variant='primary' className='mt-5' color='emerald'>
          Sign in with Google
        </Button>
      </Link>
    </main>
  )
}

export async function getServerSideProps() {
  const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  console.log('Table', Table)
  const get = new GetCommand({
    TableName: Table.counter.tableName,
    Key: {
      counter: 'hits',
    },
  })
  const results = await db.send(get)
  let count = results.Item ? results.Item.tally : 0

  const update = new UpdateCommand({
    TableName: Table.counter.tableName,
    Key: {
      counter: 'hits',
    },
    UpdateExpression: 'SET tally = :count',
    ExpressionAttributeValues: {
      ':count': ++count,
    },
  })
  await db.send(update)

  return { props: { count } }
}
