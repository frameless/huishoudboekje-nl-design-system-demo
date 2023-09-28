from create_customer_statement_message import CreateCustomerStatementMessage 

info = {
    'field_name': 'test'
}
filename = "../../../tests/graphql/mutations/customer_statement_messages/Anoniem.xml"
file = open(filename, "rb")

CreateCustomerStatementMessage().mutate(info, file)
