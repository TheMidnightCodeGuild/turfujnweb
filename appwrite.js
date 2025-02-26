import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67b6cad500181f4b1636');

export const account = new Account(client);
export const databases = new Databases(client);
export { ID } from 'appwrite';
