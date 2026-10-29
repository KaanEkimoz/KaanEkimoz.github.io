// Fetches Kaan's GitHub contribution calendar (the last year, day by day)
// into src/data/github-activity.json for the home page's GitHub section.
// Runs before every build (npm "prebuild"); the deploy workflow also runs
// once a day so the calendar stays current.
//
// With GITHUB_TOKEN set (GitHub Actions) it asks the GraphQL API; without
// one it reads the public calendar page. Private contributions are counted
// only because Kaan's profile has "Include private contributions" on; they
// arrive as bare daily counts, with no repository names or messages.
// Never fails the build: on any error it keeps the last file, and with no
// file at all the section simply isn't rendered.
import { mkdirSync, writeFileSync } from 'node:fs';

const LOGIN = 'KaanEkimoz';
const OUT = new URL('../src/data/github-activity.json', import.meta.url);

async function fromGraphQL(token) {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar { weeks { contributionDays { date contributionCount } } }
      }
    }
  }`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'kaanusta.dev' },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GraphQL: ${res.status} ${JSON.stringify(json.errors ?? json)}`);
  return json.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ d: d.date, c: d.contributionCount }));
}

async function fromPage() {
  const res = await fetch(`https://github.com/users/${LOGIN}/contributions`, { headers: { 'user-agent': 'kaanusta.dev' } });
  if (!res.ok) throw new Error(`calendar page: ${res.status}`);
  const html = await res.text();
  // Each day is a cell with data-date and an id; its count is in the
  // matching tooltip ("12 contributions on …" / "No contributions on …").
  const counts = new Map();
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = /^(\d+)/.exec(m[2].trim());
    counts.set(m[1], n ? Number(n[1]) : 0);
  }
  const days = [];
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"|id="([^"]+)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"/g)) {
    const date = m[1] ?? m[4];
    const id = m[2] ?? m[3];
    days.push({ d: date, c: counts.get(id) ?? 0 });
  }
  if (days.length < 300) throw new Error(`calendar page: only ${days.length} days found`);
  return days.sort((a, b) => a.d.localeCompare(b.d));
}

try {
  const token = process.env.GITHUB_TOKEN;
  const days = token
    ? await fromGraphQL(token).catch((err) => {
        console.warn(`github-activity: ${err.message}; trying the public calendar page`);
        return fromPage();
      })
    : await fromPage();
  mkdirSync(new URL('.', OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ login: LOGIN, fetchedAt: new Date().toISOString(), days }) + '\n');
  const total = days.reduce((s, x) => s + x.c, 0);
  console.log(`github-activity: ${days.length} days, ${total} contributions (${days[0].d} → ${days.at(-1).d})`);
} catch (err) {
  console.warn(`github-activity: skipped (${err.message}); keeping the previous data, if any`);
}
