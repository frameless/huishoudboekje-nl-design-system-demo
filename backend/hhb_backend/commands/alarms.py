import asyncio
import logging
from flask import Blueprint

from hhb_backend.graphql.mutations.alarmen.evaluate_alarm import evaluate_alarms

""" CLI for actions on alarms in Huishoudboekje """
alarms_cli = Blueprint('alarms', __name__)


@alarms_cli.cli.command("evaluate")
def command():
    """Makes the excution async"""
    loop = asyncio.get_event_loop()
    asyncio.run(evaluate())
    loop.close()


async def evaluate():
    """Evaluates all current active alarms"""
    logging.info("Evaluating all alarms...")
    await evaluate_alarms()
    logging.info("Done!")
