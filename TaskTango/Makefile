run_docker_command = docker-compose build && docker-compose stop && docker-compose rm -f && docker-compose up -d

docker-database:
	cd database && \
	docker-compose up -d

docker-backend:
	cd backend/TaskTango && \
	$(run_docker_command)

docker-frontend:
	cd frontend && \
	$(run_docker_command)
