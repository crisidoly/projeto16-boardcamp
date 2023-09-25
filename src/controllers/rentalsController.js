import dayjs from "dayjs";
import db from "../database/databaseConnection.js";

async function formatDate(date) {
  return dayjs(date).format("YYYY-MM-DD");
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    if (rental.rowCount === 0) return res.status(404).send({ message: "Aluguel inexistente!" });
    if (rental.rows[0].returnDate === null) return res.status(400).send({ message: "Aluguel não pode ser deletado pois não foi finalizado." });

    await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}


export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const [customer, game, checkGameStock] = await Promise.all([
      db.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]),
      db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]),
      db.query(`
        SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;
      `, [gameId]),
    ]);

    if (customer.rowCount === 0) return res.status(400).send({ message: "Usuário não encontrado!" });
    if (game.rowCount === 0) return res.status(400).send({ message: "Jogo não encontrado!" });
    if (checkGameStock.rowCount >= game.rows[0].stockTotal) {
      return res.status(400).send({ message: "Não temos mais esse jogo disponível no estoque neste momento." });
    }

    await db.query(`
      INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee")
      VALUES ($1, $2, $3, $4, $5, NULL, NULL);
    `, [customerId, gameId, daysRented, formatDate(dayjs()), daysRented * game.rows[0].pricePerDay]);

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function finishRental(req, res) {
  const { id } = req.params;

  try {
    const response = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
    if (response.rowCount === 0) return res.sendStatus(404);

    const rental = response.rows[0];
    if (rental.returnDate !== null) return res.sendStatus(400);

    const rentDate = dayjs(rental.rentDate);
    const difference = dayjs().diff(rentDate, "days");
    let delayFee = null;

    if (difference > rental.daysRented) {
      delayFee = (rental.originalPrice / rental.daysRented) * (difference - rental.daysRented);
    }

    await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`,
      [formatDate(dayjs()), delayFee, id]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function getRentals(req, res) {
  try {
    const response = await db.query(`
      SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
      FROM rentals
      JOIN customers ON customers.id = rentals."customerId"
      JOIN games ON games.id = rentals."gameId";
    `);

    const rentals = response.rows.map((rental) => ({
      ...rental,
      rentDate: formatDate(rental.rentDate),
      customer: { id: rental.customerId, name: rental.customerName },
      game: { id: rental.gameId, name: rental.gameName },
    }));

    res.send(rentals);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
