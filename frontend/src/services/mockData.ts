import { Article, Category, AdminStat } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'National',
    slug: 'national',
    description: 'In-depth investigative coverage of domestic governance, public policy, and societal reform.',
    status: 'active',
    articleCount: 142
  },
  {
    id: 'cat-2',
    name: 'International',
    slug: 'international',
    description: 'Global geopolitical shifts, multilateral diplomacy, security accords, and cross-border developments.',
    status: 'active',
    articleCount: 98
  },
  {
    id: 'cat-3',
    name: 'Politics',
    slug: 'politics',
    description: 'Legislative proceedings, electoral analysis, regulatory oversight, and constitutionality debates.',
    status: 'active',
    articleCount: 115
  },
  {
    id: 'cat-4',
    name: 'Business',
    slug: 'business',
    description: 'Macroeconomic indicators, central bank policies, sovereign debt, corporate governance, and capital markets.',
    status: 'active',
    articleCount: 84
  },
  {
    id: 'cat-5',
    name: 'Technology',
    slug: 'technology',
    description: 'Autonomous systems, silicon supply chains, cybersecurity doctrine, and digital sovereignty.',
    status: 'active',
    articleCount: 126
  },
  {
    id: 'cat-6',
    name: 'Sports',
    slug: 'sports',
    description: 'Championship tournaments, athletic performance analytics, sporting federation governance, and athlete profiles.',
    status: 'active',
    articleCount: 67
  },
  {
    id: 'cat-7',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Cinematic retrospectives, literary reviews, cultural preservation, and performing arts commentary.',
    status: 'active',
    articleCount: 53
  }
];

