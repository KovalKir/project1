'use strict'

const client = require('prom-client');

function setMetricGauge (registry) {
    
    const gauge = new client.Gauge({
        name: 'local_metric',
        help: 'Local metric description',
        registers: [registry],
    });

    function setNumber () { 
        gauge.set(Math.random()*10);
        console.log(gauge);
    }
    

    setInterval(setNumber, 5000);

}

module.exports = (registry) => {
    setMetricGauge(registry);
};