import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.SERVER_HOST_NAME,
    user: process.env.SERVER_HOST_USERNAME,
    password: process.env.SERVER_HOST_PASSWORD,
    database: process.env.SERVER_HOST_DATABASE,
});

// ? Tests if the input/payload met regex requirements
const REGEX = /^[a-zA-Z0-9_-\s]{3,}$/;
const validateInput = (payload, response, next) => {
    const { todo } = !payload?.body ? payload?.params : payload.body;
    if (REGEX.test(todo)) {
        next();
    } else {
        response.status(400).send({ message: "No Empty spaces, No Special Characters allowed! Only Letters and Numbers, hyphens(-), underscores(_)" });
    }
}
// ? use to validate if the given id is valid and can be updated or deleted
const validToDoID = (payload, response, next) => {
    const { todo_id } = payload?.params;
    const query_validate_todo_id = "SELECT row_id FROM todo_tbl WHERE row_id = ?";
    db.query(query_validate_todo_id, [todo_id], (err_valid, valid) => {
        if (err_valid) response.status(500).send({ error: err_valid });
        if (valid.length !== 0) {
            next();
        } else {
            response.status(404).send({ message: "Invalid ID" });
        }
    })
}


//* Create
app.post('/todo_list/create', validateInput, (payload, response) => {
    const { todo } = payload?.body;
    const query_add_todo = "INSERT INTO todo_tbl(todo) VALUES(?)";
    db.query(query_add_todo, [todo], (error_add, success_add) => {
        if (error_add) response.status(500).send({ error: error_add });
        if (success_add.length !== 0) response.status(201).send({ message: `${todo} added.` });
    });
});


//* Read
app.get('/todo_list', (payload, response) => {
    const query_todo_list = "SELECT * FROM todo_view ORDER BY timestamp DESC";
    db.query(query_todo_list, (err_load, data) => {
        if (err_load) response.status(500).send({ error: err_load });
        if (data.length !== 0) {
            response.status(200).send({ list: data });
        } else {
            response.status(404).send({ list: data, message: "Nothing to do" })
        }
    });
})
app.get('/todo_list/find/:todo', validateInput, (payload, response) => {
    const { todo } = payload?.params;
    const query_todo_list = "SELECT * FROM todo_view WHERE CONCAT(todo,is_done,timestamp) LIKE ? ORDER BY timestamp DESC";
    db.query(query_todo_list, [`%${todo}%`], (err_load, data) => {
        if (err_load) response.status(500).send({ error: err_load });
        if (data.length !== 0) {
            response.status(200).send({ list: data });
        } else {
            response.status(404).send({ list: data, message: `Nothing Found for '${todo}'` })
        }
    });
})


//* Delete
app.delete('/todo_list/delete/:todo_id', validateInput, validToDoID, (payload, response) => {
    const { todo_id } = payload?.params;
    const query_delete_todo = "DELETE FROM todo_tbl WHERE row_id = ? LIMIT 1";
    db.query(query_delete_todo, [todo_id], (err_delete, deleted) => {
        if (err_delete) response.status(500).send({ error: err_delete });
        if (deleted) response.status(204).send({ message: "Deleted Succesfully!" })
    })
})


//* Update
app.put('/todo_list/update/:todo_id', validateInput, validToDoID, (payload, response) => {
    const { todo_id } = payload?.params;
    const { todo, is_done } = payload?.body;
    const query_update_todo = "UPDATE todo_tbl SET todo = ?, is_done = ? WHERE row_id = ? LIMIT 1";
    db.query(query_update_todo, [todo, is_done, todo_id], (err_update, updated) => {
        if (err_update) response.status(500).send({ error: err_update });
        if (updated) response.status(200).send({ message: "ToDo Updated" });
    })
})



app.listen(process.env.SERVER_PORT_ID_TODO, () => {
    console.log(`[TODO] Server Running @ PORT:${process.env.SERVER_PORT_ID_TODO}`);
})