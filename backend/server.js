const express = require('express')
const session = require('express-session')
const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')
const path = require('path')

const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000 || 3030

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }))
app.use('/buscaGame/', estaAutenticado, express.static(path.join(__dirname, '../frontend/buscaGame')))

let sessao = false

async function start() {
    try {
        console.log('Conectando ao MongoDB...')
        const client = new MongoClient(process.env.DB)
        await client.connect()
        console.log('Conectado ao MongoDB!')

        db = client.db(process.env.DATABASE)
        collection = db.collection(process.env.COLLECTION)

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`)
        })
    } catch (e) {
        console.error('Erro conectando ao MongoDB:', e)
    }
}

app.get('/preco/:id', estaAutenticado, async (req, res) => {
    const id = req.params.id
    const proxyUrl = "https://corsproxy.io/?";
    const urlBR = process.env.GGDEALS_LINK + process.env.GGDEALS_KEY + process.env.GGDEALS_BRL + id
    const urlEU = process.env.GGDEALS_LINK + process.env.GGDEALS_KEY + process.env.GGDEALS_EUR + id
    
    try {
        const responseBR = await fetch(proxyUrl + urlBR)
        const dataBR = await responseBR.json()
        const responseEU = await fetch(proxyUrl + urlEU)
        const dataEU = await responseEU.json()

        if (dataBR && dataEU) {
            res.json({ br: dataBR.data[id].prices, eu: dataEU.data[id].prices })
        } else {
            res.status(404).json({ error: 'Dados não encontrados' })
        }
    } catch (e) {
        console.error('Erro ao buscar preços:', e)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

app.get('/jogo/:id', estaAutenticado, async (req, res) => {
    const id = req.params.id
    const urlSteam = process.env.STEAM_LINK + id

    try {
        const responseSteam = await fetch(urlSteam)
        const dataSteam = await responseSteam.json()

        if (dataSteam) {
            res.json({ nome: dataSteam[id].data.name, descricao: dataSteam[id].data.short_description, header: dataSteam[id].data.header_image })
        } else {
            res.status(404).json({ error: 'Dados não encontrados' })
        }
    } catch (e) {
        console.error('Erro ao buscar jogo:', e)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }  
})

app.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const user = await collection.findOne({ username: username, password: password })
        if (user) {
            req.session.user = user
            sessao = true
            res.send(`
                <script>
                    alert('Login bem-sucedido!');
                    window.location.href = '/buscaGame/';
                </script>
            `)
        } else {
            res.send(`
                <script>
                    alert('Usuário ou senha inválidos');
                    window.location.href = '/login.html';
                </script>
            `)
        }
    } catch (e) {
        console.error('Erro ao fazer login:', e)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err)
            return res.status(500).json({ error: 'Erro interno do servidor' })
        }
        sessao = false
        res.send(`
            <script>
                alert('Logout bem-sucedido!');
                window.location.href = '/login.html';
            </script>
        `)
    })
})

app.post('/registrar', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const existingUser = await collection.findOne({ username: username })
        if (existingUser) {
            return res.send(`
                <script>
                    alert('Usuário já existe');
                    window.location.href = '/registrar.html';
                </script>
            `)
        }

        const newUser = { username: username, password: password }
        await collection.insertOne(newUser)
        req.session.user = newUser
        sessao = true

        res.send(`
            <script>
                alert('Usuário registrado com sucesso!');
                window.location.href = '/buscaGame/';
            </script>
        `)
    } catch (e) {
        console.error('Erro ao registrar usuário:', e)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

function estaAutenticado(req, res, next) {
    if (sessao === true) {
        next()
    } else {
        res.redirect('/login.html')
    }
}

app.get(['/login.html', '/registrar.html'], (req, res) => {
    if (sessao === true) {
        return res.redirect('/buscaGame/')
    }
    res.sendFile(path.join(__dirname, '../frontend', req.path))
})


app.get('/', (req, res) => {
    if (sessao === true) {
        return res.redirect('/buscaGame/')
    } else {
        return res.redirect('/login.html')
    }
})

app.use((req, res, next) => {
    if (sessao === true) {
        if (req.path.startsWith('/buscaGame/')) {
            return next()
        } else {
            return res.redirect('/buscaGame/')
        }
    } else {
        if (req.path === '/login.html' || req.path === '/registrar.html') {
            return next()
        } else {
            return res.redirect('/login.html')
        }
    }
})

start()