from pyspark.sql import SparkSession
import sys

file_uri = "hdfs://localhost:9000/datasets/%s" % (str(sys.argv[1]))

spark = SparkSession.builder.appName("BasicApp").getOrCreate()

df = spark.read.csv(file_uri)

df.write.json("hdfs://localhost:9000/output/print-df/%s" % (str(sys.argv[1])))

"""newColumns = [str(df.head()[col]) for col in df.columns]
oldColumns = df.columns

newDf = reduce(lambda df, idx: df.withColumnRenamed(oldColumns[idx], newColumns[idx]), xrange(len(oldColumns)), df)"""

spark.stop()