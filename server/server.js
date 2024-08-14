const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const moment = require('moment');

const Transaction = require('./model/transactionSchema')

const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());


// Connect database
const mongoconnect = async()=>{
    try {
        let connection = mongoose.connect('mongodb://localhost:27017/transactionsDB',{
            // useNewUrlParser:true,
            // useUnifiedTopology:true
        })
        console.log("Mongo db successfully connected")
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }   
}
mongoconnect()


// Importing data to my database from the API 
app.get('/gettingData', async (req,res)=>{
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const result = await Transaction.insertMany(response.data);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).send('Error initializing database');
    }
})


// Transaction Listing API
app.get('/transaction', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;

    const year = 2022;
    
    let query = {};

    if (month) {
        const monthNumber = parseInt(month, 10);
        if (monthNumber >= 1 && monthNumber <= 12) {
            const monthString = monthNumber.toString().padStart(2, '0');
            const startDate = moment(`${year}-${monthString}-01T00:00:00.000Z`).toDate();
            const endDate = moment(startDate).endOf('month').toDate();
            query.dateOfSale = { $gte: startDate, $lt: endDate };
            // console.log("Start:", startDate);
            // console.log("End:", endDate);
        } else {
            return res.status(400).json({ error: 'Invalid month' });
        }
    }

    if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
            { title: searchRegex },
            { description: searchRegex },
        ];
        
        const searchNumber = parseFloat(search);
        if (!isNaN(searchNumber)) {
            query.$or.push({ price: searchNumber });
        }
    }

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        const totalItems = await Transaction.countDocuments(query);

        res.status(200).json({
            data: transactions,
            meta: {
                current_page: parseInt(page),
                per_page: parseInt(perPage),
                total_items: totalItems,
                total_pages: Math.ceil(totalItems / perPage)
            }
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Error fetching transactions');
    }
});


// ========================================




// Statistics API
app.get('/statistic', async(req,res)=>{
    const {month} = req.query;
    // console.log(month);
    
    if (!month) {
        return res.status(400).send('Month parameter is required');
    }

    const year = 2022; 
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const startDate = moment(`${year}-${monthString}-01T00:00:00.000Z`).toDate();
    // console.log("start",startDate);
    const endDate = moment(startDate).endOf('month').toDate();
    // console.log("End:",endDate);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { 
                $gte:startDate,
                $lt:endDate
             },
        });
        
        const totalSales = transactions.reduce((acc, cur) => acc + cur.price, 0);
        const totalSoldItems = transactions.filter(t => t.sold).length;
        const totalNotSoldItems = transactions.length - totalSoldItems;
        // console.log(totalSales, totalSoldItems, totalNotSoldItems);

        res.status(200).json({totalSales, totalSoldItems, totalNotSoldItems });


    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).send('Error fetching transactions');
    }
})



// Bar Chart API
app.get('/barcharts', async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).send('Month parameter is required');
    }

    const year = 2022; 

    const monthString = month < 10 ? `0${month}` : `${month}`;
    const startDate = moment(`${year}-${monthString}-01T00:00:00.000Z`).toDate();
    const endDate = moment(startDate).endOf('month').toDate();

    const priceRanges = {  
      '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0,
      '401-500': 0, '501-600': 0, '601-700': 0, '701-800': 0,
      '801-900': 0, '901-above': 0
    };
  
    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lt: endDate } });
  
        transactions.forEach(t => {
          if (t.price <= 100) priceRanges['0-100']++;
          else if (t.price <= 200) priceRanges['101-200']++;
          else if (t.price <= 300) priceRanges['201-300']++;
          else if (t.price <= 400) priceRanges['301-400']++;
          else if (t.price <= 500) priceRanges['401-500']++;
          else if (t.price <= 600) priceRanges['501-600']++;
          else if (t.price <= 700) priceRanges['601-700']++;
          else if (t.price <= 800) priceRanges['701-800']++;
          else if (t.price <= 900) priceRanges['801-900']++;
          else priceRanges['901-above']++;
        });
    
        res.json(priceRanges).status(200);        
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).send('Error fetching bar chart data');   
    }

  });




// Pie Chart API
app.get('/piechart', async (req, res) => {
    const { month } = req.query;
    

    const year = 2022; 
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const startDate = moment(`${year}-${monthString}-01T00:00:00.000Z`).toDate();
    const endDate = moment(startDate).endOf('month').toDate();

    try {
        const categories = {};
        const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lt: endDate } });
        transactions.forEach(t => {
          categories[t.category] = (categories[t.category] || 0) + 1;
        });
        res.json(categories).status(200);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).send('Error fetching pie chart data');
    }
   
  });

  

  // Combined Data API
app.get('/combined', async (req, res) => {
    try {
        const [transactions, statistics, barchart, piechart] = await Promise.all([
            axios.get('http://localhost:5000/transactions', { params: req.query }),
            axios.get('http://localhost:5000/statistics', { params: req.query }),
            axios.get('http://localhost:5000/barchart', { params: req.query }),
            axios.get('http://localhost:5000/piechart', { params: req.query }),
          ]);
          res.json({ transactions: transactions.data, statistics: statistics.data, barchart: barchart.data, piechart: piechart.data });        
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).send('Error fetching combined data');   
    }

});


  
app.listen(port, ()=>{
    console.log(`Server running at ${port}`);
})