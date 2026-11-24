const CITIES=["Delhi NCR","Mumbai","Bengaluru","Hyderabad","Chennai","Pune","Jaipur","Kolkata","Ahmedabad","Goa"];
const TYPES=["Hatchback","Sedan","SUV","MUV","Electric","Traveller"];
const SEED=[
{id:1,n:"Maruti Swift",t:"Hatchback",p:1800,s:5,g:"Manual",f:"Petrol",c:"#d9462f",bags:2,on:true},
{id:2,n:"Tata Tiago EV",t:"Electric",p:2400,s:5,g:"Automatic",f:"Electric",c:"#2f7bb6",bags:2,on:true},
{id:3,n:"Honda City",t:"Sedan",p:2800,s:5,g:"Automatic",f:"Petrol",c:"#8996a1",bags:3,on:true},
{id:4,n:"Hyundai Creta",t:"SUV",p:3400,s:5,g:"Automatic",f:"Diesel",c:"#24323f",bags:3,on:true},
{id:5,n:"Mahindra Thar",t:"SUV",p:4200,s:4,g:"Manual",f:"Diesel",c:"#c4831c",bags:2,on:true},
{id:6,n:"Tata Nexon EV",t:"Electric",p:3600,s:5,g:"Automatic",f:"Electric",c:"#2f8f68",bags:3,on:true},
{id:7,n:"Toyota Innova Crysta",t:"MUV",p:4800,s:7,g:"Manual",f:"Diesel",c:"#d7dadc",bags:4,on:true},
{id:8,n:"Force Tempo Traveller",t:"Traveller",p:7500,s:12,g:"Manual",f:"Diesel",c:"#eceeed",bags:10,on:true}];
const EXTRAS=[{k:"drv",n:"Chauffeur driver",p:900},{k:"zd",n:"Zero-depreciation cover",p:300},{k:"seat",n:"Child seat",p:150},{k:"fast",n:"FASTag with ₹500 balance",p:0,flat:500}];
const GST=0.18,STAT=["Confirmed","Picked up","Returned","Cancelled"];
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const inr=n=>"₹"+Math.round(n).toLocaleString("en-IN");
const fmt=s=>new Date(s+"T00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let fleet=load("rr2_fleet",SEED);
let bookings=load("rr2_book",[
{ref:"RR-A1B2C",name:"Anita Sharma",phone:"9876543210",car:"Hyundai Creta",city:"Mumbai",from:"2026-11-20",to:"2026-11-23",total:12036,pay:"UPI",status:"Confirmed"},
{ref:"RR-D3E4F",name:"Rohit Verma",phone:"9123456780",car:"Maruti Swift",city:"Jaipur",from:"2026-11-18",to:"2026-11-19",total:2124,pay:"Pay at pickup",status:"Picked up"}]);
const st={cat:"All",sort:"p",car:null,extras:new Set(),pay:"UPI"};

$("#loc").innerHTML=CITIES.map(c=>`<option>${c}</option>`).join("");
$("#at").innerHTML=TYPES.map(c=>`<option>${c}</option>`).join("");
const iso=d=>d.toISOString().slice(0,10),now=Date.now();
$("#from").min=$("#to").min=iso(new Date(now));
$("#from").value=iso(new Date(now+864e5));$("#to").value=iso(new Date(now+3*864e5));
const days=()=>{const n=Math.round((new Date($("#to").value)-new Date($("#from").value))/864e5);return isNaN(n)||n<1?1:n};

function art(c){
  const [x1,x2,top,by]={Hatchback:[56,150,18,40],Sedan:[46,162,20,40],Electric:[50,156,19,40],SUV:[36,170,12,38],MUV:[30,176,10,36],Traveller:[22,182,8,32]}[c.t]||[46,162,20,40];
  const m=(x1+x2)/2;
  return `<svg viewBox="0 0 200 84" role="img" aria-label="${esc(c.n)}"><ellipse cx="100" cy="79" rx="88" ry="3.5" fill="#000" opacity=".14"/>
  <path d="M${x1} ${by} L${x1+10} ${top+7} Q${x1+14} ${top} ${x1+26} ${top} L${x2-28} ${top} Q${x2-14} ${top} ${x2-8} ${top+9} L${x2} ${by} Z" fill="${c.c}"/>
  <path d="M${x1+14} ${by-2} L${x1+21} ${top+7} L${m-3} ${top+7} L${m-3} ${by-2} Z M${m+3} ${by-2} L${m+3} ${top+7} L${x2-28} ${top+7} Q${x2-17} ${top+7} ${x2-13} ${top+12} L${x2-7} ${by-2} Z" fill="#a9cde0" opacity=".9"/>
  <rect x="8" y="${by-2}" width="184" height="30" rx="13" fill="${c.c}"/>
  <rect x="${m}" y="${top+8}" width="1.2" height="${by+20-top-8}" fill="#000" opacity=".16"/>
  <rect x="8" y="${by+19}" width="184" height="4" fill="#000" opacity=".16"/>
  <circle cx="48" cy="66" r="16" fill="#000" opacity=".3"/><circle cx="152" cy="66" r="16" fill="#000" opacity=".3"/>
  <circle cx="48" cy="68" r="12.5" fill="#12181c"/><circle cx="152" cy="68" r="12.5" fill="#12181c"/>
  <circle cx="48" cy="68" r="5.5" fill="#b5bfc6"/><circle cx="152" cy="68" r="5.5" fill="#b5bfc6"/>
  <rect x="186" y="${by+6}" width="7" height="5" rx="2" fill="#ffe28a"/><rect x="7" y="${by+6}" width="5" height="5" rx="2" fill="#d63a2f"/></svg>`}

function renderChips(){
  const on=fleet.filter(c=>c.on),cats=["All",...new Set(on.map(c=>c.t))];
  if(!cats.includes(st.cat))st.cat="All";
  $("#chips").innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===st.cat}" data-c="${c}"><span>${c}</span><span>${c==="All"?on.length:on.filter(x=>x.t===c).length}</span></button>`).join("");
  document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{st.cat=b.dataset.c;renderChips();renderGrid()});
}
function renderGrid(){
  const d=days();
  const list=fleet.filter(c=>c.on&&(st.cat==="All"||c.t===st.cat)).sort((a,b)=>st.sort==="p"?a.p-b.p:st.sort==="s"?b.s-a.s:a.n.localeCompare(b.n));
  $("#count").textContent=`${list.length} ${list.length===1?"car":"cars"} in ${$("#loc").value} for ${d} ${d===1?"day":"days"}`;
  $("#grid").innerHTML=list.length?list.map(c=>`<article class="car">${art(c)}
  <div><h3>${esc(c.n)}</h3><p class="sub">${c.t}</p>
  <ul class="specs"><li>${c.s} seats</li><li>${c.bags} bags</li><li>${c.g}</li><li>${c.f}</li></ul></div>
  <div class="buy"><div><div class="price">${inr(c.p)}<small> a day</small></div><span class="total">${inr(c.p*d)} for ${d} ${d===1?"day":"days"}</span></div>
  <button class="btn" data-id="${c.id}">Book this car</button></div></article>`).join(""):`<div class="empty">No cars in this category right now. Choose another car type.</div>`;
  document.querySelectorAll(".btn[data-id]").forEach(b=>b.onclick=()=>{st.car=fleet.find(c=>c.id==b.dataset.id);st.extras=new Set();st.pay="UPI";draw();$("#dlg").showModal()});
}
function totals(){
  const d=days(),c=st.car,base=c.p*d;
  const ex=EXTRAS.filter(e=>st.extras.has(e.k)).map(e=>({n:e.n,v:e.flat||e.p*d}));
  const sub=base+ex.reduce((a,e)=>a+e.v,0),gst=sub*GST;
  return {d,base,ex,gst,total:sub+gst};
}
function draw(keep){
  const c=st.car,t=totals(),v=keep||{};
  $("#dbody").innerHTML=`<div class="row"><h2 id="dt" style="margin:0;font-size:22px">${esc(c.n)}</h2><button class="line" id="x">Close</button></div>
  <div style="color:var(--muted);font-size:14px">Pickup in ${$("#loc").value}, ${fmt($("#from").value)} to ${fmt($("#to").value)}</div>
  <div><label for="nm">Full name</label><input id="nm" autocomplete="name" value="${esc(v.nm||"")}"></div>
  <div><label for="ph">Mobile number (+91)</label><input id="ph" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="10-digit number" value="${esc(v.ph||"")}"></div>
  ${EXTRAS.map(e=>`<label class="extra"><span><input type="checkbox" data-k="${e.k}" ${st.extras.has(e.k)?"checked":""}>${e.n}</span><span>${e.flat?inr(e.flat):inr(e.p)+" a day"}</span></label>`).join("")}
  <div class="pay" role="radiogroup" aria-label="Payment method">${["UPI","Card","Pay at pickup"].map(p=>`<label><input type="radio" name="pay" value="${p}" ${st.pay===p?"checked":""}> ${p}</label>`).join("")}</div>
  <div class="sum"><div class="row"><span>${t.d} ${t.d===1?"day":"days"} at ${inr(c.p)}</span><span>${inr(t.base)}</span></div>
  ${t.ex.map(e=>`<div class="row"><span>${e.n}</span><span>${inr(e.v)}</span></div>`).join("")}
  <div class="row"><span>GST at 18%</span><span>${inr(t.gst)}</span></div>
  <div class="row grand"><span>Total</span><span>${inr(t.total)}</span></div></div>
  <p class="err" id="err" role="alert"></p><button class="btn" id="ok">Confirm booking</button>`;
  $("#x").onclick=()=>$("#dlg").close();
  const snap=()=>({nm:$("#nm").value,ph:$("#ph").value});
  document.querySelectorAll(".extra input").forEach(i=>i.onchange=()=>{const s=snap();i.checked?st.extras.add(i.dataset.k):st.extras.delete(i.dataset.k);draw(s)});
  document.querySelectorAll("[name=pay]").forEach(r=>r.onchange=()=>st.pay=r.value);
  $("#ok").onclick=()=>{
    const nm=$("#nm").value.trim(),ph=$("#ph").value.trim();
    if(!nm||!/^[6-9]\d{9}$/.test(ph)){$("#err").textContent="Enter your full name and a valid 10-digit Indian mobile number to confirm.";return}
    const ref="RR-"+Math.random().toString(36).slice(2,7).toUpperCase();
    bookings.unshift({ref,name:nm,phone:ph,car:c.n,city:$("#loc").value,from:$("#from").value,to:$("#to").value,total:Math.round(t.total),pay:st.pay,status:"Confirmed"});
    save("rr2_book",bookings);
    $("#dbody").innerHTML=`<h2 id="dt" style="margin:0;font-size:22px">Booking confirmed</h2><div class="ref">${ref}</div>
    <p style="margin:0">${esc(c.n)} is reserved in ${$("#loc").value} for ${t.d} ${t.d===1?"day":"days"}. Confirmation goes to +91 ${esc(ph)}.</p>
    <p style="margin:0;color:var(--muted);font-size:14px">Carry your driving licence and Aadhaar to the pickup point. Amount due: ${inr(t.total)} (${st.pay}).</p>
    <button class="btn" id="done">Done</button>`;
    $("#done").onclick=()=>$("#dlg").close();
  };
}

