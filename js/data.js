/**
 * THE ROSEWOOD GLASSHOUSE & ATRIUM
 * Central Mock Data Store
 */

const RosewoodData = {
  venue: {
    name: "The Rosewood Glasshouse & Atrium",
    tagline: "An Intimate Haven for Rehearsal Dinners & Engagement Parties",
    address: "428 Rosewood Estate Lane, Hudson Valley, NY 12572",
    phone: "+1 (845) 555-0194",
    email: "concierge@rosewoodatrium.com",
    hours: "Tuesday – Sunday: 10:00 AM – 9:00 PM | Private Tours by Appointment",
    rating: 4.98,
    reviewsCount: 184
  },

  spaces: [
    {
      id: "glasshouse-conservatory",
      name: "The Glasshouse Conservatory",
      tag: "Signature Space",
      capacitySeated: 85,
      capacityStanding: 120,
      sqft: 2400,
      description: "Floor-to-ceiling iron-framed glass arches beneath an antique glass cupola, enveloped by lush indoor citrus trees and hanging jasmine. Ideal for romantic candlelit rehearsal dinners.",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      pricingFrom: 4200,
      amenities: ["Climatically Controlled Glass Ceiling", "Custom Dimmable Brass Chandeliers", "Acoustically Tuned for Speeches", "Adjacent Private Courtyard Access", "Dedicated Sommelier Station"]
    },
    {
      id: "cellar-lounge",
      name: "The Rosewood Cellar & Tasting Lounge",
      tag: "Intimate & Moody",
      capacitySeated: 36,
      capacityStanding: 50,
      sqft: 1200,
      description: "Exposed 19th-century brickwork, vaulted timber arches, and custom velvet banquettes surrounding an illuminated rare vintage wine vault. Unmatched for private engagement dinners and toasts.",
      image: "assets/images/rosewood-cellar-lounge.jpg",
      pricingFrom: 2800,
      amenities: ["Temperature-Controlled Wine Vault", "Private Cocktail Bar & Mixologist", "Custom Oak Refectory Tables", "Bespoke Vinyl Listening Station", "Warm Ambient Fireplace"]
    },
    {
      id: "veranda-gardens",
      name: "The Veranda & Walled Courtyard",
      tag: "Alfresco Romance",
      capacitySeated: 110,
      capacityStanding: 160,
      sqft: 3100,
      description: "An Italianate limestone terrace flanked by climbing heritage roses, bronze fountain water features, and fairy-lit olive trees. The premier destination for golden hour cocktail receptions.",
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
      pricingFrom: 4800,
      amenities: ["Retractable Silk Canopy Pergola", "Outdoor Gas Heaters & Fire Bowls", "Tiered Fountain Plaza", "Heritage Wisteria Trellis", "Garden Cocktail Bar"]
    },
    {
      id: "grand-solarium",
      name: "The Grand Solarium & Dining Hall",
      tag: "Grand Celebrations",
      capacitySeated: 150,
      capacityStanding: 220,
      sqft: 4200,
      description: "Grand arched transoms, herringbone parquet floors, and panoramic views of the manicured estate orchards. Designed for larger rehearsal banquets and elevated engagement galas.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
      pricingFrom: 6500,
      amenities: ["Built-in Hardwood Dance Floor", "Concealed Audio & Projection Suite", "Bridal & VIP Holding Suite", "Double-sided Marble Bar", "Direct Valet & Carriage Drop-off"]
    }
  ],

  packages: [
    {
      id: "twilight-rehearsal",
      name: "The Twilight Rehearsal",
      tag: "Most Popular for Rehearsals",
      pricePerGuest: 145,
      minimumGuests: 25,
      isFeatured: true,
      description: "A meticulously orchestrated 4-hour rehearsal dinner designed around family-style dining, heartfelt toasts, and an intimate wine experience.",
      inclusions: [
        "Welcome flute of Champagne upon guest arrival",
        "3-Course seasonal farm-to-table plated dinner",
        "Sommelier-selected red & white wine pairings throughout dinner",
        "Curated tablescape with pillar candles & seasonal floral buds",
        "Dedicated maître d' & rehearsal coordinator for run-of-show",
        "Wireless speech microphones & ambient acoustic soundscape",
        "Dietary accommodation guarantee (GF, Vegan, Halal, Kosher-style)"
      ],
      dietaryNotes: "Chef accommodates all allergies with bespoke individual plates"
    },
    {
      id: "golden-engagement",
      name: "The Golden Hour Soirée",
      tag: "Signature for Engagements",
      pricePerGuest: 165,
      minimumGuests: 35,
      isFeatured: false,
      description: "An energetic yet sophisticated celebration featuring handcrafted signature cocktails, passing canapés, and artisanal food stations.",
      inclusions: [
        "4-Hour Premium Open Bar with 2 bespoke couple cocktails",
        "6 Butler-passed savory canapés during arrival hour",
        "Artisanal charcuterie & local cheese grazing presentation",
        "2 Interactive chef action stations (e.g. Handmade Pasta & Raw Bar)",
        "Miniature decadent dessert cart & espresso bar",
        "Champagne tower pour experience for couple's celebratory toast",
        "Lounge vignette furniture styling with velvet seating"
      ],
      dietaryNotes: "Full vegan and gluten-free station alternates included"
    },
    {
      id: "grand-celebration",
      name: "The Grand Gala Celebration",
      tag: "All-Inclusive Luxury",
      pricePerGuest: 215,
      minimumGuests: 50,
      isFeatured: false,
      description: "The pinnacle celebration experience for couples hosting extended family and wedding parties with multi-course fine dining and live entertainment support.",
      inclusions: [
        "5-Course Chef's Tasting Menu with reserve vintage wine pairings",
        "Unlimited top-shelf bar with vintage French Champagne",
        "Grand floral installations by our resident floral artisan",
        "Dedicated event designer & custom printed menus/placecards",
        "Live jazz trio or acoustic duo coordination for 3 hours",
        "Late-night artisanal flatbreads & sweet treats station",
        "Complimentary overnight stay for couple in Estate Suite"
      ],
      dietaryNotes: "Custom bespoke tasting session included prior to event"
    }
  ],

  testimonials: [
    {
      quote: "The Glasshouse Conservatory transformed our rehearsal dinner into a fairytale. The warm candlelight reflecting in the glass arches, the tender beef short rib, and the effortless pacing allowed our two families to truly bond before the big day.",
      author: "Camille & Julian Vance",
      event: "Rehearsal Dinner · 68 Guests",
      date: "September 2025",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      quote: "Our engagement party in the Cellar Lounge was pure magic. Our guests are still raving about the smoked rosemary old fashioneds and the intimate ambiance. The Rosewood team executed every single detail flawlessly.",
      author: "Elena & Marcus Rossi",
      event: "Engagement Soirée · 42 Guests",
      date: "November 2025",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      quote: "As an event planner herself, my mother had impossibly high standards. The Rosewood exceeded every single expectation. The sommelier pairing with each course was a masterclass.",
      author: "Sofia & David Chen",
      event: "Rehearsal Banquet · 80 Guests",
      date: "August 2025",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      rating: 5
    }
  ],

  blogPosts: [
    {
      id: "rehearsal-dinner-etiquette",
      title: "The Modern Rehearsal Dinner Guide: Etiquette, Timelines & Menu Inspiration",
      category: "Planning Tips",
      date: "October 12, 2025",
      readTime: "6 min read",
      author: "Genevieve Moreau, Head Event Director",
      image: "assets/images/rehearsal-dinner-guide.jpg",
      excerpt: "From speech order to welcoming out-of-town guests, here is how to curate a warm, relaxed rehearsal dinner that sets an unforgettable tone for your wedding weekend.",
      tags: ["Etiquette", "Rehearsal Dinner", "Timelines", "Catering"]
    },
    {
      id: "curating-engagement-party-cocktail-menu",
      title: "How to Design a Bespoke Signature Cocktail Menu for Your Engagement Soirée",
      category: "Food & Wine",
      date: "September 28, 2025",
      readTime: "5 min read",
      author: "Antoine Laurent, Lead Sommelier",
      image: "assets/images/bespoke-cocktail-menu.jpg",
      excerpt: "Elevate your toast with botanical infusions, ice sculptures, and champagne pairings that reflect your shared journey as a couple.",
      tags: ["Mixology", "Engagement Party", "Cocktails", "Wine Pairing"]
    },
    {
      id: "intimate-vs-grand-celebration",
      title: "Seated Dinner vs. Cocktail Reception: Choosing the Right Style for Your Celebration",
      category: "Design & Spaces",
      date: "August 15, 2025",
      readTime: "7 min read",
      author: "Clara Hawthorne, Resident Stylist",
      image: "assets/images/seated-vs-cocktail-reception.jpg",
      excerpt: "Explore the psychological flow, mingling dynamics, and sensory elements between a communal 4-course banquet and a roaming lounge reception.",
      tags: ["Spaces", "Guest Flow", "Reception Styles"]
    }
  ],

  // Sample data for the client dashboard
  clientEvent: {
    coupleNames: "Victoria Hastings & Liam Sterling",
    eventType: "Rehearsal Dinner & Welcome Drinks",
    eventDate: "2026-11-20T17:30:00",
    space: "The Glasshouse Conservatory & Courtyard",
    selectedPackage: "The Twilight Rehearsal",
    pricePerPerson: 145,
    guestCount: 65,
    budgetTotal: 11250,
    paidDeposit: 4000,
    dietaryNotesCount: 7,
    checklistProgress: 82,
    guests: [
      { id: "g1", name: "Charlotte Hastings", party: "Mother of the Bride", status: "attending", meal: "Pan-seared Chilean Seabass", table: "Head Table" },
      { id: "g2", name: "Arthur Hastings", party: "Father of the Bride", status: "attending", meal: "Braised Prime Short Rib", table: "Head Table" },
      { id: "g3", name: "Eleanor Sterling", party: "Mother of the Groom", status: "attending", meal: "Pan-seared Chilean Seabass", table: "Head Table" },
      { id: "g4", name: "Robert Sterling", party: "Father of the Groom", status: "attending", meal: "Wild Mushroom Risotto (V/GF)", table: "Head Table" },
      { id: "g5", name: "Beatrice Montgomery", party: "Maid of Honor", status: "attending", meal: "Pan-seared Chilean Seabass", table: "Table 1" },
      { id: "g6", name: "Lucas Sterling", party: "Best Man", status: "attending", meal: "Braised Prime Short Rib", table: "Table 1" },
      { id: "g7", name: "Sophia Reynolds", party: "Bridesmaid", status: "pending", meal: "Awaiting Selection", table: "Table 2" },
      { id: "g8", name: "Henry Davies", party: "Groomsman", status: "pending", meal: "Awaiting Selection", table: "Table 2" },
      { id: "g9", name: "Uncle Jonathan Hastings", party: "Guest", status: "declined", meal: "N/A", table: "N/A" }
    ]
  },

  // Sample data for admin dashboard
  adminData: {
    kpis: {
      monthlyRevenue: 84600,
      monthlyRevenueGrowth: "+18.4%",
      activeBookings: 24,
      pendingInquiries: 9,
      occupancyRate: "92%"
    },
    bookings: [
      { id: "BK-8021", client: "Victoria & Liam", event: "Rehearsal Dinner", space: "Glasshouse Conservatory", date: "Nov 20, 2026", guests: 65, total: "$11,250", status: "Confirmed" },
      { id: "BK-8022", client: "Seraphina & Kyle", event: "Engagement Soirée", space: "Cellar & Lounge", date: "Nov 27, 2026", guests: 45, total: "$8,400", status: "Confirmed" },
      { id: "BK-8023", client: "Isabella & Marco", event: "Rehearsal Banquet", space: "Grand Solarium", date: "Dec 05, 2026", guests: 110, total: "$19,500", status: "Pending" },
      { id: "BK-8024", client: "Penelope & Oliver", event: "Engagement Toast", space: "Veranda Gardens", date: "Dec 12, 2026", guests: 70, total: "$12,800", status: "Confirmed" },
      { id: "BK-8025", client: "Genevieve & Thomas", event: "Welcome Dinner", space: "Glasshouse Conservatory", date: "Dec 19, 2026", guests: 55, total: "$9,900", status: "Waitlist" }
    ],
    messages: [
      { id: "m1", from: "Lady Penelope Shaw", subject: "Private Sommelier Tasting Inquiry", time: "2 hours ago", unread: true },
      { id: "m2", from: "Julian Vance", subject: "Re: Dietary adjustments for bridal party", time: "5 hours ago", unread: false },
      { id: "m3", from: "Elena Rossi", subject: "Acoustic Duo electrical rider question", time: "Yesterday", unread: false }
    ]
  }
};

window.RosewoodData = RosewoodData;
