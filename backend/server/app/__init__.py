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
parser.add_argument('columns', action='append')
parser.add_argument('range', default=20, type=int)

def runSparkScipt(identifier, query):
    p = Popen(['spark-submit', '--master=local[*]', 'backend/spark-system/print-df.py', identifier, query], stdout=None)
    p.communicate()

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
        if len(datasets) < 2:
            p1 = Popen(['ls', str(os.environ['HOME'])+'/datasets'], stdout=PIPE, stderr=PIPE)
            p2 = Popen(["grep", "-oh" ,"\w*.csv"], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
            stdout, stderr = p2.communicate()
            datasets = stdout.decode("utf-8").split("\n")
        # Remove empty string from end of list
        datasets = datasets[:len(datasets)-1]
        data = {"datasets": datasets}
        response = app.response_class(
            response=json.dumps(data),
            mimetype='application/json'
        )
        return response 

class DFHead(Resource):
    # Returns the first ten lines of a chosen dataset
    hdfsRootURL = "hdfs://localhost:9000"
    outputDir = "/output"
    sqlQuery = ""
    columns = ""

    def get(self, identifier):
        args = parser.parse_args()
        tableName = identifier.split(".")[0]
        self.sqlQuery = self.createQuery(args, tableName)
        # return {"query": self.sqlQuery}
        
        runSparkScipt(identifier, self.sqlQuery)
        p1 = Popen(['hdfs', 'dfs', '-ls', self.outputDir+'/'+tableName], stdout=PIPE, stderr=PIPE)
        p2 = Popen(["grep", "-oh" ,"part\S*.json"], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p2.communicate()
        output_files = stdout.decode("utf-8").split("\n")
        output_files = output_files[:len(output_files)-1]

        if args['columns']:
            columns = self.columns.split(",")
        else:
            columns = self.getColumns(identifier)

        rows = []
        for textfile in output_files:
            file_url = self.outputDir+'/'+tableName+'/'+textfile
            p = Popen(['hdfs', 'dfs', '-cat', file_url], stdout=PIPE, stderr=PIPE)
            stdout, stderr = p.communicate()
            lines = stdout.decode("utf-8").split("\n")
            lines = lines[:len(lines)-1]
            rows += lines

        data = {"id": identifier,
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
        
    def createQuery(self, args, table):
        # Create the SQL query to be run against the dataframe
        query = "SELECT "
        if args['columns']:
            if args['operation']:
                query += args['operation'] + "("
            for arg in args['columns']:
                cols = arg.strip(" []")
                query += cols
                self.columns += cols
            query += ") " if args['operation'] else " "
        else:
            query += "* "
        query += "FROM %s " % table
        query += "LIMIT %s" % args['range']
        return query

api.add_resource(DFHead, '/dataset/<string:identifier>')
api.add_resource(DFList, '/datasets')