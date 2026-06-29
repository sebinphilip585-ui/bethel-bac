const fs = require('fs');
const files = [
  'src/pages/pms/Analytics.jsx',
  'src/pages/pms/CalendarView.jsx',
  'src/pages/pms/Expenses.jsx',
  'src/pages/pms/PMSDashboard.jsx',
  'src/pages/pms/ReceptionQueue.jsx',
  'src/components/pms/AIAssistant.jsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\\`/g, '\`');
  content = content.replace(/\\\$/g, '\$');
  fs.writeFileSync(f, content);
});
