"""empty message

Revision ID: d4258041047d
Revises: e70db1cbbc3e
Create Date: 2021-08-03 12:17:23.295528

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4258041047d'
down_revision = 'e70db1cbbc3e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('burgers', sa.Column('bsn', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('burgers', 'bsn')
    # ### end Alembic commands ###
