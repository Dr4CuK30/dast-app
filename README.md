
## Description

Vulnerabilities scan application made as a solution to a technical test and then adopted as own project.

This project search apply the modern big infrastructure approaches and patters to a simple domain vulnerabilities multiscan system whose main function is detect automaticaly the knew security gaps concurrently of multiple domains using ZAP as Core.

Among other functions, the main ones are:
- Serve an API REST to execute and manage vulnerabilities scans.
- Provide utilities to schedule periodic scans
- Prevent bad use and facilitate the communication with Zaproxy API
- Allow simultain scans
  
## Docker Execution

Duplicate ".env.development" and rename to ".env", then execute:
```bash
$ docker compose up
```
This command will run the following containers:
- Zaproxy
- Juice-shop (vulnerable application for testing)
- MySQL
- Redis
- Kafka
- Zookeeper
- DAST-API (main aplication)
- DAST-WORKER (workers)

## Local Execution
Duplicate ".env.local" and rename to ".env", then execute: 
```bash
$ npm i
$ npm run start:dev
```
