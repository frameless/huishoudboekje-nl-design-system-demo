"""empty message

Revision ID: 4a5c676c6918
Revises: 6612f2dd5c5a
Create Date: 2021-08-25 12:07:20.137036

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4a5c676c6918'
down_revision = '6612f2dd5c5a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('organisaties', 'straatnaam')
    op.drop_column('organisaties', 'postcode')
    op.drop_column('organisaties', 'plaatsnaam')
    op.drop_column('organisaties', 'huisnummer')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('organisaties', sa.Column('huisnummer', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('organisaties', sa.Column('plaatsnaam', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('organisaties', sa.Column('postcode', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('organisaties', sa.Column('straatnaam', sa.VARCHAR(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
