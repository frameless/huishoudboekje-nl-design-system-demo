"""afspraak table update

Revision ID: cd505e0d103b
Revises: 93000a3eaf47
Create Date: 2021-04-14 13:10:39.970556

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cd505e0d103b'
down_revision = '93000a3eaf47'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('afspraken', 'start_datum', new_column_name='valid_from')
    op.alter_column('afspraken', 'eind_datum', new_column_name='valid_through')
    op.drop_column('afspraken', 'automatisch_boeken')
    op.drop_column('afspraken', 'actief')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('afspraken', sa.Column('actief', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.add_column('afspraken', sa.Column('automatisch_boeken', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.alter_column('afspraken', 'valid_from', new_column_name='start_datum')
    op.alter_column('afspraken', 'valid_through', new_column_name='eind_datum')
    # ### end Alembic commands ###
