HOSTS = $(shell grep -o ^'127.0.0.1 portal-dev.denbi.de' /etc/hosts)
NODEENV_VERSION = $(shell nodeenv --version | egrep ^[0-9]*)
NODEENVRC_VERSION = $(shell egrep -o [0-9].* .nodeenvrc)


default: env node_modules ## Default set-up of the cloud-portal-webapp

new_environment: clean_env default ## Same as default, but removes env folder beforehand

new_node_modules: clean_node_modules default ## Same es default, but removes node_modules folder beforehand

new_env_and_node: clean_env clean_node_modules default ## Same as default, but removes env and node_modules folders beforehand

serve: default ng_serve ## Same as default, but serves the webapp in the end

is_line_in_hosts: # Checks if the 127.0.0.1 portal-dev.denbi.de is in /etc/hosts
	@echo ---Checking your /etc/hosts file:
ifeq ($(HOSTS), 127.0.0.1 portal-dev.denbi.de)
	@echo 127.0.0.1 portal-dev.denbi.de is in /etc/hosts
else
	$(warning In /etc/hosts file is missing: 127.0.0.1 portal-dev.denbi.de)
	$(warning Please insert manually!)
	$(error Ending makefile.)
endif

check_nodeenv: # Checks if a version of nodeenv is installed by calling nodeenv --version and asserting that a version number exists
	@echo ---Checking your Nodeenv version:
ifeq ($(NODEENV_VERSION),)
	$(warning Nodeenv was not found.)
	$(error Please install Nodeenv.)
else
	@echo Your Nodeenv version is $(NODEENV_VERSION)
endif

env: is_line_in_hosts check_nodeenv .nodeenvrc # Creates an env folder if not already existing. Also removes and creates a new env folder if 
	@echo ---Checking for env folder and version:; \
	if ! test -d env; \
	then echo Env folder does not exist. Creating env folder.; \
	nodeenv -C .nodeenvrc env; \
	elif [ $$(find env/src/ -maxdepth 1 -name "*$(NODEENVRC_VERSION)*" | wc -l) -eq 0 ]; \
	#[ $$(find env/src/ -maxdepth 1 -name "*$(NODEENVRC_VERSION)*" | wc -l) -eq 0 ]; \
	then echo Env folder found, but node version is not the same as in the .nodeenvrc.; \
	echo Removing env folder and creating anew.; \
	$(MAKE) clean_env; \
	nodeenv -C .nodeenvrc env; \
	else echo Env folder found and node version same as in the .nodeenvrc.; \
	fi; fi
	
clean_env: ## Removes the env folder
	@echo ---Removing env folder:; \
	rm -R env; \
	echo Env folder removed.

clean_node_modules: ## Removes the node_modules folder
	@echo ---Removing node_modules folder:; \
	rm -R node_modules; \
	echo Node modules folder removed.

node_modules: package.json # Activates the virtual environment and creates node_modules/ installs packages from package.json
	@echo ---Installing dependencies from package.json:; \
	. env/bin/activate; \
	npm install; \

ng_serve: # Activates the env environment and serves the angular webapp
	@ echo ---Starting Webapp; \
	. env/bin/activate; \
	ng serve

.PHONY: default new_environment new_node_modules new_env_and_node serve is_line_in_hosts check_nodeenv clean_env clean_node_modules ng_serve

help:
	    @egrep '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN ***REMOVED***FS = ":.*?## "***REMOVED***; ***REMOVED***printf "\033[36m%-16s\033[0m %s\n", $$1, $$2***REMOVED***'