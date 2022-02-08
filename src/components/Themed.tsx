import { styled } from "dripsy"
import * as RN from "react-native"

export const View = styled(RN.View)({
  backgroundColor: "$background",
})

export const SafeAreaView = styled(RN.SafeAreaView)({
  backgroundColor: "$background",
})

export const Text = styled(RN.Text)({
  color: "$text",
})

export const PrimaryText = styled(RN.Text)({
  color: "$primary",
})

export const ImageBackground = styled(RN.ImageBackground)({})
export const TouchableOpacity = styled(RN.TouchableOpacity)({})
