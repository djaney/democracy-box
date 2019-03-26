.PHONY: clean image update install test shell lint mocha test

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

lint:
	docker-compose run -e NODE_ENV=testing app npm run eslint

mocha:
	docker-compose run -e NODE_ENV=testing app npm run mocha
	docker-compose down


test: lint mocha

shell:
	docker run --rm -ti -v $(PWD):/app -w /app $(NODE_IMAGE) sh