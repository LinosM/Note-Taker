const fs = require('fs');

module.exports = app => {

    fs.readFile("./db/db.json","utf8", (err, data) => {

        if (err) throw err;
        var notes = JSON.parse(data);

        // API that returns all notes in the db
        app.get('/api/notes', (req, res) => {
            res.json(notes);
        });

        // API that returns only notes by ID
        app.get('/api/notes/:id', (req, res) => {
            const chosen = req.params.id;
            console.log(chosen);
            for (let i = 0; i < notes.length; i++) {
                if (chosen === notes[i].id) {
                    return res.json(notes[i]);
                }
            }
            return res.json(false);
        });

        // POST route that receieves a new note and pushes it to the db
        app.post('/api/notes', (req, res) => {
            const newNote = req.body;

            console.log(newNote);
            notes.push(newNote);
            pushDB();
            res.json(true)
        });

        // DELETE route that removes selected note by ID and remakes the db
        app.delete("/api/notes/:id", (req, res) => {
            notes.splice(req.params.id, 1);
            pushDB();
            res.json(true)
        });

        const pushDB = () => {

            // Assigns id to notes based on array index number
            for (let i = 0; i < notes.length; i++) {
                notes[i].id = i.toString();;
            }

            // Updates json database with proper formatting
            fs.writeFile("./db/db.json",JSON.stringify(notes, null, "\t"),err => {
                if (err) throw err;
                return true;
            });
        }
    });
}