import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { NavigationContainer } from "@react-navigation/native"
import MainNavigation from "./src/navigation/Main"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </QueryClientProvider>
  )
}
