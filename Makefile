.PHONY: image update install test shell lint mocha test own

NODE_IMAGE=node:8.15.1-alpine

image: install
	docker-compose build

update:
	sudo rm -rf node_modules
	docker run --rm -ti -v $(PWD):/app -w /app $(NODE_IMAGE) npm update
	$(MAKE) own

install:
	sudo rm -rf node_modules
	docker run --rm -ti -v $(PWD):/app -w /app $(NODE_IMAGE) npm install
	$(MAKE) own

own:
	sudo chown -R $$(stat -c %u:%g .) .

lint:
	docker-compose run -e NODE_ENV=testing app npm run eslint

mocha:
	docker-compose run -e NODE_ENV=testing app npm run mocha
	docker-compose down


test: lint mocha

shell:
	docker-compose run --entrypoint sh app
	$(MAKE) own