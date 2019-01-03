from pyspark.sql import SparkSession

iris_file_uri = "hdfs://localhost:9000/datasets/dataset_iris.csv"

spark = SparkSession.builder.appName("BasicApp").getOrCreate()
iris = spark.read.csv(iris_file_uri)

print(iris)

spark.stop()