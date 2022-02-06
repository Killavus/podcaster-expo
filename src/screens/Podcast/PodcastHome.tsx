import React from "react"
import { useState } from "react"
import { useCallback } from "react"
import { ImageBackground, useWindowDimensions } from "react-native"
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
} from "react-native"
import { TouchableOpacity, Image } from "react-native"
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"
import { FeedChannel } from "../../entities/feed"

type HeaderProps = { podcast: FeedChannel; listScrollY: number }

const Header = ({ podcast, listScrollY }: HeaderProps) => {
  const screen = useWindowDimensions()
  const threshold = Math.min(screen.width, screen.height)

  const scrollProgress = useDerivedValue(() => {
    return Math.max(0, Math.min(listScrollY, threshold)) / threshold
  }, [listScrollY, screen.width, screen.height])

  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: withSpring(scrollProgress.value),
  }))

  return (
    <ImageBackground
      source={{ uri: podcast.image?.url }}
      style={styles.headerImage}
      accessibilityIgnoresInvertColors>
      <Animated.View
        style={[styles.blackScrollDrop, animatedOpacity]}></Animated.View>
    </ImageBackground>
  )
}

type Episode = FeedChannel["items"][number]

type EpisodesProps = {
  episodes: Episode[]
  onScroll?(event: NativeSyntheticEvent<NativeScrollEvent>): void
  header: React.ComponentProps<typeof FlatList>["ListHeaderComponent"]
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

const EpisodeItem = ({ episode }: EpisodeItemProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    style={styles.episodeItemContainer}>
    <Image
      source={{ uri: episode.itunes.image as string }}
      style={styles.episodeImage}
      accessibilityIgnoresInvertColors
    />
    <Text numberOfLines={1} style={styles.episodeTitle}>
      {episode.title}
    </Text>
    <Text style={styles.durationText}>
      <Duration duration={episode.itunes.duration as number} />
    </Text>
  </TouchableOpacity>
)

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

const EpisodesList = ({ episodes, onScroll, header }: EpisodesProps) => (
  <FlatList
    data={episodes}
    keyExtractor={episodeKey}
    renderItem={renderEpisodeItem}
    onScroll={onScroll}
    scrollEventThrottle={16}
    ListHeaderComponent={header}
  />
)

type Props = { podcast: FeedChannel }

const PodcastHome = ({ podcast }: Props) => {
  const [listScrollY, setListScrollY] = useState(0)

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setListScrollY(Math.floor(nativeEvent.contentOffset.y))
    },
    []
  )

  return (
    <EpisodesList
      episodes={podcast.items}
      onScroll={onScroll}
      header={<Header podcast={podcast} listScrollY={listScrollY} />}
    />
  )
}

const styles = StyleSheet.create({
  episodeItemContainer: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  blackScrollDrop: { width: "100%", flex: 1, backgroundColor: "#000" },
  episodeImage: {
    aspectRatio: 1,
    width: 40,
  },
  episodeTitle: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "normal",
    flex: 1,
  },
  durationText: { color: "#777" },
  headerImage: {
    aspectRatio: 1,
    justifyContent: "flex-end",
    backgroundColor: "#000",
    borderBottomColor: "#999",
    borderBottomWidth: 1,
  },
})

export default PodcastHome
