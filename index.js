'use strict'

const client = require('prom-client');

const express = require('express');

const exporter = express();

const metrics = require('./metrics')

const port = 9200;
const serverIP = '127.0.0.1';

const registry = new client.Registry();

metrics(registry);



exporter.get('/metrics', async (req, res, next) => {
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
    
    next();
  });

exporter.listen(port,serverIP, () => console.log('Working'))




