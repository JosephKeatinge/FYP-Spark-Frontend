#!/bin/bash
# Script to boot up Spark standalone cluster along with
# Hadoop HDFS. Script then populates the HDFS with datasets
# from the local datasets directory

master_url="spark://cs1-09-58.ucc.ie:7077"

hdfs namenode -format
${HADOOP_HOME}/sbin/start-dfs.sh

#${SPARK_HOME}/sbin/start-master.sh
#${SPARK_HOME}/sbin/start-slave.sh ${master_url}

hdfs dfs -mkdir /datasets
hdfs dfs -mkdir /output
hdfs dfs -put /home/jsk1/datasets/* /datasets
