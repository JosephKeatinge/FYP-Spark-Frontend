from flask import Flask, g, json
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from subprocess import Popen, PIPE
import sys, os, glob

app = Flask(__name__)
CORS(app)

api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('operation')

def runSparkScipt(identifier):
    Popen(['spark-submit', '--master=spark://cs1-09-58.ucc.ie:7077', 'backend/spark-system/print-df.py', str(identifier)], stdout=None)

class DFList(Resource):
    # Returns a list of all datasets available for processing
    """def getNot(self):
        data = {"datasets": ["youtube.csv"]}
        response = app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )
        return response """

    def get(self):
        p1 = Popen(['hdfs', 'dfs', '-ls', '/datasets'], stdout=PIPE, stderr=PIPE)
        # Regex to get just the filenames out of the output
        p2 = Popen(["grep", "-oh" ,"\w*.csv"], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p2.communicate()
        datasets = stdout.decode("utf-8").split("\n")
        # Remove empty string from end of list
        if len(datasets) > 0:
            datasets = datasets[:len(datasets)-1]
        else:
            p1 = Popen(['ls', str(os.environ['HOME'])+'/datasets'], stdout=PIPE, stderr=PIPE)
            p2 = Popen(["grep", "-oh" ,"\w*.csv"], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
            stdout, stderr = p2.communicate()
            datasets = stdout.decode("utf-8").split("\n")
        data = {"datasets": datasets}
        response = app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )
        return response 

class DFHead(Resource):
    # Returns the first ten lines of a chosen dataset
    sql_query = ""

    def get(self, identifier):
        args = parser.parse_args()
        if len(args) > 0:
            self.sql_query = self.formQuery(args)

        runSparkScipt(identifier)
        filepath = ("script-output/print-df/%s/*.json" %identifier)
        txt = glob.glob(filepath)

        id = str(identifier)
        columns = self.getColumns(identifier)
        #txt = [("%s/datasets/youtube.csv" % os.environ['HOME'])]
        for textfile in txt:
            f = open(textfile, 'r')
            values = f.read()
            lines = values.split("\n")
            lines = lines[:10]
            rows = []
            for ln in lines:
                rows += [ln]
            print(rows)

        data = {"id": id,
                "columns": columns,
                "rows": rows}
        response = app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )
        return response 


    def getColumns(self, dataset):
        try:
            # Get first line of csv containing column names
            f = open("%s/datasets/%s" % (os.environ['HOME'], str(dataset)))
            cols = f.read().split("\n")[0]
            columns = cols.split(',')
            return columns
        except FileNotFoundError:
            return []
        
        

api.add_resource(DFHead, '/dataset/<string:identifier>')
api.add_resource(DFList, '/datasets')