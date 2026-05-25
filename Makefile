.PHONY: help install env db-up db-down db-migrate db-seed db-setup setup setup-db dev test build clean

# Default target
help:
	@echo "Salary Management Tool"
	@echo ""
	@echo "  make setup      Install deps, create .env, start DB, migrate, seed"
	@echo "  make setup-db   Migrate + seed only (Postgres already running)"
	@echo "  make dev        Run API + UI (after setup)"
	@echo ""
	@echo "  make install    npm install"
	@echo "  make env        Copy .env.example to .env (if missing)"
	@echo "  make db-up      Start Postgres (Docker — required for make setup)"
	@echo "  make db-down    Stop Postgres"
	@echo "  make db-migrate Run migrations"
	@echo "  make db-seed    Seed 10,000 employees"
	@echo "  make test       Run all tests"
	@echo "  make build      Production build"
	@echo "  make clean      Remove node_modules and build output"

install:
	npm install

env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env from .env.example"; \
	else \
		echo ".env already exists — skipped"; \
	fi

db-up:
	@command -v docker >/dev/null 2>&1 || { \
		echo "Error: Docker is not installed or not on your PATH."; \
		echo ""; \
		echo "Install Docker, then run: make setup"; \
		echo "  Ubuntu: sudo apt install docker.io docker-compose-v2"; \
		echo "  Or:     sudo snap install docker"; \
		echo ""; \
		echo "If Postgres is already running locally, set DATABASE_URL in .env and run:"; \
		echo "  make setup-db"; \
		exit 127; \
	}
	@docker info >/dev/null 2>&1 || { \
		echo "Error: Cannot access Docker (permission denied on /var/run/docker.sock)."; \
		echo ""; \
		echo "Fix — add your user to the docker group, then log out and back in:"; \
		echo "  sudo usermod -aG docker $$USER"; \
		echo ""; \
		echo "Or run once with sudo:"; \
		echo "  sudo docker compose up -d"; \
		echo "  make db-migrate && make db-seed"; \
		echo ""; \
		echo "Without Docker, use local Postgres: make setup-db"; \
		exit 1; \
	}
	docker compose up -d
	@echo "Waiting for Postgres..."
	@sleep 3

db-down:
	docker compose down

db-migrate:
	npm run db:migrate -w server

db-seed:
	npm run db:seed -w server

db-setup: db-migrate db-seed

# Use when Postgres is already running (no Docker)
setup-db: env db-setup
	@echo ""
	@echo "Database ready. Run: make dev"

# First-time local setup (needs Docker)
setup: install env db-up db-setup
	@echo ""
	@echo "Setup complete. Run: make dev"
	@echo "  UI:  http://localhost:5173"
	@echo "  API: http://localhost:3001"

dev:
	npm run dev

test:
	npm test

build:
	npm run build

clean:
	rm -rf node_modules server/node_modules client/node_modules
	rm -rf server/dist client/dist
