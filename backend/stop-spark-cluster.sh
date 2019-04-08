#!/bin/bash

# Script to shutdown the Spark cluster and the HDFS
# Currently no backups are saved. This can easily be changed but
# it was not necessary for the testing of this project

hdfs dfs -rm -r "/datasets"
hdfs dfs -rm -r "/output"

${HADOOP_HOME}/sbin/stop-dfs.sh
${SPARK_HOME}/sbin/stop-all.sh