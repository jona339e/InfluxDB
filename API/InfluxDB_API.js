const express = require('express');
const { InfluxDB } = require('@influxdata/influxdb-client');

const app = express();
app.use(express.json());


const token = process.env.INFLUXDB_TOKEN; // Get token from environment variables
const org = process.env.INFLUXDB_ORG; // Get organization from environment variables
const bucket = process.env.INFLUXDB_BUCKET; // Get bucket from environment variables
const url = process.env.INFLUXDB_URL; // Get InfluxDB URL from environment variables


const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

// Helper function to construct the query string
const constructQuery = (start, stop, room, submeter) => {
    let query = `from(bucket: "${bucket}") |> range(start: ${start}, stop: ${stop}) |> filter(fn: (r) => r._measurement == "Energy_Collection")`;
  
    // Add filters based on provided parameters
    if (room) {
      query += ` |> filter(fn: (r) => r.room == "${room}")`;
    }
    
    if (submeter) {
      query += ` |> filter(fn: (r) => r.submeter == "${submeter}")`;
    }

    console.log("Constructed Query:", query); // Add this line to log the query
    
    return query;
  };
  
  // 1. Get all data in the time range from the specified bucket
  app.get('/data', async (req, res) => {
    const { start, stop, room, submeter } = req.query;
  
    if (!start || !stop) {
      return res.status(400).send('Missing required query parameters: start and stop');
    }
  
    const query = constructQuery(start, stop, room, submeter);
    
    let rows = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const data = tableMeta.toObject(row);
        rows.push(data);
      },
      error(error) {
        console.error('Query error', error);
        res.status(500).send('Error querying data');
      },
      complete() {
        res.status(200).json(rows);
      }
    });
  });
   
  // Start the server
  app.listen(3000, () => {
    console.log('API running on port 3000');
  });