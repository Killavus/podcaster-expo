import React from "react"
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native"
import { View, Image } from "react-native"
import { FeedChannel } from "../../entities/feed"

type Props = { podcast: FeedChannel }

const Header = (props: Props) => (
  <View style={styles.header}>
    <Image
      source={{ uri: props.podcast.image?.url }}
      accessibilityIgnoresInvertColors
      style={styles.headerImage}
    />
    <Text style={styles.headerDescription}>{props.podcast.description}</Text>
  </View>
)

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

const EpisodesList = ({ episodes }: EpisodesProps) => (
  <FlatList
    data={episodes}
    keyExtractor={episodeKey}
    renderItem={renderEpisodeItem}
  />
)

const PodcastHome = ({ podcast }: Props) => {
  return (
    <>
      <Header podcast={podcast} />
      <EpisodesList episodes={podcast.items} />
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  episodeItemContainer: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  episodeImage: {
    aspectRatio: 1,
    width: 40,
  },
  episodeTitle: {
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  durationText: { color: "#777" },
  headerImage: { aspectRatio: 1, width: "60%" },
  headerDescription: {
    paddingTop: 24,
    textAlign: "center",
  },
})

export default PodcastHome
