"""add uuid

Revision ID: ade1e4c81436
Revises: bca9855b85cf
Create Date: 2023-05-19 10:22:21.007353

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid as GEN_UUID

# revision identifiers, used by Alembic.
revision = 'ade1e4c81436'
down_revision = 'bca9855b85cf'
branch_labels = None
depends_on = None

tablesToEdit = [
    'afdelingen',
    'organisaties'
]

tableReferenceEdits = [
    {
        'table_name': 'afdelingen',
        'new_foreign_key': 'organisatie_uuid',
    },
]

tableAlters = [
    {
        'table_name': 'afdelingen',
        'new_column_name': 'postadressen_uuids',
    },
    {
        'table_name': 'afdelingen',
        'new_column_name': 'rekeningen_uuids',
    },
]


def upgrade():
    connection = op.get_bind()

    for tableToEdit in tablesToEdit:
        op.add_column(
            tableToEdit,
            sa.Column(
                'uuid',
                UUID(),
                unique=True,
                index=True
            )
        )

        content = connection.execute(sa.text(f"SELECT id FROM {tableToEdit}"))

        for row in content:
            connection.execute(sa.text(
                f"UPDATE {tableToEdit} SET uuid='{str(GEN_UUID.uuid4())}' WHERE id = {row['id']}"))

        op.alter_column(tableToEdit, 'uuid', nullable=False, server_default=sa.text(
            "'{}'".format(str(GEN_UUID.uuid4()))))

    for tableReferenceEdit in tableReferenceEdits:
        table_name = tableReferenceEdit['table_name']
        new_foreign_key = tableReferenceEdit['new_foreign_key']

        op.add_column(
            table_name,
            sa.Column(
                new_foreign_key,
                UUID(),
                nullable=True
            )
        )

    for tableAlter in tableAlters:
        table_name = tableAlter['table_name']
        new_column_name = tableAlter['new_column_name']

        op.add_column(
            table_name,
            sa.Column(
                new_column_name,
                sa.ARRAY(UUID()),
                nullable=True
            )
        )


def downgrade():
    for tableAlter in tableAlters:
        table_name = tableAlter['table_name']
        new_column_name = tableAlter['new_column_name']

        op.drop_column(table_name=table_name, column_name=new_column_name)

    for tableReferenceEdit in tableReferenceEdits:
        table_name = tableReferenceEdit['table_name']
        new_foreign_key = tableReferenceEdit['new_foreign_key']

        op.drop_column(
            table_name,
            new_foreign_key
        )

    for tableToEdit in tablesToEdit:
        op.drop_column(
            tableToEdit,
            'uuid'
        )
