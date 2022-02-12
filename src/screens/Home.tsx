import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StatusBar } from "expo-status-bar"
import { Pressable, Text } from "dripsy"
import { FlatList, ListRenderItem } from "react-native"
import { SafeAreaView } from "../components/Themed"
import { MainNavigationScreen } from "../navigation/Main"
import Hairline from "../components/Hairline"

const ListItem = ({ item }: { item: PodcastItem }) => {
  const navigation = useNavigation<MainNavigationScreen<"Home">["navigation"]>()
  return (
    <Pressable
      android_ripple={{ color: "#ccc" }}
      accessibilityRole="link"
      sx={{
        paddingX: "$2",
        paddingY: "$2",
        height: 64,
        justifyContent: "center",
      }}
      onPress={() => navigation.navigate("Podcast", { url: item.url })}>
      <Text sx={{ color: "$text", fontSize: "$1" }}>{item.name}</Text>
    </Pressable>
  )
}

const renderListItem: ListRenderItem<PodcastItem> = ({ item }) => {
  return <ListItem item={item} />
}

function keyExtractor(item: PodcastItem) {
  return item.url
}

const PODCAST_URL = "https://anchor.fm/s/5a81754/podcast/rss"

type PodcastItem = { name: string; url: string }

const PODCAST_LIST: PodcastItem[] = [
  { name: "Karol Paciorek", url: PODCAST_URL },
  { name: "Kontent Queens", url: "https://anchor.fm/s/3aa67914/podcast/rss" },
]

export const Home = () => {
  return (
    <>
      <SafeAreaView>
        <FlatList
          data={PODCAST_LIST}
          renderItem={renderListItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={Hairline}
        />
      </SafeAreaView>
      <StatusBar style="auto" />
    </>
  )
}
