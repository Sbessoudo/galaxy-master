import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bfatmluhskjlsemylstf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYXRtbHVoc2tqbHNlbXlsc3RmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA1NDE1OSwiZXhwIjoyMDkxNjMwMTU5fQ.dkupjxmlSjmQH_mIdvAiXSkpsL1jwAQB_55ju62N2NQ',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Planet IDs ───────────────────────────────────────────────────────────────
const PLANETS = {
  schyzoCat:     '690c0a6f-8fc8-4b1e-9afc-4234948cd536', // main
  racoonAsgard:  '03106310-8198-4d08-9e91-cf1a82d63d76', // main
  duckInvaders:  '75d0c786-14ec-482c-9e53-f354169ef9e0', // main
  donutsFactory: '2def65e4-de02-4292-982f-a9f32a592456', // main
  asteroide:     '1d8b01da-defc-4d37-a1ef-4e7cdab34e91', // newcomers
  hq:            '11edb76f-1fe9-4bbb-87ff-1f05e0750ed7', // arbiters
}

// ── Astronauts ───────────────────────────────────────────────────────────────
const ASTRONAUTS = [
  // SCHYZO CAT — Rick & Morty / South Park / Always Sunny (25)
  { first_name: 'Rick',    last_name: 'Sanchez',      role_title: 'Genius Alcoholic Scientist',  planet: 'schyzoCat' },
  { first_name: 'Morty',   last_name: 'Smith',        role_title: 'Reluctant Adventure Intern',  planet: 'schyzoCat' },
  { first_name: 'Summer',  last_name: 'Smith',        role_title: 'Senior Cool Kid Engineer',    planet: 'schyzoCat' },
  { first_name: 'Beth',    last_name: 'Smith',        role_title: 'Equine Cardiac Surgeon',      planet: 'schyzoCat' },
  { first_name: 'Jerry',   last_name: 'Smith',        role_title: 'Junior Everything Intern',    planet: 'schyzoCat' },
  { first_name: 'Evil',    last_name: 'Morty',        role_title: 'Multiverse Architect',        planet: 'schyzoCat' },
  { first_name: 'Mr.',     last_name: 'Meeseeks',     role_title: 'Task Completion Specialist',  planet: 'schyzoCat' },
  { first_name: 'Bird',    last_name: 'Person',       role_title: 'Interstellar Peace Envoy',    planet: 'schyzoCat' },
  { first_name: 'Eric',    last_name: 'Cartman',      role_title: 'Chief Manipulation Officer',  planet: 'schyzoCat' },
  { first_name: 'Kyle',    last_name: 'Broflovski',   role_title: 'Moral Compass Engineer',      planet: 'schyzoCat' },
  { first_name: 'Stan',    last_name: 'Marsh',        role_title: 'Principal DevOps Engineer',   planet: 'schyzoCat' },
  { first_name: 'Kenny',   last_name: 'McCormick',    role_title: 'Immortal QA Specialist',      planet: 'schyzoCat' },
  { first_name: 'Randy',   last_name: 'Marsh',        role_title: 'Seismologist & Geologist',    planet: 'schyzoCat' },
  { first_name: 'Butters', last_name: 'Stotch',       role_title: 'Naive UX Researcher',         planet: 'schyzoCat' },
  { first_name: 'Charlie', last_name: 'Kelly',        role_title: 'Janitor & Playwright',        planet: 'schyzoCat' },
  { first_name: 'Mac',     last_name: 'McDonald',     role_title: 'Security & Spirituality Lead',planet: 'schyzoCat' },
  { first_name: 'Dennis',  last_name: 'Reynolds',     role_title: 'DENNIS System Architect',     planet: 'schyzoCat' },
  { first_name: 'Dee',     last_name: 'Reynolds',     role_title: 'Aspiring Frontend Actor',     planet: 'schyzoCat' },
  { first_name: 'Frank',   last_name: 'Reynolds',     role_title: 'Venture Capitalist CTO',      planet: 'schyzoCat' },
  { first_name: 'Bojack',  last_name: 'Horseman',     role_title: 'Washed-up Staff Engineer',    planet: 'schyzoCat' },
  { first_name: 'Diane',   last_name: 'Nguyen',       role_title: 'Ghost-writer & Tech Lead',    planet: 'schyzoCat' },
  { first_name: 'Todd',    last_name: 'Chavez',       role_title: 'Accidental Entrepreneur',     planet: 'schyzoCat' },
  { first_name: 'Princess',last_name: 'Carolyn',      role_title: 'Talent Acquisition Manager',  planet: 'schyzoCat' },
  { first_name: 'Mr.',     last_name: 'Peanutbutter', role_title: 'Enthusiastic Brand Manager',  planet: 'schyzoCat' },
  { first_name: 'Bender',  last_name: 'Rodriguez',    role_title: 'Bending Unit & CI/CD Bot',    planet: 'schyzoCat' },

  // RACOON OF ASGARD — Marvel / Guardians (25)
  { first_name: 'Tony',    last_name: 'Stark',        role_title: 'Genius Billionaire Playboy',  planet: 'racoonAsgard' },
  { first_name: 'Natasha', last_name: 'Romanoff',     role_title: 'Red Room Security Expert',    planet: 'racoonAsgard' },
  { first_name: 'Steve',   last_name: 'Rogers',       role_title: 'Super Soldier & Scrum Master',planet: 'racoonAsgard' },
  { first_name: 'Bruce',   last_name: 'Banner',       role_title: 'Gamma Radiation Physicist',   planet: 'racoonAsgard' },
  { first_name: 'Clint',   last_name: 'Barton',       role_title: 'Precision Performance Lead',  planet: 'racoonAsgard' },
  { first_name: 'Thor',    last_name: 'Odinson',      role_title: 'God of Infrastructure',       planet: 'racoonAsgard' },
  { first_name: 'Loki',    last_name: 'Laufeyson',    role_title: 'Head of Chaos Engineering',   planet: 'racoonAsgard' },
  { first_name: 'Wanda',   last_name: 'Maximoff',     role_title: 'Reality-Bending Architect',   planet: 'racoonAsgard' },
  { first_name: 'Vision',  last_name: '',             role_title: 'Synthetic Intelligence Lead', planet: 'racoonAsgard' },
  { first_name: 'Peter',   last_name: 'Parker',       role_title: 'Friendly Neighborhood Dev',   planet: 'racoonAsgard' },
  { first_name: 'TChalla', last_name: 'Udaku',        role_title: 'King & Principal Engineer',   planet: 'racoonAsgard' },
  { first_name: 'Stephen', last_name: 'Strange',      role_title: 'Multiverse Solutions Arch.',  planet: 'racoonAsgard' },
  { first_name: 'Carol',   last_name: 'Danvers',      role_title: 'Senior Cosmic Engineer',      planet: 'racoonAsgard' },
  { first_name: 'Nick',    last_name: 'Fury',         role_title: 'SHIELD Platform Director',    planet: 'racoonAsgard' },
  { first_name: 'Rocket',  last_name: 'Raccoon',      role_title: 'Weapons & DevOps Engineer',   planet: 'racoonAsgard' },
  { first_name: 'Peter',   last_name: 'Quill',        role_title: 'Star-Lord Product Manager',   planet: 'racoonAsgard' },
  { first_name: 'Gamora',  last_name: 'Zen',          role_title: 'Deadliest Data Scientist',    planet: 'racoonAsgard' },
  { first_name: 'Drax',    last_name: 'Destroyer',    role_title: 'Literal Senior Engineer',     planet: 'racoonAsgard' },
  { first_name: 'Nebula',  last_name: 'Thanos',       role_title: 'Cybernetic Systems Engineer', planet: 'racoonAsgard' },
  { first_name: 'Groot',   last_name: '',             role_title: 'Arborist & Backend Dev',      planet: 'racoonAsgard' },
  { first_name: 'Mantis',  last_name: '',             role_title: 'Empathic UX Researcher',      planet: 'racoonAsgard' },
  { first_name: 'Sam',     last_name: 'Wilson',       role_title: 'Falcon Platform Engineer',    planet: 'racoonAsgard' },
  { first_name: 'Bucky',   last_name: 'Barnes',       role_title: 'Winter Soldier SRE',          planet: 'racoonAsgard' },
  { first_name: 'Scott',   last_name: 'Lang',         role_title: 'Quantum Realm Engineer',      planet: 'racoonAsgard' },
  { first_name: 'Hope',    last_name: 'Van Dyne',     role_title: 'Wasp Mobile Lead',            planet: 'racoonAsgard' },

  // DUCK INVADERS — Star Wars (25)
  { first_name: 'Luke',    last_name: 'Skywalker',    role_title: 'Jedi Full-Stack Developer',   planet: 'duckInvaders' },
  { first_name: 'Darth',   last_name: 'Vader',        role_title: 'Dark Side CTO',               planet: 'duckInvaders' },
  { first_name: 'Han',     last_name: 'Solo',         role_title: 'Freelance Smuggler DevOps',   planet: 'duckInvaders' },
  { first_name: 'Leia',    last_name: 'Organa',       role_title: 'Rebellion Product Director',  planet: 'duckInvaders' },
  { first_name: 'Obi-Wan', last_name: 'Kenobi',       role_title: 'Senior Jedi Mentor',          planet: 'duckInvaders' },
  { first_name: 'Yoda',    last_name: '',             role_title: 'Grand Master Architect',      planet: 'duckInvaders' },
  { first_name: 'Rey',     last_name: 'Skywalker',    role_title: 'Self-Taught Jedi Engineer',   planet: 'duckInvaders' },
  { first_name: 'Kylo',    last_name: 'Ren',          role_title: 'Conflicted Platform Lead',    planet: 'duckInvaders' },
  { first_name: 'Finn',    last_name: 'FN-2187',      role_title: 'Defector & Mobile Dev',       planet: 'duckInvaders' },
  { first_name: 'Poe',     last_name: 'Dameron',      role_title: 'Best Pilot & CI Lead',        planet: 'duckInvaders' },
  { first_name: 'Din',     last_name: 'Djarin',       role_title: 'Mandalorian SRE',             planet: 'duckInvaders' },
  { first_name: 'Padmé',   last_name: 'Amidala',      role_title: 'Senator & Agile Coach',       planet: 'duckInvaders' },
  { first_name: 'Anakin',  last_name: 'Skywalker',    role_title: 'Chosen One Lead Dev',         planet: 'duckInvaders' },
  { first_name: 'Ahsoka',  last_name: 'Tano',         role_title: 'Fulcrum Staff Engineer',      planet: 'duckInvaders' },
  { first_name: 'Boba',    last_name: 'Fett',         role_title: 'Bounty Hunter & Contractor',  planet: 'duckInvaders' },
  { first_name: 'Mace',    last_name: 'Windu',        role_title: 'Council Security Engineer',   planet: 'duckInvaders' },
  { first_name: 'Qui-Gon', last_name: 'Jinn',         role_title: 'Maverick Senior Engineer',    planet: 'duckInvaders' },
  { first_name: 'Count',   last_name: 'Dooku',        role_title: 'Principal Separatist Dev',    planet: 'duckInvaders' },
  { first_name: 'Darth',   last_name: 'Maul',         role_title: 'Sith DevSecOps Engineer',     planet: 'duckInvaders' },
  { first_name: 'Cassian', last_name: 'Andor',        role_title: 'Rebel Intelligence Analyst',  planet: 'duckInvaders' },
  { first_name: 'Jyn',     last_name: 'Erso',         role_title: 'Rogue One Tech Lead',         planet: 'duckInvaders' },
  { first_name: 'Saw',     last_name: 'Gerrera',      role_title: 'Extremist Infrastructure Lead',planet: 'duckInvaders' },
  { first_name: 'Hera',    last_name: 'Syndulla',     role_title: 'Ghost Ship SRE Captain',      planet: 'duckInvaders' },
  { first_name: 'Ezra',    last_name: 'Bridger',      role_title: 'Street Kid & Junior Dev',     planet: 'duckInvaders' },
  { first_name: 'Kanan',   last_name: 'Jarrus',       role_title: 'Half-Blind Tech Mentor',      planet: 'duckInvaders' },

  // DONUTS FACTORY — Simpsons (25)
  { first_name: 'Homer',   last_name: 'Simpson',      role_title: 'Nuclear Safety Inspector',    planet: 'donutsFactory' },
  { first_name: 'Marge',   last_name: 'Simpson',      role_title: 'Senior Household Engineer',   planet: 'donutsFactory' },
  { first_name: 'Bart',    last_name: 'Simpson',      role_title: 'Underachiever & Junior Dev',  planet: 'donutsFactory' },
  { first_name: 'Lisa',    last_name: 'Simpson',      role_title: 'Principal Genius Researcher', planet: 'donutsFactory' },
  { first_name: 'Ned',     last_name: 'Flanders',     role_title: 'Neighborly Support Engineer', planet: 'donutsFactory' },
  { first_name: 'Montgomery', last_name: 'Burns',     role_title: 'Evil Monolith Architect',     planet: 'donutsFactory' },
  { first_name: 'Waylon',  last_name: 'Smithers',     role_title: 'Chief of Staff & PA',         planet: 'donutsFactory' },
  { first_name: 'Seymour', last_name: 'Skinner',      role_title: 'Principal & Scrum Master',    planet: 'donutsFactory' },
  { first_name: 'Moe',     last_name: 'Szyslak',      role_title: 'Bartender & DBA',             planet: 'donutsFactory' },
  { first_name: 'Barney',  last_name: 'Gumble',       role_title: 'Belching Data Engineer',      planet: 'donutsFactory' },
  { first_name: 'Apu',     last_name: 'Nahasapeemapetilon', role_title: 'Convenience Store CTO', planet: 'donutsFactory' },
  { first_name: 'Clancy',  last_name: 'Wiggum',       role_title: 'Chief of Police & CISO',      planet: 'donutsFactory' },
  { first_name: 'Jeff',    last_name: 'Albertson',    role_title: 'Comic Book QA Specialist',    planet: 'donutsFactory' },
  { first_name: 'Krusty',  last_name: 'Krustofsky',   role_title: 'Entertainer & Head of Ops',   planet: 'donutsFactory' },
  { first_name: 'Sideshow',last_name: 'Bob',          role_title: 'Cultured Senior Assassin',    planet: 'donutsFactory' },
  { first_name: 'Milhouse',last_name: 'Van Houten',   role_title: 'Junior Dev & Homer Fan',      planet: 'donutsFactory' },
  { first_name: 'Nelson',  last_name: 'Muntz',        role_title: 'Ha Ha! Bug Reporter',         planet: 'donutsFactory' },
  { first_name: 'Ralph',   last_name: 'Wiggum',       role_title: 'Random Output Generator',     planet: 'donutsFactory' },
  { first_name: 'Lenny',   last_name: 'Leonard',      role_title: 'Power Plant Senior Ops',      planet: 'donutsFactory' },
  { first_name: 'Carl',    last_name: 'Carlson',      role_title: 'Anthropologist & Dev Lead',   planet: 'donutsFactory' },
  { first_name: 'Patty',   last_name: 'Bouvier',      role_title: 'DMV Systems Administrator',   planet: 'donutsFactory' },
  { first_name: 'Selma',   last_name: 'Bouvier',      role_title: 'DMV Frontend Developer',      planet: 'donutsFactory' },
  { first_name: 'Willie',  last_name: 'MacMoran',     role_title: 'Groundskeeper & DevOps',      planet: 'donutsFactory' },
  { first_name: 'Martin',  last_name: 'Prince',       role_title: 'Gifted Junior Researcher',    planet: 'donutsFactory' },
  { first_name: 'Professor', last_name: 'Frink',      role_title: 'Glavin! R&D Engineer',        planet: 'donutsFactory' },

  // ASTEROIDE — Anime (10 newcomers)
  { first_name: 'Naruto',  last_name: 'Uzumaki',      role_title: 'Future Hokage & Intern',      planet: 'asteroide' },
  { first_name: 'Sasuke',  last_name: 'Uchiha',       role_title: 'Lone Wolf Senior Dev',        planet: 'asteroide' },
  { first_name: 'Sakura',  last_name: 'Haruno',       role_title: 'Medical & Backend Engineer',  planet: 'asteroide' },
  { first_name: 'Kakashi', last_name: 'Hatake',       role_title: 'Copy Ninja Tech Lead',        planet: 'asteroide' },
  { first_name: 'Goku',    last_name: 'Son',          role_title: 'Saiyan Performance Engineer', planet: 'asteroide' },
  { first_name: 'Vegeta',  last_name: 'Ouji',         role_title: 'Prince of All Backends',      planet: 'asteroide' },
  { first_name: 'Luffy',   last_name: 'D. Monkey',    role_title: 'Pirate King & Scrum Master',  planet: 'asteroide' },
  { first_name: 'Zoro',    last_name: 'Roronoa',      role_title: 'Swordsman & CLI Wizard',      planet: 'asteroide' },
  { first_name: 'Light',   last_name: 'Yagami',       role_title: 'God & Access Control Lead',   planet: 'asteroide' },
  { first_name: 'Gon',     last_name: 'Freecss',      role_title: 'Enthusiastic Junior Dev',     planet: 'asteroide' },

  // HQ — Star Trek (8 arbiters)
  { first_name: 'James',   last_name: 'Kirk',         role_title: 'Starfleet Captain & CEO',     planet: 'hq' },
  { first_name: 'Spock',   last_name: 'Vulcan',       role_title: 'Logic-First Staff Engineer',  planet: 'hq' },
  { first_name: 'Jean-Luc',last_name: 'Picard',       role_title: 'Tea Earl Grey Platform Dir.', planet: 'hq' },
  { first_name: 'Data',    last_name: 'Android',      role_title: 'Synthetic AI Engineer',       planet: 'hq' },
  { first_name: 'Geordi',  last_name: 'La Forge',     role_title: 'Chief Engineer & SRE',        planet: 'hq' },
  { first_name: 'Deanna',  last_name: 'Troi',         role_title: 'Empathic People Manager',     planet: 'hq' },
  { first_name: 'Beverly', last_name: 'Crusher',      role_title: 'Chief Medical Officer & QA',  planet: 'hq' },
  { first_name: 'Worf',    last_name: 'Son of Mogh',  role_title: 'Security & Klingon DevOps',   planet: 'hq' },
]

