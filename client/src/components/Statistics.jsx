import React, { useContext, useEffect, useState } from 'react'
import '../styles/Statistics.css'
import { Container, List } from 'reactstrap'
import { contextValue } from '../App'
import axios from 'axios'

const Statistics = () => {
    const { month } = useContext(contextValue);
    const [statistics, setStatistics] = useState({
        totalSales: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
    })

    useEffect(() => {
        if (month) {
            fetchStatistics();
        }
    }, [month]);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/statistic`, {
                params: {
                    month,
                },
            })
            setStatistics(response.data)
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }

    if (!month) {
        return null;
    }

    return <>
        <Container className='stat_cont'>
            <div className='stat_div'>
                <h1 className='stat_h1'>Statiscs - {month ? `${month}` : 'Select a Month'}</h1>
                <List type='unstyled' className='stat_li'>
                    <li>
                        <p>
                            <span className='stat_sh'>Total Sale : </span>
                            <span>{statistics.totalSales.toFixed(2)}</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <span className='stat_sh'>Total Sold Item : </span>
                            <span>{statistics.totalSoldItems}</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <span className='stat_sh'>Total Not Sold Item : </span>
                            <span>{statistics.totalNotSoldItems}</span>
                        </p>
                    </li>
                </List>
            </div>
        </Container>
    </>
}

export default Statistics