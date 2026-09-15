const CPUS = {
  AMD: [
    /* -------- FX series (legacy, pre-Ryzen) -------- */
    { name:'FX-4300',            tier:'entry',      mult:0.35, tdp:95,  cores:'4C/4T',  clock:'3.8–4.0GHz', cb23:1400, socket:'AM3+',    gen:'Piledriver',     price:20  },
    { name:'FX-6300',            tier:'entry',      mult:0.42, tdp:95,  cores:'6C/6T',  clock:'3.5–4.1GHz', cb23:1900, socket:'AM3+',    gen:'Piledriver',     price:25  },
    { name:'FX-6350',            tier:'entry',      mult:0.45, tdp:125, cores:'6C/6T',  clock:'3.9–4.2GHz', cb23:2100, socket:'AM3+',    gen:'Piledriver',     price:30  },
    { name:'FX-8320',            tier:'entry',      mult:0.48, tdp:125, cores:'8C/8T',  clock:'3.5–4.0GHz', cb23:2300, socket:'AM3+',    gen:'Piledriver',     price:30  },
    { name:'FX-8350',            tier:'entry',      mult:0.52, tdp:125, cores:'8C/8T',  clock:'4.0–4.2GHz', cb23:2600, socket:'AM3+',    gen:'Piledriver',     price:35  },
    { name:'FX-8370',            tier:'entry',      mult:0.55, tdp:125, cores:'8C/8T',  clock:'4.0–4.3GHz', cb23:2800, socket:'AM3+',    gen:'Piledriver',     price:40  },
    { name:'FX-9590',            tier:'entry',      mult:0.62, tdp:220, cores:'8C/8T',  clock:'4.7–5.0GHz', cb23:3200, socket:'AM3+',    gen:'Piledriver',     price:60  },

    /* -------- Ryzen 1000 (Zen 1) -------- */
    { name:'Ryzen 3 1200',       tier:'entry',      mult:0.75, tdp:65,  cores:'4C/4T',  clock:'3.1–3.4GHz', cb23:3800, socket:'AM4',     gen:'Zen',            price:30  },
    { name:'Ryzen 3 1300X',      tier:'entry',      mult:0.80, tdp:65,  cores:'4C/4T',  clock:'3.5–3.7GHz', cb23:4200, socket:'AM4',     gen:'Zen',            price:35  },
    { name:'Ryzen 5 1400',       tier:'entry',      mult:0.82, tdp:65,  cores:'4C/8T',  clock:'3.2–3.4GHz', cb23:4400, socket:'AM4',     gen:'Zen',            price:40  },
    { name:'Ryzen 5 1500X',      tier:'entry',      mult:0.86, tdp:65,  cores:'4C/8T',  clock:'3.5–3.7GHz', cb23:4800, socket:'AM4',     gen:'Zen',            price:45  },
    { name:'Ryzen 5 1600',       tier:'mainstream', mult:0.92, tdp:65,  cores:'6C/12T', clock:'3.2–3.6GHz', cb23:6100, socket:'AM4',     gen:'Zen',            price:55  },
    { name:'Ryzen 5 1600X',      tier:'mainstream', mult:0.96, tdp:95,  cores:'6C/12T', clock:'3.6–4.0GHz', cb23:6600, socket:'AM4',     gen:'Zen',            price:60  },
    { name:'Ryzen 7 1700',       tier:'mainstream', mult:1.00, tdp:65,  cores:'8C/16T', clock:'3.0–3.7GHz', cb23:7400, socket:'AM4',     gen:'Zen',            price:65  },
    { name:'Ryzen 7 1700X',      tier:'mainstream', mult:1.05, tdp:95,  cores:'8C/16T', clock:'3.4–3.8GHz', cb23:8000, socket:'AM4',     gen:'Zen',            price:70  },
    { name:'Ryzen 7 1800X',      tier:'mainstream', mult:1.08, tdp:95,  cores:'8C/16T', clock:'3.6–4.0GHz', cb23:8400, socket:'AM4',     gen:'Zen',            price:80  },

    /* -------- Ryzen 2000 (Zen+) -------- */
    { name:'Ryzen 3 2200G',      tier:'entry',      mult:0.78, tdp:65,  cores:'4C/4T',  clock:'3.5–3.7GHz', cb23:4000, socket:'AM4',     gen:'Zen+',           price:40  },
    { name:'Ryzen 5 2400G',      tier:'entry',      mult:0.88, tdp:65,  cores:'4C/8T',  clock:'3.6–3.9GHz', cb23:5200, socket:'AM4',     gen:'Zen+',           price:50  },
    { name:'Ryzen 5 2600',       tier:'mainstream', mult:1.00, tdp:65,  cores:'6C/12T', clock:'3.4–3.9GHz', cb23:7200, socket:'AM4',     gen:'Zen+',           price:60  },
    { name:'Ryzen 5 2600X',      tier:'mainstream', mult:1.05, tdp:95,  cores:'6C/12T', clock:'3.6–4.2GHz', cb23:7800, socket:'AM4',     gen:'Zen+',           price:70  },
    { name:'Ryzen 7 2700',       tier:'mainstream', mult:1.12, tdp:65,  cores:'8C/16T', clock:'3.2–4.1GHz', cb23:9100, socket:'AM4',     gen:'Zen+',           price:80  },
    { name:'Ryzen 7 2700X',      tier:'mainstream', mult:1.18, tdp:105, cores:'8C/16T', clock:'3.7–4.3GHz', cb23:9800, socket:'AM4',     gen:'Zen+',           price:90  },
    { name:'Ryzen 5 3400G',      tier:'entry',      mult:0.95, tdp:65,  cores:'4C/8T',  clock:'3.7–4.2GHz', cb23:5600, socket:'AM4',     gen:'Zen+',           price:70  },

    /* -------- Ryzen 3000 (Zen 2) -------- */
    { name:'Ryzen 3 3100',       tier:'entry',      mult:1.05, tdp:65,  cores:'4C/8T',  clock:'3.6–3.9GHz', cb23:6500, socket:'AM4',     gen:'Zen 2',          price:60  },
    { name:'Ryzen 3 3300X',      tier:'mainstream', mult:1.15, tdp:65,  cores:'4C/8T',  clock:'3.8–4.3GHz', cb23:7200, socket:'AM4',     gen:'Zen 2',          price:75  },
    { name:'Ryzen 5 3500X',      tier:'mainstream', mult:1.12, tdp:65,  cores:'6C/6T',  clock:'3.6–4.1GHz', cb23:7800, socket:'AM4',     gen:'Zen 2',          price:70  },
    { name:'Ryzen 5 3600',       tier:'mainstream', mult:1.22, tdp:65,  cores:'6C/12T', clock:'3.6–4.2GHz', cb23:9400, socket:'AM4',     gen:'Zen 2',          price:80  },
    { name:'Ryzen 5 3600X',      tier:'mainstream', mult:1.26, tdp:95,  cores:'6C/12T', clock:'3.8–4.4GHz', cb23:9900, socket:'AM4',     gen:'Zen 2',          price:90  },
    { name:'Ryzen 5 3600XT',     tier:'mainstream', mult:1.28, tdp:95,  cores:'6C/12T', clock:'3.8–4.5GHz', cb23:10200, socket:'AM4',    gen:'Zen 2',          price:100 },
    { name:'Ryzen 7 3700X',      tier:'performance',mult:1.42, tdp:65,  cores:'8C/16T', clock:'3.6–4.4GHz', cb23:12100, socket:'AM4',    gen:'Zen 2',          price:110 },
    { name:'Ryzen 7 3800X',      tier:'performance',mult:1.48, tdp:105, cores:'8C/16T', clock:'3.9–4.5GHz', cb23:12800, socket:'AM4',    gen:'Zen 2',          price:130 },
    { name:'Ryzen 7 3800XT',     tier:'performance',mult:1.52, tdp:105, cores:'8C/16T', clock:'3.9–4.7GHz', cb23:13300, socket:'AM4',    gen:'Zen 2',          price:150 },
    { name:'Ryzen 9 3900X',      tier:'enthusiast', mult:1.72, tdp:105, cores:'12C/24T',clock:'3.8–4.6GHz', cb23:17400, socket:'AM4',    gen:'Zen 2',          price:200 },
    { name:'Ryzen 9 3900XT',     tier:'enthusiast', mult:1.78, tdp:105, cores:'12C/24T',clock:'3.8–4.7GHz', cb23:18100, socket:'AM4',    gen:'Zen 2',          price:230 },
    { name:'Ryzen 9 3950X',      tier:'flagship',   mult:1.95, tdp:105, cores:'16C/32T',clock:'3.5–4.7GHz', cb23:20200, socket:'AM4',    gen:'Zen 2',          price:320 },

    /* -------- Ryzen 4000 (Zen 2 APUs) -------- */
    { name:'Ryzen 3 4100',       tier:'entry',      mult:1.10, tdp:65,  cores:'4C/8T',  clock:'3.8–4.0GHz', cb23:7200, socket:'AM4',     gen:'Zen 2',          price:70  },
    { name:'Ryzen 5 4500',       tier:'mainstream', mult:1.20, tdp:65,  cores:'6C/12T', clock:'3.6–4.1GHz', cb23:9400, socket:'AM4',     gen:'Zen 2',          price:85  },
    { name:'Ryzen 5 4600G',      tier:'mainstream', mult:1.22, tdp:65,  cores:'6C/12T', clock:'3.7–4.2GHz', cb23:9800, socket:'AM4',     gen:'Zen 2',          price:100 },
    { name:'Ryzen 7 4700G',      tier:'performance',mult:1.42, tdp:65,  cores:'8C/16T', clock:'3.6–4.4GHz', cb23:12400, socket:'AM4',    gen:'Zen 2',          price:130 },
    { name:'Ryzen 7 4750G',      tier:'performance',mult:1.46, tdp:65,  cores:'8C/16T', clock:'3.6–4.4GHz', cb23:12800, socket:'AM4',    gen:'Zen 2',          price:150 },

    /* -------- Ryzen 5000 (Zen 3) -------- */
    { name:'Ryzen 5 5500',       tier:'mainstream', mult:1.42, tdp:65,  cores:'6C/12T', clock:'3.6–4.2GHz', cb23:11000, socket:'AM4',    gen:'Zen 3',          price:90  },
    { name:'Ryzen 5 5600',       tier:'mainstream', mult:1.50, tdp:65,  cores:'6C/12T', clock:'3.5–4.4GHz', cb23:11900, socket:'AM4',    gen:'Zen 3',          price:110 },
    { name:'Ryzen 5 5600X',      tier:'mainstream', mult:1.55, tdp:65,  cores:'6C/12T', clock:'3.7–4.6GHz', cb23:12400, socket:'AM4',    gen:'Zen 3',          price:130 },
    { name:'Ryzen 7 5700X',      tier:'performance',mult:1.68, tdp:65,  cores:'8C/16T', clock:'3.4–4.6GHz', cb23:14800, socket:'AM4',    gen:'Zen 3',          price:160 },
    { name:'Ryzen 7 5700X3D',    tier:'performance',mult:1.78, tdp:105, cores:'8C/16T', clock:'3.0–4.1GHz', cb23:14600, socket:'AM4',    gen:'Zen 3 3D',       price:200 },
    { name:'Ryzen 7 5800X',      tier:'performance',mult:1.76, tdp:105, cores:'8C/16T', clock:'3.8–4.7GHz', cb23:15800, socket:'AM4',    gen:'Zen 3',          price:180 },
    { name:'Ryzen 7 5800X3D',    tier:'gaming',     mult:1.85, tdp:105, cores:'8C/16T', clock:'3.4–4.5GHz', cb23:15200, socket:'AM4',    gen:'Zen 3 3D',       price:230 },
    { name:'Ryzen 9 5900X',      tier:'enthusiast', mult:2.02, tdp:105, cores:'12C/24T',clock:'3.7–4.8GHz', cb23:22400, socket:'AM4',    gen:'Zen 3',          price:280 },
    { name:'Ryzen 9 5950X',      tier:'flagship',   mult:2.25, tdp:105, cores:'16C/32T',clock:'3.4–4.9GHz', cb23:28600, socket:'AM4',    gen:'Zen 3',          price:400 },

    /* -------- Ryzen 7000 (Zen 4) -------- */
    { name:'Ryzen 5 7500F',      tier:'mainstream', mult:1.72, tdp:65,  cores:'6C/12T', clock:'3.7–5.0GHz', cb23:14200, socket:'AM5',    gen:'Zen 4',          price:160 },
    { name:'Ryzen 5 7600',       tier:'mainstream', mult:1.76, tdp:65,  cores:'6C/12T', clock:'3.8–5.1GHz', cb23:14800, socket:'AM5',    gen:'Zen 4',          price:180 },
    { name:'Ryzen 5 7600X',      tier:'mainstream', mult:1.80, tdp:105, cores:'6C/12T', clock:'4.7–5.3GHz', cb23:15100, socket:'AM5',    gen:'Zen 4',          price:190 },
    { name:'Ryzen 7 7700',       tier:'performance',mult:1.95, tdp:65,  cores:'8C/16T', clock:'3.8–5.3GHz', cb23:18800, socket:'AM5',    gen:'Zen 4',          price:260 },
    { name:'Ryzen 7 7700X',      tier:'performance',mult:1.98, tdp:105, cores:'8C/16T', clock:'4.5–5.4GHz', cb23:19100, socket:'AM5',    gen:'Zen 4',          price:280 },
    { name:'Ryzen 7 7800X3D',    tier:'gaming',     mult:2.10, tdp:120, cores:'8C/16T', clock:'4.2–5.0GHz', cb23:18200, socket:'AM5',    gen:'Zen 4 3D',       price:350 },
    { name:'Ryzen 9 7900',       tier:'enthusiast', mult:2.15, tdp:65,  cores:'12C/24T',clock:'3.7–5.4GHz', cb23:26200, socket:'AM5',    gen:'Zen 4',          price:370 },
    { name:'Ryzen 9 7900X',      tier:'enthusiast', mult:2.25, tdp:170, cores:'12C/24T',clock:'4.7–5.6GHz', cb23:29300, socket:'AM5',    gen:'Zen 4',          price:400 },
    { name:'Ryzen 9 7900X3D',    tier:'enthusiast', mult:2.30, tdp:120, cores:'12C/24T',clock:'4.4–5.6GHz', cb23:27200, socket:'AM5',    gen:'Zen 4 3D',       price:500 },
    { name:'Ryzen 9 7950X',      tier:'flagship',   mult:2.50, tdp:170, cores:'16C/32T',clock:'4.5–5.7GHz', cb23:38200, socket:'AM5',    gen:'Zen 4',          price:550 },
    { name:'Ryzen 9 7950X3D',    tier:'flagship',   mult:2.55, tdp:120, cores:'16C/32T',clock:'4.2–5.7GHz', cb23:36400, socket:'AM5',    gen:'Zen 4 3D',       price:650 },

    /* -------- Ryzen 8000 (Zen 4 APUs) -------- */
    { name:'Ryzen 5 8500G',      tier:'entry',      mult:1.55, tdp:65,  cores:'6C/12T', clock:'3.5–5.0GHz', cb23:13200, socket:'AM5',    gen:'Zen 4',          price:150 },
    { name:'Ryzen 5 8600G',      tier:'mainstream', mult:1.78, tdp:65,  cores:'6C/12T', clock:'4.3–5.0GHz', cb23:14800, socket:'AM5',    gen:'Zen 4',          price:200 },
    { name:'Ryzen 7 8700G',      tier:'performance',mult:2.00, tdp:65,  cores:'8C/16T', clock:'4.2–5.1GHz', cb23:18600, socket:'AM5',    gen:'Zen 4',          price:300 },
    { name:'Ryzen 7 8700F',      tier:'performance',mult:1.96, tdp:65,  cores:'8C/16T', clock:'4.1–5.0GHz', cb23:18200, socket:'AM5',    gen:'Zen 4',          price:270 },

    /* -------- Ryzen 9000 (Zen 5) -------- */
    { name:'Ryzen 5 9600',       tier:'mainstream', mult:1.85, tdp:65,  cores:'6C/12T', clock:'3.8–5.2GHz', cb23:16200, socket:'AM5',    gen:'Zen 5',          price:230 },
    { name:'Ryzen 5 9600X',      tier:'mainstream', mult:1.88, tdp:65,  cores:'6C/12T', clock:'3.9–5.4GHz', cb23:16400, socket:'AM5',    gen:'Zen 5',          price:250 },
    { name:'Ryzen 7 9700X',      tier:'performance',mult:2.06, tdp:65,  cores:'8C/16T', clock:'3.8–5.5GHz', cb23:21800, socket:'AM5',    gen:'Zen 5',          price:330 },
    { name:'Ryzen 7 9800X3D',    tier:'gaming',     mult:2.45, tdp:120, cores:'8C/16T', clock:'4.7–5.2GHz', cb23:20600, socket:'AM5',    gen:'Zen 5 3D',       price:480 },
    { name:'Ryzen 9 9900X',      tier:'enthusiast', mult:2.32, tdp:120, cores:'12C/24T',clock:'4.4–5.6GHz', cb23:31800, socket:'AM5',    gen:'Zen 5',          price:450 },
    { name:'Ryzen 9 9900X3D',    tier:'enthusiast', mult:2.42, tdp:120, cores:'12C/24T',clock:'4.4–5.6GHz', cb23:32400, socket:'AM5',    gen:'Zen 5 3D',       price:600 },
    { name:'Ryzen 9 9950X',      tier:'flagship',   mult:2.65, tdp:170, cores:'16C/32T',clock:'4.3–5.7GHz', cb23:42600, socket:'AM5',    gen:'Zen 5',          price:650 },
    { name:'Ryzen 9 9950X3D',    tier:'flagship',   mult:2.72, tdp:170, cores:'16C/32T',clock:'4.3–5.7GHz', cb23:41200, socket:'AM5',    gen:'Zen 5 3D',       price:800 },

    /* -------- Threadripper (workstation) -------- */
    { name:'Threadripper 1950X', tier:'flagship',   mult:1.60, tdp:180, cores:'16C/32T',clock:'3.4–4.0GHz', cb23:17000, socket:'TR4',    gen:'Zen',            price:350 },
    { name:'Threadripper 2950X', tier:'flagship',   mult:1.85, tdp:180, cores:'16C/32T',clock:'3.5–4.4GHz', cb23:19800, socket:'TR4',    gen:'Zen+',           price:400 },
    { name:'Threadripper 3960X', tier:'flagship',   mult:2.40, tdp:280, cores:'24C/48T',clock:'3.8–4.5GHz', cb23:31000, socket:'TRX4',   gen:'Zen 2',          price:700 },
    { name:'Threadripper 3970X', tier:'flagship',   mult:2.65, tdp:280, cores:'32C/64T',clock:'3.7–4.5GHz', cb23:38200, socket:'TRX4',   gen:'Zen 2',          price:900 },

    /* -------- Used-market (real, common) -------- */
    { name:'Ryzen 5 3600 (used)',    tier:'mainstream', mult:1.22, tdp:65,  cores:'6C/12T', clock:'3.6–4.2GHz', cb23:9400,  socket:'AM4',  gen:'Zen 2',      price:50  },
    { name:'Ryzen 5 5600X (used)',   tier:'mainstream', mult:1.55, tdp:65,  cores:'6C/12T', clock:'3.7–4.6GHz', cb23:12400, socket:'AM4',  gen:'Zen 3',      price:90  },
    { name:'Ryzen 7 5800X3D (used)', tier:'gaming',     mult:1.85, tdp:105, cores:'8C/16T', clock:'3.4–4.5GHz', cb23:15200, socket:'AM4',  gen:'Zen 3 3D',   price:180 },
    { name:'Ryzen 9 5900X (used)',   tier:'enthusiast', mult:2.02, tdp:105, cores:'12C/24T',clock:'3.7–4.8GHz', cb23:22400, socket:'AM4',  gen:'Zen 3',      price:200 },
  ],
  Intel: [
    /* -------- Sandy / Ivy Bridge (LGA1155) -------- */
    { name:'Core i3-2100',       tier:'entry',      mult:0.38, tdp:65,  cores:'2C/4T',  clock:'3.1GHz',      cb23:1500, socket:'LGA1155', gen:'Sandy Bridge',  price:15  },
    { name:'Core i5-2400',       tier:'entry',      mult:0.48, tdp:95,  cores:'4C/4T',  clock:'3.1–3.4GHz', cb23:2300, socket:'LGA1155', gen:'Sandy Bridge',  price:25  },
    { name:'Core i5-2500K',      tier:'entry',      mult:0.55, tdp:95,  cores:'4C/4T',  clock:'3.3–3.7GHz', cb23:2900, socket:'LGA1155', gen:'Sandy Bridge',  price:35  },
    { name:'Core i7-2600K',      tier:'entry',      mult:0.65, tdp:95,  cores:'4C/8T',  clock:'3.4–3.8GHz', cb23:3900, socket:'LGA1155', gen:'Sandy Bridge',  price:50  },
    { name:'Core i5-3570K',      tier:'entry',      mult:0.62, tdp:77,  cores:'4C/4T',  clock:'3.4–3.8GHz', cb23:3600, socket:'LGA1155', gen:'Ivy Bridge',    price:45  },
    { name:'Core i7-3770K',      tier:'entry',      mult:0.72, tdp:77,  cores:'4C/8T',  clock:'3.5–3.9GHz', cb23:4700, socket:'LGA1155', gen:'Ivy Bridge',    price:60  },

    /* -------- Haswell / Broadwell (LGA1150) -------- */
    { name:'Core i3-4130',       tier:'entry',      mult:0.50, tdp:54,  cores:'2C/4T',  clock:'3.4GHz',      cb23:2400, socket:'LGA1150', gen:'Haswell',       price:20  },
    { name:'Core i5-4460',       tier:'entry',      mult:0.62, tdp:84,  cores:'4C/4T',  clock:'3.2–3.4GHz', cb23:3600, socket:'LGA1150', gen:'Haswell',       price:35  },
    { name:'Core i5-4690K',      tier:'entry',      mult:0.70, tdp:88,  cores:'4C/4T',  clock:'3.5–3.9GHz', cb23:4400, socket:'LGA1150', gen:'Haswell',       price:45  },
    { name:'Core i7-4770K',      tier:'entry',      mult:0.80, tdp:84,  cores:'4C/8T',  clock:'3.5–3.9GHz', cb23:5500, socket:'LGA1150', gen:'Haswell',       price:60  },
    { name:'Core i7-4790K',      tier:'entry',      mult:0.85, tdp:88,  cores:'4C/8T',  clock:'4.0–4.4GHz', cb23:6100, socket:'LGA1150', gen:'Haswell',       price:70  },
    { name:'Core i7-5775C',      tier:'entry',      mult:0.82, tdp:65,  cores:'4C/8T',  clock:'3.3–3.7GHz', cb23:5800, socket:'LGA1150', gen:'Broadwell',     price:80  },

    /* -------- Skylake / Kaby Lake (LGA1151) -------- */
    { name:'Core i3-6100',       tier:'entry',      mult:0.62, tdp:51,  cores:'2C/4T',  clock:'3.7GHz',      cb23:3600, socket:'LGA1151', gen:'Skylake',       price:25  },
    { name:'Core i5-6400',       tier:'entry',      mult:0.70, tdp:65,  cores:'4C/4T',  clock:'2.7–3.3GHz', cb23:4400, socket:'LGA1151', gen:'Skylake',       price:35  },
    { name:'Core i5-6500',       tier:'entry',      mult:0.74, tdp:65,  cores:'4C/4T',  clock:'3.2–3.6GHz', cb23:4800, socket:'LGA1151', gen:'Skylake',       price:40  },
    { name:'Core i5-6600K',      tier:'entry',      mult:0.82, tdp:91,  cores:'4C/4T',  clock:'3.5–3.9GHz', cb23:5600, socket:'LGA1151', gen:'Skylake',       price:50  },
    { name:'Core i7-6700K',      tier:'mainstream', mult:0.95, tdp:91,  cores:'4C/8T',  clock:'4.0–4.2GHz', cb23:7400, socket:'LGA1151', gen:'Skylake',       price:70  },
    { name:'Core i3-7100',       tier:'entry',      mult:0.65, tdp:51,  cores:'2C/4T',  clock:'3.9GHz',      cb23:3900, socket:'LGA1151', gen:'Kaby Lake',     price:30  },
    { name:'Core i5-7400',       tier:'entry',      mult:0.76, tdp:65,  cores:'4C/4T',  clock:'3.0–3.5GHz', cb23:5000, socket:'LGA1151', gen:'Kaby Lake',     price:45  },
    { name:'Core i5-7600K',      tier:'entry',      mult:0.86, tdp:91,  cores:'4C/4T',  clock:'3.8–4.2GHz', cb23:6200, socket:'LGA1151', gen:'Kaby Lake',     price:55  },
    { name:'Core i7-7700K',      tier:'mainstream', mult:1.00, tdp:91,  cores:'4C/8T',  clock:'4.2–4.5GHz', cb23:8200, socket:'LGA1151', gen:'Kaby Lake',     price:80  },

    /* -------- Coffee Lake (LGA1151 v2) -------- */
    { name:'Core i3-8100',       tier:'entry',      mult:0.72, tdp:65,  cores:'4C/4T',  clock:'3.6GHz',      cb23:4600, socket:'LGA1151', gen:'Coffee Lake',   price:40  },
    { name:'Core i3-8350K',      tier:'entry',      mult:0.78, tdp:91,  cores:'4C/4T',  clock:'4.0GHz',      cb23:5200, socket:'LGA1151', gen:'Coffee Lake',   price:50  },
    { name:'Core i5-8400',       tier:'entry',      mult:0.88, tdp:65,  cores:'6C/6T',  clock:'2.8–4.0GHz', cb23:6500, socket:'LGA1151', gen:'Coffee Lake',   price:55  },
    { name:'Core i5-8600K',      tier:'mainstream', mult:1.00, tdp:95,  cores:'6C/6T',  clock:'3.6–4.3GHz', cb23:8200, socket:'LGA1151', gen:'Coffee Lake',   price:70  },
    { name:'Core i7-8700',       tier:'mainstream', mult:1.05, tdp:65,  cores:'6C/12T', clock:'3.2–4.6GHz', cb23:8900, socket:'LGA1151', gen:'Coffee Lake',   price:90  },
    { name:'Core i7-8700K',      tier:'mainstream', mult:1.12, tdp:95,  cores:'6C/12T', clock:'3.7–4.7GHz', cb23:9800, socket:'LGA1151', gen:'Coffee Lake',   price:110 },
    { name:'Core i5-9600K',      tier:'mainstream', mult:1.05, tdp:95,  cores:'6C/6T',  clock:'3.7–4.6GHz', cb23:8800, socket:'LGA1151', gen:'Coffee Lake R', price:80  },
    { name:'Core i7-9700K',      tier:'mainstream', mult:1.18, tdp:95,  cores:'8C/8T',  clock:'3.6–4.9GHz', cb23:10700, socket:'LGA1151', gen:'Coffee Lake R', price:120 },
    { name:'Core i9-9900K',      tier:'performance',mult:1.30, tdp:95,  cores:'8C/16T', clock:'3.6–5.0GHz', cb23:12500, socket:'LGA1151', gen:'Coffee Lake R', price:170 },

    /* -------- Comet Lake (LGA1200) -------- */
    { name:'Core i3-10100',      tier:'entry',      mult:0.85, tdp:65,  cores:'4C/8T',  clock:'3.6–4.3GHz', cb23:5300, socket:'LGA1200', gen:'Comet Lake',    price:50  },
    { name:'Core i3-10100F',     tier:'entry',      mult:0.82, tdp:65,  cores:'4C/8T',  clock:'3.6–4.3GHz', cb23:5100, socket:'LGA1200', gen:'Comet Lake',    price:40  },
    { name:'Core i5-10400',      tier:'mainstream', mult:0.98, tdp:65,  cores:'6C/12T', clock:'2.9–4.3GHz', cb23:8200, socket:'LGA1200', gen:'Comet Lake',    price:80  },
    { name:'Core i5-10400F',     tier:'mainstream', mult:0.96, tdp:65,  cores:'6C/12T', clock:'2.9–4.3GHz', cb23:8200, socket:'LGA1200', gen:'Comet Lake',    price:70  },
    { name:'Core i5-10600K',     tier:'mainstream', mult:1.10, tdp:125, cores:'6C/12T', clock:'4.1–4.8GHz', cb23:9700, socket:'LGA1200', gen:'Comet Lake',    price:100 },
    { name:'Core i7-10700',      tier:'performance',mult:1.18, tdp:65,  cores:'8C/16T', clock:'2.9–4.8GHz', cb23:10700, socket:'LGA1200', gen:'Comet Lake',   price:130 },
    { name:'Core i7-10700K',     tier:'performance',mult:1.28, tdp:125, cores:'8C/16T', clock:'3.8–5.1GHz', cb23:12200, socket:'LGA1200', gen:'Comet Lake',   price:150 },
    { name:'Core i9-10850K',     tier:'performance',mult:1.42, tdp:125, cores:'10C/20T',clock:'3.6–5.2GHz', cb23:14000, socket:'LGA1200', gen:'Comet Lake',   price:200 },
    { name:'Core i9-10900K',     tier:'enthusiast', mult:1.48, tdp:125, cores:'10C/20T',clock:'3.7–5.3GHz', cb23:14800, socket:'LGA1200', gen:'Comet Lake',   price:230 },

    /* -------- Rocket Lake (LGA1200) -------- */
    { name:'Core i5-11400',      tier:'mainstream', mult:1.10, tdp:65,  cores:'6C/12T', clock:'2.6–4.4GHz', cb23:9500, socket:'LGA1200', gen:'Rocket Lake',   price:90  },
    { name:'Core i5-11400F',     tier:'mainstream', mult:1.08, tdp:65,  cores:'6C/12T', clock:'2.6–4.4GHz', cb23:9500, socket:'LGA1200', gen:'Rocket Lake',   price:80  },
    { name:'Core i5-11600K',     tier:'mainstream', mult:1.22, tdp:125, cores:'6C/12T', clock:'3.9–4.9GHz', cb23:10900, socket:'LGA1200', gen:'Rocket Lake',  price:110 },
    { name:'Core i7-11700',      tier:'performance',mult:1.28, tdp:65,  cores:'8C/16T', clock:'2.5–4.9GHz', cb23:12200, socket:'LGA1200', gen:'Rocket Lake',  price:150 },
    { name:'Core i7-11700K',     tier:'performance',mult:1.38, tdp:125, cores:'8C/16T', clock:'3.6–5.0GHz', cb23:13700, socket:'LGA1200', gen:'Rocket Lake',  price:180 },
    { name:'Core i9-11900K',     tier:'enthusiast', mult:1.48, tdp:125, cores:'8C/16T', clock:'3.5–5.3GHz', cb23:14800, socket:'LGA1200', gen:'Rocket Lake',  price:230 },
    { name:'Core i9-11900KF',    tier:'enthusiast', mult:1.50, tdp:125, cores:'8C/16T', clock:'3.5–5.3GHz', cb23:15000, socket:'LGA1200', gen:'Rocket Lake',  price:220 },

    /* -------- Alder Lake (LGA1700) -------- */
    { name:'Core i3-12100',      tier:'entry',      mult:1.05, tdp:60,  cores:'4C/8T',  clock:'3.3–4.3GHz', cb23:8100, socket:'LGA1700', gen:'Alder Lake',    price:90  },
    { name:'Core i3-12100F',     tier:'entry',      mult:1.02, tdp:58,  cores:'4C/8T',  clock:'3.3–4.3GHz', cb23:7800, socket:'LGA1700', gen:'Alder Lake',    price:75  },
    { name:'Core i5-12400',      tier:'mainstream', mult:1.52, tdp:65,  cores:'6C/12T', clock:'2.5–4.4GHz', cb23:12200, socket:'LGA1700', gen:'Alder Lake',   price:150 },
    { name:'Core i5-12400F',     tier:'mainstream', mult:1.55, tdp:65,  cores:'6C/12T', clock:'2.5–4.4GHz', cb23:12400, socket:'LGA1700', gen:'Alder Lake',   price:140 },
    { name:'Core i5-12500',      tier:'mainstream', mult:1.58, tdp:65,  cores:'6C/12T', clock:'3.0–4.6GHz', cb23:12900, socket:'LGA1700', gen:'Alder Lake',   price:170 },
    { name:'Core i5-12600K',     tier:'performance',mult:1.75, tdp:125, cores:'10C/16T',clock:'3.7–4.9GHz', cb23:17500, socket:'LGA1700', gen:'Alder Lake',   price:200 },
    { name:'Core i5-12600KF',    tier:'performance',mult:1.76, tdp:125, cores:'10C/16T',clock:'3.7–4.9GHz', cb23:17700, socket:'LGA1700', gen:'Alder Lake',   price:190 },
    { name:'Core i7-12700',      tier:'performance',mult:1.90, tdp:65,  cores:'12C/20T',clock:'2.1–4.9GHz', cb23:21300, socket:'LGA1700', gen:'Alder Lake',   price:280 },
    { name:'Core i7-12700K',     tier:'performance',mult:1.98, tdp:125, cores:'12C/20T',clock:'3.6–5.0GHz', cb23:22000, socket:'LGA1700', gen:'Alder Lake',   price:300 },
    { name:'Core i9-12900K',     tier:'flagship',   mult:2.22, tdp:125, cores:'16C/24T',clock:'3.2–5.2GHz', cb23:27500, socket:'LGA1700', gen:'Alder Lake',   price:400 },
    { name:'Core i9-12900KS',    tier:'flagship',   mult:2.28, tdp:150, cores:'16C/24T',clock:'3.4–5.5GHz', cb23:28300, socket:'LGA1700', gen:'Alder Lake',   price:450 },

    /* -------- Raptor Lake (LGA1700) -------- */
    { name:'Core i5-13400',      tier:'mainstream', mult:1.75, tdp:65,  cores:'10C/16T',clock:'2.5–4.6GHz', cb23:17500, socket:'LGA1700', gen:'Raptor Lake',  price:180 },
    { name:'Core i5-13400F',     tier:'mainstream', mult:1.74, tdp:65,  cores:'10C/16T',clock:'2.5–4.6GHz', cb23:17400, socket:'LGA1700', gen:'Raptor Lake',  price:160 },
    { name:'Core i5-13500',      tier:'performance',mult:1.90, tdp:65,  cores:'14C/20T',clock:'2.5–4.8GHz', cb23:21400, socket:'LGA1700', gen:'Raptor Lake',  price:220 },
    { name:'Core i5-13600K',     tier:'performance',mult:2.05, tdp:125, cores:'14C/20T',clock:'3.5–5.1GHz', cb23:24000, socket:'LGA1700', gen:'Raptor Lake',  price:250 },
    { name:'Core i5-13600KF',    tier:'performance',mult:2.06, tdp:125, cores:'14C/20T',clock:'3.5–5.1GHz', cb23:24200, socket:'LGA1700', gen:'Raptor Lake',  price:230 },
    { name:'Core i7-13700',      tier:'enthusiast', mult:2.20, tdp:65,  cores:'16C/24T',clock:'2.1–5.2GHz', cb23:28800, socket:'LGA1700', gen:'Raptor Lake',  price:350 },
    { name:'Core i7-13700K',     tier:'enthusiast', mult:2.30, tdp:125, cores:'16C/24T',clock:'3.4–5.4GHz', cb23:30000, socket:'LGA1700', gen:'Raptor Lake',  price:380 },
    { name:'Core i7-13700KF',    tier:'enthusiast', mult:2.32, tdp:125, cores:'16C/24T',clock:'3.4–5.4GHz', cb23:30500, socket:'LGA1700', gen:'Raptor Lake',  price:360 },
    { name:'Core i9-13900K',     tier:'flagship',   mult:2.52, tdp:253, cores:'24C/32T',clock:'3.0–5.8GHz', cb23:38500, socket:'LGA1700', gen:'Raptor Lake',  price:500 },
    { name:'Core i9-13900KF',    tier:'flagship',   mult:2.53, tdp:253, cores:'24C/32T',clock:'3.0–5.8GHz', cb23:38800, socket:'LGA1700', gen:'Raptor Lake',  price:480 },
    { name:'Core i9-13900KS',    tier:'flagship',   mult:2.58, tdp:253, cores:'24C/32T',clock:'3.2–6.0GHz', cb23:39800, socket:'LGA1700', gen:'Raptor Lake',  price:600 },

    /* -------- Raptor Lake Refresh (LGA1700) -------- */
    { name:'Core i5-14400',      tier:'mainstream', mult:1.80, tdp:65,  cores:'10C/16T',clock:'2.5–4.7GHz', cb23:18400, socket:'LGA1700', gen:'Raptor Lake R', price:200 },
    { name:'Core i5-14400F',     tier:'mainstream', mult:1.79, tdp:65,  cores:'10C/16T',clock:'2.5–4.7GHz', cb23:18300, socket:'LGA1700', gen:'Raptor Lake R', price:180 },
    { name:'Core i5-14500',      tier:'performance',mult:1.95, tdp:65,  cores:'14C/20T',clock:'2.6–5.0GHz', cb23:22400, socket:'LGA1700', gen:'Raptor Lake R', price:250 },
    { name:'Core i5-14600K',     tier:'performance',mult:2.10, tdp:125, cores:'14C/20T',clock:'3.5–5.3GHz', cb23:24800, socket:'LGA1700', gen:'Raptor Lake R', price:280 },
    { name:'Core i7-14700K',     tier:'enthusiast', mult:2.38, tdp:125, cores:'20C/28T',clock:'3.4–5.6GHz', cb23:33500, socket:'LGA1700', gen:'Raptor Lake R', price:400 },
    { name:'Core i9-14900K',     tier:'flagship',   mult:2.62, tdp:253, cores:'24C/32T',clock:'3.2–6.0GHz', cb23:40500, socket:'LGA1700', gen:'Raptor Lake R', price:580 },
    { name:'Core i9-14900KS',    tier:'flagship',   mult:2.68, tdp:253, cores:'24C/32T',clock:'3.2–6.2GHz', cb23:41800, socket:'LGA1700', gen:'Raptor Lake R', price:650 },

    /* -------- Core Ultra 200 (Arrow Lake, LGA1851) -------- */
    { name:'Core Ultra 5 225F',  tier:'mainstream', mult:1.85, tdp:65,  cores:'10C/10T',clock:'3.3–4.9GHz', cb23:19200, socket:'LGA1851', gen:'Arrow Lake',   price:220 },
    { name:'Core Ultra 5 245K',  tier:'performance',mult:2.10, tdp:125, cores:'14C/14T',clock:'4.2–5.2GHz', cb23:24500, socket:'LGA1851', gen:'Arrow Lake',   price:300 },
    { name:'Core Ultra 5 245KF', tier:'performance',mult:2.11, tdp:125, cores:'14C/14T',clock:'4.2–5.2GHz', cb23:24700, socket:'LGA1851', gen:'Arrow Lake',   price:280 },
    { name:'Core Ultra 7 265K',  tier:'enthusiast', mult:2.35, tdp:125, cores:'20C/20T',clock:'3.9–5.5GHz', cb23:33500, socket:'LGA1851', gen:'Arrow Lake',   price:400 },
    { name:'Core Ultra 7 265KF', tier:'enthusiast', mult:2.36, tdp:125, cores:'20C/20T',clock:'3.9–5.5GHz', cb23:33800, socket:'LGA1851', gen:'Arrow Lake',   price:380 },
    { name:'Core Ultra 9 285K',  tier:'flagship',   mult:2.58, tdp:250, cores:'24C/24T',clock:'3.7–5.7GHz', cb23:42000, socket:'LGA1851', gen:'Arrow Lake',   price:600 },

    /* -------- Used-market (real, common) -------- */
    { name:'Core i7-8700K (used)',  tier:'mainstream', mult:1.12, tdp:95,  cores:'6C/12T', clock:'3.7–4.7GHz', cb23:9800,  socket:'LGA1151', gen:'Coffee Lake',  price:60  },
    { name:'Core i7-10700K (used)', tier:'performance',mult:1.28, tdp:125, cores:'8C/16T', clock:'3.8–5.1GHz', cb23:12200, socket:'LGA1200', gen:'Comet Lake',   price:90  },
    { name:'Core i5-12400F (used)', tier:'mainstream', mult:1.55, tdp:65,  cores:'6C/12T', clock:'2.5–4.4GHz', cb23:12400, socket:'LGA1700', gen:'Alder Lake',   price:80  },
    { name:'Core i5-13600K (used)', tier:'performance',mult:2.05, tdp:125, cores:'14C/20T',clock:'3.5–5.1GHz', cb23:24000, socket:'LGA1700', gen:'Raptor Lake',  price:160 },
  ]
};

