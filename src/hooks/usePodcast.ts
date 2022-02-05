import { XMLParser } from "fast-xml-parser"
import { useQuery, UseQueryResult } from "react-query"
import { FeedChannel, parsePodcastFeed } from "../entities/feed"

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

export default function usePodcast(url: string) {
  const query: UseQueryResult<FeedChannel, Error> = useQuery(url, async () => {
    if (url) {
      return fetchPodcastFeed(url)
    }

    throw new Error("Failed to fetch podcast: URL is not present")
  })

  return query
}
