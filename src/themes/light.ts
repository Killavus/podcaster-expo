import { makeTheme } from "dripsy"
import { fontSizes, functionColors, space } from "./common"

const lightTheme = makeTheme({
  colors: {
    $text: "#222222" as string,
    $background: "#ffffff" as string,
    $primary: "#002db5" as string,
    $secondary: "#474747" as string,
    $muted: "#b0b0b0" as string,
    $accent: "#230069" as string,
    $header: "#000000" as string,
    ...functionColors,
  },
  ...fontSizes,
  ...space,
})

export default lightTheme