// ── Contribution types ───────────────────────────────────────────────────────
// Will be fetched at runtime

// ── Point distribution weights ───────────────────────────────────────────────
// Simulate realistic uneven distribution
const PROFILE_WEIGHTS = [
  // [contribution_count_range, max_total_pts_approx]
  { count: [8, 15], label: 'star' },    // ~20% of team
  { count: [4, 8],  label: 'active' },  // ~40%
  { count: [1, 4],  label: 'casual' },  // ~30%
  { count: [0, 1],  label: 'lurker' },  // ~10%
]

function pickProfile(index, total) {
  const r = (index / total)
  if (r < 0.15) return PROFILE_WEIGHTS[0]
  if (r < 0.50) return PROFILE_WEIGHTS[1]
  if (r < 0.80) return PROFILE_WEIGHTS[2]
  return PROFILE_WEIGHTS[3]
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randDate(start, end) {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  return new Date(s + Math.random() * (e - s)).toISOString().split('T')[0]
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Seeding mock data...')

  // 1. Create season
  const { data: existingSeasons } = await supabase.from('seasons').select('id').limit(1)
  let seasonId
  if (existingSeasons?.length) {
    seasonId = existingSeasons[0].id
    console.log('✓ Using existing season:', seasonId)
  } else {
    const { data: season, error: sErr } = await supabase
      .from('seasons')
      .insert({ name: 'Saison 1 — Origine', start_date: '2025-09-01', end_date: '2026-08-31', active: true })
      .select('id').single()
    if (sErr) throw new Error('Season: ' + sErr.message)
    seasonId = season.id
    console.log('✓ Created season:', seasonId)
  }

  // 2. Activate season
  await supabase.from('seasons').update({ active: true }).eq('id', seasonId)

  // 3. Fetch contribution types
  const { data: ctypes } = await supabase.from('contribution_types').select('id, name, base_points').eq('active', true)
  const blogSolo   = ctypes.find(c => c.name.includes('blog (solo)'))
  const talkExt    = ctypes.find(c => c.name.includes('Talk externe'))
  const talkInt    = ctypes.find(c => c.name.includes('Talk interne'))
  const workshop   = ctypes.find(c => c.name.includes('Workshop (solo)'))
  const podcast    = ctypes.find(c => c.name.includes('Animation podcast'))
  const podcastP   = ctypes.find(c => c.name.includes('Participation podcast'))
  const demo       = ctypes.find(c => c.name.includes('Demo'))
  const entretien  = ctypes.find(c => c.name.includes('Entretien'))
  const projet1    = ctypes.find(c => c.name.includes('niveau 1'))
  const projet2    = ctypes.find(c => c.name.includes('niveau 2'))
  const codev      = ctypes.find(c => c.name.includes('co-dev'))
  const blogDuo    = ctypes.find(c => c.name.includes('blog (duo)'))
  const workshopD  = ctypes.find(c => c.name.includes('Workshop (duo)'))

  const POOL = [blogSolo, talkExt, talkInt, workshop, podcast, podcastP, demo, entretien, projet1, projet2, codev, blogDuo, workshopD].filter(Boolean)
  console.log(`✓ Loaded ${POOL.length} contribution types`)

  // 4. Insert astronauts
  console.log(`Inserting ${ASTRONAUTS.length} astronauts...`)
  const { data: inserted, error: aErr } = await supabase
    .from('astronauts')
    .insert(ASTRONAUTS.map(a => ({
      first_name: a.first_name,
      last_name:  a.last_name,
      role_title: a.role_title,
      planet_id:  PLANETS[a.planet],
      active:     true,
      arrival_date: randDate('2023-01-01', '2025-06-01'),
    })))
    .select('id, first_name, planet_id')

  if (aErr) throw new Error('Astronauts: ' + aErr.message)
  console.log(`✓ Inserted ${inserted.length} astronauts`)

  // 5. Insert contributions per astronaut
  const contributions = []
  const sorted = [...inserted].sort(() => Math.random() - 0.5) // shuffle for random profile assignment

  for (let i = 0; i < sorted.length; i++) {
    const astro   = sorted[i]
    const profile = pickProfile(i, sorted.length)
    const count   = randInt(...profile.count)
    let isFirstEver = true

    for (let j = 0; j < count; j++) {
      const ctype = POOL[randInt(0, POOL.length - 1)]
      const date  = randDate('2025-09-01', '2026-04-10')
      const pts   = isFirstEver ? ctype.base_points * 2 : ctype.base_points
      const isFirstSeason = j === 0

      contributions.push({
        astronaut_id:   astro.id,
        type_id:        ctype.id,
        season_id:      seasonId,
        date,
        points_awarded: isFirstSeason ? pts + 25 : pts,
        is_first_ever:  isFirstEver,
        is_first_season: isFirstSeason,
      })
      isFirstEver = false
    }
  }

  // Batch insert contributions in chunks of 100
  console.log(`Inserting ${contributions.length} contributions...`)
  const chunkSize = 100
  for (let i = 0; i < contributions.length; i += chunkSize) {
    const chunk = contributions.slice(i, i + chunkSize)
    const { error: cErr } = await supabase.from('contributions').insert(chunk)
    if (cErr) throw new Error('Contributions chunk: ' + cErr.message)
    process.stdout.write('.')
  }
  console.log('\n✓ Contributions inserted')

  // 6. Recalculate planet_season_points
  console.log('Recalculating planet season points...')
  const { data: contribAgg } = await supabase
    .from('contributions')
    .select('astronaut_id, points_awarded, season_id, astronauts(planet_id)')
    .eq('season_id', seasonId)

  const planetPts = {}
  for (const c of (contribAgg ?? [])) {
    const pid = c.astronauts?.planet_id
    if (!pid) continue
    planetPts[pid] = (planetPts[pid] ?? 0) + c.points_awarded
  }

  for (const [planet_id, total_points] of Object.entries(planetPts)) {
    await supabase
      .from('planet_season_points')
      .upsert({ planet_id, season_id: seasonId, total_points }, { onConflict: 'planet_id,season_id' })
  }
  console.log('✓ Planet season points updated:', planetPts)

  // 7. Add some trophy types + trophies
  const { data: existingTT } = await supabase.from('trophy_types').select('id').limit(1)
  if (!existingTT?.length) {
    const { data: tt } = await supabase.from('trophy_types').insert([
      { name: 'Meilleur Orateur', description: 'Best speaker of the season', icon: '🎤' },
      { name: 'Plume d\'Or', description: 'Best blog article', icon: '✍️' },
      { name: 'Esprit d\'Équipe', description: 'Best team contribution', icon: '🤝' },
      { name: 'Innovation Award', description: 'Most innovative project', icon: '💡' },
      { name: 'MVP Saison', description: 'Most Valuable Player', icon: '🏆' },
    ]).select('id, name')
    console.log('✓ Created trophy types')

    // Award a few trophies
    if (tt?.length && inserted?.length) {
      await supabase.from('trophies').insert([
        { type_id: tt[4].id, astronaut_id: inserted[0].id, season_id: seasonId, notes: 'Classement exceptionnel' },
        { type_id: tt[0].id, astronaut_id: inserted[5].id, season_id: seasonId, notes: 'Meilleur talk de la saison' },
        { type_id: tt[1].id, astronaut_id: inserted[10].id, season_id: seasonId, notes: '3 articles à fort impact' },
        { type_id: tt[2].id, planet_id: Object.values(PLANETS)[0], season_id: seasonId, notes: 'Équipe la plus soudée' },
      ])
      console.log('✓ Trophies awarded')
    }
  }

  console.log('\n✅ Seed complete!')
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
