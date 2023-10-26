import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError


def seed_database_with_test_data(sql_file_name, db_url):
    logging.info("seeding database with test data")

    sql_file_path = "test_data/" + sql_file_name
    engine = create_engine(db_url)

    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Read the SQL file
        with open(sql_file_path, "r", encoding="utf-8") as sql_file:
            sql_script = sql_file.read()

        # Execute the SQL script using SQLAlchemy
        session.execute(text(sql_script))
        session.commit()

        print("Seeded database with test data successfully.")
    except SQLAlchemyError as error:
        session.rollback()
        print(f"Error seeding database with test data: {error}")
    finally:
        session.close()
