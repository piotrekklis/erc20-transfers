# erc20-transfers

### Requirements:

1. PostgreSQL db:
```
docker run --name container-name -e POSTGRES_USER=your-db-username -e POSTGRES_DB=your-db-name -e POSTGRES_PASSWORD=your-db-password -p 6006:5432 -d postgres
```
2. Access to RPC endpoint (eg. Alchemy)
3. .env file (template included)
