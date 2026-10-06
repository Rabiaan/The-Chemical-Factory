/* ============================================================
   THE CHEMICAL FACTORY — product catalog data
   Product photography and downloadable datasheets live in
   ./products (WebP + PDF per product).
   Content transcribed from the official product datasheets.
   ============================================================ */
window.TCF_PRODUCTS = (function () {
  'use strict';

  var ASSETS = 'products/';

  /* ---------- Categories ---------- */
  var categories = [
    { id: 'injection', name: 'Injection & Crack Sealing Resins', system: 'sealing' },
    { id: 'cementitious', name: 'Cementitious Waterproof Coatings', system: 'coatings' },
    { id: 'membranes', name: 'Polyurethane Waterproof Membranes', system: 'coatings' },
    { id: 'dampproofing', name: 'Damp Proofing & Bituminous Coatings', system: 'coatings' },
    { id: 'sealants', name: 'Sealants & Joint Sealers', system: 'sealing' },
    { id: 'waterstops', name: 'Hydrophilic Waterstops', system: 'sealing' },
    { id: 'admixtures', name: 'Concrete Admixtures', system: 'concrete' },
    { id: 'grouts', name: 'Grouts & Cementitious Fillers', system: 'repair' },
    { id: 'bonding', name: 'Bonding & Polymer Modification', system: 'repair' }
  ];

  /* ---------- Broader product systems (sidebar filter) ---------- */
  var systems = [
    { id: 'all', name: 'All Systems' },
    { id: 'coatings', name: 'Coatings & Membranes' },
    { id: 'sealing', name: 'Injection & Joint Sealing' },
    { id: 'concrete', name: 'Concrete Admixtures' },
    { id: 'repair', name: 'Grouts, Bonding & Repair' }
  ];

  var DISCLAIMER =
    'The information above reflects The Chemical Factory\'s current knowledge and is provided to assist specifiers '
    + 'and contractors. It does not replace project-specific trials to confirm suitability. Data are typical values '
    + 'under standard conditions; on-site results may vary. Recommendations are offered in good faith without '
    + 'warranty, as factors beyond our control can affect performance. The Chemical Factory may revise '
    + 'specifications without prior notice. Users are responsible for compliance with applicable standards and '
    + 'regulations. Technical assistance is available on request.';

  var products = [
    /* ============================================================
       1. CHEM 2K INJECT PRO
       ============================================================ */
    {
      id: 'chem-2k-inject-pro',
      name: 'CHEM 2K INJECT PRO',
      subTitle: 'Advanced Polyurethane Injection Resin for Active Leak Sealing & Waterproofing',
      category: 'injection',
      categoryLabel: 'Injection & Crack Sealing Resins',
      image: ASSETS + 'Chem-2k-Inject-Pro.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-2k-inject-pro.pdf',
      datasheetKb: 1659,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Active Leak Sealing', 'Pro Grade'],
      highlights: [
        'Stops active water leaks instantly',
        'Excellent penetration into fine cracks and voids',
        'Flexible, durable waterproof barrier',
        'Resistant to hydrostatic pressure'
      ],
      description:
        'Chem 2k Inject Pro effectively stops active leaks and provides permanent, elastic sealing of cracks and '
        + 'construction joints. It is suitable for injection into both dry and wet cracks and can also fill voids. '
        + 'Resistant to hydrostatic pressure and suitable for underground and below grade structures.',
      keyFeatures: [
        'ACTIVE LEAK SEALING',
        'HIGH PENETRATION',
        'FLEXIBLE & DURABLE',
        'FAST REACTION TIME',
        'STRONG WATERPROOFING',
        'FAST & EFFECTIVE INJECTION',
        'LONG LASTING PROTECTION'
      ],
      uses: [
        'Basements and underground structures',
        'Tunnels and retaining walls',
        'Water tanks and reservoirs',
        'Lift pits and elevator shafts',
        'Construction joints and cold joints'
      ],
      packaging: '10 + 10 kg Can',
      coverage: 'Approx. 0.1 gallon / gallon void (foam) \u2022 Approx. 1 gallon / gallon void (solid resin)',
      consumption: [
        'Approx. 0.1 gallon / gallon void (foam)',
        'Approx. 1 gallon / gallon void (solid resin)'
      ],
      guidance:
        '2k Injection is injected until the glue comes out as foam from the next drill hole or the crack\'s surface. '
        + 'Only one product is needed on the jobsite, which provides for easier calculation of required resin quantities.',
      techData: [
        { property: 'Mixing viscosity at 77 \u00B0F (ASTM D-115-72 / ISO 2555)', value: 'approx. 250 cp \u2248 250 mPa.s' },
        { property: 'Volume increase at water contact', value: 'max. 1 : 20' },
        { property: 'Density of the mixture at 68 \u00B0F (DIN 53479)', value: 'approx. 9.18 lb/gal' },
        { property: 'Spec. density of the cured foam (ASTM D 1622)', value: 'approx. 0.05 - 0.1 g/cm\u00B3' },
        { property: 'Starting time at water contact', value: 'approx. 50 sec' },
        { property: 'Expansion time', value: 'approx. 3 min' },
        { property: 'Pot life at 68 \u00B0F, 1 kg of mixture (DIN EN 1504-5)', value: '45 min' },
        { property: 'Reaction time without water contact (at 68 \u00B0F)', value: 'approx. 24 h' },
        { property: 'Non-sticky after', value: 'approx. 6 min' },
        { property: 'Mixing ratio (by weight)', value: '1 : 1 (A : B)' },
        { property: 'Mixing ratio (by volume)', value: '1.2 : 1 (A : B)' },
        { property: 'Packaging', value: '10 + 10 kg Can' }
      ],
      standards: [
        'Tested in accordance with DIN 1048 Water Permeability Test.',
        'Complies with Water Research Council requirements for potable water contact.'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Chem 2k Inject Pro to the concrete mix at recommended dosage. For best result, introduce the '
            + 'injection work, make sure to water or into freshly mixed concrete to ensure uniform dispersion. '
            + 'Do not add directly to dry cement.'
        },
        {
          title: 'Mixing',
          text: 'It is suggested that the A and B parts be mixed at +59\u00B0 using an electrical mixer that spins '
            + 'slowly and ideally has a 2k Inject Pro Resin Stirrer attached.'
        },
        {
          title: 'Uses',
          text: '2k Inject Pro stops active leaks and seals cracks and construction joints permanently and '
            + 'elastically. It can be injected in dry and wet cracks. The material can also be used for filling of voids.'
        },
        {
          title: 'Application',
          text: 'Within ten to fifteen minutes of the first injection, administer 2k Inject Pro as a follow-up. The '
            + 'subsequent injection must be performed during the first injected material\'s pot life. Inject in two '
            + 'phases to fill big, moist spaces. A minimum of one hour must pass between the first and second injections.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store in original, tightly closed containers in a cool, dry place. Keep away from heat, sparks and '
            + 'direct sunlight. Wear protecting gloves and goggles when processing the material. When carrying out '
            + 'injection work, make sure to protect the surrounding work area from injection resin that may be '
            + 'discharged from the wall, packers, drill holes, etc. Do not stand directly behind the packers during injection.'
        },
        {
          title: 'Cleaning of Equipment',
          text: 'Clean spillage and equipment with clean water before the resin hardens or cures. Cured material '
            + 'can only be removed mechanically.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '20 liter (50% A & 50% B)' },
        { label: 'Storage', value: 'Store dry, frost-free, out of direct sunlight' },
        { label: 'Shelf Life', value: '6 months in original packaging' },
        { label: 'Hazard Class', value: 'Non-hazardous goods. Consult MSDS for details.' }
      ]
    },

    /* ============================================================
       2. CHEM 2K SHIELD
       ============================================================ */
    {
      id: 'chem-2k-shield',
      name: 'CHEM 2K SHIELD',
      subTitle: 'Two-component elastomeric cementitious waterproof coating for concrete and masonry surfaces',
      category: 'cementitious',
      categoryLabel: 'Cementitious Waterproof Coatings',
      image: ASSETS + 'Chem-2k-Sheild.webp',
      imageW: 1224, imageH: 864,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-2k-shield.pdf',
      datasheetKb: 1767,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Elastomeric', 'Two-Component'],
      highlights: [
        'Resists water penetration and protects concrete structures',
        'Water-vapour permeable while remaining waterproof',
        'Brush, roller or spray application',
        'Strong adhesion to sound concrete and masonry'
      ],
      description:
        'CHEM 2K SHIELD is a two-component elastomeric cementitious waterproof coating composed of a cementitious '
        + 'powder and a specially formulated acrylic polymer liquid. When combined, the components form a flexible, '
        + 'durable and strongly adherent waterproof barrier for concrete and masonry substrates, suitable for above- '
        + 'and below-ground applications.',
      keyFeatures: [
        'FAST DRYING',
        'EXCELLENT ADHESION',
        'CORROSION RESISTANT',
        'EASY APPLICATION',
        'STRONG WATERPROOFING',
        'LONG LASTING PROTECTION',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'Basement tanking and below-ground structures',
        'Water reservoirs and water-retaining structures',
        'Tunnels and underground construction',
        'Swimming pools and water-retaining areas',
        'Long lasting protection'
      ],
      packaging: '16 kg double-pack (11 kg powder + 5 kg liquid)',
      coverage: 'Approximately 150-200 sq.ft. per 16 kg pack',
      consumption: [
        'Approximately 150-200 sq.ft. per 16 kg pack. Actual coverage varies with substrate roughness, porosity, '
        + 'surface condition and application technique.'
      ],
      guidance:
        'Clean mixing and application equipment immediately after use with clean water. Once the material has '
        + 'hardened, removal becomes more difficult.',
      techData: [
        { property: 'Appearance / Components', value: 'Cementitious powder + acrylic polymer liquid' },
        { property: 'Colour', value: 'Grey and white' },
        { property: 'Wet Density', value: 'Approx. 1800 kg/m\u00B3' },
        { property: 'Compressive Strength', value: '55.0 N/mm\u00B2' },
        { property: 'Tensile Strength', value: '3.7 N/mm\u00B2' },
        { property: 'Flexural Strength', value: '7.6 N/mm\u00B2' },
        { property: 'Adhesive Strength', value: '2.5 N/mm\u00B2' },
        { property: 'Water Vapour Permeability', value: '86 \u2013 120' },
        { property: 'Maximum Particle Size', value: '0.8 mm\u00B2' },
        { property: 'Pot Life at 20\u00B0C', value: 'Approx. 1 hour' },
        { property: 'Pot Life at 40\u00B0C', value: 'Approx. 30 minutes' },
        { property: 'Packing', value: '16 kg double-pack consisting of 11 kg cementitious powder and 5 kg liquid polymer solution.' }
      ],
      standards: [
        'Colour: Grey and white',
        'Density: Approx. 1800 kg/m\u00B3'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'CHEM 2K SHIELD should be applied only to properly prepared, sound substrates. The following '
            + 'procedure is intended as general application guidance; site conditions and project specifications '
            + 'should be considered before application.'
        },
        {
          title: 'Mixing',
          text: 'CHEM 2K SHIELD is supplied in pre-measured components and should be mixed on site using clean '
            + 'containers. For mechanical mixing, gradually blend the powder component into the liquid while mixing '
            + 'with a suitable paddle at low speed (approximately 400-600 rpm).'
        },
        {
          title: 'Uses',
          text: 'The substrate must be clean, structurally sound and mechanically prepared. Remove surface '
            + 'coatings, defective renders, foreign matter, formwork treatments and other contaminants that could '
            + 'interfere with adhesion. Abrasive blasting or high-pressure water treatment may be used as '
            + 'appropriate. After preparation, wash the surface with clean water to remove dust and loose material.'
        },
        {
          title: 'Application',
          text: 'Pre-dampen the prepared substrate before application. High-suction substrates may require '
            + 'additional dampening compared with dense substrates.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store under cover and clear of the ground. Keep the material dry and protect both components from '
            + 'moisture and frost. Do not stack more than six bags high. Keep packaging closed until required for use.'
        },
        {
          title: 'Cleaning of Equipment',
          text: 'Clean mixing and application equipment immediately after use with clean water. Once the material '
            + 'has hardened, removal becomes more difficult.'
        },
        {
          title: 'Safety',
          text: 'Wear suitable protective gloves, clothing and eye protection during mixing and application. Avoid '
            + 'unnecessary contact with skin and eyes. Provide adequate ventilation during application, particularly '
            + 'in enclosed areas. Read and follow the product Safety Data Sheet (SDS) before use.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '16 kg Box' },
        { label: 'Storage', value: 'Cool, covered and dry place; protect from direct sunlight and heat' },
        { label: 'Shelf Life', value: '1 year' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       3. CHEM 2K SHIELD PRO
       ============================================================ */
    {
      id: 'chem-2k-shield-pro',
      name: 'CHEM 2K SHIELD PRO',
      subTitle: 'Two-Component Flexible Elastomeric Cementitious Waterproof Coating',
      category: 'cementitious',
      categoryLabel: 'Cementitious Waterproof Coatings',
      image: ASSETS + 'Chem-2k-Sheild-Pro.webp',
      imageW: 1224, imageH: 864,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-2k-shield-pro.pdf',
      datasheetKb: 1743,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Pro Grade', 'Water Vapour Permeable'],
      highlights: [
        'Resists positive water pressure and controls water ingress',
        'Water-vapour permeable, allowing moisture vapour to pass through',
        'Flexible cured coating accommodates normal substrate movement',
        'Solvent-free formulation'
      ],
      description:
        'CHEM 2K SHIELD PRO is a two-component elastomeric cementitious waterproofing system comprising a '
        + 'cement-based powder and a specially formulated acrylic polymer liquid. When mixed together, the components '
        + 'form a flexible, durable and strongly adherent waterproof barrier for prepared concrete and masonry '
        + 'surfaces. The system is suitable for above- and below-ground waterproofing applications.',
      keyFeatures: [
        'FAST DRYING',
        'EXCELLENT ADHESION',
        'CORROSION RESISTANT',
        'EASY APPLICATION',
        'STRONG WATERPROOFING',
        'LONG LASTING PROTECTION',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'Basement tanking and below-ground structures',
        'Water reservoirs and water-retaining structures',
        'Tunnels and underground construction',
        'Swimming pools and water-retaining areas',
        'Fish ponds and tanks'
      ],
      packaging: '20 kg double-pack (15 kg powder + 5 kg liquid)',
      coverage: 'Indicative coverage is approximately 150-200 sq.ft. per 20 kg pack',
      consumption: [
        'Indicative coverage is approximately 150-200 sq.ft. per 20 kg pack, depending on substrate texture, '
        + 'porosity and application method.',
        'Actual consumption may vary with surface condition and application technique.'
      ],
      guidance:
        'Protect the applied coating from premature drying. Where practical, fog-spray with clean water after '
        + 'initial set. Longer curing may be required under cold or humid conditions.',
      techData: [
        { property: 'Form / Components', value: 'Cementitious powder + acrylic polymer liquid' },
        { property: 'Colour', value: 'Grey and white' },
        { property: 'Wet Density', value: 'Approx. 1800 kg/m\u00B3' },
        { property: 'Compressive Strength', value: '55.0 N/mm\u00B2' },
        { property: 'Tensile Strength', value: '3.7 N/mm\u00B2' },
        { property: 'Flexural Strength', value: '7.6 N/mm\u00B2' },
        { property: 'Adhesive Strength', value: '2.5 N/mm\u00B2' },
        { property: 'Water Vapour Permeability', value: '86 \u2013 120' },
        { property: 'Maximum Particle Size', value: '0.8 mm\u00B2' },
        { property: 'Pot Life at 20\u00B0C', value: 'Approx. 1 hour' },
        { property: 'Pot Life at 40\u00B0C', value: 'Approx. 30 minutes' },
        { property: 'Packaging', value: '20 kg double-pack: 15 kg powder + 5 kg liquid.' }
      ],
      standards: [
        'Colour: Grey and white',
        'Density: Approx. 1800 kg/m\u00B3'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'The substrate should be structurally sound, clean and free from dust, oil, loose material and '
            + 'other contaminants. Mechanically prepare the surface where required and remove standing water before '
            + 'application. Pre-dampen the prepared substrate.'
        },
        {
          title: 'Mixing',
          text: 'Gradually add the powder component into the polymer liquid while mixing at low speed with a '
            + 'suitable paddle mixer until a uniform, lump-free consistency is achieved. Allow approximately 10 '
            + 'minutes maturation before application. Do not re-temper the mix.'
        },
        {
          title: 'Uses',
          text: 'Protect the applied coating from premature drying. Where practical, fog-spray with clean water '
            + 'after initial set. Longer curing may be required under cold or humid conditions.'
        },
        {
          title: 'Application',
          text: 'Pre-dampen the prepared substrate before application. Apply the first coat at approximately '
            + '1.0 kg/m\u00B2 minimum. Allow the first coat to adequately cure before applying the second coat. Apply '
            + 'the second coat at approximately 1.0 kg/m\u00B2 minimum.'
        },
        {
          title: 'Storage & Handling',
          text: 'Keep both components sealed until use. Store under cover, clear of the ground and protected from '
            + 'moisture, frost, excessive heat and direct sunlight. Shelf life is 12 months in original unopened '
            + 'packaging when stored as recommended.'
        },
        {
          title: 'Cleaning of Equipment',
          text: 'Clean mixing and application equipment immediately after use with clean water. Once the material '
            + 'has hardened, removal becomes more difficult.'
        },
        {
          title: 'Safety',
          text: 'Wear suitable gloves, protective clothing and eye protection during handling and application. '
            + 'Avoid unnecessary skin and eye contact. Provide adequate ventilation and consult the Safety Data '
            + 'Sheet (SDS) before use.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '20 kg Box' },
        { label: 'Storage', value: 'Cool, covered and dry place; protect from direct sunlight and heat' },
        { label: 'Shelf Life', value: '1 year' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       4. CHEMADD RETARD MAX
       ============================================================ */
    {
      id: 'chemadd-retard-max',
      name: 'CHEMADD RETARD MAX',
      subTitle: 'Set-Retarding Admixture for Controlled Placement',
      category: 'admixtures',
      categoryLabel: 'Concrete Admixtures',
      image: ASSETS + 'ChemAdd-Retard.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chemadd-retard-max.pdf',
      datasheetKb: 1711,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['ASTM C494 Type B', 'Chloride Free'],
      highlights: [
        'Predictable set delay across a wide temperature range',
        'Maintains workability and pumpability without extra water',
        'Minimises thermal and shrinkage stresses in large pours',
        'Compatible with most cements, SCMs and other admixtures'
      ],
      description:
        'ChemAdd Retard Max is engineered to deliver precise control over concrete setting time. This chloride-free '
        + 'liquid retarder delays initial set while fully preserving both early and long-term strength. Ensures '
        + 'superior slump retention and finishability in challenging conditions \u2014 including high temperatures, '
        + 'long haul distances, intricate pours, and mass concrete \u2014 achieving confident placement and a flawless '
        + 'finish, with reduced risk of cold joints and plastic shrinkage cracks.',
      keyFeatures: [
        'WATER REDUCTION',
        'HIGHER STRENGTH',
        'IMPROVED WORKABILITY',
        'DURABLE CONCRETE',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'Mass rafts, pile caps, transfer slabs',
        'Long transit or pumping distances',
        'Hot and windy weather concreting',
        'Complex placements with congested steel',
        'Sequenced pours where joint control is critical'
      ],
      packaging: '250 kg Drum',
      coverage: 'Dosage: 0.20 - 0.80% by weight of cement (bwoc)',
      consumption: [
        'Normal dosage: 0.20 - 0.60 litres per 100 kg of cement (bwoc)',
        'High retardation / hot weather: up to 0.80 litres per 100 kg of cement (bwoc) \u2014 site trials recommended'
      ],
      guidance:
        'Add the admixture to the mixing water or freshly mixed concrete. Do not add directly to dry cement. '
        + 'Adjust dosage according to temperature, cement type and desired set delay.',
      techData: [
        { property: 'Appearance', value: 'Clear to pale amber liquid' },
        { property: 'Specific Gravity (25 \u00B0C)', value: '1.150 \u00B1 0.02' },
        { property: 'pH', value: '7.0 \u2013 9.0' },
        { property: 'Chloride Content', value: '\u2264 0.10% (chloride-free formulation)' },
        { property: 'Alkali Content (Na\u2082O-eq.)', value: '\u2264 1.5%' },
        { property: 'Dosage Range', value: '0.20 \u2013 0.80% by weight of cement (bwoc)' },
        { property: 'Typical Set Delay', value: '~1 \u2013 4 hours depending on dose, cement and temperature' },
        { property: 'Effect on Strength', value: 'Maintains or improves 28-day strength at proper dose' },
        { property: 'Compatibility', value: 'Compatible with plasticizers, superplasticizers, air-entrainers & pozzolans' },
        { property: 'Packaging', value: '250 kg Drum' }
      ],
      standards: [
        'Meets the requirements of ASTM C494 Type B (Retarding Admixture).',
        'Conforms to the intent of EN 934-2 (Set-retarding admixtures), when used as directed.'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Add ChemAdd Retard to the concrete mix at the recommended dosage. For best results, introduce the '
            + 'admixture into the mixing water or into freshly mixed concrete to ensure uniform dispersion. Do not '
            + 'add directly to dry cement.'
        },
        {
          title: 'Mixing',
          text: 'Add with the gauging water or directly into the mixer during batching. Allow a minimum of 60-90 '
            + 'seconds of mixing after the admixture addition to achieve complete and uniform distribution.'
        },
        {
          title: 'Compatibility',
          text: 'Compatible with most types of cement and supplementary cementitious materials. May be used with '
            + 'other admixtures; however, each admixture should be added separately to the mix. Conduct site trials '
            + 'when combining multiple admixtures.'
        },
        {
          title: 'Placement',
          text: 'Place, consolidate and finish the concrete using normal methods. Monitor setting time on site, as '
            + 'dosage and ambient conditions affect retardation.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store in original, tightly closed containers in a cool, frost-free environment out of direct '
            + 'sunlight. Protect from freezing. If the product has been frozen, allow it to thaw and remix before use.'
        },
        {
          title: 'Cleaning of Equipment',
          text: 'Clean spillage and equipment with clean water before the admixture hardens or dries.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '250 kg Drum' },
        { label: 'Storage', value: 'Store dry, frost-free, out of direct sunlight' },
        { label: 'Shelf Life', value: '1 year in original packaging' },
        { label: 'Hazard Class', value: 'Non-hazardous goods. Consult MSDS for details.' }
      ]
    },

    /* ============================================================
       5. CHEMADD SP PRO
       ============================================================ */
    {
      id: 'chemadd-sp-pro',
      name: 'CHEMADD SP PRO',
      subTitle: 'High-Range Water-Reducing Superplasticizer (HRWR)',
      category: 'admixtures',
      categoryLabel: 'Concrete Admixtures',
      image: ASSETS + 'ChemAdd-SP-Pro.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chemadd-sp-pro.pdf',
      datasheetKb: 1712,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Polycarboxylate', 'Chloride Free'],
      highlights: [
        'Major water reduction with maintained workability',
        'Higher early and ultimate strengths; reduced permeability',
        'Smooth, defect-free finishes and improved compaction around congested steel',
        'Compatible with most cements and supplementary cementitious materials'
      ],
      description:
        'ChemAdd SP Pro is a high-performance polycarboxylate superplasticizer that gives superior flow with less '
        + 'water. Achieve stronger, denser concrete with better slump retention, easy pumping, and smooth finish \u2014 '
        + 'no segregation, no bleeding. Perfect for precast and ready-mix concrete where speed and quality matter.',
      keyFeatures: [
        'WATER REDUCTION',
        'HIGHER STRENGTH',
        'IMPROVED WORKABILITY',
        'DURABLE CONCRETE',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'High-strength columns, beams and slabs',
        'Precast elements and SCC / flowing concrete',
        'Dense reinforcement / complex formwork',
        'Fair-faced and architectural concrete',
        'Pumped concrete and long lines'
      ],
      packaging: '250 kg Drum',
      coverage: 'Dosage: 0.20 - 0.80% by weight of cement (bwoc)',
      consumption: [
        'Normal dosage: 0.20 - 0.60 litres per 100 kg of cement (bwoc)',
        'High retardation / hot weather: up to 0.80 litres per 100 kg of cement (bwoc) \u2014 site trials recommended'
      ],
      guidance:
        'Add the admixture to the mixing water or freshly mixed concrete. Do not add directly to dry cement. '
        + 'Adjust dosage according to temperature, cement type and desired set delay.',
      techData: [
        { property: 'Appearance', value: 'Clear to pale amber liquid' },
        { property: 'Specific Gravity (25 \u00B0C)', value: '1.02 \u00B1 0.02' },
        { property: 'pH', value: '7.0 \u2013 9.0' },
        { property: 'Chloride Content', value: '\u2264 0.10% (chloride-free formulation)' },
        { property: 'Alkali Content (Na\u2082O-eq.)', value: '\u2264 1.5%' },
        { property: 'Dosage Range', value: '0.20 \u2013 0.80% by weight of cement (bwoc)' },
        { property: 'Typical Set Delay', value: '~1 \u2013 4 hours depending on dose, cement and temperature' },
        { property: 'Effect on Strength', value: 'Maintains or improves 28-day strength at proper dose' },
        { property: 'Compatibility', value: 'Compatible with plasticizers, superplasticizers, air-entrainers & pozzolans' },
        { property: 'Packaging', value: '250 kg Drum' }
      ],
      standards: [
        'Meets the requirements of ASTM C494 Type B (Retarding Admixture).',
        'Conforms to the intent of EN 934-2 (Set-retarding admixtures), when used as directed.'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Add ChemAdd SP Pro to the concrete mix at the recommended dosage. For best results, introduce the '
            + 'admixture into the mixing water or into freshly mixed concrete to ensure uniform dispersion. Do not '
            + 'add directly to dry cement.'
        },
        {
          title: 'Mixing',
          text: 'Add with the gauging water or directly into the mixer during batching. Allow a minimum of 60-90 '
            + 'seconds of mixing after the admixture addition to achieve complete and uniform distribution.'
        },
        {
          title: 'Compatibility',
          text: 'Compatible with most types of cement and supplementary cementitious materials. May be used with '
            + 'other admixtures; however, each admixture should be added separately to the mix. Conduct site trials '
            + 'when combining multiple admixtures.'
        },
        {
          title: 'Placement',
          text: 'Place, consolidate and finish the concrete using normal methods. Monitor setting time on site, as '
            + 'dosage and ambient conditions affect retardation.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store in original, tightly closed containers in a cool, frost-free environment out of direct '
            + 'sunlight. Protect from freezing. If the product has been frozen, allow it to thaw and remix before use.'
        },
        {
          title: 'Cleaning of Equipment',
          text: 'Clean spillage and equipment with clean water before the admixture hardens or dries.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '250 kg Drum' },
        { label: 'Storage', value: 'Store dry, frost-free, out of direct sunlight' },
        { label: 'Shelf Life', value: '1 year in original packaging' },
        { label: 'Hazard Class', value: 'Non-hazardous goods. Consult MSDS for details.' }
      ]
    },

    /* ============================================================
       6. CHEM BITU GUARD
       ============================================================ */
    {
      id: 'chem-bitu-guard',
      name: 'CHEM BITU GUARD',
      subTitle: 'Damp Proofing with Asphalt Emulsions',
      category: 'dampproofing',
      categoryLabel: 'Damp Proofing & Bituminous Coatings',
      image: ASSETS + 'Chem-Bitu-Guard.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-bitu-guard.pdf',
      datasheetKb: 1524,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Cold Applied', 'UV Resistant'],
      highlights: [
        'Outstanding binding strength to a range of surface textures and substrates',
        'Can be used on green concrete or moist surfaces',
        'Reduces moisture and vapour transmission through below-grade walls',
        'Unaffected by organic matter, minerals, soil acidity or alkalinity'
      ],
      description:
        'Chem Bitu Guard is a high-quality asphalt emulsion with bentonite clay that creates a damp-proof barrier '
        + 'for concrete or masonry walls. This permeable layer prevents moisture migration without reducing vapour '
        + 'transmission.',
      keyFeatures: [
        'WATERPROOF PROTECTION',
        'EXCELLENT ADHESION',
        'UV & WEATHER RESISTANT',
        'DURABLE FINISH',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'Above or below grade, interior or exterior',
        'Form and pour or tilt wall concrete, concrete block, masonry, or stone surfaces',
        'Foundations, retaining walls, and fire barriers',
        'Culverts, bridge abutments, coping, and parapets',
        'Designed for durable service under industrial traffic'
      ],
      packaging: '250 kg Drum / 15 kg Bucket',
      coverage: '100 sq.ft. per U.S. gallon per coat (\u2248 2.5 m\u00B2 per liter per coat)',
      consumption: [
        '100 sq.ft. per U.S. gallon per coat (approx. 2.5 m\u00B2 per liter per coat).',
        'Values vary with temperature, humidity and substrate absorption.'
      ],
      guidance:
        'Recoat time is 4-6 h at 25 \u00B0C / 50% RH. Full cure 24-48 h. Drying time at 70 \u00B0F (21 \u00B0C), 50% RH.',
      techData: [
        { property: 'Type', value: 'Bituminous, cold-applied (solvent-based)' },
        { property: 'Appearance (wet / dry)', value: 'Black liquid / Black satin film' },
        { property: 'V.O.C. Content', value: '9 gm/L' },
        { property: 'Specific Gravity', value: '1.0 - 1.05' },
        { property: 'Solids', value: '50% by weight and volume' },
        { property: 'Recoat Time', value: '4 - 6 h (25 \u00B0C; RH 50%)' },
        { property: 'Full Cure', value: '24 - 48 h' },
        { property: 'Viscosity', value: '800 - 1000 cps at 77 \u00B0F (25 \u00B0C)' },
        { property: 'Elongation / Flexibility', value: 'Flexible bituminous film' },
        { property: 'pH', value: '6.2 - 7.0' },
        { property: 'Colour', value: 'Black' },
        { property: 'Drying Time', value: '70 \u00B0F (21 \u00B0C), 50% RH' },
        { property: 'Packaging', value: '250 kg Drum / 15 kg bucket' }
      ],
      standards: [
        'Tested in accordance with DIN 1048 Water Permeability Test.',
        'Complies with Water Research Council requirements for potable water contact.'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Apply to clean, sound concrete or masonry surfaces. Can be applied to green concrete or moist '
            + 'surfaces without drying.'
        },
        {
          title: 'Surface Preparation',
          text: 'Remove laitance, loose material, formwork treatments and contaminants. Abrasive blasting or '
            + 'high-pressure water treatment may be used as appropriate. Wash the surface with clean water to remove '
            + 'dust and loose material before application.'
        },
        {
          title: 'Application',
          text: 'Apply by brush, roller or spray. Allow 4-6 h recoat interval at 25 \u00B0C and 50% RH. Full cure is '
            + 'achieved in 24-48 h. Values vary with temperature, humidity and substrate absorption.'
        },
        {
          title: 'Surface Mixing',
          text: 'Stir the product thoroughly before use. Do not dilute. Clean application equipment immediately '
            + 'after use with the recommended cleaning agent.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '250 kg Drum / 15 kg Bucket' },
        { label: 'Storage', value: 'Store dry, frost-free, out of direct sunlight' },
        { label: 'Shelf Life', value: '1 year in original packaging' },
        { label: 'Hazard Class', value: 'Non-hazardous goods. Consult MSDS for details.' }
      ]
    },

    /* ============================================================
       7. CHEM GROUT N-S
       ============================================================ */
    {
      id: 'chem-grout-ns',
      name: 'CHEM GROUT N-S',
      subTitle: 'General Use Non-Shrink Cementitious Grout',
      category: 'grouts',
      categoryLabel: 'Grouts & Cementitious Fillers',
      image: ASSETS + 'Chem-Grout-NS.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-grout-ns.pdf',
      datasheetKb: 1632,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Non-Shrink', 'High Flow'],
      highlights: [
        'Gaseous expansion mechanism compensates for shrinkage and settlement',
        'No metallic iron content to cause discolouration',
        'Prepackaged materials eliminate on-site batching differences',
        'Increases early strength without the usage of chlorides'
      ],
      description:
        'Chem Grout N-S is delivered as a ready-to-use dry powder. A controlled amount of clean water is added to '
        + 'create a flowing, non-shrinking grout for gaps up to 100 mm thick. It is a combination of Portland cement, '
        + 'graded fillers and chemical additives that provide controlled expansion in the plastic state while reducing '
        + 'water use. The reduced water demand guarantees high early strengths, and the graded filler aids uniform '
        + 'mixing and a consistent grout.',
      keyFeatures: [
        'HIGH FLOW',
        'HIGH STRENGTH',
        'EXCELLENT BOND',
        'DURABLE FINISH',
        'SUPERIOR WATERPROOFING',
        'LONG LASTING DURABILITY',
        'ENHANCED SURFACE PROTECTION'
      ],
      uses: [
        'Used for general purpose grouting',
        'Essential to eliminate shrinkage',
        'For completely filling the void between a base plate and a substrate',
        'Typical application: grouting of a stanchion base plate',
        'High early strength and durable load transfer'
      ],
      packaging: '20 kg Bag',
      coverage: 'For gaps up to 100 mm thick',
      consumption: [
        'Chem Grout N-S is a specialized hydraulic cement material engineered with expansive additives to offset '
        + 'normal drying shrinkage and maintain full, continuous contact under structural load-bearing plates and '
        + 'machinery bases.'
      ],
      guidance:
        'An expansion of up to 1% overcomes plastic settlement in the plastic state. Shelf life is 12 months when '
        + 'kept in a dry store in sealed bags.',
      techData: [
        { property: 'Type', value: 'Grout N-S, Dry Powder' },
        { property: 'Compressive Strength @ 1 day', value: '25 MPa' },
        { property: 'Compressive Strength @ 7 days', value: '45 MPa' },
        { property: 'Compressive Strength @ 28 days', value: '66 MPa' },
        { property: 'Flexural Strength @ 1 day', value: '2.5 MPa' },
        { property: 'Flexural Strength @ 7 days', value: '10.0 MPa' },
        { property: 'Flexural Strength @ 28 days', value: '11.0 MPa' },
        { property: 'Viscosity', value: '800 \u2013 1000 cps at 77 \u00B0F (25 \u00B0C)' },
        { property: 'Time for Expansion', value: 'Start: 5 minutes; Finish: 2 hours' },
        { property: 'Fresh Wet Density', value: 'Approximately 2160 kg/m\u00B3' },
        { property: "Young's Modulus", value: '25 GPa' },
        { property: 'Expansion', value: 'An expansion of up to 1% overcomes plastic settlement in plastic material.' },
        { property: 'Setting Times', value: 'Initial: 165 minutes; Final: 270 minutes' }
      ],
      standards: [
        'Tested in accordance with DIN 1048 Water Permeability Test.',
        'Complies with Water Research Council requirements for potable water contact.'
      ],
      applicationGuidelines: [
        {
          title: 'Surface Preparation',
          text: 'The substrate surface must be free from oil, grease or any loosely adherent material. If the '
            + 'concrete surface is defective or has laitance, it must be cut back to a sound base. Bolt holes or '
            + 'fixing pockets must be blown clean of any dirt or debris.'
        },
        {
          title: 'Mixing',
          text: 'To achieve optimal results, a mechanically powered grout mixer is recommended for quantities of up '
            + 'to 50 kg; a slow-speed drill equipped with a high shear mixer is appropriate. Greater amounts will '
            + 'necessitate a high shear vane mixer. Avoid utilizing a colloidal impeller mixer.'
        },
        {
          title: 'Application',
          text: 'Chem Grout N-S is applied to fill structural gaps under baseplates, anchor heavy machinery, and '
            + 'repair concrete without losing volume during the curing process. On completion of the grouting '
            + 'operation, exposed areas should be thoroughly cured by the use of a curing membrane, continuous '
            + 'application of water and/or wet hessian.'
        },
        {
          title: 'Cleaning of Equipment',
          text: 'Chem Grout N-S should be removed from tools and equipment immediately after use. Cured material '
            + 'can only be removed mechanically.'
        },
        {
          title: 'Storage & Handling',
          text: 'Chem Grout N-S has a shelf life of 12 months if kept in a dry store in sealed bags. If stored in '
            + 'high temperature and high humidity locations, the shelf life may be reduced.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '20 kg Bag' },
        { label: 'Storage', value: 'Store dry, frost-free, out of direct sunlight' },
        { label: 'Shelf Life', value: '1 year in original packaging' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       8. CHEM JOINT LOCK
       ============================================================ */
    {
      id: 'chem-joint-lock',
      name: 'CHEM JOINT LOCK',
      subTitle: 'Elastomeric Fuel Resistance Joint Sealant',
      category: 'sealants',
      categoryLabel: 'Sealants & Joint Sealers',
      image: ASSETS + 'Chem-Joint-Lock.webp',
      imageW: 1600, imageH: 1131,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-joint-lock.pdf',
      datasheetKb: 1445,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Fuel Resistant', 'Self-Leveling'],
      highlights: [
        'Outstanding resistance to petrol, oil and jet fuel spillage',
        'Maintains resilient, rubber-like properties at sub-zero temperatures',
        'Resistant to jet blast and penetration from stones and hard debris',
        'Self-leveling; produces uniform, neat joints'
      ],
      description:
        'Chem Joint Lock, a single component liquid polymer, is heated in an oil-jacketed extruder before being '
        + 'extruded into joints. Using Chem Joint Lock through an extruder might result in high daily application '
        + 'rates. Highly resistant to weathering, it will not flow, bubble or blister at high temperatures.',
      keyFeatures: [
        'STRONG JOINT',
        'EXCELLENT ADHESION',
        'UV & WEATHER RESISTANT',
        'DURABLE FINISH',
        'SUPERIOR WATERPROOFING',
        'LONG LASTING DURABILITY',
        'ENHANCED SURFACE PROTECTION'
      ],
      uses: [
        'Road Airfield Aprons',
        'Runways and Taxiways',
        'Cargo Terminals',
        'Warehouses',
        'Parking Areas'
      ],
      packaging: '600 ml tube',
      coverage: 'Litres required = joint width (mm) \u00D7 sealant depth (mm) \u00D7 joint length (mm)',
      consumption: [
        'Number of liters required = joint width (mm) \u00D7 sealant depth (mm) \u00D7 joint length (mm)',
        'Priming: Joints which have been sand/grit blasted, and which are perfectly clean and dry, can be sealed '
        + 'without the use of a primer.'
      ],
      guidance:
        'Joints which have been sand/grit blasted, and which are perfectly clean and dry, can be sealed without '
        + 'the use of a primer.',
      techData: [
        { property: 'Type', value: 'Chem Joint Sealant, liquid polymer' },
        { property: 'Specific Gravity', value: '1.26' },
        { property: 'Movement Accommodation Factor', value: '25%' },
        { property: 'Resilience (ASTM D3569)', value: '65 - 75%' },
        { property: 'ASTM D7116-05', value: '> 60%' },
        { property: 'Service Temperature Range', value: '-20\u00B0C to 70\u00B0C' },
        { property: 'Packaging', value: '600 ml tube' }
      ],
      standards: [
        'US Federal Specification SS-S-1614, 167b, 1401b 164',
        'ASTM D7116-05',
        'ASTM D3406 85',
        'ASTM D3569 85',
        'BS2499 1973 Types A1 and B1',
        'DTP Specification for Highway Works 1986 Clause 1016'
      ],
      applicationGuidelines: [
        {
          title: 'Joint Preparation',
          text: 'The substrate to which Chem Joint Lock is to be bonded must be clean and dry and the joint profile '
            + 'sound. Arris repair where required should be effected using a recommended Chem repair compound.'
        },
        {
          title: 'Priming',
          text: 'Joints which have been sand/grit blasted, and which are perfectly clean and dry, can be sealed '
            + 'without the use of a primer.'
        },
        {
          title: 'Heating / Application',
          text: 'It is essential that the correct heating and application equipment is used to ensure successful '
            + 'performance of the sealant. Chem Joint Lock should be poured directly into an approved oil jacketed '
            + 'heated extruder. High productivity from the extruder minimizes the contract period.'
        },
        {
          title: 'Cleaning',
          text: 'Application equipment should be cleaned thoroughly using Chem Joint Lock flushing oil. Ignition '
            + 'sources associated with the heater/extruder must be extinguished prior to the use of flushing oil. '
            + 'Following application Chem Joint Lock can only be removed mechanically.'
        },
        {
          title: 'Technical Service',
          text: 'A trained Chem representative is available to assist in the preparation of specifications, and the '
            + 'resolution of concrete problems in the field.'
        },
        {
          title: 'Health and Safety',
          text: 'Chem Joint Lock should not come in contact with skin and eyes or be swallowed. Avoid inhalation of '
            + 'vapours and ensure adequate ventilation.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '600 ml tube' },
        { label: 'Storage', value: 'Store dry, frost-free, out of direct sunlight' },
        { label: 'Shelf Life', value: '1 year in original packaging' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       9. CHEM PU ELASTO
       ============================================================ */
    {
      id: 'chem-pu-elasto',
      name: 'CHEM PU ELASTO',
      subTitle: 'Pure polyurethane, liquid-applied roof waterproofing membrane, quick cure and minimal odour',
      category: 'membranes',
      categoryLabel: 'Polyurethane Waterproof Membranes',
      image: ASSETS + 'Chem-PU-Elasto.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-pu-elasto.pdf',
      datasheetKb: 1546,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['i-Cure Technology', 'Low Odour'],
      highlights: [
        'Cold-applied by brush or roller; suitable for practical site conditions',
        'Seamless, elastic waterproofing membrane with good crack-bridging capability',
        'High-solids formulation for efficient membrane build-up',
        'Low-odour formulation compared with conventional solvent-rich coating systems'
      ],
      description:
        'CHEM PU ELASTO is a rapid cure, one component, cold applied, moisture-triggered aliphatic-aromatic pure '
        + 'polyurethane membrane based on unique i-Cure Technology. It forms a seamless, elastic waterproofing '
        + 'membrane and is suitable for horizontal and vertical waterproofing surfaces.',
      keyFeatures: [
        'FAST DRYING',
        'EXCELLENT ADHESION',
        'CORROSION RESISTANT',
        'EASY APPLICATION',
        'STRONG WATERPROOFING',
        'FAST & EFFECTIVE INJECTION',
        'LONG LASTING PROTECTION',
        'ENHANCED DURABILITY',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'Exposed and non-exposed flat roof waterproofing',
        'Pitched roof and roof-deck waterproofing',
        'Protective waterproofing layer beneath compatible subsequent finishes',
        'Waterproofing of concrete and cementitious substrates',
        'Concrete surface before coating'
      ],
      packaging: '20 kg Bucket',
      coverage: 'Approximately 1.5 - 2.0 kg/m\u00B2 per mm of thickness',
      consumption: [
        'Approximately 1.5-2.0 kg/m\u00B2 per mm of thickness, depending on surface condition, porosity and '
        + 'application method.'
      ],
      guidance:
        'Clean all tools and application equipment with Thinner C immediately after use. Hardened and/or cured '
        + 'material can only be removed mechanically.',
      techData: [
        { property: 'Chemical Base', value: 'One-component moisture-curing polyurethane' },
        { property: 'Form', value: 'Thixotropic liquid' },
        { property: 'Typical Appearance', value: 'Smooth coating; standard colour as supplied' },
        { property: 'Density', value: 'Approx. 1.35 kg/L' },
        { property: 'Solids Content', value: 'Approx. 95% by weight' },
        { property: 'Flash Point', value: 'Approx. 80 \u00B0C (closed-cup method)' },
        { property: 'Crack Bridging', value: 'Up to 2 mm, no cracking reported (ASTM C836)' },
        { property: 'Elongation at Break', value: 'Approx. 600% (ASTM D412)' },
        { property: 'Tear Strength', value: 'Approx. 14.5 N/mm (ASTM D624)' },
        { property: 'Tensile Strength', value: 'Approx. 4 N/mm\u00B2 (ASTM D412)' },
        { property: 'Pull-Off Adhesion', value: '< 1.5 N/mm\u00B2 (ASTM D4541)' },
        { property: 'VOC', value: '< 250 g/L (ASTM D2369)' },
        { property: 'Packaging', value: '20 kg Bucket' }
      ],
      standards: [
        'Solid content: ~95% by weight (+23\u00B0C / 50% r.h.)',
        'Flash point: 80\u00B0C (closed cup method)',
        'Density: ~1.35 kg/L',
        'Performance varies with substrate, film build, temperature and application method.'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Chem PU Elasto is a high-performance polyurethane-based material designed for waterproofing, '
            + 'sealing and protection of concrete and construction surfaces. It provides excellent adhesion, '
            + 'flexibility and resistance to water penetration, making it suitable for roofs, terraces, concrete '
            + 'structures, joints and other areas exposed to moisture.'
        },
        {
          title: 'Mixing',
          text: 'Adheres to various substrates including concrete, cementitious substrates and bitumen sheets.'
        },
        {
          title: 'Uses',
          text: 'Waterproofing membrane on exposed flat and pitched roofs, both for new construction and '
            + 'refurbishment of old roofs.'
        },
        {
          title: 'Application',
          text: 'Prior to application of Chem PU Elasto, the priming coat, if used, must be cured tack-free. '
            + 'Refer to the technical data sheet for waiting time / overcoating intervals. Areas such as handrails '
            + 'have to be protected with tape or plastic wrapping.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store in a cool, dry and well-ventilated area, away from direct sunlight and heat sources. Keep the '
            + 'product in its original, tightly closed container until ready for use.'
        },
        {
          title: 'Cleaning of Equipment',
          text: 'Clean all tools and application equipment with Thinner C immediately after use. Hardened and/or '
            + 'cured material can only be removed mechanically.'
        },
        {
          title: 'Safety',
          text: 'Use appropriate personal protective equipment and provide adequate ventilation during '
            + 'application. Avoid unnecessary skin and eye contact. Do not eat, drink or smoke while handling the '
            + 'product. Refer to the product Safety Data Sheet (SDS) for detailed hazard, first-aid, handling, spill '
            + 'and disposal information.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '20 kg Bucket' },
        { label: 'Storage', value: 'Store dry, frost-free, out of direct sunlight' },
        { label: 'Shelf Life', value: '1 year in original packaging' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       10. CHEM PU ELASTO PRO
       ============================================================ */
    {
      id: 'chem-pu-elasto-pro',
      name: 'CHEM PU ELASTO PRO',
      subTitle: 'Pure polyurethane, liquid-applied roof waterproofing membrane with superior elasticity and durability',
      category: 'membranes',
      categoryLabel: 'Polyurethane Waterproof Membranes',
      image: ASSETS + 'Chem-PU-Elasto-pro.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-pu-elasto-pro.pdf',
      datasheetKb: 1525,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Pro Grade', 'High Elasticity'],
      highlights: [
        'Seamless, elastic and durable coating with long-term protection',
        'Superior flexibility, weather resistance and chemical stability',
        'Ideal for both new construction and existing structures',
        'Long-lasting protection against harsh weather and UV exposure'
      ],
      description:
        'CHEM PU ELASTO PRO is a high performance, single-component, cold-applied, moisture-triggered '
        + 'aliphatic-aromatic polyurethane liquid waterproofing membrane. It forms a seamless, elastic and durable '
        + 'coating that provides long-term protection to concrete and cementitious surfaces. Designed for superior '
        + 'flexibility, weather resistance and chemical stability, it is ideal for both new and existing structures.',
      keyFeatures: [
        'FAST DRYING',
        'EXCELLENT ADHESION',
        'CORROSION RESISTANT',
        'EASY APPLICATION',
        'STRONG WATERPROOFING',
        'FAST & EFFECTIVE INJECTION',
        'LONG LASTING PROTECTION',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'Exposed and non-exposed flat roof waterproofing',
        'Pitched roof and roof-deck waterproofing',
        'Protective waterproofing layer beneath compatible subsequent finishes',
        'Waterproofing of concrete and cementitious substrates',
        'Concrete surface before coating'
      ],
      packaging: '20 kg Bucket',
      coverage: 'Apply in 2-3 coats for best performance',
      consumption: [
        'Apply in 2-3 coats for best performance. Consumption depends on surface condition, porosity and '
        + 'application method.'
      ],
      guidance:
        'Ensure the surface is clean, dry and free from dust, oil or loose particles before application.',
      techData: [
        { property: 'Chemical Base', value: 'Two-component polyurethane (Polyurethane resin + Hardener)' },
        { property: 'Form', value: 'Liquid' },
        { property: 'Typical Appearance', value: 'Smooth coating; standard colour as supplied' },
        { property: 'Density', value: 'Approx. 1.35 kg/L' },
        { property: 'Solids Content', value: 'Approx. 95% by weight' },
        { property: 'Flash Point', value: 'Approx. 80 \u00B0C (closed-cup method)' },
        { property: 'Crack Bridging', value: 'Up to 3 mm, no cracking reported (ASTM C836)' },
        { property: 'Elongation at Break', value: 'Approx. 700% (ASTM D412)' },
        { property: 'Tear Strength', value: 'Approx. 16.5 N/mm (ASTM D624)' },
        { property: 'Tensile Strength', value: 'Approx. 6 N/mm\u00B2 (ASTM D412)' },
        { property: 'Pull-Off Adhesion', value: '< 2 N/mm\u00B2 (ASTM D4541)' },
        { property: 'VOC', value: '< 250 g/L (ASTM D2369)' },
        { property: 'Packaging', value: '20 kg Bucket' }
      ],
      standards: [
        'Solid content: ~95% by weight (+23\u00B0C / 50% r.h.)',
        'Flash point: 80\u00B0C (closed cup method)',
        'Density: ~1.35 kg/L',
        'Performance varies with substrate, film build, temperature and application method.'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Use brush or roller for even application.'
        },
        {
          title: 'Mixing',
          text: 'Adheres to various substrates including concrete, cementitious substrates and bitumen sheets.'
        },
        {
          title: 'Uses',
          text: 'Waterproofing membrane on exposed flat and pitched roofs, both for new construction and '
            + 'refurbishment of old roofs.'
        },
        {
          title: 'Application',
          text: 'Ensure the surface is clean, dry and free from dust, oil or loose particles. Apply in 2-3 coats '
            + 'for best performance.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store in a cool, dry and well-ventilated area, away from direct sunlight and heat sources. Keep the '
            + 'product in its original, tightly closed container until ready for use.'
        },
        {
          title: 'Safety',
          text: 'Use gloves, goggles and protective clothing. Avoid skin and eye contact.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '20 kg Bucket' },
        { label: 'Storage', value: 'Store dry, frost-free, out of direct sunlight' },
        { label: 'Shelf Life', value: '1 year in original packaging' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       11. CHEM STYRO BOND
       ============================================================ */
    {
      id: 'chem-styro-bond',
      name: 'CHEM STYRO BOND',
      subTitle: 'Styrene-Butadiene Rubber (SBR) Latex Bonding & Cement Modification',
      category: 'bonding',
      categoryLabel: 'Bonding & Polymer Modification',
      image: ASSETS + 'Chem-Styro-Bond.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-styro-bond.pdf',
      datasheetKb: 1635,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['SBR Latex', 'Non-Corrosive'],
      highlights: [
        'Improves adhesion of cementitious materials to suitable substrates',
        'Enhances flexural strength and flexibility of modified mortar systems',
        'Reduces water permeability in appropriately formulated cementitious systems',
        'Non-corrosive to steel'
      ],
      description:
        'CHEM STYRO BOND is a white Styrene-Butadiene Rubber (SBR) latex emulsion formulated for use with '
        + 'cement-based construction materials. It is designed to modify cement renders, screeds and mortars and to '
        + 'provide improved bonding and performance in repair, waterproofing and other cementitious applications.',
      keyFeatures: [
        'FAST BONDING',
        'STRONG ADHESION',
        'WATER RESISTANCE',
        'EASY MIXING',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'High-strength floor screeds',
        'Patching and repair mortars',
        'Thin-section screeds',
        'Waterproofing of cementitious surfaces',
        'Bonding slurry / bonding coat for renders and waterproofing systems'
      ],
      packaging: 'Bucket',
      coverage: '1 to 1.5 square meters per liter for a standard 1 mm to 2 mm slurry coat',
      consumption: [
        '1 to 1.5 square meters per liter for a standard 1 mm to 2 mm slurry coat or bonding slurry.'
      ],
      guidance:
        'The most widely used general-purpose synthetic elastomer, composed typically of 75% butadiene and 25% '
        + 'styrene. It should not be used as a standalone bonding grout without cement.',
      techData: [
        { property: 'Solid Content', value: '50% \u00B1 1%' },
        { property: 'Hardness', value: 'Approx. 4 Shore A' },
        { property: 'Density', value: 'Approx. 1.01 kg/L' },
        { property: 'Coverage', value: '1 to 1.5 m\u00B2 per liter for a 1 mm to 2 mm slurry coat' },
        { property: 'Packaging', value: 'Bucket' }
      ],
      standards: [
        'Solid content: 50% \u00B1 1%',
        'Hardness: Approx. 4 Shore A',
        'Density: Approx. 1.01 kg/L'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Styrene-butadiene rubber (SBR) dispensing is the application or metering of liquid SBR latex or '
            + 'SBR-based adhesives, sealants and modified cement binders in manufacturing and building operations.'
        },
        {
          title: 'Mixing',
          text: 'CHEM STYRO BOND should be incorporated into cementitious mixes according to the approved '
            + 'formulation for the intended application. It should not be used as a standalone bonding grout '
            + 'without cement.'
        },
        {
          title: 'Uses',
          text: 'Apply the SBR/Cement bonding grout to the prepared substrate. Do not allow the bonding coat to '
            + 'dry before subsequent layers.'
        },
        {
          title: 'Application',
          text: 'Styrene-Butadiene Rubber (SBR) is a versatile synthetic elastomer that is widely used in '
            + 'automotive, construction and industrial manufacture because of its good abrasion resistance, high '
            + 'tensile strength and low cost.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store Chem Styro Bond in its original sealed container. Protect from extreme temperatures, '
            + 'contamination and adverse weather exposure.'
        },
        {
          title: 'Safety',
          text: 'Avoid unnecessary skin/eye contact. Provide ventilation where required and refer to the current '
            + 'SDS for detailed safety information.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: 'Bucket' },
        { label: 'Storage', value: 'Cool, covered and dry place; protect from direct sunlight and heat' },
        { label: 'Shelf Life', value: '6 Months' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       12. CHEM STYRO BOND PRO
       ============================================================ */
    {
      id: 'chem-styro-bond-pro',
      name: 'CHEM STYRO BOND PRO',
      subTitle: 'Advanced Styrene-Butadiene Rubber (SBR) Latex \u2014 Cementitious Bonding & Modification',
      category: 'bonding',
      categoryLabel: 'Bonding & Polymer Modification',
      image: ASSETS + 'Chem-Styro-Bond-Pro.webp',
      imageW: 1600, imageH: 1000,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-styro-bond-pro.pdf',
      datasheetKb: 1666,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Pro Grade', 'SBR Latex'],
      highlights: [
        'Advanced SBR polymer modification for cementitious construction systems',
        'Enhances flexural performance and flexibility of modified mortar systems',
        'Improves tensile strength of suitable cement-based formulations',
        'Non-corrosive to steel'
      ],
      description:
        'CHEM STYRO BOND PRO is a premium Styrene-Butadiene Rubber (SBR) latex emulsion designed to modify cement-based '
        + 'construction materials. This product improves bonding, flexural and tensile performance for cementitious '
        + 'mortars, screeds, renders and waterproofing systems. It is ideal for repair and refurbishment projects '
        + 'that require enhanced adhesion, reduced water permeability and resistance to service movement.',
      keyFeatures: [
        'FAST BONDING',
        'STRONG ADHESION',
        'WATER RESISTANCE',
        'EASY MIXING',
        'STRONG WATERPROOFING',
        'LONG LASTING PROTECTION',
        'ENHANCED DURABILITY',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'High-strength floor screeds',
        'Patching and repair mortars',
        'Thin-section screeds',
        'Waterproofing of cementitious surfaces',
        'Patching and general repair mortars'
      ],
      packaging: 'Bucket',
      coverage: '1 to 1.5 square meters per liter for a standard 1 mm to 2 mm slurry coat',
      consumption: [
        '1 to 1.5 square meters per liter for a standard 1 mm to 2 mm slurry coat or bonding slurry.'
      ],
      guidance:
        'The most widely used general-purpose synthetic elastomer, composed typically of 75% butadiene and 25% '
        + 'styrene. It should not be used as a standalone bonding grout without cement.',
      techData: [
        { property: 'Solid Content', value: '50% \u00B1 1%' },
        { property: 'Hardness', value: 'Approx. 4 Shore A' },
        { property: 'Density', value: 'Approx. 1.01 kg/L' },
        { property: 'Coverage', value: '1 to 1.5 m\u00B2 per liter for a 1 mm to 2 mm slurry coat' },
        { property: 'Packaging', value: 'Bucket' }
      ],
      standards: [
        'Solid content: 50% \u00B1 1%',
        'Hardness: Approx. 4 Shore A',
        'Density: Approx. 1.01 kg/L'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'CHEM STYRO BOND PRO (SBR) dispensing is the application or metering of liquid SBR latex or '
            + 'SBR-based adhesives, sealants and modified cement binders in manufacturing and building operations.'
        },
        {
          title: 'Mixing',
          text: 'CHEM STYRO BOND PRO should be incorporated into cementitious mixes according to the approved '
            + 'formulation for the intended application. It should not be used as a standalone bonding grout '
            + 'without cement.'
        },
        {
          title: 'Uses',
          text: 'Apply the SBR/Cement bonding grout to the prepared substrate. Do not allow the bonding coat to '
            + 'dry before subsequent layers.'
        },
        {
          title: 'Application',
          text: 'Styrene-Butadiene Rubber (SBR) is a versatile synthetic elastomer that is widely used in '
            + 'automotive, construction and industrial manufacture because of its good abrasion resistance, high '
            + 'tensile strength and low cost.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store Chem Styro Bond Pro in its original sealed container. Protect from extreme temperatures, '
            + 'contamination and adverse weather exposure.'
        },
        {
          title: 'Safety',
          text: 'Avoid unnecessary skin/eye contact. Provide ventilation where required and refer to the current '
            + 'SDS for detailed safety information.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: 'Bucket' },
        { label: 'Storage', value: 'Cool, covered and dry place; protect from direct sunlight and heat' },
        { label: 'Shelf Life', value: '6 Months' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       13. CHEM SWELL
       ============================================================ */
    {
      id: 'chem-swell',
      name: 'CHEM SWELL',
      subTitle: 'Hydrophilic polymer waterstop for sealing construction joints, concrete structures and critical waterproofing applications',
      category: 'waterstops',
      categoryLabel: 'Hydrophilic Waterstops',
      image: ASSETS + 'Chem-Swell.webp',
      imageW: 1224, imageH: 864,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-swell.pdf',
      datasheetKb: 1701,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Re-Swellable', '750-800% Expansion'],
      highlights: [
        'Expands approximately 750-800% by volume on contact with water',
        'Polymer structure designed to resist micro-bacterial attack',
        'Capable of repeated swelling and shrinking during wet/dry cycles',
        'Suitable for water-retaining structures and underground construction'
      ],
      description:
        'CHEM SWELL is an ultra-thin, profiled hydrophilic polymer waterstop designed for sealing construction and '
        + 'structural joints against water ingress. Its three-dimensional polymer structure is based on chemically '
        + 'resistant polyurethane polymer chains with hydrophilic functionality. On contact with water the profile '
        + 'expands substantially and forms a swelling seal within the joint, accommodating repeated wet/dry cycles '
        + 'through controlled swelling and shrinking.',
      keyFeatures: [
        'FAST SWELLING',
        'EXCELLENT WATER SEALING',
        'CHEMICAL RESISTANCE',
        'EASY APPLICATION',
        'STRONG WATERPROOFING',
        'FAST & EFFECTIVE INJECTION',
        'LONG LASTING PROTECTION',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'Sewerage treatment',
        'Water tanks and reservoirs',
        'Waste water treatment structures',
        'Structures / concrete pipes',
        'Swimming pools'
      ],
      packaging: '10 m roll / carton',
      coverage: 'Rectangle and box profile \u2014 5 \u00D7 20 mm; 10 \u00D7 20 mm',
      consumption: [
        'A swell bar, also known as a hydrophilic waterstop, usually runs the whole length of a concrete joint and '
        + 'comes in rolls that are 5 to 40 meters long.',
        'A hydrophilic swell bar is a flexible waterstop strip used in construction joints to block water leaks by '
        + 'expanding when wet.'
      ],
      guidance:
        'To seal precast concrete elements, create a notch or recess where necessary. Choose a profile size so that '
        + 'the assembled elements create adequate compression (pre-stress) at the joint. To fix the junction, use an '
        + 'appropriate mounting cement or permanently elastic sealant.',
      techData: [
        { property: 'Product Type', value: 'Hydrophilic polymer waterstop / re-swellable joint sealing profile' },
        { property: 'Density', value: 'Approx. 1.0 g/cm\u00B3' },
        { property: 'Colour', value: 'Blue; other colours may be available on request' },
        { property: 'Swelling Retardation', value: 'Yes' },
        { property: 'Hardness', value: 'Approx. 3.8 Shore A' },
        { property: 'Tensile Strength', value: 'Approx. 1.5 \u2013 2.1 MPa' },
        { property: 'Elongation', value: 'Approx. 490 \u2013 770%' },
        { property: 'Hydrostatic Pressure', value: 'Approx. > 50 m (5 bar)' },
        { property: 'Packaging', value: '10 m roll / carton; other packing may be available' },
        { property: 'Profile Types', value: 'Rectangle and box profile' },
        { property: 'Available Sizes', value: '5 \u00D7 20 mm; 10 \u00D7 20 mm' }
      ],
      standards: [
        'Hydrophilic, re-swellable polymer waterstop conforming to the stated swell range of approx. 750-800% by volume.',
        'Hardness value reproduced from the supplied reference (approx. 3.8 Shore A) \u2014 confirm against the '
        + 'approved QC specification before issuing as a certified laboratory value.'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Chem Swell (also called a hydrophilic waterstop or swell bar) is a pre-formed rubber or polymer '
            + 'strip used in construction to seal concrete joints and stop water leaks.'
        },
        {
          title: 'Mixing',
          text: 'To use waterproof cement or mortar correctly, clean and dampen the surface, mix the product with '
            + 'the precise amount of water or additive, and apply at least two thin, alternating coats.'
        },
        {
          title: 'Uses',
          text: 'Waterproofing membrane on exposed flat and pitched roofs, both for new construction and '
            + 'refurbishment of old roofs.'
        },
        {
          title: 'Application',
          text: 'To seal precast concrete elements, create a notch or recess where necessary. Choose a profile '
            + 'size so that the assembled elements create adequate compression (pre-stress) at the joint. To fix the '
            + 'junction, use an appropriate mounting cement or permanently elastic sealant.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store Chem Swell in its original box somewhere cool, protected and dry. Keep the product away from '
            + 'direct sunlight, extreme temperatures, heat sources and excess humidity. In tropical climates, '
            + 'air-conditioning is recommended for storage. High temperatures and humidity can cause degradation and '
            + 'shorten shelf life.'
        },
        {
          title: 'Safety',
          text: 'To ensure safety during installation, wear protective clothing, gloves and goggles, avoid skin and '
            + 'eye contact, and seek medical advice if necessary. If accidentally swallowed, do not induce vomiting '
            + 'and seek medical attention immediately. Refer to the current Safety Data Sheet (SDS) for complete '
            + 'safety information.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '10 m roll / carton; other packing may be available' },
        { label: 'Storage', value: 'Cool, protected and dry; avoid direct sunlight and excessive humidity' },
        { label: 'Shelf Life', value: 'Store as recommended \u2014 refer to datasheet' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    },

    /* ============================================================
       14. CHEM SWELL PRO
       ============================================================ */
    {
      id: 'chem-swell-pro',
      name: 'CHEM SWELL PRO',
      subTitle: 'Hydrophilic polymer waterstop to seal building joints, concrete structures and important waterproofing applications',
      category: 'waterstops',
      categoryLabel: 'Hydrophilic Waterstops',
      image: ASSETS + 'Chem-Swell-Pro.webp',
      imageW: 1224, imageH: 864,   // measured intrinsic size (Phase 3.2)
      datasheet: 'downloads/chem-swell-pro.pdf',
      datasheetKb: 1723,        // measured after Phase 2 cleanup
      datasheetPages: 2,
      badges: ['Up to 900% Expansion', 'New Generation'],
      highlights: [
        'New generation high-performance acrylic polymer expanding tape',
        'Grows up to 900% when exposed to water',
        'Shrinks to its original installation size when completely dry',
        'Seals wall-to-base connections, pipe entries and old/new concrete interfaces'
      ],
      description:
        'Chem Swell Pro is a new generation of high-performance acrylic polymer-based expanding tape. It grows up to '
        + '900% when exposed to water. When completely dry, Chem Swell Pro shrinks to its original installation size '
        + 'and expands again when wet. It is used in concrete construction to seal construction joints such as '
        + 'wall-to-base connections, pipe entry systems and interface sections between old and new concrete. It can '
        + 'be readily stored in its original moisture-proof packaging in cool, dry circumstances away from direct '
        + 'sunlight.',
      keyFeatures: [
        'FAST SWELLING',
        'EXCELLENT WATER SEALING',
        'CHEMICAL RESISTANCE',
        'EASY APPLICATION',
        'STRONG WATERPROOFING',
        'FAST & EFFECTIVE INJECTION',
        'LONG LASTING PROTECTION',
        'ENHANCED DURABILITY',
        'FASTER PLACEMENT',
        'BETTER FINISH & PERFORMANCE'
      ],
      uses: [
        'Sewerage treatment',
        'Water tanks and reservoirs',
        'Waste water treatment structures',
        'Structures / concrete pipes',
        'Swimming pools'
      ],
      packaging: '5 \u00D7 20 mm, 10 \u00D7 20 mm',
      coverage: 'Rectangle and box profile \u2014 5 \u00D7 20 mm; 10 \u00D7 20 mm',
      consumption: [
        'A swell bar, also known as a hydrophilic waterstop, usually runs the whole length of a concrete joint and '
        + 'comes in rolls that are 5 to 40 meters long.',
        'A hydrophilic swell bar is a flexible waterstop strip used in construction joints to block water leaks by '
        + 'expanding when wet.'
      ],
      guidance:
        'To seal precast concrete elements, create a notch or recess where necessary. Choose a profile size so that '
        + 'the assembled elements create adequate compression (pre-stress) at the joint. To fix the junction, use an '
        + 'appropriate mounting cement or permanently elastic sealant.',
      techData: [
        { property: 'Product Type', value: 'Hydrophilic polymer waterstop / re-swellable joint sealing profile' },
        { property: 'Density', value: 'Approx. 1.40 g/cm\u00B3' },
        { property: 'Colour', value: 'Red' },
        { property: 'Swelling Retardation', value: 'Yes' },
        { property: 'Shore', value: '50' },
        { property: 'Application Temperature', value: '10\u00B0C / 50\u00B0C' },
        { property: 'Elongation', value: 'Approx. 500 \u2013 780%' },
        { property: 'Hydrostatic Pressure', value: 'Approx. > 50 m (5 bar)' },
        { property: 'Packaging', value: '5 \u00D7 20 mm, 10 \u00D7 20 mm' },
        { property: 'Profile Types', value: 'Rectangle and box profile' }
      ],
      standards: [
        'Solid content: ~100%',
        'Hardness: Approx. 4 Shore A',
        'Density: Approx. 2.0 g/cm\u00B3'
      ],
      applicationGuidelines: [
        {
          title: 'Dispensing',
          text: 'Chem Swell Pro (also called a hydrophilic waterstop or swell bar) is a pre-formed rubber or '
            + 'polymer strip used in construction to seal concrete joints and stop water leaks.'
        },
        {
          title: 'Mixing',
          text: 'To use waterproof cement or mortar correctly, clean and dampen the surface, mix the product with '
            + 'the precise amount of water or additive, and apply at least two thin, alternating coats.'
        },
        {
          title: 'Uses',
          text: 'Waterproofing membrane on exposed flat and pitched roofs, both for new construction and '
            + 'refurbishment of old roofs.'
        },
        {
          title: 'Application',
          text: 'To seal precast concrete elements, create a notch or recess where necessary. Choose a profile '
            + 'size so that the assembled elements create adequate compression (pre-stress) at the joint. To fix the '
            + 'junction, use an appropriate mounting cement or permanently elastic sealant.'
        },
        {
          title: 'Storage & Handling',
          text: 'Store Chem Swell Pro in its original box somewhere cool, protected and dry. Keep the product away '
            + 'from direct sunlight, extreme temperatures, heat sources and excess humidity. In tropical climates, '
            + 'air-conditioning is recommended for storage. High temperatures and humidity can cause degradation and '
            + 'shorten shelf life.'
        },
        {
          title: 'Safety',
          text: 'As with any construction chemicals, caution should always be used. Gloves and goggles are examples '
            + 'of protective apparel that should be worn. Any splashes to the skin or eyes should be treated right '
            + 'away with fresh water, and you should consult a doctor. If any of the product is inadvertently eaten, '
            + 'contact for medical help right away rather than inducing vomiting.'
        }
      ],
      importantInfo: [
        { label: 'Supplied In', value: '5 \u00D7 20 mm, 10 \u00D7 20 mm' },
        { label: 'Storage', value: 'Cool, covered and dry place; protect from direct sunlight and heat' },
        { label: 'Shelf Life', value: '24 months in unopened original packaging, stored as suggested.' },
        { label: 'Hazard Class', value: 'Non-hazardous goods.' }
      ]
    }
  ];

  return {
    categories: categories,
    systems: systems,
    disclaimer: DISCLAIMER,
    products: products
  };
})();