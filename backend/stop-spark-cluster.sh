#!/bin/bash

hdfs dfs -rm -r "/datasets"
hdfs dfs -rm -r "/output"

${HADOOP_HOME}/sbin/stop-dfs.sh
#${SPARK_HOME}/sbin/stop-all.sh
rm -rf "/tmp/hadoop-jsk1/dfs"