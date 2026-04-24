export const BRAND_NAME = "Mono Studio";
export const BRAND_TAGLINE = "Minimalūs miesto siluetai";
export const FREE_SHIPPING_THRESHOLD = 120;

export const NAV_ITEMS = [
    { id: "products", label: "Katalogas", path: "/products" },
    { id: "overview", label: "Apie Mono Studio", path: "/project-overview" },
];

export const CATEGORY_FILTERS = [
    { id: "all", label: "Visos kategorijos" },
    { id: "tshirts", label: "Marškinėliai" },
    { id: "hoodies", label: "Džemperiai" },
    { id: "jackets", label: "Striukės" },
    { id: "accessories", label: "Aksesuarai" },
];

export const INVENTORY_FILTERS = [
    { id: "all", label: "Visas likutis" },
    { id: "in_stock", label: "Turime vietoje" },
    { id: "low_stock", label: "Mažas likutis" },
    { id: "new_arrivals", label: "Nauji modeliai" },
    { id: "sold_out", label: "Išparduota" },
];

export const PRICE_FILTERS = [
    { id: "all", label: "Visos kainos" },
    { id: "under_50", label: "Iki 50 €" },
    { id: "50_100", label: "50–100 €" },
    { id: "over_100", label: "Virš 100 €" },
];

export const SORT_OPTIONS = [
    { id: "featured", label: "Rekomenduojama" },
    { id: "newest", label: "Naujausi" },
    { id: "price_asc", label: "Kaina: nuo mažiausios" },
    { id: "price_desc", label: "Kaina: nuo didžiausios" },
    { id: "name", label: "Pavadinimas A–Ž" },
    { id: "stock", label: "Didžiausias likutis" },
];

export const HOME_BENEFITS = [
    {
        title: "Neutralūs tonai",
        description:
            "Rami spalvų paletė leidžia lengvai derinti drabužius tarpusavyje ir kurti švarų kasdienį įvaizdį.",
    },
    {
        title: "Patogūs audiniai",
        description:
            "Minkšti, patogūs audiniai pritaikyti kasdieniam dėvėjimui nuo ryto iki vakaro.",
    },
    {
        title: "Kasdieniai siluetai",
        description:
            "Laisvi, lengvai pritaikomi modeliai sukurti judėti kartu su tavo dienos ritmu.",
    },
];

export const TRUST_POINTS = [
    "Nemokamas pristatymas nuo 120 €",
    "Lengvas derinimas",
    "Kasdieniam stiliui",
    "Patogūs audiniai",
];

export const HERO_METRICS = [
    { label: "Kirpimai", value: "Švarūs ir lengvai derinami" },
    { label: "Audiniai", value: "Patogūs kasdieniam dėvėjimui" },
    { label: "Spalvos", value: "Neutralios ir lengvai pritaikomos" },
];

export const PROJECT_SUMMARY = {
    problem:
        "Mono Studio kuriama tiems, kurie renkasi paprastus siluetus, neutralius tonus ir drabužius, prie kurių lengva grįžti kasdien.",
    role:
        "Kolekcijoje susijungia švarios linijos, patogūs audiniai ir lengvai sluoksniuojami modeliai kasdieniam miesto ritmui.",
    result:
        "Lengvai derinami drabužiai rytui, darbui ir vakarui mieste.",
};

export const PROJECT_FEATURES = [
    {
        title: "Kasdieniai pagrindai",
        description:
            "Marškinėliai, džemperiai, striukės ir aksesuarai sukurti taip, kad lengvai įsilietų į kasdienį garderobą.",
    },
    {
        title: "Lengvas derinimas",
        description:
            "Rami paletė ir aiškūs kirpimai leidžia derinti modelius tarpusavyje be papildomų pastangų.",
    },
    {
        title: "Patogus dėvėjimas",
        description:
            "Švelnūs audiniai ir nevaržantys siluetai tinka tiek ramiam rytui, tiek ilgesnei dienai mieste.",
    },
    {
        title: "Apgalvotos detalės",
        description:
            "Subtilūs akcentai ir tvarkingos proporcijos išlaiko švarų, lengvai atpažįstamą Mono Studio charakterį.",
    },
];

