""" GraphQL mutation for creating a new CustomerStatementMessage """
import graphene
from graphene_file_upload.scalars import Upload


class CreateCustomerStatementMessage(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    ok = graphene.Boolean()
    # TODO: CSM model returned

    def mutate(self, info, file, **kwargs):
        # do something with your file
        filename = file.filename
        content = file.stream.read()
        raw_data = None
        for line in file:
            raw_data

        return CreateCustomerStatementMessage(ok=True)
