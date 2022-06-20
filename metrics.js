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

                let balance = Number(stdout) / 1000000;
                gauge.set(balance);
            })
    }
    
    setInterval(checkBalance, 5000);

}

function checkValidatorStatus (registry) {
    const gauge = new client.Gauge({
        name: 'validator_status',
        help: 'Validator Online Status (1 = online, 0 = offline)',
        registers: [registry],
    });

    function checkStatus () { 
        exec(`/usr/local/bin/fn show | grep -w "is_online" | sed 's/.$//' | sed 's/^.*: //'`, 
            async (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }

                let status = String (stdout);

                status = status[0] + status[1] + status[2] + status[3];
                
                status == 'true' ? status = 1 : status = 0;
                gauge.set(status);

            })
    }
    
    setInterval(checkStatus, 5000);

}

function checkVotingPower (registry) {
    const gauge = new client.Gauge({
        name: 'validator_voting_power',
        help: 'Total Stake (FRA)',
        registers: [registry],
    });

    function checkTotalStake () { 
        exec(`/usr/local/bin/fn show | grep -w '"voting_power":' | sed 's/.$//' | sed 's/^.*: //'`, 
            async (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }

                let stake = Number(stdout) / 1000000;
                gauge.set(stake);

            })
    }
    
    setInterval(checkTotalStake, 5000);

}

function checkAvaliableRewards (registry) {
    const gauge = new client.Gauge({
        name: 'validator_rewards',
        help: 'Avaliable Rewards (FRA)',
        registers: [registry],
    });

    function checkRewards () { 
        exec(`/usr/local/bin/fn show | grep -w '"rewards":' | sed 's/.$//' | sed 's/^.*: //'`, 
            async (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }

                let rewards = Number(stdout) / 1000000;
                gauge.set(rewards);

            })
    }
    
    setInterval(checkRewards, 5000);

}

module.exports = (registry) => {
    setMetricGauge(registry);
    checkValidatorBalance (registry);
    checkValidatorStatus (registry);
    checkVotingPower (registry);
    checkAvaliableRewards (registry);
};