export const PROJECT_STACK = [
    "Medvilnė",
    "Minkšti mezginiai",
    "Neutrali paletė",
    "Kasdieniai siluetai",
    "Lengvas sluoksniavimas",
    "Apgalvotos detalės",
];

export const ARCHITECTURE_PILLARS = [
    {
        title: "Švarūs kirpimai",
        description:
            "Aiškios linijos ir subalansuotos proporcijos padeda drabužiams išlaikyti lengvą, ramų charakterį.",
    },
    {
        title: "Rami paletė",
        description:
            "Pilki, tamsūs ir žemės tonai lengvai prisitaiko prie skirtingų dienos derinių.",
    },
    {
        title: "Patogūs audiniai",
        description:
            "Minkšta tekstūra ir patogus kritimas leidžia drabužius dėvėti nuo ryto iki vakaro.",
    },
    {
        title: "Lengvas sluoksniavimas",
        description:
            "Kolekcija kurta taip, kad viršutiniai ir apatiniai sluoksniai lengvai derėtų tarpusavyje.",
    },
    {
        title: "Kasdienis ritmas",
        description:
            "Modeliai sukurti aktyviai dienai mieste, kai svarbiausia patogumas, paprastumas ir lengvas pritaikymas.",
    },
];

export const PRODUCT_DETAIL_POINTS = [
    { title: "Pristatymas", value: "1–3 darbo dienos" },
    { title: "Priežiūra", value: "Lengva kasdienė priežiūra" },
    { title: "Stilius", value: "Minimalus miesto siluetas" },
];

const CATEGORY_META = {
    collection: {
        id: "collection",
        label: "Kolekcija",
        note: "Mono Studio",
        accentFrom: "#0d1a2b",
        accentTo: "#94a3b8",
    },
    tshirts: {
        id: "tshirts",
        label: "Marškinėliai",
        note: "Kasdienai",
        accentFrom: "#0d1a2b",
        accentTo: "#465874",
    },
    hoodies: {
        id: "hoodies",
        label: "Džemperiai",
        note: "Sluoksniams",
        accentFrom: "#111827",
        accentTo: "#9aa7bb",
    },
    jackets: {
        id: "jackets",
        label: "Striukės",
        note: "Lauko ritmui",
        accentFrom: "#11294a",
        accentTo: "#6f7f96",
    },
    accessories: {
        id: "accessories",
        label: "Aksesuarai",
        note: "Akcentams",
        accentFrom: "#152238",
        accentTo: "#d8e0eb",
    },
};

const CATEGORY_KEYWORDS = {
    tshirts: ["tee", "t-shirt", "shirt", "basic", "cotton", "top", "jersey", "crew", "marškin", "marskin"],
    hoodies: ["hoodie", "sweat", "crewneck", "fleece", "zip", "oversized", "džemper", "dzemper"],
    jackets: ["jacket", "coat", "shell", "puffer", "outerwear", "parka", "striuk"],
    accessories: ["beanie", "bag", "crossbody", "cap", "tote", "accessory", "scarf", "kepur", "rankin", "aksesuar"],
};

