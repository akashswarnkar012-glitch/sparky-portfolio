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
    { label: "Roblox",  url: "https://www.roblox.com/users/2529181922/profile" },
    { label: "X / Twitter", url: "https://x.com/SparkyDeveloper" }
  ],

  // typed line under the groups strip
  typerPhrases: [
    "Contributed to games with 500M+ combined visits",
    "Trusted by communities with 2.2M+ members",
    "Open for commissions — let's build yours"
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
    { name: "Building",     level: 95, icon: "assets/icons/building.svg", blurb: "Showcase-grade environment builds with proper lighting and detail passes." },
    { name: "Map Design",   level: 90, icon: "assets/icons/map.svg", blurb: "Playable layouts that flow — sightlines, routes and pacing thought through." },
    { name: "3D Modeling",  level: 85, icon: "assets/icons/blender.svg", blurb: "Clean low-poly to mid-poly assets in Blender, optimized for Roblox performance." },
    { name: "Communication",level: 98, icon: "assets/icons/chat.svg", blurb: "Clear updates, honest timelines, revisions handled without drama." }
  ],

  projects: [
    { title: "Space Station Map", cat: "maps", img: "assets/work/space-station.jpg", post: "https://x.com/SparkyDeveloper/status/1836270895373189597", blurb: "Commissioned space station map for @localnightdev — full interior with glass dome, neon signage and custom lighting." },
    { title: "Grand Manor Hall", cat: "builds", img: "assets/work/manor-hall.jpg", post: "https://x.com/SparkyDeveloper/status/1865359179017601080", blurb: "Luxury manor great hall — double balconies, grand staircase, checkered marble and warm candlelit detailing." },
    { title: "Oriental Temple Grounds", cat: "maps", img: "assets/work/oriental-temple.jpg", post: "https://x.com/SparkyDeveloper/status/1980925881939034385", blurb: "Stylized oriental water temple — moon-gate arches, lantern bridges and soft god-ray lighting." },
    { title: "Boho Salon", cat: "builds", img: "assets/work/salon.jpg", post: "https://x.com/SparkyDeveloper/status/1901628418778714550", blurb: "Commissioned storefront + street scene for @BohoSalonn's grand reopening — palms, flower beds and neon signage." },
  ],

  // smaller cards in the "More builds" grid — same format, click opens fullscreen too
  moreBuilds: [
    { title: "Anime Street", cat: "maps", img: "assets/work/anime-street.jpg", blurb: "Anime-style Japanese street — full block with storefronts, crosswalks and cel-shaded sky vibes." },
    { title: "Neon Sci-Fi Corridor", cat: "builds", img: "assets/work/neon-corridor.jpg", blurb: "Glow-heavy sci-fi interior with teleporter pods and layered neon lighting." },
    { title: "New Vegas Wasteland", cat: "maps", img: "assets/work/new-vegas.jpg", blurb: "Post-apocalyptic strip environment — ruined overpasses, casino skyline and dusty sunset atmosphere." },
    { title: "Sky Temple", cat: "maps", img: "assets/work/sky-temple.jpg", blurb: "Dreamlike sky-temple map — pastel colonnades, domed pavilion and glowing braziers above the clouds." },
    { title: "Space Station Map", cat: "maps", img: "assets/work/space-station.jpg", blurb: "Commissioned space station map for @localnightdev — glass dome, neon signage, custom lighting." },
    { title: "Oriental Temple Grounds", cat: "maps", img: "assets/work/oriental-temple.jpg", blurb: "Stylized oriental water temple — moon-gate arches, lantern bridges and soft god-ray lighting." }
  ],

  // reviews section hides itself while this is empty — add real vouches like:
  // { name: "client_name", stars: 5, when: "Sep 2026", quote: "..." }
  vouches: []
};
