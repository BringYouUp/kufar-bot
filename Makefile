DC := docker compose
COMPOSE_FILE := docker-compose.yml

.PHONY: up down build

build:
	$(DC) -f $(COMPOSE_FILE) build

build-no-cache:
	$(DC) -f $(COMPOSE_FILE) build --no-cache

up:
	$(DC) -f $(COMPOSE_FILE) up -d

down:
	$(DC) -f $(COMPOSE_FILE) down

restart:
	$(DC) -f $(COMPOSE_FILE) restart