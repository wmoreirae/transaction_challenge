import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';

import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

interface ProtoTransaction {
  title: string;
  type: string;
  value: number;
  category: string;
  // balanceCheck: boolean;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    // TODO
    const csvFilePath = path.resolve(uploadConfig.directory, filename);
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({
      from_line: 2,
      rtrim: true,
      ltrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const unprocessedTransactions: ProtoTransaction[] = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;
      const protoTransaction = {
        title,
        type,
        value,
        category,
        // balanceCheck: true,
      };
      unprocessedTransactions.push(protoTransaction);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactions: Transaction[] = [];
    const createTransaction = new CreateTransactionService();
    // eslint-disable-next-line no-restricted-syntax
    for (const protoTransaction of unprocessedTransactions) {
      // eslint-disable-next-line no-await-in-loop
      const createdTransaction = await createTransaction.execute(
        protoTransaction,
      );
      transactions.push(createdTransaction);
    }
    // unprocessedTransactions.forEach(async protoTransaction => {
    //   const createdTransaction = await createTransaction.execute(
    //     protoTransaction,
    //   );
    //   transactions.push(createdTransaction);
    // });

    return transactions;
  }
}

export default ImportTransactionsService;
