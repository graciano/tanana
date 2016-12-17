help:
	@echo "system requirements:\t linux, npm, electron, gulp"
	@echo "\tinstall:\t if you just cloned the repo"
	@echo "\tdev:\t\t if you want to run a debug version"
	@echo "\tbuild:\t\t to build release binaries"
	@echo "\tclean:\t\t clean build mess"

install: package.json
	yarn
	gulp sass

dev: gulpfile.js node_modules/
	gulp watch &
	yarn start &

build: build.sh
	chmod +x build.sh
	./build.sh

clean: electron/
	cd electron
	npm run clean
