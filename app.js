/* Starters Robotics Group: static site (hash-routed, no build step). */
(function () {
  const $app = document.getElementById('app');
  const enrolHref = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent("SATURDAY: Hi, I'd like to enrol my child.");
  const TORN = 'polygon(0 42%,5% 20%,11% 40%,17% 12%,23% 36%,30% 16%,36% 42%,43% 18%,49% 38%,56% 10%,62% 34%,69% 18%,75% 44%,82% 14%,88% 36%,94% 16%,100% 32%,100% 100%,0 100%)';
  const TORN_FOOT = 'polygon(0 60%,5% 30%,11% 55%,17% 20%,23% 50%,30% 25%,36% 60%,43% 28%,49% 52%,56% 18%,62% 48%,69% 26%,75% 62%,82% 22%,88% 50%,94% 24%,100% 45%,100% 100%,0 100%)';
  const PAGES = ['programme', 'competitions', 'students', 'parents'];
  const YT_ID = 'VRwNGOzqhO4';
  const state = { route: '', filter: 0, openFaq: 0, toast: '' };
  const ytSrc = () => 'https://www.youtube.com/embed/' + YT_ID + '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + YT_ID + '&rel=0&modestbranding=1&playsinline=1&origin=' + encodeURIComponent(location.origin);
  let toastTimer;

  const gear = (size, color = '#B84242', style = '') =>
    `<svg viewBox="0 0 100 100" aria-hidden="true" style="width:${size};height:${size};display:block;overflow:visible;${style}"><g fill="${color}">${[0, 45, 90, 135, 180, 225, 270, 315].map(r => `<rect x="41" y="3" width="18" height="22" rx="2" transform="rotate(${r} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="28" fill="none" stroke="${color}" stroke-width="17"/></svg>`;

  const wordmark = (fs) => `<span style="display:inline-flex;flex-direction:column;font-family:'Montserrat',sans-serif;font-weight:900;color:#FFFFFF;line-height:1;font-size:${fs}px">
    <span style="font-size:.4em;text-align:justify;text-align-last:justify">S T A R T E R S</span>
    <span style="display:flex;align-items:center;margin:.05em 0">R<span style="width:.72em;height:.72em;margin:0 .04em">${gear('100%')}</span>BOTICS</span>
    <span style="font-size:.4em;text-align:justify;text-align-last:justify;color:#B84242">G R O U P</span></span>`;

  const stageCards = (s) => `<div style="background:#2E2A2B;border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:8px;border-top:4px solid ${s.ring}">
      <div style="font:400 36px/1 'Anton',sans-serif;color:#E07070">${s.n}</div>
      <div style="font:900 21px/1.05 'Montserrat',sans-serif">${s.name}</div>
      <div style="font:500 13px 'Poppins',sans-serif;color:#A8A2A3">${s.mean} · ages ${s.ages}</div>
      <div style="font:400 14px/1.5 'Poppins',sans-serif;color:#D9D4D5">${s.line}</div></div>`;

  /* ---------- students (gated by SITE.SHOW_STUDENTS) ---------- */
  const enrich = (s) => {
    const st = STAGES[s.stage - 1];
    return Object.assign({}, s, {
      ring: st.ring, stageName: st.name, stageLabel: `STAGE ${s.stage} · ${st.name.toUpperCase()}`, badgeCount: s.badges.length, compCount: s.comps.length,
      badgeObjs: s.badges.map(code => { const [a, b] = code.split('.').map(Number); const g = STAGES[a - 1]; return { code, ring: g.ring, inner: g.inner, short: g.titles[b - 1] }; })
    });
  };
  const profileUrl = (slug) => location.href.split('#')[0] + '#/students/' + slug;
  const photoSlot = (s, ratio) => s.photo
    ? `<img src="${s.photo}" alt="${s.first}" style="width:100%;height:100%;object-fit:cover;display:block">`
    : `<div style="width:100%;height:100%;background:#363132;display:flex;align-items:center;justify-content:center;font:500 13px 'Poppins',sans-serif;color:#A8A2A3">Photo of ${s.first}</div>`;

  const studentCard = (s, ratio) => `<a class="student-card" href="#/students/${s.slug}" style="display:flex;flex-direction:column;background:#2E2A2B;border-radius:20px;overflow:hidden;color:#FFFFFF">
      <div style="aspect-ratio:${ratio};position:relative">${photoSlot(s)}</div>
      <div style="padding:18px 20px;display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><div style="font:900 22px 'Montserrat',sans-serif">${s.name}</div><div style="font:500 13px 'Poppins',sans-serif;color:#A8A2A3">Age ${s.age}</div></div>
        <div style="font:600 13px 'Poppins',sans-serif;color:#E07070">${s.stageName} · ${s.badgeCount} badges</div>
        <div style="font:400 14px/1.5 'Poppins',sans-serif;color:#D9D4D5">${s.tagline}</div></div></a>`;

  /* ---------- views ---------- */
  const eyebrow = (t) => `<div style="font:600 13px 'Poppins',sans-serif;letter-spacing:.2em;color:#E07070">${t}</div>`;
  const pageHead = (eb, l1, l2, p) => `<div style="display:flex;flex-direction:column;gap:18px;max-width:760px">${eyebrow(eb)}
      <h1 style="margin:0;display:flex;flex-direction:column"><span style="font:900 clamp(36px,5vw,64px)/1 'Montserrat',sans-serif">${l1}</span><span style="font:400 clamp(60px,8vw,108px)/.95 'Anton',sans-serif;color:#B84242">${l2}</span></h1>
      <p style="margin:0;font:400 18px/1.6 'Poppins',sans-serif;color:#D9D4D5;text-wrap:pretty">${p}</p></div>`;

  const hexPhoto = (src, alt) => `<div class="ph"><img src="assets/photos/${src}" alt="${alt}" loading="lazy"></div>`;

  const homeView = () => `<main id="main">
  <section style="position:relative;padding:clamp(48px,8vw,104px) clamp(20px,5vw,56px) clamp(96px,11vw,140px)">
    <div style="max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:48px;align-items:center">
      <div style="display:flex;flex-direction:column;gap:28px">
        ${eyebrow('ROBOTICS &amp; AI · ACCRA, GHANA')}
        <h1 style="margin:0;display:flex;flex-direction:column"><span style="font:900 clamp(40px,6vw,76px)/.95 'Montserrat',sans-serif">THIS IS WHERE</span><span style="font:400 clamp(68px,10vw,140px)/.9 'Anton',sans-serif;color:#B84242">Competitors</span><span style="font:900 clamp(40px,6vw,76px)/.95 'Montserrat',sans-serif">ARE MADE.</span></h1>
        <p style="margin:0;max-width:500px;font:400 18px/1.6 'Poppins',sans-serif;color:#D9D4D5;text-wrap:pretty">A non-profit accelerating robotics education, exposure and experience in Africa through competitions, collaborations and community engagement.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:10px;max-width:560px">
          ${[['COMPETITIONS', 'Confidence on local and global stages'], ['COLLABORATIONS', 'Teamwork with schools and partners'], ['COMMUNITY', 'Skills shared with the people around them']].map(([a, b]) => `<div style="border-top:3px solid #B84242;padding-top:10px;display:flex;flex-direction:column;gap:2px"><div style="font:800 15px 'Montserrat',sans-serif">${a}</div><div style="font:400 13px/1.45 'Poppins',sans-serif;color:#A8A2A3">${b}</div></div>`).join('')}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
          <a class="btn-red" href="#/parents" style="font:800 15px 'Montserrat',sans-serif;letter-spacing:.04em;padding:16px 46px 16px 22px;clip-path:polygon(0 0,90% 0,100% 50%,90% 100%,0 100%)">COME SEE A SATURDAY</a>
          <a class="btn-ghost" href="#/${SITE.SHOW_STUDENTS ? 'students' : 'competitions'}" style="border:1.5px solid #4A4446;color:#FFFFFF;font:600 15px 'Poppins',sans-serif;padding:14px 22px;border-radius:999px">${SITE.SHOW_STUDENTS ? 'Meet our students' : 'See where we compete'}</a>
        </div>
      </div>
      <div style="position:relative;width:100%;padding:0 4% 4% 0">
        <div style="position:absolute;inset:6% 0 0 6%;background:#B84242;border-radius:24px"></div>
        <div style="position:relative;aspect-ratio:16/9;border-radius:20px;overflow:hidden;background:#000">
          <img src="https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block">
          <iframe id="trailer" src="${ytSrc()}" title="Starters Robotics Group trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;inset:0;width:100%;height:100%;border:0;display:block"></iframe>
          
        </div>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:-1px;height:56px;background:#EDEBE8;clip-path:${TORN}"></div>
  </section>

  <section style="background:#EDEBE8;color:#231F20;padding:8px clamp(20px,5vw,56px) clamp(48px,6vw,72px)">
    <div style="max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:24px">
      ${[['SATURDAYS', 'Robotics and coding sessions'], ['AGES 3–15', 'Five stages, one badge at a time'], ['STARTERS HUB', 'Lashibi-Sakumono, Accra'], ['NO EXPERIENCE', 'needed to start']].map(([a, b]) => `<div style="display:flex;flex-direction:column;gap:4px"><div style="font:400 40px/1 'Anton',sans-serif;color:#B84242">${a}</div><div style="font:500 15px 'Poppins',sans-serif">${b}</div></div>`).join('')}
    </div>
  </section>

  <section style="padding:clamp(64px,8vw,104px) clamp(20px,5vw,56px) clamp(32px,4vw,56px)">
    <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:32px">
      <h2 style="margin:0;display:flex;flex-direction:column"><span style="font:900 clamp(30px,4.5vw,56px)/1 'Montserrat',sans-serif">REAL BUILDERS.</span><span style="font:400 clamp(52px,7vw,92px)/.95 'Anton',sans-serif;color:#B84242">Real robots</span></h2>
      <div class="gallery">
        ${hexPhoto('kneel1.jpg', 'Students and coaches around a robot on the competition mat')}
        ${hexPhoto('vexbooth.jpg', 'Team at the VEX Robotics display')}
        ${hexPhoto('class.jpg', 'Saturday coding session at Starters Hub')}
        ${hexPhoto('parc.jpg', 'Team with the Ghana flag at the Pan-African Robotics Competition')}
        ${hexPhoto('builder.jpg', 'Student programming a robot on a laptop')}
        ${hexPhoto('vexkids.jpg', 'Students inspecting a VEX robot')}
      </div>
      <div class="reel">
        ${['vex1', 'field1', 'lab1'].map(c => `<div class="vid"><video data-lazy="assets/clips/${c}.mp4" muted loop playsinline preload="none" aria-label="Robot run clip"></video></div>`).join('')}
      </div>
    </div>
  </section>

  <section style="padding:clamp(32px,4vw,56px) clamp(20px,5vw,56px) clamp(64px,8vw,104px)">
    <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:36px">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px">
        <h2 style="margin:0;display:flex;flex-direction:column"><span style="font:900 clamp(30px,4.5vw,56px)/1 'Montserrat',sans-serif">FROM FIRST BLOCKS</span><span style="font:400 clamp(52px,7vw,92px)/.95 'Anton',sans-serif;color:#B84242">To the podium</span></h2>
        <a href="#/programme" style="font:600 15px 'Poppins',sans-serif">How the pathway works →</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:12px">${STAGES.map(stageCards).join('')}</div>
    </div>
  </section>

  ${SITE.SHOW_STUDENTS ? `<section style="padding:0 clamp(20px,5vw,56px) clamp(64px,8vw,104px)"><div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:32px">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px"><h2 style="margin:0;display:flex;flex-direction:column"><span style="font:900 clamp(30px,4.5vw,56px)/1 'Montserrat',sans-serif">MEET THE</span><span style="font:400 clamp(52px,7vw,92px)/.95 'Anton',sans-serif;color:#B84242">Builders</span></h2><a href="#/students" style="font:600 15px 'Poppins',sans-serif">All student profiles →</a></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:16px">${STUDENTS.slice(0, 3).map(s => studentCard(enrich(s), '4/3')).join('')}</div></div></section>` : ''}

  <section style="padding:0 clamp(20px,5vw,56px) clamp(64px,8vw,104px)">
    <div style="max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr));gap:40px;align-items:start">
      <div style="display:flex;flex-direction:column;gap:18px">
        <div style="font:800 13px 'Montserrat',sans-serif;letter-spacing:.14em;color:#A8A2A3">WHERE WE COMPETE</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${COMPS.map(c => `<a class="chip" href="#/competitions" style="border:1px solid #4A4446;border-radius:99px;padding:8px 14px;font:500 14px 'Poppins',sans-serif;color:#FFFFFF">${c.name}</a>`).join('')}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="font:800 13px 'Montserrat',sans-serif;letter-spacing:.14em;color:#A8A2A3">OUR RECORD</div>
        ${RECORD.map(r => `<div style="display:flex;align-items:baseline;gap:18px;border-bottom:1px solid #3A3536;padding-bottom:12px"><span style="font:400 38px/1 'Anton',sans-serif;color:#B84242;width:80px;flex:none">${r.place}</span><span style="font:500 15px/1.45 'Poppins',sans-serif">${r.event}</span></div>`).join('')}
      </div>
    </div>
  </section>
</main>`;

  const programmeView = () => `<main id="main" style="padding:clamp(48px,7vw,88px) clamp(20px,5vw,56px)">
  <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:56px">
    ${pageHead('THE PROGRAMME', 'FIVE STAGES.', '39 badges.', 'Students move through stages, not age bands. Every stage is made of short courses, and every course earns its own badge.')}
    <div style="display:flex;flex-direction:column;gap:12px">
      ${STAGES.map(s => `<div style="background:#2E2A2B;border-radius:20px;padding:clamp(20px,3vw,32px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px 32px;border-left:6px solid ${s.ring}">
        <div style="display:flex;gap:18px;align-items:flex-start"><div style="font:400 56px/.9 'Anton',sans-serif;color:#E07070">${s.n}</div><div style="display:flex;flex-direction:column;gap:4px"><div style="font:900 26px/1.05 'Montserrat',sans-serif">${s.name}</div><div style="font:500 14px 'Poppins',sans-serif;color:#A8A2A3">${s.mean} · ages ${s.ages} · ${s.titles.length} badges</div></div></div>
        <div style="display:flex;flex-direction:column;gap:12px"><div style="font:400 16px/1.55 'Poppins',sans-serif">${s.line}</div><div style="font:400 13px/1.6 'Poppins',sans-serif;color:#A8A2A3">${s.titles.join(' · ')}</div></div></div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:14px">
      ${[['01', 'LEARN', 'The course, with a coach, on Saturdays.'], ['02', 'BUILD IT', 'A hands-on practical task in front of the coach.'], ['03', 'EXPLAIN IT', 'A short theory check on the ideas behind it.']].map(([n, t, d]) => `<div style="background:#2E2A2B;border-radius:18px;padding:24px;display:flex;flex-direction:column;gap:8px"><div style="font:400 40px/1 'Anton',sans-serif;color:#B84242">${n}</div><div style="font:800 18px 'Montserrat',sans-serif">${t}</div><div style="font:400 15px/1.55 'Poppins',sans-serif;color:#D9D4D5">${d}</div></div>`).join('')}
      <div style="background:#B84242;border-radius:18px;padding:24px;display:flex;flex-direction:column;gap:8px"><div style="font:400 40px/1 'Anton',sans-serif">✓</div><div style="font:800 18px 'Montserrat',sans-serif">BADGE EARNED</div><div style="font:500 15px/1.55 'Poppins',sans-serif">Assessments in Dec 2026, Apr 2027 and Aug 2027. Retakes welcome.</div></div>
    </div>
  </div></main>`;

  const competitionsView = () => `<main id="main" style="padding:clamp(48px,7vw,88px) clamp(20px,5vw,56px)">
  <div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:48px">
    ${pageHead('COMPETITIONS', 'TRAINED HERE.', 'Tested out there.', 'Every stage includes a competition course. These are the events we train for, from local rounds to global finals.')}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:14px">
      ${COMPS.map(c => `<div style="background:#2E2A2B;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><div style="font:900 20px/1.15 'Montserrat',sans-serif">${c.name}</div><div style="font:600 11px 'Poppins',sans-serif;letter-spacing:.1em;color:#E07070;border:1px solid #7A2229;border-radius:99px;padding:4px 10px;white-space:nowrap">${c.level}</div></div>
        <div style="font:400 15px/1.55 'Poppins',sans-serif;color:#D9D4D5">${c.blurb}</div>
        <div style="font:500 13px 'Poppins',sans-serif;color:#A8A2A3;margin-top:auto">${c.note}</div></div>`).join('')}
    </div>
    <div style="background:#B84242;border-radius:24px;padding:clamp(24px,4vw,44px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:24px">
      ${RECORD.map(r => `<div style="display:flex;flex-direction:column;gap:6px"><div style="font:400 64px/1 'Anton',sans-serif">${r.place}</div><div style="font:600 16px/1.4 'Poppins',sans-serif">${r.event}</div></div>`).join('')}
    </div>
  </div></main>`;

  const studentsView = () => {
    const filters = [{ label: 'All', stage: 0 }].concat(STAGES.map(s => ({ label: s.name, stage: s.n })));
    const list = STUDENTS.map(enrich).filter(s => !filters[state.filter].stage || s.stage === filters[state.filter].stage);
    return `<main id="main" style="padding:clamp(48px,7vw,88px) clamp(20px,5vw,56px)"><div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:40px">
      ${pageHead('OUR STUDENTS', 'MEET THE', 'Builders', 'Badges earned, competitions entered, and what makes each of them tick.')}
      <div style="display:flex;flex-wrap:wrap;gap:8px">${filters.map((f, i) => `<button data-filter="${i}" style="font:600 14px 'Poppins',sans-serif;padding:9px 16px;border-radius:99px;cursor:pointer;background:${state.filter === i ? '#B84242' : 'transparent'};color:#fff;border:1.5px solid ${state.filter === i ? '#B84242' : '#4A4446'}">${f.label}</button>`).join('')}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr));gap:16px">${list.map(s => studentCard(s, '1/1')).join('')}</div></div></main>`;
  };

  const profileView = (raw) => {
    const p = enrich(raw), F = p.first.toUpperCase();
    const hexBadge = (b) => `<div style="width:68px;display:flex;flex-direction:column;align-items:center;gap:5px" title="${b.short}"><div class="hex" style="width:46px;aspect-ratio:.866;background:${b.ring};display:flex;align-items:center;justify-content:center"><div class="hex" style="width:84%;aspect-ratio:.866;background:${b.inner};display:flex;align-items:center;justify-content:center;font:400 15px 'Anton',sans-serif">${b.code}</div></div><div style="font:500 10.5px/1.2 'Poppins',sans-serif;color:#A8A2A3;text-align:center">${b.short}</div></div>`;
    return `<main id="main" style="padding:clamp(32px,5vw,56px) clamp(20px,5vw,56px) clamp(64px,8vw,104px)"><div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:40px">
      <a href="#/students" style="font:600 14px 'Poppins',sans-serif;align-self:flex-start">← All students</a>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:40px;align-items:start">
        <div style="position:relative;aspect-ratio:4/5;max-width:520px;width:100%"><div style="position:absolute;inset:6% 0 0 8%;background:${p.ring};border-radius:28px"></div><div style="position:absolute;inset:0 7% 7% 0;border-radius:28px;overflow:hidden">${photoSlot(p)}</div></div>
        <div style="display:flex;flex-direction:column;gap:24px">
          <div style="display:flex;flex-direction:column;gap:6px">${eyebrow('STUDENT PROFILE · ' + p.stageLabel)}<h1 style="margin:0;font:400 clamp(64px,9vw,120px)/.9 'Anton',sans-serif">${p.name}</h1><div style="font:500 16px 'Poppins',sans-serif;color:#A8A2A3">Age ${p.age} · with us since ${p.since}</div></div>
          <p style="margin:0;font:400 19px/1.55 'Poppins',sans-serif;color:#D9D4D5">${p.tagline}</p>
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">${[[p.badgeCount, 'of 39 badges'], [p.compCount, 'competitions'], [p.stage, 'of 5 stages']].map(([n, l]) => `<div style="background:#2E2A2B;border-radius:16px;padding:16px"><div style="font:400 40px/1 'Anton',sans-serif;color:#B84242">${n}</div><div style="font:500 13px 'Poppins',sans-serif;color:#A8A2A3">${l}</div></div>`).join('')}</div>
          <div style="background:#2E2A2B;border-radius:18px;padding:18px;display:flex;flex-direction:column;gap:12px"><div style="font:800 12px 'Montserrat',sans-serif;letter-spacing:.14em;color:#A8A2A3">SHARE ${F}'S PROFILE</div>
            <div style="display:flex;flex-wrap:wrap;gap:10px"><button data-share="${p.slug}" class="btn-red" style="border:none;border-radius:99px;padding:12px 20px;font:700 14px 'Poppins',sans-serif;cursor:pointer">Share…</button>
            <a href="https://wa.me/?text=${encodeURIComponent('Meet ' + p.first + ' from Starters Robotics Group: ' + p.badgeCount + ' badges and counting! ' + profileUrl(p.slug))}" target="_blank" rel="noopener" style="background:#FFFFFF;color:#231F20;border-radius:99px;padding:12px 20px;font:700 14px 'Poppins',sans-serif">WhatsApp</a>
            <button data-copy="${p.slug}" class="btn-ghost" style="background:transparent;color:#fff;border:1.5px solid #4A4446;border-radius:99px;padding:11px 18px;font:600 14px 'Poppins',sans-serif;cursor:pointer">Copy link</button></div></div>
        </div></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:20px">
        <div style="background:#2E2A2B;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:16px"><div style="font:800 13px 'Montserrat',sans-serif;letter-spacing:.14em;color:#E07070">BADGES EARNED</div><div style="display:flex;flex-wrap:wrap;gap:10px 8px">${p.badgeObjs.map(hexBadge).join('')}</div></div>
        <div style="background:#2E2A2B;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:16px"><div style="font:800 13px 'Montserrat',sans-serif;letter-spacing:.14em;color:#E07070">COMPETITIONS</div>${p.comps.map(c => `<div style="display:flex;gap:16px;align-items:baseline;border-bottom:1px solid #3A3536;padding-bottom:12px"><div style="font:400 24px/1 'Anton',sans-serif;color:#B84242;width:56px;flex:none">${c.year}</div><div><div style="font:700 16px 'Poppins',sans-serif">${c.name}</div><div style="font:400 14px 'Poppins',sans-serif;color:#A8A2A3">${c.result}</div></div></div>`).join('')}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:20px">
        <div style="display:flex;flex-direction:column;gap:14px"><div style="font:800 13px 'Montserrat',sans-serif;letter-spacing:.14em;color:#A8A2A3">THINGS TO KNOW ABOUT ${F}</div>${p.facts.map(f => `<div style="display:flex;gap:12px;font:500 16px/1.5 'Poppins',sans-serif"><span style="width:14px;height:14px;flex:none;margin-top:5px">${gear('14px')}</span>${f}</div>`).join('')}</div>
        <div style="border-left:4px solid #B84242;padding:4px 0 4px 24px;display:flex;flex-direction:column;gap:10px"><div style="font:800 13px 'Montserrat',sans-serif;letter-spacing:.14em;color:#A8A2A3">IN ${F}'S WORDS</div><div style="font:900 clamp(22px,2.6vw,30px)/1.25 'Montserrat',sans-serif">“${p.quote}”</div></div>
      </div></div></main>`;
  };

  const parentsView = () => `<main id="main" style="padding:clamp(48px,7vw,88px) clamp(20px,5vw,56px)"><div style="max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:56px">
    ${pageHead('FOR PARENTS', 'COME SEE A', 'Saturday.', 'No experience needed. Small cohorts, real coaching time, and a clear pathway you can follow badge by badge.')}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:40px;align-items:start">
      <div style="display:flex;flex-direction:column">${FAQS.map((q, i) => `<div style="border-top:1px solid #3A3536">
        <button data-faq="${i}" aria-expanded="${state.openFaq === i}" style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;background:none;border:none;color:#FFFFFF;padding:18px 0;font:700 17px 'Poppins',sans-serif;text-align:left;cursor:pointer">${q.q}<span style="font:400 24px 'Poppins',sans-serif;color:#E07070;flex:none">${state.openFaq === i ? '–' : '+'}</span></button>
        ${state.openFaq === i ? `<div style="font:400 15px/1.65 'Poppins',sans-serif;color:#D9D4D5;padding:0 0 20px;max-width:620px">${q.a}</div>` : ''}</div>`).join('')}</div>
      <div style="background:#EDEBE8;color:#231F20;border-radius:24px;padding:clamp(24px,3vw,36px);display:flex;flex-direction:column;gap:18px">
        <div style="font:400 44px/1 'Anton',sans-serif;color:#B84242">GET IN TOUCH</div>
        <div style="display:flex;flex-direction:column;gap:12px;font:500 16px/1.5 'Poppins',sans-serif">
          ${[['WHERE', 'Starters Hub, Lashibi-Sakumono, Accra'], ['CALL OR WHATSAPP', SITE.phone], ['EMAIL', `<a href="mailto:${SITE.email}" style="color:#9A3338">${SITE.email}</a>`], ['INSTAGRAM', SITE.instagram]].map(([l, v]) => `<div><div style="font:600 12px 'Poppins',sans-serif;letter-spacing:.12em;color:#5A5456">${l}</div>${v}</div>`).join('')}
        </div>
        <a class="btn-red" href="${enrolHref}" target="_blank" rel="noopener" style="align-self:flex-start;font:800 15px 'Montserrat',sans-serif;letter-spacing:.04em;padding:15px 46px 15px 20px;clip-path:polygon(0 0,90% 0,100% 50%,90% 100%,0 100%)">MESSAGE "SATURDAY"</a>
      </div></div></div></main>`;

  /* ---------- shell ---------- */
  const shell = (top, body) => {
    const nav = PAGES.filter(k => SITE.SHOW_STUDENTS || k !== 'students');
    return `<div style="min-height:100vh;background:#231F20;color:#FFFFFF;overflow-x:hidden">
    <a class="skip" href="#main" data-skip>Skip to content</a>
    <nav aria-label="Main" style="position:sticky;top:0;z-index:30;background:rgba(35,31,32,.95);backdrop-filter:blur(10px);border-bottom:1px solid #3A3536">
      <div style="max-width:1240px;margin:0 auto;padding:12px clamp(20px,5vw,56px);display:flex;align-items:center;gap:12px 28px;flex-wrap:wrap">
        <a href="#/" aria-label="Starters Robotics Group home" style="margin-right:auto">${wordmark(24)}</a>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px 22px;font:500 14px 'Poppins',sans-serif">
          ${nav.map(k => `<a href="#/${k}" style="color:${top === k ? '#FFFFFF' : '#D9D4D5'};border-bottom:2px solid ${top === k ? '#B84242' : 'transparent'};padding:6px 0">${k === 'parents' ? 'For parents' : k[0].toUpperCase() + k.slice(1)}</a>`).join('')}
          <a class="btn-red" href="${enrolHref}" target="_blank" rel="noopener" style="font:700 13px 'Montserrat',sans-serif;letter-spacing:.04em;padding:10px 16px;border-radius:999px">ENROL</a>
        </div></div></nav>
    ${body}
    <footer style="position:relative;background:#EDEBE8;color:#231F20;padding:56px clamp(20px,5vw,56px) 36px;margin-top:40px">
      <div style="position:absolute;left:0;right:0;top:-30px;height:32px;background:#EDEBE8;clip-path:${TORN_FOOT}"></div>
      <div style="max-width:1240px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px">
        <div style="display:flex;flex-direction:column;gap:8px;font:500 14px/1.6 'Poppins',sans-serif">
          <div style="font:900 16px 'Montserrat',sans-serif;letter-spacing:.06em">STARTERS ROBOTICS GROUP</div>
          <div>Non-profit · operating under Starters Technology LTD</div>
          <div>${SITE.phone} · <a href="mailto:${SITE.email}" style="color:#9A3338">${SITE.email}</a> · <span style="color:#9A3338;font-weight:600">${SITE.instagram}</span></div></div>
        <div style="display:flex;align-items:center;gap:10px;font:500 13px 'Poppins',sans-serif;color:#5A5456">Powered by<img src="assets/brand/starters-tech-light.png" alt="Starters Technology" style="width:120px;height:49px;object-fit:contain;display:block"></div>
      </div></footer>
    ${state.toast ? `<div role="status" style="position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#FFFFFF;color:#231F20;border-radius:99px;padding:12px 22px;font:600 14px 'Poppins',sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35);z-index:50">${state.toast}</div>` : ''}
    </div>`;
  };

  function render() {
    const r = state.route, top = r.split('/')[0];
    const slug = r.indexOf('students/') === 0 ? r.slice(9) : null;
    const prof = SITE.SHOW_STUDENTS && slug ? STUDENTS.find(s => s.slug === slug) : null;
    let body;
    if (top === 'programme') body = programmeView();
    else if (top === 'competitions') body = competitionsView();
    else if (top === 'parents') body = parentsView();
    else if (top === 'students' && SITE.SHOW_STUDENTS) body = prof ? profileView(prof) : studentsView();
    else body = homeView();
    const key = PAGES.includes(top) ? top : '';
    const y = window.scrollY;
    $app.innerHTML = shell(key, body);
    window.scrollTo(0, state.keepScroll ? y : 0); state.keepScroll = false;
    document.title = (top && PAGES.includes(top) ? top[0].toUpperCase() + top.slice(1) + ' · ' : '') + 'Starters Robotics Group · Accra';
    wire();
  }

  function flash(msg) { state.toast = msg; state.keepScroll = true; render(); clearTimeout(toastTimer); toastTimer = setTimeout(() => { state.toast = ''; state.keepScroll = true; render(); }, 2200); }

  function wire() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Lazy-load and play clips only while visible
    const vids = document.querySelectorAll('video[data-lazy]');
    if (vids.length && 'IntersectionObserver' in window && !reduce) {
      const io = new IntersectionObserver((es) => es.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) { if (!v.src) v.src = v.dataset.lazy; v.play().catch(() => {}); } else { v.pause(); }
      }), { rootMargin: '200px' });
      vids.forEach(v => io.observe(v));
    }
    document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { state.filter = +b.dataset.filter; state.keepScroll = true; render(); });
    document.querySelectorAll('[data-faq]').forEach(b => b.onclick = () => { const i = +b.dataset.faq; state.openFaq = state.openFaq === i ? -1 : i; state.keepScroll = true; render(); });
    document.querySelectorAll('[data-copy]').forEach(b => b.onclick = async () => { try { await navigator.clipboard.writeText(profileUrl(b.dataset.copy)); flash('Profile link copied'); } catch (e) { flash(profileUrl(b.dataset.copy)); } });
    document.querySelectorAll('[data-share]').forEach(b => b.onclick = async () => {
      const p = STUDENTS.find(s => s.slug === b.dataset.share), url = profileUrl(p.slug);
      if (navigator.share) { try { await navigator.share({ title: p.first + ' · Starters Robotics Group', url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
      try { await navigator.clipboard.writeText(url); flash('Link copied: paste it anywhere'); } catch (e) { flash(url); }
    });
    const skip = document.querySelector('[data-skip]');
    if (skip) skip.onclick = (e) => { e.preventDefault(); const m = document.getElementById('main'); if (m) { m.setAttribute('tabindex', '-1'); m.focus(); } };
  }

  const read = () => (location.hash || '').replace(/^#\/?/, '');
  window.addEventListener('hashchange', () => { state.route = read(); render(); });
  state.route = read();
  render();
})();
