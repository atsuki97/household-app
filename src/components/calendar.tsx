'use client'

import FullCalendar from "@fullcalendar/react";
import React from 'react'
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "../calendar.css"
import { DatesSetArg, EventContentArg } from "@fullcalendar/core/index.js";
import { Balance, CalendarContent, Transaction } from "@/types";
import { calculateDailyBalances } from "@/utils/financeCalculations";
import { formatCurrency } from "@/utils/formatting";
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";
import useMonthlyTransactions from "@/hooks/useMonthlyTransactions";
import { useAppContext } from "@/contexts/AppContext";

interface CalendarProps {
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
  onDateClick: (dateInfo: DateClickArg) => void;
}

const Calendar = ({
  setCurrentDay, 
  currentDay, 
  today, 
  onDateClick,
}: CalendarProps) => {

  const monthlyTransactions = useMonthlyTransactions()
  const {setCurrentMonth} = useAppContext();

  const theme = useTheme()
  
  // 1.日付ごとの収支を計算する関数
  const dailyBalances = calculateDailyBalances(monthlyTransactions)

  // 2.FullCalendar用のイベントを生成する関数
  const createCalendarEvents = (dailyBalances: Record<string, Balance>):CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const {income, expense, balance} = dailyBalances[date]
      return{
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      }
    })
  }

  const calendarEvents = createCalendarEvents(dailyBalances);

  const backGroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className="money" id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>

        <div className="money" id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>

        <div className="money" id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    )
  }

  const handleDateSet = (datesetInfo:DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if(isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    }
  }
  
  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...calendarEvents, backGroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
    />
  )
}

export default Calendar