"""add saldo_alarm

Revision ID: e96955415ec1
Revises: eb3c313bdb68
Create Date: 2024-05-28 13:22:17.660209

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e96955415ec1'
down_revision = 'eb3c313bdb68'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('burgers', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('saldo_alarm', sa.Boolean(), nullable=False, server_default='True'))
    # ### end Alembic commands ###


def downgrade():
    with op.batch_alter_table('burgers', schema=None) as batch_op:
        batch_op.drop_column('saldo_alarm')
    # ### end Alembic commands ###
