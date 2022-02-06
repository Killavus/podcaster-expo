import React from "react"
import { Text } from "react-native"
import { FeedChannel } from "../../entities/feed"

type Props = { podcast: FeedChannel }
const Info = ({ podcast }: Props) => {
  return <Text>{podcast.title}</Text>
}

export default Info
