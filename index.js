/** @format */

import express from 'express';
const app = express();

const port = process.env.PORT || 3000;
const COMPUTE_EXTREME_COUNT = 50000000; //50 million

app.get('/compute-heavy', (req, res) => {
	let counter = 0;
	for (let i = 0; i < COMPUTE_EXTREME_COUNT; i++) {
		counter++;
	}
	res
		.status(200)
		.send(`Finished sample heavy computing, counter is ${counter}`);
});

app.listen(port, () => {
	console.log(`Listening to port:${port}`);
	console.log(`Current process-id:[pid-${process.pid}]`);
});
