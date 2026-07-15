# Local API Quickstart

This quickstart is the shortest path to confirm that the backend API is healthy on a local machine.

## 1. Start PostgreSQL

If you use Docker for the database only:

```powershell
docker compose up db -d
```

If you run PostgreSQL directly on your machine, make sure your local service is running and matches `backend\.env`.

## 2. Start the backend

```powershell
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload
```

If the virtual environment does not exist yet, follow [`BOOTSTRAP.md`](BOOTSTRAP.md) first.

## 3. Check the health endpoint

Open another PowerShell window in the repo root or any directory and run:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Expected response:

```text
status
------
ok
```

## 4. Create or log in a player

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8000/auth/login `
  -ContentType "application/json" `
  -Body '{"user_id":"quickstart-player"}'
```

Expected result:

- A JSON payload containing `id`, `user_id`, and `created_at`
- `user_id` should equal `quickstart-player`

## 5. Save one sample result

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8000/games/results `
  -ContentType "application/json" `
  -Body '{"user_id":"quickstart-player","level":1,"target_sequence":[1],"player_sequence":[1],"is_success":true,"score":100}'
```

Expected result:

- A JSON payload with the saved result
- `level` should be `1`
- `is_success` should be `true`

## 6. Read the player history

```powershell
Invoke-RestMethod "http://localhost:8000/games/me/results?user_id=quickstart-player"
```

Expected result:

- A JSON payload containing `items`
- At least one history entry should be present after the sample save

## Troubleshooting

- If `health` fails, verify that `uvicorn` is still running and listening on port `8000`.
- If login or save requests fail with DB errors, confirm PostgreSQL is running and `DATABASE_URL` is correct in `backend\.env`.
- If PowerShell blocks multiline commands, run the same request as a single line.
