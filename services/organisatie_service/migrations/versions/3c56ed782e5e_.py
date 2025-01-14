"""empty message

Revision ID: 3c56ed782e5e
Revises: c0ed6bb7c92d
Create Date: 2021-09-03 13:31:00.340183

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c56ed782e5e'
down_revision = 'c0ed6bb7c92d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('postadressen',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('postadres_service_id', sa.String(), nullable=False),
    sa.Column('afdeling_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['afdeling_id'], ['afdelingen.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.alter_column('afdelingen', 'organisatie_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.create_foreign_key(None, 'afdelingen', 'organisaties', ['organisatie_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'afdelingen', type_='foreignkey')
    op.alter_column('afdelingen', 'organisatie_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.drop_table('postadressen')
    # ### end Alembic commands ###
