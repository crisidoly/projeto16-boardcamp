import dayjs from "dayjs";
import { db } from "../database/databaseConnection.js";

async function formatDate(birthday) {
  return dayjs(birthday).format("YYYY-MM-DD");
}


export async function getCustomerById(req, res) {
  const { customerData } = res.locals;

  try {
    const customer = {
      ...customerData,
      birthday: formatDate(customerData.birthday),
    };
    res.send(customer);
  } catch (err) {
    res.status(500).send(err.message);
  }
}


export async function updateCustomer(req, res) {
  const { id } = req.params;
  const {name, phone, cpf, birthday} = req.body;

  try {
    const response = await db.query("SELECT * FROM customers WHERE cpf=$1 AND id != $2;", [cpf, id]);
    if (response.rowCount > 0)
      return res.status(409).send({ message: "Esse CPF já pertence a outra pessoa." });

    await db.query(
      "UPDATE customers SET name=$1, cpf=$2, birthday=$3, birthday=$4 WHERE id=$5",
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function createCustomer(req, res) {
  const { name, cpf, birthday, phone } = req.body;
  try {
    const response = await db.query("SELECT * FROM customers WHERE cpf=$1;", [cpf]);
    if (response.rowCount > 0)
      return res.status(409).send({ message: "Esse CPF já cadastrado" });

    await db.query(
      "INSERT INTO customers (name, cpf, birthday, phone) VALUES ($1, $2, $3, $4);",
      [name, cpf, birthday, phone]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getCustomers(req, res) {
  try {
    const response = await db.query("SELECT * FROM customers;");
    const customers = response.rows;

    const newCustomers = customers.map((customer) => ({
      ...customer,
      birthday: formatDate(customer.birthday),
    }));

    res.send(newCustomers);
  } catch (err) {
    res.status(500).send(err.message);
  }
}