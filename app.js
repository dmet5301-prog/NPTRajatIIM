const events = [
  { id: 'NPT-26081', title: 'Top drive motor temperature alarm', rig: 'Rig Sagar Bhushan · MH-18', rigType: 'Drillship', month: 'August', quarter: 'Q3', category: 'Mechanical', duration: '18h 24m', cost: '₹ 38.4 L', severity: 'High', status: 'Under review', statusClass: 'review' },
  { id: 'NPT-26080', title: 'Supply boat delayed by weather', rig: 'Rig Sagar Vijay · KG-42', rigType: 'Jack-up', month: 'July', quarter: 'Q3', category: 'Logistics', duration: '11h 10m', cost: '₹ 21.2 L', severity: 'Medium', status: 'RCA in progress', statusClass: 'progressing' },
  { id: 'NPT-26079', title: 'BOP control panel fault', rig: 'Rig Aban Ice · MB-04', rigType: 'Semi-submersible', month: 'June', quarter: 'Q2', category: 'Electrical', duration: '8h 45m', cost: '₹ 16.8 L', severity: 'High', status: 'Action assigned', statusClass: 'progressing' },
  { id: 'NPT-26078', title: 'Waiting on cementing unit', rig: 'Rig Deepwater Frontier · OD-11', rigType: 'Drillship', month: 'May', quarter: 'Q2', category: 'Third party', duration: '6h 30m', cost: '₹ 12.5 L', severity: 'Low', status: 'Closed', statusClass: 'closed' }
];
const fleetRigs = [
  { name: 'Sagar Bhushan', type: 'Semi-Submersible', hours: 2276.3, events: 121, cause: 'Equipment Failure' },
  { name: 'Sagar Prabha', type: 'Semi-Submersible', hours: 1802.9, events: 101, cause: 'Weather/Environment' },
  { name: 'Sagar Kiran', type: 'Jack-Up', hours: 1756.7, events: 120, cause: 'Weather/Environment' },
  { name: 'Sagar Ekta', type: 'Semi-Submersible', hours: 1291.8, events: 81, cause: 'Logistics/Supply' },
  { name: 'Sagar Sampada', type: 'Drill Ship', hours: 1046.6, events: 55, cause: 'Weather/Environment' },
  { name: 'Sagar Vijay', type: 'Jack-Up', hours: 810.6, events: 67, cause: 'Formation/Geological' }
];
const monthTotals = [
  { name: 'Jan-2024', hours: 1356.2, events: 89 }, { name: 'Feb-2024', hours: 815.1, events: 66 },
  { name: 'Mar-2024', hours: 1624.4, events: 91 }, { name: 'Apr-2024', hours: 1396.8, events: 94 },
  { name: 'May-2024', hours: 1175.7, events: 87 }, { name: 'Jun-2024', hours: 2616.7, events: 118 }
];
const causeTotals = [
  ['Weather/Environment', 3337.4, 37.1], ['Equipment Failure', 2003.5, 22.3], ['Formation/Geological', 1568.9, 17.5],
  ['Well Control', 808.3, 9], ['Logistics/Supply', 752.7, 8.4], ['HR/Crew', 460, 5.1], ['Third Party/Regulatory', 54.1, .6]
];
const chartData = monthTotals.map(month => month.hours);
const previousData = [1356.2, 815.1, 1624.4, 1396.8, 1175.7, 2616.7];
const rowTemplate = event => `<tr><td><span class="event-title">${event.title}</span><span class="event-sub">${event.id} · ${event.rig}</span></td><td>${event.category}</td><td>${event.duration}</td><td class="cost">${event.cost}</td><td><span class="severity ${event.severity.toLowerCase()}">${event.severity}</span></td><td><span class="status ${event.statusClass}">${event.status}</span></td><td><button class="row-menu" aria-label="More actions">•••</button></td></tr>`;

