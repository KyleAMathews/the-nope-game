import "@fontsource/karla/latin.css"
import "@fontsource/karla/latin-300-italic.css"
import { tailwind } from "@theme-ui/presets"
let baseStyles = {
  ...tailwind,
  styles: {
    ...tailwind.styles,
  },
}

baseStyles = {
  ...baseStyles,
  fonts: {
    ...baseStyles.fonts,
    body: `karla, system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
  },
}

baseStyles.styles.h3.fontWeight = 300
baseStyles.styles.h3.fontStyle = `italic`

export default baseStyles
