"use client"

import React from 'react'
import BarChart from '@/components/barChart';
import CategoryChart from '@/components/categoryChart';
import MonthSelector from '@/components/monthSelector';
import TransactionTable from '@/components/transactionTable';
import { Grid, Paper } from '@mui/material'

const Report = () => {

  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12}}>
        <MonthSelector />
      </Grid>
      <Grid size={{xs: 12, md: 4}}>
        <Paper sx={commonPaperStyle}>
          <CategoryChart />
        </Paper>
      </Grid>
      <Grid size={{xs: 12, md: 8}}>
        <Paper sx={commonPaperStyle}>
          <BarChart />
        </Paper>
      </Grid>
      <Grid size={{xs: 12}}>
        <TransactionTable />
      </Grid>
    </Grid>
  );
}

export default Report