const GPUS = {
  NVIDIA: [
    /* -------- GTX 700 / 900 series (legacy) -------- */
    { name:'GTX 750 Ti',        tier:'entry',      mult:0.42, tdp:60,  vram:2,  ts:1800,  rt:false, price:50  },
    { name:'GTX 760',           tier:'entry',      mult:0.48, tdp:170, vram:2,  ts:2100,  rt:false, price:55  },
    { name:'GTX 770',           tier:'entry',      mult:0.55, tdp:230, vram:2,  ts:2700,  rt:false, price:70  },
    { name:'GTX 780',           tier:'entry',      mult:0.62, tdp:250, vram:3,  ts:3200,  rt:false, price:85  },
    { name:'GTX 780 Ti',        tier:'mainstream', mult:0.70, tdp:250, vram:3,  ts:3800,  rt:false, price:95  },
    { name:'GTX 950',           tier:'entry',      mult:0.48, tdp:90,  vram:2,  ts:2200,  rt:false, price:60  },
    { name:'GTX 960',           tier:'entry',      mult:0.58, tdp:120, vram:2,  ts:3000,  rt:false, price:70  },
    { name:'GTX 970',           tier:'entry',      mult:0.78, tdp:145, vram:4,  ts:4500,  rt:false, price:90  },
    { name:'GTX 980',           tier:'mainstream', mult:0.92, tdp:165, vram:4,  ts:5400,  rt:false, price:110 },
    { name:'GTX 980 Ti',        tier:'mainstream', mult:1.10, tdp:250, vram:6,  ts:6600,  rt:false, price:140 },

    /* -------- GTX 10 series (Pascal) -------- */
    { name:'GTX 1050',          tier:'entry',      mult:0.48, tdp:75,  vram:2,  ts:2400,  rt:false, price:60  },
    { name:'GTX 1050 Ti',       tier:'entry',      mult:0.55, tdp:75,  vram:4,  ts:3100,  rt:false, price:75  },
    { name:'GTX 1060 3GB',      tier:'entry',      mult:0.72, tdp:120, vram:3,  ts:3800,  rt:false, price:90  },
    { name:'GTX 1060 6GB',      tier:'entry',      mult:0.78, tdp:120, vram:6,  ts:4200,  rt:false, price:110 },
    { name:'GTX 1070',          tier:'mainstream', mult:1.05, tdp:150, vram:8,  ts:6100,  rt:false, price:130 },
    { name:'GTX 1070 Ti',       tier:'mainstream', mult:1.18, tdp:180, vram:8,  ts:7000,  rt:false, price:160 },
    { name:'GTX 1080',          tier:'mainstream', mult:1.32, tdp:180, vram:8,  ts:7800,  rt:false, price:180 },
    { name:'GTX 1080 Ti',       tier:'performance',mult:1.62, tdp:250, vram:11, ts:9800,  rt:false, price:230 },

    /* -------- GTX 16 series (Turing, no RT) -------- */
    { name:'GTX 1650',          tier:'entry',      mult:0.85, tdp:75,  vram:4,  ts:4700,  rt:false, price:110 },
    { name:'GTX 1650 Super',    tier:'entry',      mult:1.00, tdp:100, vram:4,  ts:5600,  rt:false, price:130 },
    { name:'GTX 1660',          tier:'entry',      mult:1.05, tdp:120, vram:6,  ts:5800,  rt:false, price:140 },
    { name:'GTX 1660 Super',    tier:'mainstream', mult:1.15, tdp:125, vram:6,  ts:6300,  rt:false, price:150 },
    { name:'GTX 1660 Ti',       tier:'mainstream', mult:1.22, tdp:120, vram:6,  ts:6800,  rt:false, price:170 },

    /* -------- RTX 20 series (Turing, first-gen RT) -------- */
    { name:'RTX 2060 6GB',      tier:'mainstream', mult:1.30, tdp:160, vram:6,  ts:7600,  rt:true,  price:180 },
    { name:'RTX 2060 12GB',     tier:'mainstream', mult:1.42, tdp:185, vram:12, ts:8300,  rt:true,  price:220 },
    { name:'RTX 2060 Super',    tier:'mainstream', mult:1.50, tdp:175, vram:8,  ts:8800,  rt:true,  price:220 },
    { name:'RTX 2070',          tier:'performance',mult:1.62, tdp:185, vram:8,  ts:9400,  rt:true,  price:240 },
    { name:'RTX 2070 Super',    tier:'performance',mult:1.82, tdp:215, vram:8,  ts:10500, rt:true,  price:270 },
    { name:'RTX 2080',          tier:'performance',mult:1.95, tdp:215, vram:8,  ts:11200, rt:true,  price:300 },
    { name:'RTX 2080 Super',    tier:'performance',mult:2.12, tdp:250, vram:8,  ts:12200, rt:true,  price:330 },
    { name:'RTX 2080 Ti',       tier:'enthusiast', mult:2.35, tdp:260, vram:11, ts:13800, rt:true,  price:400 },

    /* -------- RTX 30 series (Ampere) -------- */
    { name:'RTX 3050 6GB',      tier:'entry',      mult:1.40, tdp:70,  vram:6,  ts:7500,  rt:true,  price:170 },
    { name:'RTX 3050 8GB',      tier:'entry',      mult:1.50, tdp:130, vram:8,  ts:8300,  rt:true,  price:190 },
    { name:'RTX 3060 8GB',      tier:'mainstream', mult:1.55, tdp:170, vram:8,  ts:8600,  rt:true,  price:210 },
    { name:'RTX 3060 12GB',     tier:'mainstream', mult:1.62, tdp:170, vram:12, ts:8700,  rt:true,  price:250 },
    { name:'RTX 3060 Ti',       tier:'performance',mult:1.95, tdp:200, vram:8,  ts:11200, rt:true,  price:320 },
    { name:'RTX 3070',          tier:'performance',mult:2.10, tdp:220, vram:8,  ts:12700, rt:true,  price:380 },
    { name:'RTX 3070 Ti',       tier:'performance',mult:2.28, tdp:290, vram:8,  ts:14000, rt:true,  price:420 },
    { name:'RTX 3080 10GB',     tier:'enthusiast', mult:2.65, tdp:320, vram:10, ts:17600, rt:true,  price:520 },
    { name:'RTX 3080 12GB',     tier:'enthusiast', mult:2.75, tdp:350, vram:12, ts:18300, rt:true,  price:560 },
    { name:'RTX 3080 Ti',       tier:'enthusiast', mult:2.95, tdp:350, vram:12, ts:19500, rt:true,  price:650 },
    { name:'RTX 3090',          tier:'flagship',   mult:3.05, tdp:350, vram:24, ts:20000, rt:true,  price:800 },
    { name:'RTX 3090 Ti',       tier:'flagship',   mult:3.25, tdp:450, vram:24, ts:21800, rt:true,  price:950 },

    /* -------- RTX 40 series (Ada Lovelace) -------- */
    { name:'RTX 4060',          tier:'mainstream', mult:1.88, tdp:115, vram:8,  ts:10800, rt:true,  price:300 },
    { name:'RTX 4060 Ti 8GB',   tier:'performance',mult:2.20, tdp:160, vram:8,  ts:13500, rt:true,  price:380 },
    { name:'RTX 4060 Ti 16GB',  tier:'performance',mult:2.22, tdp:165, vram:16, ts:13600, rt:true,  price:450 },
    { name:'RTX 4070',          tier:'performance',mult:2.85, tdp:200, vram:12, ts:17800, rt:true,  price:520 },
    { name:'RTX 4070 Super',    tier:'enthusiast', mult:3.15, tdp:220, vram:12, ts:19800, rt:true,  price:600 },
    { name:'RTX 4070 Ti',       tier:'enthusiast', mult:3.25, tdp:285, vram:12, ts:20500, rt:true,  price:700 },
    { name:'RTX 4070 Ti Super', tier:'enthusiast', mult:3.45, tdp:285, vram:16, ts:22000, rt:true,  price:750 },
    { name:'RTX 4080',          tier:'flagship',   mult:3.90, tdp:320, vram:16, ts:25500, rt:true,  price:1000 },
    { name:'RTX 4080 Super',    tier:'flagship',   mult:4.10, tdp:320, vram:16, ts:26800, rt:true,  price:1000 },
    { name:'RTX 4090',          tier:'flagship',   mult:4.65, tdp:450, vram:24, ts:30500, rt:true,  price:1700 },

    /* -------- RTX 50 series (Blackwell) -------- */
    { name:'RTX 5060',          tier:'mainstream', mult:2.10, tdp:150, vram:8,  ts:13000, rt:true,  price:340 },
    { name:'RTX 5060 Ti',       tier:'performance',mult:2.60, tdp:180, vram:16, ts:16200, rt:true,  price:440 },
    { name:'RTX 5070',          tier:'performance',mult:3.55, tdp:250, vram:12, ts:23000, rt:true,  price:600 },
    { name:'RTX 5070 Ti',       tier:'enthusiast', mult:4.00, tdp:300, vram:16, ts:26000, rt:true,  price:800 },
    { name:'RTX 5080',          tier:'flagship',   mult:4.35, tdp:360, vram:16, ts:28500, rt:true,  price:1100 },
    { name:'RTX 5090',          tier:'flagship',   mult:5.60, tdp:575, vram:32, ts:36500, rt:true,  price:2200 },

    /* -------- Workstation / Titan (legacy but real) -------- */
    { name:'Titan X (Pascal)',  tier:'enthusiast', mult:1.55, tdp:250, vram:12, ts:9200,  rt:false, price:400 },
    { name:'Titan Xp',          tier:'enthusiast', mult:1.72, tdp:250, vram:12, ts:10300, rt:false, price:500 },
    { name:'Titan RTX',         tier:'flagship',   mult:2.30, tdp:280, vram:24, ts:13500, rt:true,  price:900 },
    { name:'RTX 3090 (used)',   tier:'flagship',   mult:3.05, tdp:350, vram:24, ts:20000, rt:true,  price:600 },
    { name:'RTX 3080 (used)',   tier:'enthusiast', mult:2.65, tdp:320, vram:10, ts:17600, rt:true,  price:350 },
    { name:'RTX 3070 (used)',   tier:'performance',mult:2.10, tdp:220, vram:8,  ts:12700, rt:true,  price:220 },
    { name:'RTX 3060 Ti (used)',tier:'performance',mult:1.95, tdp:200, vram:8,  ts:11200, rt:true,  price:180 },
    { name:'RTX 2080 Ti (used)',tier:'enthusiast', mult:2.35, tdp:260, vram:11, ts:13800, rt:true,  price:250 },
    { name:'RTX 2070 Super (used)',tier:'performance',mult:1.82,tdp:215,vram:8, ts:10500, rt:true,  price:150 },
    { name:'GTX 1080 Ti (used)',tier:'performance',mult:1.62, tdp:250, vram:11, ts:9800,  rt:false, price:150 },
    { name:'GTX 1070 (used)',   tier:'mainstream', mult:1.05, tdp:150, vram:8,  ts:6100,  rt:false, price:80  },
    { name:'GTX 1060 6GB (used)',tier:'entry',     mult:0.78, tdp:120, vram:6,  ts:4200,  rt:false, price:60  },
    { name:'GTX 1050 Ti (used)',tier:'entry',      mult:0.55, tdp:75,  vram:4,  ts:3100,  rt:false, price:40  },
  ],
  AMD: [
    /* -------- Legacy HD 7000 / R7 / R9 series -------- */
    { name:'Radeon HD 7850',    tier:'entry',      mult:0.42, tdp:130, vram:2,  ts:1900,  rt:false, price:40  },
    { name:'Radeon HD 7870',    tier:'entry',      mult:0.50, tdp:175, vram:2,  ts:2400,  rt:false, price:50  },
    { name:'Radeon R7 370',     tier:'entry',      mult:0.55, tdp:110, vram:4,  ts:2600,  rt:false, price:55  },
    { name:'Radeon R9 380',     tier:'entry',      mult:0.68, tdp:190, vram:4,  ts:3400,  rt:false, price:70  },
    { name:'Radeon R9 390',     tier:'mainstream', mult:0.88, tdp:275, vram:8,  ts:4600,  rt:false, price:90  },
    { name:'Radeon R9 Fury X',  tier:'mainstream', mult:1.05, tdp:275, vram:4,  ts:5900,  rt:false, price:120 },

    /* -------- RX 400 / 500 series (Polaris) -------- */
    { name:'RX 460 4GB',        tier:'entry',      mult:0.55, tdp:75,  vram:4,  ts:2600,  rt:false, price:50  },
    { name:'RX 470 4GB',        tier:'entry',      mult:0.72, tdp:120, vram:4,  ts:3600,  rt:false, price:70  },
    { name:'RX 480 8GB',        tier:'entry',      mult:0.90, tdp:150, vram:8,  ts:4200,  rt:false, price:85  },
    { name:'RX 550 4GB',        tier:'entry',      mult:0.45, tdp:50,  vram:4,  ts:1900,  rt:false, price:60  },
    { name:'RX 560 4GB',        tier:'entry',      mult:0.55, tdp:80,  vram:4,  ts:2600,  rt:false, price:70  },
    { name:'RX 570 4GB',        tier:'entry',      mult:0.75, tdp:150, vram:4,  ts:3800,  rt:false, price:80  },
    { name:'RX 570 8GB',        tier:'entry',      mult:0.78, tdp:150, vram:8,  ts:3900,  rt:false, price:90  },
    { name:'RX 580 4GB',        tier:'entry',      mult:0.85, tdp:185, vram:4,  ts:4200,  rt:false, price:90  },
    { name:'RX 580 8GB',        tier:'entry',      mult:0.95, tdp:185, vram:8,  ts:4400,  rt:false, price:100 },
    { name:'RX 590 8GB',        tier:'mainstream', mult:1.05, tdp:225, vram:8,  ts:5100,  rt:false, price:120 },

    /* -------- RX 5000 series (RDNA 1) -------- */
    { name:'RX 5500 XT 4GB',    tier:'entry',      mult:1.00, tdp:130, vram:4,  ts:4800,  rt:false, price:120 },
    { name:'RX 5500 XT 8GB',    tier:'entry',      mult:1.15, tdp:130, vram:8,  ts:5100,  rt:false, price:140 },
    { name:'RX 5600 XT',        tier:'mainstream', mult:1.45, tdp:150, vram:6,  ts:6800,  rt:false, price:170 },
    { name:'RX 5700',           tier:'mainstream', mult:1.65, tdp:180, vram:8,  ts:7800,  rt:false, price:200 },
    { name:'RX 5700 XT',        tier:'mainstream', mult:1.85, tdp:225, vram:8,  ts:8900,  rt:false, price:230 },

    /* -------- RX 6000 series (RDNA 2) -------- */
    { name:'RX 6400',           tier:'entry',      mult:0.85, tdp:53,  vram:4,  ts:4200,  rt:true,  price:110 },
    { name:'RX 6500 XT 4GB',    tier:'entry',      mult:1.10, tdp:107, vram:4,  ts:5200,  rt:true,  price:130 },
    { name:'RX 6600',           tier:'mainstream', mult:1.75, tdp:132, vram:8,  ts:8300,  rt:true,  price:180 },
    { name:'RX 6600 XT',        tier:'mainstream', mult:1.95, tdp:160, vram:8,  ts:9800,  rt:true,  price:220 },
    { name:'RX 6650 XT',        tier:'mainstream', mult:2.10, tdp:180, vram:8,  ts:10500, rt:true,  price:240 },
    { name:'RX 6700 10GB',      tier:'performance',mult:2.20, tdp:175, vram:10, ts:11200, rt:true,  price:270 },
    { name:'RX 6700 XT',        tier:'performance',mult:2.35, tdp:230, vram:12, ts:12300, rt:true,  price:300 },
    { name:'RX 6750 XT',        tier:'performance',mult:2.55, tdp:250, vram:12, ts:13600, rt:true,  price:350 },
    { name:'RX 6800',           tier:'enthusiast', mult:2.80, tdp:250, vram:16, ts:15900, rt:true,  price:420 },
    { name:'RX 6800 XT',        tier:'enthusiast', mult:3.05, tdp:300, vram:16, ts:17600, rt:true,  price:480 },
    { name:'RX 6900 XT',        tier:'flagship',   mult:3.30, tdp:300, vram:16, ts:18900, rt:true,  price:600 },
    { name:'RX 6950 XT',        tier:'flagship',   mult:3.55, tdp:335, vram:16, ts:20200, rt:true,  price:700 },

    /* -------- RX 7000 series (RDNA 3) -------- */
    { name:'RX 7600',           tier:'mainstream', mult:2.00, tdp:165, vram:8,  ts:10800, rt:true,  price:250 },
    { name:'RX 7600 XT',        tier:'mainstream', mult:2.20, tdp:190, vram:16, ts:11800, rt:true,  price:300 },
    { name:'RX 7700 XT',        tier:'performance',mult:2.65, tdp:245, vram:12, ts:15300, rt:true,  price:400 },
    { name:'RX 7800 XT',        tier:'enthusiast', mult:3.20, tdp:263, vram:16, ts:18600, rt:true,  price:470 },
    { name:'RX 7900 GRE',       tier:'enthusiast', mult:3.55, tdp:260, vram:16, ts:21300, rt:true,  price:530 },
    { name:'RX 7900 XT',        tier:'flagship',   mult:3.95, tdp:315, vram:20, ts:23800, rt:true,  price:650 },
    { name:'RX 7900 XTX',       tier:'flagship',   mult:4.20, tdp:355, vram:24, ts:25700, rt:true,  price:800 },

    /* -------- RX 9000 series (RDNA 4) -------- */
    { name:'RX 9060 XT 8GB',    tier:'mainstream', mult:2.30, tdp:150, vram:8,  ts:13500, rt:true,  price:280 },
    { name:'RX 9060 XT 16GB',   tier:'performance',mult:2.50, tdp:160, vram:16, ts:14500, rt:true,  price:350 },
    { name:'RX 9070',           tier:'performance',mult:3.90, tdp:220, vram:16, ts:24600, rt:true,  price:550 },
    { name:'RX 9070 XT',        tier:'flagship',   mult:4.55, tdp:300, vram:16, ts:28100, rt:true,  price:650 },
    { name:'RX 9070 XTX',       tier:'flagship',   mult:4.90, tdp:330, vram:24, ts:30500, rt:true,  price:850 },

    /* -------- Legacy / used market (real cards) -------- */
    { name:'RX 580 8GB (used)', tier:'entry',      mult:0.95, tdp:185, vram:8,  ts:4400,  rt:false, price:60  },
    { name:'RX 5700 XT (used)', tier:'mainstream', mult:1.85, tdp:225, vram:8,  ts:8900,  rt:false, price:130 },
    { name:'RX 6600 XT (used)', tier:'mainstream', mult:1.95, tdp:160, vram:8,  ts:9800,  rt:true,  price:140 },
    { name:'RX 6700 XT (used)', tier:'performance',mult:2.35, tdp:230, vram:12, ts:12300, rt:true,  price:180 },
    { name:'RX 6800 XT (used)', tier:'enthusiast', mult:3.05, tdp:300, vram:16, ts:17600, rt:true,  price:280 },

    /* -------- Integrated graphics (APU-style ratings) -------- */
    { name:'Radeon Vega 8 (iGPU)',      tier:'entry', mult:0.30, tdp:15, vram:2, ts:900,  rt:false, price:0 },
    { name:'Radeon Vega 11 (iGPU)',     tier:'entry', mult:0.35, tdp:15, vram:2, ts:1100, rt:false, price:0 },
    { name:'Radeon 680M (iGPU)',        tier:'entry', mult:0.55, tdp:15, vram:2, ts:2200, rt:true,  price:0 },
    { name:'Radeon 780M (iGPU)',        tier:'entry', mult:0.68, tdp:15, vram:4, ts:2900, rt:true,  price:0 },
    { name:'Radeon 890M (iGPU)',        tier:'entry', mult:0.78, tdp:15, vram:4, ts:3400, rt:true,  price:0 },
  ],
  Intel: [
    /* -------- Integrated (older) -------- */
    { name:'Intel HD 530 (iGPU)',       tier:'entry', mult:0.18, tdp:15, vram:1, ts:400,  rt:false, price:0 },
    { name:'Intel UHD 630 (iGPU)',      tier:'entry', mult:0.22, tdp:15, vram:1, ts:550,  rt:false, price:0 },
    { name:'Intel Iris Xe 80EU (iGPU)', tier:'entry', mult:0.35, tdp:15, vram:2, ts:1200, rt:false, price:0 },
    { name:'Intel Iris Xe 96EU (iGPU)', tier:'entry', mult:0.42, tdp:15, vram:2, ts:1500, rt:false, price:0 },
    { name:'Intel Arc iGPU (Meteor Lake)', tier:'entry', mult:0.48, tdp:15, vram:2, ts:1800, rt:true, price:0 },
    { name:'Intel Arc iGPU (Lunar Lake)',  tier:'entry', mult:0.62, tdp:17, vram:4, ts:2500, rt:true, price:0 },

    /* -------- Arc Alchemist (A-series) -------- */
    { name:'Arc A310',          tier:'entry',      mult:0.70, tdp:75,  vram:4,  ts:3400,  rt:true,  price:100 },
    { name:'Arc A380',          tier:'entry',      mult:0.85, tdp:75,  vram:6,  ts:4200,  rt:true,  price:120 },
    { name:'Arc A580',          tier:'mainstream', mult:1.50, tdp:185, vram:8,  ts:8400,  rt:true,  price:180 },
    { name:'Arc A750',          tier:'mainstream', mult:1.75, tdp:225, vram:8,  ts:9900,  rt:true,  price:220 },
    { name:'Arc A770 8GB',      tier:'performance',mult:2.00, tdp:225, vram:8,  ts:11100, rt:true,  price:260 },
    { name:'Arc A770 16GB',     tier:'performance',mult:2.05, tdp:225, vram:16, ts:11500, rt:true,  price:300 },

    /* -------- Arc Battlemage (B-series) -------- */
    { name:'Arc B570',          tier:'mainstream', mult:2.10, tdp:150, vram:10, ts:11900, rt:true,  price:220 },
    { name:'Arc B580',          tier:'performance',mult:2.35, tdp:190, vram:12, ts:13400, rt:true,  price:250 },
    { name:'Arc B770',          tier:'enthusiast', mult:3.10, tdp:280, vram:16, ts:17500, rt:true,  price:400 },
  ]
};

