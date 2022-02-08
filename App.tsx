import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { NavigationContainer } from "@react-navigation/native"
import { useColorScheme } from "react-native"
import { DripsyProvider, DripsyThemeWithoutIgnoredKeys } from "dripsy"
import MainNavigation from "./src/navigation/Main"
import darkTheme from "./src/themes/dark"
import lightTheme from "./src/themes/light"

const queryClient = new QueryClient()

type ThemeType = typeof darkTheme

declare module "dripsy" {
  interface DripsyCustomTheme extends ThemeType {}
}

const makeThemeFromDripsy = (
  theme: DripsyThemeWithoutIgnoredKeys,
  dark: boolean
) => ({
  dark,
  colors: {
    primary: theme.colors.$primary,
    background: theme.colors.$background,
    card: theme.colors.$muted,
    text: theme.colors.$header,
    border: theme.colors.$secondary,
    notification: theme.colors.$accent,
  },
})

const Light = makeThemeFromDripsy(lightTheme, false)
const Dark = makeThemeFromDripsy(darkTheme, true)

export default function App() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === "dark" ? darkTheme : lightTheme
  const navigationTheme = colorScheme === "dark" ? Dark : Light

  return (
    <DripsyProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navigationTheme}>
          <MainNavigation />
        </NavigationContainer>
      </QueryClientProvider>
    </DripsyProvider>
  )
}
