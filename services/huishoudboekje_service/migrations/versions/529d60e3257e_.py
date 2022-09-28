"""update afspraken valid_from and valid_through type from Date to DateTime

Revision ID: 529d60e3257e
Revises: b7a89ea6f6ed
Create Date: 2022-09-27 11:43:35.165283

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '529d60e3257e'
down_revision = 'b7a89ea6f6ed'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('afspraken', 'valid_from', type_=sa.DateTime())
    op.alter_column('afspraken', 'valid_through', type_=sa.DateTime())


def downgrade():
    op.alter_column('afspraken', 'valid_from', type_=sa.Date())
    op.alter_column('afspraken', 'valid_through', type_=sa.Date())
