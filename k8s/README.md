# Kubernetes Deployment

## Overview

This guide covers deploying the Job Tracker application on Kubernetes, showcasing container orchestration skills.

## Prerequisites

- Kubernetes cluster (local or cloud)
- kubectl configured
- Docker images pushed to registry

## Namespace Setup

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: job-tracker
  labels:
    name: job-tracker
```

## ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: job-tracker-config
  namespace: job-tracker
data:
  NODE_ENV: "production"
  PORT: "5000"
  CLIENT_URL: "http://job-tracker-client-service:3000"
```

## Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: job-tracker-secrets
  namespace: job-tracker
type: Opaque
data:
  MONGODB_URI: <base64-encoded-mongodb-uri>
```

## MongoDB Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  namespace: job-tracker
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:7.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          value: "password123"
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
      volumes:
      - name: mongodb-storage
        persistentVolumeClaim:
          claimName: mongodb-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
  namespace: job-tracker
spec:
  selector:
    app: mongodb
  ports:
  - port: 27017
    targetPort: 27017
  type: ClusterIP
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
  namespace: job-tracker
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Server Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: job-tracker-server
  namespace: job-tracker
spec:
  replicas: 3
  selector:
    matchLabels:
      app: job-tracker-server
  template:
    metadata:
      labels:
        app: job-tracker-server
    spec:
      containers:
      - name: server
        image: your-registry/job-tracker-server:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: job-tracker-config
              key: NODE_ENV
        - name: PORT
          valueFrom:
            configMapKeyRef:
              name: job-tracker-config
              key: PORT
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: job-tracker-secrets
              key: MONGODB_URI
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: job-tracker-server-service
  namespace: job-tracker
spec:
  selector:
    app: job-tracker-server
  ports:
  - port: 5000
    targetPort: 5000
  type: ClusterIP
```

## Client Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: job-tracker-client
  namespace: job-tracker
spec:
  replicas: 2
  selector:
    matchLabels:
      app: job-tracker-client
  template:
    metadata:
      labels:
        app: job-tracker-client
    spec:
      containers:
      - name: client
        image: your-registry/job-tracker-client:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: job-tracker-client-service
  namespace: job-tracker
spec:
  selector:
    app: job-tracker-client
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
```

## Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: job-tracker-ingress
  namespace: job-tracker
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - job-tracker.yourdomain.com
    secretName: job-tracker-tls
  rules:
  - host: job-tracker.yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: job-tracker-server-service
            port:
              number: 5000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: job-tracker-client-service
            port:
              number: 3000
```

## Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: job-tracker-server-hpa
  namespace: job-tracker
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: job-tracker-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Deployment Commands

```bash
# Apply all configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n job-tracker
kubectl get services -n job-tracker
kubectl get ingress -n job-tracker

# View logs
kubectl logs -f deployment/job-tracker-server -n job-tracker

# Scale deployment
kubectl scale deployment job-tracker-server --replicas=5 -n job-tracker

# Port forward for testing
kubectl port-forward service/job-tracker-client-service 3000:3000 -n job-tracker
```

## Helm Chart

```yaml
# Chart.yaml
apiVersion: v2
name: job-tracker
description: A MERN stack job application tracker
type: application
version: 0.1.0
appVersion: "1.0.0"

# values.yaml
replicaCount: 3

image:
  repository: your-registry/job-tracker-server
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 5000

ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
  hosts:
    - host: job-tracker.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: job-tracker-tls
      hosts:
        - job-tracker.yourdomain.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

mongodb:
  enabled: true
  auth:
    enabled: true
    rootUsername: admin
    rootPassword: password123
  persistence:
    enabled: true
    size: 10Gi
```

## Monitoring with Prometheus

```yaml
apiVersion: v1
kind: ServiceMonitor
metadata:
  name: job-tracker-server-monitor
  namespace: job-tracker
spec:
  selector:
    matchLabels:
      app: job-tracker-server
  endpoints:
  - port: 5000
    path: /metrics
    interval: 30s
```

## Backup and Restore

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: mongodb-backup
  namespace: job-tracker
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: mongo:7.0
            command:
            - /bin/bash
            - -c
            - |
              mongodump --host=mongodb-service --port=27017 --username=admin --password=password123 --authenticationDatabase=admin --db=jobtracker --out=/backup
              tar -czf /backup/jobtracker-$(date +%Y%m%d).tar.gz /backup/jobtracker
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
```

This Kubernetes deployment showcases advanced DevOps skills including container orchestration, service mesh, monitoring, and automated scaling.
