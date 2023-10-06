from graphql import GraphQLError
import jsonschema


class JsonInputValidator():
    
    def __init__(self, schema):
        self.schema = schema

    def validate(self, input,):
        # try:    
        jsonschema.validate(input, self.schema)
        # except jsonschema.ValidationError as e:
        #     raise GraphQLError("Invalid input")