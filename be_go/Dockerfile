FROM golang:1.23.2-alpine3.20

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o postgres-capstone

EXPOSE 8080

CMD ["./postgres-capstone"]
