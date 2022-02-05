import React from "react"
import { SafeAreaView, StyleSheet } from "react-native"

type Props = { children: React.ReactNode }

const CenteredSafeAreaView = ({ children }: Props) => (
  <SafeAreaView style={styles.container}>{children}</SafeAreaView>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default CenteredSafeAreaView
