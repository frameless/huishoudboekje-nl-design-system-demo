"""Changed burger datamodel

Revision ID: b25eb2556ad3
Revises: 79e487a2dcc3
Create Date: 2020-10-06 12:57:30.605177

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b25eb2556ad3'
down_revision = '79e487a2dcc3'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('burgers', sa.Column('achternaam', sa.String(), nullable=True))
    op.execute('UPDATE burgers SET achternaam = geslachtsnaam;')
    op.drop_column('burgers', 'voorvoegsel')
    op.drop_column('burgers', 'huistoevoeging')
    op.drop_column('burgers', 'huisletter')
    op.drop_column('burgers', 'geslachtsnaam')
    op.drop_column('burgers', 'huisnummer')
    op.add_column('burgers', sa.Column('huisnummer', sa.String(), nullable=True))


def downgrade():
    op.add_column('burgers', sa.Column('geslachtsnaam', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('burgers', sa.Column('huisletter', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('burgers', sa.Column('huistoevoeging', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('burgers', sa.Column('voorvoegsel', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.execute('UPDATE burgers SET geslachtsnaam = achternaam;')
    op.drop_column('burgers', 'achternaam')
    op.drop_column('burgers', 'huisnummer')
    op.add_column('burgers', sa.Column('huisnummer', sa.Integer(), nullable=True))