#!/bin/sh
export LANG=en_US.utf8
export HOME=/home/park0odf
exec ${HOME}/ridey/bin/python ${HOME}/ridey/bin/Ridey/manage.py runfcgi minspare=1 maxspare=1 maxchildren=1