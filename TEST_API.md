# Test Public Flags API

## Endpoint
```
POST http://localhost:3000/api/v1/flags
```

## Test Request (PowerShell)

```powershell
$headers = @{
    "x-api-key" = "fsk_server_133e61fa671d3e927a1eba415220a284"
    "Content-Type" = "application/json"
}

$body = @{
    user = @{
        id = "user-123"
        attributes = @{
            role = "admin"
            country = "TR"
        }
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/flags" -Method POST -Headers $headers -Body $body
```

## Test Request (cURL)

```bash
curl -X POST http://localhost:3000/api/v1/flags \
  -H "x-api-key: fsk_server_133e61fa671d3e927a1eba415220a284" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "id": "user-123",
      "attributes": {
        "role": "admin"
        "country": "TR"
      }
    }
  }'
```

## Expected Response

```json
{
  "flags": {
    "gursel-tekin": {
      "enabled": false,
      "value": false,
      "type": "json"
    }
  },
  "user": {
    "id": "user-123",
    "attributes": {
      "role": "admin",
      "country": "TR"
    }
  }
}
```

## Test Health Check

```bash
GET http://localhost:3000/api/v1/flags
```

Response:
```json
{
  "service": "Flagship Feature Flags API",
  "version": "1.0.0",
  "status": "operational"
}
```

## Error Responses

**401 Unauthorized** (invalid API key):
```json
{
  "error": "Invalid or missing API key"
}
```

**400 Bad Request** (invalid body):
```json
{
  "error": "Invalid request body",
  "details": {...}
}
```
