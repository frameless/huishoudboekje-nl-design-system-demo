"""empty message

Revision ID: 7cbfb4dc077e
Revises: 4a5c676c6918
Create Date: 2021-08-27 14:44:32.864812

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7cbfb4dc077e'
down_revision = '4a5c676c6918'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('afdelingen',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('naam', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('afdelingen')
    # ### end Alembic commands ###
