const e = require('express');
const fs = require('fs');

module.exports = app => {

    fs.readFile("./db/db.json","utf8", (err, data) => {

        if (err) throw err;
        var notes = JSON.parse(data);

        app.get('/api/notes', (req, res) => {
            res.json(notes);
        });

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

        app.post('/api/notes', (req, res) => {
            const newNote = req.body;

            console.log(newNote);
            notes.push(newNote);
            pushDB();
            res.json(true)
        });

        app.delete("/api/notes/:id", (req, res) => {
            notes.splice(req.params.id, 1);
            pushDB();
            res.json(true)
        });

        const pushDB = () => {

            for (let i = 0; i < notes.length; i++) {
                notes[i].id = i.toString();;
            }

            fs.writeFile("./db/db.json",JSON.stringify(notes, null, "\t"),err => {
                if (err) throw err;
                return true;
            });
        }
    });
}