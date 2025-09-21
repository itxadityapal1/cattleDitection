// import breedDatabase from "../data/cattel.json" assert { type: "json" };

document.addEventListener("DOMContentLoaded", function () {
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput");
  const detectBtn = document.getElementById("detectBtn");
  const placeholderResult = document.getElementById("placeholderResult");
  const resultContent = document.getElementById("resultContent");
  const previewContainer = document.getElementById("previewContainer");
  const imagePreview = document.getElementById("imagePreview");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const favoriteBtn = document.getElementById("favoriteBtn");
  const exportBtn = document.getElementById("exportBtn");
  const historySection = document.getElementById("historySection");
  const historyItems = document.getElementById("historyItems");
  const statsSection = document.getElementById("statsSection");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const navTabs = document.querySelectorAll(".nav-tab");
  const cameraBtn = document.getElementById("cameraBtn");
  const galleryBtn = document.getElementById("galleryBtn");
  const cameraModal = document.getElementById("cameraModal");
  const videoElement = document.getElementById("videoElement");
  const captureBtn = document.getElementById("captureBtn");
  const closeCamera = document.getElementById("closeCamera");
  // const apiKey = "AIzaSyDrn9EfZyRztCrCaxOoqWyRDio32eDJX7o";
  const apiKey = "AIzaSyAcGkbkewyh29LOPDlGhNN8E02HQZ-ISPo";

  // Initialize data storage
  let detectionHistory =
    JSON.parse(localStorage.getItem("detectionHistory")) || [];
  let favoriteDetections =
    JSON.parse(localStorage.getItem("favoriteDetections")) || [];
  let currentDetection = null;
  let stream = null;

  // Breed database
  const breedDatabase = {
    sahiwal: {
      name: "Sahiwal",
      confidence: "92%",
      origin: "Montgomery district in Pakistan",
      localName: "Montgomery, Lola, Multani, Teli",
      milkYield: "2725-3125 kg per lactation",
      lactationPeriod: "300 days",
      diseases: "Mastitis, foot rot, respiratory infections",
      nutrition: "High-quality forage with grain supplementation",
      characteristics:
        "Sahiwal is considered the best Indian dairy breed. The color is reddish dun or pale red, often mixed with white patches. Horns are short and stumpy, measuring about 3 inches. They possess large and heavy dewlap and massive hump (males).",
      diseaseManagement:
        "Effective disease and pest management, along with vaccination protocols, are crucial for maintaining the health and productivity of Sahiwal cows. Common vaccines include those for diseases such as bovine viral diarrhea (BVD), infectious bovine rhinotracheitis (IBR), bovine respiratory syncytial virus (BRSV), leptospirosis, and clostridial infections.",
    },
    gir: {
      name: "Gir",
      confidence: "88%",
      origin: "Gir forests of South Kathiawar in Gujarat",
      localName: "Kathiawari, Surti, Desan",
      milkYield: "1800-3000 kg per lactation",
      lactationPeriod: "280 days",
      diseases: "Tick fever, mastitis, foot and mouth disease",
      nutrition: "Requires green fodder and protein-rich supplements",
      characteristics:
        "The Gir is distinctive with its convex forehead, long pendulous ears, and folded horns. The color is shining red to spotted white. It is known for its tolerance to stress conditions and resistance to various tropical diseases.",
      diseaseManagement:
        "Regular deworming and vaccination against hemorrhagic septicemia, black quarter, and foot and mouth disease are essential. Proper tick control measures should be implemented to prevent tick fever.",
    },
    redsindhi: {
      name: "Red Sindhi",
      confidence: "85%",
      origin: "Sindh province in Pakistan",
      localName: "Red Karachi, Sindhi, Malir",
      milkYield: "1840-2600 kg per lactation",
      lactationPeriod: "270 days",
      diseases: "Mastitis, tick-borne diseases, foot rot",
      nutrition: "Responds well to good nutrition with balanced ration",
      characteristics:
        "Medium-sized breed with deep red color, sometimes white markings. Horns are short and thick, curving upward. Known for heat tolerance and good milk production in hot climates.",
      diseaseManagement:
        "Regular vaccination against common diseases and proper tick control measures are essential. Good hygiene practices help prevent mastitis.",
    },
    rathi: {
      name: "Rathi",
      confidence: "82%",
      origin: "Rajasthan, India",
      localName: "Rath, Rathvi",
      milkYield: "1560-2800 kg per lactation",
      lactationPeriod: "280 days",
      diseases: "Mastitis, parasitic infections, heat stress",
      nutrition:
        "Adapted to desert conditions, requires minimal supplementation",
      characteristics:
        "Usually brown with white patches. Compact body with strong limbs. Known for good temperament and adaptability to arid conditions.",
      diseaseManagement:
        "Regular deworming and vaccination against prevalent diseases in arid regions. Proper shelter during extreme heat.",
    },
    lohani: {
      name: "Lohani",
      confidence: "78%",
      origin: "Khyber Pakhtunkhwa, Pakistan and border regions",
      localName: "Lohani, Loni",
      milkYield: "1200-1800 kg per lactation",
      lactationPeriod: "250 days",
      diseases: "Respiratory infections, parasitic diseases",
      nutrition: "Thrives on local fodder and grazing",
      characteristics:
        "Small to medium-sized breed, various colors. Hardy and adapted to mountainous terrain.",
      diseaseManagement: "Regular deworming and basic vaccination protocols.",
    },
    amritmahal: {
      name: "Amrit Mahal",
      confidence: "80%",
      origin: "Karnataka, India",
      localName: "Amrit Mahal",
      milkYield: "500-1000 kg per lactation",
      lactationPeriod: "240 days",
      diseases: "Heat stress, tick-borne diseases",
      nutrition: "Adapted to sparse grazing, requires minimal supplementation",
      characteristics:
        "Grey-white cattle with long horns. Known for endurance and speed as draught animals.",
      diseaseManagement:
        "Tick control measures and vaccination against common diseases.",
    },
    hallikar: {
      name: "Hallikar",
      confidence: "81%",
      origin: "Karnataka, India",
      localName: "Hallikar",
      milkYield: "600-1200 kg per lactation",
      lactationPeriod: "250 days",
      diseases: "Heat stress, parasitic infections",
      nutrition: "Adapted to local grazing conditions",
      characteristics:
        "Grey to dark grey colored, medium-sized with forward-curving horns. Excellent draught animals.",
      diseaseManagement: "Regular deworming and basic healthcare.",
    },
    khillari: {
      name: "Khillari",
      confidence: "79%",
      origin: "Maharashtra, India",
      localName: "Khillari",
      milkYield: "500-900 kg per lactation",
      lactationPeriod: "230 days",
      diseases: "Heat-related disorders, parasitic infections",
      nutrition: "Thrives on sparse grazing",
      characteristics:
        "White or light grey coat, long horns. Well-adapted to dry regions and known for endurance.",
      diseaseManagement: "Heat stress management and regular deworming.",
    },
    kangayam: {
      name: "Kangayam",
      confidence: "83%",
      origin: "Tamil Nadu, India",
      localName: "Kangeyam",
      milkYield: "600-1000 kg per lactation",
      lactationPeriod: "240 days",
      diseases: "Tick fever, foot rot",
      nutrition: "Adapted to local fodder availability",
      characteristics:
        "Compact body with strong limbs, grey or white coat. Known for strength and endurance.",
      diseaseManagement: "Tick control and foot care important.",
    },
    bargur: {
      name: "Bargur",
      confidence: "77%",
      origin: "Tamil Nadu, India",
      localName: "Bargur",
      milkYield: "400-800 kg per lactation",
      lactationPeriod: "220 days",
      diseases: "Local disease resistance",
      nutrition: "Forest-based grazing",
      characteristics:
        "Brown with white markings, medium-sized. Known for speed and endurance in hilly terrain.",
      diseaseManagement: "Generally hardy with good disease resistance.",
    },
    umblachery: {
      name: "Umblachery",
      confidence: "76%",
      origin: "Tamil Nadu, India",
      localName: "Umblachery",
      milkYield: "400-750 kg per lactation",
      lactationPeriod: "210 days",
      diseases: "General cattle diseases",
      nutrition: "Adapted to local conditions",
      characteristics:
        "Small, grey cattle with white markings. Strong and used for agricultural operations.",
      diseaseManagement: "Standard vaccination and deworming protocols.",
    },
    punganur: {
      name: "Punganur",
      confidence: "95%",
      origin: "Andhra Pradesh, India",
      localName: "Punganur",
      milkYield: "540-750 kg per lactation",
      lactationPeriod: "200 days",
      diseases: "General health issues",
      nutrition: "Requires minimal feed",
      characteristics:
        "World's smallest cattle breed. White, grey or light brown. Compact body with short horns.",
      diseaseManagement: "Regular health check-ups due to small size.",
    },
    vechur: {
      name: "Vechur",
      confidence: "90%",
      origin: "Kerala, India",
      localName: "Vechur",
      milkYield: "450-700 kg per lactation",
      lactationPeriod: "190 days",
      diseases: "Generally healthy",
      nutrition: "Minimal requirements",
      characteristics:
        "Previously held record for smallest breed. Light red, black or white. High disease resistance.",
      diseaseManagement: "Generally low maintenance health needs.",
    },
    kenkatha: {
      name: "Kenkatha",
      confidence: "75%",
      origin: "Madhya Pradesh/Uttar Pradesh, India",
      localName: "Kenwaria",
      milkYield: "500-800 kg per lactation",
      lactationPeriod: "220 days",
      diseases: "Local diseases",
      nutrition: "Adapted to poor grazing",
      characteristics:
        "Small, compact animals with prominent forehead. Grey or dark grey coat.",
      diseaseManagement: "Basic healthcare protocols.",
    },
    siri: {
      name: "Siri",
      confidence: "74%",
      origin: "Darjeeling, Sikkim, Bhutan",
      localName: "Siri",
      milkYield: "600-1000 kg per lactation",
      lactationPeriod: "230 days",
      diseases: "Cold climate diseases",
      nutrition: "Mountain grazing adapted",
      characteristics:
        "Medium-sized, black and white patches. Well-suited to hilly terrain.",
      diseaseManagement: "Cold climate disease management.",
    },
    krishnavalley: {
      name: "Krishna Valley",
      confidence: "80%",
      origin: "Karnataka/Maharashtra, India",
      localName: "Krishna Valley",
      milkYield: "900-1500 kg per lactation",
      lactationPeriod: "260 days",
      diseases: "General cattle diseases",
      nutrition: "Requires good quality fodder",
      characteristics:
        "Large-sized, white or grey coat. Long horns and prominent hump.",
      diseaseManagement: "Standard vaccination protocols.",
    },
    bachaur: {
      name: "Bachaur",
      confidence: "76%",
      origin: "Bihar, India",
      localName: "Bachaur",
      milkYield: "600-1000 kg per lactation",
      lactationPeriod: "240 days",
      diseases: "Local diseases",
      nutrition: "Adapted to local conditions",
      characteristics:
        "Compact body, usually white or grey. Good draught animals.",
      diseaseManagement: "Basic healthcare needed.",
    },
    nagori: {
      name: "Nagori",
      confidence: "78%",
      origin: "Rajasthan, India",
      localName: "Nagori",
      milkYield: "500-900 kg per lactation",
      lactationPeriod: "230 days",
      diseases: "Heat stress diseases",
      nutrition: "Adapted to arid region grazing",
      characteristics:
        "White or light grey, long lyre-shaped horns. Known for fast trotting.",
      diseaseManagement: "Heat stress management important.",
    },
    ponwar: {
      name: "Ponwar",
      confidence: "73%",
      origin: "Uttar Pradesh, India",
      localName: "Ponwar",
      milkYield: "400-700 kg per lactation",
      lactationPeriod: "210 days",
      diseases: "General health issues",
      nutrition: "Local fodder adapted",
      characteristics:
        "Small-sized, dark brown or black. Strong for their size.",
      diseaseManagement: "Regular health check-ups.",
    },
    malvi: {
      name: "Malvi",
      confidence: "77%",
      origin: "Madhya Pradesh, India",
      localName: "Malvi",
      milkYield: "600-1000 kg per lactation",
      lactationPeriod: "240 days",
      diseases: "Heat tolerant",
      nutrition: "Dry region adapted",
      characteristics:
        "Medium-sized, white or grey. Strong and durable draught animals.",
      diseaseManagement: "Heat adaptation management.",
    },
    kherigarh: {
      name: "Kherigarh",
      confidence: "72%",
      origin: "Uttar Pradesh, India",
      localName: "Kherigarh",
      milkYield: "500-800 kg per lactation",
      lactationPeriod: "220 days",
      diseases: "Local diseases",
      nutrition: "Minimal requirements",
      characteristics: "Small, compact animals. White or grey coat.",
      diseaseManagement: "Basic healthcare protocols.",
    },
    mewati: {
      name: "Mewati",
      confidence: "79%",
      origin: "Rajasthan/Haryana, India",
      localName: "Mewati",
      milkYield: "1200-1800 kg per lactation",
      lactationPeriod: "260 days",
      diseases: "General cattle diseases",
      nutrition: "Responds well to good nutrition",
      characteristics:
        "Medium to large-sized, white or grey. Strong and well-built.",
      diseaseManagement: "Standard vaccination protocols.",
    },
    gangatiri: {
      name: "Gangatiri",
      confidence: "76%",
      origin: "Uttar Pradesh/Bihar, India",
      localName: "Gangatiri",
      milkYield: "1000-1600 kg per lactation",
      lactationPeriod: "250 days",
      diseases: "General health issues",
      nutrition: "Requires balanced feeding",
      characteristics:
        "Medium-sized, usually white with black points. Dual-purpose breed.",
      diseaseManagement: "Regular health management needed.",
    },
    khariar: {
      name: "Khariar",
      confidence: "71%",
      origin: "Odisha, India",
      localName: "Khariar",
      milkYield: "500-900 kg per lactation",
      lactationPeriod: "230 days",
      diseases: "Local diseases",
      nutrition: "Adapted to local conditions",
      characteristics: "Small to medium-sized, various colors. Hardy animals.",
      diseaseManagement: "Basic healthcare protocols.",
    },
    motu: {
      name: "Motu",
      confidence: "70%",
      origin: "Odisha, India",
      localName: "Motu",
      milkYield: "400-800 kg per lactation",
      lactationPeriod: "220 days",
      diseases: "General health issues",
      nutrition: "Local fodder adapted",
      characteristics: "Small-sized, sturdy animals. Various colors.",
      diseaseManagement: "Regular health check-ups.",
    },
    tharparkar: {
      name: "Tharparkar",
      confidence: "85%",
      origin: "Tharparkar district in Sindh, Pakistan",
      localName: "White Sindhi, Gray Sindhi, Thari",
      milkYield: "2400-3000 kg per lactation",
      lactationPeriod: "295 days",
      diseases: "Parasitic infections, pneumonia, mastitis",
      nutrition:
        "Adapted to poor quality forage, benefits from protein supplements",
      characteristics:
        "The Tharparkar is medium-sized with white or light gray skin. The horns are lyre-shaped and directed upward. They are known for their hardiness and ability to thrive in arid conditions.",
      diseaseManagement:
        "Regular deworming is essential in parasitic infections. Vaccination against foot and mouth disease and hemorrhagic septicemia is recommended. Proper shelter during extreme weather prevents pneumonia.",
    },
    kankrej: {
      name: "Kankrej",
      confidence: "87%",
      origin: "Gujarat, India",
      localName: "Kankrej",
      milkYield: "1800-2500 kg per lactation",
      lactationPeriod: "280 days",
      diseases: "General cattle diseases",
      nutrition: "Requires good quality fodder",
      characteristics:
        "Largest Indian breed. Steel grey to black coat. Long horns and large hump.",
      diseaseManagement: "Standard vaccination and healthcare protocols.",
    },
    ongole: {
      name: "Ongole",
      confidence: "86%",
      origin: "Andhra Pradesh, India",
      localName: "Ongole",
      milkYield: "1500-2200 kg per lactation",
      lactationPeriod: "270 days",
      diseases: "Heat tolerant diseases",
      nutrition: "Responds well to good nutrition",
      characteristics:
        "Large-sized, white coat with black points. Prominent hump and horns.",
      diseaseManagement: "Heat stress management important.",
    },
    hariana: {
      name: "Hariana",
      confidence: "84%",
      origin: "Haryana, India",
      localName: "Hariana",
      milkYield: "1400-2000 kg per lactation",
      lactationPeriod: "270 days",
      diseases: "General cattle diseases",
      nutrition: "Requires balanced feeding",
      characteristics:
        "Medium-sized, white or light grey. Compact body with short horns.",
      diseaseManagement: "Standard healthcare protocols.",
    },
    deoni: {
      name: "Deoni",
      confidence: "83%",
      origin: "Maharashtra, India",
      localName: "Deoni",
      milkYield: "1200-1800 kg per lactation",
      lactationPeriod: "260 days",
      diseases: "Local diseases",
      nutrition: "Responds well to good nutrition",
      characteristics:
        "Dual-purpose breed. White with black spots. Strong and hardy.",
      diseaseManagement: "Regular vaccination and deworming.",
    },
    gaolao: {
      name: "Gaolao",
      confidence: "76%",
      origin: "Maharashtra/Madhya Pradesh, India",
      localName: "Gaolao",
      milkYield: "700-1200 kg per lactation",
      lactationPeriod: "240 days",
      diseases: "General health issues",
      nutrition: "Adapted to local conditions",
      characteristics: "Medium-sized, white or grey. Good draught animals.",
      diseaseManagement: "Basic healthcare needed.",
    },
    dangi: {
      name: "Dangi",
      confidence: "77%",
      origin: "Maharashtra, India",
      localName: "Dangi",
      milkYield: "600-1000 kg per lactation",
      lactationPeriod: "230 days",
      diseases: "Humid climate diseases",
      nutrition: "Adapted to high rainfall areas",
      characteristics:
        "Medium-sized, spotted black and white. Adapted to hilly regions.",
      diseaseManagement: "Humid climate disease management.",
    },
    kosali: {
      name: "Kosali",
      confidence: "75%",
      origin: "Chhattisgarh, India",
      localName: "Kosali",
      milkYield: "500-900 kg per lactation",
      lactationPeriod: "230 days",
      diseases: "Local diseases",
      nutrition: "Adapted to local conditions",
      characteristics: "Small to medium-sized, various colors. Hardy animals.",
      diseaseManagement: "Basic healthcare protocols.",
    },
    khillar: {
      name: "Khillar",
      confidence: "79%",
      origin: "Maharashtra, India",
      localName: "Khillar",
      milkYield: "600-1100 kg per lactation",
      lactationPeriod: "240 days",
      diseases: "Heat tolerant",
      nutrition: "Dry region adapted",
      characteristics: "Medium-sized, white or grey. Strong draught animals.",
      diseaseManagement: "Heat adaptation management.",
    },
    redkandhari: {
      name: "Red Kandhari",
      confidence: "78%",
      origin: "Maharashtra, India",
      localName: "Red Kandhari",
      milkYield: "800-1400 kg per lactation",
      lactationPeriod: "250 days",
      diseases: "General cattle diseases",
      nutrition: "Requires good quality fodder",
      characteristics: "Medium-sized, deep red color. Strong and durable.",
      diseaseManagement: "Standard vaccination protocols.",
    },
    nimari: {
      name: "Nimari",
      confidence: "77%",
      origin: "Madhya Pradesh, India",
      localName: "Nimari",
      milkYield: "1000-1600 kg per lactation",
      lactationPeriod: "250 days",
      diseases: "General health issues",
      nutrition: "Responds well to good nutrition",
      characteristics:
        "Medium-sized, red and white patches. Dual-purpose breed.",
      diseaseManagement: "Regular health management needed.",
    },
    abow: {
      name: "Abow",
      confidence: "74%",
      origin: "Odisha, India",
      localName: "Gopal, Deshi",
      milkYield: "800-1200 kg per lactation",
      lactationPeriod: "230 days",
      diseases: "Local diseases",
      nutrition: "Adapted to harsh climatic conditions and low-quality forage",
      characteristics:
        "Medium stature with a compact and sturdy body frame. Typically grey or white, but can also be light brown. Horns are medium-sized and usually curve upwards and outwards. They possess a moderate hump and a slight dewlap. Known for endurance and hardiness.",
      diseaseManagement:
        "Basic healthcare protocols. Valued for agricultural operations and sustainable milk production in rural households.",
    },
    pulikulam: {
      name: "Pulikulam",
      confidence: "80%",
      origin: "Tamil Nadu, India",
      localName: "Pulikulam",
      milkYield: "400-700 kg per lactation",
      lactationPeriod: "220 days",
      diseases: "General health issues",
      nutrition: "Adapted to sparse grazing",
      characteristics:
        "Small, compact animals. Known for their use in 'Jallikattu'. Various colors.",
      diseaseManagement: "Regular health check-ups.",
    },
    alambadi: {
      name: "Alambadi",
      confidence: "75%",
      origin: "Tamil Nadu, India",
      localName: "Alambadi",
      milkYield: "500-900 kg per lactation",
      lactationPeriod: "230 days",
      diseases: "Local diseases",
      nutrition: "Adapted to local conditions",
      characteristics: "Medium-sized, grey or black. Strong draught animals.",
      diseaseManagement: "Basic healthcare protocols.",
    },
    jersey: {
      name: "Jersey",
      origin: "Jersey islands of the UK",
      localName: "Jersey",
      characteristics:
        "Smallest dairy cattle breed. Tan to cream color with a short dished forehead. Medium-sized horns. Generally docile and humpless.",
      milkYield: "4000-5000 kg per lactation (365 days)",
      milkFat: "5.4%",
      lactationPeriod: "365 days",
      diseases: "General cattle diseases",
      nutrition: "Balanced diet for high milk production",
      diseaseManagement: "Standard vaccination protocols.",
    },
    holsteinFriesian: {
      name: "Holstein Friesian",
      origin: "Holland and Denmark",
      localName: "Holstein Friesian",
      characteristics:
        "Largest dairy breed. Black and white in color. Known as the highest milk producer in the world. Generally docile but heavy animals.",
      milkYield: "6000-8000 kg per lactation",
      milkFat: "3-3.5%",
      lactationPeriod: "305 days",
      diseases: "General cattle diseases",
      nutrition: "High-energy diet for maximum production",
      diseaseManagement: "Standard vaccination protocols.",
    },
    brownSwiss: {
      name: "Brown Swiss",
      origin: "Switzerland",
      localName: "Brown Swiss",
      characteristics:
        "Uniformly brown coat. Large and heavy cattle breed. Second highest milk producer in the world.",
      milkYield: "6000-7000 kg per lactation",
      milkFat: "4%",
      lactationPeriod: "305 days",
      diseases: "General cattle diseases",
      nutrition: "Adapted to various feeding conditions",
      diseaseManagement: "Standard vaccination protocols.",
    },
    ayrshire: {
      name: "Ayrshire",
      origin: "Scotland",
      localName: "Ayrshire",
      characteristics:
        "Cherry red and white color. Small but pointed horns. Third highest milk producer globally.",
      milkYield: "5000-6000 kg per lactation",
      milkFat: "4%",
      lactationPeriod: "305 days",
      diseases: "General cattle diseases",
      nutrition: "Well-adapted to pasture-based systems",
      diseaseManagement: "Standard vaccination protocols.",
    },
    guernsey: {
      name: "Guernsey",
      origin: "United Kingdom",
      localName: "Guernsey",
      characteristics:
        "Fawn with white markings, small pointed horns. Milk is golden colored. Fourth highest milk producer in the world.",
      milkYield: "4000-5000 kg per lactation",
      milkFat: "4.5%",
      lactationPeriod: "305 days",
      diseases: "General cattle diseases",
      nutrition: "Efficient converters of feed to milk",
      diseaseManagement: "Standard vaccination protocols.",
    },
    nagpuri: {
      name: "Nagpuri",
      origin: "Maharashtra, India",
      localName: "Nagpuri",
      milkYield: "600-1200 kg per lactation",
      lactationPeriod: "240 days",
      diseases: "General cattle diseases",
      nutrition: "Adapted to local conditions",
      characteristics: "Medium-sized, usually black. Strong buffalo breed.",
      diseaseManagement: "Standard vaccination protocols.",
      milkFat: "7-8%",
    },
    murrah: {
      name: "Murrah",
      origin: "Haryana, India",
      localName: "Delhi, Kundi, Kali",
      milkYield: "1500-2000 kg per lactation",
      lactationPeriod: "305 days",
      diseases: "General buffalo diseases",
      nutrition: "Protein-rich grass, hay, and green plants",
      characteristics:
        "Jet black with white markings. Massive body with long neck and head. Drooping fore and hindquarters.",
      diseaseManagement: "Standard vaccination protocols",
    },
    surti: {
      name: "Surti",
      origin: "Gujarat, India",
      localName: "Surati, Gujarati, Nadiadi",
      milkYield: "900-1300 kg per lactation",
      lactationPeriod: "305 days",
      diseases: "General buffalo diseases",
      nutrition: "Local fodder and concentrates",
      characteristics:
        "Black to brown or copper color. Medium-sized with wedge-shaped barrel. Sickle-shaped horns.",
      diseaseManagement: "Standard vaccination protocols",
    },
    mehsana: {
      name: "Mehsana",
      origin: "Gujarat, India",
      localName: "Mehsani",
      milkYield: "1200-1500 kg per lactation",
      lactationPeriod: "310 days",
      diseases: "General buffalo diseases",
      nutrition: "Balanced diet for milk production",
      characteristics:
        "Mostly black color. Longer body than Murrah with lighter limbs. Wide forehead with depression.",
      diseaseManagement: "Standard vaccination protocols",
    },
    bhadawari: {
      name: "Bhadawari",
      origin: "Uttar Pradesh, India",
      localName: "Bhadwari, Etawah",
      milkYield: "800-1000 kg per lactation",
      lactationPeriod: "290 days",
      diseases: "General buffalo diseases",
      nutrition: "Straw, corn products, roughage, sorghum, sugarcane residues",
      characteristics:
        "Light or copper colored. Medium-sized wedge-shaped body. Two white lines at lower neck.",
      diseaseManagement: "Standard vaccination protocols",
    },
    jaffarabadi: {
      name: "Jaffarabadi",
      origin: "Gujarat, India",
      localName: "Gir",
      milkYield: "1100 kg per lactation",
      lactationPeriod: "305 days",
      diseases: "General buffalo diseases",
      nutrition: "Local feeding practices",
      characteristics:
        "Uniformly black. Heaviest Indian buffalo breed. Prominent forehead with heavy ring-like horns.",
      diseaseManagement: "Standard vaccination protocols",
    },
    nagpuri: {
      name: "Nagpuri",
      origin: "Maharashtra, India",
      localName: "Arvi, Berari, Chanda",
      milkYield: "700-1200 kg per lactation",
      lactationPeriod: "286 days",
      diseases: "General buffalo diseases",
      nutrition: "Adapted to local conditions",
      characteristics:
        "Predominantly black with white patches. Small body with long thin face. Sword-shaped horns.",
      diseaseManagement: "Standard vaccination protocols",
    },
    godavari: {
      name: "Godavari",
      origin: "Godavari Delta, India",
      localName: "Godavari",
      milkYield: "1200-1500 kg per lactation",
      lactationPeriod: "305 days",
      diseases: "General buffalo diseases",
      nutrition: "Delta region fodder",
      characteristics:
        "Black with brown hair mix. Medium stature with compact, muscular body.",
      diseaseManagement: "Standard vaccination protocols",
    },
    toda: {
      name: "Toda",
      origin: "Tamil Nadu, India",
      localName: "Toda Mundan",
      milkYield: "500 kg per lactation",
      lactationPeriod: "300 days",
      diseases: "General buffalo diseases",
      nutrition: "Hill region grazing",
      characteristics:
        "Fawn with ash-grey mix. Long body with deep chest. Long crescent-shaped horns.",
      diseaseManagement: "Standard vaccination protocols",
    },
    padharpuri: {
      name: "Padharpuri",
      origin: "Maharashtra, India",
      localName: "Dharwari",
      milkYield: "1000-1500 kg per lactation",
      lactationPeriod: "350 days",
      diseases: "General buffalo diseases",
      nutrition: "Local feeding practices",
      characteristics:
        "Light-black to deep-black. Long compact body with narrow face. Very long backward-curving horns.",
      diseaseManagement: "Standard vaccination protocols",
    },
    niliRavi: {
      name: "Nili Ravi",
      origin: "Punjab, India",
      localName: "Panj Kalyan",
      milkYield: "1500-2000 kg per lactation",
      lactationPeriod: "305 days",
      diseases: "General buffalo diseases",
      nutrition: "Northern region fodder",
      characteristics:
        "Black with white markings on five body parts. Medium-sized with fine muzzle. Small tightly coiled horns.",
      diseaseManagement: "Standard vaccination protocols",
    },
    "nili-ravi": {
      name: "Nili Ravi",
      origin: "Punjab, India",
      localName: "Panj Kalyan",
      milkYield: "1500-2000 kg per lactation",
      lactationPeriod: "305 days",
      diseases: "General buffalo diseases",
      nutrition: "Northern region fodder",
      characteristics:
        "Black with white markings on five body parts. Medium-sized with fine muzzle. Small tightly coiled horns.",
      diseaseManagement: "Standard vaccination protocols",
    },
  };

  // Initialize the app
  initApp();

  // Camera functionality
  cameraBtn.addEventListener("click", function () {
    openCamera();
  });

  galleryBtn.addEventListener("click", function () {
    fileInput.click();
  });

  closeCamera.addEventListener("click", function () {
    closeCameraModal();
  });

  captureBtn.addEventListener("click", function () {
    captureImage();
  });

  function openCamera() {
    cameraModal.style.display = "flex";

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (mediaStream) {
          stream = mediaStream;
          videoElement.srcObject = mediaStream;
        })
        .catch(function (error) {
          console.error("Error accessing camera:", error);
          alert("Unable to access camera: " + error.message);
          closeCameraModal();
        });
    } else {
      alert("Your browser does not support camera access.");
      closeCameraModal();
    }
  }

  function closeCameraModal() {
    cameraModal.style.display = "none";

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  }

  function captureImage() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL("image/png");

    // Set as preview image
    imagePreview.src = imageDataUrl;
    previewContainer.style.display = "block";

    // Create a file object from the data URL
    const blob = dataURLtoBlob(imageDataUrl);
    const file = new File([blob], "camera-capture.png", { type: "image/png" });

    // Set as file input (for consistency with file upload flow)
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    // Close camera
    closeCameraModal();
  }

  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);

    for (let i = 0; i < raw.length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  // Handle file upload
  uploadArea.addEventListener("click", function () {
    fileInput.click();
  });

  uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadArea.classList.add("active");
  });

  uploadArea.addEventListener("dragleave", function () {
    uploadArea.classList.remove("active");
  });

  uploadArea.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadArea.classList.remove("active");
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileUpload(fileInput.files[0]);
    }
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files.length) {
      handleFileUpload(fileInput.files[0]);
    }
  });

  function handleFileUpload(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      previewContainer.style.display = "block";
    };

    reader.readAsDataURL(file);
  }

  // Handle breed detection
  detectBtn.addEventListener("click", function () {
    if (!fileInput.files.length) {
      alert("Please select an image first.");
      return;
    }

    // Show loading state
    loadingIndicator.style.display = "block";
    detectBtn.disabled = true;

    // Convert image to base64
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.onload = function () {
      const base64Data = reader.result.split(",")[1];

      // Call Gemini API
      callGeminiAPI(base64Data);
    };
  });

  // Call Gemini API
  async function callGeminiAPI(imageData) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: "Analyze this image of an Indian cattle or buffalo. Identify the breed and provide information about its origin, characteristics, milk yield, common diseases, and nutrition requirements. Also estimate your confidence level in this identification.",
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageData,
                },
              },
            ],
          },
        ],
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Process the response
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Parse the AI response to extract breed information
      const breedInfo = parseAIResponse(aiResponse);

      // Add to detection history
      currentDetection = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        breed: breedInfo.name,
        confidence: breedInfo.confidence,
        imageData: imagePreview.src,
        breedData: breedInfo,
        aiResponse: aiResponse,
        isFavorite: false,
      };

      detectionHistory.unshift(currentDetection);
      localStorage.setItem(
        "detectionHistory",
        JSON.stringify(detectionHistory)
      );

      // Update UI
      updateHistoryDisplay();
      updateStatsDisplay();

      // Display the results
      displayBreedResult(breedInfo, aiResponse);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      alert("Failed to analyze image. Please try again later.");

      // Fallback to demo mode
      const breeds = Object.keys(breedDatabase);
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];

      // Create a demo detection
      currentDetection = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        breed: breedDatabase[randomBreed].name,
        confidence: breedDatabase[randomBreed].confidence,
        imageData: imagePreview.src,
        breedData: breedDatabase[randomBreed],
        aiResponse:
          "Gemini AI is experiencing high demand. Here's sample data for this breed.",
        isFavorite: false,
      };

      detectionHistory.unshift(currentDetection);
      localStorage.setItem(
        "detectionHistory",
        JSON.stringify(detectionHistory)
      );

      // Update UI
      updateHistoryDisplay();
      updateStatsDisplay();

      displayBreedResult(
        breedDatabase[randomBreed],
        "Gemini AI is experiencing high demand. Here's sample data for this breed."
      );
    } finally {
      // Hide loading indicator
      loadingIndicator.style.display = "none";
      detectBtn.disabled = false;
    }
  }

  // Parse AI response to extract structured information
  function parseAIResponse(aiResponse) {
    // Default breed info structure
    const breedInfo = {
      name: "Unknown Breed",
      confidence: "Unknown",
      origin: "Information not available",
      localName: "Information not available",
      milkYield: "Information not available",
      lactationPeriod: "Information not available",
      diseases: "Information not available",
      nutrition: "Information not available",
      characteristics: "Information not available",
      diseaseManagement: "Information not available",
    };

    // Try to extract breed name
    const breedMatches = aiResponse.match(
      /(Sahiwal|Gir|Red Sindhi|Rathi|Lohani|Amrit Mahal|Hallikar|Khillari|Kangayam|Bargur|Umblachery|Punganur|Vechur|Kenkatha|Siri|Krishna Valley|Bachaur|Nagori|Ponwar|Malvi|Kherigarh|Mewati|Gangatiri|Khariar|Motu|Tharparkar|Kankrej|Ongole|Hariana|Deoni|Gaolao|Dangi|Kosali|Khillar|Red Kandhari|Nimari|Abow|Pulikulam|Alambadi|Nili-Ravi|Nagpuri|Jersey|Holstein Friesian|Brown Swiss|Ayrshire|Guernsey|Murrah|Surti|Mehsana|Bhadawari|Jaffarabadi|Godavari|Toda|Padharpuri|Nili Ravi)/gi
    );

    if (breedMatches) {
      breedInfo.name = breedMatches[0];
    }

    // Try to extract confidence level
    const confidenceMatch = aiResponse.match(/(\d+)% confidence/);
    if (confidenceMatch) {
      breedInfo.confidence = confidenceMatch[0];
    } else {
      breedInfo.confidence = "Moderate confidence";
    }

    // For demo purposes, if we detect a known breed, use our database info
    const breedKey = breedInfo.name.toLowerCase().replace(" ", "");
    if (breedDatabase[breedKey]) {
      return {
        ...breedDatabase[breedKey],
        confidence: breedInfo.confidence,
      };
    }

    return breedInfo;
  }

  // Display breed result
  function displayBreedResult(breedData, aiAnalysis) {
    document.getElementById("breedName").textContent = breedData.name;
    document.getElementById("confidenceLevel").textContent =
      breedData.confidence + " confidence";
    document.getElementById("origin").textContent = breedData.origin;
    document.getElementById("localName").textContent = breedData.localName;
    document.getElementById("milkYield").textContent = breedData.milkYield;
    document.getElementById("lactationPeriod").textContent =
      breedData.lactationPeriod;
    document.getElementById("diseases").textContent = breedData.diseases;
    document.getElementById("nutrition").textContent = breedData.nutrition;
    document.getElementById("characteristics").textContent =
      breedData.characteristics;
    document.getElementById("diseaseManagement").textContent =
      breedData.diseaseManagement;
    convertAndAppendHtml(aiAnalysis, "aiAnalysis");

    // Update favorite button state
    updateFavoriteButton();

    // Show results
    placeholderResult.style.display = "none";
    resultContent.style.display = "block";

    // Scroll to results
    resultContent.scrollIntoView({ behavior: "smooth" });
  }

  // Update favorite button state
  function updateFavoriteButton() {
    if (currentDetection) {
      const isFavorite = favoriteDetections.some(
        (d) => d.id === currentDetection.id
      );
      favoriteBtn.innerHTML = isFavorite
        ? '<i class="fas fa-star favorite"></i>'
        : '<i class="far fa-star"></i>';
      favoriteBtn.title = isFavorite
        ? "Remove from favorites"
        : "Add to favorites";

      if (isFavorite) {
        favoriteBtn.classList.add("favorite");
      } else {
        favoriteBtn.classList.remove("favorite");
      }
    }
  }

  // Toggle favorite status
  favoriteBtn.addEventListener("click", function () {
    if (!currentDetection) return;

    const index = favoriteDetections.findIndex(
      (d) => d.id === currentDetection.id
    );

    if (index === -1) {
      // Add to favorites
      favoriteDetections.push(currentDetection);
      currentDetection.isFavorite = true;
      favoriteBtn.innerHTML = '<i class="fas fa-star favorite"></i>';
      favoriteBtn.title = "Remove from favorites";
      favoriteBtn.classList.add("favorite");
    } else {
      // Remove from favorites
      favoriteDetections.splice(index, 1);
      currentDetection.isFavorite = false;
      favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
      favoriteBtn.title = "Add to favorites";
      favoriteBtn.classList.remove("favorite");
    }

    localStorage.setItem(
      "favoriteDetections",
      JSON.stringify(favoriteDetections)
    );
    updateStatsDisplay();
  });

  // Export data
  exportBtn.addEventListener("click", function () {
    if (!currentDetection) return;

    const dataStr = JSON.stringify(currentDetection, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `cattle_detection_${
      currentDetection.breed
    }_${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  });

  // Clear history
  clearHistoryBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to clear all detection history?")) {
      detectionHistory = [];
      favoriteDetections = [];
      localStorage.removeItem("detectionHistory");
      localStorage.removeItem("favoriteDetections");
      updateHistoryDisplay();
      updateStatsDisplay();
    }
  });

  // Navigation tabs
  navTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Update active tab
      navTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show appropriate content
      document.querySelector(".detection-content").style.display =
        tabName === "detection" ? "block" : "none";
      historySection.style.display = tabName === "history" ? "block" : "none";
      statsSection.style.display = tabName === "stats" ? "block" : "none";

      // Update content if needed
      if (tabName === "history") updateHistoryDisplay();
      if (tabName === "stats") updateStatsDisplay();
    });
  });

  // Update history display
  function updateHistoryDisplay() {
    historyItems.innerHTML = "";

    if (detectionHistory.length === 0) {
      historyItems.innerHTML =
        "<p>No detection history yet. Upload an image to get started!</p>";
      return;
    }

    detectionHistory.forEach((detection) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
                        <img src="${detection.imageData}" alt="${
        detection.breed
      }" class="history-img">
                        <div class="history-breed">${detection.breed}</div>
                        <div class="history-confidence">${
                          detection.confidence
                        } confidence</div>
                        <div class="history-date">${new Date(
                          detection.timestamp
                        ).toLocaleString()}</div>
                        ${
                          detection.isFavorite
                            ? '<i class="fas fa-star favorite" style="margin-top: 10px;"></i>'
                            : ""
                        }
                    `;

      historyItem.addEventListener("click", function () {
        // Load this detection
        currentDetection = detection;
        displayBreedResult(detection.breedData, detection.aiResponse);

        // Switch to detection tab
        navTabs.forEach((t) => t.classList.remove("active"));
        document
          .querySelector('[data-tab="detection"]')
          .classList.add("active");
        document.querySelector(".detection-content").style.display = "block";
        historySection.style.display = "none";
        statsSection.style.display = "none";
      });

      historyItems.appendChild(historyItem);
    });
  }

  // Update stats display
  function updateStatsDisplay() {
    document.getElementById("totalDetections").textContent =
      detectionHistory.length;
    document.getElementById("favoriteCount").textContent =
      favoriteDetections.length;

    // Count unique breeds
    const uniqueBreeds = new Set(detectionHistory.map((d) => d.breed));
    document.getElementById("uniqueBreeds").textContent = uniqueBreeds.size;

    // Last detection date
    if (detectionHistory.length > 0) {
      const lastDetection = new Date(detectionHistory[0].timestamp);
      document.getElementById("lastDetection").textContent =
        lastDetection.toLocaleDateString();
    } else {
      document.getElementById("lastDetection").textContent = "-";
    }
  }

  // Initialize the app
  function initApp() {
    updateHistoryDisplay();
    updateStatsDisplay();

    // Sample image click handler
    document
      .querySelectorAll(".sample-img, .featured-breed")
      .forEach((item) => {
        item.addEventListener("click", function () {
          const breed =
            this.alt.toLowerCase().replace(" sample", "").replace(" ", "") ||
            this.getAttribute("data-breed");

          if (breedDatabase[breed]) {
            // Show loading state
            loadingIndicator.style.display = "block";

            // Simulate API call for sample images
            setTimeout(() => {
              // Create a sample detection
              currentDetection = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                breed: breedDatabase[breed].name,
                confidence: breedDatabase[breed].confidence,
                imageData: this.src,
                breedData: breedDatabase[breed],
                aiResponse:
                  "Based on my analysis, this appears to be a " +
                  breedDatabase[breed].name +
                  " breed. " +
                  "I'm " +
                  breedDatabase[breed].confidence +
                  " confident in this identification. " +
                  "This breed is known for " +
                  breedDatabase[breed].characteristics.substring(0, 100) +
                  "...",
                isFavorite: false,
              };

              // Add to history if it's a featured breed (not sample image)
              if (this.classList.contains("featured-breed")) {
                detectionHistory.unshift(currentDetection);
                localStorage.setItem(
                  "detectionHistory",
                  JSON.stringify(detectionHistory)
                );
                updateHistoryDisplay();
                updateStatsDisplay();
              }

              displayBreedResult(
                breedDatabase[breed],
                "Based on my analysis, this appears to be a " +
                  breedDatabase[breed].name +
                  " breed. " +
                  "I'm " +
                  breedDatabase[breed].confidence +
                  " confident in this identification. " +
                  "This breed is known for " +
                  breedDatabase[breed].characteristics.substring(0, 100) +
                  "..."
              );

              loadingIndicator.style.display = "none";
            }, 1000);
          }
        });
      });
  }
});

