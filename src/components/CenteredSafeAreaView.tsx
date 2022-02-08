import React from "react"
import { SafeAreaView } from "../components/Themed"
type Props = { children: React.ReactNode }

const CenteredSafeAreaView = ({ children }: Props) => (
  <SafeAreaView
    sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    {children}
  </SafeAreaView>
)

export default CenteredSafeAreaView