const PRODUCT_STORY_PRESETS = [
    {
        name: "Baziniai marškinėliai",
        description: "Storesnės medvilnės marškinėliai su švariu, tiesiu siluetu kasdienai.",
        categoryId: "tshirts",
        editorialTag: "Kasdienė linija",
    },
    {
        name: "Studijos marškinėliai",
        description: "Minkšto džersio modelis su subtilia detale prie krūtinės.",
        categoryId: "tshirts",
        editorialTag: "Minkštas pagrindas",
    },
    {
        name: "Laisvo silueto džemperis",
        description: "Laisvesnio silueto džemperis vėsesniems vakarams ir miesto ritmui.",
        categoryId: "hoodies",
        editorialTag: "Kasdienis sluoksnis",
    },
    {
        name: "Džemperis su užtrauktuku",
        description: "Patogus sluoksniuoti modelis su švelniu vidumi ir tvarkingu kritimu.",
        categoryId: "hoodies",
        editorialTag: "Ramus siluetas",
    },
    {
        name: "Žieminė striukė",
        description: "Pašiltinta striukė su aiškiu siluetu ir kasdieniam dėvėjimui pritaikytu kirpimu.",
        categoryId: "jackets",
        editorialTag: "Viršutinis sluoksnis",
    },
    {
        name: "Lengva striukė",
        description: "Lengvesnis modelis pereinamam sezonui ir švariems deriniams.",
        categoryId: "jackets",
        editorialTag: "Miesto ritmui",
    },
    {
        name: "Megzta kepurė",
        description: "Minimalistinė megzta kepurė, lengvai derinama prie neutralių derinių.",
        categoryId: "accessories",
        editorialTag: "Subtilus akcentas",
    },
    {
        name: "Rankinė per petį",
        description: "Kompaktiška rankinė svarbiausiems daiktams ir patogiam nešiojimui kasdien.",
        categoryId: "accessories",
        editorialTag: "Kasdienė detalė",
    },
];

const DESCRIPTION_VARIANTS = {
    tshirts: [
        "Lengvi medvilniniai marškinėliai kasdieniam dėvėjimui.",
        "Švaraus silueto modelis lengvam miesto įvaizdžiui.",
        "Paprastas pasirinkimas kiekvienai dienai.",
        "Patogus modelis ramiam, minimalistiniam deriniui.",
    ],
    hoodies: [
        "Minkštas sluoksnis vėsesnėms dienoms.",
        "Patogus džemperis kasdieniam dėvėjimui.",
        "Laisvesnio kritimo modelis ramiam deriniui.",
        "Švelnus variantas miesto ritmui.",
    ],
    jackets: [
        "Lengvai derinama striukė kasdieniam dėvėjimui.",
        "Viršutinis sluoksnis permainingam orui.",
        "Tvarkingo silueto modelis miestui.",
        "Paprastas pasirinkimas pereinamam sezonui.",
    ],
    accessories: [
        "Subtilus akcentas kasdieniam deriniui.",
        "Lengvai derinamas aksesuaras kiekvienai dienai.",
        "Paprasta detalė minimalistiniam garderobui.",
        "Kasdienis pasirinkimas ramiam miesto stiliui.",
    ],
};

const FIT_VARIANTS = {
    tshirts: [
        "Krenta tvarkingai ir nevaržo judesių.",
        "Lengvai dera prie džinsų ar laisvų kelnių.",
        "Tinka dėvėti vieną arba po viršutiniu sluoksniu.",
    ],
    hoodies: [
        "Puikiai tinka sluoksniuoti prie marškinėlių ar striukės.",
        "Patogus pasirinkimas nuo ryto iki vakaro.",
        "Laisvesnis kirpimas išlaiko lengvą įvaizdį.",
    ],
    jackets: [
        "Lengvai užbaigia kasdienį derinį.",
        "Tinka dėvėti virš marškinėlių ar džemperio.",
        "Išlaiko tvarkingą ir ramų siluetą.",
    ],
    accessories: [
        "Lengvai įsilieja į neutralių tonų derinius.",
        "Papildo kasdienį garderobą be papildomų detalių.",
        "Patogus pasirinkimas aktyviai dienai mieste.",
    ],
};

