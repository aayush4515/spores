# Design inspiration

Reference HTML / Tailwind mockups for Spore main pages. Copy or adapt when building routes and components.

---

## Desktop Settings (Privacy & Settings)

```html
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Spore | Privacy &amp; Settings</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;family=Be+Vietnam+Pro:wght@100;300;400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "outline": "#818178",
              "secondary-fixed-dim": "#b8d9ef",
              "secondary-container": "#c6e7fe",
              "background": "#fffcf7",
              "on-secondary": "#ffffff",
              "surface": "#fffcf7",
              "on-error": "#ffffff",
              "inverse-surface": "#0e0e0c",
              "primary": "#4f6c4b",
              "tertiary-container": "#fcc2a2",
              "inverse-on-surface": "#9e9d98",
              "surface-container-low": "#fcf9f3",
              "error-container": "#fa7150",
              "on-surface": "#373831",
              "secondary-fixed": "#c6e7fe",
              "surface-container-high": "#f0eee4",
              "primary-dim": "#435f40",
              "on-tertiary-fixed-variant": "#6e452d",
              "tertiary-dim": "#794e35",
              "on-error-container": "#671200",
              "on-primary": "#ffffff",
              "tertiary-fixed": "#fcc2a2",
              "on-secondary-container": "#355668",
              "on-primary-fixed": "#2b4629",
              "primary-container": "#cbebc3",
              "error": "#b23d21",
              "on-tertiary": "#ffffff",
              "on-secondary-fixed-variant": "#3f5f73",
              "surface-dim": "#e4e3d6",
              "on-secondary-fixed": "#224355",
              "primary-fixed-dim": "#bdddb6",
              "on-surface-variant": "#64655c",
              "on-primary-fixed-variant": "#466243",
              "surface-container": "#f6f4ec",
              "inverse-primary": "#d9fad1",
              "tertiary-fixed-dim": "#edb596",
              "primary-fixed": "#cbebc3",
              "secondary-dim": "#3c5c6f",
              "error-dim": "#821a01",
              "surface-variant": "#eae9dd",
              "surface-container-lowest": "#ffffff",
              "surface-container-highest": "#eae9dd",
              "surface-bright": "#fffcf7",
              "secondary": "#48687c",
              "on-background": "#373831",
              "surface-tint": "#4f6c4b",
              "on-primary-container": "#3d583a",
              "on-tertiary-fixed": "#4d2913",
              "tertiary": "#875a40",
              "on-tertiary-container": "#633c24",
              "outline-variant": "#babaaf"
            },
            fontFamily: {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Be Vietnam Pro"],
              "label": ["Be Vietnam Pro"]
            },
            borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
        body { font-family: 'Be Vietnam Pro', sans-serif; background-color: #fffcf7; color: #373831; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eae9dd; border-radius: 10px; }
    </style>
</head>
<body class="bg-background text-on-surface">
<div class="flex min-h-screen">
<!-- SideNavBar -->
<aside class="h-screen w-64 fixed left-0 top-0 border-r-0 bg-[#fffcf7] dark:bg-stone-950 flex flex-col py-10 z-50 font-['Be_Vietnam_Pro'] font-light">
<div class="px-8 mb-12">
<h1 class="text-3xl font-light text-[#4f6c4b] tracking-tight">Spore</h1>
<p class="text-xs text-stone-400 font-medium tracking-widest mt-1">LIVING SANCTUARY</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] dark:hover:bg-stone-800 transition-all group" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="text-sm font-medium">Home</span>
</a>
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] dark:hover:bg-stone-800 transition-all group" href="#">
<span class="material-symbols-outlined" data-icon="eco">eco</span>
<span class="text-sm font-medium">Spores</span>
</a>
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] dark:hover:bg-stone-800 transition-all group" href="#">
<span class="material-symbols-outlined" data-icon="heart_plus">heart_plus</span>
<span class="text-sm font-medium">Support</span>
</a>
<!-- Active Tab: Profile/Settings -->
<a class="flex items-center gap-4 text-[#4f6c4b] dark:text-[#8ba888] font-semibold border-r-4 border-[#4f6c4b] py-3 px-6 bg-[#fcf9f3] dark:bg-stone-900 transition-all scale-[0.98]" href="#">
<span class="material-symbols-outlined" data-icon="person" style="font-variation-settings: 'FILL' 1;">person</span>
<span class="text-sm font-bold">Profile</span>
</a>
</nav>
<div class="px-6 mt-auto">
<div class="p-4 rounded-xl bg-surface-container flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
<span class="material-symbols-outlined text-primary" data-icon="shield_person">shield_person</span>
</div>
<div>
<p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Safety Score</p>
<p class="text-sm font-headline font-bold text-primary">High Privacy</p>
</div>
</div>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="ml-64 flex-1 min-h-screen pb-20">
<!-- TopAppBar -->
<header class="w-full sticky top-0 z-40 bg-[#fffcf7] dark:bg-stone-950 flex justify-between items-center px-12 py-6 font-['Plus_Jakarta_Sans'] tracking-tight">
<div>
<h2 class="text-2xl font-light text-[#4f6c4b] dark:text-[#8ba888]">Privacy &amp; Safety</h2>
<p class="text-sm text-on-surface-variant font-body mt-1">Control your sanctuary's boundaries and visibility.</p>
</div>
<div class="flex items-center gap-4">
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="notifications">notifications</span>
</button>
<div class="w-10 h-10 rounded-full bg-stone-200 overflow-hidden ring-2 ring-primary/10">
<img alt="User Profile Avatar" class="w-full h-full object-cover" data-alt="portrait of a calm woman with a soft smile in a minimal studio setting with natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlqmGD6a1Nlop62RoiS6P6DS7wXok1Rp_OgPPw6DZGGWVTOuOX2KU7HyKREYhc9NYa3hlM9C39u-5BYCHCx53kC8H181ZB-_TJszpVbqHoIOlnJH_3o3Yf0MFHz8SjK05x1TEHQYNC-otzxaBzC0VfPF5m6hEu6NlSLMymBFt04nvgYhMkNVGd7QWsoWRVE2Vrf7ZSV-OyB4NbbJrMivH2e_U0DPgc0aeXBjW2U5R9z7Ct7fKvxtqZhQ77tt1JNlrr5DaC49xxkeI"/>
</div>
</div>
</header>
<div class="px-12 py-8 max-w-6xl mx-auto space-y-12">
<!-- Signal Permissions Bento Section -->
<section>
<div class="flex items-end justify-between mb-6">
<h3 class="text-xl font-headline font-light text-on-surface">Signal Permissions</h3>
<span class="text-xs font-label text-primary-dim tracking-wider uppercase">Real-time awareness</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Biometric Sync Card -->
<div class="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between group hover:shadow-sm transition-all border border-transparent hover:border-outline-variant/10">
<div class="flex justify-between items-start">
<div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary-fixed" data-icon="fingerprint">fingerprint</span>
</div>
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-on-surface-variant">Enabled</span>
<div class="w-10 h-5 bg-primary rounded-full relative p-1 cursor-pointer">
<div class="w-3 h-3 bg-white rounded-full absolute right-1"></div>
</div>
</div>
</div>
<div class="mt-8">
<h4 class="text-lg font-headline font-semibold text-on-surface-variant">Biometric Sync</h4>
<p class="text-sm text-on-surface-variant font-body mt-2 leading-relaxed">Securely sync heart rate and breath patterns to adjust ambient sounds and light in your home environment.</p>
</div>
</div>
<!-- Environment Context Card -->
<div class="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between group hover:shadow-sm transition-all border border-transparent hover:border-outline-variant/10">
<div class="flex justify-between items-start">
<div class="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center">
<span class="material-symbols-outlined text-on-secondary-fixed" data-icon="nest_eco_leaf">nest_eco_leaf</span>
</div>
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-on-surface-variant">Limited</span>
<div class="w-10 h-5 bg-outline-variant rounded-full relative p-1 cursor-pointer">
<div class="w-3 h-3 bg-white rounded-full absolute left-1"></div>
</div>
</div>
</div>
<div class="mt-8">
<h4 class="text-lg font-headline font-semibold text-on-surface-variant">Environment Context</h4>
<p class="text-sm text-on-surface-variant font-body mt-2 leading-relaxed">Allow Spore to analyze noise levels and local weather to recommend appropriate grounding rituals.</p>
</div>
</div>
</div>
</section>
<!-- Escalation Circles & Visibility -->
<section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
<!-- Inner Circles -->
<div class="lg:col-span-2 space-y-6">
<h3 class="text-xl font-headline font-light text-on-surface">Escalation Circles</h3>
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_40px_60px_-15px_rgba(55,56,49,0.04)]">
<div class="space-y-8">
<div class="flex items-center justify-between p-4 rounded-lg bg-surface-container-low border-l-4 border-primary">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
<span class="material-symbols-outlined text-primary" data-icon="groups">groups</span>
</div>
<div>
<h5 class="font-headline font-bold text-on-surface">Inner Circle</h5>
<p class="text-xs text-on-surface-variant">Can view live wellness signals</p>
</div>
</div>
<button class="text-primary font-bold text-sm hover:underline">Manage (3)</button>
</div>
<div class="flex items-center justify-between p-4 rounded-lg bg-surface-container-low border-l-4 border-tertiary">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
<span class="material-symbols-outlined text-tertiary" data-icon="diversity_3">diversity_3</span>
</div>
<div>
<h5 class="font-headline font-bold text-on-surface">Family Spore</h5>
<p class="text-xs text-on-surface-variant">Aggregated emotional trends only</p>
</div>
</div>
<button class="text-tertiary font-bold text-sm hover:underline">Manage (8)</button>
</div>
</div>
<div class="mt-10 pt-8 border-t border-surface-variant/50">
<div class="flex items-center justify-between">
<p class="text-sm font-headline text-on-surface-variant">Auto-escalate to emergency services if no check-in for 24h</p>
<div class="w-12 h-6 bg-surface-container-highest rounded-full flex items-center px-1">
<div class="w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
</div>
</div>
</div>
<!-- Hide Trends From -->
<div class="space-y-6">
<h3 class="text-xl font-headline font-light text-on-surface">Privacy Filters</h3>
<div class="bg-surface-container-low p-6 rounded-xl h-full flex flex-col">
<p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Hide Trends From</p>
<div class="space-y-4 custom-scrollbar overflow-y-auto pr-2" style="max-height: 250px;">
<div class="flex items-center justify-between bg-white/50 p-3 rounded-lg">
<div class="flex items-center gap-3">
<img class="w-8 h-8 rounded-full object-cover" data-alt="headshot of a middle-aged man with short hair and professional demeanor" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkrScLn0LyKE-ypNNVQWnsX-sTMp-QPS8ofk1HAkZDAyiwPFRa4EfwGa147yp_ZNy04TR75Rn9V9myK-onAK9TaS8-QKqW4-_zqUeXiZc1Uqglc1amnQwA-QgQmfba7-F-FhToiC3IGkX6F8Se-X-s027fZglkSrRlJUdTC055N55cEVW0YtXhi3v2htJekVbC5QG8pRJEIYLUezv-79D9qaJsBYEY6WoR5-Tqk6jwGm41z8SK5aHx4UlczB9ydw4dYFCBrdkFEcA"/>
<span class="text-sm font-medium">Dr. Aris Thorne</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer" data-icon="visibility_off">visibility_off</span>
</div>
<div class="flex items-center justify-between bg-white/50 p-3 rounded-lg">
<div class="flex items-center gap-3">
<img class="w-8 h-8 rounded-full object-cover" data-alt="woman with friendly expression and modern spectacles" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA16u2J-ICVlafneSBgEQY2Nyzu6NTY5oWoDDqnGyGTq_l1F5c5oUs_8x49BajulgTp9JCk6XmJZ173CIm42MCggVhaGFwcsE5tCFNPBpLFyJcnQGlSlldmlXWhe_jvqQVnPXXLZd3t1s63yx5XxEVhRc50jj4KsCm78FhPpQUxF4fEkpBF9WH1u4xP-PW6xxhaKjSMH5uqnEOFXCPM9B7WPd3emT91rV7qyeUzfifN7lskHKmLj9hJN8bOGJirWUp-Z6AT0b9IStI"/>
<span class="text-sm font-medium">Sarah Jenkins</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer" data-icon="visibility_off">visibility_off</span>
</div>
<div class="flex items-center justify-between bg-white/50 p-3 rounded-lg opacity-50">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
<span class="material-symbols-outlined text-stone-400" data-icon="work">work</span>
</div>
<span class="text-sm font-medium italic">Work Workspace</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant text-lg cursor-pointer" data-icon="visibility_off" style="font-variation-settings: 'FILL' 1;">visibility_off</span>
</div>
</div>
<button class="mt-6 w-full py-3 rounded-full border border-dashed border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-white/50 transition-colors">
                                + Add Restricted Member
                            </button>
</div>
</div>
</section>
<!-- Privacy Commitment Card -->
<section class="relative overflow-hidden rounded-xl bg-[#4f6c4b] text-white p-12">
<div class="absolute top-0 right-0 w-1/2 h-full opacity-20 transform translate-x-12 translate-y-6">
<div class="w-full h-full bg-gradient-to-br from-primary-container to-transparent rounded-full blur-3xl"></div>
</div>
<div class="relative z-10 max-w-2xl">
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-4xl" data-icon="verified_user">verified_user</span>
<h3 class="text-3xl font-headline font-light tracking-tight">Our Privacy Commitment</h3>
</div>
<p class="text-lg font-body font-light leading-relaxed mb-8 opacity-90">
                            At Spore, we believe wellness cannot exist without true safety. Your emotional and biometric data is encrypted locally on your device. We do not sell your insights to third parties, ever. You are the sole gardener of your digital sanctuary.
                        </p>
<div class="flex flex-wrap gap-4">
<button class="bg-white text-primary px-8 py-4 rounded-full font-headline font-bold text-sm shadow-xl hover:scale-105 transition-transform">
                                Download Data Archive
                            </button>
<button class="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-headline font-bold text-sm hover:bg-white/20 transition-all">
                                View Privacy Manifesto
                            </button>
</div>
</div>
<div class="mt-12 flex items-center gap-8 opacity-60">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-sm" data-icon="lock">lock</span>
<span class="text-xs uppercase tracking-widest font-bold">End-to-End Encrypted</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-sm" data-icon="database">database</span>
<span class="text-xs uppercase tracking-widest font-bold">Zero Cloud Storage</span>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-sm" data-icon="balance">balance</span>
<span class="text-xs uppercase tracking-widest font-bold">GDPR+ Standards</span>
</div>
</div>
</section>
<!-- Footer Navigation Fallback for Focused Task -->
<footer class="pt-8 flex justify-between items-center text-on-surface-variant/60 text-xs font-label">
<p>© 2024 Spore Living Systems. All rights reserved.</p>
<div class="flex gap-6">
<a class="hover:text-primary transition-colors" href="#">Terms of Presence</a>
<a class="hover:text-primary transition-colors" href="#">Boundary Guidelines</a>
<a class="hover:text-primary transition-colors" href="#">Help Center</a>
</div>
</footer>
</div>
</main>
</div>
</body></html>
```

