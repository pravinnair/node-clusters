/** @format */

import cluster from 'cluster';
import os from 'os';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// const cpuCount = os.cpus().length;
const cpuCount = os.availableParallelism();
console.log(`Total # of CPU's : ${cpuCount}`);
console.log(`Primary cluster process-id: [pid-${process.pid}]`); // this will be our primary gateway, and will act as local Load Balancer

// primary-gateway.js is the primary and we are going to execute index.js files and we will be replicating it
cluster.setupPrimary({ exec: path.join(__dirname, 'index.js') });

// iterate over available cpus and spawning node servers, and initialize them
for (let i = 0; i < cpuCount; i++) {
	cluster.fork();
}

// now handle exit or instances fails or crashes,
// we are not auto-scaling here, but instead just utilizing the cpu's and spawing them to make sure the instances = available cpu's
cluster.on('exit', (worker, code, signal) => {
	console.log(`Worker ${worker.process.pid} crashed...`);
	console.log(`Starting new worker`);
	cluster.fork();
});
