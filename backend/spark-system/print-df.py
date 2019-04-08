"""
Spark application responsible for creating a Dataframe from a dataset csv file, executing an SQL
query on the Dataframe, and writing the result to a file. The dataset filename and the SQL query
are supplied as parameters."""

from pyspark.sql import SparkSession
import sys

file_title = sys.argv[1]
sql_query = sys.argv[2]

AGGR_QUERIES = ["MIN", "MAX"]

file_uri = "hdfs://localhost:9000/datasets/%s/%s.csv" % (file_title, file_title)
spark = SparkSession.builder.appName("DatasetSQLQuery").getOrCreate()

df = spark.read.option("header", "true").option("inferSchema", "true").csv(file_uri)

df.createOrReplaceTempView(file_title)

print("EXECUTING SQL QUERY %s ON TABLE %s" % (sql_query, file_title))
if AGGR_QUERIES[0] in sql_query or AGGR_QUERIES[1] in sql_query:
    column = sql_query.split(" ")[1].split("(")[1].strip(")")
    df2 = spark.sql("SELECT * FROM %s WHERE %s = (%s)" % (file_title, column, sql_query))
else:
    df2 = spark.sql(sql_query)

df2.write.mode("overwrite").json("hdfs://localhost:9000/output/%s" % file_title)

spark.stop()
