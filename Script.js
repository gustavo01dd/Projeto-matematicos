// ===== 1. Dados dos produtos, cesta, pontuacao e logica principal da loja =====
const produtos=[
{id:1,nome:"Poção Mágica",preco:12.50,cat:"poções",emoji:"🧪",img:"imagens/pocao.jpg"},
{id:2,nome:"Poção de Cura",preco:15.00,cat:"poções",emoji:"🧪",img:"imagens/pocao-cura.jpg"},
{id:3,nome:"Feijõezinhos Mágicos",preco:8.50,cat:"feijõezinhos",emoji:"🫘",img:"imagens/feijoes.jpg"},
{id:4,nome:"Feijõezinhos Surpresa",preco:10.00,cat:"feijõezinhos",emoji:"🫘",img:"imagens/feijoes-surpresa.jpg"},
{id:5,nome:"Sapo de Chocolate",preco:9.50,cat:"doces",emoji:"🍬",img:"imagens/sapo-chocolate.jpg"},
{id:6,nome:"Doces Mágicos",preco:7.00,cat:"doces",emoji:"🍬",img:"imagens/doces.jpg"},
{id:7,nome:"Pergaminho Encantado",preco:6.00,cat:"pergaminhos",emoji:"📜",img:"imagens/pergaminho.jpg"},
{id:8,nome:"Pergaminho Personalizado",preco:9.00,cat:"pergaminhos",emoji:"📜",img:"imagens/pergaminho-personalizado.jpg"},
{id:9,nome:"Galeão de Ouro",preco:20.00,cat:"galeões",emoji:"🪙",img:"imagens/galeao.jpg"},
{id:10,nome:"Kit de Galeões",preco:35.00,cat:"galeões",emoji:"🪙",img:"imagens/kit-galeoes.jpg"},
{id:11,nome:"Mini Vassoura",preco:18.00,cat:"vassouras",emoji:"🧹",img:"imagens/vassoura.jpg"},
{id:12,nome:"Vassoura Voadora Mini",preco:25.00,cat:"vassouras",emoji:"🧹",img:"imagens/vassoura-mini.jpg"},
{id:13,nome:"Varinha Mágica",preco:22.00,cat:"varinhas",emoji:"🪄",img:"imagens/varinha.jpg"},
{id:14,nome:"Varinha Especial",preco:30.00,cat:"varinhas",emoji:"🪄",img:"imagens/varinha-especial.jpg"}
];
let cesta=[];
let score=0;
let missions=0;
let missionFlags={purchase:false,calculation:false,challenge:false};

function addScore(points){
  score+=points;
  document.getElementById("score").textContent=score;
  const pct=Math.min(100,(missions/3)*100);
  document.getElementById("progressFill").style.width=pct+"%";
  document.getElementById("missions").textContent=missions+"/3";
}
function completeMission(key,title,text){
  if(missionFlags[key]) return;
  missionFlags[key]=true;
  missions++;
  addScore(5);
  if(missions>=3){
    setTimeout(()=>abrirConquista(title,text),250);
  }
}
function abrirConquista(title,text){
  document.getElementById("achievementTitle").textContent=title;
  document.getElementById("achievementText").textContent=text;
  document.getElementById("achievement").classList.add("show");
}
function fecharConquista(){document.getElementById("achievement").classList.remove("show");}