const eventRows = document.querySelector('#eventRows');
const searchInput = document.querySelector('#eventSearch');
const monthFilter = document.querySelector('#monthFilter');
const severityFilter = document.querySelector('#severityFilter');
const sortSelect = document.querySelector('#sortSelect');
function renderEvents() {
  const query = searchInput.value.toLowerCase();
  const month = monthFilter.value;
  const severity = severityFilter.value;
  const sortBy = sortSelect.value;
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const filtered = events.filter(event => (month === 'all' || event.month === month) && (severity === 'all' || event.severity.toLowerCase() === severity) && `${event.title} ${event.rig} ${event.category}`.toLowerCase().includes(query));
  const sorted = [...filtered].sort((first, second) => {
    if (sortBy === 'rigName') return first.rig.localeCompare(second.rig);
    if (sortBy === 'rigType') return first.rigType.localeCompare(second.rigType);
    if (sortBy === 'month') return monthOrder.indexOf(first.month) - monthOrder.indexOf(second.month);
    if (sortBy === 'quarter') return first.quarter.localeCompare(second.quarter) || monthOrder.indexOf(first.month) - monthOrder.indexOf(second.month);
    return events.indexOf(first) - events.indexOf(second);
  });
  eventRows.innerHTML = sorted.length ? sorted.map(rowTemplate).join('') : '<tr><td colspan="7" class="empty-state">No matching events found.</td></tr>';
}
function getDashboardState() {
  const month = document.querySelector('#dashboardMonth').value;
  const rig = document.querySelector('#dashboardRig').value;
  const rigType = document.querySelector('#dashboardRigType').value;
  const quarter = document.querySelector('#dashboardQuarter').value;
  const selectedRigs = fleetRigs.filter(item => (rig === 'all' || item.name === rig) && (rigType === 'all' || item.type === rigType));
  const selectedMonths = monthTotals.filter((item, index) => (month === 'all' || item.name === month) && (quarter === 'all' || (index < 3 ? 'Q1' : 'Q2') === quarter));
  const rigRatio = selectedRigs.reduce((sum, item) => sum + item.hours, 0) / 8984.9;
  const monthRatio = selectedMonths.reduce((sum, item) => sum + item.hours, 0) / 8984.9;
  const hours = (rig === 'all' && rigType === 'all' ? 8984.9 : 8984.9 * rigRatio) * (month === 'all' && quarter === 'all' ? 1 : monthRatio);
  const eventRatio = hours / 8984.9;
  return { month, rig, rigType, quarter, selectedRigs, selectedMonths, rigRatio, monthRatio, hours, events: Math.max(0, Math.round(545 * eventRatio)) };
}
function renderChart(monthCount = 12) {
  const state = getDashboardState();
  const visibleMonths = state.selectedMonths.slice(-(monthCount === 6 ? 6 : 12));
  const maxValue = Math.max(...visibleMonths.map(item => item.hours), 1);
  document.querySelector('#chartMax').textContent = (Math.ceil(maxValue / 500) * 500).toLocaleString();
  document.querySelector('#barChart').innerHTML = visibleMonths.length ? visibleMonths.map(item => { const baseline = monthTotals.find(month => month.name === item.name); const selectedHours = item.hours * state.rigRatio; return `<div class="bar-group"><span class="bar previous" style="height:${baseline.hours / maxValue * 82}%"></span><span class="bar" style="height:${selectedHours / maxValue * 82}%"></span><label>${item.name.replace('-2024', '')}</label></div>`; }).join('') : '<span class="empty-chart">No data for this filter</span>';
  const peak = visibleMonths.reduce((highest, item) => item.hours > highest.hours ? item : highest, { hours: 0, name: 'No month' });
  peak.hours *= state.rigRatio;
  document.querySelector('#chartCallout').textContent = `${peak.name} · ${peak.hours.toLocaleString()} hrs`;
}
function renderDashboard() {
  const state = getDashboardState();
  const topRig = state.selectedRigs.reduce((highest, item) => item.hours > highest.hours ? item : highest, { name: 'No rig', hours: 0, cause: 'No data' });
  const peakMonth = state.selectedMonths.reduce((highest, item) => item.hours > highest.hours ? item : highest, { name: 'No month', hours: 0 });
  document.querySelector('#hoursValue').innerHTML = `${state.hours.toLocaleString(undefined, { maximumFractionDigits: 1 })} <small>hrs</small>`;
  document.querySelector('#eventsValue').textContent = `${state.events.toLocaleString()} events`;
  document.querySelector('#averageValue').innerHTML = `${state.events ? (state.hours / state.events).toFixed(1) : '0.0'} <small>hrs</small>`;
  document.querySelector('#topRigValue').textContent = topRig.name;
  document.querySelector('#topRigHours').innerHTML = `${(topRig.hours * state.monthRatio).toLocaleString(undefined, { maximumFractionDigits: 1 })} <small>hrs</small>`;
  document.querySelector('#topRigProgress').style.width = `${Math.min(100, topRig.hours / 8984.9 * 100)}%`;
  document.querySelector('#topRigCause').textContent = topRig.cause;
  document.querySelector('#peakMonthValue').innerHTML = `${peakMonth.name} <small>month</small>`;
  document.querySelector('#peakMonthHours').textContent = `${(peakMonth.hours * state.rigRatio).toLocaleString(undefined, { maximumFractionDigits: 1 })} hrs`;
  renderChart(document.querySelector('#trendSelect').value === 'Last 6 months' ? 6 : 12);
}
renderEvents(); renderDashboard();
document.querySelector('#trendSelect').addEventListener('change', renderDashboard);
['#dashboardMonth', '#dashboardRig', '#dashboardRigType', '#dashboardQuarter'].forEach(selector => document.querySelector(selector).addEventListener('change', renderDashboard));
document.querySelector('#clearDashboardFilters').addEventListener('click', () => { ['#dashboardMonth', '#dashboardRig', '#dashboardRigType', '#dashboardQuarter'].forEach(selector => document.querySelector(selector).value = 'all'); renderDashboard(); });
searchInput.addEventListener('input', renderEvents); monthFilter.addEventListener('change', renderEvents); severityFilter.addEventListener('change', renderEvents); sortSelect.addEventListener('change', renderEvents);

