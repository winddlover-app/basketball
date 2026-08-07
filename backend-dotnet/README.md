# Basketball Camp .NET Backend

This folder contains the .NET C# API backend for the Basketball Camp product.

## Stack

- .NET 10 Minimal API
- C#
- MySQL
- MySqlConnector
- OpenAPI

## Local commands

```powershell
cd backend-dotnet\BasketballCamp.Api
dotnet restore
dotnet build
dotnet run --urls http://localhost:5088
```

OpenAPI is available at:

```text
http://localhost:5088/openapi/v1.json
```

## MySQL setup

Create the database from the project SQL, then keep local credentials in `appsettings.Development.json` or environment variables. Do not commit real passwords.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=basketball_camp;User=root;Password=your-local-password;"
  }
}
```
