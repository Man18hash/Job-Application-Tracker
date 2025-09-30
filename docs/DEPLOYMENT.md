# Deployment Guide

## Overview

This guide covers various deployment strategies for the Job Tracker application, from local development to production cloud deployments.

## Prerequisites

- Docker and Docker Compose installed
- Git installed
- Node.js 18+ (for local development)
- Cloud provider account (for cloud deployments)

## Local Development

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Man18hash/Job-Application-Tracker.git
   cd Job-Application-Tracker
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Seed the database**
   ```bash
   docker-compose exec server npm run seed
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Manual Setup

1. **Start MongoDB**
   ```bash
   docker-compose up -d mongodb
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

4. **Install client dependencies** (in a new terminal)
   ```bash
   cd client
   npm install
   ```

5. **Start the client**
   ```bash
   npm run dev
   ```

## Production Deployment

### Docker Production

1. **Environment Setup**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export MONGODB_URI=mongodb://your-mongodb-connection-string
   ```

2. **Build and Deploy**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

3. **Database Initialization**
   ```bash
   docker-compose exec server npm run seed
   ```

### Cloud Deployment Options

#### AWS ECS/Fargate

1. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name job-tracker-cluster
   ```

2. **Create Task Definition**
   ```json
   {
     "family": "job-tracker",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "512",
     "memory": "1024",
     "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "server",
         "image": "your-account/job-tracker-server:latest",
         "portMappings": [
           {
             "containerPort": 5000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           },
           {
             "name": "MONGODB_URI",
             "value": "mongodb://your-mongodb-connection-string"
           }
         ],
         "logConfiguration": {
           "logDriver": "awslogs",
           "options": {
             "awslogs-group": "/ecs/job-tracker",
             "awslogs-region": "us-west-2",
             "awslogs-stream-prefix": "ecs"
           }
         }
       }
     ]
   }
   ```

3. **Create Service**
   ```bash
   aws ecs create-service \
     --cluster job-tracker-cluster \
     --service-name job-tracker-service \
     --task-definition job-tracker:1 \
     --desired-count 2 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
   ```

#### Google Cloud Run

1. **Build and Push Images**
   ```bash
   # Build server image
   docker build -t gcr.io/your-project/job-tracker-server ./server
   docker push gcr.io/your-project/job-tracker-server

   # Build client image
   docker build -t gcr.io/your-project/job-tracker-client ./client
   docker push gcr.io/your-project/job-tracker-client
   ```

2. **Deploy Server**
   ```bash
   gcloud run deploy job-tracker-server \
     --image gcr.io/your-project/job-tracker-server \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,MONGODB_URI=mongodb://your-mongodb-connection-string
   ```

3. **Deploy Client**
   ```bash
   gcloud run deploy job-tracker-client \
     --image gcr.io/your-project/job-tracker-client \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### Azure Container Instances

1. **Create Resource Group**
   ```bash
   az group create --name job-tracker-rg --location eastus
   ```

2. **Deploy Server**
   ```bash
   az container create \
     --resource-group job-tracker-rg \
     --name job-tracker-server \
     --image your-registry/job-tracker-server:latest \
     --dns-name-label job-tracker-server \
     --ports 5000 \
     --environment-variables NODE_ENV=production MONGODB_URI=mongodb://your-mongodb-connection-string
   ```

3. **Deploy Client**
   ```bash
   az container create \
     --resource-group job-tracker-rg \
     --name job-tracker-client \
     --image your-registry/job-tracker-client:latest \
     --dns-name-label job-tracker-client \
     --ports 80
   ```

#### DigitalOcean App Platform

1. **Create App Spec**
   ```yaml
   name: job-tracker
   services:
   - name: server
     source_dir: /server
     github:
       repo: Man18hash/Job-Application-Tracker
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     http_port: 5000
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: mongodb://your-mongodb-connection-string
   - name: client
     source_dir: /client
     github:
       repo: Man18hash/Job-Application-Tracker
       branch: main
     run_command: npm run build && npm run preview
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     http_port: 3000
   ```

2. **Deploy**
   ```bash
   doctl apps create --spec app.yaml
   ```

#### Heroku

1. **Create Heroku Apps**
   ```bash
   # Create server app
   heroku create job-tracker-server
   
   # Create client app
   heroku create job-tracker-client
   ```

2. **Configure Server**
   ```bash
   cd server
   heroku git:remote -a job-tracker-server
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=mongodb://your-mongodb-connection-string
   git subtree push --prefix server heroku main
   ```

3. **Configure Client**
   ```bash
   cd client
   heroku git:remote -a job-tracker-client
   heroku config:set NODE_ENV=production
   git subtree push --prefix client heroku main
   ```

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Configure network access and database user

2. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/jobtracker?retryWrites=true&w=majority
   ```

