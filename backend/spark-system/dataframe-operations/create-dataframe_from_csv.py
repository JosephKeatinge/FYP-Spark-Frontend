from pyspark import SparkContext

# Loads data from a csv file, creates a Spark DataFrame
# object and returns the object
def createDataFrameFromCSV(file, master, appname):
    sc = SparkContext("spark://cs1-09-58.ucc.ie:7077", "SparkTest")
    