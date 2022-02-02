import { StatusBar } from "expo-status-bar"
import React, { useEffect } from "react"
import { StyleSheet, Text, SafeAreaView, ActivityIndicator } from "react-native"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "react-query"
import { XMLParser } from "fast-xml-parser/src/fxp"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { FeedChannel, parsePodcastFeed } from "./entities/feed"
import MainNavigation, { MainNavigationScreen } from "./navigation/Main"

const PODCAST_URL = "https://anchor.fm/s/5a81754/podcast/rss"

async function fetchPodcastFeed(url: string): Promise<FeedChannel> {
  const response = await fetch(url, {
    method: "get",
    headers: { "Content-Type": "application/rss+xml" },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch podcast: ${response.status} ${response.statusText}`
    )
  }

  const body = await response.text()
  const parser = new XMLParser({ ignoreAttributes: false })
  const {
    rss: { channel },
  } = parser.parse(body)

  if (!channel) {
    throw new Error("Failed to fetch podcast: missing channel data in response")
  }

  return parsePodcastFeed(channel)
}

function usePodcast(url: string) {
  const query: UseQueryResult<FeedChannel, Error> = useQuery(url, async () => {
    if (url) {
      return fetchPodcastFeed(url)
    }

    throw new Error("Failed to fetch podcast: URL is not present")
  })

  return query
}

type PodcastProps = MainNavigationScreen<any>

type WithLoadedProps<Data, Error> = {
  query: UseQueryResult<Data, Error>
  children: {
    (props: { data?: Data; error?: Error }): React.ReactElement<any, any> | null
  }
}

const WithLoaded = <Data, Error>({
  query,
  children,
}: WithLoadedProps<Data, Error>) => {
  if (query.isLoading) {
    return <ActivityIndicator size="large" />
  }

  if (query.isError) {
    return children({ error: query.error })
  }

  return children({ data: query.data })
}

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
    <SafeAreaView style={styles.container}>
      <WithLoaded query={podcast}>
        {() => (
          <>
            <Text>Podcast</Text>
            <StatusBar style="auto" />
          </>
        )}
      </WithLoaded>
    </SafeAreaView>
  )
}

type HomeProps = MainNavigationScreen<"Home">

export const Home = () => {
  const navigation = useNavigation<HomeProps["navigation"]>()

  useEffect(() => {
    navigation.navigate("Podcast", { url: PODCAST_URL })
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <Text>Wiktor Kolega!</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
