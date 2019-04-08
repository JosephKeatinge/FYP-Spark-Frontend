from flask import Flask, g, json
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from subprocess import Popen, PIPE
import sys, os

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
    # Function to submit application to the Spark cluster, providing a dataset id and SQL query as arguments
    p = Popen(['spark-submit', '--master=local[*]', 'backend/spark-system/print-df.py', identifier, query], stdout=None)
    p.communicate()

class DFList(Resource):
    # API method to return an array of the names of all datasets available on the HDFS

    def get(self):
        # List the contents of the HDFS datasets directory
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
    # API method to run a Spark application on a dataset and return the result
    # Takes a dataset id and optional operation parameters. If none are supplied,
    # a simple query is executed to fetch all rows (limited by the 'lines' parameter or 100 by default).
    # Returns a JSON object with dataset id, and array of column names, and an array of objects to
    # represent each row of data
    hdfsRootURL = "hdfs://localhost:9000"
    outputDir = "/output"
    sqlQuery = ""
    columns = ""

    def get(self, identifier):
        args = parser.parse_args()
        # SQL query is formed from parameters
        self.sqlQuery = self.createQuery(args, identifier)
        # Application submitted to cluster, output written to file on HDFS in JSON format
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
            # Output file read from HDFS, already in JSON format
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
        # Returns the column names of the dataset in an array
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
            query += args['column']
            query += ") " if args['operation'] and args['operation'] != 'SELECT' else " "
        else:
            query += "* "
        query += "FROM %s " % table
        query += "LIMIT %s" % args['lines']
        return query

class DFColumns(Resource):
    # API method which takes a dataset id as input and returns a JSON object containing
    # the dataset's column names as keys and their datatypes as values.
    # These values are read from files that were generated when the HDFS was set up
    def get(self, identifier):
        f = open("backend/spark-system/ds-dtypes/%s.json" % (identifier))
        cols = f.read()
        return cols

# Mapping the API method objects to their URL endpoints
api.add_resource(DFHead, '/dataset/<string:identifier>')
api.add_resource(DFList, '/datasets')
api.add_resource(DFColumns, '/dataset/columns/<string:identifier>')