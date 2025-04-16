import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express();
app.use(express.json());
app.use(cors());

app.post("/usuarios", async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar usuário. Verifique os dados enviados." });
    }
});


app.get('/usuarios', async (req, res) => {
    let filters = {};

    if (req.query.name) filters.name = req.query.name;
    if (req.query.email) filters.email = req.query.email;
    if (req.query.age) filters.age = Number(req.query.age);

    const users = await prisma.user.findMany({
        where: filters
    });

    res.status(200).json(users);
});



app.put("/usuarios/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: "Usuário não encontrado" });
    }
});

app.delete("/usuarios/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await prisma.user.delete({ where: { id } });
        res.status(200).json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: "Usuário não encontrado" });
    }
});




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit();
});


// Usuarios mongodb: Danilo
// senha: qZdSJH0dlD4TuG1i