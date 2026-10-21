(function () {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) document.querySelectorAll('#liquid-glass animate').forEach(function (a) { a.remove(); });

    /* HERO: cores da paleta passando pelas letras (inspirado no Coolors) */
    var P = ['#CD5D67', '#BA1F33', '#91171F', '#421820', '#410B13', '#91171F', '#BA1F33'];
    var h = document.getElementById('name'), letters = [];
    h.dataset.text.split('').forEach(function (ch) {
        var s = document.createElement('span');
        s.className = 'l'; s.setAttribute('aria-hidden', 'true');
        s.innerHTML = ch === ' ' ? '&nbsp;' : ch;
        h.appendChild(s); letters.push(s);
    });
    var t = 0;
    function paint() { letters.forEach(function (l, i) { l.style.color = P[(i + t) % P.length]; }); }
    paint();
    if (!reduce) setInterval(function () { t++; paint(); }, 1300);

    /* Luz suave que segue o ponteiro (glass e liquid) */
    function follow(el, a, b) {
        el.addEventListener('pointermove', function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty(a, (e.clientX - r.left) + 'px');
            el.style.setProperty(b, (e.clientY - r.top) + 'px');
        });
    }
    follow(document.getElementById('heroCard'), '--mx', '--my');
    follow(document.getElementById('metro'), '--lx', '--ly');

    /* MAPA DE METRÔ: edite aqui linhas e estações
       l = posição do rótulo: T (acima), B (abaixo), R (direita) ou [dx, dy, âncora] */
    var T = [0, -16, 'middle'], B = [0, 26, 'middle'], R = [16, 5, 'start'];
    var LINES = [
        {
            name: 'Front-end', c: '#CD5D67', d: [[70, 90], [360, 90], [560, 290], [930, 290]],
            st: [{ t: 'HTML', x: 70, y: 90, l: T }, { t: 'CSS', x: 215, y: 90, l: T }, { t: 'React', x: 560, y: 290, l: B }, { t: 'Acessibilidade', x: 860, y: 290, l: T }]
        },
        {
            name: 'Back-end', c: '#BA1F33', d: [[70, 350], [280, 350], [530, 100], [930, 100]],
            st: [{ t: 'Git & GitHub', x: 70, y: 350, l: B }, { t: 'SQL', x: 190, y: 350, l: B }, { t: 'Node.js', x: 530, y: 100, l: T }, { t: 'APIs REST', x: 860, y: 100, l: T }]
        },
        {
            name: 'Soft skills', c: '#91171F', d: [[720, 30], [720, 390]],
            st: [{ t: 'Comunicação', x: 720, y: 30, l: R }, { t: 'Adaptabilidade', x: 720, y: 195, l: R }, { t: 'Aprendizado contínuo', x: 720, y: 390, l: R }]
        }
    ];
    /* Estações de conexão, onde as linhas se cruzam */
    var HUBS = [
        { t: 'JavaScript', x: 450, y: 180, l: [18, 5, 'start'] },
        { t: 'Trabalho em equipe', x: 720, y: 100, l: [16, 24, 'start'] },
        { t: 'Resolução de problemas', x: 720, y: 290, l: [16, 26, 'start'] }
    ];

    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, txt) {
        var e = document.createElementNS(NS, n);
        for (var k in a) e.setAttribute(k, a[k]);
        if (txt) e.textContent = txt;
        return e;
    }
    function label(s) {
        var l = s.l;
        return el('text', { x: s.x + l[0], y: s.y + l[1], 'text-anchor': l[2] }, s.t);
    }
    var svg = el('svg', { viewBox: '0 0 1000 420', role: 'img', 'aria-label': 'Mapa de habilidades em formato de linhas de metrô' });
    var lg = document.getElementById('legend');
    LINES.forEach(function (L, i) {
        var p = el('path', { d: 'M' + L.d.map(function (q) { return q.join(' '); }).join(' L'), stroke: L.c, 'class': 'ln', pathLength: 1 });
        p.style.transitionDelay = (i * .5) + 's';
        svg.appendChild(p);
        var li = document.createElement('li');
        li.style.setProperty('--c', L.c);
        li.innerHTML = '<i></i>' + L.name;
        lg.appendChild(li);
    });
    var g = el('g', { 'class': 'stn' });
    g.style.transitionDelay = '1.4s';
    LINES.forEach(function (L) {
        L.st.forEach(function (s) {
            g.appendChild(el('circle', { cx: s.x, cy: s.y, r: 4.5, fill: '#000', stroke: '#F4DEE0', 'stroke-width': 1.6 }));
            g.appendChild(label(s));
        });
    });
    HUBS.forEach(function (s) {
        g.appendChild(el('circle', { cx: s.x, cy: s.y, r: 7, fill: '#F4DEE0', stroke: '#000', 'stroke-width': 3 }));
        g.appendChild(label(s));
    });
    svg.appendChild(g);
    var map = document.getElementById('map');
    map.appendChild(svg);

    /* O mapa se desenha uma única vez ao aparecer */
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { map.classList.add('in'); io.disconnect(); } });
        }, { threshold: .3 });
        io.observe(map);
    } else { map.classList.add('in'); }

    document.getElementById('y').textContent = new Date().getFullYear();
})();