import React from "react"
import { ThemeProvider, createTheme } from "@material-ui/core/styles"
import pink from "@material-ui/core/colors/pink"
import indigo from "@material-ui/core/colors/indigo"
import CssBaseline from "@material-ui/core/CssBaseline"

/**
 * A theme with custom primary and secondary color.
 * 
 * @link: https://material-ui.com/customization/theming
 */
const theme = createTheme({
  palette: {
    primary: {
      light: indigo[300],
      main: indigo[500],
      dark: indigo[700]
    },
    secondary: {
      light: pink[300],
      main: pink[500],
      dark: pink[700]
    }
  },
  typography: {
    useNextVariants: true
  }
})

function withRootStyle(Component) {
  function WithRootStyle(props) {
    return (
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        {/* https://material-ui.com/api/css-baseline/#cssbaseline-api */}
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    )
  }

  return WithRootStyle
}

export default withRootStyle