function convertAndAppendHtml(rawText, elementId) {
  if (typeof rawText !== "string")
    throw new TypeError("rawText must be a string");
  if (!elementId) throw new TypeError("elementId is required");

  // Escape HTML special chars (so user content won't inject HTML)
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  // Convert **bold** into <strong> safely (run after escaping)
  function convertBold(s) {
    return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  const lines = rawText.replace(/\r\n/g, "\n").split("\n");
  let htmlParts = [];
  let listStack = []; // track current open <ul> levels (count)
  let inParagraph = false;

  function closeAllLists() {
    while (listStack.length) {
      htmlParts.push("</ul>");
      listStack.pop();
    }
  }
  function closeParagraph() {
    if (inParagraph) {
      htmlParts.push("</p>");
      inParagraph = false;
    }
  }

  for (let rawLine of lines) {
    // preserve original leading whitespace for nesting calculation, but trim trailing
    const trailingTrimmed = rawLine.replace(/\s+$/, "");
    // detect list item: optional leading spaces/tabs then '*' and a space
    const listMatch = trailingTrimmed.match(/^([\t ]*)(\*)\s+(.*)$/);
    if (listMatch) {
      // It's a list item
      const leading = listMatch[1].replace(/\t/g, "    "); // make tabs 4 spaces
      const content = listMatch[3];
      const level = Math.max(0, Math.floor(leading.length / 4)); // 4 spaces per nest

      // close any open paragraph when starting a list
      closeParagraph();

      // open or close <ul> tags to reach correct level
      while (listStack.length < level + 1) {
        htmlParts.push("<ul>");
        listStack.push(true);
      }
      while (listStack.length > level + 1) {
        htmlParts.push("</ul>");
        listStack.pop();
      }

      // produce the list item (escape then convert bold)
      const itemHtml = convertBold(escapeHtml(content));
      htmlParts.push("<li>" + itemHtml + "</li>");
    } else if (trailingTrimmed.trim() === "") {
      // blank line: acts as paragraph / block separator
      closeAllLists();
      closeParagraph();
    } else {
      // plain paragraph line (not a list item)
      closeAllLists();
      if (!inParagraph) {
        htmlParts.push("<p>");
        inParagraph = true;
      } else {
        // add a space to preserve separation between wrapped lines of same paragraph
        htmlParts.push(" ");
      }
      htmlParts.push(convertBold(escapeHtml(trailingTrimmed)));
    }
  }

  // finish any open tags
  closeAllLists();
  closeParagraph();

  const finalHtml = htmlParts.join("").replace(/\s+<\/li>/g, "</li>"); // tidy

  // Append to element if it exists
  const container = document.getElementById(elementId);
  if (container) {
    container.innerHTML = finalHtml;
  } else {
    // if element not found, still return the HTML so caller can handle it
    console.warn(
      'convertAndAppendHtml: element with id "' +
        elementId +
        '" not found. Returning HTML.'
    );
  }

  return finalHtml;
}

const flipBtn = document.getElementById("flipCamera");
let currentFacingMode = "user"; // default: front camera
let currentStream = null;

async function startCamera(facingMode = "user") {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode },
    });
    videoElement.srcObject = currentStream;
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
}

// Start with front camera
startCamera(currentFacingMode);

// Flip button event
flipBtn.addEventListener("click", () => {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  startCamera(currentFacingMode);
});
