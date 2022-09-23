from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import TRANSACTIE_SERVICES_URL
from hhb_backend.service.model.customer_statement_message import CustomerStatementMessage


class CSMLoader(DataLoader[CustomerStatementMessage]):
    service = TRANSACTIE_SERVICES_URL
    model = "customerstatementmessages"
