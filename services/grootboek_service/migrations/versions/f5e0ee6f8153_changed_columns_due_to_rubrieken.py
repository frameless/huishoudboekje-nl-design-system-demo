"""changed columns due to rubrieken

Revision ID: f5e0ee6f8153
Revises: 2900675361d5
Create Date: 2020-11-20 14:05:03.239892

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f5e0ee6f8153'
down_revision = '2900675361d5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('grootboekrekeningen', sa.Column('omschrijving', sa.String(), nullable=True))
    op.execute("UPDATE grootboekrekeningen SET omschrijving = omschijving_lang")
    op.drop_column('grootboekrekeningen', 'omschijving_kort')
    op.drop_column('grootboekrekeningen', 'omschijving_lang')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('grootboekrekeningen', sa.Column('omschijving_lang', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('grootboekrekeningen', sa.Column('omschijving_kort', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.execute("UPDATE grootboekrekeningen SET omschijving_lang = omschrijving")
    op.execute("UPDATE grootboekrekeningen SET omschijving_kort = naam")
    op.drop_column('grootboekrekeningen', 'omschrijving')
    # ### end Alembic commands ###