const RAMS = [
  /* =========================================================
     DDR3  —  legacy. 4–32 GB.
     ========================================================= */
  { capacity:4,   type:'DDR3', speeds:[1333,1600],                            mult:0.65, tdp:6,  price:15  },
  { capacity:8,   type:'DDR3', speeds:[1333,1600,1866],                       mult:0.72, tdp:8,  price:25  },
  { capacity:16,  type:'DDR3', speeds:[1333,1600,1866,2133],                  mult:0.80, tdp:12, price:45  },
  { capacity:32,  type:'DDR3', speeds:[1333,1600,1866],                       mult:0.86, tdp:20, price:90  },

  /* =========================================================
     DDR4  —  4–128 GB. 2133–4600 MHz.
     ========================================================= */
  { capacity:4,   type:'DDR4', speeds:[2133,2400,2666],                       mult:0.66, tdp:6,  price:18  },
  { capacity:8,   type:'DDR4', speeds:[2133,2400,2666,2800],                  mult:0.78, tdp:9,  price:25  },
  { capacity:8,   type:'DDR4', speeds:[3000,3200,3600],                       mult:0.86, tdp:10, price:32  },
  { capacity:8,   type:'DDR4', speeds:[3600,4000],                            mult:0.90, tdp:10, price:38  },
  { capacity:16,  type:'DDR4', speeds:[2133,2400,2666,2800],                  mult:0.88, tdp:13, price:40  },
  { capacity:16,  type:'DDR4', speeds:[3000,3200,3600],                       mult:1.00, tdp:15, price:50  },
  { capacity:16,  type:'DDR4', speeds:[3600,4000,4266],                       mult:1.06, tdp:15, price:65  },
  { capacity:16,  type:'DDR4', speeds:[4400,4600],                            mult:1.10, tdp:16, price:90  },
  { capacity:32,  type:'DDR4', speeds:[2400,2666,3000],                       mult:1.02, tdp:18, price:75  },
  { capacity:32,  type:'DDR4', speeds:[3200,3600,3800],                       mult:1.10, tdp:18, price:100 },
  { capacity:32,  type:'DDR4', speeds:[4000,4400],                            mult:1.15, tdp:19, price:140 },
  { capacity:64,  type:'DDR4', speeds:[2666,3000,3200],                       mult:1.12, tdp:24, price:180 },
  { capacity:64,  type:'DDR4', speeds:[3200,3600,4000],                       mult:1.20, tdp:24, price:220 },
  { capacity:128, type:'DDR4', speeds:[2666,3000,3200],                       mult:1.22, tdp:36, price:400 },

  /* =========================================================
     DDR5  —  16–256 GB. 4800–8400 MHz.
     ========================================================= */
  { capacity:16,  type:'DDR5', speeds:[4800,5200],                            mult:1.10, tdp:16, price:60  },
  { capacity:16,  type:'DDR5', speeds:[5600,6000],                            mult:1.18, tdp:18, price:80  },
  { capacity:16,  type:'DDR5', speeds:[6000,6400,6800],                       mult:1.24, tdp:18, price:110 },
  { capacity:16,  type:'DDR5', speeds:[7200,7600,8000],                       mult:1.30, tdp:19, price:160 },
  { capacity:32,  type:'DDR5', speeds:[4800,5200,5600],                       mult:1.20, tdp:22, price:100 },
  { capacity:32,  type:'DDR5', speeds:[5600,6000,6400],                       mult:1.28, tdp:22, price:140 },
  { capacity:32,  type:'DDR5', speeds:[6400,6800,7200],                       mult:1.34, tdp:24, price:190 },
  { capacity:32,  type:'DDR5', speeds:[7200,7600,8000],                       mult:1.38, tdp:24, price:260 },
  { capacity:48,  type:'DDR5', speeds:[6000,6400,7200],                       mult:1.36, tdp:26, price:280 },
  { capacity:64,  type:'DDR5', speeds:[4800,5200,5600],                       mult:1.30, tdp:28, price:200 },
  { capacity:64,  type:'DDR5', speeds:[5600,6000,6400],                       mult:1.38, tdp:28, price:260 },
  { capacity:64,  type:'DDR5', speeds:[6400,6800,7200],                       mult:1.44, tdp:30, price:340 },
  { capacity:96,  type:'DDR5', speeds:[5600,6000,6400],                       mult:1.42, tdp:34, price:420 },
  { capacity:128, type:'DDR5', speeds:[4800,5200,5600],                       mult:1.40, tdp:38, price:480 },
  { capacity:128, type:'DDR5', speeds:[5600,6000,6400],                       mult:1.48, tdp:38, price:600 },
  { capacity:192, type:'DDR5', speeds:[5200,5600,6000],                       mult:1.48, tdp:44, price:900 },
  { capacity:256, type:'DDR5', speeds:[5200,5600],                            mult:1.50, tdp:48, price:1400 },

  /* =========================================================
     SO-DIMM / Laptop (for users on prebuilts and laptops)
     ========================================================= */
  { capacity:8,   type:'DDR4-SODIMM', speeds:[2400,2666,3200],                mult:0.82, tdp:8,  price:25  },
  { capacity:16,  type:'DDR4-SODIMM', speeds:[2666,3200],                     mult:0.96, tdp:12, price:40  },
  { capacity:32,  type:'DDR4-SODIMM', speeds:[2666,3200],                     mult:1.06, tdp:16, price:75  },
  { capacity:16,  type:'DDR5-SODIMM', speeds:[4800,5200,5600],                mult:1.14, tdp:16, price:70  },
  { capacity:32,  type:'DDR5-SODIMM', speeds:[5200,5600,6000],                mult:1.24, tdp:20, price:130 },
  { capacity:64,  type:'DDR5-SODIMM', speeds:[5200,5600],                     mult:1.34, tdp:26, price:250 },

  /* =========================================================
     ECC / Workstation / Server
     ========================================================= */
  { capacity:16,  type:'DDR4-ECC', speeds:[2400,2666,3200],                   mult:0.94, tdp:14, price:80  },
  { capacity:32,  type:'DDR4-ECC', speeds:[2666,3200],                        mult:1.04, tdp:18, price:140 },
  { capacity:64,  type:'DDR4-ECC', speeds:[2666,3200],                        mult:1.14, tdp:24, price:280 },
  { capacity:32,  type:'DDR5-ECC', speeds:[4800,5200,5600],                   mult:1.20, tdp:22, price:180 },
  { capacity:64,  type:'DDR5-ECC', speeds:[5200,5600],                        mult:1.32, tdp:28, price:340 },
  { capacity:128, type:'DDR5-ECC', speeds:[5200,5600],                        mult:1.42, tdp:40, price:750 },

  /* =========================================================
     Quad-channel / HEDT
     ========================================================= */
  { capacity:64,  type:'DDR4-Quad', speeds:[3200,3600],                       mult:1.28, tdp:28, price:400 },
  { capacity:128, type:'DDR4-Quad', speeds:[3200,3600],                       mult:1.36, tdp:44, price:800 },
  { capacity:128, type:'DDR5-Quad', speeds:[5600,6000],                       mult:1.50, tdp:48, price:1100 },
  { capacity:256, type:'DDR5-Quad', speeds:[5600],                            mult:1.56, tdp:64, price:2200 },
]

