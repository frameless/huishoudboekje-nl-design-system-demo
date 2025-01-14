"""Add rubrieken

Revision ID: 43baa9e8e9fc
Revises: 8b51c695f3c2
Create Date: 2020-11-23 12:46:38.775847

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '43baa9e8e9fc'
down_revision = '8b51c695f3c2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('rubrieken',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('naam', sa.String(), nullable=True),
    sa.Column('grootboekrekening_id', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('afspraken', sa.Column('rubriek_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'afspraken', 'rubrieken', ['rubriek_id'], ['id'])
    op.drop_column('afspraken', 'grootboekrekening_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('afspraken', sa.Column('grootboekrekening_id', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'afspraken', type_='foreignkey')
    op.drop_column('afspraken', 'rubriek_id')
    op.drop_table('rubrieken')
    # ### end Alembic commands ###
