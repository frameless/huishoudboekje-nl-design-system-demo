"""empty message

Revision ID: 401d7b9a473f
Revises: 5f85b2dc39e6
Create Date: 2022-10-19 09:35:50.263903

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '401d7b9a473f'
down_revision = '5f85b2dc39e6'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('bank_transactions', 'transactie_datum', type_=sa.DateTime)


def downgrade():
    op.alter_column('bank_transactions', 'transactie_datum', type_=sa.Date)
