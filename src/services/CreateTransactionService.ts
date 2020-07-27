// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository, getConnection } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
  // balanceCheck: boolean;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: // balanceCheck,
  Request): Promise<Transaction> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    // Check value is greater than zero
    if (!value || value <= 0) {
      throw new AppError('The transaction value must be greater than zero');
    }

    // Check type matches the possibilities
    if (!type || !['income', 'outcome'].includes(type)) {
      throw new AppError(
        'The type of the transaction must be either income or outcome',
      );
    }

    // Check for title
    if (!title) {
      throw new AppError('A transaction needs a title');
    }

    // Check for category
    if (!category) {
      throw new AppError('A transaction needs a category');
    }

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();
      if (balance.total - value < 0) {
        throw new AppError(
          'Not enough funds to create the required transaction',
        );
      }
    }

    const transaction = await getConnection().transaction(
      'SERIALIZABLE',
      async (entityManager): Promise<Transaction> => {
        //
        let categoryInstance = await entityManager.findOne(Category, {
          where: { title: category },
        });

        if (!categoryInstance) {
          categoryInstance = await entityManager.save(
            categoryRepository.create({ title: category }),
          );
        }

        const transactionInstance = transactionRepository.create({
          title,
          type,
          value,
          category: categoryInstance,
        });

        const t_transaction = await entityManager.save(transactionInstance);

        return t_transaction;
      },
    );

    return transaction;
  }
}

export default CreateTransactionService;
