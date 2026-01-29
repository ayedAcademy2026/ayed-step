// assets/results.js
(function(){
  'use strict';

  const SD = window.SITE_DATA || {};
  const RESULTS_KEY  = 'ayed_test_results_v1';
  const USER_KEY = 'ayed_user_profile_v1';
  const PLAN_SUMMARY_KEY = 'ayed_plan_summary_v1';

  const $ = (sel, root=document) => root.querySelector(sel);

  function load(key){ try{ return JSON.parse(localStorage.getItem(key)); }catch(_){ return null; } }
  function save(key, obj){ localStorage.setItem(key, JSON.stringify(obj)); }

  function sectionLabel(sec){
    if(sec === 'Grammar') return 'القواعد';
    if(sec === 'Reading') return 'القراءة';
    if(sec === 'Listening') return 'الاستماع';
    return sec;
  }

  function levelLabel(level){
    if(level === 'Advanced') return 'متقدم';
    if(level === 'Beginner') return 'مبتدئ';
    return 'متوسط';
  }

  function starSvg(on){
    return on
      ? '<svg class="star-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.3l-6.2 3.7 1.7-7.1L2 9.2l7.3-.6L12 2l2.7 6.6 7.3.6-5.5 4.7 1.7 7.1z"/></svg>'
      : '<svg class="star-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.3l-6.2 3.7 1.7-7.1L2 9.2l7.3-.6L12 2l2.7 6.6 7.3.6-5.5 4.7 1.7 7.1z"/></svg>';
  }

  function renderStars(n){
    let html = '<span class="stars" aria-label="تقييم">';
    for(let i=1;i<=5;i++) html += starSvg(i<=n);
    html += '</span>';
    return html;
  }

  function percentBar(p){
    const pct = Math.max(0, Math.min(100, p||0));
    return `
      <div class="progressbar" style="margin-top:8px">
        <div style="width:${pct}%;"></div>
      </div>
    `;
  }

  function buildPlanSummaryText(user, results, plan){
    const models = (SD.exam?.modelsReference || []).join('، ');
    const lines = [];
    lines.push(`**ملخص نتيجة اختبار تحديد المستوى**`);
    lines.push(`- النسبة العامة: ${results.percent}%`);
    lines.push(`- المستوى المقترح: ${levelLabel(results.level)}`);
    lines.push(`- أضعف قسم: ${sectionLabel(results.weakSection)} (${results.breakdown[results.weakSection].percent}%)`);
    lines.push('');
    lines.push(`**الخطة المقترحة: ${plan.title}**`);
    if(plan.focusNote) lines.push(`- ${plan.focusNote}`);
    if(plan.levelNote) lines.push(`- ${plan.levelNote}`);
    lines.push('');
    lines.push(`**ملاحظة مهمة**`);
    lines.push(`الأسئلة محاكاة مبنية على نمط النماذج الحديثة حتى نموذج ${models} — وأي نماذج جديدة تُضاف للمشتركين داخل قنوات الدورة.`);
    return lines.join('\n');
  }

  function buildShareText(result, plan, shareUrl){
  const name = (result?.meta?.name || '').trim();
  const score = Math.round((result?.overall||0));
  const strength = (result?.topStrength || '—');
  const weak = (result?.topWeakness || '—');
  const days = plan?.meta?.days || '—';
  const focus = plan?.meta?.focus || 'مراجعة ذكية + تطبيق';
  const blocks = (plan?.blocks || []).slice(0,5).map(b => `- ${b.title}: ${b.items?.[0] || ''}`).join('\n');
  const models = (window.SITE_DATA?.examModels || ['50','51']).join(' و');

  const header = `خطة مذاكرة STEP (مخصّصة) — أكاديمية عايد 2026`;
  const who = name ? `\nالاسم: ${name}` : '';
  const body =
`\nنتيجتي في اختبار تحديد المستوى: ${score}%${who}
\nنقطة القوة: ${strength}
نقطة التحسين: ${weak}
\nالخطة المقترحة (${days}): ${focus}
${blocks ? ('\n\nأول خطواتك اليوم:\n'+blocks) : ''}

⭐ الأسئلة مبنية على أحدث نماذج STEP (${models}) + تحديثات تنزل للمشتركين أول بأول.
\nجرّب الخطة لنفسك هنا 👇
${shareUrl}`;

  return header + body;
})();
