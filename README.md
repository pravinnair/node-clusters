### Simple problem statement:
We have an express application in index.js.
It is having a basic for-loop which iterates 50million times and returns count of the counter.
So whenever a request comes, the system uses one of its core to run the nodejs and assigns the process.
Since we are doing 50mill iteration, the process gets slow and takes time to return response.

### How to approach this problem?
WE can utilize existing systems cpu availability. Spawn new nodejs processes and assign it the available cpu cores. This way we will be dividing the task among the cpu's/clustering them, resulting in horizontal scaling within the system, which directly reduces the processing time for the i/o intensive task.

### Solution: Clusters
Create a gateway namely primary-gateway.js. The main task of gateway point is to accept incoming requests and based on systems cpu's availability, spawn new processes and assign the task between them.
In this simple example, our system is a 4core cpu, so diving them between 4 cpu's and spawning nodejs index.js call. Here the gateway process will be our primary and there will be 4 new process-id's generated against the cpu's. During the execution if any of the processes dies or crashes then we will restart them or create a new process using cluster.fork(). This way our small app will run and process parallelly.

### Benchmark results sample w.r.t timings:
``` npx loadtest -n 1500 -c 500 -k http://localhost:3000/compute-heavy
    Target URL:          http://localhost:3000/compute-heavy
    Max requests:        1500
    Concurrent clients:  1000
    Running on cores:    2
    Agent:               keepalive

    Completed requests:  1500
    Total errors:        1263
    Total time:          30.763 s
    Mean latency:        13848.1 ms
    Effective rps:       49

    Percentage of requests served within a certain time
    50%      8490 ms
    90%      30562 ms
    95%      30586 ms
    99%      30633 ms
    100%      30637 ms (longest request)
```

### cmd to compare benchmark
``` 
\node-clusters> npx loadtest -n 1500 -c 500 -k http://localhost:3000/compute-heavy  
```
### Alternate way to do clustering using thrid party library
Here you can directly run index.js and it will automatically do spawning of services, which we were doing through primary-gateway.
```
npx pm2 start index.js
```

### When to use Cluster module?
Use it when you want the nodejs application to be highly available and scalable.
Mostly preferred for small apps where you wanted to leverage the available cpu's without scaling outside the system.  

