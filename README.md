
## Description

Aplicación de escaneo de vulnerabilidades elaborada como solución de la prueba tecnica Backend de Mercado Libre.

## Ejecución del container

Copiar ".env.development" y cambiarle el nombre a ".env", y luego ejecutar:
```bash
$ docker compose up
```
Esto levantara los siguientes contenedores:
- Zaproxy container
- Juice-shop (aplicación vulnerable)
- MySQL
- Redis
- Kafka
- Zookeeper
- DAST-API (Aplicación desarrollada)
- DAST-WORKER

## Ejecución en maquina
Copiar ".env.local" y cambiarle el nombre a ".env", y luego ejecutar: 
```bash
$ npm i
$ npm run start:dev
```

## Test
```bash
# unit tests
$ npm run test
```