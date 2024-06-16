import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from '../model/schema';
import Vocabs from '../model/Vocabs';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error(error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [Vocabs],
});

