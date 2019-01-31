from flask import Flask, g
from flask_restful import Resource, Api, reqparse
import os

app = Flask(__name__)

api = Api(app)

class DFHead(Resource):
    def get(self, identifier):
        return {'data': identifier}, 200

api.add_resource(DFHead, '/dataset/<string:identifier>')