---

## Desktop Support Inbox

```html
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Spore | Support Inbox</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&amp;family=Be+Vietnam+Pro:wght@100;300;400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "outline": "#818178",
              "secondary-fixed-dim": "#b8d9ef",
              "secondary-container": "#c6e7fe",
              "background": "#fffcf7",
              "on-secondary": "#ffffff",
              "surface": "#fffcf7",
              "on-error": "#ffffff",
              "inverse-surface": "#0e0e0c",
              "primary": "#4f6c4b",
              "tertiary-container": "#fcc2a2",
              "inverse-on-surface": "#9e9d98",
              "surface-container-low": "#fcf9f3",
              "error-container": "#fa7150",
              "on-surface": "#373831",
              "secondary-fixed": "#c6e7fe",
              "surface-container-high": "#f0eee4",
              "primary-dim": "#435f40",
              "on-tertiary-fixed-variant": "#6e452d",
              "tertiary-dim": "#794e35",
              "on-error-container": "#671200",
              "on-primary": "#ffffff",
              "tertiary-fixed": "#fcc2a2",
              "on-secondary-container": "#355668",
              "on-primary-fixed": "#2b4629",
              "primary-container": "#cbebc3",
              "error": "#b23d21",
              "on-tertiary": "#ffffff",
              "on-secondary-fixed-variant": "#3f5f73",
              "surface-dim": "#e4e3d6",
              "on-secondary-fixed": "#224355",
              "primary-fixed-dim": "#bdddb6",
              "on-surface-variant": "#64655c",
              "on-primary-fixed-variant": "#466243",
              "surface-container": "#f6f4ec",
              "inverse-primary": "#d9fad1",
              "tertiary-fixed-dim": "#edb596",
              "primary-fixed": "#cbebc3",
              "secondary-dim": "#3c5c6f",
              "error-dim": "#821a01",
              "surface-variant": "#eae9dd",
              "surface-container-lowest": "#ffffff",
              "surface-container-highest": "#eae9dd",
              "surface-bright": "#fffcf7",
              "secondary": "#48687c",
              "on-background": "#373831",
              "surface-tint": "#4f6c4b",
              "on-primary-container": "#3d583a",
              "on-tertiary-fixed": "#4d2913",
              "tertiary": "#875a40",
              "on-tertiary-container": "#633c24",
              "outline-variant": "#babaaf"
            },
            fontFamily: {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Be Vietnam Pro"],
              "label": ["Be Vietnam Pro"]
            },
            borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
      }
      .bg-glass {
        background: rgba(255, 252, 247, 0.7);
        backdrop-filter: blur(20px);
      }
      .aura-blob {
        filter: blur(60px);
        opacity: 0.15;
      }
    </style>
</head>
<body class="bg-background font-body text-on-surface antialiased overflow-hidden">
<div class="flex h-screen w-full relative">
<!-- Aura Orbs for visual depth -->
<div class="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-primary aura-blob"></div>
<div class="absolute bottom-[-10%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-tertiary aura-blob"></div>
<!-- SideNavBar (Predicted Component) -->
<aside class="h-screen w-64 fixed left-0 top-0 border-r-0 bg-[#fffcf7] dark:bg-stone-950 flex flex-col py-10 z-40 font-['Be_Vietnam_Pro'] font-light">
<div class="px-8 mb-10">
<h1 class="text-3xl font-light text-[#4f6c4b] tracking-tight">Spore</h1>
<p class="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-widest">Living Sanctuary</p>
</div>
<nav class="flex-1 flex flex-col">
<!-- Home -->
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] dark:hover:bg-stone-800 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="text-sm font-medium">Home</span>
</a>
<!-- Spores -->
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] dark:hover:bg-stone-800 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="eco">eco</span>
<span class="text-sm font-medium">Spores</span>
</a>
<!-- Support (Active) -->
<a class="flex items-center gap-4 text-[#4f6c4b] dark:text-[#8ba888] font-semibold border-r-4 border-[#4f6c4b] py-3 px-6 bg-[#fcf9f3]" href="#">
<span class="material-symbols-outlined" data-icon="heart_plus" style="font-variation-settings: 'FILL' 1;">heart_plus</span>
<span class="text-sm font-medium">Support</span>
</a>
<!-- Profile -->
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] dark:hover:bg-stone-800 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="text-sm font-medium">Profile</span>
</a>
</nav>
<div class="px-6 mt-auto">
<div class="bg-surface-container-low rounded-lg p-4 flex items-center gap-3">
<img alt="User Profile" class="w-10 h-10 rounded-full object-cover" data-alt="Close-up portrait of a serene man with a gentle smile and soft natural lighting in a garden setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUOdLRCqnv2F4okydftulwU71m2OrrMnUwzeVnzu0Hpm5PC5INZSmqnx_JxBrX_NQlWP8EYTWIlRE538zW5rz1vj4IgIS8rHCIOKd5IucDmiW_byYlf6bULN4IYH_h93GGya_0w7UvrWSMgehfF3tNhsBAZc8wXNjJHdmhIe2uT8AwOf-MbB4I2mnzdTVeJXl399LIXKNLYwZKtdD4fDP77Qq-pmEactvtStzWcqjf23ikHS_6PsqC1s4KUp3namkGhR2WuBbgUwo"/>
<div class="overflow-hidden">
<p class="text-xs font-semibold truncate">Alex Rivers</p>
<p class="text-[10px] text-on-surface-variant">Calm State</p>
</div>
</div>
</div>
</aside>
<!-- Main Workspace -->
<main class="flex-1 ml-64 flex flex-col min-h-screen relative overflow-y-auto">
<!-- Top Header Content -->
<header class="w-full px-12 pt-12 pb-8">
<h2 class="font-headline text-5xl font-light text-on-surface tracking-tight mb-2">Support Inbox</h2>
<p class="font-body text-on-surface-variant max-w-md">Small acts of care, nurtured daily. Tend to your sanctuary and those within it.</p>
</header>
<!-- Layout Content -->
<div class="flex-1 px-12 pb-12 flex gap-10">
<!-- Left Column: Inbox Items -->
<div class="flex-[3] space-y-6">
<div class="flex items-center justify-between mb-4 px-2">
<span class="text-xs font-semibold uppercase tracking-widest text-primary opacity-60">Gentle Prompts</span>
<span class="text-xs text-on-surface-variant">3 pending actions</span>
</div>
<!-- Card: Maya -->
<div class="group relative bg-surface-container-lowest p-8 rounded-xl flex items-center gap-6 shadow-sm border border-transparent hover:border-primary/10 transition-all active:scale-[0.98]">
<div class="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined text-3xl" data-icon="volunteer_activism">volunteer_activism</span>
</div>
<div class="flex-1">
<h3 class="font-headline text-xl text-on-surface mb-1">Check-in on Maya</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">Maya has been focused on deep growth lately. A small word of encouragement could brighten her path.</p>
</div>
<button class="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-medium flex items-center gap-2 hover:bg-primary-dim transition-colors">
<span>Reach out</span>
<span class="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<!-- Card: Leo -->
<div class="group relative bg-surface-container-lowest p-8 rounded-xl flex items-center gap-6 shadow-sm border border-transparent hover:border-primary/10 transition-all active:scale-[0.98]">
<div class="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary shrink-0">
<span class="material-symbols-outlined text-3xl" data-icon="favorite" style="font-variation-settings: 'FILL' 1;">favorite</span>
</div>
<div class="flex-1">
<h3 class="font-headline text-xl text-on-surface mb-1">Leo sent appreciation</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">"Thank you for being my grounding force today." Leo felt supported by your presence.</p>
</div>
<button class="px-6 py-2.5 bg-tertiary text-on-tertiary rounded-full text-sm font-medium flex items-center gap-2 hover:bg-tertiary-dim transition-colors">
<span>Read message</span>
</button>
</div>
<!-- Card: Reminder -->
<div class="group relative bg-surface-container-low p-8 rounded-xl flex items-center gap-6 border border-dashed border-outline-variant/30 active:scale-[0.98] transition-transform">
<div class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0">
<span class="material-symbols-outlined text-3xl" data-icon="potted_plant">potted_plant</span>
</div>
<div class="flex-1">
<h3 class="font-headline text-xl text-on-surface mb-1">You haven't checked in</h3>
<p class="text-on-surface-variant text-sm leading-relaxed">Your own garden needs tending too. It's been 3 days since your last reflection.</p>
</div>
<button class="px-6 py-2.5 border border-outline text-on-surface rounded-full text-sm font-medium hover:bg-surface-container-high transition-colors">
<span>Self-reflect</span>
</button>
</div>
</div>
<!-- Right Column: Focus/Action -->
<div class="flex-[2] flex flex-col gap-6">
<!-- Quiet Mind Card -->
<div class="sticky top-12 bg-secondary-container p-10 rounded-xl overflow-hidden relative min-h-[400px] flex flex-col justify-end">
<div class="absolute top-[-20px] right-[-20px] w-64 h-64 bg-secondary-fixed-dim rounded-full aura-blob"></div>
<div class="relative z-10 space-y-4">
<div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-on-secondary-container mb-4">
<span class="material-symbols-outlined text-2xl" data-icon="self_improvement">self_improvement</span>
</div>
<h2 class="font-headline text-3xl text-on-secondary-container leading-tight">Quiet your mind</h2>
<p class="text-on-secondary-container/80 text-sm max-w-xs">Take a 2-minute breathing break to reset your internal rhythm.</p>
<div class="pt-6">
<button class="w-full py-4 bg-on-secondary-container text-secondary-container rounded-full font-semibold text-base shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
<span class="material-symbols-outlined" data-icon="play_circle">play_circle</span>
<span>Begin Session</span>
</button>
<p class="text-center mt-4 text-xs text-on-secondary-container/60 font-medium">2 MINUTES • GUIDED</p>
</div>
</div>
<!-- Abstract Visualization -->
<div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
<div class="w-48 h-48 rounded-full border-[12px] border-white/30 scale-110"></div>
<div class="absolute w-48 h-48 rounded-full border-[1px] border-white/50 animate-ping"></div>
</div>
</div>
<!-- Stats Pod -->
<div class="bg-surface-container-low p-6 rounded-lg flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-xl" data-icon="flare">flare</span>
</div>
<div>
<p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Community Bloom</p>
<p class="text-lg font-headline text-on-surface">12 Connections</p>
</div>
</div>
<span class="material-symbols-outlined text-on-surface-variant" data-icon="more_vert">more_vert</span>
</div>
</div>
</div>
</main>
</div>
<!-- Floating Tooltip / Global FAB (Suppressed on Inbox per rules, but showing contextually for 'Tend' action if needed elsewhere - omitting for Inbox focus) -->
</body></html>
```

