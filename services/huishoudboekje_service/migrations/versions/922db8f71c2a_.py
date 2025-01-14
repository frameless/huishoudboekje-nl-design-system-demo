"""empty message

Revision ID: 922db8f71c2a
Revises: 1fd976dba062
Create Date: 2023-07-26 09:16:58.187196

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '922db8f71c2a'
down_revision = '1fd976dba062'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('export', sa.Column('verwerking_datum', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('export', 'verwerking_datum')
    # ### end Alembic commands ###
