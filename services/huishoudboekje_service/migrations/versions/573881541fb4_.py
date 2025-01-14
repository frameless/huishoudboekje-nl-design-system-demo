"""empty message

Revision ID: 573881541fb4
Revises: d517e8fecd5f
Create Date: 2021-08-25 12:06:47.178183

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '573881541fb4'
down_revision = 'd517e8fecd5f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('organisaties', 'kvk_nummer')
    op.drop_column('organisaties', 'vestigingsnummer')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('organisaties', sa.Column('vestigingsnummer', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('organisaties', sa.Column('kvk_nummer', sa.VARCHAR(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
