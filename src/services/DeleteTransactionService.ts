// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (id === '') {
      throw new AppError('Invalid id format');
    }

    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Not found!', 404);
    }

    if (transaction.type === 'income') {
      const balance = await transactionRepository.getBalance();
      if (balance.total - transaction.value < 0) {
        throw new AppError(
          'Deleting this transaction would result in an invalid server state',
          409,
        );
      }
    }

    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
