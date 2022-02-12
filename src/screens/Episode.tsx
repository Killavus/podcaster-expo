import React from "react"
import { Text } from "dripsy"
import { StatusBar } from "expo-status-bar"
import CenteredSafeAreaView from "../components/CenteredSafeAreaView"

export const Episode = () => {
  return (
    <CenteredSafeAreaView>
      <Text>Episode View</Text>
      <StatusBar style="auto" />
    </CenteredSafeAreaView>
  )
}
