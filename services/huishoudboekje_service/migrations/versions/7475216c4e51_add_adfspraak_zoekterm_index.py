"""add adfspraak zoektermen index

Revision ID: 7475216c4e51
Revises: bb34d4687553
Create Date: 2021-03-12 13:04:28.741820

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '7475216c4e51'
down_revision = 'bb34d4687553'
branch_labels = None
depends_on = None

t_afspraken = sa.Table(
    'afspraken',
    sa.MetaData(),
    sa.Column('kenmerk', sa.String(), nullable=True),
    sa.Column('zoektermen', sa.ARRAY(sa.String), nullable=True),
)


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('afspraken', sa.Column('zoektermen', sa.ARRAY(sa.String()), nullable=True))
    op.create_index(op.f('ix_afspraken_organisatie_id'), 'afspraken', ['organisatie_id'], unique=False)
    op.create_index(op.f('ix_afspraken_tegen_rekening_id'), 'afspraken', ['tegen_rekening_id'], unique=False)
    op.create_index('ix_afspraken_zoektermen', 'afspraken', ['zoektermen'], unique=False, postgresql_using='gin')

    connection = op.get_bind()
    connection.execute(
        t_afspraken.update().where(t_afspraken.c.kenmerk != "").values(
            {t_afspraken.c.zoektermen[1]: t_afspraken.c.kenmerk})
    )

    op.drop_column('afspraken', 'kenmerk')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('afspraken', sa.Column('kenmerk', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_index('ix_afspraken_zoektermen', table_name='afspraken')
    op.drop_index(op.f('ix_afspraken_tegen_rekening_id'), table_name='afspraken')
    op.drop_index(op.f('ix_afspraken_organisatie_id'), table_name='afspraken')
    connection = op.get_bind()
    connection.execute(
        t_afspraken.update().where(t_afspraken.c.zoektermen.isnot(None)).values(kenmerk=t_afspraken.c.zoektermen[1])
    )

    op.drop_column('afspraken', 'zoektermen')
    # ### end Alembic commands ###
