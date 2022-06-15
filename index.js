'use strict'

const client = require('prom-client');

const express = require('express');

const exporter = express();

const port = 9200;
const serverIP = '127.0.0.1';

const registry = new client.Registry();

function setMetricGauge (registry) {
    
    const gauge = new client.Gauge({
        name: 'local_metric',
        help: 'Local metric description',
        registers: [registry],
    });

    function setNumber () { 
        gauge.set(Math.random()*10);
       
    }
    

    setInterval(setNumber, 5000);

}


setMetricGauge(registry);



exporter.get('/metrics', async (req, res, next) => {
    res.set('Content-Type', registry.contentType);
    res.end(registry.metrics());
    
    next();
  });

exporter.listen(port,serverIP, () => console.log('Working'))




