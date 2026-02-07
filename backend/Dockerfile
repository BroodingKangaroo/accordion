FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY backend/go.mod backend/go.sum ./

RUN go mod download

COPY backend/ .

COPY db/ ./db/

RUN go build -o main .

FROM alpine:latest
WORKDIR /root/

COPY --from=builder /app/main .

COPY --from=builder /app/db/migrations ./db/migrations

EXPOSE 8080
CMD ["./main"]