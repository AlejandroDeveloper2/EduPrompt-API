export interface IDBConnection {
  connectToDatabase: () => Promise<void>;
}