const modal = document.querySelector('#eventModal');
const form = document.querySelector('#eventForm');
const impact = document.querySelector('#calculatedImpact');
const openModal = () => { modal.hidden = false; document.querySelector('[name="start"]').focus(); };
const closeModal = () => { modal.hidden = true; };
document.querySelector('#openModal').addEventListener('click', openModal);
document.querySelector('#closeModal').addEventListener('click', closeModal);
document.querySelector('#cancelModal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
function calculateImpact() {
  const start = new Date(form.start.value); const end = new Date(form.end.value);
  if (!form.start.value || !form.end.value || Number.isNaN(start.getTime()) || end <= start) { impact.textContent = 'Set times to calculate'; return; }
  const hours = (end - start) / 36e5; const rigCost = (Number(form.dailyRate.value) / 24) * hours; const total = rigCost + Number(form.extraCost.value);
  impact.textContent = `₹ ${(total / 100000).toFixed(1)} L · ${hours.toFixed(1)} hrs`;
}
form.addEventListener('input', calculateImpact);
form.addEventListener('submit', event => { event.preventDefault(); const data = new FormData(form); const start = new Date(data.get('start')); const end = new Date(data.get('end')); const hours = Math.max(0, (end - start) / 36e5); const month = start.toLocaleString('en-US', { month: 'long' }); const quarter = `Q${Math.floor(start.getMonth() / 3) + 1}`; const rigType = data.get('rig').includes('Sagar') ? 'Jack-up' : 'Drillship'; events.unshift({ id: `NPT-${String(26082 + events.length).padStart(5, '0')}`, title: data.get('description'), rig: `${data.get('rig')} · ${data.get('well')}`, rigType, month, quarter, category: data.get('category'), duration: `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`, cost: `₹ ${((Number(data.get('dailyRate')) / 24 * hours + Number(data.get('extraCost'))) / 100000).toFixed(1)} L`, severity: data.get('severity'), status: 'Under review', statusClass: 'review' }); renderEvents(); closeModal(); form.reset(); showToast('Event saved to the register'); });
function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
document.querySelector('#exportButton').addEventListener('click', () => showToast('Monthly NPT report queued for export'));
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === button.dataset.view)); if (button.dataset.view !== 'overview') { document.querySelector('#eventsSection').scrollIntoView({ behavior: 'smooth' }); showToast(`${button.textContent.trim()} view selected`); } }));
document.querySelector('#menuButton').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });