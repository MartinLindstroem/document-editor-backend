# document-editor-backend

[![Build Status](https://app.travis-ci.com/MartinLindstroem/document-editor-backend.svg?branch=main)](https://app.travis-ci.com/MartinLindstroem/document-editor-backend)

This is a REST-API for creating and saving text-documents in a mongoDB database.

## Installation
1. Clone this repo
2. cd into the directory
```console
cd document-editor-backend
```
3. Install the dependencies
```
npm install
```
4. create a `config.json` file in the `/db` folder and add the following
```json
{
    "username": "your-username",
    "password": "your-password"
}
```
5. Change the `dsn` and `collectionName` variables in `database.js` to your own.
6. run `npm start` to start the server or `npm run watch` to start it with hot reload.

## Routes
The API has a couple of different routes.

### GET `/getAll`

Gets all of the documents in the database

### POST `/insert`

Creates a new document in the database

The following body is required
```json
{
    name: "<name of document>",
    content: "<text content>"
}
```

### PUT `/update`

Updates an already existing document in the database.

The following body is required
```json
{
    _id: "<id of document>",
    name: "<name of document>"
    content: "<content of document>"
}
```
