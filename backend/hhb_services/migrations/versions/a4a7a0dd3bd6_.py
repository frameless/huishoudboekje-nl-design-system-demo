"""empty message

Revision ID: a4a7a0dd3bd6
Revises: 
Create Date: 2020-09-28 18:26:46.071365

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.schema import Sequence, CreateSequence

# revision identifiers, used by Alembic.
revision = 'a4a7a0dd3bd6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('burgers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('burgerservicenummer', sa.String(), nullable=True),
    sa.Column('voornamen', sa.String(), nullable=True),
    sa.Column('voorletters', sa.String(), nullable=True),
    sa.Column('voorvoegsel', sa.String(), nullable=True),
    sa.Column('geslachtsnaam', sa.String(), nullable=True),
    sa.Column('straatnaam', sa.String(), nullable=True),
    sa.Column('huisnummer', sa.Integer(), nullable=True),
    sa.Column('huisletter', sa.String(), nullable=True),
    sa.Column('huistoevoeging', sa.String(), nullable=True),
    sa.Column('postcode', sa.String(), nullable=True),
    sa.Column('woonplaatsnaam', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('gebruikers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('burger_id', sa.Integer(), nullable=True),
    sa.Column('telefoon', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('geboortedatum', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['burger_id'], ['burgers.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('gebruikers')
    op.drop_table('burgers')
    # ### end Alembic commands ###
