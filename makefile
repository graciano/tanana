help:
	@echo "system requirements:\t linux, npm, electron, gulp"
	@echo "\tfor the build to work, aditional requirements at: https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build"
	@echo "\tinstall:\t if you just cloned the repo (required to run other commands)"
	@echo "\tdev:\t\t if you want to run a debug version"
	@echo "\tkill-dev:\t\t to stop the dev process"
	@echo "\tbuild:\t\t to build release binaries"
	@echo "\tclean:\t\t clean build mess"

install: package.json
	yarn
	gulp sass

dev: package.json gulpfile.js node_modules/
	yarn
	gulp watch &
	yarn start &

kill-dev:
	bash kill-dev.sh

build: package.json app/ node_modules/
	yarn dist

clean: dist/
	sudo rm -rf dist