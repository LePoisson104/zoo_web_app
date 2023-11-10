const express = require('express');
const app = express();
const port = 3300;
const ticketData = {}; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/tickets', (req, res) => {
  
  res.send(ticketData);
});

app.post('/api/tickets', (req, res) => {
  const { date, adultTickets, childTickets, seniorTickets, infantTickets } = req.body;

  //stores the tickets using theit dates
  ticketData[date] = {
    adultTickets,
    childTickets,
    seniorTickets,
    infantTickets,
  };

  res.send('Ticket quantities updated successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
