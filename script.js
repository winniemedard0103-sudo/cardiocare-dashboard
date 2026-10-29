const $ = (id) => document.getElementById(id);
const now = new Date();
$('currentDate').textContent = now.toLocaleDateString(undefined, {weekday:'short',month:'short',day:'numeric',year:'numeric'});
$('syncTime').textContent = now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});

const patterns = {
  regular: {rate:72,label:'Regular rhythm pattern',path:'M0 90 L60 90 L76 84 L91 98 L108 90 L155 90 L174 90 L190 42 L208 142 L227 70 L244 90 L300 90 L360 90 L376 84 L391 98 L408 90 L455 90 L474 90 L490 42 L508 142 L527 70 L544 90 L600 90 L660 90 L676 84 L691 98 L708 90 L755 90 L774 90 L790 42 L808 142 L827 70 L844 90 L900 90',status:'Signal demo'},
  fast: {rate:132,label:'Faster rhythm pattern',path:'M0 90 L25 90 L35 83 L43 98 L52 90 L72 90 L82 42 L94 142 L106 70 L118 90 L150 90 L160 83 L168 98 L177 90 L197 90 L207 42 L219 142 L231 70 L243 90 L275 90 L285 83 L293 98 L302 90 L322 90 L332 42 L344 142 L356 70 L368 90 L400 90 L410 83 L418 98 L427 90 L447 90 L457 42 L469 142 L481 70 L493 90 L525 90 L535 83 L543 98 L552 90 L572 90 L582 42 L594 142 L606 70 L618 90 L650 90 L660 83 L668 98 L677 90 L697 90 L707 42 L719 142 L731 70 L743 90 L775 90 L785 83 L793 98 L802 90 L822 90 L832 42 L844 142 L856 70 L868 90 L900 90',status:'Fast pattern demo'},
  irregular: {rate:96,label:'Irregular-looking pattern',path:'M0 90 L35 90 L45 84 L55 98 L65 90 L90 90 L105 43 L119 140 L132 70 L145 90 L190 90 L200 83 L211 98 L222 90 L255 90 L270 43 L284 140 L297 70 L310 90 L335 90 L345 84 L355 98 L365 90 L410 90 L425 43 L439 140 L452 70 L465 90 L485 90 L495 84 L505 98 L515 90 L560 90 L575 43 L589 140 L602 70 L615 90 L650 90 L660 84 L670 98 L680 90 L715 90 L730 43 L744 140 L757 70 L770 90 L800 90 L810 84 L820 98 L830 90 L865 90 L880 43 L892 140 L900 90',status:'Irregular-looking demo'},
  flat: {rate:'—',label:'Flat signal / lead-off example',path:'M0 90 L900 90',status:'Signal unavailable'}
};
function applyPattern(key) {
  const p = patterns[key];
  $('ecgPath').setAttribute('d',p.path);
  $('ecgRate').textContent = p.rate;
  $('heartRate').textContent = p.rate === '—' ? '—' : p.rate;
  $('rhythmLabel').textContent = p.label;
  $('signalStatus').textContent = p.status;
  $('ecgPath').style.stroke = key === 'flat' ? '#e7ad56' : '#57e5a5';
  $('ecgPath').style.animation = key === 'flat' ? 'none' : 'ecg-drift 4.5s linear infinite';
  $('heartStatus').textContent = key === 'fast' ? '● Simulated high rate' : key === 'flat' ? '● No sample signal' : '● Sample reference';
  $('heartStatus').style.color = key === 'fast' || key === 'flat' ? '#b87921' : '#21856b';
}
$('applyRhythm').addEventListener('click', () => applyPattern($('rhythmSelect').value));
$('refreshButton').addEventListener('click', () => {
  const rate = 65 + Math.floor(Math.random()*21);
  $('heartRate').textContent = rate; $('ecgRate').textContent = rate;
  $('syncTime').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  $('refreshButton').textContent = '✓ Sample data refreshed';
  setTimeout(() => $('refreshButton').textContent = '↻ Refresh sample data', 1500);
});

