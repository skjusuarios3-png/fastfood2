const cardapio = [
    { id: 1, categoria: "burgers", popular: true, nome: "Classic Smash Burger", desc: "Blend de 100g prensado na chapa com crosta perfeita, queijo cheddar maçaricado, alface, tomate e maionese artesanal da casa.", preco: 22.00, img: "https://unsplash.com", custom: "burger" },
    { id: 2, categoria: "burgers", popular: false, nome: "Double Cheddar Bacon", desc: "Dois blends suculentos de 120g, dobro de queijo cheddar derretido, bacon fatiado crocante e molho BBQ defumado.", preco: 36.00, img: "https://unsplash.com", custom: "burger" },
    { id: 3, categoria: "combos", popular: true, nome: "Combo Burger + Batata + Refri", desc: "O campeão de vendas! 1 Classic Smash Burger + 1 Porção Individual de Batatas Fritas Palito + 1 Refrigerante em lata gelado.", preco: 42.00, img: "https://unsplash.com", custom: "bebida" },
    { id: 4, categoria: "combos", popular: false, nome: "Box Duplo Club", desc: "Perfeito para duas pessoas. 2 Classic Smash Burgers + 1 Porção Grande de Batata Frita Rústica + 2 Refrigerantes em lata.", preco: 68.00, img: "https://unsplash.com", custom: "bebida" },
    { id: 5, categoria: "extras", popular: false, nome: "Batata Frita Palito Crocante", desc: "Batatas fritas tradicionais sequinhas, crocantes e levemente salgadas. Acompanha ketchup da casa.", preco: 18.00, img: "https://unsplash.com", custom: "nenhum" },
    { id: 6, categoria: "extras", popular: false, nome: "Onion Rings Gigantes", desc: "Anéis de cebola empanados em farinha panko super crocantes. Acompanha molho de maionese verde.", preco: 19.50, img: "https://unsplash.com", custom: "nenhum" },
    { id: 7, categoria: "sobremesas", popular: false, nome: "Brownie com Sorvete", desc: "Brownie de chocolate meio amargo quentinho servido com uma bola de sorvete de creme e calda quente.", preco: 16.00, img: "https://unsplash.com", custom: "nenhum" },
    { id: 8, categoria: "bebidas", popular: false, nome: "Refrigerante em Lata", desc: "Escolha o sabor e o tamanho ideal para refrescar sua refeição.", preco: 6.00, img: "https://unsplash.com", custom: "bebida" }
];

let sacola = []; 
let itemEmCustomizacao = null;
let opcionaisSelecionados = {};
let formaEntrega = 'delivery';
let formaPagamento = 'Pix';

function renderizarMenu() {
    cardapio.forEach(p => {
        const tagPopular = p.popular ? `<span class="tag-popular">Destaque ★</span>` : '';
        const htmlCard = `
            <div class="card" onclick="abrirCustomizacao(${p.id})">
                <div class="card-img-wrapper">
                    <img class="card-img" src="${p.img}" alt="${p.nome}">
                    ${tagPopular}
                </div>
                <div class="card-info">
                    <h3>${p.nome}</h3>
                    <p>${p.desc}</p>
                    <span class="card-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>`;
        document.getElementById(`lista-${p.categoria}`).innerHTML += htmlCard;
    });
}

