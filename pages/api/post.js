import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            const database = client.db('dc');
            const collection = database.collection('Neet_Biology');
            const data = req.body;

            const result = await collection.insertOne(data);

            res.status(201).json({
                message: "Data saved successfully!",
            });
        } catch (error) {
            console.error("Failed to save data:", error);
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: "Method not allowed!" });
    }
}
