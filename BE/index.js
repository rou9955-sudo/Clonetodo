const express = require("express");
const { Client } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

async function getClient() {
    const client = new Client("postgresql://neondb_owner:npg_BuJVWqbT2aP5@ep-aged-shape-b5zjilnu-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
    await client.connect();
    return client;
}

app.post("/add", async function (req, res) {
    try {
        console.log(req.body);

        const client = await getClient();
        const note = req.body;

        const addNoteQuery =
            "insert into notes(id, title, content) values($1, $2, $3)";
        const values = [note.id, note.title, note.content];

        await client.query(addNoteQuery, values);

        return res.json({
            msg: "note added successfully",
        });

    } catch (error) {
        console.error(error);
        return res.json({
            msg: "internal server error"
        });
    }
});

app.get("/notes", async function (req, res) {
    try {
        const client = await getClient();
        const selectQuery = "select * from notes";

        const responsive = await client.query(selectQuery);

        return res.json({
            data: responsive.rows, // Fixed from .row to .rows
        });
    } catch (error) {
        console.error(error);
        return res.json({
            data: "internal server error"
        });
    }
});

app.listen(8080, function () {
    console.log("app working");
});