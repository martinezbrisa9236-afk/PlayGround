import * as THREE from 'three';

const el=id=>document.getElementById(id);
const game=el('game'), scene=new THREE.Scene(); scene.background=new THREE.Color('#86c9bd'); scene.fog=new THREE.Fog('#86c9bd',38,82);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,150);
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(innerWidth,innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; game.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight('#fff4dc','#5d8c77',2.2)); const sun=new THREE.DirectionalLight('#fff2b8',2.4); sun.position.set(-20,35,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const tex=()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#82a95c';x.fillRect(0,0,128,128);x.fillStyle='#91b66a';for(let i=0;i<300;i++)x.fillRect(Math.random()*128,Math.random()*128,2,2);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(20,20);return t};
const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({map:tex(),roughness:.9}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
function mat(c){return new THREE.MeshStandardMaterial({color:c,roughness:.82})}
function box(w,h,d,c,x=0,y=h/2,z=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;scene.add(m);return m}
function cyl(rt,rb,h,c,x,y,z,seg=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat(c));m.position.set(x,y,z);m.castShadow=true;scene.add(m);return m}
// Roads
box(8,.04,90,'#d9c6a4',0,.02,0);box(90,.04,7,'#d9c6a4',0,.02,5);
// Buildings
function house(x,z,w,d,color,roof='#8a5038'){box(w,5,d,color,x,2.5,z);const roofMesh=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*.72,3,4),mat(roof));roofMesh.position.set(x,6.5,z);roofMesh.rotation.y=Math.PI/4;roofMesh.scale.z=d/w*.9;roofMesh.castShadow=true;scene.add(roofMesh);box(.12,2.4,.12,'#70452f',x-1,1.2,z+d/2+.08);box(.12,1.3,.12,'#70452f',x+1,2,z+d/2+.08)}
house(-18,-12,12,9,'#efcba1');house(17,-12,13,9,'#d88a67');house(-20,20,14,10,'#f2d9aa');house(20,22,13,10,'#91aa83');
// Plaza and fountain
cyl(5.8,5.8,.35,'#b8b09b',0,.18,-18);cyl(4.7,4.7,.25,'#69b4ad',0,.4,-18);cyl(.7,.9,2.2,'#d6cbb1',0,1.4,-18);cyl(1.8,1.8,.08,'#9ad2c9',0,2.55,-18);
// Bench, market
box(5,.18,1.2,'#9a6848',-12,.8,5);box(.15,1,.15,'#4d4d43',-14,.5,5);box(.15,1,.15,'#4d4d43',-10,.5,5);box(7,3,3,'#c66843',13,1.5,-2);box(7,.25,3.5,'#f2d79c',13,3.1,-2);
// Trees
function tree(x,z,s=1){cyl(.25,.35,2.2,'#7b593d',x,1.1,z);const g=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7*s,1),mat('#557a4d'));g.position.set(x,3.2,z);g.castShadow=true;scene.add(g)}[[-28,-5],[-31,8],[-27,28],[28,-8],[30,10],[27,31],[-8,-29],[9,-29],[34,-20],[-34,-21]].forEach(p=>tree(p[0],p[1],.8+Math.random()*(.35)));
// Street lamps
function lamp(x,z){cyl(.12,.16,4,'#44524d',x,2,z);const l=new THREE.Mesh(new THREE.SphereGeometry(.35,12,8),mat('#ffe2a0'));l.position.set(x,4.15,z);scene.add(l)}lamp(-7,-6);lamp(7,-6);lamp(-7,18);lamp(7,18);

function person(color,shirt,skin='#b9784e',name='') {const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.48,1.1,5,8),mat(shirt));body.position.y=1.55;body.castShadow=true;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.48,16,12),mat(skin));head.position.y=2.72;head.castShadow=true;g.add(head);const hair=new THREE.Mesh(new THREE.SphereGeometry(.5,12,8,0,Math.PI*2,0,Math.PI*.48),mat(color));hair.position.y=2.88;g.add(hair);const legGeo=new THREE.CapsuleGeometry(.16,.75,4,6);[-.22,.22].forEach(x=>{const l=new THREE.Mesh(legGeo,mat('#39444d'));l.position.set(x,.45,0);l.castShadow=true;g.add(l)});scene.add(g);g.userData.name=name;return g}
const player=person('#3b302b','#df7651','#bd8058','Tú');player.position.set(0,0,9);player.scale.setScalar(.95);
const npcs=[{g:person('#7a4a32','#4d7a67','#b9784e','Nora'),p:[-15,-12],dialog:'¡Hola! Soy Nora. La panadería siempre necesita manos para repartir.'},{g:person('#4d3b31','#d6aa45','#d09a70','Mateo'),p:[13,-1],dialog:'Hey, soy Mateo. Si ordenas las cajas del mercado, te pagaré al instante.'},{g:person('#b05b45','#7896a3','#a56e50','Lina'),p:[-18,20],dialog:'La plaza está preciosa hoy. ¿Puedes ayudarme a limpiar un poco?'},{g:person('#2f3739','#a05c51','#9b6549','Tomás'),p:[20,22],dialog:'Soy Tomás. En el taller pago bien por reparar lámparas.'}];npcs.forEach(n=>n.g.position.set(n.p[0],0,n.p[1]));

