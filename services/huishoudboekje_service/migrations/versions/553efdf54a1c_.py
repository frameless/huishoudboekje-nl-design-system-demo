"""empty message

Revision ID: 553efdf54a1c
Revises: 724865f799bc
Create Date: 2021-08-04 08:20:32.057705

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '553efdf54a1c'
down_revision = '724865f799bc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('organisaties', 'weergave_naam')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('organisaties', sa.Column('weergave_naam', sa.VARCHAR(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
