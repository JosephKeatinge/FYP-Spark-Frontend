#!/bin/bash

# Script to boot up Spark standalone cluster along with
# Hadoop HDFS. Script then populates the HDFS with datasets
# from the local datasets directory

master_url="spark://cs1-09-58.ucc.ie:7077"

hdfs namenode -format
${HADOOP_HOME}/sbin/start-dfs.sh

HDFS_DS_HOME="/datasets"

#${SPARK_HOME}/sbin/start-master.sh
#${SPARK_HOME}/sbin/start-slave.sh ${master_url}

hdfs dfs -mkdir /datasets
hdfs dfs -mkdir /output

DS_LIST=`ls ${HOME}/datasets`
for ds in ${DS_LIST}
do
    ds_title=`echo ${ds} | grep -o ^[[:alnum:]]*`
    ds_dir="${HDFS_DS_HOME}/${ds_title}"
    hdfs dfs -mkdir "${ds_dir}"
    echo "Copying file ${ds} to ${ds_dir} on HDFS"
    hdfs dfs -put "${HOME}/datasets/${ds}" "${ds_dir}"
done 

# python "/home/jsk1/FYP-Spark-Frontend/backend/spark-system/getDSInfo.py"
