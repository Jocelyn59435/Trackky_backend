import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_info', (table) => {
    table.increments('id');
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('product', (table) => {
    table.increments('id');
    table.string('product_name').notNullable();
    table.string('product_link').notNullable();
    table.string('product_image_src').notNullable();
    table.string('platform').notNullable();
    table.string('status').notNullable();
    table
      .integer('user_id')
      .references('user_info.id')
      .notNullable()
      .onDelete('CASCADE') // If User PK is changed, update FK as well.
      .onUpdate('CASCADE'); // If User is deleted, delete Product as well.
    table.float('original_price').notNullable();
    table.float('current_price');
    table.float('desired_price').notNullable();
    table.timestamp('price_update_time');
    table.timestamp('email_sent_time');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  //   why dropForeign?
  await knex.schema.alterTable('product', (table) => {
    table.dropForeign(['user_id']);
  });
  await knex.schema.dropTable('user_info');
  await knex.schema.dropTable('product');
}
