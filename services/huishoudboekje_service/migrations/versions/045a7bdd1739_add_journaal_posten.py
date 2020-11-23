"""Add journaal posten

Revision ID: 045a7bdd1739
Revises: 3a2fa07ad645
Create Date: 2020-11-23 12:28:27.198524

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '045a7bdd1739'
down_revision = '3a2fa07ad645'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('journaalposten',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('afspraak_id', sa.Integer(), nullable=True),
    sa.Column('transaction_id', sa.Integer(), nullable=True),
    sa.Column('grootboekrekening_id', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['afspraak_id'], ['afspraken.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('journaalposten')
    # ### end Alembic commands ###
