import React from "react"
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import { Home, Podcast } from "../App"

type MainNavigationParamList = {
  Home: never
  Podcast: { url: string }
}

const MainNavigationStack =
  createNativeStackNavigator<MainNavigationParamList>()

const MainNavigation = () => (
  <MainNavigationStack.Navigator initialRouteName="Home">
    <MainNavigationStack.Screen name="Home" component={Home} />
    <MainNavigationStack.Screen name="Podcast" component={Podcast} />
  </MainNavigationStack.Navigator>
)

export type MainNavigationScreen<T extends keyof MainNavigationParamList> =
  NativeStackScreenProps<MainNavigationParamList, T>

export default MainNavigation
