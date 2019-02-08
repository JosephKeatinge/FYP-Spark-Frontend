from flask import Flask, g
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from subprocess import Popen, PIPE
import sys, os, glob

app = Flask(__name__)
CORS(app)

api = Api(app)

class DFList(Resource):
    # Returns a list of all datasets available for processing
    def get(self):
        p1 = Popen(['hdfs', 'dfs', '-ls', '/datasets'], stdout=PIPE, stderr=PIPE)
        # Regex to get just the filenames out of the output
        p2 = Popen(["grep", "-oh" ,"\w*.csv"], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p2.communicate()
        datasets = stdout.decode("utf-8").split("\n")
        # Remove empty string from end of list
        datasets = datasets[:len(datasets)-1]
        
        return {"data": datasets}, 200

class DFHead(Resource):
    # Returns the first ten lines of a chosen dataset
    def get(self, identifier):
        self.runSparkScipt(identifier)
        filepath = ("script-output/print-df/%s/*.json" %identifier)
        txt = glob.glob(filepath)
        data = []
        i = 0
        for textfile in txt:
            print("path: ", textfile)
            f = open(textfile, 'r')
            rows = f.read()
            for line in rows.split("\n"):
                if i < 10:
                    data.append(line)
                    i += 1
                else:
                    return {"data" : data}, 200
        
        

    def runSparkScipt(self, identifier):
        Popen(['spark-submit', '--master=spark://cs1-09-58.ucc.ie:7077', 'backend/spark-system/print-df.py', str(identifier)], stdout=None)

api.add_resource(DFHead, '/dataset/<string:identifier>')
api.add_resource(DFList, '/datasets')
