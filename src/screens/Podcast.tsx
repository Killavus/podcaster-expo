import React, { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { Feather as RawFeather } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { styled } from "dripsy"
import { SafeAreaView } from "../components/Themed"
import { MainNavigationScreen } from "../navigation/Main"
import usePodcast from "../hooks/usePodcast"
import WithLoaded from "../components/WithLoaded"
import PodcastHome from "./Podcast/Home"

const Feather = styled(RawFeather)({
  color: "$header",
})

function renderTopAction(
  route: PodcastProps["route"],
  navigation: PodcastProps["navigation"]
) {
  return (
    <>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() =>
          navigation.navigate("PodcastInfo", { url: route.params.url })
        }>
        <Feather name="info" size={24} />
      </TouchableOpacity>
    </>
  )
}

type PodcastProps = MainNavigationScreen<"Podcast">

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
      navigation.setOptions({
        headerTitle: podcast.data.title,
        headerRight: () => renderTopAction(route, navigation),
      })
    }
  }, [navigation, podcast.data, route])

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
