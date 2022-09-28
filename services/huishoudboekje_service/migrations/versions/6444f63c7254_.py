"""update overschrijvingen datum type from Date to DateTime

Revision ID: 6444f63c7254
Revises: e70fc6db2663
Create Date: 2022-09-28 12:51:12.354876

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6444f63c7254'
down_revision = 'e70fc6db2663'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('overschrijvingen', 'datum', type_=sa.DateTime)


def downgrade():
    op.drop_column('overschrijvingen', 'datum', type_=sa.Date)
