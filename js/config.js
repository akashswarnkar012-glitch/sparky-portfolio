// ============================================================
//  EDIT THIS FILE to update your site — nothing else needed.
//  Swap placeholder images: drop your PNG/JPG in assets/work/
//  and change the img path below.
// ============================================================
const SITE = {
  alias: "SPARKY",                // your name/alias (shows in logo, title, footer)
  roles: "Roblox Artist · Builder · Map Designer",
  headline1: "Roblox Building",   // hero line 1
  headline2: "& Map Design",      // hero line 2 (gets the underline squiggle)
  tagline: "High-detail builds, maps and models — made to order.",
  commsOpen: true,                // false = hides the badge + flips status to CLOSED

  discord: "Sparky2668",          // what the copy button copies
  email: "you@example.com",
  socials: [
    { label: "Roblox",  url: "https://www.roblox.com/" },
    { label: "X / Twitter", url: "https://x.com/SparkyDeveloper" },
    { label: "YouTube", url: "https://youtube.com/" }
  ],

  // notable groups I've delivered work for — icons in assets/groups/
  groups: [
    { name: "Boho Salon", members: "1.3M+", verified: false, icon: "assets/groups/boho-salon.png", url: "https://www.roblox.com/communities/2868558/Boho-Salon" },
    { name: "Avatar Fighting Team", members: "510K+", verified: true, icon: "assets/groups/avatar-fighting-team.png", url: "https://www.roblox.com/communities/32539357/Avatar-Fighting-Team" },
    { name: "Hi-Fun Interactive", members: "150K+", verified: true, icon: "assets/groups/hi-fun.png", url: "https://www.roblox.com/communities/33912907/Hi-Fun-Interactive" },
    { name: "20 v 1", members: "135K+", verified: true, icon: "assets/groups/20v1.png", url: "https://www.roblox.com/communities/35198021/20-v-1" },
    { name: "Evolution Artworks", members: "95K+", verified: false, icon: "assets/groups/evolution-artworks.png", url: "https://www.roblox.com/communities/4724903/Evolution-Artworks" }
  ],

  skills: [
    { name: "Building",     level: 95, icon: "🏗️", blurb: "Showcase-grade environment builds with proper lighting and detail passes." },
    { name: "Map Design",   level: 90, icon: "🗺️", blurb: "Playable layouts that flow — sightlines, routes and pacing thought through." },
    { name: "3D Modeling",  level: 85, icon: "🧊", blurb: "Clean low-poly to mid-poly assets, optimized for Roblox performance." },
    { name: "Communication",level: 98, icon: "💬", blurb: "Clear updates, honest timelines, revisions handled without drama." }
  ],

  projects: [
    { title: "Space Station Map", cat: "maps", img: "assets/work/space-station.jpg", blurb: "Commissioned space station map for @localnightdev — full interior with glass dome, neon signage and custom lighting." },
    { title: "Grand Manor Hall", cat: "builds", img: "assets/work/manor-hall.jpg", blurb: "Luxury manor great hall — double balconies, grand staircase, checkered marble and warm candlelit detailing." },
    { title: "Oriental Temple Grounds", cat: "maps", img: "assets/work/oriental-temple.jpg", blurb: "Stylized oriental water temple — moon-gate arches, lantern bridges and soft god-ray lighting." },
    { title: "Boho Salon", cat: "builds", img: "assets/work/salon.jpg", blurb: "Commissioned storefront + street scene for @BohoSalonn's grand reopening — palms, flower beds and neon signage." },
  ],

  // smaller cards in the "More builds" grid — same format, click opens fullscreen too
  moreBuilds: [
    { title: "Anime Street", cat: "maps", img: "assets/work/anime-street.jpg", blurb: "Anime-style Japanese street — full block with storefronts, crosswalks and cel-shaded sky vibes." },
    { title: "Neon Sci-Fi Corridor", cat: "builds", img: "assets/work/neon-corridor.jpg", blurb: "Glow-heavy sci-fi interior with teleporter pods and layered neon lighting." },
    { title: "New Vegas Wasteland", cat: "maps", img: "assets/work/new-vegas.jpg", blurb: "Post-apocalyptic strip environment — ruined overpasses, casino skyline and dusty sunset atmosphere." },
    { title: "Sky Temple", cat: "maps", img: "assets/work/sky-temple.jpg", blurb: "Dreamlike sky-temple map — pastel colonnades, domed pavilion and glowing braziers above the clouds." }
  ],

  vouches: [
    { name: "blox_dev",     stars: 5, when: "Aug 2026", quote: "Insane quality and finished 2 days early. Instant re-hire." },
    { name: "studio_mike",  stars: 5, when: "Jul 2026", quote: "Best map designer I've commissioned, communication was top tier." },
    { name: "rblx_tycoon",  stars: 5, when: "Jul 2026", quote: "The build straight up carried our game's front page push." },
    { name: "gamedev_ana",  stars: 4, when: "Jun 2026", quote: "Great models, minor revisions handled fast. Recommended." },
    { name: "pixel_wolf",   stars: 5, when: "May 2026", quote: "Understood the vibe from one reference image. Wild." },
    { name: "sky_forge",    stars: 5, when: "Apr 2026", quote: "Fair pricing, clean optimized builds. My go-to now." }
  ]
};
