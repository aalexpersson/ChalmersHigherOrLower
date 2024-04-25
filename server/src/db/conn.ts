import { Connection ,createConnection } from "mongoose";
import { readFileSync } from 'fs';



const db = readFileSync('./src/db/util.txt', 'utf-8')

async function makeConnection() : Promise<Connection>{
    return createConnection(`mongodb+srv://pontusen:${db}@chalmershigherlower.akkne3j.mongodb.net/?retryWrites=true&w=majority`)
}

export const conn : Promise<Connection> = makeConnection()
