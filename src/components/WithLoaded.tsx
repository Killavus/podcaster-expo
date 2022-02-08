import React from "react"
import { ActivityIndicator } from "dripsy"
import { UseQueryResult } from "react-query"
import CenteredSafeAreaView from "./CenteredSafeAreaView"

type WithLoadedProps<Data, Error> = {
  query: UseQueryResult<Data, Error>
  children: {
    (props: { data?: Data; error?: Error }): React.ReactElement<any, any> | null
  }
}

const WithLoaded = <Data, Error>({
  query,
  children,
}: WithLoadedProps<Data, Error>) => {
  if (query.isLoading) {
    return (
      <CenteredSafeAreaView>
        <ActivityIndicator size="large" sx={{ color: "$accent" }} />
      </CenteredSafeAreaView>
    )
  }

  if (query.isError) {
    return children({ error: query.error })
  }

  return children({ data: query.data })
}

export default WithLoaded
