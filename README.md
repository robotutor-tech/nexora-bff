# Nexora BFF

## Here is two modules in this project:

- BFF Module
- Mqtt-handler Module

### BFF Module

This module is responsible for handling all the API requests from the frontend and communicating with the microservices. It acts as a bridge between the frontend and the backend services, providing a unified API for the frontend to interact
with. It also handles authentication, authorization, and data aggregation from multiple services.

### Mqtt-handler Module

This module is responsible for handling all the MQTT messages from the BFF-module and Hardware. It handles the authentication and authorization of the MQTT messages.

## Run the project in development mode
### BFF
```bash
npm run dev:bff
```
### Mqtt-handler
```bash
npm run dev:mqtt
```