const PRICE_VARIANTS = {
    budget: [
        "Lengvas pasirinkimas kasdienai.",
        "Paprastas variantas kiekvienai dienai.",
    ],
    mid: [
        "Patogus ir lengvai derinamas modelis.",
        "Kasdienis variantas neutraliam garderobui.",
    ],
    premium: [
        "Išbaigtas pasirinkimas švariam siluetui.",
        "Tvirtesnis modelis kasdieniam dėvėjimui.",
    ],
};

const STOCK_VARIANTS = {
    in_stock: ["Šis modelis šiuo metu yra vietoje.", "Pasirinkimas paruoštas greitam išsiuntimui."],
    low_stock: ["Likutis ribotas, todėl verta paskubėti.", "Šio modelio liko nedaug."],
    sold_out: ["Šis modelis šiuo metu išparduotas.", "Variantas laikinai nepasiekiamas."],
};

const CATEGORY_ART = {
    tshirts: `
        <path d="M138 118L216 76L296 100L384 76L462 118L424 222L376 202L376 506H218V202L176 222Z" fill="url(#garment)"/>
        <path d="M258 106C271 136 331 136 344 106" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="12" stroke-linecap="round"/>
    `,
    hoodies: `
        <path d="M228 88C260 58 340 58 372 88L404 140L456 190L422 244L386 220L374 512H228L214 220L178 244L144 190L196 140Z" fill="url(#garment)"/>
        <path d="M246 124C272 102 328 102 354 124C354 168 338 194 300 224C262 194 246 168 246 124Z" fill="#f8fafc" fill-opacity="0.18" stroke="#ffffff" stroke-opacity="0.4" stroke-width="10"/>
        <path d="M300 224V510" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10" stroke-linecap="round"/>
    `,
    jackets: `
        <path d="M202 118L252 82H348L398 118L434 176L412 506H188L166 176Z" fill="url(#garment)"/>
        <path d="M300 82V506" stroke="#ffffff" stroke-opacity="0.55" stroke-width="12" stroke-linecap="round"/>
        <path d="M252 82L300 146L348 82" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M168 180L110 260L158 286L190 216" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M432 180L490 260L442 286L410 216" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
    `,
    accessories: `
        <path d="M198 236H402C426 236 446 256 446 280V458C446 482 426 502 402 502H198C174 502 154 482 154 458V280C154 256 174 236 198 236Z" fill="url(#garment)"/>
        <path d="M212 236C212 186 252 144 300 144C348 144 388 186 388 236" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="18" stroke-linecap="round"/>
        <path d="M198 314H402" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10" stroke-linecap="round"/>
    `,
};

const GENERIC_NAME_PATTERN = /^(product|item|prekė|preke|produktas|test|sample)(\s|$)/i;
const GENERIC_DESCRIPTION_PATTERN = /^(description|aprašymas|aprasymas|standartinis|test|sample|lorem)(\s|$)/i;

const currencyFormatter = new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
});

export function formatPrice(value) {
    return currencyFormatter.format(Number(value ?? 0));
}

export function getCategoryMeta(categoryId) {
    return CATEGORY_META[categoryId] ?? CATEGORY_META.collection;
}

export function getOptionLabel(options, id) {
    return options.find((option) => option.id === id)?.label ?? "";
}

export function buildActiveFilterChips({ searchQuery, categoryFilter, inventoryFilter, priceFilter, sortOption }) {
    const chips = [];

    if (searchQuery?.trim()) {
        chips.push({ id: "search", label: `Paieška: "${searchQuery.trim()}"` });
    }

    if (categoryFilter && categoryFilter !== "all") {
        chips.push({ id: "category", label: getOptionLabel(CATEGORY_FILTERS, categoryFilter) });
    }

    if (inventoryFilter && inventoryFilter !== "all") {
        chips.push({ id: "inventory", label: getOptionLabel(INVENTORY_FILTERS, inventoryFilter) });
    }

    if (priceFilter && priceFilter !== "all") {
        chips.push({ id: "price", label: getOptionLabel(PRICE_FILTERS, priceFilter) });
    }

    if (sortOption && sortOption !== "featured") {
        chips.push({ id: "sort", label: `Rūšiavimas: ${getOptionLabel(SORT_OPTIONS, sortOption)}` });
    }

    return chips;
}

