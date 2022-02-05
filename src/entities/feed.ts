type FeedImage = {
  url: string
  title: string
  link: string
}

type FeedItem = {
  title: string
  description: string
  link: string
  guid: string
  pubDate: string
  file: string
  fileMime: string
  itunes: FeedBag
}

export type FeedChannel = {
  title: string
  description: string
  link: string
  author: string
  image?: FeedImage
  items: Array<FeedItem>
  itunes: FeedBag
}

type FeedBag = Record<string, FeedValue>
type FeedValue = number | string | Partial<{ [key: string]: FeedValue }>

function textOf(value: FeedValue): string {
  if (typeof value === "object") {
    return value["#text"] ? String(value["#text"]) : ""
  }

  return String(value)
}

function attrOf(value: Record<string, FeedValue>, attrName: string): string {
  const attrValue = value[`@_${attrName}`]

  return attrValue && typeof attrValue !== "object" ? String(attrValue) : ""
}

function reducePrefixed(bag: FeedBag, prefix: string): FeedBag {
  return Object.entries(bag)
    .filter(([key]) => key.startsWith(prefix))
    .reduce((memo, [key, value]) => {
      const finalKey = key.substring(prefix.length)
      memo[finalKey] = value
      return memo
    }, {} as Record<string, any>)
}

function transform(
  bag: FeedBag,
  fn: { (value: FeedValue, key: string): FeedValue }
): FeedBag {
  return Object.fromEntries(
    Object.entries(bag).map(([key, value]) => [key, fn(value, key)])
  )
}

function transformItunes(value: FeedValue, key: string): FeedValue {
  switch (key) {
    case "owner":
      return transform(reducePrefixed(value as FeedBag, "itunes:"), textOf)
    case "image":
      return attrOf(value as FeedBag, "href")
    default:
      return textOf(value)
  }
}

function parsePodcastItem(item: Record<string, any>): FeedItem {
  const { pubDate, description, guid, title, link, enclosure } = item

  return {
    guid: textOf(guid),
    pubDate: textOf(pubDate),
    description: textOf(description),
    title: textOf(title),
    link: textOf(link),
    file: attrOf(enclosure, "url"),
    fileMime: attrOf(enclosure, "type"),
    itunes: transform(reducePrefixed(item, "itunes:"), transformItunes),
  }
}

export function parsePodcastFeed(channel: Record<string, any>): FeedChannel {
  const { title, description, link, image, author, item } = channel

  return {
    title: textOf(title),
    description: textOf(description),
    link: textOf(link),
    author: textOf(author),
    ...(image && {
      image: {
        url: textOf(image.url),
        link: textOf(image.link),
        title: textOf(image.title),
      },
    }),
    items: item.map(parsePodcastItem),
    itunes: transform(reducePrefixed(channel, "itunes:"), transformItunes),
  }
}
