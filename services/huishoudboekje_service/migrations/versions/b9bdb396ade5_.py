"""empty message

Revision ID: b9bdb396ade5
Revises: fa782fdde1a6
Create Date: 2021-09-09 10:42:43.335593

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b9bdb396ade5'
down_revision = 'fa782fdde1a6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('afspraken', sa.Column('afdeling_id', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('afspraken', 'afdeling_id')
    # ### end Alembic commands ###
