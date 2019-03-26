.PHONY: clean image update install test shell

NODE_IMAGE=node:8.15.1-alpine

update:
	sudo rm -rf node_modules
	docker run --rm -ti -v $(PWD):/app -w /app $(NODE_IMAGE) npm update
	sudo chown $$(stat -c %u:%g .) node_modules
	sudo chown $$(stat -c %u:%g .) package-lock.json

install:
	sudo rm -rf node_modules
	docker run --rm -ti -v $(PWD):/app -w /app $(NODE_IMAGE) npm install
	sudo chown $$(stat -c %u:%g .) node_modules
clean:
	sudo rm -rf node_modules
	sudo rm -rf package-lock.json

image: install
	docker-compose build

test:
	docker run --rm -ti -v $(PWD):/app -w /app $(NODE_IMAGE) npm test

shell:
	docker run --rm -ti -v $(PWD):/app -w /app $(NODE_IMAGE) sh