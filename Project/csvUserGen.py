# Write to src/dataUser.csv
# timestamp, horizontalerror, verticalerror
# csvUserGen.py
# Author: Derek Baker (ouoluj)
# Generates csv files for use with d3, using user-given time constraints

import mariadb
import csv
import sys

try:
	dbConnection = mariadb.connect(
		user="root",
		password="",
		host="localhost",
		database="GNSS"
	)

	cursor = dbConnection.cursor()
	print("Successfully connected to database")

except mariadb.Error as error:
	print("Error: connecting to MariaDB: ", error)
	sys.exit(1)


with open('src/dataUser.csv', 'w', newline='') as csvfile:
	fieldnames = ['timestamp', 'horizontalerror', 'verticalerror', 'satellite']
	csvWrite = csv.DictWriter(csvfile, delimiter=',', fieldnames= fieldnames)

	userBegin = sys.argv[1]
	userEnd = sys.argv[2]

	# CSV Header
	csvWrite.writeheader()

	# GPS
	dbQuery = "SELECT timestamp, east, north FROM GPS WHERE timestamp > \'" + userBegin + "\' and timestamp < \'" + userEnd + "\'"
	cursor.execute(dbQuery)
	for (timestamp, x, y) in cursor:
		# print in CSV format
		csvWrite.writerow({'timestamp': timestamp, 'horizontalerror': x, 'verticalerror': y, 'satellite': 'GPS'})

	#Galileo
	dbQuery = "SELECT timestamp, east, north FROM Galileo WHERE timestamp > \'" + userBegin + "\' and timestamp < \'" + userEnd + "\'"
	cursor.execute(dbQuery)
	for (timestamp, x, y) in cursor:
		# print in CSV format
		csvWrite.writerow({'timestamp': timestamp, 'horizontalerror': x, 'verticalerror': y, 'satellite': 'Galileo'})

	#GLONASS
	dbQuery = "SELECT timestamp, east, north FROM GLONASS WHERE timestamp > \'" + userBegin + "\' and timestamp < \'" + userEnd + "\'"
	cursor.execute(dbQuery)
	for (timestamp, x, y) in cursor:
		# print in CSV format
		csvWrite.writerow({'timestamp': timestamp, 'horizontalerror': x, 'verticalerror': y, 'satellite': 'GLONASS'})

	#BeiDou
	dbQuery = "SELECT timestamp, east, north FROM BeiDou WHERE timestamp > \'" + userBegin + "\' and timestamp < \'" + userEnd + "\'"
	cursor.execute(dbQuery)
	for (timestamp, x, y) in cursor:
		# print in CSV format
		csvWrite.writerow({'timestamp': timestamp, 'horizontalerror': x, 'verticalerror': y, 'satellite': 'BeiDou'})


cursor.close()
if dbConnection:
	dbConnection.close()
	print("Database connection closed")