const STORAGE_TYPES = [
  /* =========================================================
     HDDs  —  5400 through 15K RPM
     ========================================================= */
  { name:'HDD 5400 RPM',            family:'HDD',       speed:100,   mult:0.55, tdp:5,  price:30  },
  { name:'HDD 7200 RPM',            family:'HDD',       speed:150,   mult:0.65, tdp:6,  price:40  },
  { name:'HDD 10K RPM',             family:'HDD-Ent',   speed:200,   mult:0.75, tdp:8,  price:100 },
  { name:'HDD 15K RPM',             family:'HDD-Ent',   speed:250,   mult:0.85, tdp:12, price:180 },

  /* =========================================================
     SATA SSDs  —  2.5" and M.2
     ========================================================= */
  { name:'SATA SSD (DRAM-less)',    family:'SATA-SSD',  speed:500,   mult:0.95, tdp:3,  price:35  },
  { name:'SATA SSD (DRAM)',         family:'SATA-SSD',  speed:550,   mult:1.00, tdp:3,  price:50  },
  { name:'SATA SSD (Enterprise)',   family:'SATA-Ent',  speed:550,   mult:1.00, tdp:5,  price:160 },
  { name:'SATA M.2',                family:'SATA-M2',   speed:550,   mult:1.00, tdp:3,  price:45  },

  /* =========================================================
     NVMe  —  Gen3 through Gen5
     ========================================================= */
  { name:'NVMe Gen3 (TLC)',         family:'NVMe-3',    speed:3500,  mult:1.20, tdp:5,  price:55  },
  { name:'NVMe Gen3 (QLC)',         family:'NVMe-3',    speed:2500,  mult:1.10, tdp:4,  price:45  },
  { name:'NVMe Gen4 (TLC)',         family:'NVMe-4',    speed:7000,  mult:1.40, tdp:7,  price:85  },
  { name:'NVMe Gen4 (QLC)',         family:'NVMe-4',    speed:5000,  mult:1.30, tdp:6,  price:65  },
  { name:'NVMe Gen4 (DRAM-less)',   family:'NVMe-4',    speed:4500,  mult:1.25, tdp:5,  price:55  },
  { name:'NVMe Gen5 (TLC)',         family:'NVMe-5',    speed:12000, mult:1.60, tdp:10, price:150 },
  { name:'NVMe Gen5 (QLC)',         family:'NVMe-5',    speed:9000,  mult:1.50, tdp:9,  price:120 },
  { name:'NVMe Gen5 (Ent.)',        family:'NVMe-5-Ent',speed:14000, mult:1.70, tdp:14, price:320 },

  /* =========================================================
     External / Portable
     ========================================================= */
  { name:'USB 3.0 External HDD',    family:'Ext-HDD',   speed:120,   mult:0.60, tdp:8,  price:55  },
  { name:'USB 3.2 External SSD',    family:'Ext-SSD',   speed:1000,  mult:1.05, tdp:4,  price:100 },
  { name:'Thunderbolt Ext. SSD',    family:'TB-SSD',    speed:2800,  mult:1.15, tdp:6,  price:200 },

  /* =========================================================
     Specialty
     ========================================================= */
  { name:'Intel Optane',            family:'Optane',    speed:2500,  mult:1.35, tdp:10, price:280 },
  { name:'SD Card / eMMC',          family:'SD',        speed:100,   mult:0.50, tdp:2,  price:15  },
];

const CAPACITIES = ['64GB','128GB','256GB','512GB','1TB','2TB','4TB','8TB'];

