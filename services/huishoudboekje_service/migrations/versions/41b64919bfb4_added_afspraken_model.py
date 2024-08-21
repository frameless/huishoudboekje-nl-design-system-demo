"""Added afspraken model

Revision ID: 41b64919bfb4
Revises: f53e311ed706
Create Date: 2020-10-21 23:37:47.502860

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '41b64919bfb4'
down_revision = '22ed5017fa8a'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('afspraken',
    # TODO also add rekening relationship
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('gebruiker_id', sa.Integer(), nullable=True),
    sa.Column('beschijving', sa.String(), nullable=True),
    sa.Column('start_datum', sa.Date(), nullable=True),
    sa.Column('eind_datum', sa.Date(), nullable=True),
    sa.Column('aantal_betalingen', sa.Integer(), nullable=True),
    sa.Column('interval', sa.String(), nullable=True),
    sa.Column('tegen_rekening_id', sa.Integer(), nullable=True),
    sa.Column('bedrag', sa.Integer(), nullable=True),
    sa.Column('credit', sa.Boolean(), nullable=True),
    sa.Column('kenmerk', sa.String(), nullable=True),
    sa.Column('actief', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['gebruiker_id'], ['gebruikers.id'], ),
    sa.ForeignKeyConstraint(['tegen_rekening_id'], ['rekeningen.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('afspraken')
