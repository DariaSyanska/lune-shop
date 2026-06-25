const COMP = {
  SILK: "100% Mulberry Silk. Hand wash cold or dry clean only. Lay flat to dry.",
  LINEN:
    "100% European Flax Linen. Machine wash cold on delicate cycle. Hang to dry.",
  CASHMERE: "100% Mongolian Cashmere. Dry clean recommended. Store folded.",
  WOOL: "80% Merino Wool, 20% Polyamide. Hand wash cool or dry clean only. Store folded.",
  SILVER:
    "925 Sterling Silver (18k Gold Plated). Wipe with a soft cloth. Avoid moisture.",
  COTTON: "100% Heavyweight Organic Cotton. Spot clean recommended. Air dry.",
  LEATHER:
    "100% Italian Pebble-Grain Leather. Professional leather clean only.",
};

export const PRODUCTS = [
  {
    id: "silk-dress",
    name: "Silk Slip Dress",
    price: 189,
    category: "dresses",
    composition: COMP.SILK,
    description:
      "Classic bias-cut silhouette made from 19-momme mulberry silk. A liquid-like drape for moonlight evenings.",

    variants: [
      {
        id: "silk-dress-ivory",
        color: "ivory",
        img: "/images/silk-dress.jpg",
      },
      {
        id: "silk-dress-black",
        color: "black",
        img: "/images/silk-dress-2.jpg",
      },
      {
        id: "silk-dress-violet",
        color: "violet",
        img: "/images/silk-dress-3.jpg",
      },
      {
        id: "silk-dress-pink",
        color: "pink",
        img: "/images/silk-dress-4.jpg",
      },
      {
        id: "silk-dress-blue",
        color: "blue",
        img: "/images/silk-dress-5.jpg",
      },
      {
        id: "silk-dress-yellow",
        color: "yellow",
        img: "/images/silk-dress-6.jpg",
      },
      {
        id: "silk-dress-teal",
        color: "teal",
        img: "/images/silk-dress-7.jpg",
      },
    ],

    defaultVariant: "silk-dress-ivory",
    sizes: ["XS", "S", "M", "L"],
    date: "2026-03-17",
  },

  {
    id: "linen-trench",
    name: "Linen Trench Coat",
    price: 320,
    category: "outerwear",
    composition: COMP.LINEN,
    description:
      "Tailored from heavy European flax linen. The perfect lightweight layer for transitional seasons.",

    variants: [
      {
        id: "linen-trench-ivory",
        color: "ivory",
        img: "/images/linen-trench.jpg",
      },
      {
        id: "linen-trench-black",
        color: "black",
        img: "/images/linen-trench-2.jpg",
      },
    ],

    defaultVariant: "linen-trench-ivory",
    sizes: ["XS", "S", "M", "L"],
    date: "2026-03-20",
  },

  {
    id: "cashmere-knit",
    name: "Pure Cashmere Knit",
    price: 245,
    category: "knitwear",
    composition: COMP.CASHMERE,
    description:
      "Cloud-soft sweater knitted from sustainably sourced Mongolian cashmere. Effortless warmth.",

    variants: [
      {
        id: "cashmere-knit-ivory",
        color: "ivory",
        img: "/images/cashmere-knit.jpg",
      },
      {
        id: "cashmere-knit-black",
        color: "black",
        img: "/images/cashmere-knit-2.jpg",
      },
      {
        id: "cashmere-knit-violet",
        color: "violet",
        img: "/images/cashmere-knit-3.jpg",
      },
      {
        id: "cashmere-knit-pink",
        color: "pink",
        img: "/images/cashmere-knit-4.jpg",
      },
      {
        id: "cashmere-knit-blue",
        color: "blue",
        img: "/images/cashmere-knit-5.jpg",
      },
      {
        id: "cashmere-knit-yellow",
        color: "yellow",
        img: "/images/cashmere-knit-6.jpg",
      },
    ],

    defaultVariant: "cashmere-knit-ivory",
    sizes: ["XS", "S", "M", "L", "XL"],
    date: "2026-03-15",
  },

  {
    id: "cashmere-cardigan",
    name: "Oversized Cashmere Cardigan",
    price: 200,
    category: "knitwear",
    composition: COMP.CASHMERE,
    description:
      "A relaxed, cocoon-like fit featuring horn buttons and ribbed cuffs. Luxury in every stitch.",

    variants: [
      {
        id: "cardigan-ivory",
        color: "ivory",
        img: "/images/cashmere-cardigan.jpg",
      },
      {
        id: "cardigan-black",
        color: "black",
        img: "/images/cashmere-cardigan-2.jpg",
      },
      {
        id: "cardigan-violet",
        color: "violet",
        img: "/images/cashmere-cardigan-3.jpg",
      },
      {
        id: "cardigan-pink",
        color: "pink",
        img: "/images/cashmere-cardigan-4.jpg",
      },
    ],

    defaultVariant: "cardigan-ivory",
    sizes: ["XS", "S", "M", "L", "XL"],
    date: "2026-03-18",
  },

  {
    id: "knit-turtleneck",
    name: "Fine Knit Turtleneck",
    price: 200,
    category: "knitwear",
    composition:
      "80% Merino Wool, 20% Polyamide. Hand wash cool or dry clean only. Do not tumble dry. Store folded.",
    description:
      "Lightweight merino wool blend. A sophisticated essential for seamless layering.",

    variants: [
      {
        id: "turtleneck-ivory",
        color: "ivory",
        img: "/images/knit-turtleneck.jpg",
      },
      {
        id: "turtleneck-black",
        color: "black",
        img: "/images/knit-turtleneck-2.jpg",
      },
      {
        id: "turtleneck-violet",
        color: "violet",
        img: "/images/knit-turtleneck-3.jpg",
      },
      {
        id: "turtleneck-pink",
        color: "pink",
        img: "/images/knit-turtleneck-4.jpg",
      },
      {
        id: "turtleneck-blue",
        color: "blue",
        img: "/images/knit-turtleneck-5.jpg",
      },
    ],

    defaultVariant: "turtleneck-ivory",
    sizes: ["XS", "S", "L", "XL"],
    date: "2026-03-18",
  },

  {
    id: "wide-leg-trousers",
    name: "Silk Wide-Leg Trousers",
    price: 290,
    category: "trousers",
    composition: COMP.SILK,
    description:
      "Flowing silhouette with an elasticated high-waist. Elegance that moves with you.",

    variants: [
      {
        id: "trousers-ivory",
        color: "ivory",
        img: "/images/wide-leg-trousers.jpg",
      },
      {
        id: "trousers-black",
        color: "black",
        img: "/images/wide-leg-trousers-2.jpg",
      },
      {
        id: "trousers-violet",
        color: "violet",
        img: "/images/wide-leg-trousers-3.jpg",
      },
    ],

    defaultVariant: "trousers-ivory",
    sizes: ["S", "M", "L", "XL"],
    date: "2026-03-10",
  },

  {
    id: "silk-top",
    name: "Silk Camisole Top",
    price: 175,
    category: "tops",
    composition: COMP.SILK,
    description:
      "Delicate spaghetti straps and a subtle V-neck. A minimalist staple in shimmering silk.",

    variants: [
      {
        id: "top-ivory",
        color: "ivory",
        img: "/images/silk-top.jpg",
      },
      {
        id: "top-black",
        color: "black",
        img: "/images/silk-top-2.jpg",
      },
      {
        id: "top-violet",
        color: "violet",
        img: "/images/silk-top-3.jpg",
      },
      {
        id: "top-pink",
        color: "pink",
        img: "/images/silk-top-4.jpg",
      },
      {
        id: "top-blue",
        color: "blue",
        img: "/images/silk-top-5.jpg",
      },
      {
        id: "top-yellow",
        color: "yellow",
        img: "/images/silk-top-6.jpg",
      },
      {
        id: "top-teal",
        color: "teal",
        img: "/images/silk-top-7.jpg",
      },
    ],

    defaultVariant: "top-ivory",
    sizes: ["XS", "S", "M"],
    date: "2026-03-13",
  },

  {
    id: "linen-shirt",
    name: "Linen Oversized Shirt",
    price: 190,
    category: "shirts",
    composition: COMP.LINEN,
    description:
      "Breathable European flax linen with a relaxed 'borrowed-from-the-boys' fit.",

    variants: [
      {
        id: "shirt-ivory",
        color: "ivory",
        img: "/images/linen-shirt.jpg",
      },
      {
        id: "shirt-black",
        color: "black",
        img: "/images/linen-shirt-2.jpg",
      },
      {
        id: "shirt-blue",
        color: "blue",
        img: "/images/linen-shirt-5.jpg",
      },
      {
        id: "shirt-teal",
        color: "teal",
        img: "/images/linen-shirt-7.jpg",
      },
    ],

    defaultVariant: "shirt-ivory",
    sizes: ["S", "M", "L", "XL"],
    date: "2026-03-11",
  },

  {
    id: "satin-blazer",
    name: "Satin Evening Blazer",
    price: 290,
    category: "outerwear",
    composition: COMP.SILK,
    description:
      "Structured shoulders and a lustrous satin finish. Sharp tailoring for the modern muse.",

    variants: [
      {
        id: "blazer-ivory",
        color: "ivory",
        img: "/images/satin-blazer.jpg",
      },
      {
        id: "blazer-black",
        color: "black",
        img: "/images/satin-blazer-2.jpg",
      },
      {
        id: "blazer-violet",
        color: "violet",
        img: "/images/satin-blazer-3.jpg",
      },
      {
        id: "blazer-pink",
        color: "pink",
        img: "/images/satin-blazer-4.jpg",
      },
      {
        id: "blazer-blue",
        color: "blue",
        img: "/images/satin-blazer-5.jpg",
      },
      {
        id: "blazer-yellow",
        color: "yellow",
        img: "/images/satin-blazer-6.jpg",
      },
      {
        id: "blazer-teal",
        color: "teal",
        img: "/images/satin-blazer-7.jpg",
      },
    ],

    defaultVariant: "blazer-ivory",
    sizes: ["XS", "S", "M", "L", "XL"],
    date: "2026-03-18",
  },

  {
    id: "silk-blouse",
    name: "Silk Tie-Neck Blouse",
    price: 165,
    category: "blouses",
    composition: COMP.SILK,
    description:
      "Sophisticated drape with elongated cuffs. Designed for a seamless transition from desk to dinner.",

    variants: [
      {
        id: "blouse-ivory",
        color: "ivory",
        img: "/images/silk-blouse.jpg",
      },
      {
        id: "blouse-black",
        color: "black",
        img: "/images/silk-blouse-2.jpg",
      },
      {
        id: "blouse-violet",
        color: "violet",
        img: "/images/silk-blouse-3.jpg",
      },
      {
        id: "blouse-pink",
        color: "pink",
        img: "/images/silk-blouse-4.jpg",
      },
      {
        id: "blouse-blue",
        color: "blue",
        img: "/images/silk-blouse-5.jpg",
      },
      {
        id: "blouse-teal",
        color: "teal",
        img: "/images/silk-blouse-7.jpg",
      },
    ],

    defaultVariant: "blouse-ivory",
    sizes: ["XS", "S", "M", "L"],
    date: "2026-03-14",
  },

  {
    id: "slip-skirt",
    name: "Silk Slip Skirt",
    price: 290,
    category: "skirts",
    composition: COMP.SILK,
    description:
      "Midi-length skirt cut on the bias to hug your curves. The ultimate wardrobe foundation.",

    variants: [
      {
        id: "skirt-ivory",
        color: "ivory",
        img: "/images/slip-skirt.jpg",
      },
      {
        id: "skirt-black",
        color: "black",
        img: "/images/slip-skirt-2.jpg",
      },
      {
        id: "skirt-violet",
        color: "violet",
        img: "/images/slip-skirt-3.jpg",
      },
      {
        id: "skirt-pink",
        color: "pink",
        img: "/images/slip-skirt-4.jpg",
      },
      {
        id: "skirt-blue",
        color: "blue",
        img: "/images/slip-skirt-5.jpg",
      },
      {
        id: "skirt-yellow",
        color: "yellow",
        img: "/images/slip-skirt-6.jpg",
      },
      {
        id: "skirt-teal",
        color: "teal",
        img: "/images/slip-skirt-7.jpg",
      },
    ],

    defaultVariant: "skirt-ivory",
    sizes: ["XS", "S", "M", "L"],
    date: "2026-03-12",
  },

  {
    id: "silk-scarf",
    name: "Silk Square Scarf",
    price: 65,
    category: "accessories",
    composition: COMP.SILK,
    description:
      "Hand-rolled edges and hand-painted motifs. Wear it in your hair, on your neck, or on your bag.",

    variants: [
      {
        id: "scarf-ivory",
        color: "ivory",
        img: "/images/silk-scarf.jpg",
      },
      {
        id: "scarf-violet",
        color: "violet",
        img: "/images/silk-scarf-3.jpg",
      },
      {
        id: "scarf-pink",
        color: "pink",
        img: "/images/silk-scarf-4.jpg",
      },
      {
        id: "scarf-teal",
        color: "teal",
        img: "/images/silk-scarf-7.jpg",
      },
    ],

    defaultVariant: "scarf-ivory",
    sizes: ["ONE_SIZE"],
    date: "2026-03-22",
  },

  {
    id: "leather-belt",
    name: "Classic Leather Belt",
    price: 85,
    category: "accessories",
    composition: COMP.LEATHER,
    description:
      "Supple Italian leather with a brushed gold buckle. The finishing touch for high-waisted looks.",

    variants: [
      {
        id: "belt-ivory",
        color: "ivory",
        img: "/images/leather-belt.jpg",
      },
      {
        id: "belt-black",
        color: "black",
        img: "/images/leather-belt-2.jpg",
      },
    ],

    defaultVariant: "belt-ivory",
    sizes: ["S", "M", "L"],
    date: "2026-03-21",
  },

  {
    id: "cashmere-beanie",
    name: "Ribbed Cashmere Beanie",
    price: 95,
    category: "accessories",
    composition: COMP.CASHMERE,
    description:
      "Double-layered for exceptional warmth. A cozy moonlit night essential.",

    variants: [
      {
        id: "beanie-ivory",
        color: "ivory",
        img: "/images/cashmere-beanie.jpg",
      },
      {
        id: "beanie-black",
        color: "black",
        img: "/images/cashmere-beanie-2.jpg",
      },
      {
        id: "beanie-blue",
        color: "blue",
        img: "/images/cashmere-beanie-5.jpg",
      },
      {
        id: "beanie-yellow",
        color: "yellow",
        img: "/images/cashmere-beanie-6.jpg",
      },
    ],

    defaultVariant: "beanie-ivory",
    sizes: ["ONE_SIZE"],
    date: "2026-03-16",
  },

  {
    id: "silver-hoops",
    name: "Minimalist Silver Hoops",
    price: 110,
    category: "accessories",
    composition: COMP.SILVER,
    description:
      "925 Sterling silver. Architectural simplicity for everyday wear.",

    variants: [
      {
        id: "hoops-ivory",
        color: "ivory",
        img: "/images/silver-hoops.jpg",
      },
    ],

    defaultVariant: "hoops-ivory",
    sizes: ["ONE_SIZE"],
    date: "2026-03-25",
  },

  {
    id: "gold-necklace",
    name: "Delicate Gold Chain",
    price: 135,
    category: "accessories",
    composition: COMP.SILVER,
    description:
      "18k Gold plated sterling silver. A whisper-thin chain to catch the light.",

    variants: [
      {
        id: "necklace-yellow",
        color: "yellow",
        img: "/images/gold-necklace-6.jpg",
      },
    ],

    defaultVariant: "necklace-yellow",
    sizes: ["ONE_SIZE"],
    date: "2026-03-25",
  },

  {
    id: "canvas-tote",
    name: "Lune Canvas Tote",
    price: 45,
    category: "accessories",
    composition: COMP.COTTON,
    description:
      "Heavyweight organic cotton canvas with embroidered logo. Your companion for market days.",

    variants: [
      {
        id: "tote-ivory",
        color: "ivory",
        img: "/images/canvas-tote.jpg",
      },
    ],

    defaultVariant: "tote-ivory",
    sizes: ["ONE_SIZE"],
    date: "2026-03-10",
  },

  {
    id: "leather-tote",
    name: "Soft Leather Tote",
    price: 210,
    category: "accessories",
    composition: COMP.LEATHER,
    description:
      "Unstructured pebble-grain leather. Spaciously designed to carry your whole world.",

    variants: [
      {
        id: "leather-tote-black",
        color: "black",
        img: "/images/leather-tote-2.jpg",
      },
    ],

    defaultVariant: "leather-tote-black",
    sizes: ["ONE_SIZE"],
    date: "2026-03-10",
  },
];
