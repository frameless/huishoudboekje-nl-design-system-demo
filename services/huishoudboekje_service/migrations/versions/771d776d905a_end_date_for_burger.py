"""end_date for burger

Revision ID: 771d776d905a
Revises: e96955415ec1
Create Date: 2024-08-15 09:38:39.388371

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '771d776d905a'
down_revision = 'e96955415ec1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    
    with op.batch_alter_table('burgers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('end_date', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    with op.batch_alter_table('burgers', schema=None) as batch_op:
        batch_op.drop_column('end_date')

    # ### end Alembic commands ###
