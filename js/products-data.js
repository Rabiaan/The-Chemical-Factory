/* ============================================================
   THE CHEMICAL FACTORY — product catalog data
   Images are stored locally in ./images
   ============================================================ */
window.TCF_PRODUCTS = (function () {
  var IMG = {
    img01: 'images/img-01.jpg',
    img02: 'images/img-02.jpg',
    img03: 'images/img-03.jpg',
    img04: 'images/img-04.jpg',
    img05: 'images/img-05.jpg',
    img06: 'images/img-06.jpg',
    img07: 'images/img-07.jpg',
    img08: 'images/img-08.jpg',
    img09: 'images/img-09.jpg',
    img10: 'images/img-10.jpg',
    img11: 'images/img-11.jpg'
  };

  var categories = [
    { id: 'coatings', name: 'Waterproofing Coatings' },
    { id: 'diluters', name: 'Diluters & Solvents' },
    { id: 'repellents', name: 'Water Repellents' },
    { id: 'sealants', name: 'Sealants & Gap Fillers' },
    { id: 'admixtures', name: 'Admixtures & Hardeners' },
    { id: 'membranes', name: 'Geomembranes & Liners' }
  ];

  var products = [
    {
      id: 'mega-clear-guard', name: 'MEGA CLEAR GUARD',
      subTitle: 'Clear Transparent Single Component Acrylic Waterproof Coating',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Transparent & Acrylic',
      priceDisplay: 'Rs 44,252.73', minPrice: 44252.73, maxPrice: 44252.73,
      originalMinPrice: 46465.36, onSale: true, saleDiscount: '5% OFF',
      rating: 4.9, reviewCount: 42, image: IMG.img01, badge: 'Popular',
      description: 'A premium 100% aliphatic clear transparent acrylic waterproof glaze. Formulated for sealing glazed tiles, marble roofs, terrazzo, and decorative architectural surfaces without altering the underlying natural aesthetics.',
      keyFeatures: [
        '100% Optical clarity & non-yellowing UV resistance',
        'Seamless water impermeable barrier over tile joints',
        'Chemical resistance against acid rain and saline breeze',
        'Single component ready to apply by roller or spray'
      ],
      applications: ['Glazed roof tiles', 'Marble & terrazzo roofs', 'Exterior fair-face concrete', 'Balconies and terraces'],
      coverage: '60 – 75 sq.ft / Liter (2 coats)',
      curingTime: 'Touch dry: 45 mins | Full cure: 24 hours',
      variants: [
        { size: '4 Liter Can', price: 9850, originalPrice: 10350, unit: 'Can' },
        { size: '10 Liter Bucket', price: 23200, originalPrice: 24400, unit: 'Bucket' },
        { size: '20 Liter Drum', price: 44252.73, originalPrice: 46465.36, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: '100% Pure Aliphatic Acrylic', elongation: '250%', tensileStrength: '2.8 N/mm²', temperatureResistance: '-20°C to +85°C', vocContent: '< 45 g/L', shelfLife: '24 Months in sealed container' }
    },
    {
      id: 'mega-flex', name: 'MEGA FLEX',
      subTitle: 'Synthetic Rubberized Bitumen Waterproof Coating & Sealant',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Rubberized Bitumen',
      priceDisplay: 'Rs 718.44 – Rs 7,302.35', minPrice: 718.44, maxPrice: 7302.35,
      onSale: true, saleDiscount: 'Special Offer',
      rating: 4.8, reviewCount: 38, image: IMG.img02,
      description: 'High-grade elastomer-modified bitumen liquid membrane with extreme elasticity (over 800%). Penetrates deeply into micro-fissures and forms a vulcanized rubber seal impervious to standing water.',
      keyFeatures: [
        '> 800% Rubber elongation with active crack-bridging',
        'Cold-applied, zero hazardous heating required',
        'Root-resistant formulation for green roof landscaping',
        'Resistant to soil acids, sulfates, and chlorides'
      ],
      applications: ['Foundation walls & retaining structures', 'Under-tile wet rooms & bathrooms', 'Planter boxes & green roofs', 'Corrugated metal roof seams'],
      coverage: '12 – 15 sq.ft / Kg per coat (2-3 coats recommended)',
      curingTime: 'Touch dry: 2 hours | Final cure: 48 hours',
      variants: [
        { size: '1 Kg Tub', price: 718.44, unit: 'Tub' },
        { size: '4 Kg Bucket', price: 1850.0, unit: 'Bucket' },
        { size: '10 Kg Bucket', price: 4120.0, unit: 'Bucket' },
        { size: '20 Kg Drum', price: 7302.35, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'SBS Polymer Modified Bitumen', elongation: '850%', tensileStrength: '1.9 N/mm²', temperatureResistance: '-15°C to +90°C', vocContent: '< 30 g/L', shelfLife: '18 Months' }
    },
    {
      id: 'mega-prime', name: 'MEGA PRIME',
      subTitle: 'Bitumen Emulsion Waterproof Protective Coating & Primer',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Bitumen Emulsion',
      priceDisplay: 'Rs 932.00 – Rs 37,472.50', minPrice: 932.0, maxPrice: 37472.5,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.7, reviewCount: 29, image: IMG.img03,
      description: 'Fast-drying water-based bituminous primer and damp-proof coating. Designed for deep penetration into porous concrete, brickwork, and mortar substrates prior to membrane installation.',
      keyFeatures: [
        'Exceptional bonding power on green and damp concrete',
        'Zero odor, non-flammable water-based emulsion',
        'Seals concrete capillary pores against moisture vapor',
        'Economical heavy duty coverage'
      ],
      applications: ['Concrete slab priming', 'Pre-cast culverts and pipes', 'Underground masonry tanking', 'Bridge abutments'],
      coverage: '25 – 35 sq.ft / Liter (1 coat priming)',
      curingTime: 'Touch dry: 30 mins | Recoat: 2 hours',
      variants: [
        { size: '1 Liter Can', price: 932.0, unit: 'Can' },
        { size: '5 Liter Bucket', price: 4200.0, unit: 'Bucket' },
        { size: '20 Liter Drum', price: 14850.0, unit: 'Drum' },
        { size: '200 Liter Industrial Barrel', price: 37472.5, unit: 'Barrel' }
      ],
      technicalSpecs: { basePolymer: 'Anionic Bitumen Emulsion', elongation: '300%', tensileStrength: '1.2 N/mm²', temperatureResistance: '0°C to +80°C', shelfLife: '12 Months' }
    },
    {
      id: 'mega-shield-base', name: 'MEGA SHIELD BASE',
      subTitle: 'Heat Proof & UV Reflective Acrylic Waterproof Coating',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Heat Proof & Reflective',
      priceDisplay: 'Rs 3,309.35 – Rs 36,191.10', minPrice: 3309.35, maxPrice: 36191.1,
      onSale: true, saleDiscount: 'Top Rated',
      rating: 5.0, reviewCount: 64, image: IMG.img04, badge: 'Solar Cool',
      description: 'Engineered with hollow ceramic micro-spheres and pure crosslinking acrylic resins. Provides 100% monolithic waterproofing while reflecting up to 92% of solar thermal radiation to dramatically cool indoor spaces.',
      keyFeatures: [
        'High Solar Reflectance Index (SRI = 108)',
        'Reduces indoor surface roof temperatures by up to 10°C',
        'Cross-linked elastomeric polymer prevents ponding leaks',
        'Resists fungal growth and atmospheric carbonation'
      ],
      applications: ['Commercial and residential flat roofs', 'Industrial metal shed roofs', 'Pre-cast concrete panels', 'Silo & storage dome waterproofing'],
      coverage: '20 – 25 sq.ft / Liter (2 coats for 1mm DFT)',
      curingTime: 'Touch dry: 1 hour | Full mechanical cure: 72 hours',
      variants: [
        { size: '4 Liter Bucket', price: 3309.35, unit: 'Bucket' },
        { size: '10 Liter Bucket', price: 7850.0, unit: 'Bucket' },
        { size: '20 Liter Drum', price: 14950.0, unit: 'Drum' },
        { size: '50 Liter Commercial Drum', price: 36191.1, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'Aliphatic Ceramic Crosslinked Acrylic', elongation: '450%', tensileStrength: '3.2 N/mm²', temperatureResistance: '-25°C to +110°C', vocContent: '< 20 g/L' }
    },
    {
      id: 'mega-shield-primer', name: 'MEGA SHIELD PRIMER',
      subTitle: 'Heat Proof & UV Reflective Primer for Thermal Systems',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Heat Proof & Reflective',
      priceDisplay: 'Rs 1,482.25 – Rs 13,497.55', minPrice: 1482.25, maxPrice: 13497.55,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.8, reviewCount: 22, image: IMG.img05,
      description: 'High-performance micro-penetrating bonding primer formulated specifically as the preparatory foundation layer for MEGA SHIELD thermal reflective coatings.',
      keyFeatures: [
        'Alkali resistant locking primer for fresh concrete',
        'Improves adhesion strength of topcoats by 300%',
        'Seals surface micro-fissures against thermal shock'
      ],
      applications: ['Concrete roof priming before cool-roof application', 'Corrugated asbestos and cement sheet priming'],
      coverage: '45 – 55 sq.ft / Liter',
      curingTime: 'Touch dry: 30 mins | Topcoat window: 2 to 6 hours',
      variants: [
        { size: '1 Liter Can', price: 1482.25, unit: 'Can' },
        { size: '4 Liter Bucket', price: 4850.0, unit: 'Bucket' },
        { size: '15 Liter Drum', price: 13497.55, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'Hydrophobic Acrylic Co-polymer', shelfLife: '24 Months' }
    },
    {
      id: 'mega-water-guard-base', name: 'MEGA WATER GUARD BASE',
      subTitle: 'Single Component Acrylic Based Elastomeric Coating',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Elastomeric Acrylic',
      priceDisplay: 'Rs 2,807.20 – Rs 34,472.90', minPrice: 2807.2, maxPrice: 34472.9,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.9, reviewCount: 51, image: IMG.img06, badge: 'Heavy Duty',
      description: 'Heavy duty, fiber-reinforced 1-component elastomeric membrane. Creates a rubber-like, crack-bridging seamless membrane over complex roof geometries, parapet flashings, and expansion points.',
      keyFeatures: [
        '550% Dynamic elongation that flexes with building movement',
        'Integrated micro-fibers for enhanced tensile tear resistance',
        'UV, ozone, and acid rain resilient',
        'Can be tinted to architectural specifications'
      ],
      applications: ['Exposed concrete rooftops', 'Parapet walls and flashings', 'Terraces, balconies and gutters', 'Metal roof fastener sealing'],
      coverage: '18 – 22 sq.ft / Liter (2 coats)',
      curingTime: 'Touch dry: 1 hour | Recoat: 4 hours',
      variants: [
        { size: '4 Liter Bucket', price: 2807.2, unit: 'Bucket' },
        { size: '10 Liter Bucket', price: 6950.0, unit: 'Bucket' },
        { size: '20 Liter Drum', price: 13450.0, unit: 'Drum' },
        { size: '50 Liter Drum', price: 34472.9, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'Pure Acrylic Elastomer', elongation: '550%', tensileStrength: '3.5 N/mm²', temperatureResistance: '-20°C to +95°C' }
    },
    {
      id: 'mega-water-guard-primer', name: 'MEGA WATER GUARD PRIMER',
      subTitle: 'Single Component Primer for Acrylic Elastomeric Systems',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Elastomeric Acrylic',
      priceDisplay: 'Rs 1,739.38 – Rs 22,947.65', minPrice: 1739.38, maxPrice: 22947.65,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.7, reviewCount: 19, image: IMG.img07,
      description: 'High penetration nano-acrylic primer that locks into porous mortar, screeds, and weathered concrete to ensure indestructible bonding with elastomeric top coats.',
      keyFeatures: [
        'Nano-particle dispersion for deep substrate saturation',
        'Tack-free finish prevents dirt pickup during application',
        'Reduces topcoat consumption by up to 25%'
      ],
      applications: ['Concrete roof slabs', 'Cement sand screeds', 'Masonry and brick parapets'],
      coverage: '50 – 60 sq.ft / Liter',
      curingTime: 'Touch dry: 30 mins | Recoat: 2 hours',
      variants: [
        { size: '1 Liter Can', price: 1739.38, unit: 'Can' },
        { size: '5 Liter Bucket', price: 5400.0, unit: 'Bucket' },
        { size: '20 Liter Drum', price: 22947.65, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'Styrene-Acrylic Co-polymer', shelfLife: '24 Months' }
    },
    {
      id: 'mega-water-lock', name: 'MEGA WATER LOCK',
      subTitle: 'Surface Applied Integral Crystalline Waterproofing Coating',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Crystalline',
      priceDisplay: 'Rs 3,912.50 – Rs 19,562.50', minPrice: 3912.5, maxPrice: 19562.5,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.9, reviewCount: 47, image: IMG.img08, badge: 'Crystalline Tech',
      description: 'Advanced catalytic crystalline formulation that migrates deep into concrete capillaries in the presence of moisture. Generates non-soluble dendritic crystals that permanently seal pores and auto-heal micro-cracks up to 0.5mm.',
      keyFeatures: [
        'Active self-healing mechanism for future cracks',
        'Resists hydrostatic head pressure exceeding 12 Bar',
        'Effective for both positive and negative water pressure',
        'Permanent non-degrading inorganic crystal matrix'
      ],
      applications: ['Water storage tanks & reservoirs', 'Basement retaining walls (interior/exterior)', 'Lift pits, tunnels and culverts', 'Swimming pools and sewage treatment plants'],
      coverage: '10 – 12 sq.ft / Kg (2 coats at 1.5kg/m²)',
      curingTime: 'Requires moist curing for 48 hours | Full crystal maturation: 28 days',
      variants: [
        { size: '5 Kg Bucket', price: 3912.5, unit: 'Bucket' },
        { size: '10 Kg Bucket', price: 7450.0, unit: 'Bucket' },
        { size: '25 Kg Bag / Drum', price: 19562.5, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'Catalytic Portland Cementitious Crystalline', tensileStrength: 'Positive & Negative Pressure > 1.2 MPa', temperatureResistance: '-40°C to +130°C' }
    },
    {
      id: 'mega-water-seal', name: 'MEGA WATER SEAL',
      subTitle: 'Two Component Acrylic Polymer Modified Cementitious Coating',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Acrylic Cementitious',
      priceDisplay: 'Rs 1,787.50 – Rs 7,996.59', minPrice: 1787.5, maxPrice: 7996.59,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.9, reviewCount: 88, image: IMG.img09, badge: 'Best Seller',
      description: 'Pre-packaged 2-component waterproofing slurry consisting of a liquid polymer emulsion (Part A) and specially graded hydraulic cements with active additives (Part B). Ideal for wet areas and water storage.',
      keyFeatures: [
        'Certified non-toxic for potable drinking water contact',
        'High bond strength to damp concrete substrates (> 1.5 N/mm²)',
        'Prevents water seepage under continuous immersion',
        'Easy 2-part mixing and smooth brush application'
      ],
      applications: ['Underground & overhead water tanks', 'Bathrooms, kitchens and washrooms', 'Balcony screeds & damp basements', 'Fountains and swimming pools'],
      coverage: '12 – 15 sq.ft / Kg per 2 coats (2mm total DFT)',
      curingTime: 'Pot life: 45 mins | Initial set: 4 hours | Water fill test: 7 days',
      variants: [
        { size: '5 Kg Kit (Liquid + Powder)', price: 1787.5, unit: 'Kit' },
        { size: '10 Kg Kit', price: 3450.0, unit: 'Kit' },
        { size: '25 Kg Heavy Kit', price: 7996.59, unit: 'Kit' }
      ],
      technicalSpecs: { basePolymer: 'Acrylic Copolymer + Hydraulic Cements', elongation: '180%', tensileStrength: '2.5 N/mm²', waterImmersion: 'Tested to 50m head of water' }
    },
    {
      id: 'mega-water-seal-pro', name: 'MEGA WATER SEAL PRO',
      subTitle: 'Two Component High-Flexibility Acrylic Cementitious Waterproofing',
      category: 'coatings', categoryLabel: 'Waterproofing Coatings', subCategory: 'Acrylic Cementitious',
      priceDisplay: 'Rs 2,887.50 – Rs 13,039.26', minPrice: 2887.5, maxPrice: 13039.26,
      onSale: true, saleDiscount: 'Pro Grade',
      rating: 5.0, reviewCount: 76, image: IMG.img03, badge: 'Pro Grade',
      description: 'Industrial grade 2-component flexible cementitious slurry with enhanced polymer ratio. Engineered for structures subjected to dynamic structural movement, vibration, and thermal expansion.',
      keyFeatures: [
        'Over 220% High flexibility with crack bridging up to 2mm',
        'Withstands high positive and negative hydrostatic pressure',
        'Protects rebar from carbonation and chloride ion attack',
        'Suitable for direct tiling without bond breakers'
      ],
      applications: ['Podium slabs & parking decks', 'Suspended swimming pools', 'High-rise foundation waterproofing', 'Bridge decks & railway culverts'],
      coverage: '10 – 14 sq.ft / Kg (2 coats at 2.5mm DFT)',
      curingTime: 'Pot life: 60 mins | Full immersion cure: 5 days',
      variants: [
        { size: '6 Kg Pro Kit', price: 2887.5, unit: 'Kit' },
        { size: '12 Kg Pro Kit', price: 5490.0, unit: 'Kit' },
        { size: '30 Kg Pro Industrial Kit', price: 13039.26, unit: 'Kit' }
      ],
      technicalSpecs: { basePolymer: 'High Solid Acrylic Latex + Micro Silica Cements', elongation: '240%', tensileStrength: '3.8 N/mm²', hydrostaticResistance: '> 7 Bar' }
    },
    {
      id: 'mega-hybrid-dilutor-502', name: 'MEGA HYBRID DILUTOR 502 (FOR BITUMEN PRODUCTS)',
      subTitle: 'Specialized Hybrid Dilution Solvent for Bituminous Coatings',
      category: 'diluters', categoryLabel: 'Diluters & Solvents', subCategory: 'Bitumen Diluters',
      priceDisplay: 'Rs 400.00 – Rs 3,612.50', minPrice: 400.0, maxPrice: 3612.5,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.8, reviewCount: 16, image: IMG.img10,
      description: 'High-purity hydrocarbon diluter engineered specifically for thinning solvent-based bitumen primers, coatings, and heavy mastics while optimizing spray atomization and surface penetration.',
      keyFeatures: [
        'Controlled evaporation rate prevents blistering',
        'Restores viscosity of thickened bituminous products',
        'Heavy-duty tool and spray machine cleaner'
      ],
      applications: ['Bitumen primer thinning (5-15%)', 'Spray machine flushing', 'Cleaning rollers and bitumen tools'],
      coverage: 'Use as directed: 5% to 15% by volume',
      curingTime: 'Fast evaporating',
      variants: [
        { size: '500 ml Bottle', price: 400.0, unit: 'Bottle' },
        { size: '1 Liter Bottle', price: 750.0, unit: 'Bottle' },
        { size: '5 Liter Can', price: 3612.5, unit: 'Can' }
      ],
      technicalSpecs: { basePolymer: 'Aromatic Hydrocarbon Fraction', specificGravity: '0.86 g/cm³', shelfLife: '36 Months' }
    },
    {
      id: 'mega-hybrid-dilutor-503', name: 'MEGA HYBRID DILUTOR 503 (FOR PU PRODUCTS)',
      subTitle: 'Pure Solvent Diluter for Polyurethane Liquid Membranes & Sealants',
      category: 'diluters', categoryLabel: 'Diluters & Solvents', subCategory: 'PU Diluters',
      priceDisplay: 'Rs 731.25 – Rs 7,275.00', minPrice: 731.25, maxPrice: 7275.0,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.9, reviewCount: 23, image: IMG.img11,
      description: 'Moisture-free virgin grade thinner formulated specifically for polyurethane (PU) waterproofing coatings, injection resins, and joint sealants without interfering with isocyanate crosslinking.',
      keyFeatures: [
        'Moisture content < 0.05% to avoid foaming in PU resin',
        'Enhances flowability and leveling on large deck pours',
        'Leaves zero residue on application equipment'
      ],
      applications: ['PU liquid membrane dilution (max 10%)', 'Airless spray gun nozzle maintenance', 'Surface degreasing before PU coating'],
      coverage: '5% to 10% by volume per coat',
      curingTime: 'Rapid flash-off',
      variants: [
        { size: '500 ml Bottle', price: 731.25, unit: 'Bottle' },
        { size: '1 Liter Bottle', price: 1450.0, unit: 'Bottle' },
        { size: '5 Liter Can', price: 7275.0, unit: 'Can' }
      ],
      technicalSpecs: { basePolymer: 'Anhydrous Ester Solvent Complex', shelfLife: '24 Months in sealed containers' }
    },
    {
      id: 'mega-hybrid-dilutor-504', name: 'MEGA HYBRID DILUTOR 504 (FOR ACRYLIC PRODUCTS)',
      subTitle: 'High Grade Acrylic Polymer Thinner & Tool Cleaner',
      category: 'diluters', categoryLabel: 'Diluters & Solvents', subCategory: 'Acrylic Diluters',
      priceDisplay: 'Rs 600.00 – Rs 5,412.50', minPrice: 600.0, maxPrice: 5412.5,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.7, reviewCount: 14, image: IMG.img10,
      description: 'Pure coalescing agent and diluter for high-solid acrylic waterproof membranes. Ensures smooth pinhole-free film formation even under high temperature and windy roof conditions.',
      keyFeatures: [
        'Prevents skinning and dry-spray under hot sunlight',
        'Optimizes wet edge time for roller application',
        'Gentle on synthetic application fibers'
      ],
      applications: ['Acrylic coating thinning for first coat penetration', 'Washing airless spray hoses'],
      coverage: '5% to 8% dilution',
      curingTime: 'Controlled coalescence',
      variants: [
        { size: '500 ml Bottle', price: 600.0, unit: 'Bottle' },
        { size: '1 Liter Bottle', price: 1150.0, unit: 'Bottle' },
        { size: '5 Liter Can', price: 5412.5, unit: 'Can' }
      ],
      technicalSpecs: { basePolymer: 'Glycol Ether Coalescing Solvent', shelfLife: '24 Months' }
    },
    {
      id: 'mega-solvent-diluter-805', name: 'MEGA SOLVENT DILUTER 805',
      subTitle: 'Heavy Duty Universal Chemical Solvent & Equipment Purge',
      category: 'diluters', categoryLabel: 'Diluters & Solvents', subCategory: 'Universal Solvents',
      priceDisplay: 'Rs 1,431.25 – Rs 13,596.25', minPrice: 1431.25, maxPrice: 13596.25,
      onSale: true, saleDiscount: 'Sale!',
      rating: 4.9, reviewCount: 18, image: IMG.img11, badge: 'Industrial Grade',
      description: 'Aggressive industrial purging solvent for dissolving cured epoxies, polyurethanes, acrylics, and dried bitumen residue from mixing buckets, high-pressure pumps, and equipment.',
      keyFeatures: [
        'Rapid breakdown of stubborn polymer binders',
        'Non-corrosive to stainless steel and brass spray tips',
        'Fast evaporating with zero sticky residue'
      ],
      applications: ['Heavy equipment stripping', 'Purging 2-component chemical injection pumps', 'Industrial floor grease decontamination'],
      coverage: 'N/A (Cleaning & Purging)',
      curingTime: 'Instant solvent action',
      variants: [
        { size: '1 Liter Bottle', price: 1431.25, unit: 'Bottle' },
        { size: '4 Liter Can', price: 5200.0, unit: 'Can' },
        { size: '10 Liter Drum', price: 13596.25, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'High-Strength Ketone-Aromatic Blend', shelfLife: '36 Months' }
    },
    {
      id: 'mega-siloxane-101', name: 'MEGA WATER REPELLENT SILOXANE 101',
      subTitle: 'Deep Penetrating Silane-Siloxane Hydrophobic Impregnation',
      category: 'repellents', categoryLabel: 'Water Repellents', subCategory: 'Siloxane Based',
      priceDisplay: 'Rs 1,850.00 – Rs 16,200.00', minPrice: 1850.0, maxPrice: 16200.0,
      onSale: true, saleDiscount: 'Hydrophobic',
      rating: 4.9, reviewCount: 35, image: IMG.img01, badge: 'Nano Shield',
      description: 'Silane-Siloxane based invisible hydrophobic impregnating sealer. Chemically bonds with silica in porous masonry, creating an intense lotus-leaf beading effect while maintaining 100% vapor permeability.',
      keyFeatures: [
        'Instant water beading with zero sheen or color change',
        'Prevents efflorescence, salt blooming, and moss growth',
        '100% Breathable — allows entrapped moisture to escape',
        'Resistant to alkali attack and UV degradation'
      ],
      applications: ['Exposed red brick facades', 'Natural stone, sandstone & travertine', 'Exterior plaster and fair-face concrete', 'Heritage masonry preservation'],
      coverage: '40 – 60 sq.ft / Liter (depending on porosity)',
      curingTime: 'Water beading in 2 hours | Full hydrophobicity: 24 hours',
      variants: [
        { size: '1 Liter Can', price: 1850.0, unit: 'Can' },
        { size: '5 Liter Can', price: 8200.0, unit: 'Can' },
        { size: '10 Liter Can', price: 16200.0, unit: 'Can' }
      ],
      technicalSpecs: { basePolymer: 'Oligomeric Silane-Siloxane Hybrid', penetrationDepth: '3mm to 8mm into substrate', vaporPermeability: 'Class I (Breathable)', shelfLife: '24 Months' }
    },
    {
      id: 'mega-gap-fix-150', name: 'MEGA GAP-FIX (150 ML TUBE)',
      subTitle: 'Elastomeric Crack Filler & Fast Repair Cartridge',
      category: 'sealants', categoryLabel: 'Sealants & Gap Fillers', subCategory: 'Gap Fillers',
      priceDisplay: 'Rs 1,562.50', minPrice: 1562.5, maxPrice: 1562.5,
      originalMinPrice: 1640.63, onSale: true, saleDiscount: '5% OFF',
      rating: 4.8, reviewCount: 62, image: IMG.img07, badge: 'Quick Fix',
      description: 'Ready-to-use high-elasticity acrylic-polymer gap and crack sealant in an easy-squeeze nozzle tube. Perfect for sealing plaster hairline cracks, window frame joints, and door trims before painting.',
      keyFeatures: [
        'Paintable with water & oil based paints in 60 mins',
        'Non-shrinking, non-slumping formula',
        'Flexible sealant accommodates ±15% joint movement',
        'Excellent adhesion to plaster, gypsum, wood and concrete'
      ],
      applications: ['Wall & ceiling crack repair', 'Door & window frame perimeter sealing', 'Baseboard gap filling', 'Sanitary gaps'],
      coverage: '12 – 15 running meters per 150ml tube (5x5mm joint)',
      curingTime: 'Skin over: 15 mins | Sandable/Paintable: 2 hours',
      variants: [
        { size: '150 ml Squeeze Tube', price: 1562.5, originalPrice: 1640.63, unit: 'Tube' },
        { size: 'Box of 12 Tubes', price: 17500.0, originalPrice: 18600.0, unit: 'Box' }
      ],
      technicalSpecs: { basePolymer: 'High Elasticity Acrylic Latex', jointMovement: '± 15%', temperatureResistance: '-10°C to +75°C' }
    },
    {
      id: 'mega-mesh-binder', name: 'MEGA MESH BINDER (REINFORCEMENT FABRIC)',
      subTitle: 'Alkali-Resistant Woven Glass Fiber Reinforcement Mesh (145 g/m²)',
      category: 'sealants', categoryLabel: 'Sealants & Gap Fillers', subCategory: 'Reinforcement Fabric',
      priceDisplay: 'Rs 10,850.00 – Rs 43,400.00', minPrice: 10850.0, maxPrice: 43400.0,
      onSale: true, saleDiscount: 'Pro Pack',
      rating: 5.0, reviewCount: 41, image: IMG.img02,
      description: 'High tensile woven fiberglass fabric with alkali-resistant zirconium coating. Embedded between coating layers to bridge live structural cracks, corners, and expansion joints.',
      keyFeatures: [
        'Alkali resistant (does not rot inside cementitious coatings)',
        'High tensile strength (> 1600 N/5cm)',
        'Flexible open-weave conforms easily to 90° pipe penetrations'
      ],
      applications: ['Roof membrane reinforcement', 'Corner fillets & parapet transitions', 'Expansion joint bridging'],
      coverage: '50m² or 100m² roll coverage',
      curingTime: 'Embedded wet-on-wet',
      variants: [
        { size: '25 Meter Roll (1m width)', price: 10850.0, unit: 'Roll' },
        { size: '50 Meter Roll (1m width)', price: 21500.0, unit: 'Roll' },
        { size: '100 Meter Full Contractor Roll', price: 43400.0, unit: 'Roll' }
      ],
      technicalSpecs: { basePolymer: 'Zirconia Alkali Resistant Glass Fiber', weight: '145 g/m²', tensileStrength: '1650 N / 50 mm' }
    },
    {
      id: 'panda-seal-760', name: 'PANDA SEAL 760 (20KG BUCKET)',
      subTitle: 'High Performance Industrial Polyurethane Joint Sealant & Mastic',
      category: 'sealants', categoryLabel: 'Sealants & Gap Fillers', subCategory: 'Polyurethane Sealants',
      priceDisplay: 'Rs 12,062.50', minPrice: 12062.5, maxPrice: 12062.5,
      originalMinPrice: 12665.63, onSale: true, saleDiscount: '5% OFF',
      rating: 4.9, reviewCount: 33, image: IMG.img08, badge: 'Heavy Duty',
      description: 'Heavy duty elastomeric polyurethane expansion joint sealant with ±25% joint movement capability. Unmatched weather, fuel, and chemical resistance for industrial concrete pavements.',
      keyFeatures: [
        'High elasticity with ±25% dynamic expansion movement',
        'Resistant to jet fuels, diesel, and industrial detergents',
        'Bubble-free curing even in high humidity',
        'High mechanical abrasion resistance'
      ],
      applications: ['Warehouse concrete floor expansion joints', 'Airport runway & highway joint sealing', 'Pre-cast concrete facade joints', 'Water treatment plant joints'],
      coverage: 'Approx 35 – 45 linear meters per bucket (10x10mm joint)',
      curingTime: 'Tack free: 90 mins | Full cure: 3mm per 24 hours',
      variants: [{ size: '20 Kg Bucket', price: 12062.5, originalPrice: 12665.63, unit: 'Bucket' }],
      technicalSpecs: { basePolymer: '1-Component Polyurethane Elastomer', shoreHardness: 'Shore A 35', jointMovement: '± 25%', elongation: '> 600%' }
    },
    {
      id: 'panda-seal-750', name: 'PANDA SEAL 750 (20KG BUCKET)',
      subTitle: 'Rubberized Bitumen Expansion Joint Pouring Mastic',
      category: 'sealants', categoryLabel: 'Sealants & Gap Fillers', subCategory: 'Bitumen Mastics',
      priceDisplay: 'Rs 3,237.50', minPrice: 3237.5, maxPrice: 3237.5,
      originalMinPrice: 3399.38, onSale: true, saleDiscount: '5% OFF',
      rating: 4.8, reviewCount: 27, image: IMG.img02,
      description: 'Cold-applied rubberized bitumen mastic for horizontal concrete joint sealing, canal lining joints, and bridge approach slabs. Adheres firmly and remains flexible throughout temperature fluctuations.',
      keyFeatures: [
        'Cold applied — eliminates dangerous heating kettles',
        'Excellent slump resistance in vertical & horizontal joints',
        'Immune to biological and root degradation'
      ],
      applications: ['Irrigation canal joints', 'Basement slab construction joints', 'Foundation perimeter sealing'],
      coverage: 'Approx 40 meters per 20kg bucket',
      curingTime: 'Initial set: 4 hours | Full cure: 48 hours',
      variants: [{ size: '20 Kg Bucket', price: 3237.5, originalPrice: 3399.38, unit: 'Bucket' }],
      technicalSpecs: { basePolymer: 'Polymer Modified Bitumen Mastic', softeningPoint: '> 95°C', shelfLife: '18 Months' }
    },
    {
      id: 'mega-add-mix-116', name: 'MEGA ADD-MIX 116',
      subTitle: 'Integral Waterproofing & High-Range Water Reducing Admixture (2000-3000 PSI)',
      category: 'admixtures', categoryLabel: 'Admixtures & Hardeners', subCategory: 'Integral Admixtures',
      priceDisplay: 'Rs 318.75 – Rs 52,500.00', minPrice: 318.75, maxPrice: 52500.0,
      onSale: true, saleDiscount: 'Factory Price',
      rating: 4.9, reviewCount: 58, image: IMG.img01, badge: 'Site Essential',
      description: 'Liquid chemical admixture that reduces water demand by up to 15% while plastifying the mix and creating a hydrophobic capillary network within cured concrete (2000 to 3000 PSI strength classes).',
      keyFeatures: [
        'Reduces concrete permeability by up to 60%',
        'Eliminates bleed water and honeycombing in structural concrete',
        'Improves compressive strength by 15-20%',
        'Chloride-free — 100% safe for post-tensioned and reinforced concrete'
      ],
      applications: ['RCC roof slabs, columns and beams', 'Basement raft foundations & retaining walls', 'Plaster mortars and screeds', 'Pre-cast concrete products'],
      coverage: 'Dosage: 150ml to 250ml per 50kg bag of cement',
      curingTime: 'Normal concrete setting time',
      variants: [
        { size: '1 Liter Can', price: 318.75, unit: 'Can' },
        { size: '5 Liter Can', price: 1450.0, unit: 'Can' },
        { size: '20 Liter Drum', price: 5400.0, unit: 'Drum' },
        { size: '210 Liter Industrial Drum', price: 52500.0, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'Modified Lignosulfonate & Hydrophobic Surfactants', chlorideContent: '< 0.1% (Chloride Free)', specificGravity: '1.16 ± 0.02' }
    },
    {
      id: 'mega-add-mix-694', name: 'MEGA ADD-MIX 694',
      subTitle: 'Superplasticizer & Permeability Reducing Concrete Admixture (4000-5000 PSI)',
      category: 'admixtures', categoryLabel: 'Admixtures & Hardeners', subCategory: 'High Performance Admixtures',
      priceDisplay: 'Rs 368.75 – Rs 49,875.00', minPrice: 368.75, maxPrice: 49875.0,
      onSale: true, saleDiscount: 'Pro Mix',
      rating: 5.0, reviewCount: 44, image: IMG.img08, badge: 'High PSI',
      description: 'High-range polycarboxylate ether (PCE) superplasticizer and crystalline water-tightness enhancer for high-grade structural concrete (4000 to 5000+ PSI). Allows high slump retention with ultra-low water-cement ratio.',
      keyFeatures: [
        'Up to 30% water reduction with self-compacting concrete flow',
        'Dense micro-structure stops water ingress under 10 Bar pressure',
        'Significantly accelerates early 3-day and 28-day strengths'
      ],
      applications: ['High-rise tower foundations', 'Bridge piers and marine concrete', 'Ready-mix batching plants', 'Water retaining reservoirs'],
      coverage: 'Dosage: 300ml to 800ml per 100kg binder',
      curingTime: 'Controlled workability for 90+ mins',
      variants: [
        { size: '1 Liter Can', price: 368.75, unit: 'Can' },
        { size: '5 Liter Can', price: 1650.0, unit: 'Can' },
        { size: '20 Liter Drum', price: 6200.0, unit: 'Drum' },
        { size: '210 Liter Drum', price: 49875.0, unit: 'Drum' }
      ],
      technicalSpecs: { basePolymer: 'Polycarboxylate Ether (PCE) Polymer', specificGravity: '1.08 ± 0.02', standards: 'ASTM C494 Type F & G / BS 5075' }
    },
    {
      id: 'modified-bitumen-membrane-aluminum', name: 'MODIFIED BITUMEN MEMBRANE ALUMINUM (4MM)',
      subTitle: 'APP Torch-Applied Waterproofing Membrane with Embossed Aluminum Foil Face',
      category: 'membranes', categoryLabel: 'Geomembranes & Liners', subCategory: 'Bitumen Membranes',
      priceDisplay: 'Rs 9,875.00 – Rs 11,125.00', minPrice: 9875.0, maxPrice: 11125.0,
      onSale: true, saleDiscount: 'Torch On',
      rating: 4.9, reviewCount: 39, image: IMG.img04, badge: 'Heavy Shield',
      description: 'Premium 4.0mm APP modified bitumen sheet reinforced with high-density spunbond polyester mat and faced with a pure embossed reflective aluminum foil. Shields the membrane from intense solar UV and punctures.',
      keyFeatures: [
        'Reflective aluminum face rejects 85% of solar heat',
        'High puncture and static load puncture resistance',
        '100% Impermeable barrier against standing rainwater',
        'Torched seam welding creates monolithic fused joints'
      ],
      applications: ['Industrial flat roofs without top screed', 'Sloped metal roofs and gutters', 'Parapet capping and flashings'],
      coverage: '10 sq. meters per roll (1m x 10m)',
      curingTime: 'Instant upon torch-bonding and cooling',
      variants: [
        { size: '3.0mm Aluminum Foil Roll (10m²)', price: 9875.0, unit: 'Roll' },
        { size: '4.0mm Heavy Duty Aluminum Foil Roll (10m²)', price: 11125.0, unit: 'Roll' }
      ],
      technicalSpecs: { basePolymer: 'APP Modified Bitumen with Non-Woven Polyester Carrier', thickness: '4.0 mm ± 0.2mm', softeningPoint: '> 150°C', tensileStrength: '800 N/5cm Longitudinal / 650 N/5cm Transverse' }
    },
    {
      id: 'pvc-geomembrane-sheet-050', name: 'PVC GEOMEMBRANE SHEET (0.50MM)',
      subTitle: 'Flexible Virgin PVC Waterproofing Liner for Reservoirs & Basements',
      category: 'membranes', categoryLabel: 'Geomembranes & Liners', subCategory: 'PVC Membranes',
      priceDisplay: 'Rs 116.25 / sq ft', minPrice: 116.25, maxPrice: 116.25,
      originalMinPrice: 120.0, onSale: true, saleDiscount: 'Per Sq.Ft',
      rating: 4.8, reviewCount: 26, image: IMG.img02,
      description: 'High-density unreinforced thermoplastic polyvinyl chloride (PVC) geomembrane sheet. Highly flexible, root resistant, and weldable by hot-air leister guns for seamless pond, reservoir, and basement tanking.',
      keyFeatures: [
        'High elongation (> 300%) adapts to differential ground settlement',
        'Resistant to aging, root penetration, and soil chemicals',
        'Hot air or chemical solvent welded seams for 100% leak seal'
      ],
      applications: ['Agricultural water storage ponds', 'Basement blind-side tanking', 'Artificial lakes and canal linings', 'Roof green gardens'],
      coverage: 'Sold per Square Foot (Roll width: 2.1m / 4.0m)',
      curingTime: 'Welded instantly',
      variants: [
        { size: '0.50mm Thickness (Per Sq.Ft)', price: 116.25, originalPrice: 120.0, unit: 'Sq Ft' },
        { size: '1.00mm Thickness (Per Sq.Ft)', price: 195.0, originalPrice: 210.0, unit: 'Sq Ft' },
        { size: '1.50mm Thickness (Per Sq.Ft)', price: 265.0, originalPrice: 285.0, unit: 'Sq Ft' }
      ],
      technicalSpecs: { basePolymer: 'Virgin Polyvinyl Chloride (PVC)', elongationAtBreak: '> 320%', tearResistance: '> 45 N/mm' }
    },
    {
      id: 'hdpe-liner-a-grade', name: 'HDPE LINER (A+ GRADE 1.0MM)',
      subTitle: 'High Density Polyethylene Geomembrane for Pond & Landfill Tanking',
      category: 'membranes', categoryLabel: 'Geomembranes & Liners', subCategory: 'HDPE Liners',
      priceDisplay: 'Rs 145.00 – Rs 280.00 / sq ft', minPrice: 145.0, maxPrice: 280.0,
      onSale: true, saleDiscount: 'Industrial',
      rating: 5.0, reviewCount: 31, image: IMG.img09, badge: 'A+ Grade',
      description: 'Smooth and textured high-density polyethylene (HDPE) geomembrane produced from premium virgin resin with 2.5% carbon black for exceptional UV durability (> 30 years outdoor life).',
      keyFeatures: [
        'Extreme chemical resistance to industrial effluents and leachates',
        'Dual-track hot wedge welding with pressure test channel',
        'Guaranteed zero permeability to toxic liquids'
      ],
      applications: ['Industrial effluent ponds', 'Hazardous waste containment', 'Mining heap leach pads', 'Fish farming aquaculture ponds'],
      coverage: 'Custom roll supply per Sq.Ft / Sq.Meter',
      curingTime: 'Hot wedge seam welded',
      variants: [
        { size: '1.0mm HDPE Liner (Per Sq.Ft)', price: 145.0, unit: 'Sq Ft' },
        { size: '1.5mm Heavy Duty HDPE Liner (Per Sq.Ft)', price: 210.0, unit: 'Sq Ft' },
        { size: '2.0mm Extreme HDPE Liner (Per Sq.Ft)', price: 280.0, unit: 'Sq Ft' }
      ],
      technicalSpecs: { basePolymer: '100% Virgin High Density Polyethylene (HDPE)', carbonBlackContent: '2.0 - 3.0%', density: '0.940 g/cm³', escr: '> 1500 Hours' }
    }
  ];

  return {
    categories: categories,
    products: products
  };
})();
