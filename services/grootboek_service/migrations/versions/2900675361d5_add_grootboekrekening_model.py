"""Add grootboekrekening model

Revision ID: 2900675361d5
Revises: 
Create Date: 2020-11-16 15:56:25.981952

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import orm

# revision identifiers, used by Alembic.
revision = '2900675361d5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    gb_table = op.create_table('grootboekrekeningen',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('referentie', sa.String(), nullable=True),
    sa.Column('naam', sa.String(), nullable=True),
    sa.Column('omschijving_kort', sa.String(), nullable=True),
    sa.Column('omschijving_lang', sa.String(), nullable=True),
    sa.Column('parent_id', sa.String(), nullable=True),
    sa.Column('debet', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['parent_id'], ['grootboekrekeningen.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.bulk_insert(gb_table, get_grootboekrekenignen())

def downgrade():
    op.drop_table('grootboekrekeningen')

def get_grootboekrekenignen():
    raw_data = {}
    with open("data/RGS-3.2-6-december-2019.csv", "r") as fh:
        for line in fh.readlines()[1:]:
            linedata = [l[1:-1] for l in line.strip().split(",")]
            if linedata[3]:
                reccord = {
                    "id": linedata[0],
                    "referentie": linedata[3],
                    "naam": linedata[4],
                    "omschijving_kort": linedata[4],
                    "omschijving_lang": linedata[5],
                    "debet": linedata[6] == "D"
                }
                raw_data[reccord["id"]] = reccord
    
    # Perform parent lookup in seperate loop so we have a populated lookup dict
    insert_data = []
    for reccord_id, reccord in raw_data.items():
        reccord["parent_id"] = recursive_find_parent(reccord_id, raw_data)
        insert_data.append(reccord)
        
    return insert_data

def recursive_find_parent(name, parent_list):
    name = name[:-1]
    if len(name) == 0:
        return None
    if name in parent_list:
        return parent_list[name]["id"]
    return recursive_find_parent(name, parent_list)