function moeda(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
function categorias(){
 const cats=[["todos","🛒 Todos"],["poções","🧪 Poções"],["feijõezinhos","🫘 Feijõezinhos"],["doces","🍬 Doces"],["pergaminhos","📜 Pergaminhos"],["galeões","🪙 Galeões"],["vassouras","🧹 Vassouras"],["varinhas","🪄 Varinhas"]];
 document.getElementById("categories").innerHTML=cats.map((c,i)=>`<button class="${i===0?"active":""}" onclick="filtrar('${c[0]}',this)">${c[1]}</button>`).join("");
}
function renderProdutos(cat="todos"){
 const arr=cat==="todos"?produtos:produtos.filter(p=>p.cat===cat);
 document.getElementById("products").innerHTML=arr.map(p=>`
 <article class="card">
  <div class="productImage">
   <img src="${p.img}" alt="${p.nome}" onload="this.style.display='block'" onerror="this.style.display='none'">
   <span>${p.emoji}</span>
  </div>
  <div class="cardBody">
   <h3>${p.nome}</h3><p>Produto do Mercadinho do Beco Diagonal</p>
   <div class="price">${moeda(p.preco)}</div>
   <div class="qty"><button onclick="alterarQtd(${p.id},-1)">−</button><input id="q-${p.id}" type="number" min="1" value="1"><button onclick="alterarQtd(${p.id},1)">+</button></div>
   <button class="buy" onclick="comprar(${p.id})">🛒 COMPRAR</button>
  </div>
 </article>`).join("");
}
function filtrar(cat,btn){document.querySelectorAll(".categories button").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderProdutos(cat);}
function alterarQtd(id,delta){let x=document.getElementById("q-"+id);x.value=Math.max(1,(parseInt(x.value)||1)+delta);}
function comprar(id){
 const p=produtos.find(x=>x.id===id), q=Math.max(1,parseInt(document.getElementById("q-"+id).value)||1);
 const item=cesta.find(x=>x.id===id);
 if(item)item.qtd+=q;else cesta.push({...p,qtd:q});
 completeMission("purchase","Comprador Encantado","Você completou a primeira missão: montar uma compra!");
 atualizar(); toast(`${p.nome} adicionado à cesta! +5 pontos`);
}
function mudarQtd(id,d){
 const i=cesta.find(x=>x.id===id);if(!i)return;
 i.qtd+=d;if(i.qtd<=0)cesta=cesta.filter(x=>x.id!==id);atualizar();
}
function atualizar(){
 const subtotal=cesta.reduce((s,p)=>s+p.preco*p.qtd,0);
 const desconto=subtotal>=50?subtotal*.10:0,total=subtotal-desconto;
 document.getElementById("headerCount").textContent=cesta.reduce((s,p)=>s+p.qtd,0);
 document.getElementById("subtotal").textContent=moeda(subtotal);
 document.getElementById("discount").textContent=moeda(desconto);
 document.getElementById("total").textContent=moeda(total);
 document.getElementById("cartList").innerHTML=cesta.length?cesta.map(p=>`
 <div class="cartLine">
  <div><b>${p.emoji} ${p.nome}</b><br><small>${moeda(p.preco)} por unidade</small></div>
  <div class="miniQty"><button onclick="mudarQtd(${p.id},-1)">−</button><b>${p.qtd}</b><button onclick="mudarQtd(${p.id},1)">+</button></div>
  <b>${moeda(p.preco*p.qtd)}</b>
  <button class="remove" onclick="remover(${p.id})">✕</button>
 </div>`).join(""):"<p style='padding:20px;text-align:center'>Sua cesta está vazia. Vá aos produtos e clique em <b>COMPRAR</b>.</p>";
 document.getElementById("mathLines").innerHTML=cesta.length?cesta.map(p=>`${moeda(p.preco)} × ${p.qtd} = <b>${moeda(p.preco*p.qtd)}</b>`).join("<br>")+"<hr style='margin:10px 0;border:0;border-top:1px solid #dfd2b8'>"+cesta.map(p=>moeda(p.preco*p.qtd)).join(" + ")+" = <b>"+moeda(subtotal)+"</b>":"Adicione produtos para ver as contas.";
 document.getElementById("discountMath").innerHTML=desconto?`10% de ${moeda(subtotal)} = ${moeda(desconto)}<br><b>${moeda(subtotal)} − ${moeda(desconto)} = ${moeda(total)}</b>`:`O desconto de 10% aparece quando o subtotal atingir R$ 50,00.`;
}
function remover(id){cesta=cesta.filter(x=>x.id!==id);atualizar();}
function calcularTroco(){
 const pago=parseFloat(document.getElementById("paid").value), total=valorTotal();
 if(!cesta.length)return document.getElementById("changeResult").innerHTML="Adicione produtos primeiro.";
 if(isNaN(pago))return document.getElementById("changeResult").innerHTML="Digite quanto o cliente pagou.";
 const dif=pago-total;
 document.getElementById("changeResult").innerHTML=dif>=0?`<b>${moeda(pago)} − ${moeda(total)} = ${moeda(dif)}</b><br>💵 Troco: <b>${moeda(dif)}</b>`:`Ainda faltam <b>${moeda(Math.abs(dif))}</b> para completar o pagamento.`;
 if(dif>=0) completeMission("calculation","Calculista de Elite","Você calculou o pagamento e dominou a subtração!");
}
function dividirConta(){
 const pessoas=parseInt(document.getElementById("people").value),total=valorTotal();
 if(!cesta.length)return document.getElementById("divisionResult").innerHTML="Adicione produtos primeiro.";
 if(!pessoas||pessoas<1)return document.getElementById("divisionResult").innerHTML="Informe pelo menos 1 pessoa.";
 document.getElementById("divisionResult").innerHTML=`<b>${moeda(total)} ÷ ${pessoas} = ${moeda(total/pessoas)}</b><br>👥 Cada pessoa paga aproximadamente <b>${moeda(total/pessoas)}</b>.`;
}
function valorTotal(){const s=cesta.reduce((a,p)=>a+p.preco*p.qtd,0);return s-(s>=50?s*.1:0);}
function irParaCesta(){document.getElementById("cesta").scrollIntoView();}
function responderDesafio(ok){document.getElementById("feedback").innerHTML=ok?"✨ ACERTOU! 5 × 3 = R$ 15,00.":"🪄 Quase! Pense em 5 + 5 + 5 ou 5 × 3."; if(ok) completeMission("challenge","Mestre da Matemática","Você completou as 3 missões e desbloqueou o título de Mestre da Matemática!");}
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800);}
categorias();renderProdutos();atualizar();

