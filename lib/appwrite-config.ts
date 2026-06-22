import { Client, Databases, Query } from 'appwrite';

import { config } from './config';

let databases: Databases | null = null;

function getDatabases(): Databases {
  if (!databases) {
    const client = new Client();
    client
      .setEndpoint(config.appwrite.endpoint)
      .setProject(config.appwrite.projectId);
    databases = new Databases(client);
  }
  return databases;
}

export { Query, getDatabases };
