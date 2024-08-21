const branches = [
    {
        address: "SLOT HQ - (84 Obafemi Awolowo Way, Ikeja, Lagos)",
        location: { lat: 6.599763201727255, long: 3.34330293705211 }
    },
    {
        address: "ABUJA 1 BRANCH - (Suite C16/17 New Bannex Plaza Aminu Kano Crescent, Wuse 2. Abuja)",
        location: { lat: 9.319317449635374, long: 7.462790227887317 }
    },
    {
        address: "IKEJA- MEDICAL RD - (2B Medical Road Ikeja Lagos)",
        location: { lat: 6.595134733514932, long: 3.33813862592909 }
    },
    {
        address: "OPEBI BRANCH - (19 Opebi Road, Awosika B/Stop Ikeja)",
        location: { lat: 6.597648174821145, long: 3.3570630508007455 }
    },
    {
        address: "COMPUTER VILLAGE BRANCH - (15/19 Ola-Ayeni Street, Ikeja Lagos)",
        location: { lat: 6.595221135627547, long: 3.3387627840293144 }
    },
    {
        address: "IKEJA CITY MALL BRANCH - (Alausa Ikeja)",
        location: { lat: 6.614580184651454, long: 3.358154128207585 }
    },
    {
        address: "VICTORIA ISLAND 1 - (13A Saka Tinubu Street, Victoria Island, Lagos)",
        location: { lat: 6.427565652961792, long: 3.4180670416903816 }
    },
    {
        address: "VICTORIA ISLAND 2 - (1296, Akin Adesola Street, VI- Lagos)",
        location: { lat: 6.429289936689442, long: 3.42433985239208 }
    },
    {
        address: "EGBEDA AKOWONJO BRANCH - (39 Shasha Road, Akowonjo- Egbeda, Lagos)",
        location: { lat: 6.59039247838851, long: 3.306354908216577 }
    },
    {
        address: "SURULERE BRANCH - (67, Adeniran Ogunsanya Street, Surulere)",
        location: { lat: 6.49267209386674, long: 3.356986937051012 }
    },
    {
        address: "OKOTA BRANCH - (160 Okota Road, Cele Bus-Stop)",
        location: { lat: 6.509157551681676, long: 3.3241688105507277 }
    },
    {
        address: "ABUJA 2 BRANCH - (Plot 466, Ahmadu Bello Way Garki, Beside Eddy-Vic Hotel)",
        location: { lat: 9.02967591268258, long: 7.492427694752763 }
    },
    {
        address: "BENIN BRANCH 1 - (89 Ekenwan Road, Beside Uba, Benin City)",
        location: { lat: 6.334049104504661, long: 5.606112546289415 }
    },
    {
        address: "BENIN BRANCH 2 - (70, Airport Road, By Akenzua Junction, Benin City)",
        location: { lat: 6.323563328424032, long: 5.611731252391033 }
    },
    {
        address: "OYINGBO EBUTE META BRANCH - (Tantalizes Building, 73 Murtala Muhammed Way, Oyingbo, Ebute Meta Lagos)",
        location: { lat: 6.492239460019121, long: 3.378966899364971 }
    },
    {
        address: "AJAH BRANCH - (Former Aquinos Building, Berger Bus Stop Ajah Lagos)",
        location: { lat: 6.639817285884242, long: 3.370995637052518 }
    },
    {
        address: "AJAH BRANCH 2 - (No 1A Addo Road Ajah. Close To Ajah. It's Opposite Olumegbon's Palace At Ado Road Close To Ajah Roundabout Lagos)",
        location: { lat: 6.46912931618666, long: 3.564920316623776 }
    },
    {
        address: "LEKKI 1 BRANCH - (Ologolo Junction, Agungi, Lekki Epe Expressway, Lekki Lagos)",
        location: { lat: 6.469187743434398, long: 3.5813131793798987 }
    },
    {
        address: "LEKKI 2 BRANCH - (Brasas Plaza, No 16 Victoria Arobieke Street. Along Admiralty Road. Lekki Phase 1)",
        location: { lat: 6.447599108177206, long: 3.4718043082151007 }
    },
    {
        address: "ABEOKUTA BRANCH - (10 Lalubu Street, Oke-Ilewo, Abeokuta)",
        location: { lat: 7.135813844820395, long: 3.3357667389059054 }
    },
    {
        address: "WARRI BRANCH - (300 Efurun, Sapele Road, By Refinery Rd. Junction, Efurun, Warri)",
        location: { lat: 5.570845102474933, long: 5.746576617671683 }
    },
    {
        address: "IFE BRANCH - (41, Ibadan Road. Mayfair Area. Ile-Ife)",
        location: { lat: 7.5912808025577805, long: 4.584866877986846 }
    },
    {
        address: "KETU BRANCH - (465 Ikorodu Road, Ketu Bus Stop, Lagos)",
        location: { lat: 6.600940123094589, long: 3.386698351858189 }
    },
    {
        address: "SOMOLU BRANCH - (33, Fola Agoro Street, Somolu Yaba. Lagos State)",
        location: { lat: 6.5260472204864, long: 3.3809476658867568 }
    },
    {
        address: "IKOTUN BRANCH - (37 Idimu Road, Ikotun Lagos. Opposite Idimu Ikotun)",
        location: { lat: 6.550761796033125, long: 3.268313068684969 }
    },
    {
        address: "OJODU BRANCH - (No 2 Adejokun Street, Isheri Magodo Road, Before Isheri Police Station, Isheri Ojodu Berger)",
        location: { lat: 6.639513802603206, long: 3.377125099373637 }
    },
    {
        address: "OWERRI BRANCH - (68 Wetheral Road, Ikenegbu Junction, Owerri)",
        location: { lat: 5.488191887589481, long: 7.038874394712375 }
    },
    {
        address: "OWERRI BRANCH 2 - (Ikenegbu Plaza By Maris Junction, Owerri, Imo State)",
        location: { lat: 5.492957901209256, long: 7.038705658079398 }
    },
    {
        address: "NNEWI BRANCH - (8 Oraifite Road (Beside UBA), Nwanyi Imo Bus Stop, Nnewi)",
        location: { lat: 5.518285855868842, long: null }
    },
    {
        address: "ENUGU BRANCH - (56 Okpara Avenue, Enugu)",
        location: { lat: null, long: null }
    },
    {
        address: "ABULE-EGBA BRANCH - (Samar Filling Station Beside Just Right Oja-Oba, Abule-Egba)",
        location: { lat: null, long: null }
    },
    {
        address: "ABA BRANCH - (120A Aba Owerri Road Beside Aba State Polytechnic)",
        location: { lat: null, long: null }
    },
    {
        address: "ABA BRANCH 2 - (30, Saint Michaels Road Aba, Abia State)",
        location: { lat: null, long: null }
    },
    {
        address: "ALABA BRANCH - (124, Olojo Drive, After Ojo Local Govt, Transformer Bus Stop, Alaba)",
        location: { lat: null, long: null }
    },
    {
        address: "FESTIVAL MALL BRANCH - (Shop 8 Festival Mall, Festac-Town Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "LAGOS AIRPORT - (MM1, Murtala Muhammed Local Airport Ikeja, Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "APAPA BRANCH - (3 Caulcrick Road, Off Kofo Ayobami, Apapa, Lagos State)",
        location: { lat: null, long: null }
    },
    {
        address: "FESTAC BRANCH - (51 ROAD, 512 Junctions, Festac Town Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "OSHODI BRANCH - (The Nigeria Army Arena. Arena Complex, Shop C5, 01, 02, 19, & 20, Bolade Bus-Stop, Oshodi, Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "PORTHARCOURT BRANCH 4 - (Plot 216 Aba Road Opposite, First Bank, First Artillery, PH)",
        location: { lat: null, long: null }
    },
    {
        address: "PORTHARCOURT BRANCH 3 - (NO. 172, Waterline Aba Road PH)",
        location: { lat: null, long: null }
    },
    {
        address: "PORTHARCOURT BRANCH 2 - (244 Abacha Road, GRA Phase 3 PH)",
        location: { lat: null, long: null }
    },
    {
        address: "ORELOPE, EGBEDA - (107, Egbeda – Idimu Road, Orelope Bus-Stop, GB Supermarket, Egbeda)",
        location: { lat: null, long: null }
    },
    {
        address: "AKURE BRANCH - (33, Oyemekun Road Opposite WEMA Bank, Akure, Ondo State)",
        location: { lat: null, long: null }
    },
    {
        address: "CALABAR BRANCH - (18 Ndidem Usiang Iso Beside Lions Club Park, Calabar)",
        location: { lat: null, long: null }
    },

    {
        address: "ISOLO BRANCH - (NO 26, Isolo Way, Beside Heritage Bank Ajao Estate, Airport Road, – Isolo Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "MARINA BRANCH - (A.G Leventis Building – 43 Marina Road, Marina)",
        location: { lat: null, long: null }
    },
    {
        address: "ILORIN BRANCH 1 - (27 Murtala Muhammed Way)",
        location: { lat: null, long: null }
    },
    {
        address: "OSOGBO BRANCH - (No 1 Woleola Estate, Opp Premier Lotto Main Office, 7 Up, Ogo-Oluwa Area, Osogbo, Osun State)",
        location: { lat: null, long: null }
    },
    {
        address: "AGBARA BRANCH - (KM 13, Agbara Expressway. De Sholly Busstop Odofa, Agbara)",
        location: { lat: null, long: null }
    },
    {
        address: "LAWANSON BRANCH - (No 1, Lawanson Road, OANDO Filling Station, Surulere, Lagos State)",
        location: { lat: null, long: null }
    },
    {
        address: "GBAGADA BRANCH - (No. 12 Diya Street, Beside Guaranty Trust Bank, Ifako/Gbagada Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "IBADAN BRANCH - (No, 121 Iwo Road Abayomi Busstop, Simisola House Ibadan)",
        location: { lat: null, long: null }
    },
    {
        address: "ONITSHA BRANCH - (49, New Market Road Opp 9 Mobile Onitsha By Iboku Junction)",
        location: { lat: null, long: null }
    },
    {
        address: "IKORODU BRANCH - (75, Lagos Road Ikorudu)",
        location: { lat: null, long: null }
    },
    {
        address: "SABO YABA BRANCH - (339A Herbert Macaulay Street Sabo Bus Stop, Yaba Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "SANGOTEDO BRANCH - (KM 42, Lekki Epe Expressway, Corner Busstop, Opposite Oando Filling Station Beside Redeem Church, Sangotedo)",
        location: { lat: null, long: null }
    },
    {
        address: "ASABA BRANCH - (287 Nnebuisi Road Asaba, Delta State)",
        location: { lat: null, long: null }
    },
    {
        address: "ASABA BRANCH 2 - (4 Okpanam Road, Beside Southgate Asaba, Delta State)",
        location: { lat: null, long: null }
    },
    {
        address: "BARIGA BRANCH - (24 Olaide Bustop Bariga)",
        location: { lat: null, long: null }
    },
    {
        address: "ADO EKITI BRANCH - (Adebayo Estate, Former Esku Health Centre Beside Energy Petrol Station, Adebayo Road)",
        location: { lat: null, long: null }
    },
    {
        address: "UYO - (43 Oron Road By Paul Bassey Uyo)",
        location: { lat: null, long: null }
    },
    {
        address: "SLOT LAKOWE STORE - (A & M Plaza, KM 42 Lekki Epe Expressway, Adeba Bus Stop, Lakowe Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "OJODU BERGER - (Amram House, Plot 1 Ogunnusi Road, Ojodu Berger Bus Stop, Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "IYANA IPAJA - (64, Ipaja-Idimu Alagutan Bus Stop, Iyana Ipaja Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "SATELLITE TOWN - (408, Old Ojo Road, Tantalizer Building, Abule Ado Satellite Town Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "IBAFO BRANCH - (KM 47, Lagos-Ibadan Express Way Ibafo)",
        location: { lat: null, long: null }
    },
    {
        address: "OTA BRANCH - (GB SUPERMARKET OPPOSITE IGANMODE GRAMMER SCHOOL, OJU-ORE OTA)",
        location: { lat: null, long: null }
    },
    {
        address: "UMUAHIA BRANCH - (1 OHAFIA ROAD, UMUAHIA)",
        location: { lat: null, long: null }
    },
    {
        address: "SAPELE BRANCH - (NO 30, CEMENTARY ROAD, SAPELE, DELTA STATE)",
        location: { lat: null, long: null }
    },
    {
        address: "UROMI BRANCH - (KM 2 NEW AGBOR ROAD, BY OBADAN JUNCTION( RAINOIL FILLING STATION) UROMI EDO STATE)",
        location: { lat: null, long: null }
    },
    {
        address: "OKOKOMAIKO BRANCH - (No, 1 Kenberi Road Okokomaiko Bus Stop, Badagary Express Way)",
        location: { lat: null, long: null }
    },
    {
        address: "OGUDU STORE - (99 Ogudu GRA Road Ojota Lagos State)",
        location: { lat: null, long: null }
    },
    {
        address: "IKORODU 2 - (50 Isawo Road Agric Busstop Ikorodu. @ NNPC Filling Station)",
        location: { lat: null, long: null }
    },
    {
        address: "ALAGBOLE - (Alagbole Busstop, Opposite MRS Filling Station Alagbole-Ajuwon Road, Ogun State)",
        location: { lat: null, long: null }
    },
    {
        address: "SPORTY ENYO FUEL STATION - (Lasu Road, Igando Last Bustop)",
        location: { lat: null, long: null }
    },
    {
        address: "SPORTY AP FUEL STATION - (21 Road Festac)",
        location: { lat: null, long: null }
    },
    {
        address: "SPORTY NACHO - (After SAHCO Diplomatic Car Park NAHCO)",
        location: { lat: null, long: null }
    },
    {
        address: "SPORTY MURTALA MOHAMMED AIRPORT MMA1 - (Alpha Departure Hall)",
        location: { lat: null, long: null }
    },
    {
        address: "SPORTY SAKA TINUBU VI1 - (13A Saka Tinubu Street, Victoria Island, Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "SPORTY IKORODU - (465 Ikorodu Road, Ketu Bus Stop, Lagos)",
        location: { lat: null, long: null }
    },
    {
        address: "SLOT BENIN 3 - (No. 207 Ugbowo Lagos Road, Benin City, Edo)",
        location: { lat: null, long: null }
    }
];

export default branches;
