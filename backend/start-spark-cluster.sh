#!/bin/bash
# Script to boot up Spark standalone cluster along with
# Hadoop HDFS

master_url="spark://cs1-09-58.ucc.ie:7077"
hadoop_path=`whereis hadoop`
set $hadoop_path
hadoop_dir=$2

(cd ${hadoop_dir}; \
	bin/hdfs namenode -format; \
	sbin/start-dfs.sh)

${SPARK_HOME}/sbin/start-master.sh
${SPARK_HOME}/sbin/start-slave.sh ${master_url}
