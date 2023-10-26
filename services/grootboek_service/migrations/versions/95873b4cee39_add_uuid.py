"""add uuid

Revision ID: 95873b4cee39
Revises: 3be8e836362e
Create Date: 2023-05-19 09:56:19.504342

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid as GEN_UUID


# revision identifiers, used by Alembic.
revision = '95873b4cee39'
down_revision = '3be8e836362e'
branch_labels = None
depends_on = None

tablesToEdit = [
    'grootboekrekeningen',
]

tableReferenceEdits = [
    {
        'table_name': 'grootboekrekeningen',
        'new_foreign_key': 'parent_uuid',
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

        content = connection.execute(
            sa.text(f"SELECT id FROM {tableToEdit}")).fetchall()

        for row in content:
            connection.execute(sa.text(
                f"UPDATE {tableToEdit} SET uuid='{str(GEN_UUID.uuid4())}' WHERE id = '{row[0]}'"))

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


def downgrade():
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
