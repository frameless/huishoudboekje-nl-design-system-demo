import logging
from flask import Blueprint

from hhb_backend.feature_flags import Unleash
from hhb_backend.graphql.mutations.alarmen.evaluate_alarm import evaluate_alarms

""" CLI for actions on alarms in Huishoudboekje """
alarms_cli = Blueprint('alarms', __name__)


@alarms_cli.cli.command("evaluate")
def command():
    evaluate()


def evaluate():
    """Evaluates all current active alarms"""
    if Unleash().is_enabled("signalen"):
        logging.info("Evaluating all alarms")
        logging.info(evaluate_alarms())
        logging.debug("Evaluated all alarms!")
    else:
        logging.info("Skipping alarm evaluation. Signalen is disabled")
