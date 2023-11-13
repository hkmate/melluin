#!/bin/bash

##
#    This file should be executed from script in root dir.
##

npm run --prefix backend lint;
melluin_be_lint=$?

npm run --prefix frontend lint;
melluin_fe_lint=$?

status_of_both=$((melluin_be_lint + melluin_fe_lint))
exit $status_of_both
