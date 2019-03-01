from pyspark.sql import SparkSession
import sys

file_uri = "hdfs://localhost:9000/datasets/%s" % (str(sys.argv[1]))

spark = SparkSession.builder.appName("BasicApp").getOrCreate()

df = spark.read.option("header", "true").csv(file_uri)

#df.write.json("hdfs://localhost:9000/output/print-df/df1")
df.write.mode("overwrite").json("script-output/print-df/%s" % str(sys.argv[1]))

spark.stop()