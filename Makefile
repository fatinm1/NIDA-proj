.PHONY: up down logs reset-db clean

up:
	docker-compose -f infra/docker-compose.yml up -d

down:
	docker-compose -f infra/docker-compose.yml down

logs:
	docker-compose -f infra/docker-compose.yml logs -f

reset-db:
	docker-compose -f infra/docker-compose.yml exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS nda_redline;"
	docker-compose -f infra/docker-compose.yml exec postgres psql -U postgres -c "CREATE DATABASE nda_redline;"
	docker-compose -f infra/docker-compose.yml exec api alembic upgrade head

clean:
	docker-compose -f infra/docker-compose.yml down -v
	docker system prune -f