3. **Update Environment Variables**
   ```bash
   export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobtracker?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # CentOS/RHEL
   sudo yum install mongodb-server
   ```

2. **Configure MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Create Database and User**
   ```bash
   mongo
   use jobtracker
   db.createUser({
     user: "jobtracker",
     pwd: "password",
     roles: ["readWrite"]
   })
   ```

## Environment Variables

### Required Variables

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-connection-string
CLIENT_URL=https://your-client-domain.com
```

### Optional Variables

```bash
# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://your-client-domain.com

# Logging
LOG_LEVEL=info
```

## SSL/TLS Configuration

### Using Let's Encrypt

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot
   ```

2. **Generate Certificate**
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Monitoring and Logging

### Application Monitoring

1. **Health Checks**
   ```bash
   curl http://your-server-domain.com/api/health
   ```

2. **Log Monitoring**
   ```bash
   # Docker logs
   docker-compose logs -f server
   
   # System logs
   journalctl -u your-service-name -f
   ```

### Performance Monitoring

1. **Install PM2** (for Node.js processes)
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name job-tracker-server
   pm2 monit
   ```

2. **Database Monitoring**
   ```bash
   # MongoDB stats
   mongo --eval "db.stats()"
   ```

## Backup and Recovery

### Database Backup

1. **MongoDB Backup**
   ```bash
   mongodump --uri="mongodb://your-mongodb-connection-string" --out=/backup/$(date +%Y%m%d)
   ```

2. **Automated Backup Script**
   ```bash
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mongodump --uri="mongodb://your-mongodb-connection-string" --out=/backup/$DATE
   tar -czf /backup/jobtracker_$DATE.tar.gz /backup/$DATE
   rm -rf /backup/$DATE
   ```

### Application Backup

1. **Docker Images**
   ```bash
   docker save job-tracker-server:latest | gzip > job-tracker-server.tar.gz
   docker save job-tracker-client:latest | gzip > job-tracker-client.tar.gz
   ```

2. **Configuration Files**
   ```bash
   tar -czf config-backup.tar.gz docker-compose.yml .env nginx.conf
   ```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :5000
   lsof -i :5000
   ```

2. **Database Connection Issues**
   ```bash
   # Test MongoDB connection
   mongo "mongodb://your-mongodb-connection-string"
   ```

3. **Docker Issues**
   ```bash
   # Clean up Docker
   docker system prune -a
   docker-compose down -v
   docker-compose up -d --build
   ```

### Performance Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes for better performance
   db.jobs.createIndex({ "company": 1 })
   db.jobs.createIndex({ "status": 1 })
   db.jobs.createIndex({ "dateApplied": -1 })
   ```

2. **Caching**
   ```javascript
   // Add Redis for caching
   const redis = require('redis');
   const client = redis.createClient();
   ```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use secure secret management
   - Rotate credentials regularly

2. **Network Security**
   - Use HTTPS in production
   - Configure firewall rules
   - Use VPN for database access

3. **Application Security**
   - Keep dependencies updated
   - Use security scanning tools
   - Implement proper authentication

## Scaling

### Horizontal Scaling

1. **Load Balancer Configuration**
   ```nginx
   upstream backend {
       server server1:5000;
       server server2:5000;
       server server3:5000;
   }
   
   server {
       location /api {
           proxy_pass http://backend;
       }
   }
   ```

2. **Database Scaling**
   - Use MongoDB replica sets
   - Implement read replicas
   - Consider sharding for large datasets

### Vertical Scaling

1. **Resource Allocation**
   - Increase CPU and memory
   - Optimize database queries
   - Use connection pooling

## Maintenance

### Regular Tasks

1. **Security Updates**
   ```bash
   # Update dependencies
   npm audit fix
   docker-compose pull
   docker-compose up -d
   ```

2. **Database Maintenance**
   ```bash
   # Compact database
   mongo --eval "db.runCommand({compact: 'jobs'})"
   ```

3. **Log Rotation**
   ```bash
   # Configure logrotate
   sudo vim /etc/logrotate.d/job-tracker
   ```

This deployment guide provides comprehensive instructions for deploying the Job Tracker application across various platforms and environments.
