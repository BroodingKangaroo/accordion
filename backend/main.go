package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"accordion-backend/migrations"

	_ "github.com/lib/pq"
)

type Procedure struct {
	ID        int             `json:"id"`
	Title     string          `json:"title"`
	Content   json.RawMessage `json:"content"`
	SortOrder int             `json:"sort_order"`
}

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := migrations.Run(db); err != nil {
		log.Fatalf("failed to run migrations: %s", err)
	}

	http.HandleFunc("/api/procedures", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		rows, err := db.Query("SELECT id, title, content FROM procedures ORDER BY sort_order ASC")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var procedures []Procedure
		for rows.Next() {
			var p Procedure
			if err := rows.Scan(&p.ID, &p.Title, &p.Content); err != nil {
				continue
			}
			procedures = append(procedures, p)
		}
		json.NewEncoder(w).Encode(procedures)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server starting on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