function abrirCustomizacao(id) {
    itemEmCustomizacao = cardapio.find(p => p.id === id);
    opcionaisSelecionados = { tamanho: null, adicionais: [], tamanhoPreco: 0 };
    
    document.getElementById('modal-img').src = itemEmCustomizacao.img;
    document.getElementById('modal-title').innerText = itemEmCustomizacao.nome;
    document.getElementById('modal-desc').innerText = itemEmCustomizacao.desc;
    
    const containerCustom = document.getElementById('modal-customizations');
    containerCustom.innerHTML = '';

    if (itemEmCustomizacao.custom === "bebida") {
        opcionaisSelecionados.tamanho = "Lata 350ml";
        containerCustom.innerHTML += `
            <div class="option-section">
                <div class="option-section-title">Escolha o Tamanho</div>
                <div class="custom-option selected" id="opt-tam-1" onclick="setTamanho('Lata 350ml', 0, 1)">
                    <span class="opt-name">Lata 350ml</span><span class="opt-price">+ R$ 0,00</span>
                </div>
                <div class="custom-option" id="opt-tam-2" onclick="setTamanho('Garrafa 600ml', 3.50, 2)">
                    <span class="opt-name">Garrafa 600ml</span><span class="opt-price">+ R$ 3,50</span>
                </div>
            </div>`;
    }

    if (itemEmCustomizacao.custom === "burger") {
        containerCustom.innerHTML += `
            <div class="option-section">
                <div class="option-section-title">Adicionais Extras</div>
                <div class="custom-option" id="add-bacon" onclick="toggleAdicional('Bacon Crocante', 4.50, 'add-bacon')">
                    <span class="opt-name">Bacon Crocante</span><span class="opt-price">+ R$ 4,50</span>
                </div>
                <div class="custom-option" id="add-queijo" onclick="toggleAdicional('Queijo Cheddar Extra', 3.50, 'add-queijo')">
                    <span class="opt-name">Queijo Cheddar Extra</span><span class="opt-price">+ R$ 3,50</span>
                </div>
            </div>`;
    }

    atualizarPrecoModal();
    toggleModal(true);
}

function setTamanho(nome, preco, idx) {
    opcionaisSelecionados.tamanho = nome;
    opcionaisSelecionados.tamanhoPreco = preco;
    document.getElementById('opt-tam-1').classList.toggle('selected', idx === 1);
    document.getElementById('opt-tam-2').classList.toggle('selected', idx === 2);
    atualizarPrecoModal();
}

function toggleAdicional(nome, preco, elementId) {
    const index = opcionaisSelecionados.adicionais.findIndex(a => a.nome === nome);
    const el = document.getElementById(elementId);
    
    if (index === -1) {
        opcionaisSelecionados.adicionais.push({ nome, preco });
        el.classList.add('selected');
    } else {
        opcionaisSelecionados.adicionais.splice(index, 1);
        el.classList.remove('selected');
    }
    atualizarPrecoModal();
}

