"""empty message

Revision ID: d517e8fecd5f
Revises: 0562ae120659
Create Date: 2021-08-20 16:03:54.527045

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd517e8fecd5f'
down_revision = '0562ae120659'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('afspraken', 'automatische_incasso')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('afspraken', sa.Column('automatische_incasso', sa.BOOLEAN(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
