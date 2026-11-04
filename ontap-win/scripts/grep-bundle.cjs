const fs = require('fs');
const glob = require('glob');

const files = glob.sync('dist/assets/*.js');
let hasError = false;

const BAD_STRINGS = [
  'dummy.supabase.co',
  'dummy_key',
  'your_api_key_here',
  'your_project.firebaseapp.com',
  'your_project_id'
];

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    for (const bad of BAD_STRINGS) {
        if (content.includes(bad)) {
            console.error('ERROR: Found dummy/placeholder key (' + bad + ') in ' + f + '. Environment variables were not injected correctly!');
            hasError = true;
        }
    }
});

if (hasError) {
    process.exit(1);
} else {
    console.log('grep-bundle passed: Environment variables successfully injected without dummy keys.');
}
