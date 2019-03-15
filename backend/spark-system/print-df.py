from pyspark.sql import SparkSession
import sys

file_uri = "hdfs://localhost:9000/datasets/%s" % (sys.argv[1])
spark = SparkSession.builder.appName("BasicApp").getOrCreate()

df = spark.read.option("header", "true").option("inferSchema", "true").csv(file_uri)

file_title = sys.argv[1].split(".")[0]
sql_query = sys.argv[2]

print("About to execute query %s on table %s" % (sql_query, file_title))

df.createOrReplaceTempView(file_title)
df2 = spark.sql(sql_query)

df2.write.mode("overwrite").json("hdfs://localhost:9000/output/%s" % file_title)

spark.stop()