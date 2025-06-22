const buscar = document.getElementById("buscar");
const imagem = document.getElementById("imagem");
const lista = document.getElementById("autocomplete-list");
const pagJogo = document.getElementById("pagJogo");
const precoBR = document.getElementById("precoBR");
const precoEU = document.getElementById("precoEU");
const precoHistBR = document.getElementById("precoHistBR");
const precoHistEU = document.getElementById("precoHistEU");
const resposta = document.getElementById("resposta");
const selecao = document.getElementById("selecao");
const texto = document.getElementById("texto");
const titulo = document.getElementById("titulo");

let controller = null;
let cacheJogos = null;

selecao.addEventListener("input", async () => {
    const query = selecao.value.trim().toLowerCase();
    lista.innerHTML = "";

    if (query.length < 4) return;
    lista.hidden = false;

    if (controller) controller.abort();
    controller = new AbortController();

    try {
        if (!cacheJogos) {
            const response = await fetch("jogos.json", { signal: controller.signal });
            const data = await response.json();
            cacheJogos = data.applist.apps;
        }

        const filtrados = cacheJogos.filter(jogo =>
            jogo.name && jogo.name.toLowerCase().includes(query)
        );

        lista.innerHTML = "";

        filtrados.forEach(jogo => {
            const item = document.createElement("div");
            item.classList.add("autocomplete-item");
            item.textContent = jogo.name;

            item.addEventListener("click", () => {
                selecao.value = jogo.name;
                lista.innerHTML = "";
                lista.hidden = true;
            });

            lista.appendChild(item);
        });
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("Erro ao buscar jogos:", error);
        }
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest("#selecao")) {
        lista.innerHTML = "";
        lista.hidden = true;
    }
    console.log(cacheJogos);
});

buscar.addEventListener("click", function() {
    getGameId(selecao.value)
    .then(idGame => {
        if (idGame) {
            fetchGame(idGame);
        } else {
            console.error("Jogo não encontrado");
        }
    })
});

async function getGameId(select) {
    try {
        const response = await fetch("jogos.json");
        const data = await response.json();
        const game = data.applist.apps.find(app => app.name.toLowerCase() === select.toLowerCase());
        return game ? game.appid : null;
    } catch (error) {
        console.error("Erro ao buscar o jogo:", error);
        return null;
    }
}

async function fetchGame(select) {
    const ggdealsUrl = `/preco/${select}`;
    const steamUrl = `/jogo/${select}`;
    
    let pbr = '';
    let peu = '';
    let phbr = '';
    let pheu = '';

    // Fetch Preços no GGDeals
    await fetch(ggdealsUrl)
    .then(response => {
        if (!response.ok) {
            precoBR.innerText = "Erro ao buscar dados do GGDeals";
            throw new Error("Erro ao buscar dados do GGDeals");
        }
        return response.json();
    })
    .then(data => {
        pbr = data.br.currentRetail;
        phbr = data.br.historicalRetail;
        peu = data.eu.currentRetail;
        pheu = data.eu.historicalRetail;
    })

    // Fetch Informações na Steam
    await fetch(steamUrl)
    .then(response => {
        if (!response.ok) {
            texto.innerText = "Erro ao buscar dados do Steam";
            throw new Error("Erro ao buscar dados do Steam");
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            imagem.onload = function() {
                texto.innerText = data.descricao;
                titulo.innerText = data.nome;
                precoBR.innerText = `R$ ${pbr}`;
                precoEU.innerText = `€ ${peu}`;
                precoHistBR.innerText = `R$ ${phbr}`;
                precoHistEU.innerText = `€ ${pheu}`;
                resposta.hidden = false;
                pagJogo.onclick = function() { window.open(`https://store.steampowered.com/app/${select}`, '_blank') };
            };
            imagem.src = data.header;
        } else {
            texto.innerText = "Resumo não encontrado";
        }
    })
}