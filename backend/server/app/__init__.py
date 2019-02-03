from flask import Flask, g
from flask_restful import Resource, Api, reqparse
import sys, os, subprocess, glob

app = Flask(__name__)

api = Api(app)

class DFHead(Resource):
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
        subprocess.run(['spark-submit', '--master=spark://cs1-09-58.ucc.ie:7077', 'backend/spark-system/print-df.py', str(identifier)])

api.add_resource(DFHead, '/dataset/<string:identifier>')
