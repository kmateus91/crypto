"""Peewee migrations -- 004_auto.py.

Some examples (model - class or model name)::

    > Model = migrator.orm['model_name']            # Return model in current state by name

    > migrator.sql(sql)                             # Run custom SQL
    > migrator.python(func, *args, **kwargs)        # Run python code
    > migrator.create_model(Model)                  # Create a model (could be used as decorator)
    > migrator.remove_model(model, cascade=True)    # Remove a model
    > migrator.add_fields(model, **fields)          # Add fields to a model
    > migrator.change_fields(model, **fields)       # Change fields
    > migrator.remove_fields(model, *field_names, cascade=True)
    > migrator.rename_field(model, old_field_name, new_field_name)
    > migrator.rename_table(model, new_table_name)
    > migrator.add_index(model, *col_names, unique=False)
    > migrator.drop_index(model, *col_names)
    > migrator.add_not_null(model, *field_names)
    > migrator.drop_not_null(model, *field_names)
    > migrator.add_default(model, field_name, default)

"""

import datetime as dt
import peewee as pw
from decimal import ROUND_HALF_EVEN

try:
    import playhouse.postgres_ext as pw_pext
except ImportError:
    pass

SQL = pw.SQL


def migrate(migrator, database, fake=False, **kwargs):
    """Write your migrations here."""

    @migrator.create_model
    class CurrencyBalance(pw.Model):
        id = pw.AutoField()
        user = pw.ForeignKeyField(backref='currencybalance_set', column_name='user_id', field='id', model=migrator.orm['user'], on_delete='CASCADE')
        currency = pw.ForeignKeyField(backref='currencybalance_set', column_name='currency_id', field='id', model=migrator.orm['currency'], on_delete='CASCADE')
        balance = pw.DecimalField(auto_round=False, decimal_places=10, max_digits=20, rounding=ROUND_HALF_EVEN)

        class Meta:
            table_name = "currency_balance"
            schema = "public"

    @migrator.create_model
    class Transaction(pw.Model):
        id = pw.AutoField()
        user = pw.ForeignKeyField(backref='transactions', column_name='user_id', field='id', model=migrator.orm['user'], on_delete='CASCADE')
        from_currency = pw.ForeignKeyField(backref='transaction_set', column_name='from_currency_id', field='id', model=migrator.orm['currency'], on_delete='CASCADE')
        to_currency = pw.ForeignKeyField(backref='transaction_set', column_name='to_currency_id', field='id', model=migrator.orm['currency'], on_delete='CASCADE')
        from_quantity = pw.DecimalField(auto_round=False, decimal_places=10, max_digits=20, rounding=ROUND_HALF_EVEN)
        to_quantity = pw.DecimalField(auto_round=False, decimal_places=10, max_digits=20, rounding=ROUND_HALF_EVEN)
        created_at = pw.DateTimeField()

        class Meta:
            table_name = "transaction"
            schema = "public"



def rollback(migrator, database, fake=False, **kwargs):
    """Write your rollback migrations here."""

    migrator.remove_model('transaction')

    migrator.remove_model('currency_balance')