function renderAdmin(){
  const live=bookings.filter(b=>b.status!=="Cancelled");
  $("#stats").innerHTML=[[bookings.length,"Bookings"],[inr(live.reduce((a,b)=>a+b.total,0)),"Revenue, excluding cancelled"],[bookings.filter(b=>b.status==="Picked up").length,"Cars on the road"],[fleet.filter(c=>c.on).length+" of "+fleet.length,"Cars available"]].map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join("");
  $("#btable").innerHTML=bookings.length?`<table><thead><tr><th>Reference</th><th>Customer</th><th>Car</th><th>City</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead><tbody>${bookings.map((b,i)=>`<tr><td>${esc(b.ref)}</td><td>${esc(b.name)}<br><small style="color:var(--muted)">+91 ${esc(b.phone)}</small></td><td>${esc(b.car)}</td><td>${esc(b.city)}</td><td>${fmt(b.from)} to ${fmt(b.to)}</td><td>${inr(b.total)}</td><td><select data-i="${i}" class="bs" aria-label="Status for ${esc(b.ref)}">${STAT.map(s=>`<option ${s===b.status?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table>`:`<p class="count">No bookings yet. New bookings appear here.</p>`;
  document.querySelectorAll(".bs").forEach(s=>s.onchange=()=>{bookings[s.dataset.i].status=s.value;save("rr2_book",bookings);renderAdmin()});
  $("#ftable").innerHTML=`<table><thead><tr><th>Car</th><th>Type</th><th>Price a day (₹)</th><th>Listing</th><th></th></tr></thead><tbody>${fleet.map(c=>`<tr><td>${esc(c.n)}</td><td>${c.t}</td><td><input type="number" min="500" value="${c.p}" data-id="${c.id}" class="fp" aria-label="Price for ${esc(c.n)}"></td><td><span class="tag">${c.on?"Visible":"Hidden"}</span></td><td><button class="line ft" data-id="${c.id}">${c.on?"Hide":"Show"}</button> <button class="line fd" data-id="${c.id}">Remove</button></td></tr>`).join("")}</tbody></table>`;
  document.querySelectorAll(".fp").forEach(i=>i.onchange=()=>{const v=+i.value;if(v>=500){fleet.find(c=>c.id==i.dataset.id).p=v;save("rr2_fleet",fleet);renderGrid()}});
  document.querySelectorAll(".ft").forEach(b=>b.onclick=()=>{const c=fleet.find(c=>c.id==b.dataset.id);c.on=!c.on;save("rr2_fleet",fleet);renderAdmin();renderChips();renderGrid()});
  document.querySelectorAll(".fd").forEach(b=>b.onclick=()=>{fleet=fleet.filter(c=>c.id!=b.dataset.id);save("rr2_fleet",fleet);renderAdmin();renderChips();renderGrid()});
}
$("#addbtn").onclick=()=>{
  const n=$("#an").value.trim(),p=+$("#ap").value;
  if(!n||!(p>=500)){$("#aerr").textContent="Enter a car name and a daily price of ₹500 or more.";return}
  $("#aerr").textContent="";
  const cols=["#d9462f","#2f7bb6","#2f8f68","#c4831c","#7a5cc4","#24323f"];
  fleet.push({id:Date.now(),n,t:$("#at").value,p,s:5,g:"Manual",f:"Petrol",c:cols[fleet.length%cols.length],bags:2,on:true});
  save("rr2_fleet",fleet);$("#an").value=$("#ap").value="";renderAdmin();renderChips();renderGrid();
};
function view(a){$("#cust").hidden=a;$("#admin").hidden=!a;$("#tc").setAttribute("aria-pressed",!a);$("#ta").setAttribute("aria-pressed",a);if(a)renderAdmin();window.scrollTo(0,0)}
$("#tc").onclick=()=>view(false);$("#ta").onclick=()=>view(true);
$("#sort").onchange=e=>{st.sort=e.target.value;renderGrid()};
$("#loc").onchange=renderGrid;
["from","to"].forEach(i=>$("#"+i).onchange=()=>{if($("#to").value<=$("#from").value)$("#to").value=iso(new Date(new Date($("#from").value).getTime()+864e5));renderGrid()});
$("#go").onclick=()=>{renderGrid();$("#fleet").scrollIntoView({behavior:"smooth"})};
renderChips();renderGrid();
