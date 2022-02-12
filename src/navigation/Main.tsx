import React from "react"
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import { Home } from "../screens/Home"
import { Podcast } from "../screens/Podcast"
import PodcastInfo from "../screens/PodcastInfo"
import { Episode } from "../screens/Episode"
import { FeedItem } from "../entities/feed"

type MainNavigationParamList = {
  Home: never
  Podcast: { url: string }
  PodcastInfo: { url: string }
  Episode: { episode: FeedItem }
}

const MainNavigationStack =
  createNativeStackNavigator<MainNavigationParamList>()

const MainNavigation = () => (
  <MainNavigationStack.Navigator initialRouteName="Home">
    <MainNavigationStack.Screen name="Home" component={Home} />
    <MainNavigationStack.Screen name="Podcast" component={Podcast} />
    <MainNavigationStack.Screen name="PodcastInfo" component={PodcastInfo} />
    <MainNavigationStack.Screen
      name="Episode"
      component={Episode}
      options={{ presentation: "card" }}
    />
  </MainNavigationStack.Navigator>
)

export type MainNavigationScreen<T extends keyof MainNavigationParamList> =
  NativeStackScreenProps<MainNavigationParamList, T>

export default MainNavigation
