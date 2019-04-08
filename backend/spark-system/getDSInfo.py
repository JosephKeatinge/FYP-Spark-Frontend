"""
Spark application responsible for retrieving the column datatypes for each dataset in the HDFS
and writing these values to a file, one for each dataset. They are written in JSON format to make
parsing easier for the API object."""

from pyspark.sql import SparkSession
from subprocess import Popen, PIPE
import os

spark = SparkSession.builder.appName("GetDSInfo").getOrCreate()

# Generating a list of all datasets in HDFS
p1 = Popen(['hdfs', 'dfs', '-ls', '/datasets'], stdout=PIPE, stderr=PIPE)
p2 = Popen(['grep', '-o', '[[:alnum:]]*$'], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
stdout, stderr = p2.communicate()

# Must split string by line break and remove unwanted results from start and end
dsDirList = stdout.decode("utf-8").split("\n")
dsDirList = dsDirList[1:len(dsDirList)-1]

for dir in dsDirList:
    dsPath = "/datasets/%s/%s.csv" % (dir, dir)
    dsInfoFilePath = "/home/jsk1/FYP-Spark-Frontend/backend/spark-system/ds-dtypes/%s.json" % dir
    df = spark.read.option("header", "true").option("inferSchema", "true").csv(dsPath)
    f = open(dsInfoFilePath, "w+")
    cols = df.dtypes
    numCols = len(cols)
    f.write("{")
    i = 0
    while i < numCols:
        name, typ = cols[i]
        if numCols-i >1: 
            f.write("\"%s\":\"%s\"," % (name, typ))
        else:
            f.write("\"%s\":\"%s\"" % (name, typ))
        i += 1
    f.write("}")
    f.close()

spark.stop()

