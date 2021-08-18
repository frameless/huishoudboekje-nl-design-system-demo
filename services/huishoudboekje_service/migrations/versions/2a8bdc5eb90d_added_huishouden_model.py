"""added huishouden model

Revision ID: 2a8bdc5eb90d
Revises: b516f0abf35d
Create Date: 2021-06-23 12:08:02.220283

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column

# revision identifiers, used by Alembic.
revision = '2a8bdc5eb90d'
down_revision = 'b516f0abf35d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('huishoudens',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### First add this column with nullable, then update all
    # ### values to default 0, and then alter to non-nullable
    # ### Ref https://stackoverflow.com/questions/33705697/alembic-integrityerror-column-contains-null-values-when-adding-non-nullable
    op.add_column('burgers', sa.Column('huishouden_id', sa.Integer(), nullable=True))
    huishouden_id = table('burgers', column('huishouden_id'))
    op.execute(huishouden_id.update().values(huishouden_id=0))
    op.alter_column('burgers', 'huishouden_id', nullable=False)
    op.create_foreign_key(None, 'burgers', 'huishoudens', ['huishouden_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'burgers', type_='foreignkey')
    op.drop_column('burgers', 'huishouden_id')
    op.drop_table('huishoudens')
    # ### end Alembic commands ###
