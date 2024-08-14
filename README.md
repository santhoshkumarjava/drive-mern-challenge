"# mern-stack-challenge" 

Importing Data to MongoDB

To import data into your MongoDB database from an external API, follow these steps. This operation should be performed only once to avoid duplicate data.

1. Set Up the Import Route: Ensure that your Express server has the following route to fetch data from the external API and insert it into your MongoDB database:

app.get('/importingData', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const result = await Transaction.insertMany(response.data);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error importing data:', error);
        res.status(500).send('Error initializing database');
    }
});

2. Run the Import: Start your server and access the /importingData route in your browser or using a tool like Postman. This will trigger the import process.

http://localhost:5000/importingData

3. Ensure Data is Imported Once: This route is intended to be run only once. After successful import, you should either:
  Comment out the route or
  Delete the route from your codebase to prevent re-importing the data.

4. Verify Data Import: Check your MongoDB database to ensure the data has been imported correctly.
