"""empty message

Revision ID: f99d4fa94545
Revises: 3051f9101b6d
Create Date: 2021-08-03 10:15:08.718244

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f99d4fa94545'
down_revision = '3051f9101b6d'
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