const GAMES = [
  {name:'Cyberpunk 2077',      genre:'RPG',      base:42,  cw:0.22, gw:0.68, rw:0.10, preset:'High', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    store:'https://store.steampowered.com/app/1091500/', color:'#facc15'},
  {name:'Cyberpunk 2077 RT',   genre:'RPG',      base:22,  cw:0.20, gw:0.72, rw:0.08, preset:'High + RT', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    store:'https://store.steampowered.com/app/1091500/', color:'#facc15'},
  {name:'GTA V',               genre:'Open World',base:98, cw:0.35, gw:0.55, rw:0.10, preset:'Very High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    store:'https://store.steampowered.com/app/271590/', color:'#fbbf24'},
  {name:'GTA VI (est.)',       genre:'Open World',base:48, cw:0.28, gw:0.62, rw:0.10, preset:'High', rt:true,
    banner:'https://www.rockstargames.com/VI/_next/static/media/Official_Cover_Art_landscape.12.uu2irr.2_a.jpg',
    store:'https://www.rockstargames.com/VI', color:'#db2777'},
  {name:'Minecraft (vanilla)', genre:'Sandbox',  base:142, cw:0.50, gw:0.40, rw:0.10, preset:'High', rt:false,
    banner:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5CwRF8TPYwMer7vy61EjYHkM0C22gubkg36r3VmOEaiyZbTLMYHA2UcuN&s=10',
    store:'https://www.minecraft.net/en-us', color:'#16a34a'},
  {name:'Minecraft RTX',       genre:'Sandbox',  base:58,  cw:0.30, gw:0.62, rw:0.08, preset:'RTX', rt:true,
    banner:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5CwRF8TPYwMer7vy61EjYHkM0C22gubkg36r3VmOEaiyZbTLMYHA2UcuN&s=10', 
    store:'https://www.minecraft.net/en-us', color:'#16a34a'},
  {name:'Forza Horizon 5',     genre:'Racing',   base:78,  cw:0.25, gw:0.65, rw:0.10, preset:'High', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg',
    store:'https://store.steampowered.com/app/1551360/', color:'#7c3aed'},
  {name:'Roblox',              genre:'Sandbox',  base:188, cw:0.55, gw:0.35, rw:0.10, preset:'High', rt:false,
    banner:'https://ewscripps.brightspotcdn.com/dims4/default/b1ad845/2147483647/strip/true/crop/1487x836+0+24/resize/1280x720!/quality/90/?url=https%3A%2F%2Fewscripps.brightspotcdn.com%2Fed%2Fc8%2Fb63524024c39adc9b4da11f22fff%2Fap168392951809.jpg',
    store:'https://www.roblox.com/', color:'#dc2626'},
  {name:'Valorant',            genre:'FPS',      base:210, cw:0.60, gw:0.30, rw:0.10, preset:'High', rt:false,
    banner:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3zixVODOgyt-YG0pmjldoUyL_1IIPpusyq_50NFg9aA&s=10',
    store:'https://playvalorant.com/en-us/', color:'#ef4444'},
  {name:'Fortnite',            genre:'Battle Royale', base:112, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:true,
    banner:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfuZ9K2bn9IK1qIwDGuHaSAj8qhmfH6yiFRIhuoBvL27fOlSIGWzgvlFY&s=10',
    store:'https://www.fortnite.com/', color:'#8b5cf6'},
  {name:'Fortnite (RT)',       genre:'Battle Royale', base:62, cw:0.30, gw:0.62, rw:0.08, preset:'High + RT', rt:true,
    banner:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg0eLJPXG98D7gDUGp3QdqjOcLpRtxgicoQuxwUpAFabrawRBIrgPOaJU&s=10',
    store:'https://www.fortnite.com/', color:'#8b5cf6'},
  {name:'Call of Duty: Warzone',genre:'Battle Royale', base:76, cw:0.30, gw:0.60, rw:0.10, preset:'Medium', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1962663/header.jpg',
    store:'https://store.steampowered.com/app/1962663/', color:'#3f6212'},
  {name:'Call of Duty: MW3',   genre:'FPS',      base:92,  cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg',
    store:'https://store.steampowered.com/app/1938090/', color:'#166534'},
  {name:'Elden Ring',          genre:'Action RPG',base:58, cw:0.25, gw:0.65, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    store:'https://store.steampowered.com/app/1245620/', color:'#ca8a04'},
  {name:'Red Dead Redemption 2',genre:'Open World',base:64, cw:0.25, gw:0.65, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
    store:'https://store.steampowered.com/app/1174180/', color:'#b91c1c'},
  {name:'Apex Legends',        genre:'Battle Royale', base:124, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
    store:'https://store.steampowered.com/app/1172470/', color:'#dc2626'},
  {name:'Rocket League',       genre:'Sports',   base:196, cw:0.45, gw:0.45, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg',
    store:'https://store.steampowered.com/app/252950/', color:'#06b6d4'},
  {name:'The Witcher 3',       genre:'Action RPG',base:72, cw:0.25, gw:0.65, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
    store:'https://store.steampowered.com/app/292030/', color:'#a16207'},
  {name:'The Witcher 3 (RT)',  genre:'Action RPG',base:38, cw:0.22, gw:0.70, rw:0.08, preset:'High + RT', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
    store:'https://store.steampowered.com/app/292030/', color:'#a16207'},
  {name:'CS2',                 genre:'FPS',      base:240, cw:0.50, gw:0.40, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    store:'https://store.steampowered.com/app/730/', color:'#f59e0b'},
  {name:'Dota 2',              genre:'MOBA',     base:180, cw:0.50, gw:0.40, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    store:'https://store.steampowered.com/app/570/', color:'#b91c1c'},
  {name:'League of Legends',   genre:'MOBA',     base:200, cw:0.55, gw:0.35, rw:0.10, preset:'High', rt:false,
    banner:'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg',
    store:'https://www.leagueoflegends.com/en-us/', color:'#3b82f6'},
  {name:'Overwatch 2',         genre:'FPS',      base:150, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/2357570/header.jpg',
    store:'https://store.steampowered.com/app/2357570/', color:'#f97316'},
  {name:'PUBG',                genre:'Battle Royale', base:88, cw:0.35, gw:0.55, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg',
    store:'https://store.steampowered.com/app/578080/', color:'#ca8a04'},
  {name:'Rainbow Six Siege',   genre:'FPS',      base:180, cw:0.45, gw:0.45, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg',
    store:'https://store.steampowered.com/app/359550/', color:'#1e40af'},
  {name:'Starfield',           genre:'RPG',      base:48,  cw:0.30, gw:0.60, rw:0.10, preset:'Medium', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',
    store:'https://store.steampowered.com/app/1716740/', color:'#0c4a6e'},
  {name:'Baldur\'s Gate 3',    genre:'RPG',      base:82,  cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
    store:'https://store.steampowered.com/app/1086940/', color:'#a16207'},
  {name:'Hogwarts Legacy',     genre:'Action RPG',base:58, cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',
    store:'https://store.steampowered.com/app/990080/', color:'#78350f'},
  {name:'Diablo IV',           genre:'ARPG',     base:118, cw:0.35, gw:0.55, rw:0.10, preset:'High', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/header.jpg',
    store:'https://store.steampowered.com/app/2344520/', color:'#7f1d1d'},
  {name:'Escape from Tarkov',  genre:'FPS',      base:78,  cw:0.45, gw:0.45, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.akamai.steamstatic.com/steam/apps/244160/header.jpg',
    store:'https://www.escapefromtarkov.com/', color:'#525252'},
  {name:'Hunt: Showdown',      genre:'FPS',      base:96,  cw:0.35, gw:0.55, rw:0.10, preset:'High', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/594650/header.jpg',
    store:'https://store.steampowered.com/app/594650/', color:'#78350f'},
  {name:'F1 24',               genre:'Racing',   base:104, cw:0.28, gw:0.62, rw:0.10, preset:'High', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/2488620/header.jpg',
    store:'https://store.steampowered.com/app/2488620/', color:'#dc2626'},
  {name:'Resident Evil 4',     genre:'Survival', base:88,  cw:0.28, gw:0.62, rw:0.10, preset:'High', rt:true,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg',
    store:'https://store.steampowered.com/app/2050650/', color:'#7f1d1d'},
  {name:'God of War',          genre:'Action',   base:76,  cw:0.28, gw:0.62, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg',
    store:'https://store.steampowered.com/app/1593500/', color:'#a3a3a3'},
  {name:'Horizon Zero Dawn',   genre:'Action RPG',base:68, cw:0.25, gw:0.65, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg',
    store:'https://store.steampowered.com/app/1151640/', color:'#ea580c'},
  {name:'Death Stranding',     genre:'Adventure',base:98,  cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg',
    store:'https://store.steampowered.com/app/1190460/', color:'#0ea5e9'},
  {name:'Microsoft Flight Sim',genre:'Sim',      base:52,  cw:0.55, gw:0.35, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1250410/header.jpg',
    store:'https://store.steampowered.com/app/1250410/', color:'#0891b2'},
  {name:'Cities: Skylines II', genre:'Sim',      base:38,  cw:0.60, gw:0.30, rw:0.10, preset:'Medium', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/949230/header.jpg',
    store:'https://store.steampowered.com/app/949230/', color:'#0891b2'},
  {name:'Total War: Warhammer III',genre:'Strategy', base:74, cw:0.55, gw:0.35, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1142710/header.jpg',
    store:'https://store.steampowered.com/app/1142710/', color:'#7f1d1d'},
  {name:'Civilization VI',     genre:'Strategy', base:112, cw:0.60, gw:0.30, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg',
    store:'https://store.steampowered.com/app/289070/', color:'#0d9488'},
  {name:'Stellaris',           genre:'Strategy', base:96,  cw:0.65, gw:0.25, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/281990/header.jpg',
    store:'https://store.steampowered.com/app/281990/', color:'#1e3a8a'},
  {name:'Rust',                genre:'Survival', base:88,  cw:0.35, gw:0.55, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg',
    store:'https://store.steampowered.com/app/252490/', color:'#dc2626'},
  {name:'Destiny 2',           genre:'FPS',      base:132, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg',
    store:'https://store.steampowered.com/app/1085660/', color:'#7c3aed'},
  {name:'Warframe',            genre:'Action',   base:158, cw:0.45, gw:0.45, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg',
    store:'https://store.steampowered.com/app/230410/', color:'#0891b2'},
  {name:'Monster Hunter: World',genre:'Action RPG',base:82, cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg',
    store:'https://store.steampowered.com/app/582010/', color:'#166534'},
  {name:'Palworld',            genre:'Survival', base:92,  cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg',
    store:'https://store.steampowered.com/app/1623730/', color:'#0ea5e9'},
  {name:'Helldivers 2',        genre:'Co-op',    base:78,  cw:0.35, gw:0.55, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg',
    store:'https://store.steampowered.com/app/553850/', color:'#0891b2'},
  {name:'Deep Rock Galactic',  genre:'Co-op',    base:138, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://cdn.cloudflare.steamstatic.com/steam/apps/548430/header.jpg',
    store:'https://store.steampowered.com/app/548430/', color:'#ea580c'},

  /* -------- BATCH 2: 42 more games -------- */
  {name:'Halo Infinite',       genre:'FPS',      base:118, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1240440/header.jpg',
    store:'https://store.steampowered.com/app/1240440/', color:'#0ea5e9'},
  {name:'Halo: MCC',           genre:'FPS',      base:180, cw:0.45, gw:0.45, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/976730/header.jpg',
    store:'https://store.steampowered.com/app/976730/', color:'#0284c7'},
  {name:'Battlefield 2042',    genre:'FPS',      base:96,  cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1517290/header.jpg',
    store:'https://store.steampowered.com/app/1517290/', color:'#0891b2'},
  {name:'Battlefield V',       genre:'FPS',      base:112, cw:0.32, gw:0.58, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1238840/header.jpg',
    store:'https://store.steampowered.com/app/1238840/', color:'#0891b2'},
  {name:'Battlefield 1',       genre:'FPS',      base:138, cw:0.35, gw:0.55, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1238860/header.jpg',
    store:'https://store.steampowered.com/app/1238860/', color:'#0891b2'},
  {name:'Titanfall 2',         genre:'FPS',      base:158, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1237970/header.jpg',
    store:'https://store.steampowered.com/app/1237970/', color:'#7c3aed'},
  {name:'DOOM Eternal',        genre:'FPS',      base:164, cw:0.35, gw:0.55, rw:0.10, preset:'Ultra', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/782330/header.jpg',
    store:'https://store.steampowered.com/app/782330/', color:'#dc2626'},
  {name:'DOOM (2016)',         genre:'FPS',      base:172, cw:0.32, gw:0.58, rw:0.10, preset:'Ultra', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/379720/header.jpg',
    store:'https://store.steampowered.com/app/379720/', color:'#dc2626'},
  {name:'Quake Champions',     genre:'FPS',      base:198, cw:0.45, gw:0.45, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/611500/header.jpg',
    store:'https://store.steampowered.com/app/611500/', color:'#7f1d1d'},
  {name:'Path of Exile',       genre:'ARPG',     base:132, cw:0.45, gw:0.45, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/238960/header.jpg',
    store:'https://store.steampowered.com/app/238960/', color:'#7f1d1d'},
  {name:'Path of Exile 2',     genre:'ARPG',     base:98,  cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/2694490/header.jpg',
    store:'https://store.steampowered.com/app/2694490/', color:'#7f1d1d'},
  {name:'Last Epoch',          genre:'ARPG',     base:118, cw:0.42, gw:0.48, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/899770/header.jpg',
    store:'https://store.steampowered.com/app/899770/', color:'#0d9488'},
  {name:'Grim Dawn',           genre:'ARPG',     base:142, cw:0.45, gw:0.45, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/219990/header.jpg',
    store:'https://store.steampowered.com/app/219990/', color:'#78350f'},
  {name:'New World',           genre:'MMO',      base:98,  cw:0.42, gw:0.48, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1063730/header.jpg',
    store:'https://store.steampowered.com/app/1063730/', color:'#b91c1c'},
  {name:'Fallout 4',           genre:'RPG',      base:112, cw:0.35, gw:0.55, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg',
    store:'https://store.steampowered.com/app/377160/', color:'#166534'},
  {name:'Fallout 76',          genre:'RPG',      base:88,  cw:0.38, gw:0.52, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1151340/header.jpg',
    store:'https://store.steampowered.com/app/1151340/', color:'#166534'},
  {name:'Skyrim SE',           genre:'RPG',      base:142, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg',
    store:'https://store.steampowered.com/app/489830/', color:'#1e3a8a'},
  {name:'Assassin\'s Creed Valhalla',genre:'Open World',base:78,cw:0.30,gw:0.60,rw:0.10,preset:'High',rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/2208920/header.jpg',
    store:'https://store.steampowered.com/app/2208920/', color:'#7f1d1d'},
  {name:'Far Cry 6',           genre:'Open World',base:92,cw:0.30,gw:0.60,rw:0.10,preset:'High',rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/2369390/header.jpg',
    store:'https://store.steampowered.com/app/2369390/', color:'#dc2626'},
  {name:'Ghost of Tsushima',   genre:'Action',   base:94,  cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg',
    store:'https://store.steampowered.com/app/2215430/', color:'#b91c1c'},
  {name:'Spider-Man Remastered',genre:'Action',  base:102, cw:0.32, gw:0.58, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg',
    store:'https://store.steampowered.com/app/1817070/', color:'#dc2626'},
  {name:'Spider-Man Miles Morales',genre:'Action',base:96,cw:0.32,gw:0.58,rw:0.10,preset:'High',rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1817190/header.jpg',
    store:'https://store.steampowered.com/app/1817190/', color:'#dc2626'},
  {name:'Ratchet & Clank',     genre:'Action',   base:88,  cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1895880/header.jpg',
    store:'https://store.steampowered.com/app/1895880/', color:'#7c3aed'},
  {name:'The Last of Us Part I',genre:'Action',  base:66,  cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg',
    store:'https://store.steampowered.com/app/1888930/', color:'#166534'},
  {name:'Sekiro',              genre:'Action RPG',base:88, cw:0.32, gw:0.58, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg',
    store:'https://store.steampowered.com/app/814380/', color:'#7f1d1d'},
  {name:'Dark Souls III',      genre:'Action RPG',base:96, cw:0.32, gw:0.58, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg',
    store:'https://store.steampowered.com/app/374320/', color:'#78350f'},
  {name:'Nioh 2',              genre:'Action RPG',base:96, cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1325200/header.jpg',
    store:'https://store.steampowered.com/app/1325200/', color:'#7f1d1d'},
  {name:'Lies of P',           genre:'Action RPG',base:88, cw:0.28, gw:0.62, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1627720/header.jpg',
    store:'https://store.steampowered.com/app/1627720/', color:'#0f172a'},
  {name:'Black Myth: Wukong',  genre:'Action RPG',base:58, cw:0.28, gw:0.62, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg',
    store:'https://store.steampowered.com/app/2358720/', color:'#ca8a04'},
  {name:'Armored Core VI',     genre:'Action',   base:98,  cw:0.35, gw:0.55, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1888160/header.jpg',
    store:'https://store.steampowered.com/app/1888160/', color:'#7f1d1d'},
  {name:'Days Gone',           genre:'Survival', base:98,  cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1259420/header.jpg',
    store:'https://store.steampowered.com/app/1259420/', color:'#166534'},
  {name:'Uncharted Legacy',    genre:'Action',   base:88,  cw:0.30, gw:0.60, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1659420/header.jpg',
    store:'https://store.steampowered.com/app/1659420/', color:'#78350f'},
  {name:'Control',             genre:'Action',   base:82,  cw:0.28, gw:0.62, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/870780/header.jpg',
    store:'https://store.steampowered.com/app/870780/', color:'#dc2626'},
  {name:'Alan Wake 2',         genre:'Survival', base:48,  cw:0.25, gw:0.65, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/2758120/header.jpg',
    store:'https://store.steampowered.com/app/1087100/', color:'#0f172a'},
  {name:'Star Wars Jedi: Survivor',genre:'Action',base:64,cw:0.30,gw:0.60,rw:0.10,preset:'High',rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1774580/header.jpg',
    store:'https://store.steampowered.com/app/1774580/', color:'#0891b2'},
  {name:'Star Wars Jedi: Fallen Order',genre:'Action',base:96,cw:0.30,gw:0.60,rw:0.10,preset:'High',rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1172380/header.jpg',
    store:'https://store.steampowered.com/app/1172380/', color:'#0891b2'},
  {name:'Back 4 Blood',        genre:'Co-op',    base:118, cw:0.38, gw:0.52, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/924970/header.jpg',
    store:'https://store.steampowered.com/app/924970/', color:'#166534'},
  {name:'Payday 2',            genre:'Co-op',    base:172, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/218620/header.jpg',
    store:'https://store.steampowered.com/app/218620/', color:'#78350f'},
  {name:'Payday 3',            genre:'Co-op',    base:88,  cw:0.35, gw:0.55, rw:0.10, preset:'Medium', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1272080/header.jpg',
    store:'https://store.steampowered.com/app/1272080/', color:'#78350f'},
  {name:'Vermintide 2',        genre:'Co-op',    base:128, cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/552500/header.jpg',
    store:'https://store.steampowered.com/app/552500/', color:'#7f1d1d'},
  {name:'Darktide',            genre:'Co-op',    base:82,  cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:true,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/1361210/header.jpg',
    store:'https://store.steampowered.com/app/1361210/', color:'#7f1d1d'},
  {name:'Throne and Liberty',  genre:'MMO',      base:86,  cw:0.40, gw:0.50, rw:0.10, preset:'High', rt:false,
    banner:'https://shared.steamstatic.com/store_item_assets/steam/apps/2429640/header.jpg',
    store:'https://store.steampowered.com/app/2429640/', color:'#7c3aed'},
];

const CASES = [
  /* =========================================================
     SFF / ITX  —  small form factor
     ========================================================= */
  { name:'Cooler Master NR200',             brand:'Cooler Master', form:'ITX',    maxGpu:330, maxCooler:155, maxPsu:130, bays2_5:3, bays3_5:1, frontFans:0, style:'sff',      price:80  },
  { name:'Cooler Master NR200P',            brand:'Cooler Master', form:'ITX',    maxGpu:330, maxCooler:155, maxPsu:130, bays2_5:3, bays3_5:1, frontFans:0, style:'sff',      price:100 },
  { name:'Cooler Master NR200P Max',        brand:'Cooler Master', form:'ITX',    maxGpu:336, maxCooler:280, maxPsu:850, bays2_5:4, bays3_5:0, frontFans:0, style:'sff',      price:350 },
  { name:'Fractal Design Node 304',         brand:'Fractal',       form:'ITX',    maxGpu:310, maxCooler:165, maxPsu:160, bays2_5:0, bays3_5:6, frontFans:0, style:'sff',      price:100 },
  { name:'Fractal Design Ridge',            brand:'Fractal',       form:'ITX',    maxGpu:325, maxCooler:70,  maxPsu:130, bays2_5:0, bays3_5:4, frontFans:0, style:'sff',      price:180 },
  { name:'Fractal Design Terra',            brand:'Fractal',       form:'ITX',    maxGpu:322, maxCooler:77,  maxPsu:130, bays2_5:2, bays3_5:0, frontFans:0, style:'sff',      price:180 },
  { name:'Lian Li Q58',                     brand:'Lian Li',       form:'ITX',    maxGpu:320, maxCooler:135, maxPsu:130, bays2_5:2, bays3_5:0, frontFans:0, style:'sff',      price:130 },
  { name:'Lian Li A4-H2O',                  brand:'Lian Li',       form:'ITX',    maxGpu:322, maxCooler:75,  maxPsu:130, bays2_5:2, bays3_5:0, frontFans:0, style:'sff',      price:180 },
  { name:'Lian Li TU150',                   brand:'Lian Li',       form:'ITX',    maxGpu:320, maxCooler:165, maxPsu:160, bays2_5:2, bays3_5:1, frontFans:0, style:'sff',      price:110 },
  { name:'NZXT H1 v2',                      brand:'NZXT',          form:'ITX',    maxGpu:324, maxCooler:0,   maxPsu:750, bays2_5:2, bays3_5:0, frontFans:0, style:'sff',      price:200 },
  { name:'Phanteks Evolv Shift XT',         brand:'Phanteks',      form:'ITX',    maxGpu:324, maxCooler:75,  maxPsu:130, bays2_5:2, bays3_5:0, frontFans:0, style:'sff',      price:180 },
  { name:'Silverstone SG13',                brand:'Silverstone',   form:'ITX',    maxGpu:266, maxCooler:61,  maxPsu:150, bays2_5:2, bays3_5:1, frontFans:0, style:'sff',      price:60  },
  { name:'Silverstone SG14',                brand:'Silverstone',   form:'ITX',    maxGpu:210, maxCooler:82,  maxPsu:150, bays2_5:2, bays3_5:2, frontFans:0, style:'sff',      price:100 },
  { name:'Cooler Master Elite 130',         brand:'Cooler Master', form:'ITX',    maxGpu:343, maxCooler:65,  maxPsu:160, bays2_5:2, bays3_5:2, frontFans:0, style:'sff',      price:60  },
  { name:'Thermaltake Core V1',             brand:'Thermaltake',   form:'ITX',    maxGpu:285, maxCooler:140, maxPsu:160, bays2_5:2, bays3_5:2, frontFans:0, style:'sff',      price:65  },

  /* =========================================================
     mATX  —  compact mid
     ========================================================= */
  { name:'Fractal Design Pop Mini Air',     brand:'Fractal',       form:'mATX',   maxGpu:355, maxCooler:170, maxPsu:180, bays2_5:2, bays3_5:2, frontFans:2, style:'matx',     price:90  },
  { name:'Fractal Design Pop Mini Silent',  brand:'Fractal',       form:'mATX',   maxGpu:355, maxCooler:170, maxPsu:180, bays2_5:2, bays3_5:2, frontFans:2, style:'matx',     price:90  },
  { name:'Cooler Master Q300L',             brand:'Cooler Master', form:'mATX',   maxGpu:360, maxCooler:159, maxPsu:160, bays2_5:2, bays3_5:1, frontFans:2, style:'matx',     price:60  },
  { name:'Cooler Master Q500L',             brand:'Cooler Master', form:'mATX',   maxGpu:360, maxCooler:160, maxPsu:180, bays2_5:2, bays3_5:2, frontFans:2, style:'matx',     price:70  },
  { name:'Lian Li O11 Air Mini',            brand:'Lian Li',       form:'mATX',   maxGpu:380, maxCooler:170, maxPsu:200, bays2_5:4, bays3_5:2, frontFans:2, style:'matx',     price:130 },
  { name:'NZXT H400',                       brand:'NZXT',          form:'mATX',   maxGpu:381, maxCooler:164, maxPsu:200, bays2_5:3, bays3_5:1, frontFans:2, style:'matx',     price:80  },
  { name:'Thermaltake Versa H17',           brand:'Thermaltake',   form:'mATX',   maxGpu:350, maxCooler:155, maxPsu:160, bays2_5:2, bays3_5:2, frontFans:1, style:'matx',     price:50  },
  { name:'Corsair 280X',                    brand:'Corsair',       form:'mATX',   maxGpu:300, maxCooler:160, maxPsu:180, bays2_5:3, bays3_5:2, frontFans:2, style:'matx',     price:100 },

  /* =========================================================
     ATX Mid-Tower  —  the sweet spot
     ========================================================= */
  { name:'NZXT H510',                       brand:'NZXT',          form:'ATX',    maxGpu:381, maxCooler:165, maxPsu:180, bays2_5:3, bays3_5:2, frontFans:2, style:'atx',      price:70  },
  { name:'NZXT H510 Flow',                  brand:'NZXT',          form:'ATX',    maxGpu:381, maxCooler:165, maxPsu:180, bays2_5:3, bays3_5:2, frontFans:2, style:'atx',      price:85  },
  { name:'NZXT H5 Flow',                    brand:'NZXT',          form:'ATX',    maxGpu:365, maxCooler:165, maxPsu:200, bays2_5:2, bays3_5:1, frontFans:2, style:'atx',      price:95  },
  { name:'NZXT H5 Elite',                   brand:'NZXT',          form:'ATX',    maxGpu:365, maxCooler:165, maxPsu:200, bays2_5:2, bays3_5:1, frontFans:2, style:'atx',      price:120 },
  { name:'NZXT H7 Flow',                    brand:'NZXT',          form:'ATX',    maxGpu:400, maxCooler:185, maxPsu:200, bays2_5:4, bays3_5:2, frontFans:3, style:'atx',      price:130 },
  { name:'NZXT H7 Elite',                   brand:'NZXT',          form:'ATX',    maxGpu:400, maxCooler:185, maxPsu:200, bays2_5:4, bays3_5:2, frontFans:3, style:'atx',      price:170 },
  { name:'Fractal Design Meshify 2',        brand:'Fractal',       form:'ATX',    maxGpu:461, maxCooler:185, maxPsu:250, bays2_5:4, bays3_5:6, frontFans:3, style:'atx',      price:160 },
  { name:'Fractal Design Meshify 2 Compact',brand:'Fractal',       form:'ATX',    maxGpu:360, maxCooler:169, maxPsu:200, bays2_5:4, bays3_5:2, frontFans:3, style:'atx',      price:130 },
  { name:'Fractal Design North',            brand:'Fractal',       form:'ATX',    maxGpu:355, maxCooler:170, maxPsu:255, bays2_5:2, bays3_5:3, frontFans:2, style:'atx',      price:140 },
  { name:'Fractal Design North XL',         brand:'Fractal',       form:'ATX',    maxGpu:413, maxCooler:185, maxPsu:290, bays2_5:2, bays3_5:3, frontFans:3, style:'atx',      price:180 },
  { name:'Lian Li Lancool 216',             brand:'Lian Li',       form:'ATX',    maxGpu:392, maxCooler:180, maxPsu:210, bays2_5:4, bays3_5:2, frontFans:2, style:'atx',      price:100 },
  { name:'Lian Li Lancool III',             brand:'Lian Li',       form:'ATX',    maxGpu:435, maxCooler:187, maxPsu:240, bays2_5:6, bays3_5:4, frontFans:3, style:'atx',      price:140 },
  { name:'Lian Li O11 Dynamic',             brand:'Lian Li',       form:'ATX',    maxGpu:420, maxCooler:167, maxPsu:200, bays2_5:6, bays3_5:0, frontFans:0, style:'atx',      price:150 },
  { name:'Lian Li O11 Dynamic EVO',         brand:'Lian Li',       form:'ATX',    maxGpu:425, maxCooler:167, maxPsu:210, bays2_5:6, bays3_5:0, frontFans:0, style:'atx',      price:160 },
  { name:'Corsair 4000D Airflow',           brand:'Corsair',       form:'ATX',    maxGpu:360, maxCooler:170, maxPsu:180, bays2_5:2, bays3_5:2, frontFans:2, style:'atx',      price:95  },
  { name:'Corsair 4000D RGB',               brand:'Corsair',       form:'ATX',    maxGpu:360, maxCooler:170, maxPsu:180, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:130 },
  { name:'Corsair 5000D Airflow',           brand:'Corsair',       form:'ATX',    maxGpu:420, maxCooler:170, maxPsu:225, bays2_5:4, bays3_5:2, frontFans:3, style:'atx',      price:160 },
  { name:'Corsair 5000D RGB',               brand:'Corsair',       form:'ATX',    maxGpu:420, maxCooler:170, maxPsu:225, bays2_5:4, bays3_5:2, frontFans:3, style:'atx',      price:200 },
  { name:'Cooler Master TD500 Mesh',        brand:'Cooler Master', form:'ATX',    maxGpu:410, maxCooler:165, maxPsu:180, bays2_5:4, bays3_5:2, frontFans:3, style:'atx',      price:100 },
  { name:'Cooler Master TD500 Mesh V2',     brand:'Cooler Master', form:'ATX',    maxGpu:410, maxCooler:165, maxPsu:180, bays2_5:4, bays3_5:2, frontFans:3, style:'atx',      price:120 },
  { name:'Phanteks Eclipse P400A',          brand:'Phanteks',      form:'ATX',    maxGpu:420, maxCooler:160, maxPsu:220, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:90  },
  { name:'Phanteks Eclipse G360A',          brand:'Phanteks',      form:'ATX',    maxGpu:400, maxCooler:162, maxPsu:200, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:100 },
  { name:'Phanteks NV5',                    brand:'Phanteks',      form:'ATX',    maxGpu:440, maxCooler:180, maxPsu:250, bays2_5:2, bays3_5:2, frontFans:0, style:'showcase', price:130 },
  { name:'be quiet! Pure Base 500DX',       brand:'be quiet!',     form:'ATX',    maxGpu:369, maxCooler:190, maxPsu:225, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:110 },
  { name:'be quiet! Pure Base 500FX',       brand:'be quiet!',     form:'ATX',    maxGpu:369, maxCooler:190, maxPsu:225, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:150 },
  { name:'be quiet! Dark Base 700',         brand:'be quiet!',     form:'ATX',    maxGpu:420, maxCooler:185, maxPsu:230, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:180 },
  { name:'Antec NX410',                     brand:'Antec',         form:'ATX',    maxGpu:360, maxCooler:165, maxPsu:200, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:80  },
  { name:'Deepcool CH560',                  brand:'Deepcool',      form:'ATX',    maxGpu:380, maxCooler:175, maxPsu:230, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:90  },
  { name:'Deepcool Matrexx 55',             brand:'Deepcool',      form:'ATX',    maxGpu:370, maxCooler:165, maxPsu:200, bays2_5:2, bays3_5:2, frontFans:3, style:'atx',      price:70  },

  /* =========================================================
     ATX Full-Tower / E-ATX
     ========================================================= */
  { name:'Corsair 7000D Airflow',           brand:'Corsair',       form:'E-ATX',  maxGpu:420, maxCooler:190, maxPsu:225, bays2_5:6, bays3_5:6, frontFans:3, style:'full',     price:250 },
  { name:'Corsair 6500X',                   brand:'Corsair',       form:'ATX',    maxGpu:400, maxCooler:180, maxPsu:250, bays2_5:4, bays3_5:2, frontFans:0, style:'showcase', price:200 },
  { name:'Fractal Design Torrent',          brand:'Fractal',       form:'E-ATX',  maxGpu:461, maxCooler:188, maxPsu:230, bays2_5:4, bays3_5:4, frontFans:2, style:'full',     price:230 },
  { name:'Fractal Design Torrent Compact',  brand:'Fractal',       form:'ATX',    maxGpu:461, maxCooler:174, maxPsu:200, bays2_5:2, bays3_5:2, frontFans:2, style:'full',     price:160 },
  { name:'Lian Li O11 Dynamic XL',          brand:'Lian Li',       form:'E-ATX',  maxGpu:446, maxCooler:167, maxPsu:210, bays2_5:8, bays3_5:4, frontFans:0, style:'full',     price:200 },
  { name:'Lian Li V3000 Plus',              brand:'Lian Li',       form:'E-ATX',  maxGpu:589, maxCooler:200, maxPsu:300, bays2_5:4, bays3_5:8, frontFans:0, style:'full',     price:500 },
  { name:'Thermaltake View 91',             brand:'Thermaltake',   form:'E-ATX',  maxGpu:600, maxCooler:200, maxPsu:280, bays2_5:10,bays3_5:8, frontFans:4, style:'full',     price:400 },
  { name:'Phanteks Enthoo Pro 2',           brand:'Phanteks',      form:'E-ATX',  maxGpu:435, maxCooler:190, maxPsu:280, bays2_5:4, bays3_5:8, frontFans:3, style:'full',     price:200 },
  { name:'Cooler Master Cosmos C700M',      brand:'Cooler Master', form:'E-ATX',  maxGpu:490, maxCooler:198, maxPsu:280, bays2_5:4, bays3_5:4, frontFans:3, style:'full',     price:450 },

  /* =========================================================
     Showcase / Open  —  display builds
     ========================================================= */
  { name:'Thermaltake Core P3',             brand:'Thermaltake',   form:'ATX',    maxGpu:470, maxCooler:180, maxPsu:200, bays2_5:3, bays3_5:1, frontFans:0, style:'showcase', price:130 },
  { name:'Thermaltake Core P5',             brand:'Thermaltake',   form:'ATX',    maxGpu:320, maxCooler:180, maxPsu:200, bays2_5:3, bays3_5:2, frontFans:0, style:'showcase', price:200 },
  { name:'Cougar Conquer 2',                brand:'Cougar',        form:'ATX',    maxGpu:430, maxCooler:180, maxPsu:200, bays2_5:4, bays3_5:2, frontFans:0, style:'showcase', price:250 },
  { name:'Antec Cannon',                    brand:'Antec',         form:'ATX',    maxGpu:400, maxCooler:180, maxPsu:200, bays2_5:4, bays3_5:2, frontFans:0, style:'showcase', price:300 },
];

const COOLERS = [
  /* =========================================================
     STOCK COOLERS  —  bundled with CPUs
     ========================================================= */
  { name:'Intel Stock Cooler (LGA1200)', style:'stock',      maxTdp:65,  height:50,  price:0   },
  { name:'Intel Stock Cooler (LGA1700)', style:'stock',      maxTdp:65,  height:47,  price:0   },
  { name:'Intel Stock Cooler (LGA1851)', style:'stock',      maxTdp:65,  height:47,  price:0   },
  { name:'AMD Wraith Stealth',           style:'stock',      maxTdp:65,  height:65,  price:0   },
  { name:'AMD Wraith Spire',             style:'stock',      maxTdp:95,  height:70,  price:0   },
  { name:'AMD Wraith Prism',             style:'stock',      maxTdp:105, height:82,  price:35  },
  { name:'AMD Wraith Max',               style:'stock',      maxTdp:125, height:85,  price:50  },

  /* =========================================================
     LOW-PROFILE AIR  —  SFF / ITX builds
     ========================================================= */
  { name:'Noctua NH-L9i',                style:'air-low',    maxTdp:65,  height:37,  price:50  },
  { name:'Noctua NH-L9a-AM4',            style:'air-low',    maxTdp:65,  height:37,  price:50  },
  { name:'Noctua NH-L9x65',              style:'air-low',    maxTdp:95,  height:65,  price:60  },
  { name:'Noctua NH-L12S',               style:'air-low',    maxTdp:95,  height:70,  price:60  },
  { name:'Thermalright AXP90-X47',       style:'air-low',    maxTdp:100, height:47,  price:35  },
  { name:'Thermalright AXP120-X67',      style:'air-low',    maxTdp:120, height:67,  price:45  },
  { name:'be quiet! Shadow Rock LP',     style:'air-low',    maxTdp:130, height:75,  price:50  },

  /* =========================================================
     SINGLE-TOWER AIR  —  mainstream
     ========================================================= */
  { name:'Cooler Master Hyper 212',      style:'air-single', maxTdp:120, height:159, price:35  },
  { name:'Cooler Master Hyper 212 Black',style:'air-single', maxTdp:150, height:159, price:45  },
  { name:'Thermalright Assassin X120',   style:'air-single', maxTdp:150, height:154, price:35  },
  { name:'Thermalright Peerless Assassin',style:'air-single',maxTdp:180, height:155, price:45  },
  { name:'be quiet! Pure Rock 2',        style:'air-single', maxTdp:150, height:155, price:45  },
  { name:'be quiet! Pure Rock Slim 2',   style:'air-single', maxTdp:130, height:130, price:35  },
  { name:'Arctic Freezer 34 eSports',    style:'air-single', maxTdp:160, height:157, price:45  },
  { name:'Arctic Freezer 36',            style:'air-single', maxTdp:200, height:159, price:35  },
  { name:'Scythe Fuma 3',                style:'air-single', maxTdp:200, height:155, price:55  },
  { name:'Noctua NH-U12S',               style:'air-single', maxTdp:180, height:158, price:70  },
  { name:'Noctua NH-U12S Redux',         style:'air-single', maxTdp:150, height:158, price:55  },
  { name:'Noctua NH-U14S',               style:'air-single', maxTdp:220, height:165, price:80  },

  /* =========================================================
     DUAL-TOWER AIR  —  high-end air
     ========================================================= */
  { name:'Thermalright Phantom Spirit 120',style:'air-dual', maxTdp:245, height:157, price:45  },
  { name:'Thermalright Frost Commander',  style:'air-dual',  maxTdp:250, height:158, price:60  },
  { name:'Deepcool AK620',                style:'air-dual',  maxTdp:260, height:160, price:65  },
  { name:'Deepcool Assassin IV',          style:'air-dual',  maxTdp:280, height:164, price:100 },
  { name:'Noctua NH-D15',                 style:'air-dual',  maxTdp:250, height:165, price:110 },
  { name:'Noctua NH-D15 chromax.black',   style:'air-dual',  maxTdp:250, height:165, price:120 },
  { name:'Noctua NH-D15 G2',              style:'air-dual',  maxTdp:280, height:168, price:150 },
  { name:'be quiet! Dark Rock Pro 5',     style:'air-dual',  maxTdp:270, height:168, price:100 },
  { name:'be quiet! Dark Rock Elite',     style:'air-dual',  maxTdp:280, height:168, price:120 },

  /* =========================================================
     AIO LIQUID  —  120 through 420
     ========================================================= */
  { name:'AIO 120mm (generic)',           style:'aio',       maxTdp:140, height:55,  price:60  },
  { name:'Cooler Master ML120L',          style:'aio',       maxTdp:150, height:55,  price:70  },
  { name:'NZXT Kraken 120',               style:'aio',       maxTdp:150, height:55,  price:90  },

  { name:'AIO 240mm (generic)',           style:'aio',       maxTdp:200, height:55,  price:90  },
  { name:'Cooler Master ML240L',          style:'aio',       maxTdp:200, height:55,  price:90  },
  { name:'NZXT Kraken 240',               style:'aio',       maxTdp:250, height:55,  price:140 },
  { name:'Corsair H100i RGB Elite',       style:'aio',       maxTdp:250, height:55,  price:150 },
  { name:'Arctic Liquid Freezer III 240', style:'aio',       maxTdp:280, height:55,  price:90  },
  { name:'Lian Li Galahad II 240',        style:'aio',       maxTdp:280, height:55,  price:130 },

  { name:'AIO 280mm (generic)',           style:'aio',       maxTdp:230, height:55,  price:120 },
  { name:'NZXT Kraken 280',               style:'aio',       maxTdp:280, height:55,  price:160 },
  { name:'Arctic Liquid Freezer III 280', style:'aio',       maxTdp:300, height:55,  price:110 },

  { name:'AIO 360mm (generic)',           style:'aio',       maxTdp:260, height:55,  price:140 },
  { name:'Corsair H150i RGB Elite',       style:'aio',       maxTdp:280, height:55,  price:190 },
  { name:'NZXT Kraken 360',               style:'aio',       maxTdp:300, height:55,  price:200 },
  { name:'Arctic Liquid Freezer III 360', style:'aio',       maxTdp:320, height:55,  price:130 },
  { name:'Lian Li Galahad II 360',        style:'aio',       maxTdp:320, height:55,  price:180 },

  { name:'AIO 420mm (generic)',           style:'aio',       maxTdp:300, height:55,  price:180 },
  { name:'Arctic Liquid Freezer III 420', style:'aio',       maxTdp:350, height:55,  price:160 },
  { name:'NZXT Kraken Elite 420',         style:'aio',       maxTdp:350, height:55,  price:300 },

  /* =========================================================
     CUSTOM LOOPS  —  enthusiast
     ========================================================= */
  { name:'Custom loop (single block)',    style:'custom',    maxTdp:250, height:60,  price:300 },
  { name:'Custom loop (CPU + GPU)',       style:'custom',    maxTdp:500, height:60,  price:600 },
  { name:'Custom loop (full build)',      style:'custom',    maxTdp:800, height:60,  price:1200 },
];

const PSUS = [
  /* =========================================================
     300–400W  —  office / low-power builds
     ========================================================= */
  { wattage:300,  efficiency:'80+ White',    form:'ATX', modular:'Non',  price:25  },
  { wattage:300,  efficiency:'80+ Bronze',   form:'ATX', modular:'Non',  price:30  },
  { wattage:350,  efficiency:'80+ White',    form:'ATX', modular:'Non',  price:28  },
  { wattage:350,  efficiency:'80+ Bronze',   form:'ATX', modular:'Non',  price:35  },
  { wattage:400,  efficiency:'80+ Bronze',   form:'ATX', modular:'Non',  price:40  },
  { wattage:400,  efficiency:'80+ Gold',     form:'ATX', modular:'Non',  price:55  },

  /* =========================================================
     450–550W  —  budget / midrange gaming
     ========================================================= */
  { wattage:450,  efficiency:'80+ Bronze',   form:'ATX', modular:'Non',  price:45  },
  { wattage:450,  efficiency:'80+ Gold',     form:'ATX', modular:'Non',  price:60  },
  { wattage:500,  efficiency:'80+ Bronze',   form:'ATX', modular:'Non',  price:50  },
  { wattage:500,  efficiency:'80+ Bronze',   form:'ATX', modular:'Semi', price:60  },
  { wattage:500,  efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:80  },
  { wattage:500,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:110 },
  { wattage:550,  efficiency:'80+ Bronze',   form:'ATX', modular:'Semi', price:65  },
  { wattage:550,  efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:90  },
  { wattage:550,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:120 },

  /* =========================================================
     600–650W  —  mainstream gaming
     ========================================================= */
  { wattage:600,  efficiency:'80+ Bronze',   form:'ATX', modular:'Semi', price:70  },
  { wattage:600,  efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:95  },
  { wattage:600,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:130 },
  { wattage:650,  efficiency:'80+ Bronze',   form:'ATX', modular:'Semi', price:75  },
  { wattage:650,  efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:105 },
  { wattage:650,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:145 },
  { wattage:650,  efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:140 },

  /* =========================================================
     700–750W  —  high-end mainstream
     ========================================================= */
  { wattage:700,  efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:115 },
  { wattage:700,  efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:150 },
  { wattage:750,  efficiency:'80+ Bronze',   form:'ATX', modular:'Semi', price:80  },
  { wattage:750,  efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:110 },
  { wattage:750,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:165 },
  { wattage:750,  efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:150 },
  { wattage:750,  efficiency:'80+ Titanium', form:'ATX', modular:'Full', price:210 },

  /* =========================================================
     800–850W  —  enthusiast
     ========================================================= */
  { wattage:800,  efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:130 },
  { wattage:800,  efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:170 },
  { wattage:850,  efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:140 },
  { wattage:850,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:180 },
  { wattage:850,  efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:180 },
  { wattage:850,  efficiency:'80+ Titanium', form:'ATX', modular:'Full', price:240 },

  /* =========================================================
     1000W  —  high-end / overclocking
     ========================================================= */
  { wattage:1000, efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:180 },
  { wattage:1000, efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:230 },
  { wattage:1000, efficiency:'80+ Titanium', form:'ATX', modular:'Full', price:320 },

  /* =========================================================
     1200W  —  flagship
     ========================================================= */
  { wattage:1200, efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:230 },
  { wattage:1200, efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:290 },
  { wattage:1200, efficiency:'80+ Titanium', form:'ATX', modular:'Full', price:420 },

  /* =========================================================
     1300–1600W  —  extreme / HEDT
     ========================================================= */
  { wattage:1300, efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:280 },
  { wattage:1300, efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:340 },
  { wattage:1500, efficiency:'80+ Gold',     form:'ATX', modular:'Full', price:340 },
  { wattage:1500, efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:400 },
  { wattage:1500, efficiency:'80+ Titanium', form:'ATX', modular:'Full', price:480 },
  { wattage:1600, efficiency:'80+ Platinum', form:'ATX', modular:'Full', price:450 },
  { wattage:1600, efficiency:'80+ Titanium', form:'ATX', modular:'Full', price:580 },

  /* =========================================================
     SFX  —  small form factor builds
     ========================================================= */
  { wattage:450,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:110 },
  { wattage:550,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:125 },
  { wattage:650,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:145 },
  { wattage:750,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:165 },
  { wattage:850,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:190 },
  { wattage:1000, efficiency:'80+ Platinum', form:'SFX', modular:'Full', price:250 },

  /* =========================================================
     SFX-L  —  longer SFX, more room for fan
     ========================================================= */
  { wattage:500,  efficiency:'80+ Gold',     form:'SFX', modular:'Full', price:120 },
  { wattage:700,  efficiency:'80+ Platinum', form:'SFX', modular:'Full', price:180 },
  { wattage:800,  efficiency:'80+ Platinum', form:'SFX', modular:'Full', price:210 },

  /* =========================================================
     TFX / Flex ATX  —  very small builds
     ========================================================= */
  { wattage:250,  efficiency:'80+ Bronze',   form:'TFX', modular:'Non',  price:45  },
  { wattage:300,  efficiency:'80+ Bronze',   form:'Flex',modular:'Non',  price:55  },
  { wattage:400,  efficiency:'80+ Gold',     form:'Flex',modular:'Non',  price:90  },
  { wattage:500,  efficiency:'80+ Gold',     form:'Flex',modular:'Non',  price:130 },
];

const STORAGE_EXTENDED = [
  { name:'HDD 5400 RPM',            family:'HDD',       speed:100,   mult:0.55, tdp:5,  price:30  },
  { name:'HDD 7200 RPM',            family:'HDD',       speed:150,   mult:0.65, tdp:6,  price:40  },
  { name:'HDD 10K RPM',             family:'HDD-Ent',   speed:200,   mult:0.75, tdp:8,  price:100 },
  { name:'HDD 15K RPM',             family:'HDD-Ent',   speed:250,   mult:0.85, tdp:12, price:180 },

  { name:'SATA SSD (DRAM-less)',    family:'SATA-SSD',  speed:500,   mult:0.95, tdp:3,  price:35  },
  { name:'SATA SSD (DRAM)',         family:'SATA-SSD',  speed:550,   mult:1.00, tdp:3,  price:50  },
  { name:'SATA SSD (Enterprise)',   family:'SATA-Ent',  speed:550,   mult:1.00, tdp:5,  price:160 },
  { name:'SATA M.2',                family:'SATA-M2',   speed:550,   mult:1.00, tdp:3,  price:45  },

  { name:'NVMe Gen3 (TLC)',         family:'NVMe-3',    speed:3500,  mult:1.20, tdp:5,  price:55  },
  { name:'NVMe Gen3 (QLC)',         family:'NVMe-3',    speed:2500,  mult:1.10, tdp:4,  price:45  },
  { name:'NVMe Gen4 (TLC)',         family:'NVMe-4',    speed:7000,  mult:1.40, tdp:7,  price:85  },
  { name:'NVMe Gen4 (QLC)',         family:'NVMe-4',    speed:5000,  mult:1.30, tdp:6,  price:65  },
  { name:'NVMe Gen4 (DRAM-less)',   family:'NVMe-4',    speed:4500,  mult:1.25, tdp:5,  price:55  },
  { name:'NVMe Gen5 (TLC)',         family:'NVMe-5',    speed:12000, mult:1.60, tdp:10, price:150 },
  { name:'NVMe Gen5 (QLC)',         family:'NVMe-5',    speed:9000,  mult:1.50, tdp:9,  price:120 },
  { name:'NVMe Gen5 (Ent.)',        family:'NVMe-5-Ent',speed:14000, mult:1.70, tdp:14, price:320 },

  { name:'USB 3.0 External HDD',    family:'Ext-HDD',   speed:120,   mult:0.60, tdp:8,  price:55  },
  { name:'USB 3.2 External SSD',    family:'Ext-SSD',   speed:1000,  mult:1.05, tdp:4,  price:100 },
  { name:'Thunderbolt Ext. SSD',    family:'TB-SSD',    speed:2800,  mult:1.15, tdp:6,  price:200 },

  { name:'Intel Optane',            family:'Optane',    speed:2500,  mult:1.35, tdp:10, price:280 },
  { name:'SD Card / eMMC',          family:'SD',        speed:100,   mult:0.50, tdp:2,  price:15  },
];

const RAM_EXTENDED = [
  /* =========================================================
     DDR3  —  legacy. 4–32 GB.
     ========================================================= */
  { capacity:4,   type:'DDR3', speeds:[1333,1600],                            mult:0.65, tdp:6,  price:15  },
  { capacity:8,   type:'DDR3', speeds:[1333,1600,1866],                       mult:0.72, tdp:8,  price:25  },
  { capacity:16,  type:'DDR3', speeds:[1333,1600,1866,2133],                  mult:0.80, tdp:12, price:45  },
  { capacity:32,  type:'DDR3', speeds:[1333,1600,1866],                       mult:0.86, tdp:20, price:90  },

  /* =========================================================
     DDR4  —  4–128 GB. 2133–4600 MHz.
     ========================================================= */
  { capacity:4,   type:'DDR4', speeds:[2133,2400,2666],                       mult:0.66, tdp:6,  price:18  },
  { capacity:8,   type:'DDR4', speeds:[2133,2400,2666,2800],                  mult:0.78, tdp:9,  price:25  },
  { capacity:8,   type:'DDR4', speeds:[3000,3200,3600],                       mult:0.86, tdp:10, price:32  },
  { capacity:8,   type:'DDR4', speeds:[3600,4000],                            mult:0.90, tdp:10, price:38  },
  { capacity:16,  type:'DDR4', speeds:[2133,2400,2666,2800],                  mult:0.88, tdp:13, price:40  },
  { capacity:16,  type:'DDR4', speeds:[3000,3200,3600],                       mult:1.00, tdp:15, price:50  },
  { capacity:16,  type:'DDR4', speeds:[3600,4000,4266],                       mult:1.06, tdp:15, price:65  },
  { capacity:16,  type:'DDR4', speeds:[4400,4600],                            mult:1.10, tdp:16, price:90  },
  { capacity:32,  type:'DDR4', speeds:[2400,2666,3000],                       mult:1.02, tdp:18, price:75  },
  { capacity:32,  type:'DDR4', speeds:[3200,3600,3800],                       mult:1.10, tdp:18, price:100 },
  { capacity:32,  type:'DDR4', speeds:[4000,4400],                            mult:1.15, tdp:19, price:140 },
  { capacity:64,  type:'DDR4', speeds:[2666,3000,3200],                       mult:1.12, tdp:24, price:180 },
  { capacity:64,  type:'DDR4', speeds:[3200,3600,4000],                       mult:1.20, tdp:24, price:220 },
  { capacity:128, type:'DDR4', speeds:[2666,3000,3200],                       mult:1.22, tdp:36, price:400 },

  /* =========================================================
     DDR5  —  16–256 GB. 4800–8400 MHz.
     ========================================================= */
  { capacity:16,  type:'DDR5', speeds:[4800,5200],                            mult:1.10, tdp:16, price:60  },
  { capacity:16,  type:'DDR5', speeds:[5600,6000],                            mult:1.18, tdp:18, price:80  },
  { capacity:16,  type:'DDR5', speeds:[6000,6400,6800],                       mult:1.24, tdp:18, price:110 },
  { capacity:16,  type:'DDR5', speeds:[7200,7600,8000],                       mult:1.30, tdp:19, price:160 },
  { capacity:32,  type:'DDR5', speeds:[4800,5200,5600],                       mult:1.20, tdp:22, price:100 },
  { capacity:32,  type:'DDR5', speeds:[5600,6000,6400],                       mult:1.28, tdp:22, price:140 },
  { capacity:32,  type:'DDR5', speeds:[6400,6800,7200],                       mult:1.34, tdp:24, price:190 },
  { capacity:32,  type:'DDR5', speeds:[7200,7600,8000],                       mult:1.38, tdp:24, price:260 },
  { capacity:48,  type:'DDR5', speeds:[6000,6400,7200],                       mult:1.36, tdp:26, price:280 },
  { capacity:64,  type:'DDR5', speeds:[4800,5200,5600],                       mult:1.30, tdp:28, price:200 },
  { capacity:64,  type:'DDR5', speeds:[5600,6000,6400],                       mult:1.38, tdp:28, price:260 },
  { capacity:64,  type:'DDR5', speeds:[6400,6800,7200],                       mult:1.44, tdp:30, price:340 },
  { capacity:96,  type:'DDR5', speeds:[5600,6000,6400],                       mult:1.42, tdp:34, price:420 },
  { capacity:128, type:'DDR5', speeds:[4800,5200,5600],                       mult:1.40, tdp:38, price:480 },
  { capacity:128, type:'DDR5', speeds:[5600,6000,6400],                       mult:1.48, tdp:38, price:600 },
  { capacity:192, type:'DDR5', speeds:[5200,5600,6000],                       mult:1.48, tdp:44, price:900 },
  { capacity:256, type:'DDR5', speeds:[5200,5600],                            mult:1.50, tdp:48, price:1400 },

  /* =========================================================
     SO-DIMM / Laptop (for users on prebuilts and laptops)
     ========================================================= */
  { capacity:8,   type:'DDR4-SODIMM', speeds:[2400,2666,3200],                mult:0.82, tdp:8,  price:25  },
  { capacity:16,  type:'DDR4-SODIMM', speeds:[2666,3200],                     mult:0.96, tdp:12, price:40  },
  { capacity:32,  type:'DDR4-SODIMM', speeds:[2666,3200],                     mult:1.06, tdp:16, price:75  },
  { capacity:16,  type:'DDR5-SODIMM', speeds:[4800,5200,5600],                mult:1.14, tdp:16, price:70  },
  { capacity:32,  type:'DDR5-SODIMM', speeds:[5200,5600,6000],                mult:1.24, tdp:20, price:130 },
  { capacity:64,  type:'DDR5-SODIMM', speeds:[5200,5600],                     mult:1.34, tdp:26, price:250 },

  /* =========================================================
     ECC / Workstation / Server
     ========================================================= */
  { capacity:16,  type:'DDR4-ECC', speeds:[2400,2666,3200],                   mult:0.94, tdp:14, price:80  },
  { capacity:32,  type:'DDR4-ECC', speeds:[2666,3200],                        mult:1.04, tdp:18, price:140 },
  { capacity:64,  type:'DDR4-ECC', speeds:[2666,3200],                        mult:1.14, tdp:24, price:280 },
  { capacity:32,  type:'DDR5-ECC', speeds:[4800,5200,5600],                   mult:1.20, tdp:22, price:180 },
  { capacity:64,  type:'DDR5-ECC', speeds:[5200,5600],                        mult:1.32, tdp:28, price:340 },
  { capacity:128, type:'DDR5-ECC', speeds:[5200,5600],                        mult:1.42, tdp:40, price:750 },

  /* =========================================================
     Quad-channel / HEDT
     ========================================================= */
  { capacity:64,  type:'DDR4-Quad', speeds:[3200,3600],                       mult:1.28, tdp:28, price:400 },
  { capacity:128, type:'DDR4-Quad', speeds:[3200,3600],                       mult:1.36, tdp:44, price:800 },
  { capacity:128, type:'DDR5-Quad', speeds:[5600,6000],                       mult:1.50, tdp:48, price:1100 },
  { capacity:256, type:'DDR5-Quad', speeds:[5600],                            mult:1.56, tdp:64, price:2200 },
]

const CPU_PRICES = {
  'Ryzen 3 1200':       60,   'Ryzen 5 2600':       120,  'Ryzen 5 3600':       180,
  'Ryzen 5 5600X':      180,  'Ryzen 7 5700X':      200,  'Ryzen 7 5800X3D':    350,
  'Ryzen 5 7600X':      220,  'Ryzen 7 7700X':      300,  'Ryzen 7 7800X3D':    400,
  'Ryzen 9 7900X':      400,  'Ryzen 9 7950X3D':    650,  'Ryzen 5 9600X':      260,
  'Ryzen 7 9700X':      350,  'Ryzen 9 9900X':      500,  'Ryzen 9 9950X3D':    800,
  'Core i3-10100F':     80,   'Core i5-10400F':     130,  'Core i5-11400F':     150,
  'Core i5-12400F':     170,  'Core i5-12600K':     220,  'Core i7-12700K':     320,
  'Core i5-13600K':     300,  'Core i7-13700K':     400,  'Core i9-13900K':     550,
  'Core i9-14900K':     580,  'Core Ultra 5 245K':  320,  'Core Ultra 7 265K':  420,
  'Core Ultra 9 285K':  620,
};

const GPU_PRICES = {
  'GTX 1050 Ti':        130,  'GTX 1060 6GB':       180,  'GTX 1660 Super':     220,
  'RTX 2060':           250,  'RTX 3060 12GB':      300,  'RTX 3060 Ti':        380,
  'RTX 3070':           450,  'RTX 3080 10GB':      600,  'RTX 3080 Ti':        800,
  'RTX 3090':           950,  'RTX 4060':           300,  'RTX 4060 Ti':        400,
  'RTX 4070':           550,  'RTX 4070 Super':     600,  'RTX 4070 Ti':        800,
  'RTX 4070 Ti Super':  800,  'RTX 4080':           1100, 'RTX 4080 Super':     1050,
  'RTX 4090':           1800, 'RTX 5070':           550,  'RTX 5070 Ti':        750,
  'RTX 5080':           1100, 'RTX 5090':           2200,
  'RX 570 4GB':         90,   'RX 580 8GB':         130,  'RX 5500 XT 8GB':     180,
  'RX 5600 XT':         220,  'RX 5700 XT':         280,  'RX 6600':            220,
  'RX 6600 XT':         250,  'RX 6700 XT':         350,  'RX 6750 XT':         400,
  'RX 6800':            500,  'RX 6800 XT':         600,  'RX 6900 XT':         800,
  'RX 6950 XT':         900,  'RX 7600':            280,  'RX 7700 XT':         450,
  'RX 7800 XT':         500,  'RX 7900 GRE':        550,  'RX 7900 XT':         750,
  'RX 7900 XTX':        950,  'RX 9070':            600,  'RX 9070 XT':         700,
  'Arc A380':           120,  'Arc A580':           180,  'Arc A750':           220,
  'Arc A770 16GB':      280,  'Arc B580':           250,  'Arc B770':           400,
};

const MOTHERBOARDS = [
  /* =========================================================
     AM4  —  DDR4 only. Ryzen 1000–5000.
     ========================================================= */

  /* --- A320 (ultra budget) --- */
  { name:'ASRock A320M-HDV R4.0',                    brand:'ASRock',    socket:'AM4',   chipset:'A320',
    form:'mATX', ramType:'DDR4', ramSlots:2, maxRam:32,  maxRamSpeed:3200,
    pcieGen:3.0, m2Slots:1, sataPorts:4, wifi:false, usbC:false, vrmTier:'basic',     price:60  },
  { name:'Gigabyte A320M-S2H',                       brand:'Gigabyte',  socket:'AM4',   chipset:'A320',
    form:'mATX', ramType:'DDR4', ramSlots:2, maxRam:32,  maxRamSpeed:3200,
    pcieGen:3.0, m2Slots:1, sataPorts:4, wifi:false, usbC:false, vrmTier:'basic',     price:60  },

  /* --- B450 (budget, still common) --- */
  { name:'MSI B450 Tomahawk Max',                    brand:'MSI',       socket:'AM4',   chipset:'B450',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:3466,
    pcieGen:3.0, m2Slots:2, sataPorts:6, wifi:false, usbC:false, vrmTier:'good',      price:90  },
  { name:'Gigabyte B450 Aorus Elite',                brand:'Gigabyte',  socket:'AM4',   chipset:'B450',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:3600,
    pcieGen:3.0, m2Slots:2, sataPorts:6, wifi:false, usbC:false, vrmTier:'good',      price:100 },
  { name:'ASUS ROG Strix B450-F Gaming',             brand:'ASUS',      socket:'AM4',   chipset:'B450',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:3600,
    pcieGen:3.0, m2Slots:2, sataPorts:6, wifi:false, usbC:false, vrmTier:'great',     price:130 },
  { name:'MSI B450M Mortar Max',                     brand:'MSI',       socket:'AM4',   chipset:'B450',
    form:'mATX', ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:3466,
    pcieGen:3.0, m2Slots:2, sataPorts:6, wifi:false, usbC:false, vrmTier:'good',      price:100 },

  /* --- B550 (modern AM4 sweet spot) --- */
  { name:'ASUS ROG Strix B550-F Gaming',             brand:'ASUS',      socket:'AM4',   chipset:'B550',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:false, usbC:true,  vrmTier:'great',     price:160 },
  { name:'ASUS ROG Strix B550-A Gaming',             brand:'ASUS',      socket:'AM4',   chipset:'B550',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:false, usbC:true,  vrmTier:'great',     price:170 },
  { name:'MSI MAG B550 Tomahawk',                    brand:'MSI',       socket:'AM4',   chipset:'B550',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:false, usbC:true,  vrmTier:'great',     price:170 },
  { name:'MSI MPG B550 Gaming Edge WiFi',            brand:'MSI',       socket:'AM4',   chipset:'B550',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:190 },
  { name:'Gigabyte B550 Aorus Pro AC',               brand:'Gigabyte',  socket:'AM4',   chipset:'B550',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:180 },
  { name:'Gigabyte B550 Aorus Elite V2',             brand:'Gigabyte',  socket:'AM4',   chipset:'B550',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:false, usbC:true,  vrmTier:'great',     price:150 },
  { name:'ASRock B550M Pro4',                        brand:'ASRock',    socket:'AM4',   chipset:'B550',
    form:'mATX', ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:false, usbC:true,  vrmTier:'good',      price:110 },
  { name:'ASRock B550 Steel Legend',                 brand:'ASRock',    socket:'AM4',   chipset:'B550',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:false, usbC:true,  vrmTier:'great',     price:150 },

  /* --- X570 (enthusiast AM4) --- */
  { name:'ASUS ROG Crosshair VIII Hero',             brand:'ASUS',      socket:'AM4',   chipset:'X570',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4800,
    pcieGen:4.0, m2Slots:3, sataPorts:8, wifi:true,  usbC:true,  vrmTier:'excellent', price:360 },
  { name:'ASUS ROG Crosshair VIII Dark Hero',        brand:'ASUS',      socket:'AM4',   chipset:'X570',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5100,
    pcieGen:4.0, m2Slots:3, sataPorts:8, wifi:true,  usbC:true,  vrmTier:'excellent', price:430 },
  { name:'Gigabyte X570 Aorus Master',               brand:'Gigabyte',  socket:'AM4',   chipset:'X570',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5400,
    pcieGen:4.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:350 },
  { name:'MSI MEG X570 Unify',                       brand:'MSI',       socket:'AM4',   chipset:'X570',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5000,
    pcieGen:4.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:330 },

  /* =========================================================
     AM5  —  DDR5 only. Ryzen 7000 / 8000 / 9000.
     ========================================================= */

  /* --- A620 (budget AM5) --- */
  { name:'ASRock A620M-HDV/M.2+',                    brand:'ASRock',    socket:'AM5',   chipset:'A620',
    form:'mATX', ramType:'DDR5', ramSlots:2, maxRam:64,  maxRamSpeed:6400,
    pcieGen:4.0, m2Slots:1, sataPorts:4, wifi:false, usbC:false, vrmTier:'basic',     price:100 },
  { name:'Gigabyte A620M Gaming X AX',               brand:'Gigabyte',  socket:'AM5',   chipset:'A620',
    form:'mATX', ramType:'DDR5', ramSlots:2, maxRam:64,  maxRamSpeed:6400,
    pcieGen:4.0, m2Slots:1, sataPorts:4, wifi:true,  usbC:false, vrmTier:'basic',     price:120 },
  { name:'MSI PRO A620M-E',                          brand:'MSI',       socket:'AM5',   chipset:'A620',
    form:'mATX', ramType:'DDR5', ramSlots:2, maxRam:64,  maxRamSpeed:6400,
    pcieGen:4.0, m2Slots:1, sataPorts:4, wifi:false, usbC:false, vrmTier:'basic',     price:100 },

  /* --- B650 (mainstream AM5) --- */
  { name:'ASUS TUF Gaming B650-Plus WiFi',           brand:'ASUS',      socket:'AM5',   chipset:'B650',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:4.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:190 },
  { name:'ASUS ROG Strix B650-A Gaming WiFi',        brand:'ASUS',      socket:'AM5',   chipset:'B650',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:4.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:230 },
  { name:'MSI MAG B650 Tomahawk WiFi',               brand:'MSI',       socket:'AM5',   chipset:'B650',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6600,
    pcieGen:4.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:210 },
  { name:'MSI MAG B650M Mortar WiFi',                brand:'MSI',       socket:'AM5',   chipset:'B650',
    form:'mATX', ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6600,
    pcieGen:4.0, m2Slots:2, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:200 },
  { name:'Gigabyte B650 Aorus Elite AX',             brand:'Gigabyte',  socket:'AM5',   chipset:'B650',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6600,
    pcieGen:4.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:200 },
  { name:'Gigabyte B650 Gaming X AX',                brand:'Gigabyte',  socket:'AM5',   chipset:'B650',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:4.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'good',      price:170 },
  { name:'ASRock B650M PG Riptide',                  brand:'ASRock',    socket:'AM5',   chipset:'B650',
    form:'mATX', ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:4.0, m2Slots:2, sataPorts:4, wifi:false, usbC:true,  vrmTier:'good',      price:160 },
  { name:'ASRock B650 PG Lightning',                 brand:'ASRock',    socket:'AM5',   chipset:'B650',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:4.0, m2Slots:3, sataPorts:4, wifi:false, usbC:true,  vrmTier:'great',     price:170 },

  /* --- B650E (PCIe 5.0 value) --- */
  { name:'ASUS ROG Strix B650E-F Gaming',            brand:'ASUS',      socket:'AM5',   chipset:'B650E',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:5.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'excellent', price:260 },
  { name:'ASUS ROG Strix B650E-E Gaming WiFi',       brand:'ASUS',      socket:'AM5',   chipset:'B650E',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:5.0, m2Slots:4, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'excellent', price:320 },
  { name:'MSI MPG B650E Carbon WiFi',                brand:'MSI',       socket:'AM5',   chipset:'B650E',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6600,
    pcieGen:5.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:300 },

  /* --- X670 / X670E (flagship AM5) --- */
  { name:'ASUS ROG Crosshair X670E Hero',            brand:'ASUS',      socket:'AM5',   chipset:'X670E',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:620 },
  { name:'ASUS ROG Crosshair X670E Gene',            brand:'ASUS',      socket:'AM5',   chipset:'X670E',
    form:'mATX', ramType:'DDR5', ramSlots:2, maxRam:64,  maxRamSpeed:6400,
    pcieGen:5.0, m2Slots:2, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'excellent', price:500 },
  { name:'MSI MEG X670E ACE',                        brand:'MSI',       socket:'AM5',   chipset:'X670E',
    form:'E-ATX',ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7800,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:700 },
  { name:'MSI MPG X670E Carbon WiFi',                brand:'MSI',       socket:'AM5',   chipset:'X670E',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:7800,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:430 },
  { name:'Gigabyte X670E Aorus Master',              brand:'Gigabyte',  socket:'AM5',   chipset:'X670E',
    form:'E-ATX',ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:8000,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:480 },
  { name:'Gigabyte X670 Aorus Elite AX',             brand:'Gigabyte',  socket:'AM5',   chipset:'X670',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:7000,
    pcieGen:4.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:300 },

  /* =========================================================
     LGA1200  —  Intel 10th / 11th gen  —  DDR4 only.
     ========================================================= */

  { name:'ASUS Prime H510M-E',                       brand:'ASUS',      socket:'LGA1200', chipset:'H510',
    form:'mATX', ramType:'DDR4', ramSlots:2, maxRam:64,  maxRamSpeed:3200,
    pcieGen:4.0, m2Slots:1, sataPorts:4, wifi:false, usbC:false, vrmTier:'basic',     price:80  },
  { name:'MSI PRO B560M-A Pro',                      brand:'MSI',       socket:'LGA1200', chipset:'B560',
    form:'mATX', ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4000,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:false, usbC:false, vrmTier:'good',      price:110 },
  { name:'ASUS TUF Gaming B560-Plus WiFi',           brand:'ASUS',      socket:'LGA1200', chipset:'B560',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5000,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:150 },
  { name:'MSI MAG B560 Tomahawk WiFi',               brand:'MSI',       socket:'LGA1200', chipset:'B560',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5000,
    pcieGen:4.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:170 },
  { name:'Gigabyte Z590 Aorus Elite AX',             brand:'Gigabyte',  socket:'LGA1200', chipset:'Z590',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:4.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:220 },
  { name:'ASUS ROG Maximus XIII Hero',               brand:'ASUS',      socket:'LGA1200', chipset:'Z590',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:4.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:450 },

  /* =========================================================
     LGA1700  —  Intel 12th / 13th / 14th gen  —  DDR4 OR DDR5.
     ========================================================= */

  /* --- H610 (budget) --- */
  { name:'ASUS Prime H610M-E D4',                    brand:'ASUS',      socket:'LGA1700', chipset:'H610',
    form:'mATX', ramType:'DDR4', ramSlots:2, maxRam:64,  maxRamSpeed:3200,
    pcieGen:4.0, m2Slots:1, sataPorts:4, wifi:false, usbC:false, vrmTier:'basic',     price:110 },
  { name:'MSI PRO H610M-G DDR4',                     brand:'MSI',       socket:'LGA1700', chipset:'H610',
    form:'mATX', ramType:'DDR4', ramSlots:2, maxRam:64,  maxRamSpeed:3200,
    pcieGen:4.0, m2Slots:1, sataPorts:4, wifi:false, usbC:false, vrmTier:'basic',     price:100 },
  { name:'Gigabyte H610M S2H DDR4',                  brand:'Gigabyte',  socket:'LGA1700', chipset:'H610',
    form:'mATX', ramType:'DDR4', ramSlots:2, maxRam:64,  maxRamSpeed:3200,
    pcieGen:4.0, m2Slots:1, sataPorts:4, wifi:false, usbC:false, vrmTier:'basic',     price:95  },

  /* --- B660 (DDR4 and DDR5 variants) --- */
  { name:'MSI PRO B660M-A DDR4',                     brand:'MSI',       socket:'LGA1700', chipset:'B660',
    form:'mATX', ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4000,
    pcieGen:4.0, m2Slots:2, sataPorts:4, wifi:false, usbC:false, vrmTier:'good',      price:140 },
  { name:'MSI PRO B660M-A WiFi DDR4',                brand:'MSI',       socket:'LGA1700', chipset:'B660',
    form:'mATX', ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4000,
    pcieGen:4.0, m2Slots:2, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'good',      price:170 },
  { name:'ASUS TUF Gaming B660-Plus WiFi D4',        brand:'ASUS',      socket:'LGA1700', chipset:'B660',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5000,
    pcieGen:4.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:180 },
  { name:'Gigabyte B660M DS3H DDR4',                 brand:'Gigabyte',  socket:'LGA1700', chipset:'B660',
    form:'mATX', ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:4400,
    pcieGen:4.0, m2Slots:2, sataPorts:4, wifi:false, usbC:false, vrmTier:'good',      price:130 },
  { name:'Gigabyte B660 Gaming X AX DDR4',           brand:'Gigabyte',  socket:'LGA1700', chipset:'B660',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5000,
    pcieGen:4.0, m2Slots:2, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:180 },

  /* --- B760 (mainstream LGA1700, DDR4 + DDR5 variants) --- */
  { name:'MSI MAG B760 Tomahawk WiFi DDR4',          brand:'MSI',       socket:'LGA1700', chipset:'B760',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:4.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:200 },
  { name:'MSI MAG B760 Tomahawk WiFi',               brand:'MSI',       socket:'LGA1700', chipset:'B760',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7000,
    pcieGen:4.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:230 },
  { name:'MSI PRO B760M-A WiFi DDR4',                brand:'MSI',       socket:'LGA1700', chipset:'B760',
    form:'mATX', ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:4.0, m2Slots:2, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'good',      price:160 },
  { name:'ASUS ROG Strix B760-A Gaming WiFi',        brand:'ASUS',      socket:'LGA1700', chipset:'B760',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7800,
    pcieGen:4.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:250 },
  { name:'ASUS TUF Gaming B760-Plus WiFi D4',        brand:'ASUS',      socket:'LGA1700', chipset:'B760',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:4.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:190 },
  { name:'Gigabyte B760M DS3H DDR4',                 brand:'Gigabyte',  socket:'LGA1700', chipset:'B760',
    form:'mATX', ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:4.0, m2Slots:2, sataPorts:4, wifi:false, usbC:true,  vrmTier:'good',      price:140 },
  { name:'Gigabyte B760 Aorus Elite AX DDR4',        brand:'Gigabyte',  socket:'LGA1700', chipset:'B760',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:4.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:210 },

  /* --- Z690 (high-end, DDR4 + DDR5 variants) --- */
  { name:'ASUS ROG Strix Z690-A Gaming WiFi D4',     brand:'ASUS',      socket:'LGA1700', chipset:'Z690',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:290 },
  { name:'ASUS ROG Strix Z690-F Gaming WiFi',        brand:'ASUS',      socket:'LGA1700', chipset:'Z690',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:380 },
  { name:'MSI MPG Z690 Edge WiFi DDR4',              brand:'MSI',       socket:'LGA1700', chipset:'Z690',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5200,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:300 },
  { name:'MSI MPG Z690 Carbon WiFi',                 brand:'MSI',       socket:'LGA1700', chipset:'Z690',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:400 },
  { name:'Gigabyte Z690 Aorus Elite AX DDR4',        brand:'Gigabyte',  socket:'LGA1700', chipset:'Z690',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:5.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:270 },
  { name:'Gigabyte Z690 UD AX DDR4',                 brand:'Gigabyte',  socket:'LGA1700', chipset:'Z690',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:5.0, m2Slots:3, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:210 },
  { name:'ASUS ROG Maximus Z690 Hero',               brand:'ASUS',      socket:'LGA1700', chipset:'Z690',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:128, maxRamSpeed:6400,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:600 },

  /* --- Z790 (top LGA1700, DDR4 + DDR5 variants) --- */
  { name:'MSI MAG Z790 Tomahawk WiFi DDR4',          brand:'MSI',       socket:'LGA1700', chipset:'Z790',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:260 },
  { name:'MSI MAG Z790 Tomahawk WiFi',               brand:'MSI',       socket:'LGA1700', chipset:'Z790',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7200,
    pcieGen:5.0, m2Slots:4, sataPorts:8, wifi:true,  usbC:true,  vrmTier:'excellent', price:290 },
  { name:'MSI MPG Z790 Carbon WiFi',                 brand:'MSI',       socket:'LGA1700', chipset:'Z790',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7800,
    pcieGen:5.0, m2Slots:5, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:400 },
  { name:'ASUS ROG Strix Z790-A Gaming WiFi D4',     brand:'ASUS',      socket:'LGA1700', chipset:'Z790',
    form:'ATX',  ramType:'DDR4', ramSlots:4, maxRam:128, maxRamSpeed:5333,
    pcieGen:5.0, m2Slots:4, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'excellent', price:300 },
  { name:'ASUS ROG Strix Z790-E Gaming WiFi',        brand:'ASUS',      socket:'LGA1700', chipset:'Z790',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7800,
    pcieGen:5.0, m2Slots:5, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'excellent', price:450 },
  { name:'ASUS ROG Maximus Z790 Hero',               brand:'ASUS',      socket:'LGA1700', chipset:'Z790',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7800,
    pcieGen:5.0, m2Slots:5, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:600 },
  { name:'Gigabyte Z790 Aorus Elite AX',             brand:'Gigabyte',  socket:'LGA1700', chipset:'Z790',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7600,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:280 },
  { name:'Gigabyte Z790 UD AX',                      brand:'Gigabyte',  socket:'LGA1700', chipset:'Z790',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:7600,
    pcieGen:5.0, m2Slots:4, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'great',     price:230 },

  /* =========================================================
     LGA1851  —  Intel Core Ultra 200 series  —  DDR5 only.
     ========================================================= */

  /* --- B860 (mainstream Core Ultra) --- */
  { name:'MSI MAG B860 Tomahawk WiFi',               brand:'MSI',       socket:'LGA1851', chipset:'B860',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:8600,
    pcieGen:5.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:250 },
  { name:'MSI PRO B860M-A WiFi',                     brand:'MSI',       socket:'LGA1851', chipset:'B860',
    form:'mATX', ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:8000,
    pcieGen:5.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'good',      price:190 },
  { name:'ASUS TUF Gaming B860-Plus WiFi',           brand:'ASUS',      socket:'LGA1851', chipset:'B860',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:8000,
    pcieGen:5.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:230 },
  { name:'ASUS ROG Strix B860-F Gaming WiFi',        brand:'ASUS',      socket:'LGA1851', chipset:'B860',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:8600,
    pcieGen:5.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:290 },
  { name:'Gigabyte B860M Aorus Elite WiFi6E',        brand:'Gigabyte',  socket:'LGA1851', chipset:'B860',
    form:'mATX', ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:8000,
    pcieGen:5.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:200 },
  { name:'Gigabyte B860 Aorus Elite WIFI6E',         brand:'Gigabyte',  socket:'LGA1851', chipset:'B860',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:192, maxRamSpeed:8000,
    pcieGen:5.0, m2Slots:3, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'great',     price:230 },

  /* --- Z890 (flagship Core Ultra) --- */
  { name:'MSI MPG Z890 Carbon WiFi',                 brand:'MSI',       socket:'LGA1851', chipset:'Z890',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:256, maxRamSpeed:9200,
    pcieGen:5.0, m2Slots:5, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:500 },
  { name:'MSI MEG Z890 ACE',                         brand:'MSI',       socket:'LGA1851', chipset:'Z890',
    form:'E-ATX',ramType:'DDR5', ramSlots:4, maxRam:256, maxRamSpeed:9200,
    pcieGen:5.0, m2Slots:5, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:800 },
  { name:'ASUS ROG Maximus Z890 Hero',               brand:'ASUS',      socket:'LGA1851', chipset:'Z890',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:256, maxRamSpeed:9200,
    pcieGen:5.0, m2Slots:5, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:750 },
  { name:'ASUS ROG Strix Z890-E Gaming WiFi',        brand:'ASUS',      socket:'LGA1851', chipset:'Z890',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:256, maxRamSpeed:9000,
    pcieGen:5.0, m2Slots:5, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'excellent', price:500 },
  { name:'Gigabyte Z890 Aorus Master',               brand:'Gigabyte',  socket:'LGA1851', chipset:'Z890',
    form:'E-ATX',ramType:'DDR5', ramSlots:4, maxRam:256, maxRamSpeed:9500,
    pcieGen:5.0, m2Slots:5, sataPorts:6, wifi:true,  usbC:true,  vrmTier:'excellent', price:600 },
  { name:'Gigabyte Z890 Aorus Elite WIFI7',          brand:'Gigabyte',  socket:'LGA1851', chipset:'Z890',
    form:'ATX',  ramType:'DDR5', ramSlots:4, maxRam:256, maxRamSpeed:9200,
    pcieGen:5.0, m2Slots:4, sataPorts:4, wifi:true,  usbC:true,  vrmTier:'excellent', price:320 },
];
