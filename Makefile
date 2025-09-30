# Development Commands

## Quick Start
.PHONY: help
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## Docker Commands
.PHONY: up down build logs shell
up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

build: ## Build all images
	docker-compose build

logs: ## View logs
	docker-compose logs -f

shell-server: ## Access server container shell
	docker-compose exec server /bin/sh

shell-client: ## Access client container shell
	docker-compose exec client /bin/sh

## Development Commands
.PHONY: dev dev-server dev-client
dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up -d

dev-server: ## Start server in development mode
	cd server && npm run dev

dev-client: ## Start client in development mode
	cd client && npm run dev

## Database Commands
.PHONY: seed reset-db backup-db
seed: ## Seed the database with sample data
	docker-compose exec server npm run seed

reset-db: ## Reset database (WARNING: This will delete all data)
	docker-compose exec mongodb mongosh --eval "db.dropDatabase()" jobtracker
	docker-compose exec server npm run seed

backup-db: ## Backup database
	docker-compose exec mongodb mongodump --username admin --password password123 --authenticationDatabase admin --db jobtracker --out /backup

## Testing Commands
.PHONY: test test-server test-client test-coverage
test: ## Run all tests
	cd server && npm test
	cd client && npm test

test-server: ## Run server tests
	cd server && npm test

test-client: ## Run client tests
	cd client && npm test

test-coverage: ## Run tests with coverage
	cd server && npm run test:coverage
	cd client && npm run test:coverage

## Build Commands
.PHONY: build-prod build-client build-server
build-prod: ## Build production images
	docker-compose build --no-cache

build-client: ## Build client for production
	cd client && npm run build

build-server: ## Build server for production
	cd server && npm run build

## Utility Commands
.PHONY: clean install-deps lint format
clean: ## Clean up Docker resources
	docker system prune -a
	docker volume prune

install-deps: ## Install all dependencies
	cd server && npm install
	cd client && npm install

lint: ## Run linting
	cd server && npm run lint
	cd client && npm run lint

format: ## Format code
	cd server && npm run format
	cd client && npm run format

## Production Commands
.PHONY: prod prod-logs prod-shell
prod: ## Start production environment
	docker-compose up -d --build

prod-logs: ## View production logs
	docker-compose logs -f

prod-shell: ## Access production server shell
	docker-compose exec server /bin/sh

## Monitoring Commands
.PHONY: health status stats
health: ## Check application health
	curl http://localhost:5000/api/health

status: ## Check service status
	docker-compose ps

stats: ## View resource usage
	docker stats

## Security Commands
.PHONY: security-scan audit
security-scan: ## Run security scan
	docker run --rm -v $(PWD):/app aquasec/trivy fs /app

audit: ## Run security audit
	cd server && npm audit
	cd client && npm audit

## Documentation Commands
.PHONY: docs serve-docs
docs: ## Generate documentation
	@echo "API Documentation: docs/API.md"
	@echo "Deployment Guide: docs/DEPLOYMENT.md"
	@echo "Kubernetes Guide: k8s/README.md"

serve-docs: ## Serve documentation locally
	cd docs && python -m http.server 8000