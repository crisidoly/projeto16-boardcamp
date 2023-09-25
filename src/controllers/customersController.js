import { format } from "date-fns";
import db from "../database/databaseConnection.js";

export async function getCustomers(req,res){

    try {
        const customers = await db.query(`SELECT * FROM customers;`);
        customers.rows.forEach(element => {
          element.birthday = format(new Date(element.birthday),'yyyy-MM-dd')
        });
        
        res.status(200).send(customers.rows);
  
      } catch (err) {
        res.status(500).send(err.message);
      }
}

export async function getCustomersById(req,res){
    const {id} = req.params
    
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        if(customer.rowCount == 0) return res.status(404).send();
        customer.rows[0].birthday = format(new Date(customer.rows[0].birthday),'yyyy-MM-dd')
        
        res.status(200).send(customer.rows[0]);
  
      } catch (err) {
        res.status(500).send(err.message);
      }
}

export async function postCustomers(req,res){
    const customer = req.body
    

    try {
        if (customer.name == "") return res.status(400).send();
        
        const customers = await db.query(`SELECT * FROM customers WHERE cpf = $1;`,[customer.cpf]);
        if (customers.rowCount > 0) return res.status(409).send();
        
        
        await db.query(`INSERT INTO customers 
        (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4);`, 
        [customer.name, customer.phone, customer.cpf, customer.birthday]);
        
        res.status(201).send();
  
      } catch (err) {
        res.status(500).send(err.message);
      }
}

export async function putCustomerById(req, res){
    const body = req.body;
    const {id} = req.params;
   
    try {        
        const custUpdate = await db.query(`SELECT customers.cpf, customers.id 
        FROM customers 
        WHERE cpf='${body.cpf}' 
        AND id != $1;`, [id]);
        
        const custId = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        
        if (custId.rowCount && !custUpdate.rowCount){ 
        
        await db.query(`UPDATE customers SET 
        name = $1, phone = $2, cpf = $3, birthday = $4
        WHERE id = $5;`, 
        [body.name, body.phone, body.cpf, body.birthday, id])

        return res.status(200).send();
        
      }else{
        return res.status(409).send()
      } 
  
      } catch (err) {
        res.status(500).send(err.message);
      }
}