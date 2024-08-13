#!/bin/sh

if [ ! -d "./dist" ]; then
	echo "'./dist' directory not found in '${PWD}'"
	exit 1
fi