function atualizarPrecoModal() {
    let total = itemEmCustomizacao.preco;
    if (opcionaisSelecionados.tamanhoPreco) total += opcionaisSelecionados.tamanhoPreco;
    opcionaisSelecionados.adicionais.forEach(a => total += a.preco);
    document.getElementById('modal-btn-price').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function confirmarAdicaoModal() {
    let itemSacola = {
        idUnique: Date.now() + Math.random(),
        idBase: itemEmCustomizacao.id,
        nome: itemEmCustomizacao.nome,
        precoBase: itemEmCustomizacao.preco,
        tamanho: opcionaisSelecionados.tamanho,
        tamanhoPreco: opcionaisSelecionados.tamanhoPreco || 0,
        adicionais: [...opcionaisSelecionados.adicionais],
        qtd: 1
    };
    
    let extra = itemSacola.tamanhoPreco;
    itemSacola.adicionais.forEach(a => extra += a.preco);
    itemSacola.precoTotalUnitario = itemSacola.precoBase + extra;

    sacola.push(itemSacola);
    atualizarInterfaceSacola();
    toggleModal(false);
    toggleCart(true);
}

function atualizarInterfaceSacola() {
    const listContainer = document.getElementById('cart-items-list');
    listContainer.innerHTML = '';
    
    let totalItensContagem = 0;
    let subtotalCalculado = 0;

    sacola.forEach(item => {
        totalItensContagem += item.qtd;
        subtotalCalculado += item.precoTotalUnitario * item.qtd;

        let detalhesTxt = [];
        if (item.tamanho) detalhesTxt.push(`Tam: ${item.tamanho}`);
        item.adicionais.forEach(a => detalhesTxt.push(`+ ${a.nome}`));
        let stringCustom = detalhesTxt.length > 0 ? detalhesTxt.join(' | ') : 'Sem adicionais';

        listContainer.innerHTML += `
            <div class="cart-item-row">
                <div class="item-details">
                    <h4>${item.nome}</h4>
                    <p>R$ ${(item.precoTotalUnitario * item.qtd).toFixed(2).replace('.', ',')}</p>
                    <span>${stringCustom}</span>
                </div>
                <div class="item-qty-controls">
                    <button class="cart-btn-qty" onclick="alterarQtdSacola(${item.idUnique}, -1)">-</button>
                    <span class="cart-qty-num">${item.qtd}</span>
                    <button class="cart-btn-qty" onclick="alterarQtdSacola(${item.idUnique}, 1)">+</button>
                </div>
            </div>`;
    });

    let valorFrete = formaEntrega === 'delivery' ? 7.00 : 0.00;
    let totalGeral = subtotalCalculado + valorFrete;

    document.getElementById('txt-cart-count').innerText = totalItensContagem;
    document.getElementById('sm-subtotal').innerText = `R$ ${subtotalCalculado.toFixed(2).replace('.', ',')}`;
    document.getElementById('sm-frete').innerText = formaEntrega === 'delivery' ? `R$ 7,00` : `Grátis`;
    document.getElementById('sm-total').innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
}

function alterarQtdSacola(idUnique, m) {
    const item = sacola.find(i => i.idUnique == idUnique);
    if (!item) return;
    item.qtd += m;
    if (item.qtd <= 0) {
        sacola = sacola.filter(i => i.idUnique != idUnique);
    }
    atualizarInterfaceSacola();
}

function toggleCart(abrir) { document.getElementById('cart-sidebar').classList.toggle('open', abrir); }
function toggleModal(abrir) { document.getElementById('modal-product').classList.toggle('open', abrir); }
function fecharModalNoFundo(e) { if (e.target.id === 'modal-product') toggleModal(false); }

function setEntrega(tipo) {
    formaEntrega = tipo;
Use o código com cuidado.document.getElementById('opt-delivery').classList.toggle('active', tipo === 'delivery');document.getElementById('opt-retirada').classList.toggle('active', tipo === 'retirada');document.getElementById('pane-endereco').classList.toggle('active', tipo === 'delivery');document.getElementById('pane-alerta-retirada').classList.toggle('active', tipo === 'retirada');atualizarInterfaceSacola();}function setPagamento(tipo) {formaPagamento = tipo;document.getElementById('opt-pix').classList.toggle('active', tipo === 'Pix');document.getElementById('opt-cartao').classList.toggle('active', tipo === 'Cartão');document.getElementById('opt-dinheiro').classList.toggle('active', tipo === 'Dinheiro');document.getElementById('pane-troco').classList.toggle('active', tipo === 'Dinheiro');}function gerarIdPedido() { return #BC-${Math.floor(1000 + Math.random() * 9000)}; }function enviarPedido() {const nome = document.getElementById('input-nome').value.trim();if (sacola.length === 0) { alert("Sua sacola está vazia!"); return; }if (!nome) { alert("Informe seu nome completo!"); return; }let endereco = "";if (formaEntrega === 'delivery') {endereco = document.getElementById('input-endereco').value.trim();if (!endereco) { alert("Informe seu endereço completo!"); return; }}const idPedido = gerarIdPedido();let msg = 🍔 *BURGER CLUB - PEDIDO ${idPedido}*\n;msg += *Cliente:* ${nome}\n;msg += *Tipo:* ${formaEntrega === 'delivery' ? 'Entrega 🛵' : 'Retirada 🏬'}\n;if (formaEntrega === 'delivery') msg += *Endereço:* ${endereco}\n;msg += *Pagamento:* ${formaPagamento}\n;if (formaPagamento === 'Dinheiro') msg += *Troco:* ${document.getElementById('input-troco').value.trim() || 'Não precisa'}\n;msg += \n*Itens Escolhidos:*\n;let subtotal = 0;sacola.forEach(item => {msg += • ${item.qtd}x ${item.nome}\n;if (item.tamanho) msg +=   _Tam: ${item.tamanho}_\n;item.adicionais.forEach(a => msg +=   _+ ${a.nome}_\n);subtotal += item.precoTotalUnitario * item.qtd;});let frete = formaEntrega === 'delivery' ? 7.00 : 0.00;msg += \n*Total Geral:* R$ ${(subtotal + frete).toFixed(2).replace('.', ',')};window.open(https://whatsapp.com{encodeURIComponent(msg)}, '_blank');}window.addEventListener('scroll', () => {const sections = document.querySelectorAll('.section-title');const navLinks = document.querySelectorAll('.cat-badge');let current = '';sections.forEach(section => { if (pageYOffset >= section.offsetTop - 140) current = section.getAttribute('id'); });navLinks.forEach(link => { link.classList.remove('active'); if (link.getAttribute('data-sec') === current) link.classList.add('active'); });});renderizarMenu();
