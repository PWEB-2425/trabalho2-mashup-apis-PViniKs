# 🎮 BuscaGame

Projeto web que permite buscar informações de jogos pela API da Steam (loja de jogos eletrônicos) e visualizar preços atuais e históricos em diferentes moedas, como Real Brasileiro e Euro, utilizando dados da API do GGDeals (site de comparação de preços para jogos eletrônicos).

---

## 👤 Autor

- Paulo Vinícius Kuss — 35093

---

## 🧰 Tecnologias e APIs Utilizadas

### Tecnologias:
- **Node.js** com **Express**
- **MongoDB** para autenticação
- **HTML5, CSS3 e JavaScript**

### APIs:
- **Steam API** — para obter informações de jogos
- **GGDeals API** — para preços atuais e históricos dos jogos

---

## 🧾 Pré-requisitos e Instalação

### 1. Clone o repositório:
```bash
git clone https://github.com/PWEB-2425/trabalho2-mashup-apis-PViniKs/
cd trabalho2-mashup-apis-PViniKs/backend
````

### 2. Instale as dependências:

```bash
npm install
```

### 3. Configuração do MongoDB e Variáveis de Ambiente:

Crie um arquivo `.env` na pasta do backend com as seguintes informações:

```env
# APIs
GGDEALS_KEY={chave_api_ggdeals}  // Chave da API do GGDeals
------------------------------------------
# LINKS
STEAM_LINK=https://store.steampowered.com/api/appdetails?l=brazilian&appids=  // Link para API da Steam
GGDEALS_LINK=https://api.gg.deals/v1/prices/by-steam-app-id/?key=  // Link para API do GGDeals
GGDEALS_BRL=&region=br&ids=  // Continuação do link do GGDeals para obter dados em BRL
GGDEALS_EUR=&region=eu&ids=  // Continuação do link do GGDeals para obter dados em EUR
------------------------------------------
# APP
PORT=3058  // Porta preferencial para execução do projeto
SECRET={sua_chave_secreta}  // Chave secreta para a sessão
------------------------------------------
# MONGODB
DB="mongodb+srv://{seu_usuario}:{sua_senha}@{seu_cluster}.mongodb.net/?"
DATABASE="{seu_banco_de_dados}"
COLLECTION="{sua_colecao}"
```

> ⚠️ **Importante:** Nunca suba este arquivo para repositórios públicos.

---

## ▶️ Comandos para Rodar Localmente

```bash
# Executa o servidor
npm start
```

O servidor rodará por padrão em:

```
http://localhost:3058/  
```

---

## 🚀 Deploy

O projeto está disponível online via Netlify:
🔗 [link](link)

---

## ✅ Funcionalidades

* Registro, login e logout com autenticação persistente
* Busca de jogos
* Informações detalhadas do jogo (nome, descrição e imagem de cabeçalho)
* Comparativo de preços (BRL e EUR), incluindo valor atual e baixa histórica
* Link direto para a página oficial do jogo na Steam

---

## 📁 Estrutura de Pastas

```
/trabalho2-mashup-apis-PViniKs
├── backend/
│   ├── node_modules/ (não incluído)
│   ├── .env (não incluído)
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
├── frontend/
│   ├── frontend/
│   │   ├── brasil.png
│   │   ├── index.html
│   │   ├── jogos.json
│   │   ├── script.js
│   │   ├── style.css
│   │   ├── ue.png
│   ├── login.html
│   ├── registrar.html
├── .gitignore
├── server.js
```

---

## 📝 Observações

* Os dados da lista de jogos são carregados apenas uma vez e armazenados em cache no lado do cliente, visando melhoria de performance.

---