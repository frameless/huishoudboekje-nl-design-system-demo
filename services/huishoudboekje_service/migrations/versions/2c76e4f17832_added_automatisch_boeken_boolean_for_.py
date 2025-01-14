"""added automatisch_boeken boolean for afspraak

Revision ID: 2c76e4f17832
Revises: 3d83f1e7af50
Create Date: 2021-02-05 15:28:55.588186

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2c76e4f17832'
down_revision = '3d83f1e7af50'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('afspraken', sa.Column('automatisch_boeken', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('afspraken', 'automatisch_boeken')
    # ### end Alembic commands ###
