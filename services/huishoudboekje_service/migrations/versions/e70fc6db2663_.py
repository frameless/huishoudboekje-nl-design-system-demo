"""update burger geboortedatum type from Date to DateTime

Revision ID: e70fc6db2663
Revises: 529d60e3257e
Create Date: 2022-09-28 09:54:40.611981

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e70fc6db2663'
down_revision = '529d60e3257e'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('burgers', 'geboortedatum', type_=sa.DateTime)


def downgrade():
    op.alter_column('burgers', 'geboortedatum', type_=sa.Date)
