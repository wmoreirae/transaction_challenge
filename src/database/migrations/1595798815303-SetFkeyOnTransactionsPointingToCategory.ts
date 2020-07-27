import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class SetFkeyOnTransactionsPointingToCategory1595798815303
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'category_id_is_in_categories',
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'transactions',
      'category_id_is_in_categories',
    );
  }
}
