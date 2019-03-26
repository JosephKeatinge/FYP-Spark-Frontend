from flask import Flask, g, json
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from subprocess import Popen, PIPE
import sys, os, glob

SPARK_MASTER_URL="spark://cs1-09-58.ucc.ie:7077"

app = Flask(__name__)
CORS(app)

api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('operation')
parser.add_argument('column', type=str)
parser.add_argument('columns', action='append')
parser.add_argument('range')
parser.add_argument('lines', default=100, type=int)

ALLOWED_OPS = {"AVG": "num", "SUM": "num", "MIN": "num", "MAX": "num", "COUNT": "any", "SELECT": "string"}

def runSparkScipt(identifier, query):
    p = Popen(['spark-submit', '--master=local[*]', 'backend/spark-system/print-df.py', identifier, query], stdout=None)
    p.communicate()

class DFList(Resource):
    # Returns a list of all datasets available for processing

    def get(self):
        p1 = Popen(['hdfs', 'dfs', '-ls', '/datasets'], stdout=PIPE, stderr=PIPE)
        # Regex to get just the filenames out of the output
        p2 = Popen(['grep', '-o', '[[:alnum:]]*$'], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p2.communicate()
        datasets = stdout.decode("utf-8").split("\n")
        if len(datasets) < 2:
            p1 = Popen(['ls', str(os.environ['HOME'])+'/datasets'], stdout=PIPE, stderr=PIPE)
            p2 = Popen(["grep", "-oh" ,"\w*.csv"], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
            stdout, stderr = p2.communicate()
            datasets = stdout.decode("utf-8").split("\n")
        # Remove empty string from end of list
        datasets = datasets[1:len(datasets)-1]
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
        self.sqlQuery = self.createQuery(args, identifier)
        # return {"query": self.sqlQuery}
        
        runSparkScipt(identifier, self.sqlQuery)
        p1 = Popen(['hdfs', 'dfs', '-ls', self.outputDir+'/'+identifier], stdout=PIPE, stderr=PIPE)
        p2 = Popen(["grep", "-oh" ,"part\S*.json"], stdin=p1.stdout, stdout=PIPE, stderr=PIPE)
        stdout, stderr = p2.communicate()
        output_files = stdout.decode("utf-8").split("\n")
        output_files = output_files[:len(output_files)-1]

        columns = self.getColumns(identifier)

        rows = []
        for textfile in output_files:
            file_url = self.outputDir+'/'+identifier+'/'+textfile
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
        columns = []
        try:
            f = open("backend/spark-system/ds-dtypes/%s.json" % (dataset))
            colString = f.read()
            colList = colString.strip("{}").split(",")
            for col in colList:
                columns += [col.split(":")[0].strip("\"")]
            return columns
        except FileNotFoundError:
            return []
        
    def createQuery(self, args, table):
        # Create the SQL query to be run against the dataframe
        print(args)
        query = "SELECT "
        if args['column']:
            if args['operation'] and args['operation'] != 'SELECT':
                query += args['operation'] + "("
            #for arg in args['columns']:
            #    cols = arg.strip(" []")
            #    query += cols
            #    self.columns += cols
            query += args['column']
            query += ") " if args['operation'] and args['operation'] != 'SELECT' else " "
        else:
            query += "* "
        query += "FROM %s " % table
        query += "LIMIT %s" % args['lines']
        return query

class DFColumns(Resource):
    def get(self, identifier):
        f = open("backend/spark-system/ds-dtypes/%s.json" % (identifier))
        cols = f.read()
        return cols

api.add_resource(DFHead, '/dataset/<string:identifier>')
api.add_resource(DFList, '/datasets')
api.add_resource(DFColumns, '/dataset/columns/<string:identifier>')