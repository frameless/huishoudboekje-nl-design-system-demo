import logging
from tokenize import String

import hhb_backend.graphql as graphql


async def automatisch_alle_alarmen_beoordelen():
    '''Automatisch ALLE alarmen beoordelen.'''
    logging.info("Automatisch alarmen beoordelen started.")

    result = await graphql.schema.execute("""
mutation EvaluateAlarms {
  evaluateAlarms {
    alarmTriggerResult {
      alarm{
        id
      }
      nextAlarm {
        id
      }
      signaal {
        id
      }
    }
  }
}
""", return_promise=True)
    if result.errors is not None:
        logging.warning(f"Automatisch alarmen beoordelen failed: {result.errors}")
        return

    alarmen_ = result.data['evaluateAlarms']['alarmTriggerResult']
    logging.info(f"Automatisch alarmen beoordelen completed with {len(alarmen_)} evaluated alams.")


async def automatisch_alarm_beoordelen(id: String):
    '''Automatisch het alarm met opgegeven id beoordelen.'''
    logging.info(f"Automatisch een alarm beoordelen started for id: {id}.")
  
    result = await graphql.schema.execute("""
mutation EvaluateAlarm($id: String!) {
  evaluateAlarm(id: $id) {
    alarmTriggerResult {
      alarm{
        id
      }
      nextAlarm {
        id
      }
      signaal {
        id
      }
    }
  }
}
""", variables={"id": id}, return_promise=True)
    if result.errors is not None:
        logging.warning(f"Automatisch een alarm beoordelen failed: {result.errors}")
        return

    # Alternatief, maar heeft dan geen kans om de errors te loggen. Die logging moet dan misschien al daar gebeuren waar de raise GraphQLError staat.
    # evaluateOneAlarm()

    logging.info(f"Automatisch een alarm beoordelen completed.")
