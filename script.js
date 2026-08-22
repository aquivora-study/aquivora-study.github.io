const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const defaults={subjects:[
{name:"Mathematics",icon:"∑",desc:"Numbers, algebra & problem solving",topics:12,progress:68},
{name:"Physics",icon:"⚛",desc:"Matter, motion & energy",topics:9,progress:44},
{name:"Chemistry",icon:"⚗",desc:"Atoms, reactions & materials",topics:10,progress:52},
{name:"Biology",icon:"⌬",desc:"Life, cells & ecosystems",topics:14,progress:31},
{name:"Computer Science",icon:"⌘",desc:"Code, algorithms & systems",topics:8,progress:74},
{name:"English",icon:"Aa",desc:"Language, grammar & literature",topics:11,progress:39}],
notes:[
{title:"Newton's Laws",tag:"Physics",body:"Three fundamental laws describing force, mass and motion.",date:"Today"},
{title:"Quadratic Formula",tag:"Mathematics",body:"A quick reference for solving ax² + bx + c = 0.",date:"Yesterday"},
{title:"Cell Structure",tag:"Biology",body:"Key organelles and their functions.",date:"2 days ago"}]};
let st=JSON.parse(localStorage.aquivora||"null")||{...defaults,minutes:0,score:0,attempts:0,topics:0,streak:0,dark:false,reminders:false};
function save(){localStorage.aquivora=JSON.stringify(st);stats()}
function stats(){$("#minutes").textContent=st.minutes+" min";$("#score").textContent=(st.attempts?Math.round(st.score/st.attempts):0)+"%";$("#streak").textContent=st.streak+" days";$("#sideStreak").textContent=st.streak;$("#topics").textContent=st.topics;$("#darkToggle").classList.toggle("on",st.dark);$("#reminder").classList.toggle("on",st.reminders)}
function page(id){$$(".page").forEach(x=>x.classList.toggle("active",x.id===id));$$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===id));$("#sidebar").classList.remove("open");if(id==="quiz")quiz()}
$$("[data-page]").forEach(x=>x.onclick=()=>page(x.dataset.page));$("#menu").onclick=()=>$("#sidebar").classList.toggle("open");
$("#theme").onclick=()=>{st.dark=!st.dark;document.body.classList.toggle("dark",st.dark);save()};
$("#profile").onclick=()=>toast("Aquivora accounts are planned for a future stage.");
function esc(s){return String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}
function render(){ $("#subjectGrid").innerHTML=st.subjects.map((s,i)=>`<article class="subject"><div class="ico">${s.icon}</div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p><div class="meta"><span>${s.topics} topics</span><b>${s.progress}%</b></div><div class="progress"><i style="width:${s.progress}%"></i></div><button class="secondary" onclick="learn(${i})">Open subject →</button></article>`).join("");
$("#notesGrid").innerHTML=st.notes.map((n,i)=>`<article class="note"><span class="tag">${esc(n.tag)}</span><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><small>${esc(n.date)} · <button class="link" onclick="delNote(${i})">Delete</button></small></article>`).join("");
$("#continue").innerHTML=st.subjects.slice(0,3).map(s=>`<div class="continue"><b>${s.icon}</b><div><strong>${esc(s.name)}</strong><small>${s.progress}% complete</small><div class="bar"><i style="width:${s.progress}%"></i></div></div></div>`).join("");stats()}
function toast(x){let t=$("#toast");t.textContent=x;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2000)}
function modal(x){$("#modal").innerHTML=x;$("#modalBg").classList.add("open")}function closeModal(){$("#modalBg").classList.remove("open")}
$("#modalBg").onclick=e=>{if(e.target.id==="modalBg")closeModal()}
$("#addSubject").onclick=()=>modal(`<h3>Add a subject</h3><input id="sn" placeholder="Subject name"><input id="sd" placeholder="Description"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="addS()">Add subject</button>`);
function addS(){let n=$("#sn").value.trim();if(!n)return toast("Enter a subject name.");st.subjects.push({name:n,icon:"✦",desc:$("#sd").value.trim()||"New subject",topics:0,progress:0});save();render();closeModal();toast("Subject added")}
function learn(i){st.topics++;st.subjects[i].progress=Math.min(100,st.subjects[i].progress+5);save();render();toast("Topic marked as learned 🎉")}
$("#addNote").onclick=()=>modal(`<h3>New note</h3><input id="nt" placeholder="Title"><input id="ng" placeholder="Subject"><textarea id="nb" placeholder="Write your note..."></textarea><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="addN()">Save note</button>`);
function addN(){let t=$("#nt").value.trim(),b=$("#nb").value.trim();if(!t||!b)return toast("Add a title and note.");st.notes.unshift({title:t,tag:$("#ng").value.trim()||"General",body:b,date:"Just now"});save();render();closeModal();toast("Note saved")}
function delNote(i){st.notes.splice(i,1);save();render();toast("Note deleted")}
const qs=[["What is the SI unit of force?",["Joule","Newton","Watt","Pascal"],1],["Which organelle is the powerhouse of the cell?",["Nucleus","Ribosome","Mitochondrion","Golgi apparatus"],2],["What is the derivative of x²?",["x","2x","x³","2"],1],["Which language structures a web page?",["CSS","Python","HTML","SQL"],2],["What is sodium's chemical symbol?",["So","S","Na","Sd"],2]];
let qi=0,qc=0,qa=false;
function quiz(){let q=qs[qi];if(!q){let p=Math.round(qc/qs.length*100);st.score+=p;st.attempts++;save();$("#quizBox").innerHTML=`<div style="text-align:center"><label>QUIZ COMPLETE</label><h1 style="color:var(--p)">${p}%</h1><p>You got ${qc} of ${qs.length} correct.</p><button class="primary" onclick="qi=0;qc=0;quiz()">Try again</button></div>`;return}$("#quizBox").innerHTML=`<div class="qtop"><span>Question ${qi+1} of ${qs.length}</span><span>${qc} correct</span></div><div class="progress"><i style="width:${qi/qs.length*100}%"></i></div><h2>${esc(q[0])}</h2><div class="answers">${q[1].map((a,i)=>`<button class="answer" onclick="answer(${i})">${esc(a)}</button>`).join("")}</div>`}
function answer(i){if(qa)return;qa=true;let q=qs[qi],bs=$$(".answer");bs[q[2]].classList.add("correct");if(i===q[2])qc++;else bs[i].classList.add("wrong");setTimeout(()=>{qi++;qa=false;quiz()},700)}
const fc=[["What is Newton's Second Law?","F = ma."],["What is photosynthesis?","Plants convert light, water and carbon dioxide into glucose and oxygen."],["What is a variable?","A named storage location for a value that can change."],["What is the Pythagorean theorem?","a² + b² = c² for a right triangle."],["What is an atom?","The smallest unit of an element retaining its chemical properties."]];let fi=0;
function flash(){ $("#fq").textContent=fc[fi][0];$("#fa").textContent=fc[fi][1];$("#count").textContent=`${fi+1} / ${fc.length}`;$("#flashcard").classList.remove("flip")}
$("#flashcard").onclick=()=>$("#flashcard").classList.toggle("flip");$("#prev").onclick=()=>{fi=(fi-1+fc.length)%fc.length;flash()};$("#next").onclick=()=>{fi=(fi+1)%fc.length;flash()};
let seconds=1500,running=false,int;
function setTimer(m){seconds=m*60;running=false;clearInterval(int);$("#start").textContent="Start focus";tick()}
function tick(){let m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");$("#time").textContent=m+":"+s}
$$(".mode").forEach(b=>b.onclick=()=>{$$(".mode").forEach(x=>x.classList.remove("active"));b.classList.add("active");setTimer(+b.dataset.min)});
$("#start").onclick=()=>{if(running){running=false;clearInterval(int);$("#start").textContent="Resume";return}running=true;$("#start").textContent="Pause";int=setInterval(()=>{seconds--;tick();if(seconds<=0){clearInterval(int);running=false;let m=+$(" .mode.active").dataset.min;st.minutes+=m;st.streak++;save();toast("Focus session complete 🎉");setTimer(m)}},1000)};
$("#reset").onclick=()=>setTimer(+$(" .mode.active").dataset.min);
$("#darkToggle").onclick=()=>{st.dark=!st.dark;document.body.classList.toggle("dark",st.dark);save()};$("#reminder").onclick=()=>{st.reminders=!st.reminders;save();toast(st.reminders?"Reminders enabled":"Reminders disabled")};
$("#resetData").onclick=()=>{if(confirm("Reset all Aquivora progress?")){localStorage.removeItem("aquivora");location.reload()}};
$("#search").oninput=e=>{let q=e.target.value.toLowerCase().trim();if(!q){render();return}let ms=st.subjects.filter(s=>(s.name+" "+s.desc).toLowerCase().includes(q));page("subjects");$("#subjectGrid").innerHTML=ms.map(s=>`<article class="subject"><div class="ico">${s.icon}</div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p><div class="meta"><span>${s.topics} topics</span><b>${s.progress}%</b></div></article>`).join("")||"<div class='panel'>No matching subjects found.</div>"};
document.body.classList.toggle("dark",st.dark);render();quiz();flash();tick();
