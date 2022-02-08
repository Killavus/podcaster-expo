import { makeTheme } from "dripsy"
import { fontSizes, functionColors, space } from "./common"

const darkTheme = makeTheme({
  colors: {
    $text: "#cccccc" as string,
    $background: "#262626" as string,
    $primary: "#4d7aff" as string,
    $secondary: "#bdbdbd" as string,
    $muted: "#595959" as string,
    $accent: "#7a38ff" as string,
    $header: "#ffffff" as string,
    ...functionColors,
  },
  ...fontSizes,
  ...space,
})

export default darkTheme
