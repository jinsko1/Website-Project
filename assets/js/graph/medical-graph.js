(async () => {
  const root = document.querySelector('.medical-graph');
  if (!root) return;
  const $ = id => document.getElementById(id);
  const el = (tag,text) => { const n=document.createElement(tag); if(text) n.textContent=text; return n; };
  const colors={disease:'#de7c8b',etiology:'#d9a554',physiology:'#6caed8',manifestation:'#ad94d7'};
  const kinds={disease:'Disease',etiology:'Etiology / mechanism',physiology:'Physiology',manifestation:'Manifestation'};
  const labels={can_cause:'can cause',assessed_using:'assessed using',treated_by:'treated by',may_require:'may require',prerequisite_for:'prerequisite for',compensated_by:'compensated by'};
  try {
    const response=await fetch(root.dataset.graphUrl);
    if(!response.ok) throw new Error('Graph data unavailable');
    const data=await response.json(), concepts=new Map(data.concepts.map(c=>[c.id,c]));
    let selected=concepts.has(location.hash.slice(1))?location.hash.slice(1):'aki', cy, hoveredNode=null;
    const clinical=data.relations.filter(r=>r.type!=='prerequisite_for');
    function button(id) { const b=el('button',concepts.get(id).name); b.type='button'; b.onclick=()=>select(id,true); return b; }
    function link(title,url) { const a=el('a',title); a.href=url; return a; }
    function neighborhood() {
      const mode=$('graph-mode').value, nodes=new Set([selected]), edges=new Set();
      if(mode==='overview') return {nodes:new Set(concepts.keys()),edges:new Set(data.relations)};
      if(mode==='learning') {
        function walk(id) { data.relations.filter(r=>r.type==='prerequisite_for'&&r.target===id).forEach(r=>{ edges.add(r); if(!nodes.has(r.source)) {nodes.add(r.source);walk(r.source);} }); }
        walk(selected);
      } else {
        for(let i=0;i<(mode==='reasoning'?2:1);i++) {
          const layer=clinical.filter(r=>nodes.has(r.source)||nodes.has(r.target));
          layer.forEach(r=>{edges.add(r);nodes.add(r.source);nodes.add(r.target);});
        }
      }
      return {nodes,edges};
    }
    function arrange() {
      if(!cy)return;
      // Run once; clicks and viewport changes never rerun the simulation.
      cy.layout({name:'cose',animate:false,randomize:false,fit:true,padding:65,
        nodeDimensionsIncludeLabels:true,nodeRepulsion:6500,idealEdgeLength:80,
        edgeElasticity:100,gravity:.6,numIter:1600,componentSpacing:120}).run();
      const box=cy.nodes().boundingBox();
      const fit=(w,h)=>Math.min((cy.width()-110)/w,(cy.height()-110)/h);
      if(fit(box.h,box.w)>fit(box.w,box.h)) {
        cy.nodes().positions(n=>({x:n.position('y'),y:-n.position('x')}));
      }
      cy.fit(cy.elements(':visible'),55);
    }
    function updateHover() {
      if(!cy)return;
      cy.batch(()=>{
        cy.elements().removeClass('muted hovered near');
        const node=hoveredNode?cy.getElementById(hoveredNode):null;
        if(node?.visible()) {
          cy.elements().addClass('muted');
          node.closedNeighborhood().removeClass('muted');
          node.connectedEdges().addClass('near');
          node.addClass('hovered');
        }
      });
    }
    function paint() {
      const c=concepts.get(selected),{nodes,edges}=neighborhood();
      if(cy) {
        cy.batch(()=>{
          cy.elements().removeClass('chosen inspected near');
          cy.nodes().forEach(n=>n.style('display',nodes.has(n.id())?'element':'none'));
          data.relations.forEach((r,i)=>cy.getElementById(`edge-${i}`).style('display',edges.has(r)?'element':'none'));
          const chosen=cy.getElementById(selected);
          chosen.addClass('chosen');
        });
        updateHover();
      }
      $('graph-title').textContent=c.name;
      const roles=[];
      if(clinical.some(r=>r.source===selected&&r.type==='can_cause'))roles.push('can cause other findings or conditions');
      $('graph-tags').textContent=kinds[c.kind];
      $('graph-tags').style.setProperty('--concept-color',colors[c.kind]);
      $('graph-summary').textContent=c.summary;
      $('graph-study-status').textContent=c.coverage==='article'?'● Studied':c.coverage==='mentioned'?'◐ Mentioned':'○ Unstudied';
      $('graph-tags').title=roles.join('; ');
      $('graph-article').replaceChildren();
      if(c.article)$('graph-article').append(link('Read article ↗',c.article.url));
      $('graph-status').textContent=`${nodes.size} concepts · ${edges.size} connections`;
    }
    function select(id,center=false) {
      selected=id; history.replaceState(null,'',`#${id}`);
      $('graph-results').hidden=true;$('graph-search').setAttribute('aria-expanded','false');$('graph-search').value='';paint();
      if(center&&cy)cy.center(cy.getElementById(id));
    }
    if(typeof cytoscape==='function') {
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      const rgb=value=>{ctx.fillStyle=value;ctx.fillRect(0,0,1,1);const [r,g,b]=ctx.getImageData(0,0,1,1).data;return `rgb(${r},${g},${b})`;};
      const theme=()=>{const s=getComputedStyle(root);return {fg:rgb(s.getPropertyValue('--foreground').trim()||'#333'),bg:rgb(s.getPropertyValue('--card').trim()||'#fff'),edge:rgb(s.getPropertyValue('--muted-foreground').trim()||'#aaa')};};
      const t=theme();
      cy=cytoscape({container:$('medical-map'),elements:[
        ...data.concepts.map((c,i)=>({data:{id:c.id,label:c.name,color:colors[c.kind],coverage:c.coverage,halfFill:`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="${colors[c.kind]}" d="M50 0a50 50 0 0 0 0 100Z"/></svg>`)}`},position:{x:250*Math.cos(i*2.39996),y:250*Math.sin(i*2.39996)}})),
        ...data.relations.map((r,i)=>({data:{id:`edge-${i}`,source:r.source,target:r.target,label:labels[r.type],prerequisite:r.type==='prerequisite_for'}}))
      ],style:[
        {selector:'node',style:{label:'data(label)',shape:'ellipse',width:25,height:25,'background-color':'data(color)','background-opacity':0,'border-color':'data(color)','border-width':2,color:t.fg,'font-size':19,'text-wrap':'wrap','text-max-width':115,'text-valign':'bottom','text-margin-y':8,'min-zoomed-font-size':10,'text-background-color':t.bg,'text-background-opacity':.8,'text-background-padding':'2px','overlay-opacity':0}},
        {selector:'node[coverage = "article"]',style:{'background-opacity':1}},
        {selector:'node[coverage = "mentioned"]',style:{'background-image':'data(halfFill)','background-fit':'contain','background-width':'100%','background-height':'100%','background-position-x':'50%','background-position-y':'50%'}},
        {selector:'node.chosen',style:{width:31,height:31,'border-width':3,'font-weight':650}},
        {selector:'node.hovered',style:{'border-width':3}},
        {selector:'edge',style:{width:1,'opacity':.4,'line-color':t.edge,'target-arrow-color':t.edge,'target-arrow-shape':'triangle','curve-style':'bezier','arrow-scale':.6,'overlay-opacity':0}},
        {selector:'edge[?prerequisite]',style:{'line-style':'dashed','line-opacity':.6}},
        {selector:'edge.near',style:{opacity:.8,'line-color':'#8b96aa','target-arrow-color':'#8b96aa',width:1.5}},
        {selector:'edge.inspected',style:{opacity:1,label:'data(label)',color:t.fg,'font-size':11,'min-zoomed-font-size':10,'text-background-color':t.bg,'text-background-opacity':1,'text-background-padding':'5px','line-color':'#6caed8','target-arrow-color':'#6caed8',width:2}},
        {selector:'node.muted',style:{opacity:.18}},
        {selector:'edge.muted',style:{opacity:.04}}
      ],layout:{name:'preset'},userPanningEnabled:true,userZoomingEnabled:true,boxSelectionEnabled:false,autoungrabify:false,minZoom:.15,maxZoom:4,wheelSensitivity:.2});
      cy.on('tap','node',e=>select(e.target.id()));
      cy.on('mouseover','edge',e=>e.target.addClass('inspected'));
      cy.on('mouseout','edge',e=>e.target.removeClass('inspected'));
      cy.on('tap','edge',e=>{cy.edges().removeClass('inspected');e.target.addClass('inspected');});
      cy.on('mouseover mousemove','node',e=>{
        $('medical-map').style.cursor='grab';
        hoveredNode=e.target.id();updateHover();
      });
      cy.on('mouseout','node',e=>{
        if(hoveredNode===e.target.id())hoveredNode=null;
        updateHover();$('medical-map').style.cursor='grab';
      });
      cy.on('grab',()=>{$('medical-map').style.cursor='grabbing';});
      cy.on('free',()=>{updateHover();$('medical-map').style.cursor='grab';});
      $('medical-map').addEventListener('pointerleave',()=>{hoveredNode=null;updateHover();});
      new ResizeObserver(()=>{cy.resize();}).observe($('medical-map'));
      new MutationObserver(()=>{const t=theme();cy.style().selector('node').style({'color':t.fg,'text-background-color':t.bg}).selector('edge').style({'line-color':t.edge,'target-arrow-color':t.edge}).selector('edge.inspected').style({'color':t.fg,'text-background-color':t.bg,'line-color':'#6caed8','target-arrow-color':'#6caed8'}).update();}).observe(document.documentElement,{attributes:true,attributeFilter:['class','data-theme','data-mode']});
      const zoom=factor=>cy.zoom({level:cy.zoom()*factor,renderedPosition:{x:cy.width()/2,y:cy.height()/2}});
      $('graph-zoom-in').onclick=()=>zoom(1.25);
      $('graph-zoom-out').onclick=()=>zoom(1/1.25);
      $('graph-fit').onclick=()=>cy.fit(cy.elements(':visible'),55);
      $('medical-map').addEventListener('keydown',e=>{
        const moves={ArrowLeft:{x:60,y:0},ArrowRight:{x:-60,y:0},ArrowUp:{x:0,y:60},ArrowDown:{x:0,y:-60}};
        if(moves[e.key]){e.preventDefault();cy.panBy(moves[e.key]);}
        if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.25);}
        if(e.key==='-'){e.preventDefault();zoom(1/1.25);}
        if(e.key==='Home'){e.preventDefault();cy.fit(cy.elements(':visible'),55);}
      });
    } else $('medical-map').append(el('p','Map unavailable. Use search to explore concept summaries.'));
    const input=$('graph-search'), results=$('graph-results');
    function search() {
      const term=input.value.trim().toLowerCase();results.replaceChildren();results.hidden=!term;input.setAttribute('aria-expanded',String(!!term));
      if(!term)return;
      const matches=data.concepts.filter(c=>`${c.name} ${c.id}`.toLowerCase().includes(term)).sort((a,b)=>a.name.localeCompare(b.name));
      matches.forEach(c=>results.append(button(c.id)));
      if(!matches.length)results.append(el('p','No concepts found.'));
    }
    input.addEventListener('input',search);
    input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();results.querySelector('button')?.focus();}if(e.key==='Enter'){results.querySelector('button')?.click();}if(e.key==='Escape'){results.hidden=true;input.setAttribute('aria-expanded','false');}});
    results.addEventListener('keydown',e=>{const buttons=[...results.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();buttons[(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();}if(e.key==='Escape'){results.hidden=true;input.setAttribute('aria-expanded','false');input.focus();}});
    document.addEventListener('click',e=>{if(!e.target.closest('.graph-search-wrap')){results.hidden=true;input.setAttribute('aria-expanded','false');}});
    $('graph-mode').onchange=()=>{paint();if(cy)cy.fit(cy.elements(':visible'),55);};
    $('graph-reset').onclick=()=>{$('graph-mode').value='overview';select('aki');if(cy)cy.fit(cy.elements(),55);};
    window.addEventListener('hashchange',()=>{if(concepts.has(location.hash.slice(1))){selected=location.hash.slice(1);paint();}});
    let previousFocus;
    function expand(value) {
      root.classList.toggle('graph-expanded',value);
      $('graph-expand').setAttribute('aria-pressed',String(value));
      $('graph-expand').setAttribute('aria-label',value?'Close expanded graph':'Expand graph');
      $('graph-expand').textContent=value?'⤡':'⤢';
      if(value){previousFocus=document.activeElement;$('medical-map').focus();}else previousFocus?.focus();
      if(cy)cy.resize();
    }
    $('graph-expand').onclick=()=>expand(!root.classList.contains('graph-expanded'));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('graph-expanded'))expand(false);});
    paint();arrange();
  } catch(error) { console.error(error);$('graph-status').textContent='Unable to load. Reload to try again.'; }
})();
