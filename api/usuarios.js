import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const user = await prisma.user.create({
                data: {
                    email: req.body.email,
                    name: req.body.name,
                    age: req.body.age,
                },
            });
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ error: "Erro ao criar usuário" });
        }
    }

    if (req.method === 'GET') {
        try {
            const filters = {};
            if (req.query.name) filters.name = req.query.name;
            if (req.query.email) filters.email = req.query.email;
            if (req.query.age) filters.age = Number(req.query.age);

            const users = await prisma.user.findMany({ where: filters });
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
    }

    return res.status(405).json({ error: "Método não permitido" });
}
