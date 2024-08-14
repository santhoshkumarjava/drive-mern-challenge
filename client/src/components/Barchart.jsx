import React, { useContext, useEffect, useState } from 'react'
import '../styles/Barchart.css'
import { Container, Row } from 'reactstrap'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { contextValue } from '../App';
import axios from 'axios';


const Barchart = () => {

    const { month } = useContext(contextValue);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (month) {
            fetchBarChartData();
        }
    }, [month])

    const fetchBarChartData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/barcharts', {
                params: {
                    month,
                },
            });

            const charData = Object.keys(response.data).map(range => (
                {
                    name: range,
                    uv: response.data[range],
                }
            ))
            setData(charData);
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    }

    if (!month) {
        return null;
    }

    return <>
        <Container className='bar_cont'>
            <div className='bar_div'>
                <Row>
                    <h1 className='bar_h1'>Bar Chart Stats - {month ? `${month}` : 'Select a Month'}</h1>
                </Row>
                <Row>
                    <BarChart width={900} height={400} data={data} >
                        <XAxis dataKey="name" stroke="#8884d8" />
                        <YAxis />
                        <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
                        <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <Bar dataKey="uv" fill="#8884d8" barSize={40} />
                    </BarChart>
                </Row>
            </div>
        </Container>
    </>
}

export default Barchart