---

## Updated Desktop Spore Detail

```html
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&amp;family=Be_Vietnam_Pro:wght@100;200;300;400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "outline": "#818178",
              "secondary-fixed-dim": "#b8d9ef",
              "secondary-container": "#c6e7fe",
              "background": "#fffcf7",
              "on-secondary": "#ffffff",
              "surface": "#fffcf7",
              "on-error": "#ffffff",
              "inverse-surface": "#0e0e0c",
              "primary": "#4f6c4b",
              "tertiary-container": "#fcc2a2",
              "inverse-on-surface": "#9e9d98",
              "surface-container-low": "#fcf9f3",
              "error-container": "#fa7150",
              "on-surface": "#373831",
              "secondary-fixed": "#c6e7fe",
              "surface-container-high": "#f0eee4",
              "primary-dim": "#435f40",
              "on-tertiary-fixed-variant": "#6e452d",
              "tertiary-dim": "#794e35",
              "on-error-container": "#671200",
              "on-primary": "#ffffff",
              "tertiary-fixed": "#fcc2a2",
              "on-secondary-container": "#355668",
              "on-primary-fixed": "#2b4629",
              "primary-container": "#cbebc3",
              "error": "#b23d21",
              "on-tertiary": "#ffffff",
              "on-secondary-fixed-variant": "#3f5f73",
              "surface-dim": "#e4e3d6",
              "on-secondary-fixed": "#224355",
              "primary-fixed-dim": "#bdddb6",
              "on-surface-variant": "#64655c",
              "on-primary-fixed-variant": "#466243",
              "surface-container": "#f6f4ec",
              "inverse-primary": "#d9fad1",
              "tertiary-fixed-dim": "#edb596",
              "primary-fixed": "#cbebc3",
              "secondary-dim": "#3c5c6f",
              "error-dim": "#821a01",
              "surface-variant": "#eae9dd",
              "surface-container-lowest": "#ffffff",
              "surface-container-highest": "#eae9dd",
              "surface-bright": "#fffcf7",
              "secondary": "#48687c",
              "on-background": "#373831",
              "surface-tint": "#4f6c4b",
              "on-primary-container": "#3d583a",
              "on-tertiary-fixed": "#4d2913",
              "tertiary": "#875a40",
              "on-tertiary-container": "#633c24",
              "outline-variant": "#babaaf"
            },
            fontFamily: {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Be Vietnam Pro"],
              "label": ["Be Vietnam Pro"]
            },
            borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
        body { font-family: 'Be Vietnam Pro', sans-serif; background-color: #fffcf7; color: #373831; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        .glass-panel { background: rgba(255, 252, 247, 0.7); backdrop-filter: blur(20px); }
        .aura-blob { filter: blur(40px); opacity: 0.4; }
    </style>
</head>
<body class="flex min-h-screen">
<aside class="h-screen w-64 fixed left-0 top-0 bg-[#fffcf7] dark:bg-stone-950 flex flex-col py-10 font-['Be_Vietnam_Pro'] font-light z-50">
<div class="px-8 mb-12">
<h1 class="text-3xl font-light text-[#4f6c4b] font-headline tracking-tight">Spore</h1>
<p class="text-xs text-on-surface-variant tracking-widest mt-1">Living Sanctuary</p>
</div>
<nav class="flex-1">
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] transition-all" href="#">
<span class="material-symbols-outlined">home</span>
<span class="text-sm">Home</span>
</a>
<a class="flex items-center gap-4 text-[#4f6c4b] dark:text-[#8ba888] font-semibold border-r-4 border-[#4f6c4b] py-3 px-6 hover:bg-[#fcf9f3] transition-all" href="#">
<span class="material-symbols-outlined">eco</span>
<span class="text-sm">Spores</span>
</a>
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] transition-all" href="#">
<span class="material-symbols-outlined">heart_plus</span>
<span class="text-sm">Support</span>
</a>
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] transition-all" href="#">
<span class="material-symbols-outlined">person</span>
<span class="text-sm">Profile</span>
</a>
</nav>
<div class="px-6 mt-auto">
<div class="p-4 bg-surface-container-low rounded-lg flex items-center gap-3">
<img class="w-10 h-10 rounded-full object-cover" data-alt="close up portrait of a smiling woman with natural lighting and soft blurred background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfyqdqDdpozYB-8TmZ43XDuzx6TnVg2G71QWPtbOUF6lMyEigPMOtJzAJFLFELst7OtscyuG02GdYbhz_67sAQFcFmplDnOkX4WQRWvWvHyMnMiJrRH1yuAbCeKZmEjcZQsUlj58gVxAf4deB5FSJdXOv4heVDnYytC5HawYlpFmsYecgOZe3m5g5hA2xmZ54EPntc8pJnBbB8bIpOs8fyGhdy1xOc7PL9--vx1F9pz2ji3WiIp1UrYOMIjLkTPUY8SBspw7lc4Q0"/>
<div>
<p class="text-xs font-semibold">Elena G.</p>
<p class="text-[10px] text-on-surface-variant">Inner Circle</p>
</div>
</div>
</div>
</aside>
<main class="flex-1 ml-64 flex flex-col lg:flex-row min-h-screen">
<div class="flex-1 p-8 lg:p-12">
<header class="mb-12">
<div class="flex items-center gap-4 mb-4">
<span class="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-[10px] font-bold tracking-widest uppercase">Active Spore</span>
</div>
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h2 class="text-5xl font-headline font-light tracking-tight text-on-surface mb-4">The Breakfast Club</h2>
<div class="flex -space-x-3">
<img class="w-12 h-12 rounded-full border-4 border-surface object-cover" data-alt="portrait of a young man with a warm smile and soft outdoor lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASGXL3hR77rxnZ-T0MG5vQyxPivpJ8Mk7X9Hg7m2ot2dsM0V3EoFhnM_v5YS88t8El_Zzk3hpIeNlGaB7RFv_i7_BuiD3QF5OWJLFbpWHN7I9uO7PgxAKG7iLQUFxX2C8c3zu2OnllqG9SnU-A-uv_vL-qb2uEAoLB2jBCct6_79TfIAsIkyeiPRn4MXJYIVrvCSwYuxCHsQhIqUtWALYKGsm1kyg4Vcw1kLkHOWWmhtgab2DjsG5tx9OL07S1bPRWcUGXp__IFkM"/>
<img class="w-12 h-12 rounded-full border-4 border-surface object-cover" data-alt="creative portrait of a woman with vibrant lighting and artistic flair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWJHdt10Wct9Yg6YK9nu07F6S6p1Qe_JJ0rsSj0hNOA7mLPASBBpcFaYKtV9zm24R_yy0bB0_3O4_zi7DK4WgE7GzwCt3zJFpkA9hPn2CRFbN5SikRQg6Arm2hhZaLzVn57GpKH9ip8o3C1X5b8ETrft8VJkdiK-mJlB4dXvFeniWXclsQMB8herotepH9QqNwsSOG5iTT2VxDTNEOn04yZSxMAdcA2UyiX17JqE_kZ9ICVuEYG3nEAvzbUjQYhWQsLC_hKLZ_1yA"/>
<img class="w-12 h-12 rounded-full border-4 border-surface object-cover" data-alt="professional headshot of a man with friendly expression in a neutral studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIzvZb2REIiACA_VvZQIb47T1RblEIN7_Ywo50dEvOFm_Vm2LncV0vWno-b7QBH8GGv-AwSBTteXw46Lim0jeXwDoS3xtai3s3yDLYlaxVF9PisyvUFongX3YEb4kG5LsFhM89Ztx55ut5HdgMoOIvjVXMTjXeTqo6vAXC1RUJ8rMa6G96Qhg25aJBvf9gpK8CFmbk8G8D75wX_IwO472Dpf4cakai2abizsb5j9J5lMLsoMp2kH5EnnubRFaC5qqwNR_oAn9JZ0Y"/>
<div class="w-12 h-12 rounded-full border-4 border-surface bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface-variant">+2</div>
</div>
</div>
<div class="flex items-center gap-3">
<button class="flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-sm">settings</span>
<span class="text-sm font-medium">Manage</span>
</button>
<button class="px-8 py-3 rounded-full bg-primary text-on-primary font-medium hover:scale-[0.98] transition-transform">
                            Daily Check-in
                        </button>
</div>
</div>
</header>
<section class="flex flex-wrap gap-6 xl:gap-8">
<div class="flex-1 min-w-[300px] bg-surface-container-lowest rounded-[2rem] p-10 flex flex-col items-center text-center transition-all hover:translate-y-[-4px] shadow-sm">
<div class="relative mb-6">
<div class="absolute -inset-2 bg-primary-fixed-dim rounded-full aura-blob"></div>
<img class="w-24 h-24 rounded-full object-cover relative z-10" data-alt="candid portrait of a young man in casual attire with soft morning sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3pfjEx4AcSNEZQfE09ltrOri3CBXtm8iP76x_ETRshaEy6GlMCgs4wmAI5jPoPHZY-ngLviLpgZe8vWYHbcJxuyIivn_SWXEfHOvQVngORb8jCujHgvrqiR5OnXC_P3A9mFhmbikoosQiPT5u3NSwaAHUejab1GY88jSm1Cvbh2TBPSLRAsMd-w69T8j-HjPM2qSMd6F4W9xEq_bodVAYQ2seKZZuTjp1NvG7_Hkcosn6_PsQN51VnX8A4PO7UdT9QhwDHstApBY"/>
<div class="absolute bottom-1 right-1 w-5 h-5 bg-primary border-4 border-surface-container-lowest rounded-full"></div>
</div>
<h3 class="text-2xl font-headline font-semibold mb-1">Leo</h3>
<p class="text-sm text-primary font-medium mb-6">Doing Okay</p>
<p class="text-xs text-on-surface-variant leading-relaxed mb-10 px-4">Leo completed his mindfulness streak today. He's feeling grounded and present.</p>
<div class="flex gap-2 w-full mt-auto">
<button class="flex-1 py-4 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold hover:scale-[0.98] transition-all">Send Appreciation</button>
<button class="p-4 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all">
<span class="material-symbols-outlined text-sm">chat_bubble</span>
</button>
</div>
</div>
<div class="flex-1 min-w-[300px] bg-surface-container-lowest rounded-[2rem] p-10 flex flex-col items-center text-center border border-tertiary/20 relative transition-all hover:translate-y-[-4px] shadow-sm">
<div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-tertiary rounded-b-full"></div>
<div class="relative mb-6">
<div class="absolute -inset-2 bg-tertiary-fixed-dim rounded-full aura-blob"></div>
<img class="w-24 h-24 rounded-full object-cover relative z-10" data-alt="close-up of a smiling woman with warm skin tones and natural texture in soft focus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6quPDvxsOrh1n63mk8REBgadqXrYQzhNP4-k0tbcwtqUcrPtw0vHQhiudAK0Lg_KliRf-FvpJlaHOrYoKEoZdZG5kIgRFmteqq9TOUCGzWKbtVmwp1o0INyFfzwc2KWuxHgk4WV_GzNgF4mOgkgYvjAngCqx6nqsZw9m2MP8Mf-5VlvK_mHgn51M_SfYNQDKzRxunvHM0IR4jU7BV6AKP6S0Cq9SLo5hzyRluRsfIo1u_CJB5FbUMI_i3KYZ9g4IX6_QsPXAi6Ws"/>
<div class="absolute bottom-1 right-1 w-5 h-5 bg-tertiary border-4 border-surface-container-lowest rounded-full"></div>
</div>
<h3 class="text-2xl font-headline font-semibold mb-1">Maya</h3>
<p class="text-sm text-tertiary font-bold mb-2 uppercase tracking-widest text-[10px]">Support Suggested</p>
<p class="text-xs text-tertiary-dim italic mb-6">Missed 2 check-ins</p>
<p class="text-xs text-on-surface-variant leading-relaxed mb-10 px-4">Maya hasn't logged her sanctuary moments recently. Reach out to offer a listening ear.</p>
<div class="flex gap-2 w-full mt-auto">
<button class="flex-1 py-4 rounded-full bg-tertiary text-on-tertiary text-xs font-bold hover:scale-[0.98] transition-all">Check in</button>
<button class="p-4 rounded-full bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary transition-all">
<span class="material-symbols-outlined text-sm">favorite</span>
</button>
</div>
</div>
<div class="flex-1 min-w-[300px] bg-surface-container-lowest rounded-[2rem] p-10 flex flex-col items-center text-center transition-all hover:translate-y-[-4px] shadow-sm">
<div class="relative mb-6">
<div class="absolute -inset-2 bg-secondary-fixed-dim rounded-full aura-blob"></div>
<img class="w-24 h-24 rounded-full object-cover relative z-10" data-alt="lifestyle portrait of a man looking thoughtfully into the distance with urban background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa175hGFxJLGuMEd01WBraVep-Sq4Wn_7hJtaVrVyp5AG3kHnXHzBJ8pgH4XhdrKyA2-WrsMQWrl_kC8VWcV6J8gDja62o0J6dxFRwDW1GOf8_FlscvAhCPIdXvIGJSZmKx_-HfDlNKgMGQTMvju0b2LEbRgGagK9uguj3_UJTI2d02qrtFc1YExPiv64IkfOMBli8ITPWi2JHMNzLiPEIaJVcWZ5qpVOx3hJhW7kgcuM0pRVRgBHwFcQ0IBxsx08XQR0GWoQfHbo"/>
<div class="absolute bottom-1 right-1 w-5 h-5 bg-secondary border-4 border-surface-container-lowest rounded-full"></div>
</div>
<h3 class="text-2xl font-headline font-semibold mb-1">Sam</h3>
<p class="text-sm text-secondary font-medium mb-6">Lower activity</p>
<p class="text-xs text-on-surface-variant leading-relaxed mb-10 px-4">Sam is taking some personal time away from digital check-ins. A small appreciation might brighten his day.</p>
<div class="flex gap-2 w-full mt-auto">
<button class="flex-1 py-4 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-all">Send Appreciation</button>
<button class="p-4 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all">
<span class="material-symbols-outlined text-sm">send</span>
</button>
</div>
</div>
</section>
</div>
<aside class="w-full lg:w-[400px] bg-surface-container-low p-8 lg:p-12">
<div class="sticky top-12 space-y-12">
<section>
<div class="flex items-center justify-between mb-8">
<h4 class="text-lg font-headline font-semibold tracking-tight">Spore Trends</h4>
<span class="material-symbols-outlined text-on-surface-variant">monitoring</span>
</div>
<div class="relative h-48 bg-surface-container-lowest rounded-xl p-6 overflow-hidden">
<div class="absolute inset-0 flex items-center justify-center">
<div class="w-32 h-32 rounded-full bg-primary aura-blob" style="transform: translate(-20px, 10px);"></div>
<div class="w-24 h-24 rounded-full bg-tertiary aura-blob" style="transform: translate(30px, -20px);"></div>
<div class="w-28 h-28 rounded-full bg-secondary aura-blob" style="transform: translate(10px, 30px);"></div>
</div>
<div class="relative z-10 flex flex-col h-full justify-between">
<p class="text-xs font-medium text-on-surface-variant">Collective Harmony</p>
<div class="flex items-end justify-between">
<span class="text-4xl font-headline font-light">84%</span>
<span class="text-[10px] text-primary font-bold">+12% this week</span>
</div>
</div>
</div>
<div class="mt-6 space-y-4">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface-variant">Mindfulness Hours</span>
<span class="font-bold">24.5h</span>
</div>
<div class="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 75%;"></div>
</div>
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface-variant">Check-in Rate</span>
<span class="font-bold">92%</span>
</div>
<div class="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 92%;"></div>
</div>
</div>
</section>
<section class="bg-primary-container/30 rounded-xl p-8">
<h4 class="text-lg font-headline font-semibold mb-2">Invite More</h4>
<p class="text-xs text-on-surface-variant leading-relaxed mb-6">Wellness is better when shared. Invite a friend to join this sanctuary.</p>
<div class="space-y-3">
<div class="relative">
<input class="w-full py-4 pl-6 pr-12 rounded-full border-none bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed-dim text-sm" placeholder="Email address" type="email"/>
<button class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-full">
<span class="material-symbols-outlined text-sm">add</span>
</button>
</div>
<p class="text-[10px] text-center text-on-surface-variant px-4">They'll receive an editorial invite from you.</p>
</div>
</section>
<section class="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
<div class="flex items-start gap-4">
<div class="p-3 bg-tertiary-container/30 text-tertiary rounded-lg">
<span class="material-symbols-outlined">lightbulb</span>
</div>
<div>
<h5 class="text-sm font-bold mb-1">Sanctuary Tip</h5>
<p class="text-xs text-on-surface-variant leading-relaxed">Try a 5-minute collective breathing session at 8:00 AM for maximum Spore harmony.</p>
</div>
</div>
</section>
</div>
</aside>
</main>
</body></html>
```