// ===== 2. Animacao de fundo do banner (ceu magico em canvas) =====
(() => {
  const canvas = document.getElementById('magicSky');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=0,h=0,dpr=1,stars=[],clouds=[],candles=[],t=0;

  function resize(){
    const r=canvas.getBoundingClientRect();
    dpr=Math.min(window.devicePixelRatio||1,2);
    w=Math.max(1,r.width); h=Math.max(1,r.height);
    canvas.width=w*dpr; canvas.height=h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.floor(Math.min(150, Math.max(65,w*h/6500)));
    stars=Array.from({length:n},()=>({
      x:Math.random()*w,y:Math.random()*h*.68,
      r:Math.random()*1.7+.25,a:Math.random()*.8+.15,
      p:Math.random()*Math.PI*2,s:Math.random()*.7+.25
    }));
    clouds=Array.from({length:6},(_,i)=>({
      x:Math.random()*w,y:h*(.12+i*.08),s:Math.random()*45+70,
      speed:(Math.random()*.10+.035)*(i%2?1:-1),a:Math.random()*.09+.035
    }));
    candles=Array.from({length:Math.max(5,Math.floor(w/170))},(_,i)=>({
      x:(i+.5)*w/Math.max(5,Math.floor(w/170)),y:h*(.16+Math.random()*.12),
      phase:Math.random()*6.28
    }));
  }

  function roundedCloud(c){
    ctx.save();
    ctx.globalAlpha=c.a;
    ctx.fillStyle='#d8d0e8';
    ctx.beginPath();
    ctx.ellipse(c.x,c.y,c.s*1.5,c.s*.35,0,0,Math.PI*2);
    ctx.ellipse(c.x-c.s*.55,c.y+4,c.s*.8,c.s*.3,0,0,Math.PI*2);
    ctx.ellipse(c.x+c.s*.65,c.y+3,c.s*.9,c.s*.31,0,0,Math.PI*2);
    ctx.fill();ctx.restore();
  }

  function castle(){
    const base=h*.67, scale=Math.min(w/1100,1.1);
    ctx.save();
    ctx.translate(w*.52,base);
    ctx.scale(scale,scale);
    ctx.fillStyle='#070914';
    ctx.shadowColor='#000';ctx.shadowBlur=25;

    // Montanha
    ctx.beginPath();ctx.moveTo(-520,25);ctx.lineTo(-350,-95);ctx.lineTo(-240,0);
    ctx.lineTo(-90,-135);ctx.lineTo(40,5);ctx.lineTo(210,-110);ctx.lineTo(500,30);ctx.closePath();ctx.fill();

    // Corpo do castelo
    ctx.fillRect(-245,-155,490,160);
    // Torres
    const towers=[[-250,-235,62],[-150,-285,54],[90,-270,58],[190,-230,66]];
    towers.forEach(([x,y,s])=>{
      ctx.fillRect(x,-5+y,s,160);
      ctx.beginPath();ctx.moveTo(x-10,y);ctx.lineTo(x+s/2,y-80);ctx.lineTo(x+s+10,y);ctx.closePath();ctx.fill();
    });
    // Torre central
    ctx.fillRect(-48,-330,96,335);
    ctx.beginPath();ctx.moveTo(-65,-330);ctx.lineTo(0,-435);ctx.lineTo(65,-330);ctx.closePath();ctx.fill();
    // Janelas mágicas
    ctx.shadowBlur=14;ctx.shadowColor='#e5c76d';
    ctx.fillStyle='#d9bc68';
    [[-210,-190],[-115,-225],[115,-210],[210,-175],[-22,-300],[0,-350],[22,-300]].forEach(([x,y])=>{
      ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
    });
    ctx.restore();
  }

  function draw(){
    t+=.012;
    ctx.clearRect(0,0,w,h);
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#050713');g.addColorStop(.52,'#10162d');g.addColorStop(1,'#060812');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);

    // Lua
    const mx=w*.78,my=h*.23,mr=Math.min(w,h)*.10;
    const moon=ctx.createRadialGradient(mx-mr*.2,my-mr*.2,2,mx,my,mr);
    moon.addColorStop(0,'#fff4bd');moon.addColorStop(.62,'#d9c98c');moon.addColorStop(1,'#b6a66d00');
    ctx.fillStyle=moon;ctx.fillRect(mx-mr*1.6,my-mr*1.6,mr*3.2,mr*3.2);

    // Estrelas pulsantes
    stars.forEach(s=>{
      const a=s.a*(.55+.45*Math.sin(t*s.s+s.p));
      ctx.globalAlpha=a;ctx.fillStyle='#fff0b1';
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=1;

    clouds.forEach(c=>{c.x+=c.speed;if(c.x>w+180)c.x=-180;if(c.x<-180)c.x=w+180;roundedCloud(c)});
    castle();

    // Velas flutuantes
    candles.forEach(c=>{
      const yy=c.y+Math.sin(t*1.2+c.phase)*5;
      ctx.save();
      ctx.translate(c.x,yy);
      ctx.fillStyle='#d8c28d';ctx.fillRect(-2,0,4,24);
      const flick=.65+.35*Math.sin(t*7+c.phase);
      ctx.globalAlpha=flick;
      ctx.fillStyle='#ffd976';ctx.shadowColor='#ffd976';ctx.shadowBlur=18;
      ctx.beginPath();ctx.ellipse(0,-4,3,7,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    });

    // Partículas que atravessam o banner
    for(let i=0;i<5;i++){
      const x=((t*18+i*190)%(w+100))-50;
      const y=h*(.22+i*.11)+Math.sin(t*1.4+i)*18;
      ctx.globalAlpha=.25;
      ctx.fillStyle='#e8cc78';
      ctx.beginPath();ctx.arc(x,y,1.7,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize,{passive:true});
  resize();draw();
})();