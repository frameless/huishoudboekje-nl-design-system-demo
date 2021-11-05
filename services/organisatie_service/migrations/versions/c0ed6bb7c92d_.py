"""empty message

Revision ID: c0ed6bb7c92d
Revises: 7cbfb4dc077e
Create Date: 2021-08-27 14:46:19.964954

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c0ed6bb7c92d'
down_revision = '7cbfb4dc077e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('afdelingen', sa.Column('organisatie_id', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('afdelingen', 'organisatie_id')
    # ### end Alembic commands ###