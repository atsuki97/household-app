'use client'

import * as React from 'react';
import {
  CssBaseline,
  ThemeProvider,
} from "@mui/material"
import theme from "@/app/theme/theme";
import { AppContextProvider } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";

export default function Provider({children}: Readonly<{children: React.ReactNode;}>){
  return(
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppLayout>{children}</AppLayout>
      </ThemeProvider>
    </AppContextProvider>
  )
}
