import React, { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native"
import { MainNavigationScreen } from "../navigation/Main"
import usePodcast from "../hooks/usePodcast"
import WithLoaded from "../components/WithLoaded"
import PodcastHome from "./Podcast/PodcastHome"

type PodcastProps = MainNavigationScreen<any>

export const Podcast = ({ route, navigation }: PodcastProps) => {
  const { url = "" } = route.params ?? {}
  const podcast = usePodcast(url)

  useEffect(() => {
    if (!url) {
      navigation.goBack()
    }
  }, [navigation, url])

  useEffect(() => {
    if (podcast.data) {
      navigation.setOptions({ headerTitle: podcast.data.title })
    }
  }, [navigation, podcast.data])

  return (
    <WithLoaded query={podcast}>
      {() => (
        <SafeAreaView>
          <PodcastHome podcast={podcast.data!} />
          <StatusBar style="auto" />
        </SafeAreaView>
      )}
    </WithLoaded>
  )
}
