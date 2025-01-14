"""add export table

Revision ID: 132fb7c5671c
Revises: 208f2769a0bc
Create Date: 2020-12-08 15:12:58.191757

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '132fb7c5671c'
down_revision = '208f2769a0bc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('export',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('naam', sa.String(), nullable=False),
    sa.Column('timestamp', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_export_naam'), 'export', ['naam'], unique=True)
    op.create_index(op.f('ix_export_timestamp'), 'export', ['timestamp'], unique=False)
    op.create_foreign_key('overschrijvingen_export_id_fkey', 'overschrijvingen', 'export', ['export_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('overschrijvingen_export_id_fkey', 'overschrijvingen', type_='foreignkey')
    op.drop_index(op.f('ix_export_timestamp'), table_name='export')
    op.drop_index(op.f('ix_export_naam'), table_name='export')
    op.drop_table('export')
    # ### end Alembic commands ###
