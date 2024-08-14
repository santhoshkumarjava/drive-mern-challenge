import React, { useState, useEffect, useContext } from 'react'
import '../styles/Transactions.css'
import { Container, Row, Col, Input, Table, Button, } from 'reactstrap'
import axios from 'axios'
import { contextValue } from '../App'

const Transactions = () => {
    // const [page, setPage] = useState(1);
    // const [perPage] = useState(5);
    // const [search, setSearch] = useState('');
    // const [month, setMonth] = useState();
    // const [transactions,setTransactions] = useState([]);
    // const [totalPages, setTotalPages] = useState(1);

    const { page, setPage, perPage, search, setSearch, month, setMonth, transactions, setTransactions, totalPages, setTotalPages } = useContext(contextValue);

    useEffect(() => {
        fetchTransactions();
    }, [search, month, page]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/transaction`, {
                params: {
                    page, perPage, search, month
                }
            });
            setTransactions(response.data.data);
            setTotalPages(response.data.meta.total_pages)
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };


    return <>
        <Container className='trans_cont'>
            <h1 className='trans_h1'>Transaction DashBoard</h1>
            <Row >
                <Col className='trans_row1_col1'>
                    <Input className='trans_search' type="search" placeholder="Search...!" onChange={(e) => setSearch(e.target.value)} value={search} />
                </Col>
                <Col className='trans_row1_col2'>
                    <Input className='trans_select' id="monthSelect" name="month" type="select" onChange={(e) => setMonth(e.target.value)}>
                        <option value="">Select Month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </Input>
                </Col>
            </Row>
            <Row>
                <Table bordered hover responsive className='trans_table'>
                    <thead >
                        <tr className='trans_thead text-center align-middle'>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Sold</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody className='trans_tbody'>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="text-center align-middle">
                                <td>{transaction.id}</td>
                                <td>{transaction.title}</td>
                                <td className='trans_description'>{transaction.description}</td>
                                <td>{transaction.price}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td><img className="d-block mx-auto" width="40px" src={transaction.image} alt={transaction.title} /></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className='trans_last'>
                    <div>
                        <p ><span className='trans_p1'>Page No : </span><span>{page}</span></p>
                    </div>
                    <div className='trans_btn'>
                        <Button color='secondary' onClick={handlePreviousPage} disabled={page <= 1} >
                            Previous
                        </Button>
                        <Button color='success' onClick={handleNextPage} disabled={page >= totalPages}>
                            Next
                        </Button>
                    </div>
                    <div>
                        <p ><span className='trans_p1'>Per Page : </span><span>{perPage}</span></p>
                    </div>
                </div>
            </Row>
        </Container>
    </>
}

export default Transactions;