'use client'

import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Sidebar from "@/components/common/sidebar";
import { useAppContext } from '@/contexts/AppContext';
import { isFireStoreError } from "@/utils/errorHandling";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transaction } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 240;

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({children}: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const {setTransactions, setIsLoading} = useAppContext();
  const {logout} = useAuth()

  //firestoreのデータを全て取得
  React.useEffect(() => {
    const fetchTransactions = async() => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transactions"))

        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction
        });

        setTransactions(transactionsData)
      } catch(err){
        if (isFireStoreError(err)) {
          console.error("firestoreのエラーは",err)
        } else {
          console.error("一般的なエラーは",err)
        }
      }finally{
        setIsLoading(false)
      }
    }
    fetchTransactions();
  },[])

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = async() => {
    try{
      await logout()
    }catch(error){
      console.error('Logout failed:', error);
    }
  }

  return (
    <Box 
      sx={{
        display: {md: 'flex'}, 
        bgcolor: (theme) => theme.palette.grey[100], 
        minHeight: "100vh" 
      }}
    >

      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Next.JS 家計簿
          </Typography>
          <Button 
            sx={{color: "white"}} 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            variant='text'
          >
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>
      
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        handleDrawerClose={handleDrawerClose}
      />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