const state={money:250,energy:100,day:1,hour:8,minute:30,quests:0,near:null};
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLower=='e')interact()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-dir]').forEach(b=>{const d=b.dataset.dir;b.addEventListener('touchstart',e=>{e.preventStop?.();keys[d==='up'?'w':d==='down'?'s':d==='left'?'a':'d']=true},{passive:false});b.addEventListener('touchend',()=>keys[d==='up'?'w':d==='down'?'s':d==='left'?'a':'d']=false)});
let timeAcc=0;function updateUI(){el('money').textContent=state.money;el('energy').textContent=state.energy+'%';el('time').textContent=String(state.hour).padStart(2,'0')+':'+String(state.minute).padStart(2,'0');el('day').textContent=['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'][state.day%7]+' '+state.day}
function toast(t){el('toast').textContent=t;el('toast').classList.add('show');setTimeout(()=>el('toast').classList.remove('show'),1800)}
function interact(){if(state.near?.kind==='npc')openNpc(state.near.n);else if(state.near?.kind==='job')openJob(state.near.job)}
function openNpc(n){el('dialog').classList.remove('hidden');el('npcTitle').textContent=n.g.userData.name;el('npcText').textContent=n.dialog;el('portrait').textContent=n.g.userData.name[0];el('choices').innerHTML=`<button class="choice" id="chatChoice">Hablar</button><button class="choice" id="jobChoice">¿Trabajo?</button>`;el('chatChoice').onclick=()=>openChat(n.g.userData.name,n.dialog);el('jobChoice').onclick=()=>openJob(n.g.userData.name==='Nora'?jobs[0]:n.g.userData.name==='Mateo'?jobs[1]:n.g.userData.name==='Lina'?jobs[2]:jobs[3])}
el('closeDialog').onclick=()=>el('dialog').classList.add('hidden');
const jobs=[{title:'Repartir pan',desc:'Lleva pedidos entre las calles del pueblo.',pay:45,energy:12,place:'Panadería'},{title:'Ordenar mercado',desc:'Clasifica cajas y prepara puestos.',pay:60,energy:15,place:'Mercado'},{title:'Limpiar la plaza',desc:'Recoge hojas y deja impecable la plaza.',pay:35,energy:10,place:'Plaza'},{title:'Reparar taller',desc:'Arregla lámparas y herramientas viejas.',pay:80,energy:20,place:'Taller'}];
function openJob(j){el('dialog').classList.add('hidden');el('jobPanel').classList.remove('hidden');el('jobTitle').textContent=j.title;el('jobDesc').textContent=j.desc;el('jobPay').textContent='$'+j.pay;el('jobEnergy').textContent='-'+j.energy+'%'}
document.querySelector('.jobClose').onclick=()=>el('jobPanel').classList.add('hidden');el('jobAction').onclick=()=>{const j=jobs.find(x=>x.title===el('jobTitle').textContent);if(state.energy<j.energy){toast('Estás muy cansado');return}state.energy-=j.energy;state.money+=j.pay;state.quests++;el('questBar').style.width=Math.min(100,state.quests*25)+'%';el('questText').textContent=state.quests>=4?'Meta cumplida: independencia':'Trabajos completados '+state.quests+'/4';el('jobPanel').classList.add('hidden');toast('¡Ganaste $'+j.pay+'!')};

