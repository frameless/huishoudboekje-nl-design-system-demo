"""empty message

Revision ID: 0562ae120659
Revises: 553efdf54a1c
Create Date: 2021-08-11 14:56:10.087750

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0562ae120659'
down_revision = '553efdf54a1c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'burgers', ['bsn'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'burgers', type_='unique')
    # ### end Alembic commands ###