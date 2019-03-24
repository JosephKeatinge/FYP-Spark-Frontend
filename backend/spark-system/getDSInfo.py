from pyspark.sql import SparkSession
from subprocess import Popen, PIPE
import os

spark = SparkSession.builder.appName("GetDSInfo").getOrCreate()

p1 = Popen(['hdfs', 'dfs', '-ls', '/datasets'], stdout=PIPE, stderr=PIPE)
p2 = Popen(['grep', '-o', '[[:alnum:]]*$'], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
stdout, stderr = p2.communicate()

# Must split string by line break and remove unwanted results from start and end
dsDirList = stdout.decode("utf-8").split("\n")[1:len(stdout.split("\n"))-1]

for dir in dsDirList:
    dsPath = "/datasets/%s/%s.csv" % (dir, dir)
    dsInfoFilePath = "/home/jsk1/FYP-Spark-Frontend/backend/spark-system/ds-dtypes/%s.txt" % dir
    df = spark.read.option("header", "true").option("inferSchema", "true").csv(dsPath)
    print("################ WRITING FILE /tmp/%s ####################" % dsInfoFilePath)
    f = open(dsInfoFilePath, "w+")
    cols = df.dtypes
    for c in cols:
        name, typ = c
        f.write("%s: %s\n" % (name, typ))
    f.close()
    print("################ SUCCESSFULLY WRITTEN FILE %s ####################" % dsInfoFilePath)

spark.stop()

