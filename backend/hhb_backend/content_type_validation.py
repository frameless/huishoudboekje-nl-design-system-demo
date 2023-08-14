import json


class ContentTypeValidator():

    def is_valid(self,request):
        return request.content_type == 'application/json' or self.__exempt_content_type_based_on_grahpql_operations(request)

    def __exempt_content_type_based_on_grahpql_operations(self, request):
        if request.content_type is None:
            return False

        exemptions = self.__exempt_content_types()
        #This works for multipart/form-data not sure if it will work for other types but so far we only use multipart/form-data besides json
        content_type = request.content_type.split(';')[0]
        if content_type not in exemptions:
            return False
        return exemptions[content_type](request)
    
    def __exempt_multipart_form_data(request):
        excempt = False
        exempt_operations = ["createCustomerStatementMessage"]
        operation = json.loads(request.form.get("operations"))
        # (just in case) multipart/form-data only allowed when it is only one operation
        if type(operation) is not list and operation["operationName"] in exempt_operations:
            excempt = True
        return excempt


    def __exempt_content_types(self):
        return {"multipart/form-data": self.__exempt_multipart_form_data}

