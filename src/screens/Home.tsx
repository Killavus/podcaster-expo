import { useNavigation } from "@react-navigation/native"
import React, { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { Text } from "../components/Themed"
import { MainNavigationScreen } from "../navigation/Main"
import CenteredSafeAreaView from "../components/CenteredSafeAreaView"

const PODCAST_URL = "https://anchor.fm/s/5a81754/podcast/rss"
type HomeProps = MainNavigationScreen<"Home">

export const Home = () => {
  const navigation = useNavigation<HomeProps["navigation"]>()

  useEffect(() => {
    navigation.navigate("Podcast", { url: PODCAST_URL })
  }, [navigation])

  return (
    <CenteredSafeAreaView>
      <Text>Here will be a FlatList of all podcasts!</Text>
      <StatusBar style="auto" />
    </CenteredSafeAreaView>
  )
}
