'use strict'

const client = require('prom-client');

const { exec } = require('child_process');

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

function checkValidatorBalance (registry) {
    
    const gauge = new client.Gauge({
        name: 'self_delegation_FRA',
        help: 'Validator Self Delegation (FRA)',
        registers: [registry],
    });

    function checkBalance () { 
        exec(`/usr/local/bin/fn show | grep -w '"bond":' | sed 's/.$//' | sed 's/^.*: //'`, 
        async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            let balance = Number(stdout) / 100000;
            gauge.set(balance);
        })
    }
    

    setInterval(checkBalance, 5000);

}

module.exports = (registry) => {
    setMetricGauge(registry);
    checkValidatorBalance (registry);
};