"""renamed woonplaatsnaam and removed weergave_naam

Revision ID: abdbb3479921
Revises: 1317cfeb179a
Create Date: 2020-10-19 14:27:53.677842

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'abdbb3479921'
down_revision = '1317cfeb179a'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('gebruikers', 'woonplaatsnaam', new_column_name='plaatsnaam')
    op.drop_column('gebruikers', 'weergave_naam')


def downgrade():
    op.add_column('gebruikers', sa.Column('weergave_naam', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.alter_column('gebruikers', 'plaatsnaam', new_column_name='woonplaatsnaam')
