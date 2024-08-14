import React, { createContext, useState } from 'react'
import './App.css';
import Transactions from './components/Transactions';
import Statistics from './components/Statistics';
import Barchart from './components/Barchart';


export const contextValue = createContext();

const App = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState();
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  return <>
    <contextValue.Provider value={{ page, setPage, perPage, search, setSearch, month, setMonth, transactions, setTransactions, totalPages, setTotalPages }} >
      <Transactions />
      <Statistics />
      <Barchart />
    </ contextValue.Provider>
  </>
}

export default App