SHELL := /bin/bash
PATH := node_modules/.bin:$(PATH)

JS_FILES := $(shell glob-cli "lib/**/*.js" "models/**/*.js" "*.js")

JSX_FILES := $(shell glob-cli "components/**/*.jsx")

build: loupe.bundle.js loupe.bundle.css

loupe.bundle.js: $(JS_FILES) $(JSX_FILES)
	browserify -t reactify loupe.js > loupe.bundle.js

loupe.bundle.css: loupe.css
	autoprefixer loupe.css -o loupe.bundle.css
