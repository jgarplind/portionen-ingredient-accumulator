import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { ComboxboxMultiSelect } from "../components/ComboboxMultiSelect";
import styles from "../styles/Home.module.css";

const recipes = [
  {
    label:
      "Bakad rotselleri med rostade hasselnötter, sotade sparrisar och brynt sojasmör",
    value:
      "bakad-rotselleri-med-rostade-hasselnotter-sotade-sparrisar-och-brynt-sojasmor",
  },
  {
    label: "Bananbollar med havre och blåbär",
    value: "bananbollar-med-havre-och-blabar",
  },
  {
    label: "Bananmuffins- perfekta som mellanmål",
    value: "bananmuffins-perfekta-som-mellanmal",
  },
  {
    label: "Belugaplåt med chimichurri",
    value: "belugaplat-med-chimichurri",
  },
  {
    label: "Billig broccolisoppa med picklad rödlök",
    value: "billig-broccolisoppa-med-picklad-rodlok",
  },
  {
    label: "Billig chili sin carne",
    value: "billig-chili-sin-carne",
  },
  {
    label: "Billig pesto på persiljestjälkar",
    value: "billig-pesto-pa-persiljestjalkar",
  },
  {
    label: "Billig rotfruktssoppa",
    value: "billig-rotfruktssoppa",
  },
  {
    label: "Billig vegetarisk lasagne",
    value: "billig-vegetarisk-lasagne",
  },
  {
    label: "Billig vegetarisk rotfruktsgratäng med svamp och linser",
    value: "billig-vegetarisk-rotfruktsgratang-med-svamp-och-linser",
  },
  {
    label: "Blomkål- och potatissoppa med örtolja",
    value: "blomkal-och-potatissoppa-med-ortolja",
  },
  {
    label:
      "Blomkåls -och potatismos med en krämig sås på bönor, soltorkade tomater och oliver",
    value:
      "blomkals-och-potatismos-med-en-kramig-sas-pa-bonor-soltorkade-tomater-och-oliver",
  },
  {
    label: "Bolognese och majskräms quesadillas",
    value: "bolognese-och-majskrams-quesadillas",
  },
  {
    label: "Bolognese på gula ärtor",
    value: "bolognese-pa-gula-artor",
  },
  {
    label: "Bovete-otto med champinjoner och spenat (eller nässlor)",
    value: "bovete-otto-med-champinjoner-och-spenat-eller-nasslor",
  },
  {
    label: "Bovetegröt med dadel, kokos och äppeltopping på stormkök",
    value: "bovetegrot-med-dadel-kokos-och-appeltopping-pa-stormkok",
  },
  {
    label: "Bovetegröt med dadel-kokos och äppeltopping",
    value: "bovetegrot-med-dadel-kokos-och-appeltopping",
  },
  {
    label: "Broccolibars med oliver, fetaost, soltorkade tomater & kikärtor",
    value: "broccolibars-med-oliver-fetaost-soltorkade-tomater-kikartor",
  },
  {
    label: "Broccolipasta",
    value: "broccolipasta",
  },
  {
    label: "Brysselkålspasta med citron, timjan och palsternacka",
    value: "brysselkalspasta-med-citron-timjan-och-palsternacka",
  },
  {
    label: "Brysselkålssallad med asiatisk dressing",
    value: "brysselkalssallad-med-asiatisk-dressing",
  },
  {
    label: "Burgare med vita bönor och tomat",
    value: "burgare-med-vita-bonor-och-tomat",
  },
  {
    label: "Burrito med bönor, ärtguacca och snabbpicklad rödlök",
    value: "burrito-med-bonor-artguacca-och-snabbpicklad-rodlok",
  },
  {
    label: "Bönbiffar med svamp, timjansås och mos",
    value: "bonbiffar-med-svamp-timjansas-och-mos",
  },
  {
    label:
      "Bönburgare grekisk style, med hembakat hamburgerbröd, tsatsiki och picklad rödlök",
    value:
      "bonburgare-grekisk-style-med-hembakat-hamburgerbrod-tsatiski-och-picklad-rodlok",
  },
  {
    label: "Bönburgare med rödlökssås och snabbpicklad zucchini",
    value: "bonburgare-med-rodlokssas-och-snabbpicklad-zucchini",
  },
  {
    label: "Bönchili med majskräm och tortillabröd",
    value: "bonchili-med-majskram-och-tortillabrod",
  },
  {
    label: "Bönquesadillas med majskräm",
    value: "bonquesadillas-med-majskram",
  },
  {
    label: "Cheap taco med salsa och hemmagjort tortillabröd",
    value: "cheap-taco-med-salsa-och-hemmagjort-tortillabrod",
  },
  {
    label: "Chiafrutti med jordgubbssås",
    value: "chiafrutti-med-jordgubbssas",
  },
  {
    label: "Chiafrutti med saffran",
    value: "chiafrutti-med-saffran",
  },
  {
    label: "Chiafrutti med saffran och hallonsås",
    value: "chiafrutti-med-saffran-och-hallonsas",
  },
  {
    label: "Chiafrutti med äppelkompott och knäckecrunch",
    value: "chiafrutti-med-appelkompott-och-knackecrunch",
  },
  {
    label: "Chili sin carne med tortillabröd på stormkök",
    value: "chili-sin-carne-med-tortillabrod-pa-stormkok",
  },
  {
    label: "Citron och morotsgryta med rosmarin och matvete",
    value: "citron-och-morotsgryta-med-rosmarin-och-matvete",
  },
  {
    label: "Citrongratäng på potatis, blomkål och gula ärtor",
    value: "citrongratang-pa-potatis-blomkal-och-gula-artor",
  },
  {
    label: "Crêpes med äppelkompott",
    value: "crepes-med-appelkompott",
  },
  {
    label: "Currygratäng på överblivet ris, paprika, champinjoner och banan",
    value: "currygratang-pa-overblivet-ris-paprika-champinjoner-och-banan",
  },
  {
    label: "Currygryta med gröna ärtor och kikärtor",
    value: "currygryta-med-grona-artor-och-kikartor",
  },
  {
    label: "Currygryta med potatis, blomkål och linser",
    value: "currygryta-med-potatis-blomkal-och-linser",
  },
  {
    label: "Currygryta med spenat, äpple och kikärtor på stormkök",
    value: "currygryta-med-spenat-apple-och-kikartor-pa-stormkok",
  },
  {
    label: "Dhal med gröna linser",
    value: "dhal-med-grona-linser",
  },
  {
    label:
      "Dillstuvad potatis med gottebullar på kidneybönor och soltorkade tomater",
    value:
      "dillstuvad-potatis-med-gottebullar-pa-kidneybonor-och-soltorkade-tomater",
  },
  {
    label: "Dumplings med vitkål, sojafärs, champinjoner och ingefära",
    value: "dumplings-med-vitkal-sojafars-champinjoner-och-ingefara",
  },
  {
    label: "Enklaste linssoppan med ingefära, vitlök och örter",
    value: "enklaste-linssoppan-med-ingefara-vitlok-och-orter",
  },
  {
    label: "Falafel i pitabröd med broccoliröra och syrliga morötter",
    value: "falafel-i-pitabrod-med-broccolirora-och-syrliga-morotter",
  },
  {
    label: "Falafel på gula ärtor med vitlökssås och coleslaw",
    value: "falafel-pa-gula-artor-med-vitlokssas-och-coleslaw",
  },
  {
    label: "Fredriks pasta med morötter och broccoli",
    value: "fredriks-pasta-med-morotter-och-broccoli",
  },
  {
    label: "Fröbollar på överblivet ris, med limesås",
    value: "frobollar-pa-overblivet-ris-med-limesas",
  },
  {
    label: "Garam masala gryta med tomat och kokosmjölk",
    value: "garam-masala-gryta-med-tomat-och-kokosmjolk",
  },
  {
    label: "Gnocchi med spenat, citron och kronärtskocksås",
    value: "gnocchi-med-spenat-citron-och-kronartskocksas",
  },
  {
    label: "Gnocchi med tomat och salviasås",
    value: "gnocchi-med-tomat-och-salviasas",
  },
  {
    label: "Gottebullar med potatis- och broccolimos",
    value: "gottebullar-med-potatis-och-broccolimos",
  },
  {
    label: "Gottebullar med svampsås och örtmos",
    value: "gottebullar-med-svampsas-och-ortmos",
  },
  {
    label: "Grekisk tomat och rödlökspaj",
    value: "grekisk-tomat-och-rodlokspaj",
  },
  {
    label: "Griljerad kålrot",
    value: "griljerad-kalrot",
  },
  {
    label: "Griljerad seitan till julbordet",
    value: "griljerad-seitan-till-julbordet",
  },
  {
    label: "Grillade bönburgare med aubergine och tomatröra",
    value: "grillade-bonburgare-med-aubergine-och-tomatrora",
  },
  {
    label:
      "Grillkväll: veganska färsspett, örtmarinerade grillade potatisar och tsatsiki",
    value:
      "grillkvall-veganska-farsspett-ortmarinerade-grillade-potatisar-och-tsatsiki",
  },
  {
    label: "Grön bovete-otto",
    value: "gron-bovete-otto",
  },
  {
    label: "Grön lasagne med ärtröra och spenat",
    value: "gron-lasagne-med-artrora-och-spenat",
  },
  {
    label: "Grön ärtsoppa med linser, kokosmjölk och grön curry",
    value: "gron-artsoppa-med-linser-kokosmjolk-och-gron-curry",
  },
  {
    label: "Gröna linsbiffar med chili och rökt paprikapulver",
    value: "grona-linsbiffar-med-chili-och-rokt-paprikapulver",
  },
  {
    label: "Grönkålscrêpes på bovetemjöl",
    value: "gronkalscrepes-pa-bovetemjol",
  },
  {
    label: "Grönkålspasta",
    value: "gronkalspasta",
  },
  {
    label: "Grönkålssallad med belugalinser och kardemummadressing",
    value: "gronkalssallad-med-belugalinser-och-kardemummadressing",
  },
  {
    label: "Grönkålssallad med dill och kikärtor",
    value: "gronkalssallad-med-dill-och-kikartor",
  },
  {
    label:
      "Grönkålssallad med kardemumma och saffrandressing och garam masalakikärtor",
    value:
      "gronkalssallad-med-kardemumma-och-saffrandressing-och-garam-masalakikartor",
  },
  {
    label: "Grönsaksbars med jalapeno och majs",
    value: "gronsaksbars-med-jalapeno-och-majs",
  },
  {
    label: "Grönsaksbars med kikärtor",
    value: "gronsaksbars-med-kikartor",
  },
  {
    label: "Grönsaksgryta med ajvar relish och dilltsatsiki",
    value: "gronsaksgryta-med-ajvar-relish-och-dilltsatsiki",
  },
  {
    label: "Gör enkel och cheap vegetarisk taco",
    value: "cheap-vegetarisk-taco",
  },
  {
    label: "Havre- och bananbollar: perfekta att göra av bruna bananer",
    value: "havre-och-bananbollar-perfekta-att-gora-av-bruna-bananer",
  },
  {
    label: "Havrerisotto med pumpa och salvia",
    value: "havrerisotto-med-pumpa-och-salvia",
  },
  {
    label: "Havrerisotto med pumpa och salvia",
    value: "havrerisotto-med-pumpa-och-salvia",
  },
  {
    label: "Hembakat, billigt och kalljäst bröd",
    value: "hembakat-billigt-och-kalljast-brod",
  },
  {
    label: "Hemmagjord och billig granola",
    value: "hemmagjord-och-billig-granola",
  },
  {
    label: "Hemmagjorda frukt- och nötbars (energibars)",
    value: "hemmagjorda-frukt-och-notbars-energibars",
  },
  {
    label: "Höstig macka med stekt grönkål, äpple och vitbönröra",
    value: "hostig-macka-med-gronkal-apple-och-vitbonrora",
  },
  {
    label: "Jordnötssalsa- gryta med massor av jordnötter",
    value: "jordnotssalsa-gryta-med-massor-av-jordnotter",
  },
  {
    label: "Julig pizza med apelsinkräm, pumpa och rödkål",
    value: "julig-pizza-med-apelsinkram-pumpa-och-rodkal",
  },
  {
    label: "Kaffedrink på överblivet kaffe, havredryck, kardemumma och dadlar",
    value: "kaffedrink-pa-overblivet-kaffe-havredryck-kardemumma-och-dadlar",
  },
  {
    label: "Kalljäst bröd i långpanna med morot och rosmarin",
    value: "kalljast-brod-i-langpanna-med-morot-och-rosmarin",
  },
  {
    label: "Kalljäst vörtbröd (eller frallor)",
    value: "kalljast-vortbrod-eller-frallor",
  },
  {
    label: "Kikärtor med ingefärsglaze",
    value: "kikartor-med-ingefarsglaze",
  },
  {
    label: "Kikärtsbiffar med majssås och tortillabröd",
    value: "kikartsbiffar-med-majssas-och-tortillabrod",
  },
  {
    label: "Kikärtsbiffar med nudlar och mangosås",
    value: "kikartsbiffar-med-nudlar-och-mangosas",
  },
  {
    label: "Kikärtscookies med lingon och tahini",
    value: "kikartscookies-med-lingon-och-tahini",
  },
  {
    label: "Kikärtscookies med pepparkakskryddor och lingon",
    value: "kikartscookies-med-pepparkakskryddor-och-lingon",
  },
  {
    label: "Kikärtsgryta i röd currysås som ger många matlådor",
    value: "kikartsgryta-i-rod-currysas-som-ger-manga-matlador",
  },
  {
    label: "Kikärtsgryta med sötpotatis, garam masala och kokos",
    value: "kikartsgryta-med-sotpotatis-garam-masala-och-kokos",
  },
  {
    label: "Kokos- och morotssoppa",
    value: "kokos-och-morotssoppa",
  },
  {
    label: "Kokosmjölksgryta med kikärtor",
    value: "kokosmjolksgryta-med-kikartor",
  },
  {
    label: "Kryddig tomatsås på gula ärtor med potatis och dillsås",
    value: "kryddig-tomatsas-pa-gula-artor-med-potatis-och-dillsas",
  },
  {
    label: "Krämig grönkål, svamp och bönsås med grönpeppar",
    value: "kramig-gronkal-svamp-och-bonsas-med-gronpeppar",
  },
  {
    label: "Krämig kikärtsgryta med kirskål och paprika",
    value: "kramig-kikartsgryta-med-kirskal-och-paprika",
  },
  {
    label: "Krämig morots- och paprikapasta",
    value: "kramig-morots-och-paprikapasta",
  },
  {
    label: "Krämig pasta med oliver och svarta bönor",
    value: "kramig-pasta-med-oliver-och-svarta-bonor",
  },
  {
    label: "Krämig pasta med oliver och svarta bönor",
    value: "kramig-pasta-med-oliver-och-svarta-bonor",
  },
  {
    label: "Krämig spenatgryta och naan på muurikka",
    value: "kramig-spenatgryta-och-naan-pa-muurikka",
  },
  {
    label: "Krämig vitkålspasta med tofu och rökt paprikapulver",
    value: "kramig-vitkalspasta-med-tofu-och-rokt-paprikapulver",
  },
  {
    label: "Krämig zucchini- och svamppasta",
    value: "kramig-zucchini-och-svamppasta",
  },
  {
    label: "Krämig ärtpasta med vita bönor",
    value: "kramig-artpasta-med-vita-bonor",
  },
  {
    label: "Krämig ärtpasta med vita bönor",
    value: "kramig-artpasta-med-vita-bonor",
  },
  {
    label: "Kålrotsburgare med rödbetsbröd, grönkål och karamelliserad lök",
    value: "kalrotsburgare-med-rodbetsbrod-gronkal-och-karamelliserad-lok",
  },
  {
    label: "Lasagne gjord på överbliven majssoppa, spenat och svarta bönor",
    value: "lasagne-gjord-pa-overbliven-majssoppa-spenat-och-svarta-bonor",
  },
  {
    label: "Lime- och kokosmjölksgryta med kikärtor",
    value: "lime-och-kokosmjolksgryta-med-kikartor",
  },
  {
    label: "Lins- och morotsbollar med limesås",
    value: "lins-och-morotsbollar-med-limesas",
  },
  {
    label: "Lins- och pumpabollar med ajvar relish",
    value: "lins-och-pumpabollar-med-ajvar-relish",
  },
  {
    label: "Lins- och pumpabollar med ajvar relish",
    value: "lins-och-pumpabollar-med-ajvar-relish",
  },
  {
    label: "Linsbollar med tomatsås och spagetti",
    value: "linsbollar-med-tomatsas-och-spagetti",
  },
  {
    label: "Linsköttbullar med morotztsatsiki och ugnsrostad potatis",
    value: "linskottbullar-med-morotztsatsiki-och-ugnsrostad-potatis",
  },
  {
    label: "Linspizza med potatis, spenat och fetaost",
    value: "linspizza-med-potatis-spenat-och-fetaost",
  },
  {
    label: "Linssoppa med rotfrukter och grillad paprika i mattermos",
    value: "linssoppa-med-rotfrukter-och-grillad-paprika-i-mattermos",
  },
  {
    label: "Linssoppa med rotfrukter och grillad paprikaâ€¯",
    value: "linssoppa-med-rotfrukter-och-grillad-paprika%e2%80%af",
  },
  {
    label: "Linssoppa med rotfrukter och grillad paprikaâ€¯",
    value: "linssoppa-med-rotfrukter-och-grillad-paprika%e2%80%af",
  },
  {
    label: "Linssoppa på sötpotatis och morot",
    value: "linssoppa-pa-sotpotatis-och-morot",
  },
  {
    label: "Linsstroganoff med potatismos och gröna ärtor",
    value: "linsstroganoff-med-potatismos-och-grona-artor",
  },
  {
    label: "Ljummen sallad på svarta bönor och quinoa",
    value: "ljummen-sallad-pa-svarta-bonor-och-quinoa",
  },
  { label: "Lökpaj", value: "lokpaj/" },
  {
    label: "Majs och kokossoppa med svarta bönor",
    value: "majs-och-kokossoppa-med-svarta-bonor",
  },
  {
    label: "Majs, bön och jalapeÃ±o-fritters med coleslaw och tortillabröd",
    value: "majs-bon-och-jalapeno-fritters-med-coleslaw-och-tortillabrod",
  },
  {
    label: "Majscarbonara",
    value: "majscarbonara",
  },
  {
    label: "Majskrämspiroger med svarta bönor",
    value: "majskramspiroger-med-svarta-bonor",
  },
  {
    label: "Majsnuggets med barbequesås",
    value: "majsnuggets-med-barbequesas",
  },
  {
    label: "Majsnuggets med bbq sås på stormkök",
    value: "majsnuggets-med-bbq-sas-pa-stormkok",
  },
  {
    label: "Matig brysselkålssallad med päron och picklad rödlök",
    value: "matig-brysselkalssallad-med-paron-och-picklad-rodlok",
  },
  {
    label: "Matlådeprepp! Dhal på mungbönor",
    value: "dhal-pa-mungbonor",
  },
  {
    label: "Matvetebiffar med ärtpesto och potatis",
    value: "matvetebiffar-med-artpesto-och-potatis",
  },
  {
    label: "Matveteotto med topping på soltorkade tomater, oliver och kikärtor",
    value:
      "matveterisotto-med-topping-pa-soltorkade-tomater-oliver-och-kikartor",
  },
  {
    label: "Matvetesallad med citron- och persiljemarinerade vita bönor",
    value: "matvetesallad-med-citron-och-persiljemarinerade-vita-bonor",
  },
  {
    label: "Minestronesoppa med röda linser",
    value: "minestronesoppa-med-roda-linser",
  },
  {
    label: "Morot -och zucchinibiffar med matvete och citronsås",
    value: "morot-och-zucchinibiffar-med-matvete-och-citronsas",
  },
  {
    label: "Morot- och linsbiffar",
    value: "morot-och-linsbiffar",
  },
  {
    label: "Morotslasagne med fetaost och soltorkad tomat",
    value: "morotslasagne-med-fetaost-och-soltorkad-tomat",
  },
  {
    label: "Mustig vegansk pumpagryta",
    value: "mustig-vegansk-pumpagryta",
  },
  {
    label: "No dough cookie dough boll (kikärtsbollar)",
    value: "no-dough-cookie-dough-boll-kikartsbollar",
  },
  {
    label: "Nudelsallad med jordnötssås",
    value: "nudelsallad-med-jordnotssas",
  },
  {
    label: "Nudelsoppa med grönkål och tempeh",
    value: "nudelsoppa-med-gronkal-och-tempeh",
  },
  {
    label: "Nudelwok med asiatiska smaker (och mindre kött)",
    value: "nudelwok-med-asiatiska-smaker-och-mindre-kott",
  },
  {
    label: "Nudelwok med sojafärs, ingefära, chili, lime",
    value: "nudelwok-med-sojafars-ingefara-chili-lime",
  },
  {
    label: "One pot med tomat, vita bönor, ris och persilja",
    value: "onepot-med-tomat-vita-bonor-ris-och-persilja",
  },
  {
    label: "One pot pasta",
    value: "one-pot-pasta",
  },
  {
    label: "Onepot med potatis, tomat och linser",
    value: "onepot-med-potatis-tomat-och-linser",
  },
  {
    label: "Paj med nässlor, kirskål, svamp och soltorkade tomater",
    value: "paj-med-nasslor-kirskal-svamp-och-soltorkade-tomater",
  },
  {
    label: "Pasta med paprikapesto och rostade kikärtor",
    value: "pasta-med-paprikapesto-och-rostade-kikartor",
  },
  {
    label: "Pasta med persiljepesto och vita bönor",
    value: "pasta-med-persiljepesto",
  },
  {
    label: "Pasta med tomatsås och svarta bönor",
    value: "pasta-med-tomatsas-och-svarta-bonor",
  },
  {
    label: "Pasta med ugnsgratinerad fetaost, tomat och vita bönor",
    value: "pasta-med-ugnsgratinerad-fetaost-tomat-och-vita-bonor",
  },
  {
    label: "Pasta med ugnsgratinerad fetaost, tomat och vita bönor",
    value: "pasta-med-ugnsgratinerad-fetaost-tomat-och-vita-bonor",
  },
  {
    label: "Pastaplåt med ugnsrostade grönsaker",
    value: "pastaplat-med-ugnsrostade-gronsaker",
  },
  {
    label: "Pastej på champinjoner, pumpafrön och timjan",
    value: "pastej-pa-champinjoner-pumpafron-och-timjan",
  },
  {
    label: "Piroger med potatis- och ajvarfyllning",
    value: "piroger-med-potatis-och-ajvarfyllning",
  },
  {
    label: "Piroger med svamp och spenatfyllning",
    value: "piroger-med-svamp-och-spenatfyllning",
  },
  {
    label: "Pita med rostad blomkål, bönröra och snabbpicklad rödlök",
    value: "pita-med-rostad-blomkal-bonrora-och-snabbpicklad-rodlok",
  },
  {
    label: "Pitabröd med falafelbiffar på gula och gröna ärtor",
    value: "pitabrod-med-falafelbiffar-pa-gula-och-grona-artor",
  },
  {
    label: "Pizza bianco med blomkål, champinjoner och citron",
    value: "pizza-bianco-med-blomkal-champinjoner-och-citron",
  },
  {
    label: "Pizza bianco med rödbetor, valnötter och nektarin",
    value: "pizza-bianco-med-rodbetor-valnotter-och-nektarin",
  },
  {
    label: "Pizza bianco med sötpotatis",
    value: "pizza-bianco-med-sotpotatis",
  },
  {
    label: "Pizza med ajvarkikärtskräm och grönsaker",
    value: "pizza-med-ajvarkikartskram-och-gronsaker",
  },
  {
    label: "Pizza med citronkikärtskräm, champinjoner & lök",
    value: "pizza-med-citronkikartskram-champinjoner-lok",
  },
  {
    label: "Pizza med grönkål och pumpatopping",
    value: "pizza-med-gronkal-och-pumpatopping",
  },
  {
    label: "Pizza med jordärtskocka",
    value: "pizza-med-jordartskocka",
  },
  {
    label: "Plättar av överblivet mos med rostade linser, lingon och löksås",
    value: "plattar-av-overblivet-mos-med-rostade-linser-lingon-och-loksas",
  },
  {
    label: "Potatis och chimichurripizza",
    value: "potatis-och-chimichurripizza",
  },
  {
    label: "Potatis och grönkålsgratäng",
    value: "potatis-och-gronkalsgratang",
  },
  {
    label: "Potatis och purjolökssoppa med krutonger",
    value: "potatis-och-purjolokssoppa-med-krutonger",
  },
  {
    label: "Potatis- och palsternacksoppa med nöt- och dadeltopping",
    value: "potatis-och-palsternacksoppa-med-not-och-dadeltopping",
  },
  {
    label: "Potatiskaka med dill och salsa",
    value: "potatiskaka-med-dill-och-salsa",
  },
  {
    label: "Potatisplåt med dilltsatsiki och snabbpicklad rödlök",
    value: "potatisplat-med-dilltsatsiki-och-snabbpicklad-rodlok",
  },
  {
    label: "Potatissallad med belugalinser",
    value: "potatissallad-med-belugalinser",
  },
  {
    label: "Potatissallad med belugalinser och citrondressing",
    value: "potatissallad-med-belugalinser-och-citrondressing",
  },
  {
    label: "Potatissallad med chimichurri",
    value: "potatissallad-med-chimichurri",
  },
  {
    label: "Potatissallad med rödlök, tomat, fetaost och oliver",
    value: "potatissallad-med-rodlok-tomat-fetaost-och-oliver",
  },
  {
    label: "Potatissallad med salsa och svarta bönor",
    value: "salsapotatissallad-med-svarta-bonor",
  },
  {
    label: "Potatissoppa och vitbönröra med örter och citron",
    value: "potatissoppa-och-vitbonrora-med-orter-och-citron",
  },
  {
    label: "Potatissoppa och vitbönröra med örter och citron",
    value: "potatissoppa-och-vitbonrora-med-orter-och-citron",
  },
  {
    label: "Proteinbollar",
    value: "proteinbollar",
  },
  {
    label: "Pumpa och rödlökspaj",
    value: "pumpa-och-rodlokspaj",
  },
  {
    label: "Pumpa- och linssoppa med kokos och rostad brysselkål",
    value: "pumpa-och-linssoppa-med-kokos-och-rostad-brysselkal",
  },
  {
    label: "Pumpa- och linssoppa med kokos och rostad brysselkål",
    value: "pumpa-och-linssoppa-med-kokos-och-rostad-brysselkal",
  },
  {
    label: "Pumpagryta med garam masala och naanbröd",
    value: "pumpagryta-med-garam-masala-och-hemmagjort-naanbrod",
  },
  {
    label: "Pumpagryta med garam masala och naanbröd",
    value: "pumpagryta-med-garam-masala-och-hemmagjort-naanbrod",
  },
  {
    label: "Pumpamarmelad med apelsin och ingefära",
    value: "pumpamarmelad-med-apelsin-och-ingefara",
  },
  {
    label: "Pumpapaj med salvia, spenat och fetaost",
    value: "pumpapaj-med-salvia-spenat-och-fetaost",
  },
  {
    label: "Pumpapaj med salvia, spenat och fetaost",
    value: "pumpapaj-med-salvia-spenat-och-fetaost",
  },
  {
    label: "Pumpapasta med grönkålstopping",
    value: "pumpapasta-med-gronkalstopping",
  },
  {
    label: "Pumpapasta- pasta på pumpa, örtolja, citron",
    value: "pumpapasta",
  },
  {
    label: "Pumpapizza med brysselkål och snabbpicklad rödlök",
    value: "pumpapizza-med-brysselkal-och-snabbpicklad-rodlok",
  },
  {
    label: "Pumpapizza med brysselkål och snabbpicklad rödlök",
    value: "pumpapizza-med-brysselkal-och-snabbpicklad-rodlok",
  },
  {
    label: "Ris och fröbollar",
    value: "ris-och-frobollar",
  },
  {
    label: "Rostad potatis med grönkål, dragonsås & groddar",
    value: "rostad-potatis-med-gronkal-dragonsas-groddar",
  },
  {
    label: "Rotfruktswraps med hemmagjorda tortillabröd och rödbetshummus",
    value: "rotfruktswraps-med-hemmagjorda-tortillabrod-och-rodbetshummus",
  },
  {
    label: "Rotsellerisoppa med äpple och timjan",
    value: "rotsellerisoppa-med-apple-och-timjan",
  },
  {
    label: "Råraka med belugalinser, pesto, rödlök och soltorkade tomater",
    value: "raraka-med-belugalinser-pesto-rodlok-och-soltorkade-tomater",
  },
  {
    label: "Råraka med ärtguacca, marinerade bönor och snabbpicklad rödlök",
    value: "raraka-med-artguacca-marinerade-bonor-och-snabbpicklad-rodlok",
  },
  {
    label: "Röd potatissallad med örtmarinerade och rostade kikärtor",
    value: "rod-potatissallad-med-ortmarinerade-och-rostade-kikartor",
  },
  {
    label: "Röda linsbollar med kokos- och spenatsås",
    value: "roda-linsbollar-med-kokos-och-spenatsas",
  },
  {
    label: "Rödbetsfalafel med tortilla och vitlökssås",
    value: "rodbetsfalafel-med-tortilla-och-vitlokssas",
  },
  {
    label: "Rödbetsfalafel på gula ärtor med matvetesallad",
    value: "rodbetsfalafel-pa-gula-artor-med-matvetesallad",
  },
  {
    label: "Rödbetspaj med fetaost",
    value: "rodbetspaj-med-fetaost",
  },
  {
    label: "Rödcurrygryta med röda linser och nudlar",
    value: "rodcurrygryta-med-roda-linser-och-nudlar",
  },
  {
    label: "Saffransfalafel med coleslaw, tortillabröd och snabbpicklad rödlök",
    value: "saffransfalafel-med-coleslaw-tortillabrod-och-snabbpicklad-rodlok",
  },
  {
    label: "Saffransfalafel på gula ärtor",
    value: "saffransfalafel-pa-gula-artor",
  },
  {
    label: "Saffranskaka med mandelmassa och vit choklad",
    value: "saffranskaka-med-mandel-och-vitchoklad",
  },
  {
    label: "Shoe string fries med smetana och tångkaviar",
    value: "shoe-string-fries-med-smetana-och-tangkaviar",
  },
  {
    label: "Slät linssoppa med kokosmjölk",
    value: "slat-linssoppa-med-kokosmjolk",
  },
  {
    label: "Snabb pestopasta med haricots verts",
    value: "snabb-pestopasta-med-haricots-verts",
  },
  {
    label: "Snabb tomatpasta med rostade kikärtor",
    value: "snabb-tomatpasta-med-rostade-kikartor",
  },
  {
    label: "Snabb tomatpasta med rostade kikärtor",
    value: "snabb-tomatpasta-med-rostade-kikartor",
  },
  {
    label: "Spenat och svamppaj med fetaost",
    value: "spenat-och-svamppaj-med-fetaost",
  },
  {
    label: "Spenatcrêpes med svampfyllning",
    value: "spenatcrepes-med-svampfyllning",
  },
  {
    label: "Svamprisotto med rödbetor i ugn",
    value: "svamprisotto-med-rodbetor-i-ugn",
  },
  {
    label: "Svampsoppa med vita bönor och timjan",
    value: "svampsoppa-med-vita-bonor-och-timjan",
  },
  {
    label: "Svampsoppa med vita bönor och timjan",
    value: "svampsoppa-med-vita-bonor-och-timjan",
  },
  {
    label: "Svartkålspasta med knaperstekt alspånsrökt tofu",
    value: "svartkalspasta-med-knaperstekt-alspansrokt-tofu",
  },
  {
    label: "Tacosoppa med ärtguacca",
    value: "tacosoppa-med-artguacca",
  },
  {
    label: "Tomat och kokosgryta med grönkål och svarta bönor",
    value: "tomat-och-kokosgryta-med-gronkal-och-svarta-bonor",
  },
  {
    label: "Tomatsoppa med fetaost",
    value: "tomatsoppa-med-fetaost",
  },
  {
    label: "Tomatsoppa med fetaost",
    value: "tomatsoppa-med-fetaost",
  },
  {
    label: "Tomatsoppa med ugnsrostade blomkål",
    value: "tomatsoppa-med-ugnsrostade-blomkal",
  },
  {
    label: "Tomatsoppa med ört, -tomat och fetabröd",
    value: "tomatsoppa-med-ort-tomat-och-fetabrod-2",
  },
  {
    label: "Tomatsoppa med ört, -tomat och fetabröd",
    value: "tomatsoppa-med-ort-tomat-och-fetabrod-2",
  },
  {
    label: "Tomatsås med svamp, vita bönor, timjan och krämig polenta",
    value: "tomatsas-med-svamp-vita-bonor-timjan-och-kramig-polenta",
  },
  {
    label: "Tortilla med bönor på stormkök",
    value: "tortilla-med-bonor-pa-stormkok",
  },
  {
    label: "Tortilla med pumpa, grönkål, äpple och svarta bönor",
    value: "tortilla-med-pumpa-gronkal-apple-och-svarta-bonor",
  },
  {
    label: "Två dagars rågbröd",
    value: "tva-dagars-ragbrod",
  },
  {
    label: "Ugnsrostad potatis med kikärtor och morotstsatsiki",
    value: "ugnsrostad-potatis-med-kikartor-och-morotstsatsiki",
  },
  {
    label: "Varm bulgursallad med citrondressing och vita bönor",
    value: "varm-bulgursallad-med-citrondressing-och-vita-bonor",
  },
  {
    label: "Vegansk banankaka med kikärtsspad och kikärtor",
    value: "vegansk-banankaka",
  },
  {
    label: "Vegansk belugabolognese",
    value: "vegansk-belugabolognese",
  },
  {
    label: "Vegansk belugalasagne",
    value: "vegansk-belugalasagne",
  },
  {
    label: "Vegansk bolognese på sojafärs",
    value: "vegansk-bolognese-pa-sojafars",
  },
  {
    label: "Vegansk carbonara med gröna ärtor",
    value: "vegansk-carbonara-med-grona-artor",
  },
  {
    label: "Vegansk flygande jakob",
    value: "vegansk-flygande-jakob",
  },
  {
    label: "Vegansk hemmagjord glass med jordnötter och kokos",
    value: "vegansk-hemmagjordglass-med-jordnotter-och-kokos",
  },
  {
    label: "Vegansk kikärtsgryta med sötpotatis",
    value: "vegansk-kikartsgryta-med-sotpotatis",
  },
  {
    label: "Vegansk kokos- och spenatsås med kikärtor",
    value: "vegansk-kokos-och-spenatsas-med-kikartor",
  },
  {
    label: "Vegansk linslasagne med ajvar relish och zucchini",
    value: "vegansk-linslasagne-med-ajvar-relish-och-zucchini",
  },
  {
    label: "Vegansk pannkaka",
    value: "vegansk-pannkaka",
  },
  {
    label: "Vegansk pasta med ärtpesto",
    value: "vegansk-pasta-med-artpesto",
  },
  {
    label: "Vegansk potatisgratäng med rödbetsbiffar",
    value: "vegansk-potatisgratang-med-rodbetsbiffar",
  },
  {
    label: "Vegansk rödbetsfalafel",
    value: "vegansk-rodbetsfalafel",
  },
  {
    label: "Vegansk rödcurry pumpagryta med kikärtor",
    value: "vegansk-rodcurry-pumpagryta-med-kikartor",
  },
  {
    label: "Vegansk rödcurry pumpagryta med kikärtor",
    value: "vegansk-rodcurry-pumpagryta-med-kikartor",
  },
  {
    label: "Vegansk, billig kålpudding",
    value: "vegansk-billig-kalpudding",
  },
  {
    label: "Veganska billiga â€köttbullarâ€ med löksås",
    value: "veganska-billiga-kottbullar-med-loksas",
  },
  {
    label: "Veganska falafel på gula ärtor",
    value: "veganska-falafel-pa-gula-artor",
  },
  {
    label: "Veganska köttbullar med pasta och tomatsås",
    value: "veganska-kottbullar-med-pasta-tomatsas",
  },
  {
    label: "Veganska linsbollar med pasta och tomatsås",
    value: "veganska-linsbollar-med-pasta-och-tomatsas",
  },
  {
    label: "Veganska morot- och linsbiffar",
    value: "veganska-morot-och-linsbiffar",
  },
  {
    label: "Veganska â€Köttbullarâ€ med pasta och tomatsås",
    value: "veganska-kottbullar-med-pasta-och-tomatsas",
  },
  {
    label:
      "Veganskt pålägg: röra på soltorkade tomater, pumpakärnor och oliver",
    value: "veganskt-palagg-rora-pa-soltorkade-tomater-pumpakarnor-och-oliver",
  },
  {
    label: "Veganskt pålägg: vit bönröra med grillad paprika",
    value: "veganskt-palagg-vit-bonrora-med-grillad-paprika",
  },
  {
    label: "Vegetarisk billig rödbetssoppa",
    value: "vegetarisk-rodbetssoppa",
  },
  {
    label: "Vegetarisk bourguignon (ish) på linser",
    value: "vegetarisk-bourguignon-isch-pa-linser",
  },
  {
    label: "Vegetarisk broccolipaj",
    value: "vegetarisk-broccolipaj",
  },
  {
    label:
      "Vegetarisk grönkålslasagne med linser, soltorkade tomater och oliver",
    value:
      "vegetarisk-gronkalslasagne-med-linser-soltorkade-tomater-och-oliver",
  },
  {
    label:
      "Vegetarisk grönkålspizza med kikärtskräm, citron och picklad rödlök",
    value: "vegetarisk-gronkalspizza-med-kikartskram-citron-och-picklad-rodlok",
  },
  {
    label: "Vegetarisk paj med belugafyllning",
    value: "vegetarisk-paj-med-belugafyllning",
  },
  {
    label: "Vegetarisk paj med zucchini, tomat och lökfyllning",
    value: "vegetarisk-paj-med-zucchini-tomat-och-lokfyllning",
  },
  {
    label: "Vegetarisk tacopaj i långpanna",
    value: "vegetarisk-tacopaj-i-langpanna",
  },
  {
    label: "Vegetarisk tacopaj med belugalinser",
    value: "vegetarisk-tacopaj-med-belugalinser",
  },
  {
    label: "Vegetarisk tacopizza",
    value: "vegetarisk-tacopizza",
  },
  {
    label: "Vegetariska burgare på svarta bönor",
    value: "vegetariska-burgare-pa-svarta-bonor",
  },
  {
    label: "Vegetariska nuggets med sötpotatis, morötter och jordnötssås",
    value: "vegetariska-nuggets-med-sotpotatis-och-jordnotssas",
  },
  {
    label: "Vegopasta på linser",
    value: "vegopasta-pa-linser",
  },
  {
    label: "Vegopasta på linser",
    value: "vegopasta-pa-linser",
  },
  {
    label: "Vegoskål med hummus, rotfrukter och grönkålschips",
    value: "vegoskal-med-hummus-rotfrukter-och-gronkalschips",
  },
  {
    label: "Vegosås på quornfärs och massa matlådor",
    value: "vegosas-pa-quornfars-och-massa-matlador",
  },
  {
    label: "Vit bönröra med rostad vitlök, citron och rosmarin",
    value: "vit-bonrora-med-rostad-vitlok-citron-och-rosmarin",
  },
  {
    label: "Zucchini, oliv- och fetaostpiroger med tsatsiki",
    value: "zucchini-oliv-och-fetaostpiroger-med-tsatsiki",
  },
  {
    label: "Äpplecookies med vita bönor",
    value: "applecookies-med-vita-bonor",
  },
  {
    label: "Ärtbiffar med rotfrukter och chimichurriyoghurt",
    value: "artbiffar-med-rotfrukter-och-chimichurriyoghurt",
  },
  {
    label: "Ärtpesto med basilika och citron",
    value: "artpesto-med-basilika-och-citron",
  },
  {
    label: "Ärtröra med rödlök och citron",
    value: "artrora-med-rodlok-och-citron",
  },
];

const Home: NextPage = () => {
  const [ingredients, setIngredients] = React.useState<any[]>([]);
  const [selectedRecipes, setSelectedRecipes] = React.useState<string[]>([]);

  const accumulate = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const queryParameters = new URLSearchParams();
    selectedRecipes.forEach((sr) => queryParameters.append("urls", sr));
    const response = await fetch(
      `/.netlify/functions/accumulator?${queryParameters.toString()}`
    );
    const json = await response.json();
    setIngredients(json);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Inköpslistegenerator - Portionen under tian</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Skapa inköpslistor utifrån recept från{" "}
          <a href="https://undertian.com">Portionen under tian</a>
        </h1>

        <form onSubmit={accumulate}>
          <ComboxboxMultiSelect
            options={recipes}
            setSelectedValues={setSelectedRecipes}
          />
          <button>Hämta ingredienslista</button>
        </form>

        <ul>
          {ingredients.map(({ name, amount, unit }) => (
            <li key={`${name}${unit}`}>
              {name}: {amount} {unit}
            </li>
          ))}
        </ul>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
};

export default Home;
