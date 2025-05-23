'use client'

import Calendar from '@/components/calendar'
import MonthlySummary from '@/components/monthlySummary'
import TransactionForm from '@/components/transactionForm'
import TransactionMenu from '@/components/transactionMenu'
import { Transaction } from '@/types'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import { format } from 'date-fns'
import { DateClickArg } from '@fullcalendar/interaction/index.js'
import { useAppContext } from '@/contexts/AppContext'
import useMonthlyTransactions from '@/hooks/useMonthlyTransactions'

const Home = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay,setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {isMobile} = useAppContext();
  const monthlyTransactions = useMonthlyTransactions();

  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });

  const closeForm = () => {
    setSelectedTransaction(null);
    
    if (isMobile) {
      setIsDialogOpen(!isDialogOpen);
    }else{
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  };

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    }else{
      if (selectedTransaction) {
        setSelectedTransaction(null)
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen)
      }
    }
  };

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)

    if (isMobile) {
      setIsDialogOpen(true);
    }else{
      setIsEntryDrawerOpen(true);
    }
  }

  //モバイル用Drawerを閉じる処理
  const handlecCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  }

  //日付を選択した時の処理
  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
  }

  return (
    <Box sx={{display: "flex"}}>
      {/* 左側コンテンツ */}
      <Box sx={{flexGrow: 1}}>
        <MonthlySummary />
        <Calendar
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
          onDateClick={handleDateClick}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onhandleAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          open={isMobileDrawerOpen}
          onClose={handlecCloseMobileDrawer}
        />
        <TransactionForm
          onCloseForm={closeForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>
    </Box>
  )
}

export default Home