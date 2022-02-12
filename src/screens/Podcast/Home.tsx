import React from "react"
import { FlatList, ListRenderItemInfo, FlatListProps } from "react-native"
import { Image, Pressable } from "dripsy"
import * as Haptics from "expo-haptics"
import { useNavigation } from "@react-navigation/native"
import { Text } from "../../components/Themed"
import { FeedChannel } from "../../entities/feed"
import { MainNavigationScreen } from "../../navigation/Main"
import Hairline from "../../components/Hairline"

type Episode = FeedChannel["items"][number]

type EpisodesProps = {
  episodes: Episode[]
}

function episodeKey(item: Episode) {
  return item.guid ?? item.file
}

function renderEpisodeItem(info: ListRenderItemInfo<Episode>) {
  return <EpisodeItem episode={info.item} />
}

type EpisodeItemProps = {
  episode: Episode
}

const EpisodeItem = ({ episode }: EpisodeItemProps) => {
  const navigation =
    useNavigation<MainNavigationScreen<"Podcast">["navigation"]>()

  return (
    <Pressable
      accessibilityRole="button"
      sx={{
        paddingX: "$2",
        paddingY: "$2",
        backgroundColor: "$background",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
      }}
      // TODO: Implement highlight for iOS.
      android_ripple={{ color: "#ccc" }}
      onLongPress={() => {
        // TODO: Implement a better haptics for Android. Using Vibration is a joke
        // since Android supports proper haptic feedback using
        // #performHapticFeedback API.

        // TODO: Implement detailed view with animations (so called "extended" state of this item element).
        // getItemLayout is going to be modified as well.
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }}
      onPress={() => {
        navigation.navigate("Episode", { episode })
      }}>
      <Image
        source={{ uri: episode.itunes.image as string }}
        sx={{
          aspectRatio: 1,
          width: 48,
        }}
        accessibilityIgnoresInvertColors
      />
      <Text
        numberOfLines={1}
        sx={{
          paddingX: "$2",
          paddingY: "$2",
          fontSize: "$1",
          fontWeight: "normal",
          flex: 1,
        }}>
        {episode.title}
      </Text>
      <Text sx={{ color: "$secondary" }}>
        <Duration duration={episode.itunes.duration as number} />
      </Text>
    </Pressable>
  )
}

type DurationProps = {
  duration: number
}

const Duration = ({ duration }: DurationProps) => {
  const hours = Math.floor(duration / 3600).toString()
  const minutes = Math.floor((duration % 3600) / 60).toString()
  const seconds = (duration % 60).toString()

  return (
    <Text>
      {[hours, minutes, seconds]
        .map((piece) => piece.padStart(2, "0"))
        .join(":")}
    </Text>
  )
}

const EPISODE_ITEM_HEIGHT = 72

const calculateItemLayout: FlatListProps<Episode>["getItemLayout"] = (
  _data,
  index
) => {
  return {
    length: EPISODE_ITEM_HEIGHT,
    offset: EPISODE_ITEM_HEIGHT * index,
    index,
  }
}

const EpisodesList = ({ episodes }: EpisodesProps) => (
  <FlatList
    data={episodes}
    keyExtractor={episodeKey}
    renderItem={renderEpisodeItem}
    ItemSeparatorComponent={Hairline}
    getItemLayout={calculateItemLayout}
  />
)

type Props = { podcast: FeedChannel }

const PodcastHome = ({ podcast }: Props) => (
  <EpisodesList episodes={podcast.items} />
)

export default PodcastHome
