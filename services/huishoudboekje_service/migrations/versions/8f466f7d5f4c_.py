"""update export start datum and eind datum from Date to DateTime

Revision ID: 8f466f7d5f4c
Revises: 6444f63c7254
Create Date: 2022-10-03 14:52:13.509205

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f466f7d5f4c'
down_revision = '6444f63c7254'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('export', 'start_datum', type_=sa.DateTime)
    op.alter_column('export', 'eind_datum', type_=sa.DateTime)


def downgrade():
    op.alter_column('export', 'start_datum', type_=sa.Date)
    op.alter_column('export', 'eind_datum', type_=sa.Date)
