import React, { useState, useCallback } from "react"
import {
  useWindowDimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native"
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"
import { Image, useSx } from "dripsy"
import {
  Text,
  TouchableOpacity,
  ImageBackground,
} from "../../components/Themed"
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

  const sx = useSx()

  return (
    <ImageBackground
      source={{ uri: podcast.image?.url }}
      sx={{
        aspectRatio: 1,
        justifyContent: "flex-end",
        backgroundColor: "$black",
        borderBottomColor: "$secondary",
        borderBottomWidth: 1,
      }}
      accessibilityIgnoresInvertColors>
      <Animated.View
        style={[
          sx({ width: "100%", flex: 1, backgroundColor: "$black" }),
          animatedOpacity,
        ]}></Animated.View>
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
    sx={{
      paddingX: "$2",
      paddingY: "$2",
      backgroundColor: "$background",
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "nowrap",
      borderBottomColor: "$muted",
      borderBottomWidth: 1,
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

export default PodcastHome
