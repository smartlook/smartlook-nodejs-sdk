SHELL := /bin/bash
BIN    := ./node_modules/.bin
PATH   := $(BIN):$(PATH)
RUN    := ./bin/run

pwd := $(PWD)

# expose vars to bin/run script
export docker compose_opts pwd

# help: show this help
# find all lines with two # | and : | exclude fgrep | extract name and description | create table
help:
	@echo
	@fgrep -h "#" $(MAKEFILE_LIST) | fgrep : | fgrep -v fgrep | sed -e $$'s/#[[:blank:]]*\([^:]*\):\(.*\)/\\1##\\2/' | column -t -s '##'
	@echo

# run: run arbitrary command (eg. `make run cmd="ls -la"`)
run:
	$(RUN) $(cmd)

# yarn: run yarn cmd="custom command"
yarn:
	$(RUN) yarn $(cmd)

# build: build Typescript
build:
	$(RUN) rm -rf build/* && $(BIN)/tsc

# watch: build Typescript and watch for changes
watch:
	$(RUN) rm -rf build/* && $(BIN)/tsc -w -p .

# test: run all tests
test: compose_opts = --rm
test:
	$(RUN) node build/spec/bootstrap.js

# test-mon: run all tests, restart on change
test-mon: compose_opts = --rm
test-mon:
	$(RUN) $(BIN)/nodemon -e js,json --watch build --exec 'node build/spec/bootstrap.js|| exit 1'

# test-inspect: run all tests for debugging
test-inspect: compose_opts = --rm -p 5858:5858
test-inspect:
	$(RUN) node --inspect-brk=0.0.0.0:5858 --nolazy build/spec/bootstrap.js

# test-inspect-mon: run all tests for debugging, restart on change
test-inspect-mon: compose_opts = --rm -p 5858:5858
test-inspect-mon:
	$(RUN) $(BIN)/nodemon -e js,json --watch build --exec 'make test-inspect docker=false || exit 1'

# cover: run tests with code coverage
cover:
	$(RUN) $(BIN)/nyc --reporter=text --reporter=html make test docker=false

# prettier: format the code with Prettier
prettier:
	$(RUN) $(BIN)/prettier --write "src/**/*.ts" "spec/**/*.ts" --loglevel error

# tslint: check the syntax with TSLint
tslint:
	$(RUN) $(BIN)/tslint --fix -p tsconfig.json -c tslint.json

# lint: run all linters
lint: prettier tslint

# version: run standard version to generate changelog, bump version and git tag
version:
	$(BIN)/standard-version --sign $(opts)

# version-dry: dry run standard version to see pendingchanges
version-dry:
	$(RUN) $(BIN)/standard-version --sign --dry-run

.PHONY: help run install build watch test test-mon test-inspect test-inspect-mon cover prettier tslint lint version version-dry
