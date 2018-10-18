from dataframe_operations import SparkSession, DataFrame
import pandas as pd

# Loads data from a csv file, creates a Spark DataFrame
# object and returns the object
def createDataFrameFromCSV(file, master, appname):
    spark = SparkSession.builder \
    .master(master) \
    .appName(appname) \
    .getOrCreate()
    pandasdf = pd.read_csv(file)
    df = spark.createDataFrame(pandasdf)
    return df