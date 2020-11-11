"""added customer statement message table

Revision ID: 52dd4e1665ec
Revises: 
Create Date: 2020-11-04 14:10:31.253171

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '52dd4e1665ec'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('customer_statement_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('upload_date', sa.DateTime(), nullable=False),
    sa.Column('raw_data', sa.String(), nullable=False),
    sa.Column('transaction_reference_number', sa.String(), nullable=True),
    sa.Column('related_reference', sa.String(), nullable=True),
    sa.Column('account_identification', sa.String(), nullable=True),
    sa.Column('sequence_number', sa.String(), nullable=True),
    sa.Column('opening_balance', sa.Integer(), nullable=True),
    sa.Column('closing_balance', sa.Integer(), nullable=True),
    sa.Column('closing_available_funds', sa.Integer(), nullable=True),
    sa.Column('forward_available_balance', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('customer_statement_messages')
    # ### end Alembic commands ###