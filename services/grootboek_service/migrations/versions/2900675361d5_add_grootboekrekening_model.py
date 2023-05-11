"""Add grootboekrekening model

Revision ID: 2900675361d5
Revises: 
Create Date: 2020-11-16 15:56:25.981952

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import orm

# revision identifiers, used by Alembic.
revision = '2900675361d5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    gb_table = op.create_table('grootboekrekeningen',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('referentie', sa.String(), nullable=True),
    sa.Column('naam', sa.String(), nullable=True),
    sa.Column('omschijving_kort', sa.String(), nullable=True),
    sa.Column('omschijving_lang', sa.String(), nullable=True),
    sa.Column('parent_id', sa.String(), nullable=True),
    sa.Column('debet', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['parent_id'], ['grootboekrekeningen.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('grootboekrekeningen')