export function getBadgeTone(label) {
    if (label === "Mažas likutis") {
        return "border-amber-200 bg-amber-50 text-amber-800";
    }

    if (label === "Populiaru") {
        return "border-[rgba(10,16,30,0.14)] bg-[var(--accent-strong)] text-[var(--foreground-strong)]";
    }

    if (label === "Nauja") {
        return "border-sky-200 bg-sky-50 text-sky-800";
    }

    return "border-[rgba(10,16,30,0.12)] bg-white/80 text-[var(--foreground-muted)]";
}

export function getStockSummary(stockRaw) {
    const stock = Number(stockRaw ?? 0);

    if (!Number.isFinite(stock) || stock <= 0) {
        return {
            label: "Išparduota",
            tone: "text-rose-700",
            surface: "border-rose-200 bg-rose-50 text-rose-700",
        };
    }

    if (stock <= 3) {
        return {
            label: `Liko ${stock} vnt.`,
            tone: "text-amber-800",
            surface: "border-amber-200 bg-amber-50 text-amber-800",
        };
    }

    return {
        label: "Turime vietoje",
        tone: "text-emerald-700",
        surface: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
}

export function selectFeaturedProducts(products, count = 4) {
    return [...products]
        .sort((left, right) => {
            const leftScore = Number(left.isPopular) * 5 + Number(left.isNewArrival) * 3 + Number(left.stock > 0);
            const rightScore =
                Number(right.isPopular) * 5 + Number(right.isNewArrival) * 3 + Number(right.stock > 0);

            if (leftScore === rightScore) {
                return Number(right.newnessRank ?? 0) - Number(left.newnessRank ?? 0);
            }

            return rightScore - leftScore;
        })
        .slice(0, count);
}

export function enrichCatalogProduct(product, index) {
    const fallbackPreset = PRODUCT_STORY_PRESETS[index % PRODUCT_STORY_PRESETS.length];
    const rawName = String(product.productName ?? "").trim();
    const rawDescription = String(product.description ?? product.productDescription ?? "").trim();
    const hasExplicitName = Boolean(rawName);
    const hasExplicitDescription = Boolean(rawDescription);
    const categoryId = resolveCategoryId(
        `${rawName} ${rawDescription}`.toLowerCase(),
        hasExplicitName || hasExplicitDescription ? "collection" : fallbackPreset.categoryId
    );
    const category = getCategoryMeta(categoryId);
    const displayName = isGenericName(rawName) ? fallbackPreset.name : rawName;
    const displayDescription = isGenericDescription(rawDescription)
        ? buildFallbackDescription({
              product,
              displayName,
              categoryId,
              fallbackDescription: fallbackPreset.description,
              index,
          })
        : rawDescription;
    const stock = Number(product.stock ?? 0);
    const newnessRank = Number(product.productId ?? product.id ?? index + 1);
    const badges = [];

    if (index < 3 || newnessRank >= 100) {
        badges.push("Nauja");
    }

    if (index % 3 === 1) {
        badges.push("Populiaru");
    }

    if (stock > 0 && stock <= 3) {
        badges.unshift("Mažas likutis");
    }

    return {
        ...product,
        categoryId,
        categoryLabel: category.label,
        categoryNote: category.note,
        displayName,
        displayDescription,
        editorialTag: hasExplicitName || hasExplicitDescription ? "Mono Studio" : fallbackPreset.editorialTag,
        badges: badges.slice(0, 2),
        isNewArrival: badges.includes("Nauja"),
        isPopular: badges.includes("Populiaru"),
        coverImage: buildProductIllustration({
            categoryId,
            title: displayName,
            subtitle: category.note,
            accentFrom: category.accentFrom,
            accentTo: category.accentTo,
        }),
        newnessRank,
    };
}

function buildFallbackDescription({ product, displayName, categoryId, fallbackDescription, index }) {
    const seed = Number(product.productId ?? product.id ?? index + 1);
    const normalizedSeed = Number.isFinite(seed) && seed > 0 ? seed : index + 1;
    const stock = Number(product.stock ?? 0);
    const price = Number(product.price ?? 0);
    const lead = pickVariant(DESCRIPTION_VARIANTS[categoryId], normalizedSeed, fallbackDescription);
    const fit = pickVariant(FIT_VARIANTS[categoryId], normalizedSeed + 1, "");
    const stockKey = stock <= 0 ? "sold_out" : stock <= 3 ? "low_stock" : "in_stock";
    const stockLine = pickVariant(STOCK_VARIANTS[stockKey], normalizedSeed + 2, "");
    const priceBand = price >= 100 ? "premium" : price >= 50 ? "mid" : "budget";
    const priceLine = pickVariant(PRICE_VARIANTS[priceBand], normalizedSeed + 3, "");

    return [displayName, lead, fit, priceLine, stockLine].filter(Boolean).join(" ");
}

function pickVariant(list, seed, fallback) {
    if (!Array.isArray(list) || list.length === 0) {
        return fallback;
    }

    const safeSeed = Number.isFinite(seed) ? Math.abs(seed) : 0;
    return list[safeSeed % list.length] ?? fallback;
}

function resolveCategoryId(text, fallbackId) {
    const matchedCategory = Object.entries(CATEGORY_KEYWORDS).find(([, keywords]) =>
        keywords.some((keyword) => text.includes(keyword))
    );

    return matchedCategory?.[0] ?? fallbackId;
}

function isGenericName(value) {
    if (!value) {
        return true;
    }

    return GENERIC_NAME_PATTERN.test(value);
}

function isGenericDescription(value) {
    if (!value) {
        return true;
    }

    return GENERIC_DESCRIPTION_PATTERN.test(value);
}

function buildProductIllustration({ categoryId, title, subtitle, accentFrom, accentTo }) {
    const titleText = escapeText(title).slice(0, 32);
    const subtitleText = escapeText(subtitle).slice(0, 22);
    const artwork = CATEGORY_ART[categoryId] ?? CATEGORY_ART.tshirts;
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 820" role="img" aria-label="${titleText}">
            <defs>
                <linearGradient id="surface" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#e2e8f0"/>
                </linearGradient>
                <linearGradient id="panel" x1="20%" x2="80%" y1="0%" y2="100%">
                    <stop offset="0%" stop-color="${accentTo}"/>
                    <stop offset="100%" stop-color="#ffffff"/>
                </linearGradient>
                <linearGradient id="garment" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stop-color="${accentFrom}"/>
                    <stop offset="100%" stop-color="${accentTo}"/>
                </linearGradient>
            </defs>
            <rect width="720" height="820" rx="56" fill="url(#surface)"/>
            <rect x="34" y="34" width="652" height="752" rx="42" fill="url(#panel)"/>
            <circle cx="600" cy="154" r="98" fill="#ffffff" fill-opacity="0.3"/>
            <circle cx="118" cy="674" r="112" fill="#ffffff" fill-opacity="0.22"/>
            <rect x="118" y="120" width="484" height="462" rx="46" fill="#ffffff" fill-opacity="0.76"/>
            <g transform="translate(60 44)">
                ${artwork}
            </g>
            <text x="92" y="690" fill="#0f172a" font-size="40" font-family="Arial, Helvetica, sans-serif" font-weight="700">
                ${titleText}
            </text>
            <text x="92" y="736" fill="#475569" font-size="22" font-family="Arial, Helvetica, sans-serif" letter-spacing="4">
                ${subtitleText.toUpperCase()}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeText(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
