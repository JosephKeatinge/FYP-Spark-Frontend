# Main driver program for running on the Spark cluster

from pyspark import SparkContext, SparkConf
#from dataframe_operations import create_dataframe_from_csv
import pandas as pd
from pyspark.sql import SparkSession, DataFrame

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

if __name__ == '__main__':
    conf = SparkConf().setAppName("test").setMaster("spark://cs1-09-58.ucc.ie:7077")
    sc = SparkContext(conf=conf)

    newFile = "../datasets/NBA_player_of_the_week.csv"
    df = create_dataframe_from_csv(newFile, "local", "test")
    df.show()