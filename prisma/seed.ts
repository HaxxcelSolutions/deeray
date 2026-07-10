import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("admin123", 12)

  const admin = await prisma.admin.upsert({
    where: { email: "admin@deeray.com" },
    update: {},
    create: {
      email: "admin@deeray.com",
      name: "Deeray Admin",
      password,
    },
  })

  console.log("✔ Admin seeded:", admin.email)

  // ── Categories ──────────────────────────────────────────────

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "pure" },
      update: {},
      create: {
        name: "Pure",
        slug: "pure",
        description: "Pure air, pure water — smart filtration and climate tech for the modern home.",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "shield" },
      update: {},
      create: {
        name: "Shield",
        slug: "shield",
        description: "Advanced hygiene and sanitization tech for the conscious, modern lifestyle.",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "aura" },
      update: {},
      create: {
        name: "Aura",
        slug: "aura",
        description: "Smart lighting and ambient tech that transforms living spaces into personal sanctuaries.",
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "carry" },
      update: {},
      create: {
        name: "Carry",
        slug: "carry",
        description: "Premium power and connectivity gear for the modern professional, on the move or at rest.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      },
    }),
  ])

  console.log(`✔ ${categories.length} categories seeded`)

  // ── Tags ────────────────────────────────────────────────────

  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: "new-arrival" }, update: { name: "New Arrival" }, create: { name: "New Arrival", slug: "new-arrival" } }),
    prisma.tag.upsert({ where: { slug: "best-seller" }, update: { name: "Best Seller" }, create: { name: "Best Seller", slug: "best-seller" } }),
    prisma.tag.upsert({ where: { slug: "limited-edition" }, update: { name: "Limited Edition" }, create: { name: "Limited Edition", slug: "limited-edition" } }),
    prisma.tag.upsert({ where: { slug: "sale" }, update: { name: "Sale" }, create: { name: "Sale", slug: "sale" } }),
    prisma.tag.upsert({ where: { slug: "handcrafted" }, update: { name: "Handcrafted" }, create: { name: "Handcrafted", slug: "handcrafted" } }),
  ])

  console.log(`✔ ${tags.length} tags seeded`)

  // ── Helper to find category by slug ─────────────────────────

  const cat = (slug: string) => categories.find((c) => c.slug === slug)!

  // ── Products ────────────────────────────────────────────────

  const productData = [
    {
      name: "AeroPure H13 True HEPA Air Purifier",
      slug: "aeropure-h13-hepa",
      brief: "Medical-grade HEPA H13 filtration for rooms up to 500 sq ft. Smart sensor with auto mode.",
      description: `The AeroPure H13 is engineered for those who demand the cleanest air possible. Its true HEPA H13 filter captures 99.97% of airborne particles as small as 0.3 microns — including pollen, dust mites, pet dander, mold spores, and bacteria.

A built-in laser particle sensor reads the air quality in real time and adjusts the fan speed automatically. The 360° intake design ensures maximum airflow from every direction, while the whisper-quiet DC motor runs as low as 24 dB — barely louder than a whisper.

The unit covers up to 500 sq ft in a single cycle (2x per hour) and 350 sq ft on continuous mode. Replaceable filter lasts 6–8 months with a handy replacement indicator.

Smart features include Wi-Fi connectivity, voice control via Alexa and Google Assistant, and a companion app that tracks air quality history.`,
      categorySlug: "pure",
      brand: "Deeray Tech",
      isFeatured: true,
      variants: [
        { sku: "AP-100", size: "Standard", color: "Matte White", price: 34999, comparePrice: 42999, stock: 25 },
        { sku: "AP-200", size: "Standard", color: "Charcoal", price: 35999, stock: 18 },
        { sku: "AP-FILTER", size: "Replacement Filter", color: "Universal", price: 4999, stock: 100 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90", alt: "AeroPure H13 — Front View" },
        { url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90", alt: "AeroPure H13 — Controls" },
        { url: "https://images.unsplash.com/photo-1600494607707-1340b3c92a79?w=1200&q=90", alt: "AeroPure H13 — Filter" },
      ],
      tags: ["new-arrival", "best-seller"],
      reviews: [
        { customerName: "Zaid M.", customerEmail: "zaid@example.com", rating: 5, title: "Game changer for allergies", comment: "My seasonal allergies have completely disappeared since using this. The auto mode is incredibly accurate.", isApproved: true },
        { customerName: "Ahmed K.", customerEmail: "ahmed@example.com", rating: 5, title: "Quiet and effective", comment: "Barely know it's running but the air quality difference is noticeable within hours.", isApproved: true },
      ],
    },
    {
      name: "HydroPure Alkaline Mineral Water Purifier",
      slug: "hydropure-alkaline",
      brief: "7-stage RO + UV + UF filtration with alkaline mineralizer. TDS controller included.",
      description: `The HydroPure Alkaline transforms ordinary tap water into premium alkaline water with a 7-stage purification process. The system combines Reverse Osmosis, UV sterilization, and Ultra Filtration with a post-carbon alkaline mineralizer that adds essential minerals like calcium, magnesium, and potassium.

The TDS controller lets you retain natural minerals while removing harmful contaminants. The 10-liter tank ensures a continuous supply, and the leak-proof design with auto shut-off provides complete peace of mind.

Installation is tool-free with the included quick-connect fittings, and the filter replacement indicator takes the guesswork out of maintenance. Filters last 6–12 months depending on input water quality.

Certified to remove 99% of dissolved solids, heavy metals, chlorine, pesticides, and microbial contaminants.`,
      categorySlug: "pure",
      brand: "Deeray Tech",
      isFeatured: true,
      variants: [
        { sku: "HP-10L", size: "10L Tank", color: "Gloss White", price: 28999, comparePrice: 34999, stock: 30 },
        { sku: "HP-20L", size: "20L Tank", color: "Gloss White", price: 35999, stock: 15 },
        { sku: "HP-FILTER-SET", size: "Filter Set (7-stage)", color: "Universal", price: 5499, stock: 80 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90", alt: "HydroPure — Front View" },
        { url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90", alt: "HydroPure — Display Panel" },
        { url: "https://images.unsplash.com/photo-1600494607707-1340b3c92a79?w=1200&q=90", alt: "HydroPure — Filter Set" },
      ],
      tags: ["new-arrival", "best-seller"],
      reviews: [
        { customerName: "Sara H.", customerEmail: "sara@example.com", rating: 5, title: "Best investment for health", comment: "The water tastes noticeably better and I feel more hydrated throughout the day.", isApproved: true },
      ],
    },
    {
      name: "SonicShield UV-C Sanitizer & Dryer Cabinet",
      slug: "sonicshield-uvc-sanitizer",
      brief: "UV-C sterilization + warm air drying for phones, keys, masks, and everyday essentials.",
      description: `The SonicShield UV-C Sanitizer Cabinet uses five high-intensity UV-C LEDs to eliminate 99.9% of bacteria and viruses from your everyday carry items. The 15-liter interior is large enough to hold smartphones, keys, wallets, sunglasses, masks, and more simultaneously.

The intelligent cycle runs for 5 minutes of UV-C exposure followed by 10 minutes of warm air drying, leaving items not only sanitized but completely dry. The front panel is tempered glass with a UV-blocking coating, and the touch controls include a timer and child lock.

Designed for daily use at home or in the office. Rated for over 10,000 cycles with replaceable UV-C LEDs rated for 50,000 hours.

A modern essential for the hygiene-conscious household.`,
      categorySlug: "shield",
      brand: "Deeray Tech",
      isFeatured: true,
      variants: [
        { sku: "SS-15", size: "15L", color: "White", price: 19999, comparePrice: 24999, stock: 20 },
        { sku: "SS-25", size: "25L", color: "White", price: 26999, stock: 12 },
        { sku: "SS-15-BLK", size: "15L", color: "Black", price: 20999, stock: 15 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90", alt: "SonicShield — Front View" },
        { url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90", alt: "SonicShield — Interior" },
        { url: "https://images.unsplash.com/photo-1600494607707-1340b3c92a79?w=1200&q=90", alt: "SonicShield — Controls" },
      ],
      tags: ["new-arrival", "limited-edition"],
      reviews: [
        { customerName: "Omar F.", customerEmail: "omar@example.com", rating: 5, title: "Perfect for daily peace of mind", comment: "I sanitize my phone and keys every evening. The drying function is a bonus I didn't know I needed.", isApproved: true },
      ],
    },
    {
      name: "LumiAura Smart LED Panel — Ambience Pro",
      slug: "lumiaura-ambience-pro",
      brief: "Wi-Fi enabled RGBWW LED panel with music sync, 16 million colors, and app control.",
      description: `The LumiAura Ambience Pro is a 24W smart LED panel that transforms any room with 16 million colors and tunable white temperatures from 2700K to 6500K. Music sync mode pulses and fades to the rhythm of your playlist via the built-in microphone.

Connect via Wi-Fi and control through the Deeray Home app — set schedules, create scenes, and group multiple panels for synchronized lighting across your entire home. Compatible with Alexa and Google Assistant for hands-free control.

The slim 10mm profile installs flush against any wall or ceiling with the included mounting kit. Each panel covers a 120° beam angle and is rated for 50,000 hours of continuous use.

Create the perfect ambiance for work, relaxation, or entertainment.`,
      categorySlug: "aura",
      brand: "Deeray Tech",
      isFeatured: true,
      variants: [
        { sku: "LA-24", size: "24W Square", color: "White Frame", price: 8499, comparePrice: 10999, stock: 40 },
        { sku: "LA-36", size: "36W Square", color: "White Frame", price: 11999, stock: 25 },
        { sku: "LA-24-BLK", size: "24W Square", color: "Black Frame", price: 8999, stock: 20 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90", alt: "LumiAura — Front View" },
        { url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90", alt: "LumiAura — App Controls" },
        { url: "https://images.unsplash.com/photo-1600494607707-1340b3c92a79?w=1200&q=90", alt: "LumiAura — Room Installation" },
      ],
      tags: ["new-arrival", "best-seller"],
      reviews: [
        { customerName: "Fatima A.", customerEmail: "fatima@example.com", rating: 5, title: "Total room transformation", comment: "The music sync feature is incredible for parties. Everyday warm white is beautiful too.", isApproved: true },
      ],
    },
    {
      name: "AeroFlux Smart Tower Fan",
      slug: "aeroflux-smart-tower",
      brief: "Bladeless tower fan with DC motor, 12 speeds, ionizer, and Wi-Fi app control.",
      description: `The AeroFlux Smart Tower Fan combines silent operation with powerful airflow. The bladeless design is safe for children and pets while delivering a smooth, uninterrupted stream of air. The pure DC motor consumes 80% less energy than traditional AC fans.

Twelve speed levels give precise control, and the included ionic air purifier helps reduce dust and allergens. The 90° oscillation ensures even distribution across large rooms.

A sleep mode gradually reduces fan speed over 8 hours, and the timer can be set from 1 to 12 hours. Remote control and touch panel included, plus full Wi-Fi control via the Deeray Home app.

At only 38 dB on the highest setting, it's one of the quietest tower fans in its class.`,
      categorySlug: "pure",
      brand: "Deeray Tech",
      isFeatured: false,
      variants: [
        { sku: "AF-36", size: "36-inch", color: "Matte White", price: 15999, comparePrice: 19999, stock: 30 },
        { sku: "AF-42", size: "42-inch", color: "Matte White", price: 18999, stock: 20 },
        { sku: "AF-36-BLK", size: "36-inch", color: "Matte Black", price: 16999, stock: 15 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90", alt: "AeroFlux — Front View" },
        { url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90", alt: "AeroFlux — Remote" },
        { url: "https://images.unsplash.com/photo-1600494607707-1340b3c92a79?w=1200&q=90", alt: "AeroFlux — Room" },
      ],
      tags: ["best-seller"],
      reviews: [
        { customerName: "Ali R.", customerEmail: "ali@example.com", rating: 4, title: "Very quiet and efficient", comment: "Much better than our old pedestal fan. The smart features are a nice bonus but I mostly use the remote.", isApproved: true },
      ],
    },
    {
      name: "PureWash Smart Bidet Seat Pro",
      slug: "purewash-smart-bidet",
      brief: "Heated seat, warm water wash, air dryer, and auto lid. Wireless remote included.",
      description: `The PureWash Smart Bidet Seat Pro elevates bathroom hygiene to a new standard. Features include adjustable warm water cleaning with oscillating and pulsating spray modes, a heated seat with 5 temperature levels, warm air drying, and an automatic deodorizer.

The wireless remote gives full control over water pressure, spray position, nozzle temperature, and seat temperature. The auto open/close lid with motion sensor adds convenience, while the slow-close seat prevents slamming.

Installation takes under 30 minutes with the included T-valve adapter — no electrician required for the standard plug-in model. The self-cleaning nozzle retracts automatically after each use and a pre-mist function keeps the bowl clean.

Energy-saving eco mode reduces power consumption by 30%.`,
      categorySlug: "shield",
      brand: "Deeray Tech",
      isFeatured: false,
      variants: [
        { sku: "PW-ELONGATED", size: "Elongated", color: "White", price: 54999, comparePrice: 64999, stock: 10 },
        { sku: "PW-ROUND", size: "Round", color: "White", price: 49999, stock: 8 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90", alt: "PureWash — Seat View" },
        { url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90", alt: "PureWash — Remote Control" },
        { url: "https://images.unsplash.com/photo-1600494607707-1340b3c92a79?w=1200&q=90", alt: "PureWash — Installation" },
      ],
      tags: ["limited-edition"],
      reviews: [],
    },
    {
      name: "CarryOn 20000mAh Power Bank — PD 65W",
      slug: "carryon-20000-powerbank",
      brief: "65W USB-C PD fast charging, 20000mAh capacity, LED display. Laptop compatible.",
      description: `The CarryOn 20000mAh Power Bank delivers enough power to charge a MacBook Pro 14" to 70% or an iPhone 15 Pro Max three times over. The 65W USB-C Power Delivery port charges laptops, tablets, and phones at full speed.

The LED digital display shows exact remaining battery percentage, while the dual USB-A ports (each 18W QC) handle legacy devices. The unit itself recharges in under 2 hours with a 65W USB-C charger.

Advanced safety protections include overcharge, over-discharge, short circuit, and temperature control. The aircraft-safe 20000mAh capacity meets airline carry-on requirements worldwide.

Premium aluminum alloy body with a soft-touch matte finish that resists fingerprints and scratches.`,
      categorySlug: "carry",
      brand: "Deeray Tech",
      isFeatured: false,
      variants: [
        { sku: "CB-20K-BLK", size: "20000mAh", color: "Space Gray", price: 7999, comparePrice: 9999, stock: 50 },
        { sku: "CB-20K-WHT", size: "20000mAh", color: "White", price: 7999, stock: 35 },
        { sku: "CB-10K-BLK", size: "10000mAh", color: "Space Gray", price: 4999, stock: 60 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90", alt: "CarryOn Power Bank — Front" },
        { url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90", alt: "CarryOn — Display" },
        { url: "https://images.unsplash.com/photo-1600494607707-1340b3c92a79?w=1200&q=90", alt: "CarryOn — Charging Devices" },
      ],
      tags: ["best-seller"],
      reviews: [
        { customerName: "Hassan M.", customerEmail: "hassan@example.com", rating: 5, title: "Charges my laptop perfectly", comment: "Compact enough for daily carry, powerful enough for a full day of work away from an outlet.", isApproved: true },
      ],
    },
    {
      name: "NovaLink USB-C 10-in-1 Docking Station",
      slug: "novalink-usbc-dock",
      brief: "Triple display HDMI, 100W PD pass-through, Gigabit Ethernet, SD/microSD slots.",
      description: `The NovaLink 10-in-1 USB-C Docking Station turns any USB-C laptop into a full workstation. Connect up to three external displays via dual HDMI 2.0 and one DisplayPort — supporting 4K@60Hz on all three ports simultaneously.

The 100W Power Delivery pass-through charges your laptop at full speed while using all ports. Integrated Gigabit Ethernet provides a stable wired connection, and the 10Gbps USB-C and USB-A data ports handle high-speed file transfers.

SD and microSD 4.0 card readers support UHS-II speeds for photographers and videographers. The 3.5mm audio jack supports both input and output.

Built with an aluminum alloy body for superior heat dissipation and a non-slip rubber base. Compatible with MacBook, Windows, Chromebook, iPad Pro, and Steam Deck.`,
      categorySlug: "carry",
      brand: "Deeray Tech",
      isFeatured: false,
      variants: [
        { sku: "NL-10", size: "Standard", color: "Space Gray", price: 14999, comparePrice: 18999, stock: 25 },
        { sku: "NL-10-SLV", size: "Standard", color: "Silver", price: 14999, stock: 20 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90", alt: "NovaLink Dock — Front" },
        { url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90", alt: "NovaLink — Ports" },
        { url: "https://images.unsplash.com/photo-1600494607707-1340b3c92a79?w=1200&q=90", alt: "NovaLink — Setup" },
      ],
      tags: ["new-arrival"],
      reviews: [],
    },
  ]

  const tagMap: Record<string, number> = {}
  for (const t of tags) {
    tagMap[t.slug] = t.id
  }

  for (const pd of productData) {
    const product = await prisma.product.upsert({
      where: { slug: pd.slug },
      update: {
        name: pd.name,
        description: pd.description,
        brief: pd.brief,
        brand: pd.brand,
        isFeatured: pd.isFeatured,
        categoryId: cat(pd.categorySlug).id,
      },
      create: {
        name: pd.name,
        slug: pd.slug,
        description: pd.description,
        brief: pd.brief,
        categoryId: cat(pd.categorySlug).id,
        brand: pd.brand,
        isFeatured: pd.isFeatured,
        isActive: true,
      },
    })

    // Upsert images
    for (let i = 0; i < pd.images.length; i++) {
      const img = pd.images[i]
      const existingImages = await prisma.productImage.findMany({
        where: { productId: product.id, url: img.url },
      })
      if (existingImages.length === 0) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: img.url,
            alt: img.alt,
            order: i,
          },
        })
      }
    }

    // Upsert variants
    for (const v of pd.variants) {
      const existingVariant = await prisma.productVariant.findUnique({ where: { sku: v.sku } })
      if (!existingVariant) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            price: v.price,
            comparePrice: v.comparePrice ?? null,
            stock: v.stock,
          },
        })
      }
    }

    // Upsert tags
    for (const tagSlug of pd.tags) {
      const tagId = tagMap[tagSlug]
      if (tagId) {
        const existing = await prisma.tag.findFirst({
          where: { id: tagId, products: { some: { id: product.id } } },
        })
        if (!existing) {
          await prisma.product.update({
            where: { id: product.id },
            data: { tags: { connect: { id: tagId } } },
          })
        }
      }
    }

    // Upsert reviews
    for (const r of pd.reviews) {
      const existing = await prisma.review.findFirst({
        where: { productId: product.id, customerEmail: r.customerEmail },
      })
      if (!existing) {
        await prisma.review.create({
          data: {
            productId: product.id,
            customerName: r.customerName,
            customerEmail: r.customerEmail,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            isApproved: r.isApproved,
          },
        })
      }
    }

    console.log(`  ✔ ${pd.name}`)
  }

  // ── Blog Posts ──────────────────────────────────────────────

  const blogPosts = [
    {
      title: "HEPA vs UV-C vs Ionizer: Which Air Purifier Tech Is Right for You?",
      slug: "hepa-vs-uvc-vs-ionizer",
      excerpt: "Confused by air purifier technologies? We break down HEPA, UV-C, and ionizer tech to help you choose the right one for your home.",
      content: `With air quality becoming a growing concern, the market is flooded with air purifiers claiming to use the latest technology. But what do the terms actually mean? Here's an honest breakdown.

**HEPA Filtration (High-Efficiency Particulate Air)**

True HEPA filters are the gold standard. They capture 99.97% of particles as small as 0.3 microns — dust, pollen, mold spores, pet dander, and even bacteria. The key word here is "True" HEPA. Many budget purifiers use "HEPA-type" or "HEPA-like" filters that don't meet the same standard.

Our AeroPure H13 uses medical-grade True HEPA. The trade-off? Filters need replacement every 6–8 months, and the denser the filter, the more energy the fan requires to push air through.

**UV-C Sterilization**

UV-C light damages the DNA of microorganisms, killing or inactivating bacteria and viruses. It's extremely effective in controlled environments but has limitations in air purifiers — the exposure time is often too brief to be fully effective against airborne pathogens.

Where UV-C shines best is in surface sterilization. Our SonicShield cabinet uses five UV-C LEDs with a timed cycle that ensures adequate exposure, making it ideal for sanitizing phones, keys, and other daily items.

**Ionizers (Negative Ion Generators)**

Ionizers charge particles in the air, causing them to stick to surfaces or each other so they fall out of the breathing zone. While this can make the air feel cleaner, the particles aren't actually removed — they settle on walls, furniture, and floors. Some ionizers also produce trace amounts of ozone as a byproduct.

**Our Recommendation**

For whole-home air purification, always choose True HEPA. For quick sanitization of personal items, UV-C is unbeatable. Skip standalone ionizers — they're best used as a supplementary feature in a device that also has HEPA filtration.

*— The Deeray Tech Team*`,
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=90",
      author: "The Deeray Tech Team",
      published: true,
    },
    {
      title: "USB-C Power Delivery Explained: Watts, Volts, and What Your Devices Actually Need",
      slug: "usb-c-pd-explained",
      excerpt: "Everything you need to know about USB-C Power Delivery — from fast charging your phone to powering a laptop.",
      content: `USB-C Power Delivery (PD) has revolutionized charging, but the jargon can be confusing. Here's what you actually need to know.

**What is Power Delivery?**

Power Delivery is a fast charging protocol that allows higher power levels over USB-C connections. Unlike older USB standards that maxed out at 5V/2.4A (12W), PD can negotiate up to 240W (48V/5A) with the latest PD 3.1 standard.

The key feature is intelligent negotiation — the charger and device communicate to determine the optimal voltage and current, ensuring safe and efficient charging for everything from earbuds to laptops.

**Common Power Levels**

- **18W–30W:** Smartphones and tablets. An iPhone 15 Pro Max charges at about 27W, while an iPad Pro can draw up to 30W.
- **45W–65W:** Ultrabooks and thin-and-light laptops. A MacBook Air charges at 30W, while a MacBook Pro 14" requires 67W for full speed.
- **100W+:** High-performance laptops, workstations, and even some monitors. The Dell XPS 17 and MacBook Pro 16" can draw up to 140W.

**What About Data?**

Not all USB-C cables are created equal. A cable rated for 60W can handle most phones and tablets but will throttle a laptop. Always match your cable's power rating to your device's needs. Look for cables with an e-marker chip that confirms the rated speed (usually 5A for 100W+).

**Why It Matters for Your Setup**

A single 65W charger and a quality cable can replace the separate chargers for your phone, tablet, laptop, earbuds, and even your Nintendo Switch. That's fewer cables to carry and fewer outlets needed.

Our CarryOn 20000mAh Power Bank supports 65W PD output — enough to charge a MacBook Pro at full speed while on the go. And our NovaLink Docking Station delivers 100W PD pass-through so your laptop stays charged through a single cable.

*— The Deeray Tech Team*`,
      image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=1200&q=90",
      author: "Zaid M.",
      published: true,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        author: post.author,
        published: post.published,
      },
    })
    console.log(`  ✔ Blog: ${post.title}`)
  }

  // ── Clean up old categories ─────────────────────────────────
  const oldSlugs = ["mens-luxury", "womens-elegance", "accessories", "fragrance", "home-decor"]
  let deletedCount = 0
  for (const slug of oldSlugs) {
    try {
      await prisma.category.delete({ where: { slug } })
      deletedCount++
    } catch { /* already deleted or has references */ }
  }
  if (deletedCount > 0) console.log(`  ✔ Removed ${deletedCount} old categories`)

  console.log("\n── Seeding complete ──")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
