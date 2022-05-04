from flask import current_app
from flask_restful import Resource
from utils import status


class HomeResource(Resource):

    def get(self):
        return {'environment': current_app.config['ENV']}, status.HTTP_200_OK