---

## Updated Desktop Dashboard

```html
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Spore | Living Sanctuary</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&amp;family=Be+Vietnam+Pro:wght@100;300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "outline": "#818178",
                        "secondary-fixed-dim": "#b8d9ef",
                        "secondary-container": "#c6e7fe",
                        "background": "#fffcf7",
                        "on-secondary": "#ffffff",
                        "surface": "#fffcf7",
                        "on-error": "#ffffff",
                        "inverse-surface": "#0e0e0c",
                        "primary": "#4f6c4b",
                        "tertiary-container": "#fcc2a2",
                        "inverse-on-surface": "#9e9d98",
                        "surface-container-low": "#fcf9f3",
                        "error-container": "#fa7150",
                        "on-surface": "#373831",
                        "secondary-fixed": "#c6e7fe",
                        "surface-container-high": "#f0eee4",
                        "primary-dim": "#435f40",
                        "on-tertiary-fixed-variant": "#6e452d",
                        "tertiary-dim": "#794e35",
                        "on-error-container": "#671200",
                        "on-primary": "#ffffff",
                        "tertiary-fixed": "#fcc2a2",
                        "on-secondary-container": "#355668",
                        "on-primary-fixed": "#2b4629",
                        "primary-container": "#cbebc3",
                        "error": "#b23d21",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#3f5f73",
                        "surface-dim": "#e4e3d6",
                        "on-secondary-fixed": "#224355",
                        "primary-fixed-dim": "#bdddb6",
                        "on-surface-variant": "#64655c",
                        "on-primary-fixed-variant": "#466243",
                        "surface-container": "#f6f4ec",
                        "inverse-primary": "#d9fad1",
                        "tertiary-fixed-dim": "#edb596",
                        "primary-fixed": "#cbebc3",
                        "secondary-dim": "#3c5c6f",
                        "error-dim": "#821a01",
                        "surface-variant": "#eae9dd",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-highest": "#eae9dd",
                        "surface-bright": "#fffcf7",
                        "secondary": "#48687c",
                        "on-background": "#373831",
                        "surface-tint": "#4f6c4b",
                        "on-primary-container": "#3d583a",
                        "on-tertiary-fixed": "#4d2913",
                        "tertiary": "#875a40",
                        "on-tertiary-container": "#633c24",
                        "outline-variant": "#babaaf"
                    },
                    fontFamily: {
                        "headline": ["Plus Jakarta Sans"],
                        "body": ["Be Vietnam Pro"],
                        "label": ["Be Vietnam Pro"]
                    },
                    borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .aura-glow {
            filter: blur(60px);
            opacity: 0.15;
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #babaaf;
            border-radius: 10px;
        }
    </style>
</head>
<body class="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen overflow-x-hidden">
<!-- Sidebar Navigation -->
<aside class="hidden md:flex flex-col py-10 h-screen w-64 fixed left-0 top-0 border-r-0 bg-[#fffcf7] dark:bg-stone-950 font-['Be_Vietnam_Pro'] font-light">
<div class="px-8 mb-12">
<h1 class="text-3xl font-light text-[#4f6c4b] tracking-tight">Spore</h1>
<p class="text-xs text-stone-400 mt-1 uppercase tracking-widest">Living Sanctuary</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-4 text-[#4f6c4b] dark:text-[#8ba888] font-semibold border-r-4 border-[#4f6c4b] py-3 px-6 hover:bg-[#fcf9f3] transition-all" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span>Home</span>
</a>
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] transition-all" href="#">
<span class="material-symbols-outlined" data-icon="eco">eco</span>
<span>Spores</span>
</a>
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] transition-all" href="#">
<span class="material-symbols-outlined" data-icon="heart_plus">heart_plus</span>
<span>Support</span>
</a>
<a class="flex items-center gap-4 text-stone-400 dark:text-stone-500 py-3 px-6 hover:bg-[#fcf9f3] transition-all" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span>Profile</span>
</a>
</nav>
<div class="px-6 mt-auto">
<div class="p-4 bg-surface-container-low rounded-xl flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span class="material-symbols-outlined">psychology</span>
</div>
<div>
<p class="text-sm font-medium">Daily Breath</p>
<p class="text-xs text-on-surface-variant">Ready for today?</p>
</div>
</div>
</div>
</aside>
<!-- Main Canvas -->
<main class="md:ml-64 flex flex-col lg:flex-row min-h-screen">
<!-- Middle Column: Greeting & Check-in & Your Spores -->
<div class="flex-1 px-6 md:px-12 py-10 max-w-4xl">
<!-- Greeting -->
<header class="mb-12">
<h2 class="text-5xl font-headline font-light text-on-surface tracking-tight leading-tight">
                    Good morning,<br/>
<span class="text-primary italic">breathe.</span>
</h2>
<p class="mt-4 text-on-surface-variant max-w-md">Your digital sanctuary is quiet today. How is your energy moving this morning?</p>
</header>
<!-- Check-in Cards -->
<section class="mb-16">
<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
<button class="group p-8 bg-surface-container-lowest rounded-xl border-b-4 border-primary-container hover:scale-[0.98] transition-all text-left shadow-sm">
<div class="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">sentiment_satisfied</span>
</div>
<h4 class="font-headline text-lg font-medium text-on-surface">Good</h4>
<p class="text-sm text-on-surface-variant mt-2">I feel grounded and present.</p>
</button>
<button class="group p-8 bg-surface-container-lowest rounded-xl border-b-4 border-secondary-container hover:scale-[0.98] transition-all text-left shadow-sm">
<div class="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">sentiment_neutral</span>
</div>
<h4 class="font-headline text-lg font-medium text-on-surface">Okay</h4>
<p class="text-sm text-on-surface-variant mt-2">Moving through the day.</p>
</button>
<button class="group p-8 bg-surface-container-lowest rounded-xl border-b-4 border-tertiary-container hover:scale-[0.98] transition-all text-left shadow-sm">
<div class="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">sentiment_dissatisfied</span>
</div>
<h4 class="font-headline text-lg font-medium text-on-surface">Not Great</h4>
<p class="text-sm text-on-surface-variant mt-2">I need a little space today.</p>
</button>
</div>
</section>
<!-- Your Spores Section -->
<section>
<div class="flex items-center justify-between mb-8">
<h3 class="font-headline text-2xl font-light text-on-surface">Your Spores</h3>
<button class="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                        View All <span class="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<!-- Spore Card 1 -->
<div class="relative overflow-hidden group rounded-xl bg-surface-container-low p-1">
<div class="bg-surface-container-lowest p-6 rounded-[2.5rem] h-full flex flex-col shadow-sm">
<div class="flex items-center gap-4 mb-6">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-container">
<img class="w-full h-full object-cover" data-alt="close-up of vibrant green moss growing on a forest floor with soft morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGelf3VLRqEXzT-whd5UNhrrnsYtJykKwd9A-DGJ3FDa7r9e9IyzHZ4c9lA4EOxI4gpx-vmqKU47-eta6jfo203BZ50hVwLaP5B1am7JadK8NoeM5txY7XpmQR4JLxUcGVAgEUD6hYlq1NsGVSH9sqYEICWvpIqth5Y-BkVywuUsOwOAU4D9C7G5h1LKDR_H9PU-5sN9hGghTvylHlXR6EhymqBaCPK5xHr7W2zj-YsSK59LHmMJFhDeS9anqXbOztM-L9SVJ1K3c"/>
</div>
<div>
<h4 class="font-headline text-xl font-medium">Family Spore</h4>
<p class="text-xs text-on-surface-variant">4 members active</p>
</div>
</div>
<!-- Updated Member Listing: Horizontal Flex -->
<div class="flex flex-row items-center gap-1 mb-6">
<div class="w-8 h-8 rounded-full border border-surface-container-lowest bg-surface-dim"></div>
<div class="w-8 h-8 rounded-full border border-surface-container-lowest bg-primary-fixed"></div>
<div class="w-8 h-8 rounded-full border border-surface-container-lowest bg-secondary-fixed"></div>
<div class="w-8 h-8 rounded-full border border-surface-container-lowest bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold">+1</div>
</div>
<div class="mt-auto pt-4 flex items-center justify-between border-t border-surface-variant">
<span class="text-sm font-medium text-primary flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    Vibrant pulse
                                </span>
<span class="material-symbols-outlined text-on-surface-variant">more_horiz</span>
</div>
</div>
</div>
<!-- Spore Card 2 -->
<div class="relative overflow-hidden group rounded-xl bg-surface-container-low p-1">
<div class="bg-surface-container-lowest p-6 rounded-[2.5rem] h-full flex flex-col shadow-sm">
<div class="flex items-center gap-4 mb-6">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary-container">
<img class="w-full h-full object-cover" data-alt="blurred silhouettes of students walking through a sun-drenched university courtyard with architectural arches" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARvY-TEW5irCatkCwC_XmfvB1-dcGYeebBaGJgMUYU_ENROohGlAjwxgf_WdY053n_3BFoY1ikr2JSrgQLyuVcA7v10KWXhMJ6UOw3zhdeHWPP9AxTH0MYoqKmM8UoK9ILB8FlS_WL0vttKFeFa1k64ZFBi_ZvVZVHDZpRh2wUjM-XE8yaPaz-r252tEVRU5XQ24yT2KQXoeATKzRU-44wAGoC2X6zDFGkwAOQzO9aYU2nQX1zR9P6UYS1X7GIanUdjzabDiX0Lxs"/>
</div>
<div>
<h4 class="font-headline text-xl font-medium">Uni Friends</h4>
<p class="text-xs text-on-surface-variant">12 members active</p>
</div>
</div>
<!-- Updated Member Listing: Horizontal Flex -->
<div class="flex flex-row items-center gap-1 mb-6">
<div class="w-8 h-8 rounded-full border border-surface-container-lowest bg-secondary-dim"></div>
<div class="w-8 h-8 rounded-full border border-surface-container-lowest bg-primary-dim"></div>
<div class="w-8 h-8 rounded-full border border-surface-container-lowest bg-surface-dim"></div>
<div class="w-8 h-8 rounded-full border border-surface-container-lowest bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold">+9</div>
</div>
<div class="mt-auto pt-4 flex items-center justify-between border-t border-surface-variant">
<span class="text-sm font-medium text-secondary flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
                                    Steady growth
                                </span>
<span class="material-symbols-outlined text-on-surface-variant">more_horiz</span>
</div>
</div>
</div>
</div>
</section>
</div>
<!-- Right Column: Support Feed -->
<aside class="w-full lg:w-96 bg-surface-container-low px-8 py-10 border-l-0">
<div class="sticky top-10">
<header class="flex items-center justify-between mb-10">
<h3 class="font-headline text-xl font-medium text-on-surface">Support Feed</h3>
<div class="relative">
<span class="material-symbols-outlined text-on-surface-variant">notifications</span>
<span class="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
</div>
</header>
<div class="space-y-8">
<!-- Feed Item 1 -->
<div class="flex gap-4">
<div class="flex-shrink-0 relative">
<div class="w-12 h-12 rounded-full overflow-hidden">
<img class="w-full h-full object-cover" data-alt="portrait of a calm young woman with natural sunlight and soft forest background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG5_MDi-JrCxMfdPdHjJDxrrbCu8k4SDTjwYLfocJb-wV2NlvBx9YiQIggiaw7lMiJhEGbhMLosHBRyxin41N_Ib9ZJuxa6Mg8peAphqKu_B2A4EHuMxBc3-5HOqzoyR9GP65-9CkvUikkaP0ESblM_HIP4Dcpj46IfvLJJK03IvcgBhloa9PwWQrQ3hS4_qPcTdNkGO5SPe2_nN64n6WNvCNZSVss5gaphMUq57i0_NUIzdTJAf4mR0CZ-FHq3_-cnSCQnQaToJ8"/>
</div>
<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-tertiary-container rounded-full flex items-center justify-center border-2 border-surface-container-low">
<span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
</div>
</div>
<div class="flex-1">
<p class="text-sm leading-relaxed"><span class="font-bold">Maya</span> is feeling a bit heavy today. Let her know you're here.</p>
<button class="mt-4 px-5 py-2.5 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-tertiary-fixed transition-colors">
<span class="material-symbols-outlined text-sm">send</span>
                                Nudge Maya
                            </button>
</div>
</div>
<!-- Feed Item 2 -->
<div class="flex gap-4">
<div class="flex-shrink-0 relative">
<div class="w-12 h-12 rounded-full overflow-hidden">
<img class="w-full h-full object-cover" data-alt="warm portrait of a smiling man with gentle lighting and cozy indoor setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEMIZZdQuB7CpbnQnyK8Vo45CTQPXB-6s6IfbFxWd1OGjT8X8g9fuglSLt7-zqjmCB0b_IjSSh9Gasj_j31MabqrUvFc5ZjOF3-j_6s154VNRabwNQqpvglwga8jj4zqeVt4IKUre2EcXR5oeeYqkga2pzyXaAPcti6t89IZybdTibQjfVXgPNlyoudPJEKo-nkugX62ykBqro_kTnnp-Ke1lw0qcycPQtMyeu0cb1NuBR5lIjwR-uTT78VZOAtGGDilBIeJHbebc"/>
</div>
<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-container rounded-full flex items-center justify-center border-2 border-surface-container-low">
<span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
</div>
<div class="flex-1">
<p class="text-sm leading-relaxed"><span class="font-bold">Leo</span> shared a win in Family Spore! Celebrate his milestone.</p>
<button class="mt-4 px-5 py-2.5 bg-primary-container text-on-primary-container rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-primary-fixed transition-colors">
<span class="material-symbols-outlined text-sm">celebration</span>
                                Send Appreciation
                            </button>
</div>
</div>
<!-- Feed Item 3 -->
<div class="flex gap-4">
<div class="flex-shrink-0 relative">
<div class="w-12 h-12 rounded-full overflow-hidden">
<img class="w-full h-full object-cover" data-alt="close-up portrait of an artist in a sunlit studio with artistic background blur" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwEv1deH4cNEi9FYDW__WAnBDvTh-aVY6F57TL6d78kdQcwkk4w96-G13_B-tL8bAAXGM0_83Ja71WStzbjLws_aOCvskEA2vM2DetR3jMQURHbo-7NkJCtZWpw6uNdMY4Ial0UJHG9qZGCSe-dTpbA4l6Ex_qFdiqzDzmRnjSJ_HY9NkPvJaO9mMtViibY2N97D1BlAfxDtASiFv-2tfrYDQ96g_wlBbcDipA-Q0PlZndXN_sT5MuNnc0a74xhBTK7NniVcEpGww"/>
</div>
<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary-container rounded-full flex items-center justify-center border-2 border-surface-container-low">
<span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">chat</span>
</div>
</div>
<div class="flex-1">
<p class="text-sm leading-relaxed"><span class="font-bold">Sarah</span> updated her status. Check in on her new journey.</p>
<button class="mt-4 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors underline decoration-outline-variant underline-offset-4">
                                Read More
                            </button>
</div>
</div>
</div>
<!-- Abstract Trend (Aura Chart) -->
<div class="mt-16 p-8 bg-surface-container-lowest rounded-xl relative overflow-hidden">
<div class="relative z-10">
<h4 class="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Collective Pulse</h4>
<div class="flex items-end gap-2 h-24 mb-4">
<div class="w-full bg-primary-container rounded-full" style="height: 60%;"></div>
<div class="w-full bg-primary-container rounded-full" style="height: 80%;"></div>
<div class="w-full bg-secondary-container rounded-full" style="height: 45%;"></div>
<div class="w-full bg-primary-container rounded-full" style="height: 90%;"></div>
<div class="w-full bg-tertiary-container rounded-full" style="height: 30%;"></div>
</div>
<p class="text-xs text-on-surface-variant text-center">78% of your Spores are feeling <span class="text-primary font-bold">Grounded</span> today.</p>
</div>
<!-- Aura background blur -->
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary aura-glow rounded-full"></div>
</div>
</div>
</aside>
</main>
<!-- Floating Action Button (Mobile/Contextual) -->
<button class="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center scale-100 active:scale-95 transition-transform">
<span class="material-symbols-outlined text-3xl">add</span>
</button>
</body></html>
```
