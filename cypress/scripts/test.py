import psycopg2
from psycopg2 import OperationalError

def connect_to_database():
    try:
        # Connect to your PostgreSQL database
        connection = psycopg2.connect(
            user="postgres",
            password="test",
            host="localhost",
            port="5432",
            database="alarmenservice"
        )

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
    finally:
        # Closing database connection.
        if connection:
            connection.close()
            print("PostgreSQL connection is closed")

if __name__ == "__main__":
    connect_to_database()
