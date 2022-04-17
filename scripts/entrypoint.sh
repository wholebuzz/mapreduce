#!/bin/sh
cd /wholebuzz/mapreduce || exit 1
yarn --silent start ${RUN_ARGS} "$@"