function openChat(name='Nuevo vecino',first='Hola'){el('chat').classList.remove('hidden');el('chatName').textContent=name;el('messages').innerHTML=`<div class="msg bot">${first}</div>`}
el('openChat').onclick=()=>openChat();el('closeChat').onclick=()=>el('chat').classList.add('hidden');
function botReply(text,name){text=text.toLowerCase();if(/dinero|trabajo|ganar/.test(text))return 'Prueba uno de los trabajos del pueblo. Cada día tienes energía para hacerlo.';if(/hola|buenas/.test(text))return 'Hola, vecino. Me alegra que estés construyendo una vida aquí.';if(/cansad|descans/.test(text))return 'Puedes volver mañana: la energía se recupera poco a poco mientras pasa el tiempo.';if(/plaza|pueblo/.test(text))return 'La plaza es el corazón del pueblo. En ella siempre pasan cosas buenas.';if(/compr|casa|arriendo/.test(text))return 'La independencia cuesta disciplina. Administra tus ahorros y no gastes toda la energía.';return 'Entiendo. Cuéntame más: ¿qué sueño tienes para tu vida en este pueblo?'}
function sendChat(){const input=el('chatInput'),t=input.value.trim();if(!t)return;el('messages').insertAdjacentHTML('beforeend','<div class="msg user">'+t.replace(/[<>]/g,'')+'</div>');input.value='';setTimeout(()=>{const r=botReply(t,el('chatName').textContent);el('messages').insertAdjacentHTML('beforeend','<div class="msg bot">'+r+'</div>');el('messages').scrollTop=el('messages').scrollHeight;speak(r)},350)}el('send').onclick=sendChat;el('chatInput').onkeydown=e=>{if(e.key==='Enter')sendChat()};
let recognition;function speak(t){if(!speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='es-ES';u.rate=.95;speechSynthesis.speak(u)}
if('SpeechRecognition'in window||'webkitSpeechRecognition'in window){recognition=new(window.SpeechRecognition||window.webkitSpeechRecognition);recognition.lang='es-ES';recognition.continuous=false;recognition.onresult=e=>{el('chatInput').value=e.results[0][0].transcript;sendChat()};recognition.onend=()=>el('mic').classList.remove('listening')}
el('mic').onclick=()=>{if(recognition){el('mic').classList.add('listening');recognition.start()}else toast('El dictado no está disponible aquí')};

// job markers
const markers=[];const markerDefs=[{p:[-18,-12],job:jobs[0],t:'Panadería'},{p:[13,-2],job:jobs[1],t:'Mercado'},{p:[0,-18],job:jobs[2],t:'Plaza'},{p:[20,22],job:jobs[3],t:'Taller'}];markerDefs.forEach((m,i)=>{const g=new THREE.Mesh(new THREE.CylinderGeometry(.65,.65,.12,16),mat(['#f0bf56','#78a87a','#73aac5','#bb6f62'][i]));g.position.set(m.p[0],.12,m.p[1]);g.rotation.x=0;scene.add(g);markers.push({g,...m,kind:'job'})});

camera.position.set(0,12,22);camera.lookAt(player.position);
let clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);let dx=0,dz=0;if(keys.w||keys.arrowup)dz-=1;if(keys.s||keys.arrowdown)dz+=1;if(keys.a||keys.arrowleft)dx-=1;if(keys.d||keys.arrowright)dx+=1;if(dx||dz){const l=Math.hypot(dx,dz);dx/=l;dz/=l;player.position.x+=dx*dt*5.2;player.position.z+=dz*dt*5.2;player.position.x=THREE.MathUtils.clamp(player.position.x,-39,39);player.position.z=THREE.MathUtils.clamp(player.position.z,-39,39);player.rotation.y=Math.atan2(dx,dz)}
let near=null,dist=1.9;npcs.forEach(n=>{const d=player.position.distanceTo(n.g.position);if(d<dist){dist=d;near={kind:'npc',n:n.g}}});markers.forEach(m=>{const d=player.position.distanceTo(m.g.position);if(d<dist){dist=d;near={kind:'job',job:m.job}}});state.near=near;if(near){el('prompt').style.display='flex';el('promptText').textContent=near.kind==='npc'?'Hablar con '+near.n.userData.name:'Trabajar: '+near.job.title}else el('prompt').style.display='none';
const target=player.position.clone().add(new THREE.Vector3(0,10,14));camera.position.lerp(target,.04);camera.lookAt(player.position.x,1.5,player.position.z);
timeAcc+=dt;if(timeAcc>.8){timeAcc=0;state.minute+=2;if(state.minute>=60){state.minute-=60;state.hour++;if(state.hour>=20){state.hour=8;state.day++;state.energy=Math.min(100,state.energy+35)}}updateUI()}
renderer.render(scene,camera)}updateUI();setTimeout(()=>el('loading').style.display='none',700);animate();
