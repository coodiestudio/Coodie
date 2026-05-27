/* ================================================
   COODIE STUDIO — AI AGENT WIDGET  v2.0
   chat-widget.js
   ================================================
   DEMO MODE  : conversational state machine —
                asks qualifying questions before
                recommending any service.
   PRODUCTION : set apiEndpoint to your serverless
                proxy (Netlify / Vercel function).
   ================================================ */

(function () {
    'use strict';

    /* ── CONFIG ──────────────────────────────────── */
    var CFG = {
        apiEndpoint : '',           // e.g. '/.netlify/functions/chat'
        botName     : 'COODIE_AI',
        accentYellow: '#EDE500',
        accentBlue  : '#5BC8F5',
        accentGreen : '#00FF41',
    };

    /* ── CONVERSATION STATE ──────────────────────── */
    var S = {
        IDLE        : 'idle',
        Q_WHAT      : 'q_what',   // asked "what does your business do?"
        Q_GOAL      : 'q_goal',   // asked "what's the main goal?"
        Q_ECOM_GOAL : 'q_ecom',   // asked "sell products or brand-only?"
        DONE        : 'done',
    };

    var state   = S.IDLE;
    var ctx     = {};            // collects answers during qualification
    var msgCount = 0;

    /* ── INTENT DETECTION ────────────────────────── */
    function detectIntent(t) {
        var l = t.toLowerCase();

        // Greeting
        if (/^(hi|hello|hey|ciao|salve|buongiorno|hola|yo)[\s!?.,]*$/.test(l.trim())) return 'GREET';

        // Needs recommendation — open question, don't jump to conclusions
        if (/which service|what service|what (do|should|would|can) (you|i)|right for (me|my|us|our)|recommend|suggest|not sure|help me (choose|decide|pick)|quale serv|consig|cosa (mi|devo|dovrei|posso)|for my (agency|studio|brand|business|company|startup|client|project|team)|what('s| is) the (best|right|difference)|unsure|confused|don'?t know|non so|non saprei/.test(l)) return 'RECOMMEND';

        // Pricing — direct question
        if (/\bpric(e|ing)\b|cost|how much|quanto|prezzo|\b€\b|euro/.test(l)) return 'PRICE';

        // Specific service curiosity
        if (/one.?page|landing page|single.?page/.test(l)) return 'SVC_ONE';
        if (/multi.?page|multipage|more (than one|page)|several page/.test(l)) return 'SVC_MULTI';
        if (/e.?commerce|ecom|shop|store|sell online|vendita online/.test(l)) return 'SVC_ECOM';
        if (/\bai\b|agent|chatbot|bot|automat/.test(l)) return 'SVC_AI';

        // Process / timeline
        if (/how long|timeline|delivery|weeks|process|come funziona|how (do you|does it) work/.test(l)) return 'PROCESS';

        // Contact
        if (/contact|quote|brief|start a project|start (the )?project|get started|preventivo/.test(l)) return 'CONTACT';

        // About
        if (/who are you|about you|coodie|chi sei|di cosa|what do you do/.test(l)) return 'ABOUT';

        return 'DEFAULT';
    }

    /* ── DIRECT INTENT RESPONSES ─────────────────── */
    var DIRECT = {
        GREET: function () {
            return "Hey! I'm COODIE_AI — here to help you figure out what you need and what it costs.\n\nAsk me about our services, pricing, timelines, or just tell me what you're working on and I'll point you in the right direction.";
        },
        PRICE: function () {
            return "Here's the full pricing breakdown:\n\n→ One-Page Website — from €499\n→ Multi-Page Website — from €999\n→ E-Commerce — from €999\n\nAll one-time payments. No recurring platform fees. No hidden costs.\n\nFinal price depends on scope — send a brief at contact.html and we'll quote within 24h.";
        },
        SVC_ONE: function () {
            return "One-Page Website — our sharpest tool.\n\nOne scroll. One goal. Zero distractions.\n\n→ Starting at €499 (one-time)\n→ Delivered in ~3 weeks\n→ Up to 7 sections, 100% custom code\n→ Full SEO + mobile\n\nBest for: freelancers, product launches, new brands, events, solo creatives.\n\nSee LOOMLINE as a live example → works.html\nFull details → onepage.html";
        },
        SVC_MULTI: function () {
            return "Multi-Page Website — for brands that need depth.\n\n→ Starting at €999 (one-time)\n→ Delivered in ~5 weeks\n→ 5+ pages with full navigation architecture\n→ Portfolio grids, service pages, about sections\n→ 100% custom code\n\nBest for: agencies, studios, startups, B2B companies.\n\nSee KLAUS_STUDIO & AERO_CORE → works.html\nFull details → multipage.html";
        },
        SVC_ECOM: function () {
            return "E-Commerce Website — built to sell, not just display.\n\n→ Starting at €999 (one-time)\n→ Delivered in ~6 weeks\n→ Custom product pages, cart, checkout flow\n→ No Shopify tax, no platform lock-in\n→ 100% yours forever\n\nFull details → ecommerce.html\nReady to start? → contact.html";
        },
        SVC_AI: function () {
            return "You're talking to a live demo of it right now 👋\n\nThis is exactly what we build for your business — a custom AI assistant trained on your content, embedded on your site.\n\n→ STARTER (Chat Widget) — from €490\n→ PRO (Lead Machine + CRM) — from €990\n→ SYSTEM (Full Automation) — from €1,990\n\nTrained on your business. Branded as you. Live in ~1 week.\n\nFull details → contact.html\nStart a project → contact.html";
        },
        PROCESS: function () {
            return "How we work:\n\n01 → You send a brief (contact.html)\n02 → We scope the project & agree on spec\n03 → Design mockup — your approval before any code\n04 → Full build, custom code from scratch\n05 → Revisions, QA, launch\n\nYou talk directly to the person building your site. No layers, no relay.\n\nTimelines:\n→ One-Page: ~3 weeks\n→ Multi-Page: ~5 weeks\n→ E-Commerce: ~6 weeks\n→ AI Agent: ~1 week";
        },
        CONTACT: function () {
            return "Ready to get started?\n\n→ Send us a brief: contact.html\n→ Or email: coodie.studio@gmail.com\n\nWe respond within 24 hours. The brief form takes ~5 minutes and tells us everything we need to give you an exact quote.";
        },
        ABOUT: function () {
            return "Coodie Studio is a custom web design & development studio.\n\nWe build websites from scratch — no templates, no page builders, no shortcuts. One-Page, Multi-Page, E-Commerce, and AI Agents.\n\nEvery site we deliver is 100% custom-coded and 100% owned by you.\n\nLearn more → about.html";
        },
        DEFAULT: function () {
            return "I want to make sure I give you a useful answer rather than guessing.\n\nCan you tell me a bit more about what you're looking for? Or ask me something specific — services, pricing, timelines, how we work — and I'll give you a precise answer.";
        },
    };

    /* ── RECOMMENDATION FLOW ─────────────────────── */

    // Step 1 — check if the first message already contains useful context
    function extractContextFromMessage(t) {
        var l = t.toLowerCase();
        var result = { what: null, ecomSignal: false, onepageSignal: false };

        if (/agency|studio|agenzia|creative studio/.test(l))          result.what = 'agency';
        else if (/startup|tech company|saas|app/.test(l))             result.what = 'startup';
        else if (/freelancer|solo|personal brand|myself/.test(l))     result.what = 'freelancer';
        else if (/restaurant|bar|café|coffee|food|hospitality/.test(l)) result.what = 'hospitality';
        else if (/architect|architettura|architecture/.test(l))        result.what = 'architecture';
        else if (/e.?commerce|shop|store|sell|clothing brand|fashion brand|product brand/.test(l)) result.what = 'ecommerce';
        else if (/law firm|avvocato|legal|notary/.test(l))             result.what = 'legal';
        else if (/brand|branding|company|business|azienda/.test(l))   result.what = 'brand';

        result.ecomSignal   = /sell|shop|store|e.?commerce|product|vendere/.test(l);
        result.onepageSignal = /landing|launch|event|single|simple|one page|one-page/.test(l);

        return result;
    }

    function startRecommendFlow(originalMsg) {
        var extracted = extractContextFromMessage(originalMsg);
        ctx.rawFirst = originalMsg;

        // Already clearly e-commerce from first message — but ask to confirm
        if (extracted.ecomSignal && !extracted.what) {
            ctx.what = 'ecommerce-signal';
            state = S.Q_ECOM_GOAL;
            return "Got it — sounds like there might be a commerce element.\n\nAre you looking to sell products or services directly online, or is this more of a brand/portfolio site (no transactions)?";
        }

        // Already have "what" — skip first question, go to goal
        if (extracted.what) {
            ctx.what = extracted.what;
            state = S.Q_GOAL;
            return "Got it — " + labelForWhat(extracted.what) + ".\n\nWhat's the main goal of the new site? For example: showcase work and attract clients, generate leads, sell products online, establish credibility with enterprise buyers — whatever matters most to you.";
        }

        // No context yet — ask
        state = S.Q_WHAT;
        return "Happy to help you find the right fit. To give you an accurate recommendation I need to understand what you're building.\n\nWhat does your business or project do, and who are you trying to reach?";
    }

    function labelForWhat(w) {
        var labels = {
            'agency'        : 'you\'re running an agency or studio',
            'startup'       : 'it\'s a startup or tech company',
            'freelancer'    : 'it\'s a personal brand or freelance business',
            'hospitality'   : 'it\'s in the hospitality / food space',
            'architecture'  : 'it\'s an architecture practice',
            'ecommerce'     : 'there\'s a commerce element',
            'legal'         : 'it\'s a legal or professional services firm',
            'brand'         : 'it\'s a brand or company',
        };
        return labels[w] || 'got your context';
    }

    function handleQWhat(userText) {
        ctx.what = userText;
        var l = userText.toLowerCase();

        // If they clearly say "sell" in this message too — shortcut to ecom confirm
        if (/sell|shop|store|e.?commerce|vendere|negozio/.test(l)) {
            ctx.what = userText;
            state = S.Q_ECOM_GOAL;
            return "Sounds like you want to sell online — are you looking to sell physical products, digital products, or services? And is this a new store or adding e-commerce to something that already exists?";
        }

        state = S.Q_GOAL;
        return "Thanks — that helps a lot.\n\nAnd what's the main goal of the new site? For example: attract and convert clients, showcase your portfolio, sell products online, establish credibility with specific buyers, something else?";
    }

    function handleQGoal(userText) {
        ctx.goal = userText;
        state = S.DONE;
        return buildFinalRecommendation(ctx.what, ctx.goal);
    }

    function handleQEcomGoal(userText) {
        ctx.ecomGoal = userText;
        state = S.DONE;
        var l = userText.toLowerCase();

        if (/brand|showcase|portfolio|no transaction|no shop|just a site|presence|credib/.test(l)) {
            // They want brand presence, not actual e-commerce
            return buildFinalRecommendation(ctx.what || 'brand', 'brand presence and lead generation');
        }
        // Confirmed commerce
        return "Then the right choice is our **E-Commerce Website**.\n\n→ Custom product or service pages engineered to reduce drop-off\n→ Cart and checkout flow — no Shopify commission, no platform lock-in\n→ Your brand identity driving the experience, not a template theme\n→ 100% yours forever\n\nStarting at €999 → Delivered in ~6 weeks → ecommerce.html\n\nWant to talk through the scope? → contact.html";
    }

    /* ── FINAL RECOMMENDATION LOGIC ─────────────── */
    function buildFinalRecommendation(what, goal) {
        var w = (what  || '').toLowerCase();
        var g = (goal  || '').toLowerCase();
        var combined = w + ' ' + g;

        // Hard e-commerce signals
        if (/\bsell\b|shop|store|e.?commerce|checkout|cart|vendere|negozio|product(s)?\b/.test(combined)) {
            return "Based on what you've described, the right choice is our **E-Commerce Website**.\n\nWhy: you need a full purchase flow — product pages, cart, checkout — not just a marketing site. We build it custom from scratch: no Shopify fees, no platform tax, no design constraints.\n\n→ Starting at €999 (one-time)\n→ Delivered in ~6 weeks\n→ 100% custom code, fully yours\n\nSee the full service → ecommerce.html\nStart a project → contact.html";
        }

        // Agency / studio → multi-page
        if (/agency|studio|agenzia|creative agency/.test(w)) {
            var agencyGoal = /lead|client|convert|acquire/.test(g) ? 'attract and convert the right clients' : 'showcase work and establish authority';
            return "Based on what you've described, I'd recommend a **Multi-Page Website**.\n\nHere's why: an agency needs to convey depth and credibility. Clients evaluating you will want to see a portfolio section, a breakdown of your services, an about page that establishes the team — and a contact flow that pre-qualifies the right briefs. A one-pager would undersell you.\n\nThe goal you mentioned (" + agencyGoal + ") maps perfectly to a multi-page architecture:\n\n→ Homepage that positions you immediately\n→ Portfolio/work grid with project depth\n→ Services page that converts browsers into enquiries\n→ About + team\n→ Contact with brief intake\n\nStarting at €999 → Delivered in ~5 weeks → multipage.html\nSee a live example: KLAUS_STUDIO → works.html\n\nWant to talk through the scope? → contact.html";
        }

        // Startup / SaaS / tech
        if (/startup|saas|tech|app|software|platform|tool/.test(w)) {
            return "Based on what you've described, a **Multi-Page Website** is the right move.\n\nStartups typically have more than one audience (users, investors, partners) and more than one story to tell. A multi-page architecture lets you speak to each clearly without cramming everything into a single scroll.\n\nTypical structure:\n→ Homepage (the pitch)\n→ Product / Features page\n→ Pricing\n→ About / Team\n→ Contact\n\nStarting at €999 → Delivered in ~5 weeks → multipage.html\n\nStart a project → contact.html";
        }

        // Freelancer / personal brand
        if (/freelancer|solo|personal brand|myself|my own/.test(w)) {
            return "Based on what you've told me, a **One-Page Website** is the right starting point.\n\nYou have one audience, one offer, and one thing you want visitors to do. A one-pager does that with ruthless efficiency — no dilution, no nav maze, just a clean conversion journey from intro to contact.\n\nTypical structure:\n→ Hero (who you are + what you do)\n→ Services / what you offer\n→ Selected work or social proof\n→ About / brief bio\n→ Contact CTA\n\nStarting at €499 → Delivered in ~3 weeks → onepage.html\nSee a live example: LOOMLINE → works.html\n\nReady to start? → contact.html";
        }

        // Architecture / design studio → multi-page portfolio
        if (/architect|architettura|architecture|interior design/.test(w + g)) {
            return "For an architecture practice, I'd recommend a **Multi-Page Website** — specifically built as a portfolio system.\n\nArchitecture clients are visual and exacting. They'll evaluate your site as a proxy for studio quality before they consider your work. A multi-page system gives each project room to breathe, and gives your practice the institutional weight it deserves.\n\nStarting at €999 → Delivered in ~5 weeks → multipage.html\nSee a live example: KLAUS_STUDIO → works.html\n\nStart a project → contact.html";
        }

        // Hospitality / restaurant / event
        if (/restaurant|bar|café|coffee|food|hospitality|event|launch|popup/.test(w + g)) {
            return "For a hospitality or event-focused project, a **One-Page Website** hits the mark.\n\nYou need: who you are, what you do, where you are, how to book/reserve — all in a single clean scroll. No nav maze. One goal, one action.\n\nStarting at €499 → Delivered in ~3 weeks → onepage.html\n\nReady to start? → contact.html";
        }

        // Lead generation focus
        if (/lead|client acquisition|grow|acquire|new client|prospect/.test(g)) {
            return "If the primary goal is generating leads and converting visitors into clients, the right choice depends on how complex your offer is.\n\n→ If you have one clear service and one target audience → **One-Page** (€499)\n→ If you have multiple services or audiences to address → **Multi-Page** (€999)\n\nWhich sounds closer to your situation?";
        }

        // Portfolio / showcase
        if (/portfolio|showcase|show work|show our work|projects/.test(g)) {
            return "For a portfolio or showcase goal, it really comes down to volume and depth of work.\n\n→ Few projects, clear positioning, simple story → **One-Page** (€499)\n→ Ongoing archive, project detail pages, different categories → **Multi-Page** (€999)\n\nAgencies and studios with serious portfolios almost always need multi-page — you can't do justice to 10+ projects in a single scroll.\n\nBased on what you've told me, which sounds closer?";
        }

        // Credibility / authority / B2B / enterprise
        if (/credib|authorit|enterprise|b2b|investor|partner|institutional|professional/.test(combined)) {
            return "For B2B credibility and institutional positioning, a **Multi-Page Website** is the right foundation.\n\nDecision-makers evaluating a business partner are looking for depth — not a single scroll. They'll check your services page, your about/team, your case studies, your contact flow. Each needs to do a specific job.\n\nStarting at €999 → Delivered in ~5 weeks → multipage.html\n\nWant to talk through the structure? → contact.html";
        }

        // Default when can't decide between one-page and multi
        return "Based on what you've described, you're likely choosing between a **One-Page** and a **Multi-Page** site. Here's the honest breakdown:\n\n→ **One-Page (€499)** — one audience, one offer, one CTA, sharp and fast. Right if your message is clear and singular.\n\n→ **Multi-Page (€999)** — multiple services, multiple audiences, need to build trust through depth. Right if clients need to explore before contacting.\n\nStill unsure? Send us a brief at contact.html — we'll scope it and tell you exactly which fits your case in under 24 hours. No sales pressure.";
    }

    /* ── MAIN MESSAGE HANDLER ────────────────────── */
    function respond(userText) {
        msgCount++;
        var t = userText.trim();

        // ── State machine takes priority ──────────
        if (state === S.Q_WHAT)      return handleQWhat(t);
        if (state === S.Q_GOAL)      return handleQGoal(t);
        if (state === S.Q_ECOM_GOAL) return handleQEcomGoal(t);

        // ── After DONE: reset for follow-up ───────
        if (state === S.DONE) {
            state = S.IDLE;
            ctx   = {};
        }

        // ── Intent routing ─────────────────────────
        var intent = detectIntent(t);

        if (intent === 'RECOMMEND') return startRecommendFlow(t);
        if (DIRECT[intent])         return DIRECT[intent]();

        // Fallback
        return DIRECT.DEFAULT();
    }

    /* ── STYLES (injected inline) ────────────────── */
    var CSS = [
        ".cai-widget{position:fixed;bottom:1.8rem;right:1.8rem;z-index:9990;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;}",
        ".cai-trigger{display:flex;align-items:center;gap:.5rem;background:#EDE500;color:#000;border:none;padding:.7rem 1.15rem;cursor:pointer;font-family:inherit;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;transition:background .2s,transform .18s;outline:none;box-shadow:0 4px 20px rgba(237,229,0,.2);}",
        ".cai-trigger:hover{background:#5BC8F5;color:#fff;transform:translateY(-2px);}",
        ".cai-trigger svg{display:block;flex-shrink:0;}",
        ".cai-panel{position:absolute;bottom:calc(100% + .65rem);right:0;width:360px;background:#000;border:1px solid rgba(255,255,255,.12);display:flex;flex-direction:column;max-height:520px;transform:translateY(10px);opacity:0;pointer-events:none;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .22s ease;}",
        ".cai-panel.open{transform:translateY(0);opacity:1;pointer-events:all;}",
        ".cai-header{display:flex;align-items:center;justify-content:space-between;padding:.8rem 1rem;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0;}",
        ".cai-hdr-l{display:flex;align-items:center;gap:.5rem;}",
        ".cai-hdr-r{display:flex;align-items:center;gap:.55rem;}",
        ".cai-pulse{width:6px;height:6px;border-radius:50%;background:#00FF41;animation:cai-blink 2s infinite;}",
        "@keyframes cai-blink{0%,100%{opacity:1}50%{opacity:.3}}",
        ".cai-name{font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;}",
        ".cai-badge{font-size:.54rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#EDE500;border:1px solid rgba(237,229,0,.5);padding:.12rem .38rem;}",
        ".cai-x{background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;font-size:.85rem;padding:0;line-height:1;transition:color .18s;}",
        ".cai-x:hover{color:#fff;}",
        ".cai-log{flex:1;overflow-y:auto;padding:.9rem;display:flex;flex-direction:column;gap:.7rem;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.07) transparent;}",
        ".cai-log::-webkit-scrollbar{width:3px;}",
        ".cai-log::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);}",
        ".cai-msg{display:flex;flex-direction:column;gap:.2rem;max-width:92%;animation:cai-in .22s ease;}",
        "@keyframes cai-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}",
        ".cai-msg.bot{align-self:flex-start;}",
        ".cai-msg.user{align-self:flex-end;}",
        ".cai-who{font-size:.55rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}",
        ".cai-msg.bot .cai-who{color:#EDE500;}",
        ".cai-msg.user .cai-who{color:rgba(255,255,255,.3);text-align:right;}",
        ".cai-bubble{padding:.65rem .85rem;font-size:.82rem;line-height:1.7;white-space:pre-wrap;word-break:break-word;}",
        ".cai-msg.bot .cai-bubble{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.82);}",
        ".cai-msg.user .cai-bubble{background:#EDE500;color:#000;font-weight:600;}",
        ".cai-typing-row{align-self:flex-start;}",
        ".cai-dots{display:flex;gap:4px;padding:.65rem .85rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);}",
        ".cai-d{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.35);animation:cai-dot 1.2s infinite;}",
        ".cai-d:nth-child(2){animation-delay:.2s;}",
        ".cai-d:nth-child(3){animation-delay:.4s;}",
        "@keyframes cai-dot{0%,60%,100%{opacity:.3;transform:scale(1)}30%{opacity:1;transform:scale(1.3)}}",
        ".cai-foot{display:flex;align-items:center;border-top:1px solid rgba(255,255,255,.08);padding:.55rem .75rem;gap:.45rem;flex-shrink:0;}",
        ".cai-input{flex:1;background:none;border:none;color:#fff;font-family:inherit;font-size:.82rem;outline:none;padding:.25rem 0;}",
        ".cai-input::placeholder{color:rgba(255,255,255,.28);}",
        ".cai-send{background:#EDE500;border:none;color:#000;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .18s;}",
        ".cai-send:hover{background:#5BC8F5;color:#fff;}",
        "@media(max-width:480px){.cai-widget{bottom:.9rem;right:.9rem;}.cai-panel{width:calc(100vw - 1.8rem);}}"
    ].join('');

    /* ── HTML TEMPLATE ───────────────────────────── */
    var HTML = [
        '<div class="cai-widget" id="cai-root">',
          '<button class="cai-trigger" id="cai-trigger" aria-label="Open AI chat">',
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            '<span>AI AGENT</span>',
          '</button>',
          '<div class="cai-panel" id="cai-panel" role="dialog" aria-label="AI chat" aria-hidden="true">',
            '<div class="cai-header">',
              '<div class="cai-hdr-l"><span class="cai-pulse"></span><span class="cai-name">COODIE_AI</span></div>',
              '<div class="cai-hdr-r"><span class="cai-badge">DEMO</span><button class="cai-x" id="cai-x" aria-label="Close">&#10005;</button></div>',
            '</div>',
            '<div class="cai-log" id="cai-log"></div>',
            '<div class="cai-foot">',
              '<input class="cai-input" id="cai-input" type="text" placeholder="Ask about services, pricing…" autocomplete="off"/>',
              '<button class="cai-send" id="cai-send" aria-label="Send"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>',
            '</div>',
          '</div>',
        '</div>',
    ].join('');

    /* ── DOM HELPERS ─────────────────────────────── */
    function esc(s) {
        return String(s)
            .replace(/&/g,'&amp;').replace(/</g,'&lt;')
            .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function addMsg(text, role, log) {
        var el = document.createElement('div');
        el.className = 'cai-msg ' + role;
        // Bold **text** → <strong>
        var formatted = esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        el.innerHTML = '<span class="cai-who">' + (role === 'bot' ? CFG.botName : 'YOU') + '</span>'
                     + '<div class="cai-bubble">' + formatted + '</div>';
        log.appendChild(el);
        log.scrollTop = log.scrollHeight;
    }

    function showTyping(log) {
        var el = document.createElement('div');
        el.className = 'cai-msg bot cai-typing-row';
        el.id = 'cai-typing';
        el.innerHTML = '<span class="cai-who">' + CFG.botName + '</span>'
                     + '<div class="cai-dots"><span class="cai-d"></span><span class="cai-d"></span><span class="cai-d"></span></div>';
        log.appendChild(el);
        log.scrollTop = log.scrollHeight;
    }

    function hideTyping() {
        var t = document.getElementById('cai-typing');
        if (t) t.remove();
    }

    /* ── BOOTSTRAP ───────────────────────────────── */
    function init() {
        var styleEl = document.createElement('style');
        styleEl.textContent = CSS;
        document.head.appendChild(styleEl);

        var wrap = document.createElement('div');
        wrap.innerHTML = HTML;
        document.body.appendChild(wrap.firstElementChild);

        var trigger = document.getElementById('cai-trigger');
        var panel   = document.getElementById('cai-panel');
        var closeBtn= document.getElementById('cai-x');
        var log     = document.getElementById('cai-log');
        var input   = document.getElementById('cai-input');
        var sendBtn = document.getElementById('cai-send');
        var isOpen  = false;

        function open() {
            isOpen = true;
            panel.classList.add('open');
            panel.setAttribute('aria-hidden', 'false');
            if (log.children.length === 0) {
                setTimeout(function () {
                    addMsg("Hey — I'm COODIE_AI.\n\nAsk me about services, pricing, or timelines. Or just tell me what you're working on and I'll recommend the right option.", 'bot', log);
                }, 280);
            }
            setTimeout(function () { input.focus(); }, 320);
        }

        function close() {
            isOpen = false;
            panel.classList.remove('open');
            panel.setAttribute('aria-hidden', 'true');
        }

        function send() {
            var text = input.value.trim();
            if (!text) return;
            input.value = '';
            addMsg(text, 'user', log);

            // Production mode: real API
            if (CFG.apiEndpoint) {
                showTyping(log);
                fetch(CFG.apiEndpoint, {
                    method : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body   : JSON.stringify({ message: text, state: state, ctx: ctx }),
                })
                .then(function (r) { return r.json(); })
                .then(function (d) {
                    hideTyping();
                    addMsg(d.reply || d.content || '…', 'bot', log);
                })
                .catch(function () {
                    hideTyping();
                    addMsg('Connection issue. Reach us directly: coodie.studio@gmail.com', 'bot', log);
                });
                return;
            }

            // Demo mode: local state machine
            showTyping(log);
            var delay = 750 + Math.random() * 550;
            setTimeout(function () {
                hideTyping();
                addMsg(respond(text), 'bot', log);
            }, delay);
        }

        trigger.addEventListener('click', function () { isOpen ? close() : open(); });
        closeBtn.addEventListener('click', close);
        sendBtn.addEventListener('click', send);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());
