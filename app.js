(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE = 'woubay-demo-v1';
  const defaultCategories = ['Books & Notes','Gadgets','Hostel & Living','Cycles & Sports','Clothing & Costumes','Project Gear','Other'];

  const seedListings = [
    {id:'l1',name:'Calculus & Linear Algebra Bundle',price:650,mode:'buy',category:'Books & Notes',description:'Both books are in good condition with a few highlighted pages. Great for first-year maths.',seller:'Aarav',location:'Academic block',emoji:'📚',photo:'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=700&q=80',demo:true},
    {id:'l2',name:'Scientific Calculator',price:450,mode:'buy',category:'Gadgets',description:'Casio scientific calculator, fully working. Happy to show it before you buy.',seller:'Meera',location:'Campus common area',emoji:'🧮',photo:'',demo:true},
    {id:'l3',name:'Mini Study Lamp',price:350,mode:'buy',category:'Hostel & Living',description:'Warm LED desk lamp, perfect for late-night study sessions. Cable included.',seller:'Kabir',location:'Hostel common area',emoji:'💡',photo:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',demo:true},
    {id:'l4',name:'Tripod + Phone Mount',price:120,mode:'rent',category:'Project Gear',description:'Lightweight tripod with adjustable phone holder. Ideal for project shoots and presentations.',seller:'Ananya',location:'Library area',emoji:'📷',photo:'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=700&q=80',demo:true},
    {id:'l5',name:'Fest Jacket',price:180,mode:'rent',category:'Clothing & Costumes',description:'Statement jacket for a themed event or fest. One size fits most; message for a quick try-on.',seller:'Rhea',location:'Campus common area',emoji:'🧥',photo:'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',demo:true},
    {id:'l6',name:'Campus Bicycle',price:90,mode:'rent',category:'Cycles & Sports',description:'Reliable geared cycle for getting around campus. Helmet can be included.',seller:'Dev',location:'Sports complex',emoji:'🚲',photo:'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=700&q=80',demo:true},
    {id:'l7',name:'Portable Bluetooth Speaker',price:750,mode:'buy',category:'Gadgets',description:'Compact speaker with clear sound and a good battery. Includes charging cable.',seller:'Ira',location:'Hostel common area',emoji:'🔊',photo:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80',demo:true},
    {id:'l8',name:'Lab Coat',price:60,mode:'rent',category:'Project Gear',description:'Clean lab coat available for short-term use. Agree on the return date before pickup.',seller:'Arjun',location:'Academic block',emoji:'🥼',photo:'',demo:true},
    {id:'l9',name:'Desk Organiser',price:220,mode:'buy',category:'Hostel & Living',description:'Simple organiser with compartments. Good condition and ready for a new desk.',seller:'Naina',location:'Hostel common area',emoji:'🗂️',photo:'',demo:true}
  ];
  const seedRequests = [
    {id:'r1',name:'Need a graphing calculator',category:'Gadgets',description:'Looking for one for the next few weeks. Renting would be great, but open to buying second-hand too.',requester:'Ishita',budget:500,neededBy:'',emoji:'🧮',demo:true},
    {id:'r2',name:'Tripod for a weekend project',category:'Project Gear',description:'Need a phone or camera tripod for a short shoot this weekend. Can pick it up anywhere on campus.',requester:'Rahul',budget:250,neededBy:'',emoji:'📷',demo:true},
    {id:'r3',name:'Second-hand novels',category:'Books & Notes',description:'Any fiction books people are done with? Happy to buy a small bundle.',requester:'Sana',budget:400,neededBy:'',emoji:'📖',demo:true},
    {id:'r4',name:'Badminton racket',category:'Cycles & Sports',description:'Need a decent racket for casual games. Borrowing or buying both work.',requester:'Neil',budget:700,neededBy:'',emoji:'🏸',demo:true}
  ];

  let data = loadData();
  let currentMode = 'buy';
  let currentRentListing = null;
  let toastTimer;

  function loadData(){
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      return {
        listings: Array.isArray(saved?.listings) ? saved.listings : seedListings,
        requests: Array.isArray(saved?.requests) ? saved.requests : seedRequests,
        reports: Array.isArray(saved?.reports) ? saved.reports : [],
        categories: Array.isArray(saved?.categories) ? saved.categories : defaultCategories,
        tagline: saved?.tagline || 'A place for all your campus needs. Find it, borrow it, pass it on — all without leaving campus.',
        messages: Array.isArray(saved?.messages) ? saved.messages : []
      };
    } catch { return {listings:seedListings,requests:seedRequests,reports:[],categories:defaultCategories,tagline:'A place for all your campus needs. Find it, borrow it, pass it on — all without leaving campus.',messages:[]}; }
  }
  function persist(){
    try { localStorage.setItem(STORAGE, JSON.stringify(data)); }
    catch { showToast('Storage is full. Try using a smaller photo.'); }
  }
  function esc(value=''){return String(value).replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function initials(name='WouBay'){return name.trim().split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()||'').join('');}
  function formatPrice(price){return '₹'+Number(price||0).toLocaleString('en-IN');}
  function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2900);}
  function openModal(id){const el=$('#'+id);if(!el)return;el.classList.add('open');el.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';const focusable=$('input,button,select,textarea',el);setTimeout(()=>focusable?.focus(),120);}
  function closeModal(el){const modal=typeof el==='string'?$('#'+el):el;if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');if(!$('.modal-backdrop.open'))document.body.style.overflow='';}
  function navigate(view, mode){
    $$('.page-view').forEach(p=>p.classList.remove('active'));
    const target=$('#'+view+'View');if(target)target.classList.add('active');
    $$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    if(mode) setMode(mode);
    if(view==='market')renderMarket();if(view==='requests')renderRequests();if(view==='admin')renderAdmin();
    window.scrollTo({top:0,behavior:'smooth'});$('#mainNav')?.classList.remove('open');
  }
  function setMode(mode){currentMode=mode==='rent'?'rent':'buy';$$('[data-mode-tab]').forEach(b=>b.classList.toggle('active',b.dataset.modeTab===currentMode));const title=$('#marketTitle');if(title)title.innerHTML=currentMode==='buy'?'The campus <em>market.</em>':'Things to <em>borrow.</em>';renderMarket();}

  function renderMarket(){
    const q=($('#marketSearch')?.value||'').trim().toLowerCase();const cat=$('#categoryFilter')?.value||'all';
    const filtered=data.listings.filter(item=>item.mode===currentMode&&(cat==='all'||item.category===cat)&&`${item.name} ${item.description} ${item.category} ${item.seller}`.toLowerCase().includes(q));
    $('#marketCount').textContent=`${filtered.length} ${currentMode==='buy'?'items for sale':'items available to rent'}`;
    $('#listingGrid').innerHTML=filtered.map(item=>listingCard(item)).join('');$('#marketEmpty').hidden=filtered.length>0;$('#listingGrid').hidden=filtered.length===0;
  }
  function listingCard(item){
    const visual=item.photo?`<img src="${esc(item.photo)}" alt="${esc(item.name)}" onerror="this.style.display='none'">`:'';
    return `<article class="listing-card"><div class="listing-image">${visual}<div class="listing-fallback">${esc(item.emoji||'✳')}</div><span class="listing-badge">${item.mode==='rent'?'FOR RENT':'FOR SALE'}</span>${item.demo?'<span class="demo-badge">SAMPLE</span>':''}</div><div class="listing-info"><div class="listing-meta"><span>${esc(item.category)}</span><span>⌖ ${esc(item.location||'Campus')}</span></div><h3>${esc(item.name)}</h3><p class="listing-desc">${esc(item.description)}</p><div class="listing-foot"><div class="seller-mini"><span class="seller-avatar">${esc(initials(item.seller))}</span><span>${esc(item.seller)} · Woxsen student</span></div><div class="price">${formatPrice(item.price)}<small>${item.mode==='rent'?'per day':'one-time'}</small></div></div><div class="card-actions"><button class="card-action" data-detail="${esc(item.id)}">${item.mode==='rent'?'View & rent':'View item'}</button><button class="card-action secondary" data-report="${esc(item.id)}">Report</button></div></div></article>`;
  }
  function renderRequests(){
    const q=($('#requestSearch')?.value||'').trim().toLowerCase();const filtered=data.requests.filter(r=>`${r.name} ${r.description} ${r.category} ${r.requester}`.toLowerCase().includes(q));
    $('#requestGrid').innerHTML=filtered.map(r=>`<article class="request-card"><div class="request-thumb">${r.photo?`<img src="${esc(r.photo)}" alt="Reference for ${esc(r.name)}" onerror="this.remove()">`:esc(r.emoji||'✳')}</div><div class="request-body"><div class="request-tags"><span class="request-tag">${esc(r.category)}</span>${r.demo?'<span class="request-demo">SAMPLE REQUEST</span>':''}</div><h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><div class="request-foot"><span>By ${esc(r.requester)}${r.budget?` · Budget ${formatPrice(r.budget)}`:''}</span><button data-help-request="${esc(r.id)}">I can help ↗</button></div></div></article>`).join('');
    $('#requestEmpty').hidden=filtered.length>0;$('#requestGrid').hidden=filtered.length===0;
  }
  function renderAdmin(){
    $('#adminStats').innerHTML=[['LIVE LISTINGS',data.listings.length],['OPEN REQUESTS',data.requests.length],['REPORTS',data.reports.length],['CATEGORIES',data.categories.length]].map(([label,n])=>`<div class="stat-card"><span>${label}</span><strong>${n}</strong></div>`).join('');
    $('#adminListings').innerHTML=data.listings.length?data.listings.slice().reverse().map(item=>`<div class="admin-row"><div class="admin-row-copy"><strong>${esc(item.name)}</strong><small>${item.mode==='rent'?'For rent':'For sale'} · ${formatPrice(item.price)} ${item.mode==='rent'?'/day':''}</small></div><div class="admin-row-actions"><button class="mini-btn" data-admin-detail="${esc(item.id)}">View</button><button class="mini-btn danger" data-remove-listing="${esc(item.id)}">Remove</button></div></div>`).join(''):'<p class="modal-intro">No listings to manage yet.</p>';
    $('#adminReports').innerHTML=data.reports.length?data.reports.map(r=>`<div class="admin-row"><div class="admin-row-copy"><strong>${esc(r.itemName)}</strong><small>${esc(r.reason)} · ${esc(r.date)}</small></div><div class="admin-row-actions"><button class="mini-btn" data-dismiss-report="${esc(r.id)}">Resolve</button></div></div>`).join(''):'<p class="modal-intro">No reports. Nice and quiet.</p>';
    $('#reportCount').textContent=`${data.reports.length} open`;
    $('#taglineInput').value=data.tagline;
    $('#adminCategories').innerHTML=data.categories.map((c,i)=>`<span class="category-chip">${esc(c)} <button aria-label="Remove ${esc(c)}" data-remove-category="${i}">×</button></span>`).join('');
  }
  function findListing(id){return data.listings.find(x=>x.id===id)}
  function openDetail(item){
    if(!item)return;
    $('#detailContent').innerHTML=`<div class="detail-hero">${item.photo?`<img src="${esc(item.photo)}" alt="${esc(item.name)}" onerror="this.style.display='none'">`:''}<div class="listing-fallback">${esc(item.emoji||'✳')}</div></div><div class="detail-kicker">${item.mode==='rent'?'AVAILABLE TO RENT':'AVAILABLE TO BUY'} · ${esc(item.category)}</div><h2 id="detailTitle">${esc(item.name)}</h2><p class="detail-copy">${esc(item.description)}</p><div class="detail-facts"><span>⌖ ${esc(item.location||'Campus meetup')}</span><span>✓ Woxsen student listing</span><span>${item.mode==='rent'?'Price per day':'One-time price'}</span></div><div class="detail-owner"><span>Listed by <strong>${esc(item.seller)}</strong></span><strong>${formatPrice(item.price)}${item.mode==='rent'?' / day':''}</strong></div><p class="privacy-hint" style="margin-top:15px">For privacy, personal phone numbers, email addresses and room numbers are not displayed. Use the platform to connect and arrange a public campus meetup.</p><div class="detail-actions"><button class="btn btn-primary" id="detailPrimary">${item.mode==='rent'?'Choose return time':'Contact seller'} <span>↗</span></button><button class="btn btn-quiet" id="detailReport">Report listing</button></div>`;
    $('#detailPrimary').addEventListener('click',()=>{closeModal('detailModal');if(item.mode==='rent'){currentRentListing=item;$('#rentItemName').textContent=`${item.name} · ${formatPrice(item.price)} per day`;const d=new Date(Date.now()+86400000);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());$('input[name="returnAt"]',$('#rentForm')).min=d.toISOString().slice(0,16);openModal('rentModal')}else{showToast('Demo only: seller chat would open here in the live WouBay app.')}});
    $('#detailReport').addEventListener('click',()=>{closeModal('detailModal');reportListing(item.id)});
    openModal('detailModal');
  }
  function reportListing(id){const item=findListing(id);if(!item)return;const reason=window.prompt('What should the admin review? (e.g. misleading description, inappropriate listing)');if(!reason)return;data.reports.push({id:'rep'+Date.now(),itemName:item.name,listingId:id,reason:reason.slice(0,120),date:new Date().toLocaleDateString('en-IN')});persist();renderAdmin();showToast('Report added to the demo admin dashboard.');}
  function readPhoto(file){return new Promise((resolve,reject)=>{if(!file||!file.name){resolve('');return;}if(file.size>1.5*1024*1024){reject(new Error('Please choose an image under 1.5 MB.'));return;}const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Could not read that image.'));reader.readAsDataURL(file);});}

  // Navigation and entry bubbles
  $$('button[data-view]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();navigate(btn.dataset.view,btn.dataset.mode)}));
  $$('[data-home-link]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();navigate('home')}));
  $$('[data-mode-tab]').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.modeTab)));
  $$('.entry-bubble[data-view]').forEach(card=>{card.addEventListener('click',e=>{if(e.target.closest('button'))return;navigate(card.dataset.view)});card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();navigate(card.dataset.view)}})});
  $$('[data-action="list-sale"]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();$('#listingMode').value='buy';$('#priceUnit').value='one-time';openModal('listingModal')}));
  $$('[data-action="list-rent"]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();$('#listingMode').value='rent';$('#priceUnit').value='per day';openModal('listingModal')}));
  $('#mobileMenu').addEventListener('click',()=>$('.main-nav').classList.toggle('open'));
  $('#themeToggle').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';$('#themeGlyph').textContent=dark?'☀':'☾';$('#themeToggle').setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');localStorage.setItem('woubay-theme',dark?'dark':'light');});
  const savedTheme=localStorage.getItem('woubay-theme')||'light';document.documentElement.dataset.theme=savedTheme;$('#themeGlyph').textContent=savedTheme==='dark'?'☀':'☾';$('#themeToggle').setAttribute('aria-label',savedTheme==='dark'?'Switch to light mode':'Switch to dark mode');

  // Marketplace and request search
  $('#marketSearch').addEventListener('input',renderMarket);$('#categoryFilter').addEventListener('change',renderMarket);$('#requestSearch').addEventListener('input',renderRequests);
  $('#openListingFromMarket').addEventListener('click',()=>{ $('#listingMode').value=currentMode;$('#priceUnit').value=currentMode==='rent'?'per day':'one-time';openModal('listingModal') });
  $('#openRequestBtn').addEventListener('click',()=>openModal('requestModal'));$('#emptyListBtn').addEventListener('click',()=>openModal('listingModal'));$('#emptyRequestBtn').addEventListener('click',()=>openModal('requestModal'));
  $('#listingMode').addEventListener('change',e=>$('#priceUnit').value=e.target.value==='rent'?'per day':'one-time');
  $$('.modal-close').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.closest('.modal-backdrop'))));
  $$('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal(backdrop)}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal-backdrop.open').forEach(closeModal)});

  // Form handlers
  $('#listingForm').addEventListener('submit',async e=>{
    e.preventDefault();const f=e.currentTarget;const fd=new FormData(f);let photo='';
    try{photo=await readPhoto(fd.get('photo'));}catch(err){showToast(err.message);return;}
    const mode=fd.get('mode');const item={id:'u'+Date.now(),name:String(fd.get('name')).trim(),price:Number(fd.get('price')),mode,category:fd.get('category'),description:String(fd.get('description')).trim(),seller:String(fd.get('seller')).trim(),location:fd.get('location'),photo,emoji:'✳',demo:false};
    data.listings.unshift(item);persist();f.reset();$('#priceUnit').value='one-time';closeModal('listingModal');navigate('market',mode);showToast('Your listing is live in this browser preview!');
  });
  $('#requestForm').addEventListener('submit',async e=>{
    e.preventDefault();const f=e.currentTarget;const fd=new FormData(f);let photo='';try{photo=await readPhoto(fd.get('photo'));}catch(err){showToast(err.message);return;}
    const r={id:'r'+Date.now(),name:String(fd.get('name')).trim(),category:fd.get('category'),description:String(fd.get('description')).trim(),requester:String(fd.get('requester')).trim(),budget:Number(fd.get('budget'))||0,neededBy:fd.get('neededBy'),photo,emoji:'✳',demo:false};
    data.requests.unshift(r);persist();f.reset();closeModal('requestModal');navigate('requests');showToast('Your request has been added to the board!');
  });
  $('#rentForm').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const fd=new FormData(f);const date=new Date(fd.get('returnAt'));if(!date||date.getTime()<=Date.now()){showToast('Choose a return time in the future.');return;}closeModal('rentModal');f.reset();showToast('Rental request saved in this demo. Owner confirmation would happen in the live app.');});
  $('#contactForm').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);data.messages.push({name:fd.get('name'),message:fd.get('message'),date:new Date().toISOString()});persist();e.currentTarget.reset();closeModal('contactModal');showToast('Message saved in this browser preview.');});
  $('#openContactBtn').addEventListener('click',()=>openModal('contactModal'));

  // Cards: event delegation
  $('#listingGrid').addEventListener('click',e=>{const detail=e.target.closest('[data-detail]');const report=e.target.closest('[data-report]');if(detail)openDetail(findListing(detail.dataset.detail));if(report)reportListing(report.dataset.report)});
  $('#requestGrid').addEventListener('click',e=>{const btn=e.target.closest('[data-help-request]');if(!btn)return;const req=data.requests.find(r=>r.id===btn.dataset.helpRequest);showToast(`Demo: a private conversation with ${req?.requester||'the requester'} would open here.`)});
  $('#adminListings').addEventListener('click',e=>{const remove=e.target.closest('[data-remove-listing]');const detail=e.target.closest('[data-admin-detail]');if(remove){const item=findListing(remove.dataset.removeListing);if(!item)return;if(confirm(`Remove “${item.name}” from the demo marketplace?`)){data.listings=data.listings.filter(x=>x.id!==item.id);persist();renderAdmin();renderMarket();showToast('Listing removed from this browser preview.');}}if(detail)openDetail(findListing(detail.dataset.adminDetail));});
  $('#adminReports').addEventListener('click',e=>{const btn=e.target.closest('[data-dismiss-report]');if(!btn)return;data.reports=data.reports.filter(r=>r.id!==btn.dataset.dismissReport);persist();renderAdmin();showToast('Report marked as resolved.');});
  $('#copyForm').addEventListener('submit',e=>{e.preventDefault();data.tagline=$('#taglineInput').value.trim();persist();$('#heroTagline').textContent=data.tagline;showToast('Homepage tagline updated in this browser.');});
  $('#categoryForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#newCategory');const value=input.value.trim();if(!value)return;if(data.categories.some(x=>x.toLowerCase()===value.toLowerCase())){showToast('That category already exists.');return;}data.categories.push(value);persist();input.value='';renderAdmin();updateCategoryFilter();showToast('Category added.');});
  $('#adminCategories').addEventListener('click',e=>{const btn=e.target.closest('[data-remove-category]');if(!btn)return;const idx=Number(btn.dataset.removeCategory);const name=data.categories[idx];if(data.listings.some(x=>x.category===name)||data.requests.some(x=>x.category===name)){showToast('This category is in use. Move those items first.');return;}data.categories.splice(idx,1);persist();renderAdmin();updateCategoryFilter();showToast('Category removed.');});
  function updateCategoryFilter(){const sel=$('#categoryFilter');const current=sel.value;sel.innerHTML='<option value="all">All categories</option>'+data.categories.map(c=>`<option>${esc(c)}</option>`).join('');if([...sel.options].some(o=>o.value===current))sel.value=current;$$('select[name="category"]').forEach(categorySelect=>{const selected=categorySelect.value;categorySelect.innerHTML=data.categories.map(c=>`<option>${esc(c)}</option>`).join('');if(data.categories.includes(selected))categorySelect.value=selected;});}

  // Restore saved headline copy and initialise panels.
  $('#heroTagline').textContent=data.tagline;updateCategoryFilter();renderMarket();renderRequests();renderAdmin();
  // Set a polite default for rental date input.
  const returnInput=$('input[name="returnAt"]',$('#rentForm'));const tomorrow=new Date(Date.now()+86400000);tomorrow.setMinutes(tomorrow.getMinutes()-tomorrow.getTimezoneOffset());returnInput.min=tomorrow.toISOString().slice(0,16);
})();
