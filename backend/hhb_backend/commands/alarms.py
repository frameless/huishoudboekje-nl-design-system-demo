import logging
from flask import Blueprint

from hhb_backend.graphql.mutations.alarmen.evaluate_alarm import evaluate_alarms

""" CLI for actions on alarms in Huishoudboekje """
alarms_cli = Blueprint('alarms', __name__)


@alarms_cli.cli.command("evaluate")
def command():
    evaluate()


def evaluate():
    """Evaluates all current active alarms"""
    logging.info("Evaluating all alarms")
    evaluate_alarms()
    logging.debug("Evaluated all alarms!")
