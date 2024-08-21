"""rename afspraak beschrijving to omschrijving

Revision ID: 93000a3eaf47
Revises: 7475216c4e51
Create Date: 2021-04-01 11:16:17.233861

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '93000a3eaf47'
down_revision = '7475216c4e51'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('afspraken', 'beschrijving', new_column_name='omschrijving')


def downgrade():
    op.alter_column('afspraken', 'omschrijving', new_column_name='beschrijving')