const scenarios = {
 baseline: [
  ['info','i','Demo mode enabled','All readings and patient details are fictional.','System notice'],
  ['warning','!','Sensor not connected','No device is supplying real-time data.','Connection notice']
 ],
 high: [
  ['warning','!','High-rate example selected','The display is using a faster simulated rhythm pattern.','Scenario notice'],
  ['info','i','Educational threshold demonstration','This is not a validated alert rule and is not a clinical interpretation.','Simulation notice']
 ],
 lowoxygen: [
  ['warning','!','Low oxygen example selected','A fictional low SpO₂ value is shown to demonstrate alert styling only.','Scenario notice'],
  ['info','i','No actual measurement available','Do not use this example to make health decisions.','Simulation notice']
 ],
 lead: [
  ['warning','!','Signal unavailable','The sample display is showing a simulated lead-off state.','Connection notice'],
  ['info','i','No sensor connected','This prototype cannot detect leads or devices.','System notice']
 ]
};
function renderAlerts(key) {
  const list = $('alertList'); list.innerHTML = '';
  scenarios[key].forEach(a => {
    const row = document.createElement('div'); row.className = 'alert-item ' + (a[0] === 'info' ? 'info' : 'warning');
    row.innerHTML = `<span class="alert-symbol">${a[1]}</span><div><strong>${a[2]}</strong><p>${a[3]}</p><small>${a[4]} · demo</small></div>`;
    list.appendChild(row);
  });
  $('alertCount').textContent = scenarios[key].length;
  $('navAlertCount').textContent = scenarios[key].length;
  $('ackMessage').textContent = '';
  document.querySelectorAll('.scenario-button').forEach(b => b.classList.toggle('selected', b.dataset.scenario === key));
}
document.querySelectorAll('.scenario-button').forEach(b => b.addEventListener('click', () => renderAlerts(b.dataset.scenario)));
$('acknowledgeButton').addEventListener('click', () => {
  $('ackMessage').textContent = 'Displayed demo alerts acknowledged for this session.';
  $('alertCount').textContent = '0'; $('navAlertCount').textContent = '0';
});

const history = [
 ['09:00',72,98,16],['09:06',75,97,17],['09:12',69,98,15],['09:18',81,97,18],['09:24',74,98,16],['09:30',72,98,16]
];
function renderHistory() {
  $('historyRows').innerHTML = history.slice().reverse().map(r => `<tr><td>${r[0]}</td><td>${r[1]} bpm</td><td>${r[2]}%</td><td>${r[3]} /min</td><td>Sample data</td></tr>`).join('');
}
renderHistory();
const trendSets = {
 heart: {name:'Heart rate',y:['100','80','60','40'],line:'M0 90 L40 82 L80 88 L120 66 L160 74 L200 54 L240 65 L280 82 L320 70 L360 48 L400 60 L440 78 L480 70 L520 56 L560 67 L600 60 L650 64'},
 oxygen: {name:'Oxygen saturation',y:['100','98','96','94'],line:'M0 55 L40 50 L80 56 L120 46 L160 52 L200 44 L240 48 L280 52 L320 45 L360 40 L400 47 L440 51 L480 46 L520 43 L560 49 L600 45 L650 47'},
 resp: {name:'Respiratory rate',y:['24','20','16','12'],line:'M0 95 L40 82 L80 89 L120 70 L160 79 L200 60 L240 67 L280 83 L320 72 L360 55 L400 66 L440 80 L480 72 L520 61 L560 70 L600 64 L650 68'}
};
function renderTrend(key) {
 const t = trendSets[key]; const points = t.line.split('L');
 const area = t.line + ' L650 160 L0 160 Z';
 $('trendMetric').textContent = t.name;
 $('yLabels').innerHTML = t.y.map(n => `<span>${n}</span>`).join('');
 $('trendLine').setAttribute('d',t.line); $('trendArea').setAttribute('d',area);
 $('trendLine').style.stroke = key === 'oxygen' ? '#3e91cf' : key === 'resp' ? '#269978' : '#d74460';
 $('trendArea').style.fill = key === 'oxygen' ? '#e8f4fc' : key === 'resp' ? '#e8f7f0' : '#fbe7eb';
}
$('trendSelect').addEventListener('change', e => renderTrend(e.target.value));

$('assessmentForm').addEventListener('submit', e => {
 e.preventDefault();
 const symptom = $('symptoms').value;
 const duration = $('duration').value;
 const historyText = $('historyInput').value.trim();
 const result = $('assessmentResult');
 if (!symptom || !duration) {
   result.classList.add('show');
   result.textContent = 'Please choose a symptom scenario and duration to complete this demonstration form.';
   return;
 }
 let advice = 'This is a fictional educational record only. The form cannot determine whether symptoms are safe or urgent.';
 if (symptom === 'Chest discomfort' || symptom === 'Shortness of breath' || symptom === 'Dizziness or faintness') {
   advice = 'Safety reminder: if these symptoms are happening to a real person—especially if severe, sudden, or worsening—seek urgent medical help. This prototype cannot assess risk.';
 }
 result.classList.add('show');
 result.innerHTML = `<strong>Demo summary</strong><br>Scenario: ${symptom}<br>Duration: ${duration}<br>Fictional history: ${historyText ? escapeHtml(historyText) : 'Not provided'}<br><br>${advice}`;
});
function escapeHtml(text) { return text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

$('menuButton').addEventListener('click', () => $('sidebar').classList.toggle('open'));
document.querySelectorAll('.side-nav a, .sidebar-bottom a').forEach(link => link.addEventListener('click', () => $('sidebar').classList.remove('open')));
renderAlerts('baseline');
