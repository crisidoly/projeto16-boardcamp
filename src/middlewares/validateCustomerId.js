import { db } from "../database/databaseConnection.js";

export async function validateCustomerId(req, res, next) {
  const { id } = req.params;

  try {
    const response = await db.query("SELECT * FROM customers WHERE id=$1;", [id]);

    if (response.rowCount === 0) {
      return res.status(404).send({ message: "Usuário não encontrado com o ID fornecido." });
    }

    res.locals.customerData = response.rows[0];
    next();
  } catch (err) {
    res.status(500).send({ message: "Ocorreu um erro ao validar o ID do usuário." });
  }
}