export const MOCK_BREAKING_NEWS = [
  'GLOBAL SUMMIT: G20 delegates ratify landmark multilateral climate resilience treaty in Geneva',
  'CENTRAL BANK: Monetary policy committee holds benchmark interest rate steady at 4.25% amid moderating inflation',
  'AEROSPACE: International orbital consortium deploys next-generation deep space atmospheric observation satellite'
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'multilateral-diplomatic-breakthrough-climate-accord',
    title: 'Historic Multilateral Accord Reached on Cross-Border Climate Finance Architecture',
    summary: 'Envoys from 140 nations conclude grueling two-week negotiations in Geneva, establishing a standardized verification framework for sovereign green bond issuances.',
    content: `GENEVA — After ninety hours of uninterrupted plenary deliberations, delegates from 140 sovereign states ratified the Geneva Protocol on Sovereign Environmental Accountability this morning. The treaty establishes unprecedented auditing mechanisms for cross-border sustainability capital, compelling signatory states to submit to independent third-party carbon telemetry.

### The Mechanics of the Framework

At the heart of the agreement is the newly chartered Global Transition Clearinghouse, a neutral multilateral repository that will track the real-time allocation of over $1.2 trillion in sovereign green debt instruments. Financial analysts have characterized the treaty as the most consequential restructuring of transnational public finance since the establishment of the Bretton Woods institutions.

"What we have forged today is not merely an expression of shared aspiration, but an enforceable accounting discipline," remarked Chief Negotiator Elena Rostova during the concluding press briefing. "Capital will no longer flow into opaque mitigation programs without granular, cryptographically verifiable impact disclosures."

### Market Reaction and Sovereign Spreads

Within minutes of the formal ratification gavel falling, sovereign yield spreads across emerging markets tightened by an average of 18 basis points. Institutional asset managers managing sovereign wealth mandates expressed measured optimism, noting that standardized disclosure schedules eliminate the persistent discount previously applied to sovereign transition securities.

Nevertheless, representatives from developing nations raised pointed caveats regarding administrative compliance expenditures. Under the current schedule, smaller member states will be required to deploy remote sensing and atmospheric sensor networks across key industrial corridors by the conclusion of the fiscal quadrennium.

### Next Steps in Implementation

The inaugural session of the oversight council will convene in Vienna next quarter to finalize technical tolerances for methane emissions verification. As national parliaments prepare ratification dockets, diplomatic observers emphasize that the true test of the accord will rest in enforcement against non-compliant sovereign signatories during subsequent budget cycles.`,
    category: 'International',
    categorySlug: 'international',
    tags: ['Diplomacy', 'Climate Finance', 'Treaties', 'Global Economy'],
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1400&q=80',
    imageCaption: 'Delegates gather in the grand assembly hall following the adoption of the multilateral resolution.',
    imageCredit: 'Reuters / The News Documentation Pool',
    author: {
      id: 'auth-1',
      name: 'Dr. Alistair Vance',
      role: 'Chief International Diplomatic Correspondent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Former senior foreign service fellow specializing in multilateral negotiations and sovereign debt restructurings.'
    },
    publishedAt: '2026-09-30T05:30:00.000Z',
    readingTimeMinutes: 6,
    isBreaking: true,
    isFeatured: true,
    viewCount: 24890
  },
  {
    id: 'art-2',
    slug: 'silicon-architecture-quantum-benchmarks',
    title: 'New Room-Temperature Supercomputing Chip Demonstrates 40% Efficiency Leap',
    summary: 'Engineers unveil a sub-2-nanometer architecture utilizing atomic-layer graphene interconnects, significantly lowering heat dissipation in high-density data centers.',
    content: `SAN JOSE — In a peer-reviewed technical demonstration this morning, semiconductor researchers demonstrated a working microchip prototype running complex numerical simulation pipelines at room temperature while cutting thermal dissipation by more than forty percent.

The milestone, achieved through atomic-layer graphene interconnects deposited directly on crystalline silicon carbide, resolves one of the fundamental thermodynamic barriers that has constrained high-performance computing clusters over the past decade.

Industry observers project the breakthrough will accelerate the deployment of next-generation local AI inference clusters without requiring hyper-specialized cryogenic cooling infrastructure.`,
    category: 'Technology',
    categorySlug: 'technology',
    tags: ['Semiconductors', 'Hardware', 'Computing', 'Innovation'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'A microscopic view of the graphene interconnect array under high-resolution electron scanning.',
    imageCredit: 'Applied Physics Labs',
    author: {
      id: 'auth-2',
      name: 'Maya Lin Chen',
      role: 'Senior Technology Editor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-09-30T04:15:00.000Z',
    readingTimeMinutes: 4,
    isFeatured: true,
    viewCount: 18450
  },
  {
    id: 'art-3',
    slug: 'central-bank-monetary-policy-inflation-forecast',
    title: 'Central Bank Preserves Neutral Stance as Wage Growth and Inflation Converge',
    summary: 'The Monetary Policy Board held the benchmark policy rate steady at 4.25%, pointing to resilient labor productivity and balanced consumer demand metrics.',
    content: `WASHINGTON — Following a unanimous vote, the central bank governor declared that monetary policy has achieved a "sustainable equilibrium zone." Key economic indicators reveal steady consumer price moderation alongside stable employment participation across the manufacturing and services sectors.`,
    category: 'Business',
    categorySlug: 'business',
    tags: ['Central Bank', 'Monetary Policy', 'Inflation', 'Markets'],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'The central bank headquarters in early morning light as market analysts review policy disclosures.',
    imageCredit: 'Financial Press Service',
    author: {
      id: 'auth-3',
      name: 'Julian Sterling',
      role: 'Chief Economics Commentator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-09-30T03:00:00.000Z',
    readingTimeMinutes: 5,
    isFeatured: true,
    viewCount: 15320
  },
  {
    id: 'art-4',
    slug: 'parliamentary-oversight-public-procurement-reform',
    title: 'Parliamentary Committee Advances Landmark Statutory Reform on Public Contracts',
    summary: 'Bipartisan legislation introduces algorithmic fraud audits, mandatory open contracting standards, and real-time vendor supply chain transparency.',
    content: `LONDON — In a rare demonstration of cross-bench unity, parliamentarians approved the statutory overhaul of public sector procurement protocols. The statutory measure mandates verifiable blockchain audit trails for all public tenders exceeding five million pounds.`,
    category: 'Politics',
    categorySlug: 'politics',
    tags: ['Parliament', 'Public Policy', 'Legislation', 'Governance'],
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'The parliamentary committee chamber during the final reading of the procurement reform act.',
    imageCredit: 'Parliamentary Archive',
    author: {
      id: 'auth-4',
      name: 'Victoria Thorne',
      role: 'Parliamentary Affairs Bureau Chief',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-09-30T01:45:00.000Z',
    readingTimeMinutes: 4,
    viewCount: 11980
  },
  {
    id: 'art-5',
    slug: 'national-high-speed-rail-electrification-milestone',
    title: 'High-Speed Rail Electrification Reaches 90% Target Ahead of Schedule',
    summary: 'The Department of Transportation confirms seamless integration of continuous overhead catenary wire across the primary trans-continental transit trunk line.',
    content: `The ambitious national rail modernisation programme has achieved its primary electrification milestone four months ahead of schedule, facilitating an immediate 30% reduction in carbon emissions on passenger corridors.`,
    category: 'National',
    categorySlug: 'national',
    tags: ['Transit', 'Infrastructure', 'Engineering', 'National'],
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'High-speed electric passenger train on the newly electrified viaduct section.',
    imageCredit: 'Department of Transportation',
    author: {
      id: 'auth-1',
      name: 'Dr. Alistair Vance',
      role: 'Chief International Diplomatic Correspondent',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-09-29T21:00:00.000Z',
    readingTimeMinutes: 3,
    viewCount: 9450
  },
  {
    id: 'art-6',
    slug: 'championship-athletics-biomechanics-training-revolution',
    title: 'How Sensor-Infused Synthetic Tracks Are Reshaping Olympic Sprint Biomechanics',
    summary: 'Elite training centers incorporate piezoelectric track sensors to gauge ground reaction forces down to the millisecond, overturning traditional stride cadence dogma.',
    content: `EUGENE — At the high-performance athletics laboratory, runners no longer rely solely on video playback to evaluate starting block mechanics. Embedded force sensors now calculate vector trajectories dynamically.`,
    category: 'Sports',
    categorySlug: 'sports',
    tags: ['Olympics', 'Biomechanics', 'Athletics', 'Sports Science'],
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Sprinters accelerate from the blocks on a modern sensor-equipped test track.',
    imageCredit: 'Sports Science Institute',
    author: {
      id: 'auth-3',
      name: 'Julian Sterling',
      role: 'Sports Analytics Correspondent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-09-29T18:30:00.000Z',
    readingTimeMinutes: 4,
    viewCount: 7890
  },
  {
    id: 'art-7',
    slug: 'international-film-retrospective-restoration-archive',
    title: 'Rediscovered 35mm Celluloid Masterpieces Restored Using Deep Colorimetric Scans',
    summary: 'The National Film Heritage Archive completes the digital preservation of seven lost mid-century cinematic treasures, restoring their original photochemical luster.',
    content: `BOLOGNA — In the climate-controlled vaults of the preservation laboratory, photochemical archivists have completed a multi-year restoration of classic modernist films previously believed lost to nitrate degradation.`,
    category: 'Entertainment',
    categorySlug: 'entertainment',
    tags: ['Cinema', 'Archival', 'Arts', 'Culture'],
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Archival film reels being digitized at 8K resolution on an optical scanner.',
    imageCredit: 'Cineteca Nazionale',
    author: {
      id: 'auth-2',
      name: 'Maya Lin Chen',
      role: 'Senior Technology Editor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-09-29T14:15:00.000Z',
    readingTimeMinutes: 5,
    viewCount: 6540
  }
];

export const MOCK_ADMIN_STATS: AdminStat[] = [
  { label: 'Total Articles', value: '1,428', change: '+12.4%', isPositive: true, subtext: 'vs previous 30 days' },
  { label: 'Published', value: '1,382', change: '+8.1%', isPositive: true, subtext: '96.8% publishing rate' },
  { label: 'Drafts in Review', value: '34', change: '-4.2%', isPositive: false, subtext: '12 awaiting editorial sign-off' },
  { label: 'Scheduled', value: '12', change: '+50%', isPositive: true, subtext: 'Next release in 42 mins' },
  { label: 'Active Journalists', value: '48', change: '+2', isPositive: true, subtext: 'Across 6 global bureaus' },
  { label: 'Reader Comments', value: '14,920', change: '+18.7%', isPositive: true, subtext: 'Moderation queue: 99.1% clear' },
  { label: 'Monthly Pageviews', value: '2.4M', change: '+24.5%', isPositive: true, subtext: 'Avg read time: 4m 12s' },
];

export const MOCK_RECENT_ARTICLES = [
  { id: '1', title: 'Historic Multilateral Accord Reached on Cross-Border Climate Finance', category: 'International', author: 'Dr. Alistair Vance', status: 'Published', views: '24.8k', date: 'Today, 05:30' },
  { id: '2', title: 'New Room-Temperature Supercomputing Chip Demonstrates 40% Efficiency Leap', category: 'Technology', author: 'Maya Lin Chen', status: 'Published', views: '18.4k', date: 'Today, 04:15' },
  { id: '3', title: 'Central Bank Preserves Neutral Stance as Wage Growth Converges', category: 'Business', author: 'Julian Sterling', status: 'Published', views: '15.3k', date: 'Today, 03:00' },
  { id: '4', title: 'Parliamentary Committee Advances Landmark Statutory Reform on Public Contracts', category: 'Politics', author: 'Victoria Thorne', status: 'Published', views: '11.9k', date: 'Today, 01:45' },
  { id: '5', title: 'Investigation: Trans-Oceanic Subsea Cable Resiliency and Quantum Encryption', category: 'Technology', author: 'Elena Rostova', status: 'Draft', views: '—', date: 'Drafted 2h ago' },
  { id: '6', title: 'Special Report: Sovereign Agricultural Reserves in an Era of Disrupted Logistics', category: 'National', author: 'Julian Sterling', status: 'Scheduled', views: '—', date: 'Scheduled for 16:00' },
];

export const MOCK_ACTIVITY_LOG = [
  { id: '1', user: 'Victoria Thorne', action: 'Published new breaking dispatch', target: 'Parliamentary Reform', time: '12 mins ago' },
  { id: '2', user: 'Editor-in-Chief', action: 'Approved editorial review', target: 'Subsea Cable Investigation', time: '45 mins ago' },
  { id: '3', user: 'Maya Lin Chen', action: 'Uploaded high-res media package', target: 'Quantum Benchmarks Suite', time: '2 hours ago' },
  { id: '4', user: 'System Bot', action: 'Automated database health snapshot verified', target: 'MongoDB Atlas', time: '3 hours ago' },
  { id: '5', user: 'Julian Sterling', action: 'Updated standfirst summary', target: 'Central Bank Coverage', time: '5 hours ago' },
];
