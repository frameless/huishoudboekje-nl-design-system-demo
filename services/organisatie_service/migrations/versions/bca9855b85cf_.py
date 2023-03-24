"""empty message

Revision ID: bca9855b85cf
Revises: 38538e785b39
Create Date: 2023-03-24 12:09:40.879895

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'bca9855b85cf'
down_revision = '38538e785b39'
branch_labels = None
depends_on = None

create_aggregate = """
            CREATE or REPLACE AGGREGATE array_concat_agg(anyarray) (
                SFUNC = array_cat,
                STYPE = anyarray
            );
            """

drop_aggregate = "DROP AGGREGATE array_concat_agg"

def upgrade():
    op.execute(create_aggregate)


def downgrade():
    op.execute(drop_aggregate)
