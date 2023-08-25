import logging

from flask import Blueprint
from graphql import specified_rules
from hhb_backend.graphql import schema
from lib.graphene_file_upload import FileUploadGraphQLView
from graphene.validation import DisableIntrospection

def create_blueprint(USE_GRAPHIQL):
    bp = Blueprint('graphql', __name__)
    useGraphiql = True if USE_GRAPHIQL == "1" else False

    #Specified rules are all validation rules defined by the GraphQL specification
    # We dont want to override this but we want to add DisableIntrospection
    validation_rules_list = list(specified_rules)
    validation_rules_list.append(DisableIntrospection)
    
    view = FileUploadGraphQLView.as_view(
        'graphql',
        schema=schema.graphql_schema,
        graphiql=useGraphiql,
        validation_rules=tuple(validation_rules_list),
        batch=True,
        middleware=[
            ErrorReportingMiddleware()
        ]
    )

    bp.add_url_rule('/', view_func=view,
                    strict_slashes=False, methods=["POST"])

    # Optional, for adding batch query support (used in Apollo-Client)
    bp.add_url_rule(
        '/batch', view_func=view, strict_slashes=False)

    return bp


class ErrorReportingMiddleware(object):
    def resolve(self, next, root, info, **args):
        try:
            return next(root, info, **args)
        except Exception as e:
            logging.exception(
                "An error occurred while resolving field {}.{}".format(
                    info.parent_type.name, info.field_name)
            )
            logging.debug(e)
            raise e
