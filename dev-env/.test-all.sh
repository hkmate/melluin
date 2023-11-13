#!/bin/bash

##
#    This file should be executed from script in root dir.
##

npm run --prefix backend test
melluin_be_test=$?

npm run --prefix frontend test
melluin_fe_test=$?

status_of_both=$(($melluin_be_test + $melluin_fe_test))
exit $status_of_both
