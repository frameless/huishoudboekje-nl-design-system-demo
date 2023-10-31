"""add uuid to table huishouden

Revision ID: eb3c313bdb68
Revises: 1fd976dba062
Create Date: 2023-05-15 12:27:47.538276

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid as GEN_UUID


# revision identifiers, used by Alembic.
revision = 'eb3c313bdb68'
down_revision = '922db8f71c2a'
branch_labels = None
depends_on = None

tablesToEdit = [
    'afdelingen',
    'afspraken',
    'burgers',
    'export',
    'huishoudens',
    'journaalposten',
    'overschrijvingen',
    'rekeningen',
    'rubrieken',
    'saldos',
]

tableReferenceEdits = [
    {
        'table_name': 'afspraken',
        'new_foreign_key': 'rubriek_uuid',
    },
    {
        'table_name': 'afspraken',
        'new_foreign_key': 'burger_uuid',
    },
    {
        'table_name': 'afspraken',
        'new_foreign_key': 'afdeling_uuid',
    },
    {
        'table_name': 'afspraken',
        'new_foreign_key': 'tegen_rekening_uuid',
    },
    {
        'table_name': 'rekening_burger',
        'new_foreign_key': 'burger_uuid',
    },
    {
        'table_name': 'rekening_burger',
        'new_foreign_key': 'rekening_uuid',
    },
    {
        'table_name': 'rekening_afdeling',
        'new_foreign_key': 'afdeling_uuid',
    },
    {
        'table_name': 'rekening_afdeling',
        'new_foreign_key': 'rekening_uuid',
    },
    {
        'table_name': 'burgers',
        'new_foreign_key': 'huishouden_uuid',
    },
    {
        'table_name': 'saldos',
        'new_foreign_key': 'burger_uuid',
    },
    {
        'table_name': 'overschrijvingen',
        'new_foreign_key': 'afspraak_uuid',
    },
    {
        'table_name': 'overschrijvingen',
        'new_foreign_key': 'export_uuid',
    },
    {
        'table_name': 'journaalposten',
        'new_foreign_key': 'afspraak_uuid',
    },
]

tableAlters = [
    {
        'table_name': 'overschrijvingen',
        'new_column_name': 'bank_transaction_uuid',
    },
    {
        'table_name': 'afdelingen',
        'new_column_name': 'organisatie_uuid',
    },
    {
        'table_name': 'afspraken',
        'new_column_name': 'postadres_uuid',
    },
    {
        'table_name': 'afspraken',
        'new_column_name': 'alarm_uuid',
    },
    {
        'table_name': 'journaalposten',
        'new_column_name': 'transaction_uuid',
    },
    {
        'table_name': 'journaalposten',
        'new_column_name': 'grootboekrekening_uuid',
    },
    {
        'table_name': 'rubrieken',
        'new_column_name': 'grootboekrekening_uuid',
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

        content = connection.execute(sa.text(
            f"SELECT id FROM {tableToEdit}")).fetchall()

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
                UUID(),
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
