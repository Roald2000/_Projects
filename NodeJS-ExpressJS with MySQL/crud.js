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

app.post('/crud/add_item', (payload, reply) => {
    const { item_name, item_price } = payload.body;
    const query_add_item = "INSERT INTO crud_tbl(item_name, item_price) VALUES(?,?)";
    db.query(query_add_item, [item_name, item_price], (error_insert, success) => {
        if (error_insert) reply.status(500).send({ error: error_insert });
        if (success) reply.status(201).send({ message: `${item_name} has been added successfully!` })
    })
})

app.get('/crud/load_items', (payload, reply) => {
    const query_fetch_items = "SELECT * FROM crud_tbl LIMIT 50";
    db.query(query_fetch_items, (error_fetch, success_fetch) => {
        if (error_fetch) reply.status(500).send({ error: error_fetch });
        if (success_fetch.length !== 0) {
            reply.status(200).send({ list: success_fetch, message: "Items Fetched" });
        } else {
            reply.status(404).send({ list: success_fetch, message: "Add items to the list." });
        }
    })
})

app.get('/crud/find_items/:find_item', (payload, reply) => {
    const { find_item } = payload.params;
    const query_fetch_items = "SELECT * FROM crud_tbl WHERE CONCAT(row_id,item_name,item_price,timestamp) LIKE ? LIMIT 50";
    db.query(query_fetch_items, [`%${find_item}%`], (error_fetch, success_fetch) => {
        if (error_fetch) reply.status(500).send({ error: error_fetch });
        if (success_fetch.length !== 0) {
            reply.status(200).send({ list: success_fetch, message: "Items Fetched" });
        } else {
            reply.status(404).send({ list: success_fetch, message: `No Results for '${find_item}'` });
        }
    })
})

app.get('/crud/load_items/:row_id', (payload, reply) => {
    const { row_id } = payload.params;
    const query_fetch_item = "SELECT * FROM crud_tbl WHERE row_id = ? LIMIT 1";
    db.query(query_fetch_item, [row_id], (error, data) => {
        if (error) reply.status(500).send({ error: error });
        if (data.length !== 0) {
            reply.status(200).send({ item: data[0], message: "Item Found" });
        } else {
            reply.status(404).send({ item: data[0], message: "Item Not Found" });
        }
    })
})

function isItemValid(payload, reply, next) {
    const { row_id } = payload.params;
    const query_fetch_item = "SELECT * FROM crud_tbl WHERE row_id = ? LIMIT 1";
    db.query(query_fetch_item, [row_id], (error, data) => {
        if (error) reply.status(500).send({ error: error });
        if (data.length !== 0) {
            next();
        } else {
            reply.status(404).send({ message: "Item Not Found" });
        }
    })
}

app.put('/crud/update_item/:row_id', isItemValid, (payload, reply) => {
    const { item_name, item_price } = payload.body;
    const { row_id } = payload.params;
    const query_update_item = "UPDATE crud_tbl SET item_name = ?, item_price = ? WHERE row_id = ? LIMIT 1";
    db.query(query_update_item, [item_name, item_price, ...row_id], (error, data) => {
        if (error) reply.status(500).send({ error: error });
        data && reply.status(200).send({ message: `Item ${row_id}-${item_name} has been updated succesfully!` });
    })
});

app.delete('/crud/delete_id/:row_id', isItemValid, (payload, reply) => {
    const { row_id } = payload.params;
    db.query('DELETE FROM crud_tbl WHERE row_id = ? LIMIT 1', [row_id], (error, data) => {
        if (error) reply.status(500).send({ error: error });
        data && reply.status(200).send({ message: `Item ${row_id} has been Deleted succesfully!` });
    })
})

app.listen(process.env.SERVER_PORT_ID_CRUD, () => {
    console.log(`[CRUD] Server Running @ PORT:${process.env.SERVER_PORT_ID_CRUD}`);
})