import { StatusBar } from "expo-status-bar"
import React, { useEffect } from "react"
import { SafeAreaView } from "react-native"
import WithLoaded from "../components/WithLoaded"
import usePodcast from "../hooks/usePodcast"
import { MainNavigationScreen } from "../navigation/Main"
import Info from "./Podcast/Info"

type PodcastInfoScreen = MainNavigationScreen<"PodcastInfo">

const PodcastInfo = ({ route, navigation }: PodcastInfoScreen) => {
  const { url = "" } = route.params ?? {}
  const podcast = usePodcast(url)

  useEffect(() => {
    if (!url) {
      navigation.goBack()
    }
  }, [navigation, url])

  useEffect(() => {
    if (podcast.data) {
      navigation.setOptions({
        headerTitle: `${podcast.data.title} - Info`,
      })
    }
  }, [navigation, podcast.data, route])

  return (
    <WithLoaded query={podcast}>
      {() => (
        <SafeAreaView>
          <Info podcast={podcast.data!} />
          <StatusBar style="auto" />
        </SafeAreaView>
      )}
    </WithLoaded>
  )
}

export default PodcastInfo
