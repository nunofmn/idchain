#!/bin/sh
set -e

dropdb nunofmn1
createdb nunofmn1
sequelize db:migrate
