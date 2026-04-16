import { getAccessToken } from '#/lib/tokens'
import { accountSchema, type Account } from '#/lib/types/account'
import { errorMsgEvenlopeSchema, type ErrorMsg } from '#/lib/types/error'
import { queryOptions } from '@tanstack/react-query'
// export these options
export const accountQueryOptions = {
  getAccount: queryOptions({
    queryKey: ['account'],
    queryFn: getAccount,
    retry: false,
    // staleTime: 60 * 60 * 1000, // 60 minute
    // gcTime: 86_400_000, // 1 day
  }),
}

// internal function that's used in the above options
export async function getAccount(): Promise<Account> {
  console.log('starting account-query.getAccount() query')
  const accessToken = getAccessToken()
  if (accessToken === null) {
    throw new Error('no Access Token found')
  }

  const baseURL = 'https://api.spotify.com/v1/me'

  const res = await fetch(baseURL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  // read response and parse into json
  const data = await res.json().catch((err) => {
    const errMsg =
      'Parsing json out of fetch response from API in account-query.getAccount(): ' +
      err
    console.error(errMsg)
    throw new Error(errMsg)
  })

  // handle non-200 status
  if (!res.ok) {
    const envelope = errorMsgEvenlopeSchema.safeParse(data)

    if (envelope.success) {
      const errorMsg: ErrorMsg = envelope.data.error
      console.log(`...returning from account-query.getAccount()`)
      throw new Error(
        `account-query.getAccount(): status: ${errorMsg.status} msg: ${errorMsg.message}`,
      )
    }

    // else, zod could not parse api response
    console.log(`zod error: ${JSON.stringify(envelope.error.issues)}`)
    throw new Error(
      `Parsing of json for account-query.getAccount() failed. ZOD ERROR: ${JSON.stringify(envelope.error.issues)}`,
    )
  }

  // parse json into an object
  const envelope = accountSchema.safeParse(data)
  if (envelope.success) {
    const account: Account = envelope.data
    console.log(`...returning from account-query.getAccount()`)
    return account
  }

  console.log(`zod error: ${JSON.stringify(envelope.error.issues)}`)
  throw new Error(
    `Parsing of json for catalog-query.getAll() failed. ZOD ERROR: ${JSON.stringify(envelope.error.issues)}`,
  )
}
