// Cuaderno de muestra (moraestudios.com/cuaderno/demo.html) para la landing.
// Reemplaza a supabase.js: no se conecta a nada. Arma en memoria una alumna de ejemplo («Alex», 6 clases)
// con fechas relativas a hoy, así nunca se ve vieja. Lo que el visitante hace solo vive en su navegador.
(function(){
  const DAY=864e5, now=new Date();
  const ymd=d=>{ const x=new Date(d); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  // Clases los martes y jueves: las 6 últimas antes de hoy y la próxima después.
  const days=[]; for(let d=new Date(now.getTime()-DAY); days.length<6; d=new Date(d.getTime()-DAY)){ if(d.getDay()===2||d.getDay()===4) days.unshift(ymd(d)); }
  let nx=new Date(now.getTime()+DAY); while(nx.getDay()!==2&&nx.getDay()!==4) nx=new Date(nx.getTime()+DAY);
  const next=ymd(nx)+'T17:00:00-05:00';
  const me={id:'demo',email:'alex@example.com',name:'Alex',role:'student',paid:false};
  const docs=[
    ['notebook/profile',{name:'Alex',level:'Beginner',plan:'1-on-1',days:'Tuesdays and Thursdays',start:days[0],sessions:6,next:next,meet:'',goal:'Order food, make friends and get around Medellín in Spanish.',
      note:{date:days[5],text:'Alex, great class! You ordered a full lunch without English. This week, ask for la cuenta yourself, every time. ¡Nos vemos el '+(nx.getDay()===2?'martes':'jueves')+'!'},
      test:{date:ymd(now.getTime()-21*DAY),level:'Beginner',score:3,total:12}}],
    ['notebook/stamps',{done:{1:days[1],2:days[3]}}],
    ['notebook/files',{items:[{type:'Link',title:'Your level test',note:'Take it again in week 8 and compare with where you started.',url:'https://moraestudios.com/level-test/',date:days[0]}]}],
    ['notebook/list',{items:[
      {cat:'Playlist',title:'Llorarás',detail:'Oscar D\'León. “Llorarás” means “you will cry”. The future tense in one word.',url:'https://open.spotify.com/track/5AU8zGfBM0tiZe7NZiNIWD'},
      {cat:'Playlist',title:'Si antes te hubiera conocido',detail:'Karol G is from Medellín. The title is a “what if” sentence you\'ll learn in class.',url:'https://open.spotify.com/track/7aIihFO27rZAm341KdIBA7'},
      {cat:'Playlist',title:'Chorrito pa las ánimas',detail:'Feid is from Medellín. The chorus everyone shouts at once.',url:'https://open.spotify.com/track/0MQeLXBUFsThBMTrqzFjgH'},
      {cat:'Watch',title:'Café con aroma de mujer',detail:'A love story on a coffee farm. Clear, unhurried dialogue.',url:'https://www.netflix.com/title/81396406'},
      {cat:'Places',title:'Plaza Minorista',detail:'The market. Buy three fruits you\'ve never tried and ask what they\'re called.',url:'https://www.google.com/maps/search/?api=1&query=Plaza+Minorista+Medell%C3%ADn'},
      {cat:'Places',title:'La 70, Laureles',detail:'Salsa and bars. Ask for a table, order a round and ask someone to teach you a step.',url:'https://www.google.com/maps/search/?api=1&query=La+70+Laureles+Medell%C3%ADn'},
      {cat:'Places',title:'Comuna 13',detail:'Take the graffiti tour in Spanish and ask your guide two questions.',url:'https://www.google.com/maps/search/?api=1&query=Comuna+13+Medell%C3%ADn'},
      {cat:'AI tools',title:'Check a message before you send it',detail:'Paste this into Claude or ChatGPT with the message you want to send.',prompt:'I\'m a beginner learning Colombian Spanish. Correct this message so it sounds natural in Medellín. Keep it simple and explain each change in one line of English: [paste your message]',url:''},
      {cat:'Apps',title:'SpanishDict',detail:'A dictionary with examples, conjugations and audio for every word.',url:'https://www.spanishdict.com/'}]}],
    ['classes/s01',{n:1,date:days[0],fixes:[['Mi nombre es Alex.','Me llamo Alex.','Both are correct. "Me llamo" is what people actually say.'],['Yo soy de Chicago.','Soy de Chicago.','You can drop "yo". The verb already says who.'],['Estoy de Chicago.','Soy de Chicago.','Where you are from uses "ser".']],after:{},extra:[],comment:''}],
    ['classes/s02',{n:2,date:days[1],after:{},extra:[],comment:''}],
    ['classes/s03',{n:3,date:days[2],after:{},extra:[],comment:''}],
    ['classes/s04',{n:4,date:days[3],after:{},extra:[],comment:''}],
    ['classes/s05',{n:5,date:days[4],after:{},extra:[],comment:''}],
    ['classes/s06',{n:6,date:days[5],after:{},extra:[['Order a coffee and a pandebono for a friend.','Para mi amigo, un tinto y un pandebono, por favor.']],comment:'You sounded like a local at the bakery today. Keep the «por favor» at the end.'}]
  ].map(([path,data])=>({student:'demo',path:path,data:data}));
  const db={students:[me],docs:docs,lessons:[],settings:[]};
  const pk={docs:['student','path']};
  function Q(t){ this.t=t; this.f=[]; this.op='select'; this.one=null; this.ord=null; this.rng=null; this.payload=null; }
  ['select','order'].forEach(m=>{ Q.prototype[m]=function(){ return this; }; });
  Q.prototype.eq=function(k,v){ this.f.push([k,v]); return this; };
  Q.prototype.range=function(a,b){ this.rng=[a,b]; return this; };
  Q.prototype.maybeSingle=function(){ this.one=true; return this; };
  Q.prototype.single=function(){ this.one=true; return this; };
  Q.prototype.upsert=function(r){ this.op='upsert'; this.payload=r; return this; };
  Q.prototype.insert=Q.prototype.upsert;
  Q.prototype.update=function(r){ this.op='update'; this.payload=r; return this; };
  Q.prototype.delete=function(){ this.op='delete'; return this; };
  Q.prototype.then=function(ok,no){ return Promise.resolve().then(()=>this.run()).then(ok,no); };
  Q.prototype.run=function(){ const t=this.t, rows=db[t]||[], match=x=>this.f.every(([k,v])=>x[k]===v);
    if(this.op==='select'){ let out=rows.filter(match); if(this.rng) out=out.slice(this.rng[0],this.rng[1]+1); out=JSON.parse(JSON.stringify(out));
      return this.one?{data:out[0]||null,error:null}:{data:out,error:null}; }
    if(t!=='docs') return {data:null,error:{message:'demo'}};
    if(this.op==='upsert'){ const row=Object.assign({},this.payload), i=rows.findIndex(x=>pk.docs.every(k=>x[k]===row[k])); if(i>=0) rows[i]=row; else rows.push(row); return {data:[row],error:null}; }
    if(this.op==='delete'){ db[t]=rows.filter(x=>!match(x)); return {data:null,error:null}; }
    return {data:null,error:null}; };
  const session={user:{email:me.email},access_token:'demo'};
  window.supabase={createClient(){ return { from:t=>new Q(t),
    rpc:async()=>({data:true,error:null}),
    auth:{ getSession:async()=>({data:{session:session}}),
      onAuthStateChange(cb){ setTimeout(()=>cb('INITIAL_SESSION',session),0); return {data:{subscription:{unsubscribe(){}}}}; },
      signInWithOtp:async()=>({error:null}), verifyOtp:async()=>({error:null}), signOut:async()=>({error:null}) } }; }};
})();
