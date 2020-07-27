import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const ic = this.find({ where: { type: 'income' } });
    const oc = this.find({ where: { type: 'outcome' } });

    const [incomes, outcomes] = await Promise.all([ic, oc]);

    const incomeValue = incomes
      .map(transaction => transaction.value)
      .reduce((previous, current) => previous + current, 0);

    const outcomeValue = outcomes
      .map(transaction => transaction.value)
      .reduce((previous, current) => previous + current, 0);

    const total = incomeValue - outcomeValue;

    return { income: incomeValue, outcome: outcomeValue, total };
  }
}

export default TransactionsRepository;
