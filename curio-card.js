/*!
 * Curio Card til Home Assistant  (v1.0.0)
 * https://github.com/oreskov/curio-card  -  MIT-licens
 *
 * Et kort til entiteter, der ændrer sig: en liste, der holder sig opdateret af sig selv.
 * Entiteterne kan vælges i hånden eller findes med regler (filter), og hele kortet sættes op i den visuelle editor.
 * - Fire layouts: chips, tiles, list og grid.
 * - Filter med Include, Exclude og "Show only if", AND og OR, og felter som domæne, navn, tilstand,
 *   attribut, område, etage, label og enhed.
 * - Gruppering efter område, enhed, enhedstype, domæne eller tilstand, eller egne grupper med regler.
 * - Farve- og animationsregler pr. kort eller pr. entitet, og statusmarkører (prik, badge, ring, streg,
 *   boble og tilstandstekst).
 * - Kontroller (knapper, skydere og lister) og egne knapper, der kan køre alle handlinger.
 * - Visuel editor med sektioner, hjælpetekster og panelet "Ændret fra standard", på dansk og engelsk
 *   (efter HA's sprog). Kortet gemmer kun det, du ændrer fra standard.
 * - Virker også inde i Auto Entities.
 *
 * Filen er opdelt i sektioner:
 *   1. Konstanter og tekster (STRINGS)
 *   2. Indstillingsregister (én liste driver kort, editor og "Ændret fra standard")
 *   3. Hjælpefunktioner (aktiv, farve, navn, handlinger)
 *   4. Datalag og item-model (manuel liste og Auto Entities giver samme format)
 *   5. Layouts (register: chips, tiles, list, grid)
 *   6. Kort-element
 *   7. Visuel editor
 *   8. Registrering
 */
(() => {
  'use strict';

  /* ====================================================================
   * 1. KONSTANTER OG TEKSTER
   * ================================================================== */
  const CURIO_VERSION = '1.0.0';
  const PRESS_FEEDBACK_MS = 1500; // hvor længe en enheds-knap lyser efter et tryk
  const CARD_TAG = 'curio-card';
  const EDITOR_TAG = 'curio-card-editor';

  // Alle synlige tekster ligger her, på dansk og engelsk. Mangler en nøgle på det valgte sprog, bruges den engelske.
  const STRINGS = {
    da: {
      'card.description': 'Moderne kort til dynamiske entiteter med flere layouts og en visuel editor.',
      'card.ctl_brightness': 'Lysstyrke',
      'card.ctl_kelvin': 'Farvetemperatur',
      'card.ctl_color': 'Farve',
      'card.ctl_cover_open': 'Åbn',
      'card.ctl_cover_stop': 'Stop',
      'card.ctl_cover_close': 'Luk',
      'card.ctl_cover_position': 'Position',
      'card.ctl_cover_tilt': 'Vinkel',
      'card.ctl_fan_toggle': 'Tænd/sluk',
      'card.ctl_fan_speed': 'Hastighed',
      'card.ctl_fan_oscillate': 'Oscillation',
      'card.ctl_fan_direction': 'Retning',
      'card.ctl_media_prev': 'Forrige',
      'card.ctl_media_play_pause': 'Afspil/pause',
      'card.ctl_media_next': 'Næste',
      'card.ctl_media_mute': 'Lyd fra',
      'card.ctl_media_volume': 'Lydstyrke',
      'card.ctl_lock_toggle': 'Lås/oplås',
      'card.ctl_number_slider': 'Værdi',
      'card.ctl_select_option': 'Vælg',
      'card.lock_confirm': 'Tryk igen for at låse op',
      'card.ctl_climate_target': 'Måltemperatur',
      'card.ctl_climate_mode': 'Driftstilstand',
      'card.ctl_climate_preset': 'Forudindstilling',
      'card.ctl_climate_fan': 'Ventilator',
      'card.ctl_vacuum_start_pause': 'Start/pause',
      'card.ctl_vacuum_stop': 'Stop',
      'card.ctl_vacuum_return': 'Tilbage til dock',
      'card.ctl_vacuum_locate': 'Find mig',
      'card.ctl_vacuum_fan_speed': 'Sugestyrke',
      'card.ctl_vacuum_clean_area': 'Rengør efter område',
      'card.areas_loading': 'Henter områder…',
      'card.areas_none': 'Ingen rum koblet',
      'card.areas_none_help': 'Ingen områder er koblet endnu. Åbn HA\'s dialog for at koble rummene.',
      'card.areas_start': 'Start',
      'card.areas_pick': 'Vælg rum',
      'card.areas_n': 'rum valgt',
      'card.areas_open': 'Åbn HA\'s dialog',
      'ui.ctlg_climate': 'Climate',
      'ui.ctlg_vacuum': 'Støvsuger',
      'ui.infog_general': 'Generelt',
      'ui.infog_device': 'Enhedens sensorer',
      'ui.info_intro': 'Vælg de oplysninger, du vil have under navnet. Her vises kun de typer, der findes i kortet. Hvert element viser kun dem, det har, og de står på én linje med · imellem.',
      'ui.info_none': 'Ingen oplysninger passer til kortets typer. Slå Vis alle typer til for at se alle.',
      'label.device_controls': 'Enhedens egne valg, tal og knapper',
      'help.device_controls': 'Viser også enhedens egne valglister, tal og knapper (fx blæserens vandrette og lodrette svingning eller en afspillers favorit-knap) som styringer på elementet. Kun entiteter fra samme enhed, uden diagnostik og skjulte; knapper til genstart, opdatering og indstillinger vises ikke; højst fire pr. element. Vises ikke i chips.',
      'label.button_press_feedback': 'Enhedens knapper: lys op ved tryk',
      'help.button_press_feedback': 'Enhedens egne knapper lyser kort op, når du trykker, så du kan se, at trykket blev sendt. Knappen ved ikke, om handlingen lykkedes. Standard: Til.',
      'label.device_controls_order': 'Enhedens egne styringer: rækkefølge',
      'help.device_controls_order': 'Hvilke af enhedens egne styringer der kommer først, når der er flere end fire. Standard: Knapper først.',
      'o.device_controls_order.buttons': 'Knapper først',
      'o.device_controls_order.values': 'Valg og tal først',
      'ui.ctl_intro': 'Vælg de styringer, du vil have. Her vises kun de typer, der findes i kortet. Hvert element viser kun dem, det kan.',
      'ui.ctl_all': 'Vis alle typer',
      'ui.ctl_all_help': 'Viser også typer, der ikke findes i kortet endnu.',
      'ui.ctl_none': 'Ingen styringer passer til kortets typer. Slå Vis alle typer til for at se alle.',
      'ui.ctlg_light': 'Lys',
      'ui.ctlg_cover': 'Cover',
      'ui.ctlg_fan': 'Blæser',
      'ui.ctlg_media_player': 'Afspiller',
      'ui.ctlg_lock': 'Lås',
      'ui.ctlg_values': 'Tal og valgliste',
      'card.hue': 'Nuance',
      'card.sat': 'Mætning',
      'card.empty': 'Ingen entiteter at vise',
      'card.not_found': 'Ikke fundet',

      'section.entities': 'Entiteter',
      'section.filter': 'Filter',
      'section.buttons': 'Knapper',
      'section.colors': 'Farver og animation',
      'ui.colors_intro': 'Regler skifter farve og/eller animerer ud fra en værdi, fx batteri under 20 % = rød og puls. Reglerne bygges som i filteret. Den første regel, der passer, vinder. Passer ingen, er alt normalt. Animation slås automatisk fra, hvis enheden er sat til at begrænse bevægelser. Regler pr. entitet (under Entiteter → Tilpas pr. entitet) går forud for reglerne her.',
      'ui.add_color_rule': 'Tilføj regel',
      'ui.color_rule_n': 'Regel {n}',
      'ui.item_color_rules': 'Farveregler for denne entitet',
      'label.r_color': 'Farve',
      'label.r_affects': 'Påvirker',
      'label.r_animation': 'Animation',
      'label.r_speed': 'Hastighed',
      'o.animation.none': 'Ingen',
      'o.animation.pulse': 'Puls',
      'o.animation.pulse_size': 'Puls (størrelse)',
      'o.animation.blink': 'Blink',
      'o.animation.glow': 'Glød',
      'o.animation.spin': 'Rotation (kun ikon)',
      'o.speed.slow': 'Langsom',
      'o.speed.normal': 'Normal',
      'o.speed.fast': 'Hurtig',
      'o.affects.all': 'Hele elementet',
      'o.affects.icon': 'Kun ikon',
      'o.affects.indicator': 'Kun indikator',
      'section.layout': 'Layout',
      'section.grouping': 'Gruppering',
      'label.group_by': 'Gruppér efter',
      'help.group_by': 'Deler elementerne op i afsnit med overskrift og antal. Gruppering erstatter egne sektioner og skillelinjer i listen. Filter, farver og indikatorer virker som før.',
      'label.group_collapsible': 'Kan foldes sammen',
      'help.group_collapsible': 'Tryk på en overskrift for at folde gruppen sammen eller ud igen. Det huskes ikke, når siden genindlæses.',
      'label.group_size': 'Overskriftens størrelse',
      'help.group_size': 'Størrelsen på gruppeoverskrifterne. M er standard.',
      'label.group_color': 'Overskriftens farve',
      'help.group_color': 'Farve på alle gruppeoverskrifter (tekst, pil og eventuel streg eller baggrund). Tom = normal tekstfarve.',
      'label.group_style': 'Overskriftens stil',
      'help.group_style': 'Kun tekst, tekst med streg under, eller tekst på en afrundet baggrund i en svag nuance af farven.',
      'label.group_align': 'Overskriftens placering',
      'help.group_align': 'Hvor overskriften står i bredden.',
      'label.group_count': 'Vis antal',
      'help.group_count': 'Viser antal elementer i gruppen efter navnet, fx (5).',
      'o.group_size.s': 'S',
      'o.group_size.m': 'M',
      'o.group_size.l': 'L',
      'o.group_size.xl': 'XL',
      'o.group_style.plain': 'Kun tekst',
      'o.group_style.line': 'Med streg',
      'o.group_style.fill': 'Med baggrund',
      'o.group_align.left': 'Venstre',
      'o.group_align.center': 'Midt',
      'o.group_align.right': 'Højre',
      'o.group_by.none': 'Ingen',
      'o.group_by.area': 'Område',
      'o.group_by.device': 'Enhed',
      'o.group_by.device_class': 'Enhedsklasse',
      'o.group_by.domain': 'Domæne',
      'o.group_by.state': 'Tilstand',
      'o.group_by.custom': 'Egne grupper',
      'label.group_rest_label': 'Navn på resten',
      'help.group_rest_label': 'Gruppen nederst med det, der ikke passer i nogen af dine grupper. Tom = Andre.',
      'label.group_rest_show': 'Vis resten',
      'help.group_rest_show': 'Slå fra for at skjule det, der ikke passer i nogen af dine grupper.',
      'label.r_name': 'Gruppens navn',
      'ui.group_intro': 'Lav dine egne grupper. Hver gruppe har et navn, en eller flere betingelser (bygges som i filteret) og en farve til overskriften. En entitet står i den første gruppe, der passer. Grupperne står i den rækkefølge, du laver dem i.',
      'ui.group_rule_n': 'Gruppe {n}',
      'ui.add_group_rule': 'Tilføj gruppe',
      'group.none_custom': 'Andre',
      'group.default_name': 'Gruppe {n}',
      'group.none_area': 'Uden område',
      'group.none_device': 'Uden enhed',
      'group.none_device_class': 'Uden enhedsklasse',
      'group.state.active': 'Aktive',
      'group.state.inactive': 'Inaktive',
      'group.state.unavailable': 'Utilgængelige',
      'section.appearance': 'Udseende',
      'section.interaction': 'Interaktion',
      'section.indicators': 'Statusindikatorer',
      'section.advanced': 'Avanceret',

      'label.entities': 'Entiteter',
      'label.layout': 'Layout',
      'label.align': 'Justering',
      'label.item_width': 'Elementbredde',
      'help.item_width': 'Mindste bredde pr. element, når kolonner er 0 (auto). 0 = automatisk (plads til knapper). Ved Fyld bredden fylder elementerne ud; ved Start/Center/Slut får de præcis denne bredde. Bruges ikke ved fast antal kolonner.',
      'label.columns': 'Kolonner',
      'label.gap': 'Mellemrum',
      'label.title': 'Titel',
      'label.empty_text': 'Tekst når tom',
      'label.shape': 'Form',
      'label.radius': 'Egen radius',
      'label.size': 'Størrelse',
      'label.color_mode': 'Farver',
      'label.color': 'Fast farve',
      'label.show_icon': 'Vis ikon',
      'label.show_name': 'Vis navn',
      'label.long_text': 'Lang tekst',
      'help.long_text': 'Hvad der sker, når navn eller sekundær info er for lang til elementet. Rul: teksten ruller langsomt frem og tilbage (kun hvis den ikke passer). Afkort: teksten afkortes med …. Ruller ikke i chips.',
      'o.long_text.scroll': 'Rul',
      'o.long_text.truncate': 'Afkort med …',
      'label.secondary_info': 'Sekundær information',
      'label.card_opacity': 'Kortets gennemsigtighed',
      'label.card_plain': 'Ingen kort-stil',
      'label.hide_border': 'Skjul ramme',
      'label.hide_shadow': 'Skjul skygge',
      'label.card_corners': 'Kortets hjørner',
      'label.card_radius': 'Kortets hjørneradius',
      'label.sort_by': 'Sortér filterets resultat efter',
      'label.sort_manual': 'Sortér også manuelle entiteter',
      'help.sort_manual': 'Manuelt valgte entiteter følger samme sortering som filterets resultat og blandes sammen med dem. Med sektioner/skillelinjer sorteres inden for hver sektion, og filterets resultat kommer ind i den sidste. Fra: de manuelle står først i den rækkefølge, du selv har sat.',
      'label.sort_dir': 'Retning',
      'label.c_field': 'Felt',
      'label.c_attribute': 'Attributnavn',
      'label.c_operator': 'Sammenligning',
      'label.c_value': 'Værdi',
      'label.controls': 'Styringer',
      'label.b_icon': 'Ikon',
      'label.b_color': 'Farve (valgfri)',
      'label.button_color': 'Knapfarve',
      'help.button_color': 'Farve på alle knapper (ikon og svag baggrund). Tom = neutral. En enkelt egen knap kan have sin egen farve.',
      'label.b_name': 'Tooltip (valgfri)',
      'label.controls_autoclose': 'Luk styring automatisk efter (sek.)',
      'help.controls_autoclose': 'Skyderen lukker selv efter så mange sekunder uden berøring. 0 = lukker kun med ✕.',
      'card.close': 'Luk',
      'card.color_hue': 'Farve {h}°',
      'label.b_entity': 'Vis styring for entitet (valgfri)',
      'help.b_entity': 'Vælg en valgliste eller et tal (select, input_select, number, input_number). Et tryk på knappen åbner så entitetens liste eller skyder i kortet, og tryk-handlingen bruges ikke. Hold og dobbelttryk virker stadig.',
      'label.b_tap_action': 'Tryk',
      'label.b_hold_action': 'Hold',
      'label.b_double_tap_action': 'Dobbelttryk',
      'label.hide_when_empty': 'Skjul kortet når det er tomt',
      'label.secondary_attribute': 'Attributnavn',
      'label.background': 'Elementernes baggrund',
      'label.show_switch': 'Vis kontakt',
      'label.tap_action': 'Tryk på element',
      'label.hold_action': 'Hold på element',
      'label.double_tap_action': 'Dobbelttryk på element',
      'label.icon_tap_action': 'Tryk på ikon',
      'label.icon_hold_action': 'Hold på ikon',
      'label.icon_double_tap_action': 'Dobbelttryk på ikon',
      'label.indicator': 'Statusindikator',
      'label.bubble_text': 'Boblen viser teksten',
      'label.indicator_position': 'Placering',
      'label.only_active': 'Vis kun aktive',
      'label.hide_unavailable': 'Skjul utilgængelige',
      'label.filter_show_all': 'Vis alle filterresultater',
      'help.filter_show_all': 'Filterets resultat begrænses ellers til {n} elementer for at skåne Home Assistant. Slå til for at vise alle (kan være tungt ved mange entiteter). Manuelt valgte entiteter tælles ikke med.',
      'card.limit_note': 'Filteret rammer {n} entiteter, viser {m}. Slå **{s}** til for at se alle.',
      'ui.filter_warn_broad': '⚠ En regel med kun * rammer alt. Det kan være tungt.',
      'ui.filter_warn_many': '⚠ Filteret rammer mange entiteter ({n}). Kortet viser højst {l}, medmindre du slår Vis alle til.',
      'ui.show_all_names': 'Vis alle',
      'ui.show_few_names': 'Vis færre',
      'label.max_items': 'Max antal elementer',
      'label.data_source': 'Datakilde (kun editor)',
      'label.item_name': 'Navn',
      'label.item_icon': 'Ikon',

      'help.entities': 'Vælg entiteterne. Rækkefølgen ændres med pilene under Tilpas pr. entitet.',
      'help.layout': 'Hvordan entiteterne vises.',
      'help.align': 'Hvordan elementerne placeres i bredden. Fyld bredden strækker dem ud.',
      'help.columns': 'Antal kolonner. 0 vælger automatisk ud fra bredden.',
      'help.gap': 'Afstand mellem elementerne i pixels.',
      'help.title': 'Overskrift over kortet. Er den tom, vises ingen overskrift.',
      'help.empty_text': 'Tekst, når der ingen elementer er. Tom bruger standardteksten.',
      'help.shape': 'Hjørnerne på elementerne.',
      'help.radius': 'Radius i pixels, når formen er sat til Egen.',
      'help.size': 'Skalerer elementernes størrelse og tekst.',
      'help.color_mode': 'Tilstandsbaseret farver aktive elementer og dæmper inaktive. Tema bruger temaets farve. Fast bruger din egen farve.',
      'help.color': 'Farven, når farver er sat til Fast.',
      'help.show_icon': 'Viser ikonet på elementet.',
      'help.show_name': 'Viser navnet på elementet.',
      'help.secondary_info': 'Vælg én eller flere. De vises på én linje med · imellem i den rækkefølge, de står i listen. Hvert element viser kun dem, det har.',
      'help.card_opacity': 'Kortets baggrund: 100 er som temaet, 0 er helt gennemsigtigt. Elementerne påvirkes ikke.',
      'help.card_plain': 'Fjerner kortets baggrund, ramme og skygge, så elementerne flyder frit på dashboardet.',
      'help.hide_border': 'Fjerner kortets kant, uanset hvad temaet bruger.',
      'help.hide_shadow': 'Fjerner kortets skygge, hvis temaet har en.',
      'help.card_corners': 'Kortets hjørner. Tema bruger temaets værdi.',
      'help.card_radius': 'Radius på kortets hjørner i pixels.',
      'help.sort_by': 'Gælder kun entiteter fundet af filteret. Manuelt valgte entiteter beholder deres rækkefølge.',
      'help.sort_dir': 'Stigende eller faldende rækkefølge.',
      'help.controls': 'Vælg de styringer, du vil have. Hvert element viser kun dem, dets type og enhed kan: lys, cover, blæser, afspiller, lås, tal og valgliste. Knapper virker med det samme; skydere og lister folder ud i elementet (✕ lukker). I chips vises kun knapperne, ikke skydere og lister.',
      'help.hide_when_empty': 'Skjuler hele kortet, når der ingen elementer er. Kortet vises stadig i editorens forhåndsvisning.',
      'help.secondary_attribute': 'Navnet på den attribut, der skal vises.',
      'help.background': 'Baggrunden bag hvert element.',
      'help.show_switch': 'Viser en til/fra-kontakt for entiteter, der kan skiftes.',
      'ui.cur_head': 'Elementets egen entitet',
      'ui.cur_head_help': 'Gælder de handlinger ovenfor, der er sat til Udfør handling.',
      'ui.cur_head_help1': 'Gælder handlingen ovenfor, hvis den er sat til Udfør handling.',
      'label.cur_target': 'Ram elementets egen entitet (current)',
      'help.cur_target': 'Handlingen udføres på det element, den sidder på. Så kan samme handling bruges på alle lys, afspillere osv. i kortet. Slået fra vælger du selv en bestemt entitet.',
      'ui.cur_ok': 'Står der «Entitet ikke fundet» ved «current», er alt OK: HA\'s vælger kender kun rigtige entiteter. Kortet bytter «current» ud med elementets egen entitet, når der trykkes.',
      'ui.cur_ok_data': 'Værdien «current» i handlingens data bliver byttet ud med elementets egen entitet, når der trykkes. Står der «Entitet ikke fundet», er det helt i orden.',
      'label.cur_data': 'Sæt «{f}» til elementets egen entitet (current)',
      'help.cur_data': 'Datafeltet får elementets egen entitet, når der trykkes.',
      'help.tap_action': 'Hvad der sker, når du trykker på elementet.',
      'help.hold_action': 'Hvad der sker, når du holder fingeren på elementet.',
      'help.double_tap_action': 'Hvad der sker, når du dobbelttrykker på elementet. Forsinker ikke tryk, hvis den er slået fra.',
      'help.icon_tap_action': 'Hvad der sker, når du trykker på ikonet.',
      'help.icon_hold_action': 'Hvad der sker, når du holder fingeren på ikonet.',
      'help.icon_double_tap_action': 'Hvad der sker, når du dobbelttrykker på ikonet.',
      'help.indicator': 'En lille markering af status. Kan bruges på alle layouts.',
      'help.bubble_text': 'Slået til viser boblen tilstanden eller værdien som tekst, fx "Tændt" eller "85 %". Slået fra er boblen en lille prik. Ved chips i størrelse XS og S er boblen altid en prik.',
      'help.indicator_position': 'Hvor markeringen sidder på elementet.',
      'help.only_active': 'Viser kun entiteter, der er aktive, fx tændt eller åben.',
      'help.hide_unavailable': 'Skjuler entiteter, der er utilgængelige.',
      'help.max_items': 'Begrænser antallet af viste elementer. 0 betyder ingen grænse.',
      'help.data_source': 'Styrer, om listen med entiteter vises her. Automatisk skjuler den, når kortet bruges i Auto Entities.',
      'help.item_name': 'Eget navn til denne entitet. Tom bruger Home Assistants navn.',
      'help.item_icon': 'Eget ikon til denne entitet. Tom bruger standardikonet.',

      'o.layout.tiles': 'Tiles',
      'o.layout.chips': 'Chips',
      'o.layout.list': 'Liste',
      'o.layout.grid': 'Grid',
      'o.align.stretch': 'Fyld bredden',
      'o.align.start': 'Venstre',
      'o.align.center': 'Centreret',
      'o.align.end': 'Højre',
      'o.align.space-between': 'Fordelt',
      'o.shape.rounded': 'Afrundet',
      'o.shape.square': 'Firkantet',
      'o.shape.pill': 'Pille',
      'o.shape.custom': 'Egen',
      'o.size.xs': 'XS',
      'o.size.s': 'S',
      'o.size.m': 'M',
      'o.size.l': 'L',
      'o.size.xl': 'XL',
      'o.color_mode.state': 'Tilstandsbaseret',
      'o.color_mode.theme': 'Tema',
      'o.color_mode.static': 'Fast',
      'o.secondary_info.none': 'Ingen',
      'o.secondary_info.state': 'Tilstand',
      'o.secondary_info.last_changed': 'Sidst ændret',
      'o.secondary_info.attribute': 'Attribut',
      'o.secondary_info.brightness': 'Lysstyrke',
      'o.secondary_info.cover_position': 'Cover: position',
      'o.secondary_info.cover_tilt': 'Cover: vinkel',
      'o.secondary_info.fan_speed': 'Blæser: hastighed',
      'o.secondary_info.media_volume': 'Afspiller: lydstyrke',
      'o.secondary_info.climate_temps': 'Climate: aktuel → mål',
      'o.secondary_info.climate_action': 'Climate: hvad den gør nu',
      'o.secondary_info.vacuum_fan': 'Støvsuger: sugestyrke',
      'o.secondary_info.dev_signal': 'Enhedens sensor: signal',
      'o.secondary_info.dev_power': 'Enhedens sensor: strøm',
      'o.secondary_info.dev_energy': 'Enhedens sensor: energi',
      'o.secondary_info.dev_temperature': 'Enhedens sensor: temperatur',
      'o.secondary_info.dev_humidity': 'Enhedens sensor: fugt',
      'o.secondary_info.kelvin': 'Kelvin (farve i farvetilstand)',
      'o.secondary_info.battery': 'Batteri',
      'o.secondary_info.media_title': 'Afspiller: kunstner og titel',
      'o.card_corners.theme': 'Tema',
      'o.card_corners.square': 'Firkantet',
      'o.card_corners.custom': 'Egen',
      'o.sort_by.name': 'Navn',
      'o.sort_by.entity_id': 'Entitets-ID',
      'o.sort_by.state': 'Tilstand',
      'o.sort_by.last_changed': 'Sidst ændret',
      'o.sort_dir.asc': 'Stigende',
      'o.sort_dir.desc': 'Faldende',
      'o.field.domain': 'Domæne',
      'o.field.entity_id': 'Entitets-ID',
      'o.field.name': 'Navn',
      'o.field.state': 'Tilstand',
      'o.field.attribute': 'Attribut',
      'o.field.device_class': 'Enhedsklasse',
      'o.field.area': 'Område',
      'o.field.floor': 'Etage',
      'o.field.label': 'Label',
      'o.field.device': 'Enhed',
      'o.operator.is': 'er',
      'o.operator.is_not': 'er ikke',
      'o.operator.in': 'er en af',
      'o.operator.contains': 'indeholder',
      'o.operator.not_contains': 'indeholder ikke',
      'o.operator.starts_with': 'starter med',
      'o.operator.lt': 'er mindre end',
      'o.operator.gt': 'er større end',
      'o.operator.lte': 'er mindre end eller lig med',
      'o.operator.gte': 'er større end eller lig med',
      'o.controls.climate_target': 'Climate: måltemperatur (skyder)',
      'o.controls.climate_mode': 'Climate: driftstilstand (liste)',
      'o.controls.climate_preset': 'Climate: forudindstilling (liste)',
      'o.controls.climate_fan': 'Climate: ventilatorhastighed (liste)',
      'o.controls.vacuum_start_pause': 'Støvsuger: start/pause',
      'o.controls.vacuum_stop': 'Støvsuger: stop',
      'o.controls.vacuum_return': 'Støvsuger: tilbage til dock',
      'o.controls.vacuum_locate': 'Støvsuger: find mig',
      'o.controls.vacuum_fan_speed': 'Støvsuger: sugestyrke (liste)',
      'o.controls.vacuum_clean_area': 'Støvsuger: rengør efter område',
      'o.controls.brightness': 'Lys: lysstyrke',
      'o.controls.kelvin': 'Lys: Kelvin (farvetemperatur)',
      'o.controls.color': 'Lys: farve',
      'o.controls.cover_open': 'Cover: åbn',
      'o.controls.cover_stop': 'Cover: stop',
      'o.controls.cover_close': 'Cover: luk',
      'o.controls.cover_position': 'Cover: position (skyder)',
      'o.controls.cover_tilt': 'Cover: vinkel (skyder)',
      'o.controls.fan_toggle': 'Blæser: tænd/sluk',
      'o.controls.fan_speed': 'Blæser: hastighed (skyder)',
      'o.controls.fan_oscillate': 'Blæser: oscillation',
      'o.controls.fan_direction': 'Blæser: retning',
      'o.controls.media_prev': 'Afspiller: forrige',
      'o.controls.media_play_pause': 'Afspiller: afspil/pause',
      'o.controls.media_next': 'Afspiller: næste',
      'o.controls.media_mute': 'Afspiller: lyd fra',
      'o.controls.media_volume': 'Afspiller: lydstyrke (skyder)',
      'o.controls.lock_toggle': 'Lås: lås/oplås',
      'o.controls.number_slider': 'Tal: skyder (number, input_number)',
      'o.controls.select_option': 'Valg: liste (select, input_select)',
      'o.background.filled': 'Udfyldt',
      'o.background.outlined': 'Kun kant',
      'o.background.transparent': 'Gennemsigtig',
      'label.icon_position': 'Ikonplacering',
      'help.icon_position': 'Hvor ikonet sidder i elementet. Chips og liste: venstre eller højre. Tiles: venstre, øverst eller højre. Grid: øverst til venstre, midt eller højre.',
      'o.icon_position.left': 'Venstre',
      'o.icon_position.top': 'Øverst venstre',
      'o.icon_position.top_center': 'Øverst midt',
      'o.icon_position.top_right': 'Øverst højre',
      'o.icon_position.right': 'Højre',
      'label.icon_size': 'Ikonstørrelse',
      'help.icon_size': 'Ikonets størrelse. Automatisk følger elementets størrelse.',
      'o.icon_size.auto': 'Automatisk',
      'o.icon_size.s': 'S',
      'o.icon_size.m': 'M',
      'o.icon_size.l': 'L',
      'o.icon_size.xl': 'XL',
      'label.button_size': 'Knapstørrelse',
      'help.button_size': 'Størrelsen på knapperne. Automatisk følger elementets størrelse. Skyderen får samme højde som knapperne.',
      'o.button_size.auto': 'Automatisk',
      'o.button_size.s': 'S',
      'o.button_size.m': 'M',
      'o.button_size.l': 'L',
      'o.button_size.xl': 'XL',
      'label.big_value': 'Stor værdi',
      'help.big_value': 'Viser den første sekundære information (fx 18 %) stort i elementets farve. Over navnet, når ikonet står øverst, ellers under navnet.',
      'o.indicator.none': 'Ingen',
      'o.indicator.dot': 'Prik',
      'o.indicator.corner_badge': 'Hjørnebadge',
      'o.indicator.ring': 'Ring',
      'o.indicator.stripe': 'Stribe',
      'o.indicator.bubble': 'Notifikationsboble',
      'o.indicator.state_label': 'Tilstandstekst',
      'o.indicator_position.top_right': 'Øverst til højre',
      'o.indicator_position.top_left': 'Øverst til venstre',
      'o.indicator_position.bottom_right': 'Nederst til højre',
      'o.indicator_position.bottom_left': 'Nederst til venstre',
      'o.data_source.auto': 'Automatisk',
      'o.data_source.manual': 'Manuel liste',
      'o.data_source.auto_entities': 'Auto Entities',

      'o.action.none': 'Ingen',
      'o.action.toggle': 'Skift',
      'o.action.more-info': 'Flere info',
      'o.action.navigate': 'Naviger',
      'o.action.url': 'Åbn URL',
      'o.action.perform-action': 'Kald handling',
      'o.action.call-service': 'Kald service',
      'o.action.fire-dom-event': 'Affyr hændelse',

      'ui.default_is': 'Standard: {v}.',
      'ui.on': 'Til',
      'ui.off': 'Fra',
      'ui.filter_intro': 'Find entiteter automatisk med regler. En regel passer, når alle dens betingelser passer (OG). Flere regler i samme liste er ELLER: det er nok, at én passer. Vil du have ELLER mellem værdier i samme regel, så brug "er en af" (fx playing, paused). Medtag-regler finder entiteter og lægger dem sammen, og Udelad-regler fjerner dem bagefter. Resultatet vises efter de manuelt valgte entiteter. Vis kun hvis begrænser til sidst alt på kortet. Tal sammenlignes som tal, * er jokertegn, og ved "er en af" adskilles værdier med komma.',
      'ui.only_if': 'Vis kun hvis',
      'ui.add_only_if': 'Tilføj Vis kun hvis-regel',
      'ui.only_if_hint': 'Begrænser alle entiteter på kortet, både dine egne og filterets. Tilføjer aldrig nye. Med flere regler er det nok, at én passer. Ufærdige regler ignoreres.',
      'ui.only_if_match': 'Vis kun hvis: {n} af {m} entiteter passer lige nu.',
      'ui.buttons_intro': 'Egne knapper er runde ikonknapper ved siden af (grid: under) elementets tekst og kan udføre en vilkårlig handling. Kalder en handling en service uden mål, rammer den elementets egen entitet. Knapper kan også sættes pr. entitet under Entiteter → Tilpas pr. entitet.',
      'ui.add_button': 'Tilføj knap',
      'ui.button_n': 'Knap {n}',
      'ui.remove_button': 'Fjern knap',
      'ui.include': 'Medtag',
      'ui.exclude': 'Udelad',
      'ui.add_include': 'Tilføj Medtag-regel',
      'ui.add_exclude': 'Tilføj Udelad-regel',
      'ui.rule_n': 'Regel {n}',
      'ui.add_condition': 'Tilføj betingelse',
      'ui.remove_rule': 'Fjern regel',
      'ui.remove_condition': 'Fjern betingelse',
      'ui.and': 'og',
      'ui.or': 'eller',
      'ui.filter_match': 'Filteret matcher {n} entiteter lige nu.',
      'ui.filter_match_one': 'Filteret matcher 1 entitet lige nu.',
      'ui.filter_match_none': 'Filteret matcher ingen entiteter lige nu.',
      'ui.filter_no_rules': 'Tilføj en Medtag-regel for at bruge filteret.',
      'ui.px': 'px',
      'ui.s': 'sek.',
      'ui.percent': '%',
      'ui.changed_title': 'Ændret fra standard ({n})',
      'ui.all_default': 'Alt er standard',
      'ui.reset_one': 'Nulstil',
      'ui.reset_all': 'Nulstil alle',
      'ui.reset_confirm': 'Nulstil alle indstillinger?',
      'ui.reset_yes': 'Ja, nulstil',
      'ui.reset_no': 'Annuller',
      'ui.editor_unavailable': 'Editoren kunne ikke indlæses. Brug YAML-editoren i stedet.',
      'ui.ae_note': 'Entiteterne leveres af Auto Entities.',
      'ui.customize_title': 'Tilpas pr. entitet',
      'ui.move_up': 'Flyt op',
      'ui.move_down': 'Flyt ned',
      'ui.item_overrides': 'Overstyr kortets indstillinger',
      'ui.item_overrides_hint': 'Gælder kun denne entitet. Alt andet følger kortets indstillinger.',
      'ui.item_add_override': 'Tilføj overstyring…',
      'ui.item_add_pick': 'Vælg indstilling',
      'ui.copy_title': 'Kopiér til andre entiteter',
      'ui.copy_hint': 'Kopierer det, du vælger, fra denne entitet til andre. Navn og ikon kopieres ikke. Overstyringer overskriver kun de samme indstillinger hos modtageren, de andre bliver.',
      'ui.cp_none': 'Der er intet at kopiere endnu. Tilføj først en overstyring, en regel eller en knap på denne entitet.',
      'label.cp_ovr': 'Overstyringer ({n})',
      'label.cp_rules': 'Farveregler ({n})',
      'label.cp_btns': 'Knapper ({n})',
      'label.cp_btns_zero': 'Ingen knapper (skjuler kortets)',
      'label.cp_to': 'Kopiér til',
      'label.cp_mode': 'Regler og knapper hos modtageren',
      'o.cp_mode.replace': 'Erstat modtagerens egne',
      'o.cp_mode.add': 'Tilføj efter modtagerens egne',
      'ui.cp_all': 'Vælg alle andre',
      'ui.cp_go': 'Kopiér',
      'ui.cp_done_1': 'Kopieret til 1 entitet',
      'ui.cp_done_n': 'Kopieret til {n} entiteter',
      'ui.dup_rule': 'Duplikér',
      'ui.clip_copy': 'Kopiér',
      'ui.clip_copy_hint': 'Læg i udklipsholderen, så du kan sætte den ind et andet sted',
      'ui.clip_paste': 'Sæt ind her',
      'ui.clip_clear': 'Tøm udklipsholderen',
      'ui.clip_has': 'I udklipsholderen',
      'ui.clip_color': 'Farveregel',
      'ui.clip_group': 'Gruppe-regel',
      'ui.clip_filter': 'Filterregel',
      'ui.clip_button': 'Knap',
      'ui.item_copy_card_rules': 'Kopiér kortets regler hertil',
      'ui.fold_all_in': 'Fold alle ind',
      'ui.fold_all_out': 'Fold alle ud',
      'ui.sum_none': 'følger kortet',
      'ui.sum_look': 'eget navn eller ikon',
      'ui.sum_ovr_1': '1 overstyring',
      'ui.sum_ovr_n': '{n} overstyringer',
      'ui.sum_rules_1': '1 regel',
      'ui.sum_rules_n': '{n} regler',
      'ui.sum_btn_1': '1 knap',
      'ui.sum_btn_n': '{n} knapper',
      'ui.sum_btn_zero': 'ingen knapper',
      'ui.item_buttons': 'Egne knapper på denne entitet',
      'ui.item_buttons_hint': 'Har entiteten egne knapper, bruges de i stedet for kortets egne knapper.',
      'ui.item_use_card_buttons': 'Brug kortets knapper',
      'ui.item_use_card_buttons_hint': 'Slå fra for at give entiteten sin egen liste. Den starter tom (ingen knapper), og du kan tilføje egne herunder.',
      'ui.item_copy_card_buttons': 'Kopiér kortets knapper hertil',
      'label.hide_buttons': 'Skjul alle knapper',
      'help.hide_buttons': 'Skjuler styringer (fx afspil, næste, lysstyrke), enhedens egne valg, tal og knapper, egne knapper og kontakten på netop denne entitet. Andre entiteter beholder deres.',
      'ui.item_duplicate': 'Tilføj entiteten igen',
      'ui.add_section': 'Tilføj sektion',
      'ui.add_divider': 'Tilføj skillelinje',
      'ui.section_default': 'Sektion',
      'ui.section_label': 'Sektionens overskrift',
      'ui.divider_row': 'Skillelinje',
      'ui.remove_row': 'Fjern'
    },
    en: {
      'card.description': 'A modern card for dynamic entities with several layouts and a visual editor.',
      'card.ctl_brightness': 'Brightness',
      'card.ctl_kelvin': 'Colour temperature',
      'card.ctl_color': 'Colour',
      'card.ctl_cover_open': 'Open',
      'card.ctl_cover_stop': 'Stop',
      'card.ctl_cover_close': 'Close',
      'card.ctl_cover_position': 'Position',
      'card.ctl_cover_tilt': 'Tilt',
      'card.ctl_fan_toggle': 'Turn on/off',
      'card.ctl_fan_speed': 'Speed',
      'card.ctl_fan_oscillate': 'Oscillation',
      'card.ctl_fan_direction': 'Direction',
      'card.ctl_media_prev': 'Previous',
      'card.ctl_media_play_pause': 'Play/pause',
      'card.ctl_media_next': 'Next',
      'card.ctl_media_mute': 'Mute',
      'card.ctl_media_volume': 'Volume',
      'card.ctl_lock_toggle': 'Lock/unlock',
      'card.ctl_number_slider': 'Value',
      'card.ctl_select_option': 'Choose',
      'card.lock_confirm': 'Press again to unlock',
      'card.ctl_climate_target': 'Target temperature',
      'card.ctl_climate_mode': 'HVAC mode',
      'card.ctl_climate_preset': 'Preset',
      'card.ctl_climate_fan': 'Fan mode',
      'card.ctl_vacuum_start_pause': 'Start/pause',
      'card.ctl_vacuum_stop': 'Stop',
      'card.ctl_vacuum_return': 'Return to dock',
      'card.ctl_vacuum_locate': 'Locate',
      'card.ctl_vacuum_fan_speed': 'Suction power',
      'card.ctl_vacuum_clean_area': 'Clean by area',
      'card.areas_loading': 'Loading areas…',
      'card.areas_none': 'No areas mapped',
      'card.areas_none_help': 'No areas are mapped yet. Open the Home Assistant dialog to map the rooms.',
      'card.areas_start': 'Start',
      'card.areas_pick': 'Choose areas',
      'card.areas_n': 'areas selected',
      'card.areas_open': 'Open Home Assistant dialog',
      'ui.ctlg_climate': 'Climate',
      'ui.ctlg_vacuum': 'Vacuum',
      'ui.infog_general': 'General',
      'ui.infog_device': 'Device sensors',
      'ui.info_intro': 'Choose the details to show under the name. Only the types present in the card are listed. Each item shows only the ones it has, on one line separated by ·.',
      'ui.info_none': 'No details match the types in the card. Turn on Show all types to see them all.',
      'label.device_controls': 'The device\'s own choices, numbers and buttons',
      'help.device_controls': 'Also shows the device\'s own select lists, numbers and buttons (for example a fan\'s horizontal and vertical swing, or a player\'s favorite button) as controls on the item. Only entities from the same device, without diagnostic or hidden ones; buttons for restart, update and configuration are left out; at most four per item. Not shown in chips.',
      'label.button_press_feedback': 'Device buttons: light up when pressed',
      'help.button_press_feedback': 'The device\'s own buttons light up briefly when you press them, so you can see the press was sent. The button does not know whether the action succeeded. Default: On.',
      'label.device_controls_order': 'The device\'s own controls: order',
      'help.device_controls_order': 'Which of the device\'s own controls come first when there are more than four. Default: Buttons first.',
      'o.device_controls_order.buttons': 'Buttons first',
      'o.device_controls_order.values': 'Choices and numbers first',
      'ui.ctl_intro': 'Choose the controls you want. Only the types present in the card are listed. Each item shows only the ones it supports.',
      'ui.ctl_all': 'Show all types',
      'ui.ctl_all_help': 'Also lists types that are not in the card yet.',
      'ui.ctl_none': 'No controls match the types in the card. Turn on Show all types to see them all.',
      'ui.ctlg_light': 'Light',
      'ui.ctlg_cover': 'Cover',
      'ui.ctlg_fan': 'Fan',
      'ui.ctlg_media_player': 'Media player',
      'ui.ctlg_lock': 'Lock',
      'ui.ctlg_values': 'Numbers and lists',
      'card.hue': 'Hue',
      'card.sat': 'Saturation',
      'card.empty': 'No entities to show',
      'card.not_found': 'Not found',
      'section.entities': 'Entities',
      'section.filter': 'Filter',
      'section.buttons': 'Buttons',
      'section.colors': 'Colours and animation',
      'ui.colors_intro': 'Rules change colour and/or animate based on a value, for example battery below 20 % = red and pulsing. Rules are built like in the filter. The first rule that matches wins. If none match, everything looks normal. Animation is switched off automatically if the device is set to reduce motion. Rules per entity (under Entities → Customise per entity) take priority over the rules here.',
      'ui.add_color_rule': 'Add rule',
      'ui.color_rule_n': 'Rule {n}',
      'ui.item_color_rules': 'Colour rules for this entity',
      'label.r_color': 'Colour',
      'label.r_affects': 'Affects',
      'label.r_animation': 'Animation',
      'label.r_speed': 'Speed',
      'o.animation.none': 'None',
      'o.animation.pulse': 'Pulse',
      'o.animation.pulse_size': 'Pulse (size)',
      'o.animation.blink': 'Blink',
      'o.animation.glow': 'Glow',
      'o.animation.spin': 'Rotation (icon only)',
      'o.speed.slow': 'Slow',
      'o.speed.normal': 'Normal',
      'o.speed.fast': 'Fast',
      'o.affects.all': 'Whole item',
      'o.affects.icon': 'Icon only',
      'o.affects.indicator': 'Indicator only',
      'section.layout': 'Layout',
      'section.grouping': 'Grouping',
      'label.group_by': 'Group by',
      'help.group_by': 'Splits the items into sections with a heading and a count. Grouping replaces custom sections and dividers in the list. Filter, colours and indicators work as before.',
      'label.group_collapsible': 'Collapsible',
      'help.group_collapsible': 'Tap a heading to collapse or expand the group. This is not remembered when the page is reloaded.',
      'label.group_size': 'Heading size',
      'help.group_size': 'The size of the group headings. M is the default.',
      'label.group_color': 'Heading colour',
      'help.group_color': 'Colour of all group headings (text, arrow and any line or background). Empty = normal text colour.',
      'label.group_style': 'Heading style',
      'help.group_style': 'Text only, text with a line below, or text on a rounded background in a faint shade of the colour.',
      'label.group_align': 'Heading alignment',
      'help.group_align': 'Where the heading sits across the width.',
      'label.group_count': 'Show count',
      'help.group_count': 'Shows the number of items in the group after the name, for example (5).',
      'o.group_size.s': 'S',
      'o.group_size.m': 'M',
      'o.group_size.l': 'L',
      'o.group_size.xl': 'XL',
      'o.group_style.plain': 'Text only',
      'o.group_style.line': 'With line',
      'o.group_style.fill': 'With background',
      'o.group_align.left': 'Left',
      'o.group_align.center': 'Centre',
      'o.group_align.right': 'Right',
      'o.group_by.none': 'None',
      'o.group_by.area': 'Area',
      'o.group_by.device': 'Device',
      'o.group_by.device_class': 'Device class',
      'o.group_by.domain': 'Domain',
      'o.group_by.state': 'State',
      'o.group_by.custom': 'Custom groups',
      'label.group_rest_label': 'Name of the rest',
      'help.group_rest_label': 'The group at the bottom with everything that does not fit any of your groups. Empty = Other.',
      'label.group_rest_show': 'Show the rest',
      'help.group_rest_show': 'Turn off to hide everything that does not fit any of your groups.',
      'label.r_name': 'Group name',
      'ui.group_intro': 'Make your own groups. Each group has a name, one or more conditions (built like in the filter) and a colour for the heading. An entity goes in the first group that matches. The groups appear in the order you create them.',
      'ui.group_rule_n': 'Group {n}',
      'ui.add_group_rule': 'Add group',
      'group.none_custom': 'Other',
      'group.default_name': 'Group {n}',
      'group.none_area': 'No area',
      'group.none_device': 'No device',
      'group.none_device_class': 'No device class',
      'group.state.active': 'Active',
      'group.state.inactive': 'Inactive',
      'group.state.unavailable': 'Unavailable',
      'section.appearance': 'Appearance',
      'section.interaction': 'Interaction',
      'section.indicators': 'Status indicators',
      'section.advanced': 'Advanced',
      'label.entities': 'Entities',
      'label.layout': 'Layout',
      'label.align': 'Alignment',
      'label.item_width': 'Item width',
      'help.item_width': 'Minimum width per item when columns is 0 (auto). 0 = automatic (room for buttons). With Fill width the items stretch to fill; with Start/Centre/End they get exactly this width. Not used with a fixed number of columns.',
      'label.columns': 'Columns',
      'label.gap': 'Gap',
      'label.title': 'Title',
      'label.empty_text': 'Text when empty',
      'label.shape': 'Shape',
      'label.radius': 'Custom radius',
      'label.size': 'Size',
      'label.color_mode': 'Colours',
      'label.color': 'Fixed colour',
      'label.show_icon': 'Show icon',
      'label.show_name': 'Show name',
      'label.long_text': 'Long text',
      'help.long_text': 'What happens when the name or secondary info is too long for the item. Scroll: the text slowly scrolls back and forth (only if it does not fit). Truncate: the text is cut off with …. Does not scroll in chips.',
      'o.long_text.scroll': 'Scroll',
      'o.long_text.truncate': 'Truncate with …',
      'label.secondary_info': 'Secondary information',
      'label.card_opacity': 'Card opacity',
      'label.card_plain': 'No card style',
      'label.hide_border': 'Hide border',
      'label.hide_shadow': 'Hide shadow',
      'label.card_corners': 'Card corners',
      'label.card_radius': 'Card corner radius',
      'label.sort_by': 'Sort the filter result by',
      'label.sort_manual': 'Also sort manual entities',
      'help.sort_manual': 'Manually chosen entities follow the same sorting as the filter result and are mixed in with it. With sections/dividers, sorting happens within each section and the filter result goes into the last one. Off: the manual ones come first in the order you set yourself.',
      'label.sort_dir': 'Direction',
      'label.c_field': 'Field',
      'label.c_attribute': 'Attribute name',
      'label.c_operator': 'Comparison',
      'label.c_value': 'Value',
      'label.controls': 'Controls',
      'label.b_icon': 'Icon',
      'label.b_color': 'Colour (optional)',
      'label.button_color': 'Button colour',
      'help.button_color': 'Colour of all buttons (icon and faint background). Empty = neutral. A single custom button can have its own colour.',
      'label.b_name': 'Tooltip (optional)',
      'label.controls_autoclose': 'Close control automatically after (sec.)',
      'help.controls_autoclose': 'The slider closes by itself after this many seconds without touch. 0 = only closes with ✕.',
      'card.close': 'Close',
      'card.color_hue': 'Colour {h}°',
      'label.b_entity': 'Show control for entity (optional)',
      'help.b_entity': 'Pick a choice list or a number (select, input_select, number, input_number). A tap on the button then opens the entity\'s list or slider in the card, and the tap action is not used. Hold and double tap still work.',
      'label.b_tap_action': 'Tap',
      'label.b_hold_action': 'Hold',
      'label.b_double_tap_action': 'Double tap',
      'label.hide_when_empty': 'Hide the card when empty',
      'label.secondary_attribute': 'Attribute name',
      'label.background': 'Item background',
      'label.show_switch': 'Show switch',
      'label.tap_action': 'Tap on item',
      'label.hold_action': 'Hold on item',
      'label.double_tap_action': 'Double tap on item',
      'label.icon_tap_action': 'Tap on icon',
      'label.icon_hold_action': 'Hold on icon',
      'label.icon_double_tap_action': 'Double tap on icon',
      'label.indicator': 'Status indicator',
      'label.bubble_text': 'Bubble shows the text',
      'label.indicator_position': 'Position',
      'label.only_active': 'Show only active',
      'label.hide_unavailable': 'Hide unavailable',
      'label.filter_show_all': 'Show all filter results',
      'help.filter_show_all': 'The filter result is otherwise limited to {n} items to spare Home Assistant. Turn on to show all (can be heavy with many entities). Manually chosen entities are not counted.',
      'card.limit_note': 'The filter matches {n} entities, showing {m}. Turn on **{s}** to see them all.',
      'ui.filter_warn_broad': '⚠ A rule with only * matches everything. This can be heavy.',
      'ui.filter_warn_many': '⚠ The filter matches many entities ({n}). The card shows at most {l} unless you turn on Show all.',
      'ui.show_all_names': 'Show all',
      'ui.show_few_names': 'Show fewer',
      'label.max_items': 'Max number of items',
      'label.data_source': 'Data source (editor only)',
      'label.item_name': 'Name',
      'label.item_icon': 'Icon',
      'help.entities': 'Choose the entities. Change the order with the arrows under Customise per entity.',
      'help.layout': 'How the entities are shown.',
      'help.align': 'How the items are placed across the width. Fill width stretches them out.',
      'help.columns': 'Number of columns. 0 chooses automatically based on the width.',
      'help.gap': 'Distance between the items in pixels.',
      'help.title': 'Heading above the card. If empty, no heading is shown.',
      'help.empty_text': 'Text shown when there are no items. Empty uses the default text.',
      'help.shape': 'The corners of the items.',
      'help.radius': 'Radius in pixels when the shape is set to Custom.',
      'help.size': 'Scales the size of the items and their text.',
      'help.color_mode': 'State based colours active items and dims inactive ones. Theme uses the theme colour. Fixed uses your own colour.',
      'help.color': 'The colour when colours is set to Fixed.',
      'help.show_icon': 'Shows the icon on the item.',
      'help.show_name': 'Shows the name on the item.',
      'help.secondary_info': 'Choose one or more. They are shown on one line separated by · in the order they appear in the list. Each item shows only the ones it has.',
      'help.card_opacity': 'The card background: 100 is as the theme, 0 is fully transparent. The items are not affected.',
      'help.card_plain': 'Removes the card background, border and shadow, so the items float freely on the dashboard.',
      'help.hide_border': 'Removes the card border, whatever the theme uses.',
      'help.hide_shadow': 'Removes the card shadow, if the theme has one.',
      'help.card_corners': 'The corners of the card. Theme uses the theme value.',
      'help.card_radius': 'Radius of the card corners in pixels.',
      'help.sort_by': 'Only applies to entities found by the filter. Manually chosen entities keep their order.',
      'help.sort_dir': 'Ascending or descending order.',
      'help.controls': 'Choose the controls you want. Each item shows only the ones its type and device support: light, cover, fan, media player, lock, climate, vacuum, numbers and lists. Buttons work immediately; sliders and lists unfold inside the item (✕ closes). In chips only the buttons are shown, not sliders and lists.',
      'help.hide_when_empty': 'Hides the whole card when there are no items. The card is still shown in the editor preview.',
      'help.secondary_attribute': 'The name of the attribute to show.',
      'help.background': 'The background behind each item.',
      'help.show_switch': 'Shows an on/off switch for entities that can be toggled.',
      'ui.cur_head': 'The item\'s own entity',
      'ui.cur_head_help': 'Applies to the actions above that are set to Perform action.',
      'ui.cur_head_help1': 'Applies to the action above if it is set to Perform action.',
      'label.cur_target': 'Target the item\'s own entity (current)',
      'help.cur_target': 'The action runs on the item it sits on. That way one action works on every light, player etc. in the card. Switched off, you pick a specific entity yourself.',
      'ui.cur_ok': 'If «current» shows «Entity not found», that is fine: HA\'s picker only knows real entities. The card swaps «current» for the item\'s own entity when you tap.',
      'ui.cur_ok_data': 'The value «current» in the action\'s data is swapped for the item\'s own entity when you tap. If it shows «Entity not found», that is fine.',
      'label.cur_data': 'Set «{f}» to the item\'s own entity (current)',
      'help.cur_data': 'The data field gets the item\'s own entity when you tap.',
      'help.tap_action': 'What happens when you tap the item.',
      'help.hold_action': 'What happens when you hold your finger on the item.',
      'help.double_tap_action': 'What happens when you double tap the item. Does not delay taps if it is switched off.',
      'help.icon_tap_action': 'What happens when you tap the icon.',
      'help.icon_hold_action': 'What happens when you hold your finger on the icon.',
      'help.icon_double_tap_action': 'What happens when you double tap the icon.',
      'help.indicator': 'A small marker of status. Can be used on all layouts.',
      'help.bubble_text': 'When on, the bubble shows the state or value as text, for example "On" or "85 %". When off, the bubble is a small dot. For chips in size XS and S the bubble is always a dot.',
      'help.indicator_position': 'Where the marker sits on the item.',
      'help.only_active': 'Shows only entities that are active, for example on or open.',
      'help.hide_unavailable': 'Hides entities that are unavailable.',
      'help.max_items': 'Limits the number of items shown. 0 means no limit.',
      'help.data_source': 'Controls whether the list of entities is shown here. Automatic hides it when the card is used inside Auto Entities.',
      'help.item_name': 'A custom name for this entity. Empty uses the Home Assistant name.',
      'help.item_icon': 'A custom icon for this entity. Empty uses the default icon.',
      'o.layout.tiles': 'Tiles',
      'o.layout.chips': 'Chips',
      'o.layout.list': 'List',
      'o.layout.grid': 'Grid',
      'o.align.stretch': 'Fill width',
      'o.align.start': 'Left',
      'o.align.center': 'Centred',
      'o.align.end': 'Right',
      'o.align.space-between': 'Spread out',
      'o.shape.rounded': 'Rounded',
      'o.shape.square': 'Square',
      'o.shape.pill': 'Pill',
      'o.shape.custom': 'Custom',
      'o.size.xs': 'XS',
      'o.size.s': 'S',
      'o.size.m': 'M',
      'o.size.l': 'L',
      'o.size.xl': 'XL',
      'o.color_mode.state': 'State based',
      'o.color_mode.theme': 'Theme',
      'o.color_mode.static': 'Fixed',
      'o.secondary_info.none': 'None',
      'o.secondary_info.state': 'State',
      'o.secondary_info.last_changed': 'Last changed',
      'o.secondary_info.attribute': 'Attribute',
      'o.secondary_info.brightness': 'Brightness',
      'o.secondary_info.cover_position': 'Cover: position',
      'o.secondary_info.cover_tilt': 'Cover: tilt',
      'o.secondary_info.fan_speed': 'Fan: speed',
      'o.secondary_info.media_volume': 'Media player: volume',
      'o.secondary_info.climate_temps': 'Climate: current → target',
      'o.secondary_info.climate_action': 'Climate: what it is doing now',
      'o.secondary_info.vacuum_fan': 'Vacuum: suction power',
      'o.secondary_info.dev_signal': 'Device\'s sensor: signal',
      'o.secondary_info.dev_power': 'Device\'s sensor: power',
      'o.secondary_info.dev_energy': 'Device\'s sensor: energy',
      'o.secondary_info.dev_temperature': 'Device\'s sensor: temperature',
      'o.secondary_info.dev_humidity': 'Device\'s sensor: humidity',
      'o.secondary_info.kelvin': 'Kelvin (colour in colour mode)',
      'o.secondary_info.battery': 'Battery',
      'o.secondary_info.media_title': 'Media player: artist and title',
      'o.card_corners.theme': 'Theme',
      'o.card_corners.square': 'Square',
      'o.card_corners.custom': 'Custom',
      'o.sort_by.name': 'Name',
      'o.sort_by.entity_id': 'Entity ID',
      'o.sort_by.state': 'State',
      'o.sort_by.last_changed': 'Last changed',
      'o.sort_dir.asc': 'Ascending',
      'o.sort_dir.desc': 'Descending',
      'o.field.domain': 'Domain',
      'o.field.entity_id': 'Entity ID',
      'o.field.name': 'Name',
      'o.field.state': 'State',
      'o.field.attribute': 'Attribute',
      'o.field.device_class': 'Device class',
      'o.field.area': 'Area',
      'o.field.floor': 'Floor',
      'o.field.label': 'Label',
      'o.field.device': 'Device',
      'o.operator.is': 'is',
      'o.operator.is_not': 'is not',
      'o.operator.in': 'is one of',
      'o.operator.contains': 'contains',
      'o.operator.not_contains': 'does not contain',
      'o.operator.starts_with': 'starts with',
      'o.operator.lt': 'is less than',
      'o.operator.gt': 'is greater than',
      'o.operator.lte': 'is less than or equal to',
      'o.operator.gte': 'is greater than or equal to',
      'o.controls.climate_target': 'Climate: target temperature (slider)',
      'o.controls.climate_mode': 'Climate: HVAC mode (list)',
      'o.controls.climate_preset': 'Climate: preset (list)',
      'o.controls.climate_fan': 'Climate: fan mode (list)',
      'o.controls.vacuum_start_pause': 'Vacuum: start/pause',
      'o.controls.vacuum_stop': 'Vacuum: stop',
      'o.controls.vacuum_return': 'Vacuum: return to dock',
      'o.controls.vacuum_locate': 'Vacuum: locate',
      'o.controls.vacuum_fan_speed': 'Vacuum: suction power (list)',
      'o.controls.vacuum_clean_area': 'Vacuum: clean by area',
      'o.controls.brightness': 'Light: brightness',
      'o.controls.kelvin': 'Light: Kelvin (colour temperature)',
      'o.controls.color': 'Light: colour',
      'o.controls.cover_open': 'Cover: open',
      'o.controls.cover_stop': 'Cover: stop',
      'o.controls.cover_close': 'Cover: close',
      'o.controls.cover_position': 'Cover: position (slider)',
      'o.controls.cover_tilt': 'Cover: tilt (slider)',
      'o.controls.fan_toggle': 'Fan: turn on/off',
      'o.controls.fan_speed': 'Fan: speed (slider)',
      'o.controls.fan_oscillate': 'Fan: oscillation',
      'o.controls.fan_direction': 'Fan: direction',
      'o.controls.media_prev': 'Media player: previous',
      'o.controls.media_play_pause': 'Media player: play/pause',
      'o.controls.media_next': 'Media player: next',
      'o.controls.media_mute': 'Media player: mute',
      'o.controls.media_volume': 'Media player: volume (slider)',
      'o.controls.lock_toggle': 'Lock: lock/unlock',
      'o.controls.number_slider': 'Number: slider (number, input_number)',
      'o.controls.select_option': 'Choice: list (select, input_select)',
      'o.background.filled': 'Filled',
      'o.background.outlined': 'Outline only',
      'o.background.transparent': 'Transparent',
      'label.icon_position': 'Icon position',
      'help.icon_position': 'Where the icon sits in the item. Chips and list: left or right. Tiles: left, top or right. Grid: top left, centre or right.',
      'o.icon_position.left': 'Left',
      'o.icon_position.top': 'Top left',
      'o.icon_position.top_center': 'Top centre',
      'o.icon_position.top_right': 'Top right',
      'o.icon_position.right': 'Right',
      'label.icon_size': 'Icon size',
      'help.icon_size': 'The size of the icon. Automatic follows the size of the item.',
      'o.icon_size.auto': 'Automatic',
      'o.icon_size.s': 'S',
      'o.icon_size.m': 'M',
      'o.icon_size.l': 'L',
      'o.icon_size.xl': 'XL',
      'label.button_size': 'Button size',
      'help.button_size': 'The size of the buttons. Automatic follows the size of the item. The slider gets the same height as the buttons.',
      'o.button_size.auto': 'Automatic',
      'o.button_size.s': 'S',
      'o.button_size.m': 'M',
      'o.button_size.l': 'L',
      'o.button_size.xl': 'XL',
      'label.big_value': 'Big value',
      'help.big_value': 'Shows the first secondary information (for example 18 %) large, in the item\'s colour. Above the name when the icon is on top, otherwise below the name.',
      'o.indicator.none': 'None',
      'o.indicator.dot': 'Dot',
      'o.indicator.corner_badge': 'Corner badge',
      'o.indicator.ring': 'Ring',
      'o.indicator.stripe': 'Stripe',
      'o.indicator.bubble': 'Notification bubble',
      'o.indicator.state_label': 'State text',
      'o.indicator_position.top_right': 'Top right',
      'o.indicator_position.top_left': 'Top left',
      'o.indicator_position.bottom_right': 'Bottom right',
      'o.indicator_position.bottom_left': 'Bottom left',
      'o.data_source.auto': 'Automatic',
      'o.data_source.manual': 'Manual list',
      'o.data_source.auto_entities': 'Auto Entities',
      'o.action.none': 'None',
      'o.action.toggle': 'Toggle',
      'o.action.more-info': 'More info',
      'o.action.navigate': 'Navigate',
      'o.action.url': 'Open URL',
      'o.action.perform-action': 'Perform action',
      'o.action.call-service': 'Call service',
      'o.action.fire-dom-event': 'Fire event',
      'ui.default_is': 'Default: {v}.',
      'ui.on': 'On',
      'ui.off': 'Off',
      'ui.filter_intro': 'Find entities automatically with rules. A rule matches when all its conditions match (AND). Several rules in the same list are OR: one matching is enough. To get OR between values within one rule, use "is one of" (for example playing, paused). Include rules find entities and add them together, and Exclude rules remove them afterwards. The result is shown after the manually chosen entities. Show only if limits everything on the card at the end. Numbers are compared as numbers, * is a wildcard, and for "is one of" the values are separated by commas.',
      'ui.only_if': 'Show only if',
      'ui.add_only_if': 'Add Show only if rule',
      'ui.only_if_hint': 'Limits all entities on the card, both your own and the filter result. Never adds new ones. With several rules, one matching is enough. Unfinished rules are ignored.',
      'ui.only_if_match': 'Show only if: {n} of {m} entities match right now.',
      'ui.buttons_intro': 'Custom buttons are round icon buttons next to (grid: below) the item\'s text and can run any action. If an action calls a service without a target, it hits the item\'s own entity. Buttons can also be set per entity under Entities → Customise per entity.',
      'ui.add_button': 'Add button',
      'ui.button_n': 'Button {n}',
      'ui.remove_button': 'Remove button',
      'ui.include': 'Include',
      'ui.exclude': 'Exclude',
      'ui.add_include': 'Add Include rule',
      'ui.add_exclude': 'Add Exclude rule',
      'ui.rule_n': 'Rule {n}',
      'ui.add_condition': 'Add condition',
      'ui.remove_rule': 'Remove rule',
      'ui.remove_condition': 'Remove condition',
      'ui.and': 'and',
      'ui.or': 'or',
      'ui.filter_match': 'The filter matches {n} entities right now.',
      'ui.filter_match_one': 'The filter matches 1 entity right now.',
      'ui.filter_match_none': 'The filter matches no entities right now.',
      'ui.filter_no_rules': 'Add an Include rule to use the filter.',
      'ui.px': 'px',
      'ui.s': 'sec.',
      'ui.percent': '%',
      'ui.changed_title': 'Changed from default ({n})',
      'ui.all_default': 'Everything is default',
      'ui.reset_one': 'Reset',
      'ui.reset_all': 'Reset all',
      'ui.reset_confirm': 'Reset all settings?',
      'ui.reset_yes': 'Yes, reset',
      'ui.reset_no': 'Cancel',
      'ui.editor_unavailable': 'The editor could not be loaded. Use the YAML editor instead.',
      'ui.ae_note': 'The entities are supplied by Auto Entities.',
      'ui.customize_title': 'Customise per entity',
      'ui.move_up': 'Move up',
      'ui.move_down': 'Move down',
      'ui.item_overrides': 'Override card settings',
      'ui.item_overrides_hint': 'Applies to this entity only. Everything else follows the card settings.',
      'ui.item_add_override': 'Add override…',
      'ui.item_add_pick': 'Choose a setting',
      'ui.copy_title': 'Copy to other entities',
      'ui.copy_hint': 'Copies what you choose from this entity to others. Name and icon are not copied. Overrides only replace the same settings on the receiver; its other settings stay.',
      'ui.cp_none': 'Nothing to copy yet. Add an override, a rule or a button on this entity first.',
      'label.cp_ovr': 'Overrides ({n})',
      'label.cp_rules': 'Colour rules ({n})',
      'label.cp_btns': 'Buttons ({n})',
      'label.cp_btns_zero': 'No buttons (hides the card\'s)',
      'label.cp_to': 'Copy to',
      'label.cp_mode': 'Rules and buttons on the receiver',
      'o.cp_mode.replace': 'Replace the receiver\'s own',
      'o.cp_mode.add': 'Add after the receiver\'s own',
      'ui.cp_all': 'Select all others',
      'ui.cp_go': 'Copy',
      'ui.cp_done_1': 'Copied to 1 entity',
      'ui.cp_done_n': 'Copied to {n} entities',
      'ui.dup_rule': 'Duplicate',
      'ui.clip_copy': 'Copy',
      'ui.clip_copy_hint': 'Put it in the clipboard so you can paste it somewhere else',
      'ui.clip_paste': 'Paste here',
      'ui.clip_clear': 'Clear the clipboard',
      'ui.clip_has': 'In the clipboard',
      'ui.clip_color': 'Colour rule',
      'ui.clip_group': 'Group rule',
      'ui.clip_filter': 'Filter rule',
      'ui.clip_button': 'Button',
      'ui.item_copy_card_rules': 'Copy the card\'s rules here',
      'ui.fold_all_in': 'Fold all',
      'ui.fold_all_out': 'Unfold all',
      'ui.sum_none': 'follows the card',
      'ui.sum_look': 'own name or icon',
      'ui.sum_ovr_1': '1 override',
      'ui.sum_ovr_n': '{n} overrides',
      'ui.sum_rules_1': '1 rule',
      'ui.sum_rules_n': '{n} rules',
      'ui.sum_btn_1': '1 button',
      'ui.sum_btn_n': '{n} buttons',
      'ui.sum_btn_zero': 'no buttons',
      'ui.item_buttons': 'Own buttons on this entity',
      'ui.item_buttons_hint': 'If the entity has its own buttons, they are used instead of the card\'s own buttons.',
      'ui.item_use_card_buttons': 'Use the card\'s buttons',
      'ui.item_use_card_buttons_hint': 'Turn off to give this entity its own list. It starts empty (no buttons), and you can add your own below.',
      'ui.item_copy_card_buttons': 'Copy the card\'s buttons here',
      'label.hide_buttons': 'Hide all buttons',
      'help.hide_buttons': 'Hides controls (for example play, next, brightness), the device\'s own choices, numbers and buttons, own buttons and the switch on this entity only. Other entities keep theirs.',
      'ui.item_duplicate': 'Add the entity again',
      'ui.add_section': 'Add section',
      'ui.add_divider': 'Add divider',
      'ui.section_default': 'Section',
      'ui.section_label': 'Section heading',
      'ui.divider_row': 'Divider',
      'ui.remove_row': 'Remove'
    }
  };
  // Sproget følger Home Assistants sprog: dansk til dansk, engelsk til alle andre.
  let LANG = 'en';
  const setLang = (hass) => { const l = String((hass && hass.language) || '').toLowerCase(); LANG = l.indexOf('da') === 0 ? 'da' : 'en'; };
  const tr = (key, vars) => {
    let s = STRINGS[LANG] && STRINGS[LANG][key];
    if (s === undefined || s === '') s = STRINGS.en[key];
    if (s === undefined || s === '') s = STRINGS.da[key];
    if (s === undefined) return key;
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]));
    return s;
  };

  /* ====================================================================
   * 2. INDSTILLINGSREGISTER
   * Én liste beskriver alle indstillinger: sektion, type, valg, standard
   * og hvornår de er relevante. Kortet, editoren og "Ændret fra standard"
   * bygges ud fra den samme liste.
   * ================================================================== */
  const LAYOUT_IDS = ['tiles', 'chips', 'list', 'grid'];
  const SECTIONS = [
    { id: 'entities', icon: 'mdi:format-list-bulleted-square' },
    { id: 'filter', icon: 'mdi:filter-variant' },
    { id: 'layout', icon: 'mdi:view-dashboard-outline' },
    { id: 'grouping', icon: 'mdi:format-list-group' },
    { id: 'appearance', icon: 'mdi:palette-outline' },
    { id: 'colors', icon: 'mdi:invert-colors' },
    { id: 'interaction', icon: 'mdi:gesture-tap' },
    { id: 'buttons', icon: 'mdi:gesture-tap-button' },
    { id: 'indicators', icon: 'mdi:record-circle-outline' },
    { id: 'advanced', icon: 'mdi:tune-variant' }
  ];
  const action = (a) => ({ action: a });

  const SETTINGS = [
    // Layout
    { key: 'layout', section: 'layout', type: 'select', options: LAYOUT_IDS, def: 'tiles' },
    { key: 'align', section: 'layout', type: 'select', options: ['stretch', 'start', 'center', 'end', 'space-between'], def: (l) => (l === 'chips' ? 'start' : 'stretch'), layouts: ['chips', 'tiles', 'grid'] },
    { key: 'icon_position', section: 'layout', type: 'select', options: ['left', 'top', 'right', 'top_center', 'top_right'], optionsFor: (l) => (l === 'grid' ? ['top', 'top_center', 'top_right'] : l === 'tiles' ? ['left', 'top', 'right'] : ['left', 'right']), def: (l) => (l === 'grid' ? 'top' : 'left') },
    { key: 'columns', section: 'layout', type: 'number', min: 0, max: 8, step: 1, def: 0, layouts: ['tiles', 'grid'] },
    { key: 'item_width', section: 'layout', type: 'number', min: 0, max: 600, step: 10, unit: 'px', mode: 'slider', def: 0, layouts: ['tiles', 'grid'], when: (e) => !(Number(e.columns) > 0) },
    { key: 'gap', section: 'layout', type: 'number', min: 0, max: 32, step: 1, unit: 'px', mode: 'slider', def: (l) => (l === 'chips' ? 6 : l === 'list' ? 4 : 8) },
    { key: 'title', section: 'layout', type: 'text', def: '' },
    { key: 'empty_text', section: 'layout', type: 'text', def: '' },
    // Gruppering
    { key: 'group_by', section: 'grouping', type: 'select', options: ['none', 'area', 'device', 'device_class', 'domain', 'state', 'custom'], def: 'none' },
    { key: 'group_size', section: 'grouping', type: 'select', options: ['s', 'm', 'l', 'xl'], def: 'm', when: (e) => e.group_by && e.group_by !== 'none' },
    { key: 'group_color', section: 'grouping', type: 'color', def: '', when: (e) => e.group_by && e.group_by !== 'none' },
    { key: 'group_style', section: 'grouping', type: 'select', options: ['plain', 'line', 'fill'], def: 'plain', when: (e) => e.group_by && e.group_by !== 'none' },
    { key: 'group_align', section: 'grouping', type: 'select', options: ['left', 'center', 'right'], def: 'left', when: (e) => e.group_by && e.group_by !== 'none' },
    { key: 'group_count', section: 'grouping', type: 'boolean', def: true, when: (e) => e.group_by && e.group_by !== 'none' },
    { key: 'group_collapsible', section: 'grouping', type: 'boolean', def: true, when: (e) => e.group_by && e.group_by !== 'none' },
    { key: 'group_rest_label', section: 'grouping', type: 'text', def: '', when: (e) => e.group_by === 'custom' },
    { key: 'group_rest_show', section: 'grouping', type: 'boolean', def: true, when: (e) => e.group_by === 'custom' },
    // Udseende
    { key: 'shape', section: 'appearance', type: 'select', options: ['rounded', 'square', 'pill', 'custom'], def: (l) => (l === 'chips' ? 'pill' : 'rounded') },
    { key: 'radius', section: 'appearance', type: 'number', min: 0, max: 50, step: 1, unit: 'px', mode: 'slider', def: 12, when: (e) => e.shape === 'custom' },
    { key: 'size', section: 'appearance', type: 'select', options: ['xs', 's', 'm', 'l', 'xl'], def: 'm' },
    { key: 'color_mode', section: 'appearance', type: 'select', options: ['state', 'theme', 'static'], def: 'state' },
    { key: 'color', section: 'appearance', type: 'color', def: '', item: true, when: (e) => e.color_mode === 'static' },
    { key: 'show_icon', section: 'appearance', type: 'boolean', def: true, item: true },
    { key: 'icon_size', section: 'appearance', type: 'select', options: ['auto', 's', 'm', 'l', 'xl'], def: 'auto', when: (e) => e.show_icon },
    { key: 'show_name', section: 'appearance', type: 'boolean', def: true, item: true },
    { key: 'long_text', section: 'appearance', type: 'select', options: ['scroll', 'truncate'], def: 'scroll', layouts: ['tiles', 'list', 'grid'] },
    { key: 'secondary_info', section: 'appearance', type: 'multiselect', options: ['state', 'brightness', 'kelvin', 'cover_position', 'cover_tilt', 'fan_speed', 'climate_temps', 'climate_action', 'vacuum_fan', 'battery', 'media_title', 'media_volume', 'dev_signal', 'dev_power', 'dev_energy', 'dev_temperature', 'dev_humidity', 'last_changed', 'attribute'], def: (l) => (l === 'chips' ? [] : ['state']), item: true },
    { key: 'big_value', section: 'appearance', type: 'boolean', def: false, layouts: ['tiles', 'grid'], when: (e) => e.secondary_info.length > 0 },
    { key: 'secondary_attribute', section: 'appearance', type: 'text', def: '', item: true, when: (e) => e.secondary_info.includes('attribute') },
    { key: 'card_plain', section: 'appearance', type: 'boolean', def: false },
    { key: 'card_opacity', section: 'appearance', type: 'number', min: 0, max: 100, step: 5, unit: 'percent', mode: 'slider', def: 100, when: (e) => !e.card_plain },
    { key: 'hide_border', section: 'appearance', type: 'boolean', def: false, when: (e) => !e.card_plain },
    { key: 'hide_shadow', section: 'appearance', type: 'boolean', def: false, when: (e) => !e.card_plain },
    { key: 'card_corners', section: 'appearance', type: 'select', options: ['theme', 'square', 'custom'], def: 'theme', when: (e) => !e.card_plain },
    { key: 'card_radius', section: 'appearance', type: 'number', min: 0, max: 50, step: 1, unit: 'px', mode: 'slider', def: 12, when: (e) => !e.card_plain && e.card_corners === 'custom' },
    { key: 'background', section: 'appearance', type: 'select', options: ['filled', 'outlined', 'transparent'], def: (l) => (l === 'list' ? 'transparent' : 'filled') },
    { key: 'show_switch', section: 'appearance', type: 'boolean', def: (l) => l === 'list', layouts: ['list', 'tiles'], item: true },
    // Interaktion
    { key: 'tap_action', section: 'interaction', type: 'action', def: action('toggle'), item: true },
    { key: 'hold_action', section: 'interaction', type: 'action', def: action('none'), item: true },
    { key: 'double_tap_action', section: 'interaction', type: 'action', def: action('none'), item: true },
    { key: 'icon_tap_action', section: 'interaction', type: 'action', def: action('more-info'), item: true },
    { key: 'icon_hold_action', section: 'interaction', type: 'action', def: action('none'), item: true },
    { key: 'icon_double_tap_action', section: 'interaction', type: 'action', def: action('none'), item: true },
    // Knapper og styringer (egne knapper gemmes under 'buttons')
    { key: 'controls', section: 'buttons', type: 'multiselect', options: ['brightness', 'kelvin', 'color', 'cover_open', 'cover_stop', 'cover_close', 'cover_position', 'cover_tilt', 'fan_toggle', 'fan_speed', 'fan_oscillate', 'fan_direction', 'media_prev', 'media_play_pause', 'media_next', 'media_mute', 'media_volume', 'lock_toggle', 'climate_target', 'climate_mode', 'climate_preset', 'climate_fan', 'vacuum_start_pause', 'vacuum_stop', 'vacuum_return', 'vacuum_locate', 'vacuum_fan_speed', 'vacuum_clean_area', 'number_slider', 'select_option'], def: [], item: true, layouts: ['tiles', 'list', 'grid', 'chips'] },
    { key: 'device_controls', section: 'buttons', type: 'boolean', def: false, item: true, layouts: ['tiles', 'list', 'grid'] },
    { key: 'device_controls_order', section: 'buttons', type: 'select', options: ['buttons', 'values'], def: 'buttons', item: true, layouts: ['tiles', 'list', 'grid'], when: (e) => !!e.device_controls },
    { key: 'button_press_feedback', section: 'buttons', type: 'boolean', def: true, item: true, layouts: ['tiles', 'list', 'grid'], when: (e) => !!e.device_controls },
    { key: 'button_size', section: 'buttons', type: 'select', options: ['auto', 's', 'm', 'l', 'xl'], def: 'auto', layouts: ['tiles', 'list', 'grid'] },
    { key: 'button_color', section: 'buttons', type: 'color', def: '', layouts: ['tiles', 'list', 'grid'] },
    { key: 'controls_autoclose', section: 'buttons', type: 'number', min: 0, max: 30, step: 1, unit: 's', mode: 'slider', def: 0, layouts: ['tiles', 'list', 'grid'] },
    // Statusindikatorer
    { key: 'indicator', section: 'indicators', type: 'select', options: ['none', 'dot', 'corner_badge', 'ring', 'stripe', 'bubble', 'state_label'], def: (l) => (l === 'grid' ? 'dot' : 'none'), item: true },
    { key: 'bubble_text', section: 'indicators', type: 'boolean', def: false, item: true, layouts: ['tiles', 'list', 'grid', 'chips'], when: (e) => e.indicator === 'bubble' },
    { key: 'indicator_position', section: 'indicators', type: 'select', options: ['top_right', 'top_left', 'bottom_right', 'bottom_left'], def: 'top_right', item: true, when: (e) => ['dot', 'corner_badge', 'bubble'].includes(e.indicator) },
    // Filter (selve reglerne gemmes under 'filter', som 'entities')
    { key: 'sort_by', section: 'filter', type: 'select', options: ['name', 'entity_id', 'state', 'last_changed'], def: 'name' },
    { key: 'filter_show_all', section: 'filter', type: 'boolean', def: false },
    { key: 'sort_manual', section: 'filter', type: 'boolean', def: false },
    { key: 'sort_dir', section: 'filter', type: 'select', options: ['asc', 'desc'], def: 'asc' },
    // Avanceret
    { key: 'only_active', section: 'advanced', type: 'boolean', def: false },
    { key: 'hide_when_empty', section: 'advanced', type: 'boolean', def: false },
    { key: 'hide_unavailable', section: 'advanced', type: 'boolean', def: false },
    { key: 'max_items', section: 'advanced', type: 'number', min: 0, max: 200, step: 1, def: 0 },
    { key: 'data_source', section: 'advanced', type: 'select', options: ['auto', 'manual', 'auto_entities'], def: 'auto', editorOnly: true }
  ];
  const SETTING_BY_KEY = Object.fromEntries(SETTINGS.map((s) => [s.key, s]));
  // Nøgler en enkelt entitet må overstyre (ud over name og icon).
  const ITEM_KEYS = new Set(SETTINGS.filter((s) => s.item).map((s) => s.key));
  // Gælder kun en enkelt entitet (ikke kortet som helhed): skjuler alle knapper og kontakten på den. Står derfor ikke i SETTINGS.
  const HIDE_BUTTONS = { key: 'hide_buttons', type: 'boolean', def: false, item: true };

  const layoutOf = (cfg) => (cfg && LAYOUT_IDS.includes(cfg.layout) ? cfg.layout : 'tiles');
  const defOf = (s, layout) => (typeof s.def === 'function' ? s.def(layout) : s.def);
  const deepEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // Ikonplacering gælder kun de valg, der giver mening i layoutet; andre falder tilbage til nærmeste.
  function normIconPos(layout, v) {
    if (layout === 'grid') return v === 'top_center' || v === 'top_right' ? v : 'top';
    if (layout === 'tiles') return v === 'right' ? 'right' : v === 'top' || v === 'top_center' || v === 'top_right' ? 'top' : 'left';
    return v === 'right' ? 'right' : 'left';
  }

  // Alle indstillinger med deres faktiske værdi (valgt eller standard).
  function effective(cfg) {
    const layout = layoutOf(cfg);
    const out = { layout };
    for (const s of SETTINGS) {
      let v = cfg ? cfg[s.key] : undefined;
      if (v === undefined || v === null) v = defOf(s, layout);
      else if (s.type === 'number') {
        v = Number(v);
        if (!Number.isFinite(v)) v = defOf(s, layout);
      } else if (s.type === 'select' && !s.options.includes(v)) v = defOf(s, layout);
      else if (s.type === 'multiselect') v = normMulti(s, v, layout);
      out[s.key] = v;
    }
    out.icon_position = normIconPos(layout, out.icon_position);
    out.layout = layout;
    return out;
  }
  // Sekundær info: ældre konfigurationer har én tekst ('state', 'none'), nu en liste.
  function normMulti(s, v, layout) {
    if (v === undefined || v === null) return defOf(s, layout);
    const arr = Array.isArray(v) ? v : v === 'none' || v === '' ? [] : [v];
    return s.options.filter((o) => arr.includes(o)); // fast rækkefølge efter listen
  }
  const isRelevant = (s, eff) => (!s.layouts || s.layouts.includes(eff.layout)) && (!s.when || s.when(eff));

  // Fjerner nøgler, der er lig med standarden for det aktuelle layout.
  function pruneToDeviations(cfg) {
    const layout = layoutOf(cfg);
    const out = { ...cfg };
    for (const s of SETTINGS) {
      if (out[s.key] === undefined) continue;
      if (s.type === 'multiselect') out[s.key] = normMulti(s, out[s.key], layout);
      if (deepEq(out[s.key], defOf(s, layout))) delete out[s.key];
    }
    return out;
  }

  /* ====================================================================
   * 3. HJÆLPEFUNKTIONER
   * ================================================================== */
  const SCALE = { xs: 0.75, s: 0.875, m: 1, l: 1.2, xl: 1.45 };
  const ALWAYS_ACTIVE = new Set(['sensor', 'number', 'input_number', 'input_text', 'input_select', 'input_datetime', 'text', 'select', 'weather', 'counter', 'timer', 'update', 'image']);
  const INACTIVE_STATES = new Set(['off', 'closed', 'locked', 'idle', 'standby', 'not_home', 'disarmed', 'paused', 'docked', 'below_horizon', 'none', 'unavailable', 'unknown']);
  const TOGGLE_DOMAINS = new Set(['light', 'switch', 'input_boolean', 'fan', 'humidifier', 'automation', 'group', 'lock', 'cover', 'siren', 'valve', 'media_player', 'remote', 'script', 'scene', 'button', 'input_button']);
  const NAMED_COLORS = new Set(['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'light-grey', 'grey', 'dark-grey', 'blue-grey', 'black', 'white']);

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const fire = (node, type, detail) => node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));

  function isActive(domain, state) {
    if (state === undefined || state === 'unavailable' || state === 'unknown') return false;
    if (ALWAYS_ACTIVE.has(domain)) return true;
    return !INACTIVE_STATES.has(state);
  }

  function resolveColor(c) {
    if (!c || typeof c !== 'string') return '';
    if (/^(#|rgb|hsl|var\()/i.test(c)) return c;
    if (c === 'primary') return 'var(--primary-color)';
    if (c === 'accent') return 'var(--accent-color)';
    if (c === 'disabled') return 'var(--disabled-color)';
    if (NAMED_COLORS.has(c)) return 'var(--' + c + '-color)';
    return c;
  }

  function itemColor(item, S) {
    if (item.obj.color) return resolveColor(item.obj.color) || 'var(--primary-color)';
    const mode = S('color_mode');
    if (mode === 'theme') return 'var(--primary-color)';
    if (mode === 'static') return resolveColor(S('color')) || 'var(--primary-color)';
    if (item.missing) return 'var(--warning-color, #ffa600)';
    if (item.unavailable) return 'var(--state-unavailable-color, var(--disabled-text-color))';
    const d = item.domain;
    if (item.active) {
      const rgb = item.stateObj.attributes && item.stateObj.attributes.rgb_color;
      if (d === 'light' && Array.isArray(rgb) && rgb.length === 3) return 'rgb(' + rgb.join(',') + ')';
      // Værdi-entiteter (sensorer m.fl.) er "altid aktive" og skal ikke farves som tændt.
      if (ALWAYS_ACTIVE.has(d)) return 'var(--state-' + d + '-active-color, var(--primary-color))';
      return 'var(--state-' + d + '-active-color, var(--state-active-color, var(--primary-color)))';
    }
    return 'var(--state-' + d + '-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))';
  }

  function itemName(hass, item) {
    const n = item.obj.name;
    if (item.stateObj && hass && typeof hass.formatEntityName === 'function') {
      try {
        const r = hass.formatEntityName(item.stateObj, n);
        if (r) return r;
      } catch (e) { /* falder tilbage nedenfor */ }
    }
    if (typeof n === 'string' && n) return n;
    return (item.stateObj && item.stateObj.attributes && item.stateObj.attributes.friendly_name) || item.id;
  }

  function fmtState(hass, item) {
    if (item.missing) return tr('card.not_found');
    if (hass && typeof hass.formatEntityState === 'function') {
      try { return hass.formatEntityState(item.stateObj); } catch (e) { /* ignorer */ }
    }
    return String(item.stateObj.state);
  }

  const canToggle = (item) => !item.missing && !item.unavailable && TOGGLE_DOMAINS.has(item.domain);

  function toggleEntity(hass, item) {
    const id = item.id;
    const d = item.domain;
    // En låst lås låses op, alt andet låses.
    if (d === 'lock') return hass.callService('lock', item.stateObj && item.stateObj.state === 'locked' ? 'unlock' : 'lock', { entity_id: id });
    // Afspiller: tænd/sluk, hvis den kan det; ellers afspil/pause (mange afspillere har ikke tænd/sluk).
    if (d === 'media_player') {
      const f = Number(item.stateObj && item.stateObj.attributes && item.stateObj.attributes.supported_features) || 0;
      if ((f & 128) === 0 || (f & 256) === 0) { if (f & (1 | 16384)) return hass.callService('media_player', 'media_play_pause', { entity_id: id }); }
    }
    if (d === 'cover') return hass.callService('cover', 'toggle', { entity_id: id });
    if (d === 'button' || d === 'input_button') return hass.callService(d, 'press', { entity_id: id });
    if (d === 'scene' || d === 'script') return hass.callService(d, 'turn_on', { entity_id: id });
    return hass.callService('homeassistant', 'toggle', { entity_id: id });
  }

  // Kører en HA-handling. Én samlet funktion, så alle layouts opfører sig ens.
  // I en handlings data og mål betyder værdien current "elementets egen entitet" (så samme knap virker på alle elementer).
  // Kun hele værdien current erstattes; en tekst, hvor ordet indgår, røres ikke. Konfigurationen ændres ikke.
  const CURRENT_VALUE = 'current';
  function withCurrent(v, id) {
    if (v === CURRENT_VALUE) return id;
    if (Array.isArray(v)) return v.map((x) => withCurrent(x, id));
    if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = withCurrent(v[k], id); return o; }
    return v;
  }

  // Editorens kontakt til current: «target.entity_id: current» uden at skulle ind i YAML.
  const isParamAction = (a) => !!a && (a.action === 'perform-action' || a.action === 'call-service');
  function hasCurrentVal(v) {
    if (v === CURRENT_VALUE) return true;
    if (Array.isArray(v)) return v.some(hasCurrentVal);
    if (v && typeof v === 'object') return Object.keys(v).some((k) => hasCurrentVal(v[k]));
    return false;
  }
  const curTargetOn = (a) => { const id = a && a.target && a.target.entity_id; return id === CURRENT_VALUE || (Array.isArray(id) && id.includes(CURRENT_VALUE)); };
  const curUsed = (a) => !!a && (hasCurrentVal(a.target) || hasCurrentVal(a.data) || hasCurrentVal(a.service_data));
  function curTargetSet(a, on) {
    const t = { ...(a.target || {}) };
    const id = t.entity_id;
    if (on) t.entity_id = CURRENT_VALUE;
    else if (id === CURRENT_VALUE) delete t.entity_id;
    else if (Array.isArray(id)) { const r = id.filter((x) => x !== CURRENT_VALUE); if (r.length) t.entity_id = r; else delete t.entity_id; }
    const out = { ...a };
    if (Object.keys(t).length) out.target = t; else delete out.target;
    return out;
  }

  // Datafelter med entitetsvælger (fra HA's tjenesteliste) kan også sættes til current.
  const dataKeyOf = (a) => (a.service_data && !a.data ? 'service_data' : 'data');
  const curDataOn = (a, f) => { const v = (a && (a[dataKeyOf(a)] || {}))[f]; return v === CURRENT_VALUE || (Array.isArray(v) && v.includes(CURRENT_VALUE)); };
  function curDataSet(a, f, on) {
    const k = dataKeyOf(a);
    const d = { ...(a[k] || {}) };
    if (on) d[f] = CURRENT_VALUE;
    else if (d[f] === CURRENT_VALUE) delete d[f];
    else if (Array.isArray(d[f])) { const r = d[f].filter((x) => x !== CURRENT_VALUE); if (r.length) d[f] = r; else delete d[f]; }
    const out = { ...a };
    if (Object.keys(d).length) out[k] = d; else delete out[k];
    return out;
  }
  function entityFieldsOf(hass, a) {
    const id = String((a && (a.perform_action || a.service)) || '');
    const dot = id.indexOf('.');
    if (dot < 1) return [];
    const def = hass && hass.services && hass.services[id.slice(0, dot)] && hass.services[id.slice(0, dot)][id.slice(dot + 1)];
    const fields = def && def.fields && typeof def.fields === 'object' ? def.fields : {};
    return Object.keys(fields).filter((k) => fields[k] && fields[k].selector && typeof fields[k].selector === 'object' && 'entity' in fields[k].selector).map((k) => ({ key: k, name: fields[k].name || k }));
  }

  function runAction(node, hass, item, a) {
    if (!a || !a.action || a.action === 'none' || !hass) return;
    switch (a.action) {
      case 'toggle':
        if (canToggle(item)) toggleEntity(hass, item);
        else if (!item.missing) fire(node, 'hass-more-info', { entityId: item.id });
        break;
      case 'more-info':
        fire(node, 'hass-more-info', { entityId: a.entity || item.id });
        break;
      case 'navigate':
        if (a.navigation_path) {
          if (a.navigation_replace) window.history.replaceState(window.history.state && window.history.state.root ? { root: true } : null, '', a.navigation_path);
          else window.history.pushState(null, '', a.navigation_path);
          window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: !!a.navigation_replace } }));
        }
        break;
      case 'url':
        if (a.url_path) window.open(a.url_path, '_blank', 'noopener');
        break;
      case 'perform-action':
      case 'call-service': {
        const svc = a.perform_action || a.service;
        if (!svc || svc.indexOf('.') < 0) break;
        const [domain, service] = svc.split('.', 2);
        const data = a.data || a.service_data || {};
        hass.callService(domain, service, item && item.id ? withCurrent(data, item.id) : data, item && item.id && a.target ? withCurrent(a.target, item.id) : a.target);
        break;
      }
      case 'fire-dom-event':
        fire(node, 'll-custom', a);
        break;
      default:
        break;
    }
  }

  // Trykhåndtering: tryk, hold og dobbelttryk. Er dobbelttryk slået fra,
  // udløses tryk med det samme (ingen forsinkelse).
  function bindActions(target, h, run, isolate) {
    const has = (a) => a && a.action && a.action !== 'none';
    if (!has(h.tap) && !has(h.hold) && !has(h.double)) return false;
    target.classList.add('act');
    let holdTimer = null;
    let tapTimer = null;
    let held = false;
    let down = false;
    let taps = 0;
    let sx = 0;
    let sy = 0;
    const stopHold = () => { clearTimeout(holdTimer); holdTimer = null; };
    target.addEventListener('pointerdown', (e) => {
      if (isolate) e.stopPropagation();
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      down = true; held = false; sx = e.clientX; sy = e.clientY;
      if (has(h.hold)) holdTimer = setTimeout(() => { held = true; holdTimer = null; run(h.hold); }, 500);
    });
    target.addEventListener('pointermove', (e) => {
      if (!down) return;
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 10) { stopHold(); down = false; held = false; }
    });
    target.addEventListener('pointerup', (e) => {
      if (isolate) e.stopPropagation();
      if (!down) return;
      down = false; stopHold();
      if (held) { held = false; return; }
      if (has(h.double)) {
        taps += 1;
        if (taps === 1) tapTimer = setTimeout(() => { taps = 0; if (has(h.tap)) run(h.tap); }, 250);
        else { clearTimeout(tapTimer); taps = 0; run(h.double); }
      } else if (has(h.tap)) run(h.tap);
    });
    const cancel = () => { stopHold(); down = false; };
    target.addEventListener('pointercancel', cancel);
    target.addEventListener('pointerleave', cancel);
    target.addEventListener('contextmenu', (e) => { if (has(h.hold)) e.preventDefault(); });
    if (isolate) target.addEventListener('click', (e) => e.stopPropagation());
    target.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && has(h.tap)) { e.preventDefault(); e.stopPropagation(); run(h.tap); }
    });
    return true;
  }

  /* ====================================================================
   * 4. DATALAG OG ITEM-MODEL
   * Manuel liste og Auto Entities giver samme format:
   *   { kind, key, id, obj, stateObj, domain, active, unavailable, missing }
   * kind er 'entity', 'section' eller 'divider'.
   * ================================================================== */

  /* ====================================================================
   * 4a. FILTERMOTOR
   * Felter og sammenligninger ligger i hvert sit register. Nye felter
   * eller sammenligninger tilføjes ved at tilføje en linje her; editoren
   * bygges ud fra registrene.
   * ================================================================== */
  const _wild = new Map();
  const wildRe = (pat) => {
    let r = _wild.get(pat);
    if (!r) {
      r = new RegExp('^' + pat.split('*').map((x) => x.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$', 'i');
      _wild.set(pat, r);
    }
    return r;
  };
  const toNum = (v) => {
    if (v === null || v === undefined || typeof v === 'boolean') return null;
    if (typeof v === 'string' && v.trim() === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const eqVal = (a, exp) => {
    if (exp.indexOf('*') >= 0) return wildRe(exp).test(String(a));
    const na = toNum(a);
    const ne = toNum(exp);
    if (na !== null && ne !== null) return na === ne;
    return String(a).toLowerCase() === exp.toLowerCase();
  };
  const splitList = (t) => t.split(',').map((x) => x.trim()).filter(Boolean);
  const lower = (v) => String(v).toLowerCase();
  const numCmp = (fn) => (vals, exp) => { const n = toNum(exp); return n !== null && vals.some((a) => { const x = toNum(a); return x !== null && fn(x, n); }); };
  const OPERATORS = [
    { id: 'is', test: (v, e) => v.some((a) => eqVal(a, e)) },
    { id: 'is_not', test: (v, e) => !v.some((a) => eqVal(a, e)) },
    { id: 'in', test: (v, e) => splitList(e).some((x) => v.some((a) => eqVal(a, x))) },
    { id: 'contains', test: (v, e) => v.some((a) => lower(a).includes(lower(e))) },
    { id: 'not_contains', test: (v, e) => !v.some((a) => lower(a).includes(lower(e))) },
    { id: 'starts_with', test: (v, e) => v.some((a) => lower(a).startsWith(lower(e))) },
    { id: 'lt', numeric: true, test: numCmp((x, n) => x < n) },
    { id: 'gt', numeric: true, test: numCmp((x, n) => x > n) },
    { id: 'lte', numeric: true, test: numCmp((x, n) => x <= n) },
    { id: 'gte', numeric: true, test: numCmp((x, n) => x >= n) }
  ];
  const OPERATOR_BY_ID = Object.fromEntries(OPERATORS.map((o) => [o.id, o]));

  const flat = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v.map((x) => (x && typeof x === 'object' ? JSON.stringify(x) : x)) : typeof v === 'object' ? [JSON.stringify(v)] : [v]);
  const entReg = (c) => (c.hass.entities && c.hass.entities[c.id]) || null;
  const devReg = (c) => { const e = entReg(c); return e && e.device_id && c.hass.devices ? c.hass.devices[e.device_id] || null : null; };
  const areaIdOf = (c) => { const e = entReg(c); const d = devReg(c); return (e && e.area_id) || (d && d.area_id) || null; };
  const FIELDS = [
    { id: 'domain', get: (c) => [c.id.split('.')[0]] },
    { id: 'entity_id', get: (c) => [c.id] },
    { id: 'name', get: (c) => [c.so.attributes.friendly_name || c.id] },
    { id: 'state', numeric: true, get: (c) => [c.so.state] },
    { id: 'attribute', numeric: true, get: (c, cond) => (cond.attribute ? flat(c.so.attributes[cond.attribute]) : []) },
    { id: 'device_class', get: (c) => flat(c.so.attributes.device_class) },
    { id: 'area', needs: 'areas', get: (c) => { const a = areaIdOf(c); return a ? [a, c.hass.areas[a] && c.hass.areas[a].name].filter(Boolean) : []; } },
    { id: 'floor', needs: 'floors', get: (c) => { const a = areaIdOf(c); const ar = a && c.hass.areas && c.hass.areas[a]; const f = ar && ar.floor_id; return f ? [f, c.hass.floors[f] && c.hass.floors[f].name].filter(Boolean) : []; } },
    { id: 'label', needs: 'entities', get: (c) => { const e = entReg(c); const ids = (e && e.labels) || []; return ids.flatMap((l) => [l, c.hass.labels && c.hass.labels[l] && c.hass.labels[l].name].filter(Boolean)); } },
    { id: 'device', needs: 'devices', get: (c) => { const d = devReg(c); const e = entReg(c); return d ? [e.device_id, d.name_by_user, d.name].filter(Boolean) : []; } }
  ];
  const FIELD_BY_ID = Object.fromEntries(FIELDS.map((f) => [f.id, f]));

  function condMatches(cond, ctx) {
    const f = FIELD_BY_ID[cond.field];
    const o = OPERATOR_BY_ID[cond.operator];
    const exp = cond.value === undefined || cond.value === null ? '' : String(cond.value).trim();
    if (!f || !o || exp === '') return false; // ufærdig betingelse passer aldrig
    return o.test(f.get(ctx, cond), exp);
  }

  // Regler uden gyldige felter/sammenligninger eller uden betingelser ignoreres.
  function cleanRules(list) {
    if (!Array.isArray(list)) return [];
    const out = [];
    for (const r of list) {
      const conds = r && Array.isArray(r.conditions) ? r.conditions : [];
      if (!conds.length || !conds.every((c) => c && FIELD_BY_ID[c.field] && OPERATOR_BY_ID[c.operator])) continue;
      out.push(conds);
    }
    return out;
  }

  // Sortering følger kortets sprog (dansk eller engelsk), så æ, ø, å og ä, ö havner rigtigt.
  const collators = {};
  const collator = () => collators[LANG] || (collators[LANG] = new Intl.Collator(LANG, { numeric: true, sensitivity: 'base' }));
  // Skåner HA: filterets resultat vises højst så mange gange, medmindre 'Vis alle filterresultater' er slået til.
  const FILTER_LIMIT = 100;
  const BROAD_WARN = 200;

  // Sammenligner entiteter (id'er) efter navn, ID, tilstand eller sidst ændret. Manglende entiteter sorteres på id.
  function makeComparator(hass, by) {
    const st = (id) => hass.states[id];
    const name = (id) => (st(id) ? st(id).attributes.friendly_name || id : id);
    if (by === 'entity_id') return (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    if (by === 'state') return (a, b) => { const x = st(a) ? toNum(st(a).state) : null; const y = st(b) ? toNum(st(b).state) : null; return x !== null && y !== null ? x - y : collator().compare(String(st(a) ? st(a).state : ''), String(st(b) ? st(b).state : '')); };
    if (by === 'last_changed') return (a, b) => (st(a) && st(b) ? new Date(st(a).last_changed) - new Date(st(b).last_changed) : 0);
    return (a, b) => collator().compare(name(a), name(b));
  }

  // Holder styr på, hvilke entiteter der passer, og genberegner kun det, der er ændret.
  function createFilterEngine(filter) {
    const inc = cleanRules(filter && filter.include);
    if (!inc.length) return null;
    const exc = cleanRules(filter && filter.exclude);
    const ruleHit = (conds, ctx) => conds.every((c) => condMatches(c, ctx));
    const cache = new Map();
    let refs = null;
    let matched = [];
    let ver = 0;
    let memo = null;
    return {
      update(hass) {
        if (!hass || !hass.states) return false;
        let dirty = false;
        const r = [hass.entities, hass.devices, hass.areas, hass.floors, hass.labels];
        if (!refs || r.some((x, i) => x !== refs[i])) { cache.clear(); refs = r; dirty = true; }
        let seen = 0;
        for (const id in hass.states) {
          seen++;
          const so = hass.states[id];
          const c = cache.get(id);
          if (c && c.so === so) continue;
          const ctx = { id, so, hass };
          const m = inc.some((x) => ruleHit(x, ctx)) && !exc.some((x) => ruleHit(x, ctx));
          if (m || (c && c.m)) dirty = true;
          cache.set(id, { so, m });
        }
        if (cache.size !== seen) {
          for (const [id, c] of cache) if (!(id in hass.states)) { if (c.m) dirty = true; cache.delete(id); }
        }
        if (dirty) { matched = []; for (const [id, c] of cache) if (c.m) matched.push(id); ver++; }
        return dirty;
      },
      ids(hass, by, dir) {
        if (memo && memo.ver === ver && memo.by === by && memo.dir === dir) return memo.list;
        const cmp = makeComparator(hass, by);
        const list = matched.filter((id) => hass.states[id]).sort(cmp);
        if (dir === 'desc') list.reverse();
        memo = { ver, by, dir, list };
        return list;
      }
    };
  }

  // En betingelse er færdig, når feltet og sammenligningen findes, og der er en værdi.
  const condComplete = (c) => !!(c && FIELD_BY_ID[c.field] && OPERATOR_BY_ID[c.operator] && c.value !== undefined && c.value !== null && String(c.value).trim() !== '');

  // Farveregler: første regel hvis betingelser alle passer vinder. Ufærdige regler (uden værdi eller farve) ignoreres.
  const ANIMATIONS = ['pulse', 'pulse_size', 'blink', 'glow', 'spin'];
  // Varighed i sekunder pr. animation: [langsom, normal, hurtig]
  const ANIM_SECONDS = { pulse: [3, 1.8, 0.9], pulse_size: [3, 1.8, 0.9], blink: [2, 1.2, 0.6], glow: [3.2, 2, 1], spin: [4, 2, 1] };
  function createColorRules(list) {
    if (!Array.isArray(list) || !list.length) return null;
    const rules = [];
    for (const r of list) {
      const conds = r && Array.isArray(r.conditions) ? r.conditions : [];
      const anim = r && ANIMATIONS.includes(r.animation) ? r.animation : '';
      if (!r || (!r.color && !anim) || !conds.length) continue;
      if (!conds.every(condComplete)) continue;
      rules.push({ conds, color: r.color || '', affects: r.affects === 'icon' || r.affects === 'indicator' ? r.affects : 'all', animation: anim, speed: r.speed === 'slow' || r.speed === 'fast' ? r.speed : 'normal' });
    }
    if (!rules.length) return null;
    return (id, so, hass) => {
      const ctx = { id, so, hass };
      for (const r of rules) if (r.conds.every((c) => condMatches(c, ctx))) return { color: r.color, affects: r.affects, animation: r.animation, speed: r.speed };
      return null;
    };
  }

  // "Vis kun hvis": begrænser alle entiteter på kortet. Ufærdige regler ignoreres.
  function createRequireTest(filter) {
    const rules = cleanRules(filter && filter.only_if).filter((conds) => conds.every(condComplete));
    if (!rules.length) return null;
    return (id, so, hass) => { const ctx = { id, so, hass }; return rules.some((conds) => conds.every((c) => condMatches(c, ctx))); };
  }

  function buildItems(cfg, hass, eff, extraIds) {
    const limit = eff.filter_show_all ? 0 : FILTER_LIMIT;
    const extra = new Set(extraIds || []);
    let fCount = 0;
    let dropped = 0;
    const req = createRequireTest(cfg.filter);
    const manual = Array.isArray(cfg.entities) ? cfg.entities : [];
    const have = new Set(manual.map((r) => (typeof r === 'string' ? r : r && (r.entity || r.entity_id))).filter(Boolean));
    let raw = extraIds && extraIds.length ? manual.concat(extraIds.filter((id) => !have.has(id))) : manual;
    if (eff.sort_manual && hass && hass.states) {
      // Sortér entiteterne inden for hver sektion; filterets resultat kommer med i den sidste.
      const cmp = makeComparator(hass, eff.sort_by);
      const sign = eff.sort_dir === 'desc' ? -1 : 1;
      const entId = (r) => (typeof r === 'string' ? r : r && (r.entity || r.entity_id));
      const isMarker = (r) => r && typeof r === 'object' && !entId(r) && (r.type === 'section' || r.type === 'divider');
      const blocks = [[]];
      const heads = [null];
      for (const r of raw) {
        if (isMarker(r)) { blocks.push([]); heads.push(r); } else blocks[blocks.length - 1].push(r);
      }
      raw = [];
      blocks.forEach((blk, i) => {
        if (heads[i]) raw.push(heads[i]);
        blk.sort((a, b) => sign * cmp(entId(a) || '', entId(b) || ''));
        raw.push(...blk);
      });
    }
    const seen = new Map();
    const out = [];
    let pos = 0;
    let entityCount = 0;
    for (const r of raw) {
      const obj = typeof r === 'string' ? { entity: r } : r && typeof r === 'object' ? r : null;
      if (!obj) continue;
      const id = obj.entity || obj.entity_id;
      if (!id && (obj.type === 'section' || obj.type === 'divider')) {
        out.push({ kind: obj.type, key: '#' + pos++, obj });
        continue;
      }
      if (!id || typeof id !== 'string') continue;
      const stateObj = hass && hass.states ? hass.states[id] : undefined;
      const domain = id.split('.')[0];
      const state = stateObj ? stateObj.state : undefined;
      const unavailable = !!stateObj && (state === 'unavailable' || state === 'unknown');
      const missing = !stateObj;
      const active = isActive(domain, state);
      if (eff.only_active && !active) continue;
      if (req && stateObj && !req(id, stateObj, hass)) continue;
      if (eff.hide_unavailable && unavailable) continue;
      if (eff.max_items > 0 && entityCount >= eff.max_items) continue;
      if (limit > 0 && !have.has(id) && extra.has(id)) { if (fCount >= limit) { dropped++; continue; } fCount++; }
      const n = (seen.get(id) || 0) + 1;
      seen.set(id, n);
      entityCount += 1;
      out.push({ kind: 'entity', key: id + '#' + n, id, obj, stateObj, domain, state, active, unavailable, missing });
    }
    // Fjern sektioner og skillelinjer uden entiteter efter sig.
    const clean = [];
    for (let i = 0; i < out.length; i++) {
      if (out[i].kind === 'entity') { clean.push(out[i]); continue; }
      let j = i + 1;
      while (j < out.length && out[j].kind === 'divider') j++;
      if (j < out.length && out[j].kind === 'entity') clean.push(out[i]);
    }
    clean.limited = dropped ? { shown: fCount, total: fCount + dropped } : null;
    return clean;
  }

  /* ====================================================================
   * 4b. GRUPPERING
   * Deler de færdige elementer op i grupper med en overskrift. Rækkefølgen
   * inde i hver gruppe er den samme som uden gruppering.
   * ================================================================== */
  const DOMAIN_NAMES_DA = { light: 'Lys', switch: 'Kontakter', sensor: 'Sensorer', binary_sensor: 'Binære sensorer', climate: 'Klima', cover: 'Rullegardiner og porte', fan: 'Ventilatorer', lock: 'Låse', media_player: 'Medieafspillere', camera: 'Kameraer', person: 'Personer', device_tracker: 'Enhedssporing', automation: 'Automatiseringer', script: 'Scripts', scene: 'Scener', button: 'Knapper', number: 'Tal', select: 'Valg', input_boolean: 'Kontakter (input)', input_number: 'Tal (input)', input_select: 'Valg (input)', input_text: 'Tekst (input)', update: 'Opdateringer', weather: 'Vejr', sun: 'Sol', vacuum: 'Støvsugere', water_heater: 'Varmtvandsbeholdere', humidifier: 'Luftfugtere', alarm_control_panel: 'Alarmer', siren: 'Sirener', remote: 'Fjernbetjeninger', text: 'Tekst', zone: 'Zoner', timer: 'Timere', counter: 'Tællere', calendar: 'Kalendere' };
  const DOMAIN_NAMES_EN = { light: 'Lights', switch: 'Switches', sensor: 'Sensors', binary_sensor: 'Binary sensors', climate: 'Climate', cover: 'Covers', fan: 'Fans', lock: 'Locks', media_player: 'Media players', camera: 'Cameras', person: 'People', device_tracker: 'Device trackers', automation: 'Automations', script: 'Scripts', scene: 'Scenes', button: 'Buttons', number: 'Numbers', select: 'Selects', input_boolean: 'Toggles (input)', input_number: 'Numbers (input)', input_select: 'Selects (input)', input_text: 'Text (input)', update: 'Updates', weather: 'Weather', sun: 'Sun', vacuum: 'Vacuums', water_heater: 'Water heaters', humidifier: 'Humidifiers', alarm_control_panel: 'Alarms', siren: 'Sirens', remote: 'Remotes', text: 'Text', zone: 'Zones', timer: 'Timers', counter: 'Counters', calendar: 'Calendars' };
  const DOMAIN_NAMES = (k) => (LANG === 'da' ? DOMAIN_NAMES_DA : DOMAIN_NAMES_EN)[k];
  const CLASS_NAMES_DA = { battery: 'Batteri', battery_charging: 'Batteri oplader', temperature: 'Temperatur', humidity: 'Luftfugtighed', power: 'Effekt', energy: 'Energi', voltage: 'Spænding', current: 'Strøm', door: 'Døre', window: 'Vinduer', garage_door: 'Garageporte', motion: 'Bevægelse', occupancy: 'Tilstedeværelse', presence: 'Tilstedeværelse', moisture: 'Fugt', illuminance: 'Lysstyrke', pressure: 'Tryk', signal_strength: 'Signalstyrke', connectivity: 'Forbindelse', plug: 'Stik', smoke: 'Røg', gas: 'Gas', opening: 'Åbninger', lock: 'Låse', problem: 'Problemer', running: 'Kører', safety: 'Sikkerhed', tamper: 'Sabotage', vibration: 'Vibration', light: 'Lys', carbon_monoxide: 'Kulilte', carbon_dioxide: 'Kuldioxid', timestamp: 'Tidsstempel', duration: 'Varighed', speed: 'Hastighed', distance: 'Afstand', outlet: 'Stikkontakter', switch: 'Kontakter', tv: 'TV', speaker: 'Højttalere', receiver: 'Receivere', heat: 'Varme', cold: 'Kulde', update: 'Opdateringer' };
  const CLASS_NAMES_EN = { battery: 'Battery', battery_charging: 'Battery charging', temperature: 'Temperature', humidity: 'Humidity', power: 'Power', energy: 'Energy', voltage: 'Voltage', current: 'Current', door: 'Doors', window: 'Windows', garage_door: 'Garage doors', motion: 'Motion', occupancy: 'Occupancy', presence: 'Presence', moisture: 'Moisture', illuminance: 'Illuminance', pressure: 'Pressure', signal_strength: 'Signal strength', connectivity: 'Connectivity', plug: 'Plug', smoke: 'Smoke', gas: 'Gas', opening: 'Openings', lock: 'Locks', problem: 'Problems', running: 'Running', safety: 'Safety', tamper: 'Tamper', vibration: 'Vibration', light: 'Light', carbon_monoxide: 'Carbon monoxide', carbon_dioxide: 'Carbon dioxide', timestamp: 'Timestamp', duration: 'Duration', speed: 'Speed', distance: 'Distance', outlet: 'Outlets', switch: 'Switches', tv: 'TV', speaker: 'Speakers', receiver: 'Receivers', heat: 'Heat', cold: 'Cold', update: 'Updates' };
  const CLASS_NAMES = (k) => (LANG === 'da' ? CLASS_NAMES_DA : CLASS_NAMES_EN)[k];
  const prettify = (v) => { const t = String(v).replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); };
  const localized = (hass, key) => { try { const v = hass && typeof hass.localize === 'function' ? hass.localize(key) : ''; return v && v !== key ? String(v) : ''; } catch (e) { return ''; } };
  const GROUPERS = {
    area: (c) => { const a = areaIdOf(c); return a ? { key: a, label: (c.hass.areas && c.hass.areas[a] && c.hass.areas[a].name) || prettify(a) } : null; },
    device: (c) => { const d = devReg(c); const e = entReg(c); return d ? { key: e.device_id, label: d.name_by_user || d.name || e.device_id } : null; },
    device_class: (c) => {
      const dc = c.so && c.so.attributes && c.so.attributes.device_class;
      if (!dc) return null;
      return { key: String(dc), label: localized(c.hass, 'component.' + c.id.split('.')[0] + '.entity_component.' + dc + '.name') || CLASS_NAMES(dc) || prettify(dc) };
    },
    domain: (c) => { const d = c.id.split('.')[0]; return { key: d, label: localized(c.hass, 'component.' + d + '.entity_component._.name') || DOMAIN_NAMES(d) || prettify(d) }; },
    state: (c) => { const k = c.unavailable || c.missing ? 'unavailable' : c.active ? 'active' : 'inactive'; return { key: k, label: tr('group.state.' + k), order: ['active', 'inactive', 'unavailable'].indexOf(k) }; }
  };
  // Egne grupper: samme betingelser som filter og farveregler. Første gruppe, der passer, vinder.
  function createGroupRules(list) {
    if (!Array.isArray(list) || !list.length) return null;
    const rules = [];
    list.forEach((r, i) => {
      const conds = r && Array.isArray(r.conditions) ? r.conditions : [];
      if (!conds.length) return;
      if (!conds.every(condComplete)) return;
      rules.push({ index: i, conds, name: r.name ? String(r.name) : tr('group.default_name', { n: i + 1 }), color: r.color || '' });
    });
    if (!rules.length) return null;
    return (c) => {
      if (!c.so) return null;
      for (const r of rules) if (r.conds.every((cd) => condMatches(cd, c))) return { key: String(r.index), label: r.name, color: r.color, order: r.index };
      return null;
    };
  }
  const _grCache = new WeakMap();
  function createGroupRulesCached(list) {
    if (!Array.isArray(list) || !list.length) return null;
    if (!_grCache.has(list)) _grCache.set(list, createGroupRules(list));
    return _grCache.get(list);
  }
  function groupItems(items, eff, hass, folded, rules) {
    const mode = eff && eff.group_by;
    const fn = mode === 'custom' ? createGroupRulesCached(rules) : GROUPERS[mode];
    if (!fn || !hass) return items;
    const groups = new Map();
    const rest = [];
    for (const it of items) {
      if (it.kind !== 'entity') continue;       // egne sektioner og skillelinjer erstattes af grupperne
      const g = fn({ id: it.id, so: it.stateObj, hass, active: it.active, unavailable: it.unavailable, missing: it.missing });
      if (!g) { rest.push(it); continue; }
      let e = groups.get(g.key);
      if (!e) { e = { key: g.key, label: g.label, order: g.order, color: g.color, items: [] }; groups.set(g.key, e); }
      e.items.push(it);
    }
    const list = [...groups.values()];
    if (mode === 'state' || mode === 'custom') list.sort((a, b) => a.order - b.order);
    else list.sort((a, b) => collator().compare(a.label, b.label));
    if (rest.length && !(mode === 'custom' && eff.group_rest_show === false)) list.push({ key: '__rest', label: (mode === 'custom' && eff.group_rest_label) || tr('group.none_' + mode), items: rest });
    const fold = eff.group_collapsible !== false;
    const out = [];
    for (const g of list) {
      const gkey = mode + ':' + g.key;
      const collapsed = fold && !!folded && folded.has(gkey);
      out.push({ kind: 'group', key: '#g:' + gkey, gkey, label: g.label, count: g.items.length, collapsed, foldable: fold, size: eff.group_size || 'm', color: g.color || eff.group_color || '', style: eff.group_style || 'plain', align: eff.group_align || 'left', showCount: eff.group_count !== false });
      if (!collapsed) out.push(...g.items);
    }
    out.limited = items.limited;
    return out;
  }

  /* ====================================================================
   * 5. LAYOUTS
   * Hvert layout er en lille funktion i et register. Et nyt layout er
   * én ny post, uden ændringer i resten.
   * ================================================================== */
  function makeIcon(hass, item) {
    const wrap = el('div', 'icon');
    const custom = item.obj.icon;
    let node;
    if (custom) {
      node = document.createElement('ha-icon');
      node.setAttribute('icon', custom);
    } else if (item.stateObj && customElements.get('ha-state-icon')) {
      node = document.createElement('ha-state-icon');
      node.hass = hass;
      node.stateObj = item.stateObj;
    } else {
      node = document.createElement('ha-icon');
      node.setAttribute('icon', (item.stateObj && item.stateObj.attributes && item.stateObj.attributes.icon) || 'mdi:help-circle-outline');
    }
    wrap.appendChild(node);
    return wrap;
  }

  function secondaryNode(hass, item, S) {
    if (item.kind !== 'entity') return null;
    if (item.missing) return S('secondary_info').length ? document.createTextNode(tr('card.not_found')) : null;
    const parts = secondaryParts(hass, item, S);
    return parts ? joinParts(parts) : null;
  }

  function joinParts(parts) {
    if (parts.length === 1) return parts[0];
    const frag = document.createDocumentFragment();
    parts.forEach((n, i) => { if (i) frag.appendChild(document.createTextNode(' · ')); frag.appendChild(n); });
    return frag;
  }

  // Del den sekundære information: første del (til 'Stor værdi') og resten.
  function secondaryParts(hass, item, S) {
    if (item.kind !== 'entity' || item.missing) return null;
    const kinds = normMulti(SETTING_BY_KEY.secondary_info, S('secondary_info'), 'tiles');
    const parts = kinds.map((k) => secondaryPart(hass, item, S, k)).filter(Boolean);
    return parts.length ? parts : null;
  }

  const HVAC_ACTIONS_DA = { heating: 'Varmer', cooling: 'Køler', drying: 'Affugter', idle: 'Inaktiv', fan: 'Ventilerer', defrosting: 'Afrimer', preheating: 'Forvarmer', off: 'Fra' };
  const HVAC_ACTIONS_EN = { heating: 'Heating', cooling: 'Cooling', drying: 'Drying', idle: 'Idle', fan: 'Fan', defrosting: 'Defrosting', preheating: 'Preheating', off: 'Off' };
  const HVAC_ACTIONS = (k) => (LANG === 'da' ? HVAC_ACTIONS_DA : HVAC_ACTIONS_EN)[k];
  const DEVICE_SENSOR_CLASSES = { dev_signal: 'signal_strength', dev_power: 'power', dev_energy: 'energy', dev_temperature: 'temperature', dev_humidity: 'humidity' };
  const devSensorIdx = new WeakMap();
  // Enhedens sensorer (samme device_id), fx signal og strøm. Diagnostiske sensorer tæller med; skjulte gør ikke.
  function deviceSensorList(hass, dev) {
    const reg = hass.entities;
    if (!reg) return [];
    let idx = devSensorIdx.get(reg);
    if (!idx) {
      idx = new Map();
      for (const eid in reg) {
        const e = reg[eid];
        if (!e || !e.device_id || e.hidden || eid.indexOf('sensor.') !== 0) continue;
        if (!idx.has(e.device_id)) idx.set(e.device_id, []);
        idx.get(e.device_id).push(eid);
      }
      devSensorIdx.set(reg, idx);
    }
    return idx.get(dev) || [];
  }
  function deviceSensor(hass, id, cls) {
    const reg = hass && hass.entities && hass.entities[id];
    if (!reg || !reg.device_id || !hass.states) return null;
    for (const eid of deviceSensorList(hass, reg.device_id)) {
      if (eid === id) continue;
      const so = hass.states[eid];
      if (so && so.attributes.device_class === cls && so.state !== 'unavailable' && so.state !== 'unknown') return so;
    }
    return null;
  }

  function secondaryPart(hass, item, S, kind) {
    const so = item.stateObj;
    let text = '';
    switch (kind) {
      case 'state':
        text = fmtState(hass, item);
        break;
      case 'last_changed': {
        if (customElements.get('ha-relative-time')) {
          const rt = document.createElement('ha-relative-time');
          rt.hass = hass;
          rt.datetime = so.last_changed;
          return rt;
        }
        text = new Date(so.last_changed).toLocaleString();
        break;
      }
      case 'attribute': {
        const a = S('secondary_attribute');
        if (!a || so.attributes[a] === undefined) return null;
        text = hass && typeof hass.formatEntityAttributeValue === 'function' ? hass.formatEntityAttributeValue(so, a) : String(so.attributes[a]);
        break;
      }
      case 'brightness': {
        const b = so.attributes.brightness;
        if (item.domain !== 'light' || typeof b !== 'number' || !item.active) return null;
        text = Math.round((b / 255) * 100) + ' %';
        break;
      }
      case 'kelvin': {
        // Farvetemperatur for tændte lys. Viser lyset en farve, vises nuancen i stedet (Kelvin findes ikke i farvetilstand).
        const a = so.attributes;
        if (item.domain !== 'light' || !item.active) return null;
        if (a.color_mode && a.color_mode !== 'color_temp') {
          if (!COLOR_MODES.includes(a.color_mode) || !Array.isArray(a.hs_color) || typeof a.hs_color[0] !== 'number') return null;
          text = tr('card.color_hue', { h: Math.round(a.hs_color[0]) });
          break;
        }
        let k = typeof a.color_temp_kelvin === 'number' ? a.color_temp_kelvin : typeof a.color_temp === 'number' && a.color_temp > 0 ? 1000000 / a.color_temp : null;
        if (k === null || !Number.isFinite(k)) return null;
        text = Math.round(k) + ' K';
        break;
      }
      case 'media_title': {
        if (item.domain !== 'media_player') return null;
        const a = so.attributes;
        if (!a.media_title || so.state === 'off' || so.state === 'unavailable') return null;
        text = a.media_artist ? a.media_artist + ' – ' + a.media_title : String(a.media_title);
        break;
      }
      case 'cover_position':
      case 'cover_tilt': {
        const v = toInt(so.attributes[kind === 'cover_position' ? 'current_position' : 'current_tilt_position']);
        if (item.domain !== 'cover' || v === null) return null;
        text = v + ' %';
        break;
      }
      case 'fan_speed': {
        const v = toInt(so.attributes.percentage);
        if (item.domain !== 'fan' || so.state !== 'on' || v === null) return null;
        text = v + ' %';
        break;
      }
      case 'media_volume': {
        const v = so.attributes.volume_level;
        if (item.domain !== 'media_player' || so.state === 'off' || so.state === 'unavailable' || typeof v !== 'number') return null;
        text = Math.round(v * 100) + ' %';
        break;
      }
      case 'climate_temps': {
        if (item.domain !== 'climate') return null;
        const cur = toNumOrNull(so.attributes.current_temperature);
        const tgt = toNumOrNull(so.attributes.temperature);
        const f = (n) => n.toLocaleString((hass && hass.language) || 'en', { maximumFractionDigits: 1 }) + '°';
        if (cur !== null && tgt !== null && so.state !== 'off') text = f(cur) + ' → ' + f(tgt);
        else if (cur !== null) text = f(cur);
        else return null;
        break;
      }
      case 'climate_action': {
        const a = so.attributes.hvac_action;
        if (item.domain !== 'climate' || !a) return null;
        text = HVAC_ACTIONS(a) || String(a);
        break;
      }
      case 'vacuum_fan': {
        const v = so.attributes.fan_speed;
        if (item.domain !== 'vacuum' || !v || so.state === 'unavailable') return null;
        text = String(v);
        break;
      }
      case 'dev_signal':
      case 'dev_power':
      case 'dev_energy':
      case 'dev_temperature':
      case 'dev_humidity': {
        const d = deviceSensor(hass, item.id, DEVICE_SENSOR_CLASSES[kind]);
        if (!d) return null;
        text = hass && typeof hass.formatEntityState === 'function' ? hass.formatEntityState(d) : d.state + (d.attributes.unit_of_measurement ? ' ' + d.attributes.unit_of_measurement : '');
        break;
      }
      case 'battery': {
        const lvl = so.attributes.battery_level;
        if (typeof lvl === 'number') text = Math.round(lvl) + ' %';
        else if (so.attributes.device_class === 'battery' && !isNaN(Number(so.state))) text = Math.round(Number(so.state)) + ' %';
        else return null;
        break;
      }
      default:
        return null;
    }
    return text ? document.createTextNode(text) : null;
  }

  function makeSwitch(hass, item, run) {
    const sw = el('div', 'sw' + (item.active ? ' on' : ''));
    sw.setAttribute('role', 'switch');
    sw.setAttribute('aria-checked', item.active ? 'true' : 'false');
    sw.appendChild(el('div', 'knob'));
    // Kontakten må ikke udløse elementets egen tryk-handling.
    sw.addEventListener('pointerdown', (e) => e.stopPropagation());
    sw.addEventListener('pointerup', (e) => e.stopPropagation());
    sw.addEventListener('click', (e) => { e.stopPropagation(); run({ action: 'toggle' }); });
    return sw;
  }

  // Om en boble-tekst mest består af lave bogstaver (x-højde: a c e m n o r s u v w x z æ å ø; mindst 30 %).
  // Sådan tekst afgrænses efter x-højden i stedet for versalhøjden, så den står midt i boblen.
  // Tal, store bogstaver og høje tegn (T i l f t d …) afgrænses efter versalhøjden.
  function lowBody(t) {
    const letters = t.replace(/[^A-Za-zÆØÅæøåäöüéè]/g, '');
    if (!letters) return false;
    const low = (letters.match(/[acemnorsuvwxzæåøäöüéè]/g) || []).length;
    return low / letters.length >= 0.3;
  }

  // Statusindikatorer fungerer ens på alle layouts.
  function addIndicator(host, iconEl, kind, pos, item, hass, layout, full) {
    const p = 'pos-' + pos.replace('_', '-');
    switch (kind) {
      // Chips: prik og bjælke forankres til ikonet, så de aldrig skæres af chippens runde ender eller rører teksten
      case 'dot': (layout === 'chips' && iconEl ? iconEl : host).appendChild(el('span', 'ind dot ' + p)); break;
      case 'corner_badge': host.appendChild(el('span', 'ind corner ' + p)); break;
      case 'stripe': host.appendChild(el('span', 'ind stripe')); break;
      case 'ring': if (iconEl) iconEl.classList.add('ring'); break;
      case 'bubble': {
        const t = full && layout !== 'chips' ? fmtState(hass, item).trim() : fmtState(hass, item).replace(/\s+/g, '');
        const short = !!full && t.length > 0; // kun indstillingen afgør, om boblen er tekst eller prik – ikke tekstens længde
        const b = el('span', 'ind bubble ' + p + (short ? '' : ' empty') + (short && t.length > 4 ? ' wide' : '') + (short && lowBody(t) ? ' lc' : ''), '');
        if (short) b.appendChild(el('span', 'bt', t));
        if (iconEl) iconEl.appendChild(b); else { b.classList.add('free'); host.appendChild(b); }
        break;
      }
      default: break;
    }
  }

  /* ====================================================================
   * 5a. KNAPPER OG STYRINGER
   * Indbyggede styringer (lys: lysstyrke, Kelvin, farve) og egne knapper
   * med vilkårlig handling. Styringer foldes ud inde i elementet.
   * ================================================================== */
  const COLOR_MODES = ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'];
  function lightCaps(so) {
    const m = so && so.attributes && so.attributes.supported_color_modes;
    if (!Array.isArray(m)) return { brightness: false, kelvin: false, color: false };
    return { brightness: m.some((x) => x !== 'onoff' && x !== 'unknown'), kelvin: m.includes('color_temp'), color: m.some((x) => COLOR_MODES.includes(x)) };
  }

  // Register over styringer. Hver styring kender sin entitetstype, hvad entiteten skal kunne, og hvad den gør.
  //   kind 'action' : knap, der udfører en handling med det samme (call → [domæne, service, data])
  //   kind 'slider' : skyder i et panel (slider → min/max/step/value/format, send)
  //   kind 'select' : liste i et panel (options → valgmuligheder, send)
  // Lysets tre styringer (lysstyrke, Kelvin, farve) bygges stadig af buildPanel.
  const featOf = (so) => Number(so.attributes.supported_features) || 0;
  const usable = (so) => so.state !== 'unavailable' && so.state !== 'unknown';
  const toInt = (v) => (v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Math.round(Number(v)) : null);
  const toNumOrNull = (v) => (v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);
  const isLockedState = (so) => so.state === 'locked' || so.state === 'locking';
  const HVAC_LABELS_DA = { off: 'Fra', heat: 'Varme', cool: 'Køl', heat_cool: 'Varme/køl', auto: 'Auto', dry: 'Affugt', fan_only: 'Kun ventilator' };
  const HVAC_LABELS_EN = { off: 'Off', heat: 'Heat', cool: 'Cool', heat_cool: 'Heat/cool', auto: 'Auto', dry: 'Dry', fan_only: 'Fan only' };
  const HVAC_LABELS = (k) => (LANG === 'da' ? HVAC_LABELS_DA : HVAC_LABELS_EN)[k];
  const CONTROLS = [
    { id: 'brightness', domain: ['light'], kind: 'slider', icon: 'mdi:brightness-6', avail: (so, it) => it.active && lightCaps(so).brightness },
    { id: 'kelvin', domain: ['light'], kind: 'slider', icon: 'mdi:thermometer', avail: (so, it) => it.active && lightCaps(so).kelvin },
    { id: 'color', domain: ['light'], kind: 'slider', icon: 'mdi:palette', avail: (so, it) => it.active && lightCaps(so).color },
    // Cover (rullegardin, port m.m.). Funktionsbits: 1 åbn, 2 luk, 4 position, 8 stop, 128 vinkelposition.
    { id: 'cover_open', domain: ['cover'], kind: 'action', icon: 'mdi:arrow-up', avail: (so) => usable(so) && (featOf(so) & 1) > 0, off: (so) => so.state === 'open' && toInt(so.attributes.current_position) !== 0 && (toInt(so.attributes.current_position) === null || toInt(so.attributes.current_position) >= 100), call: (so, it) => ['cover', 'open_cover', { entity_id: it.id }] },
    { id: 'cover_stop', domain: ['cover'], kind: 'action', icon: 'mdi:stop', avail: (so) => usable(so) && (featOf(so) & 8) > 0, on: (so) => so.state === 'opening' || so.state === 'closing', call: (so, it) => ['cover', 'stop_cover', { entity_id: it.id }] },
    { id: 'cover_close', domain: ['cover'], kind: 'action', icon: 'mdi:arrow-down', avail: (so) => usable(so) && (featOf(so) & 2) > 0, off: (so) => so.state === 'closed', call: (so, it) => ['cover', 'close_cover', { entity_id: it.id }] },
    { id: 'cover_position', domain: ['cover'], kind: 'slider', icon: 'mdi:arrow-up-down', avail: (so) => usable(so) && (featOf(so) & 4) > 0,
      slider: (so) => ({ min: 0, max: 100, step: 1, value: toInt(so.attributes.current_position) === null ? 0 : toInt(so.attributes.current_position), format: (v) => v + ' %' }),
      send: (hass, it, v) => hass.callService('cover', 'set_cover_position', { entity_id: it.id, position: v }) },
    { id: 'cover_tilt', domain: ['cover'], kind: 'slider', icon: 'mdi:rotate-right', avail: (so) => usable(so) && (featOf(so) & 128) > 0,
      slider: (so) => ({ min: 0, max: 100, step: 1, value: toInt(so.attributes.current_tilt_position) === null ? 0 : toInt(so.attributes.current_tilt_position), format: (v) => v + ' %' }),
      send: (hass, it, v) => hass.callService('cover', 'set_cover_tilt_position', { entity_id: it.id, tilt_position: v }) },
    // Blæser. Funktionsbits: 1 hastighed, 2 oscillation, 4 retning.
    { id: 'fan_toggle', domain: ['fan'], kind: 'action', icon: 'mdi:power', avail: (so) => usable(so), on: (so) => so.state === 'on', call: (so, it) => ['fan', 'toggle', { entity_id: it.id }] },
    { id: 'fan_speed', domain: ['fan'], kind: 'slider', icon: 'mdi:fan', avail: (so) => so.state === 'on' && (featOf(so) & 1) > 0,
      slider: (so) => { const st = toNumOrNull(so.attributes.percentage_step); return { min: 0, max: 100, step: st && st >= 1 ? st : 1, value: toInt(so.attributes.percentage) === null ? 0 : toInt(so.attributes.percentage), format: (v) => v + ' %' }; },
      send: (hass, it, v) => hass.callService('fan', 'set_percentage', { entity_id: it.id, percentage: v }) },
    { id: 'fan_oscillate', domain: ['fan'], kind: 'action', icon: 'mdi:rotate-3d-variant', avail: (so) => usable(so) && (featOf(so) & 2) > 0, on: (so) => so.attributes.oscillating === true, call: (so, it) => ['fan', 'oscillate', { entity_id: it.id, oscillating: so.attributes.oscillating !== true }] },
    { id: 'fan_direction', domain: ['fan'], kind: 'action', icon: (so) => (so.attributes.direction === 'reverse' ? 'mdi:rotate-left' : 'mdi:rotate-right'), avail: (so) => usable(so) && (featOf(so) & 4) > 0, call: (so, it) => ['fan', 'set_direction', { entity_id: it.id, direction: so.attributes.direction === 'reverse' ? 'forward' : 'reverse' }] },
    // Afspiller (simpel). Funktionsbits: 1 pause, 4 lydstyrke, 8 lyd fra, 16 forrige, 32 næste, 16384 afspil.
    { id: 'media_prev', domain: ['media_player'], kind: 'action', icon: 'mdi:skip-previous', avail: (so) => usable(so) && so.state !== 'off' && (featOf(so) & 16) > 0, call: (so, it) => ['media_player', 'media_previous_track', { entity_id: it.id }] },
    { id: 'media_play_pause', domain: ['media_player'], kind: 'action', icon: (so) => (so.state === 'playing' ? 'mdi:pause' : 'mdi:play'), avail: (so) => usable(so) && so.state !== 'off' && (featOf(so) & (1 | 16384)) > 0, on: (so) => so.state === 'playing', call: (so, it) => ['media_player', 'media_play_pause', { entity_id: it.id }] },
    { id: 'media_next', domain: ['media_player'], kind: 'action', icon: 'mdi:skip-next', avail: (so) => usable(so) && so.state !== 'off' && (featOf(so) & 32) > 0, call: (so, it) => ['media_player', 'media_next_track', { entity_id: it.id }] },
    { id: 'media_mute', domain: ['media_player'], kind: 'action', icon: (so) => (so.attributes.is_volume_muted ? 'mdi:volume-off' : 'mdi:volume-high'), avail: (so) => usable(so) && so.state !== 'off' && (featOf(so) & 8) > 0, on: (so) => so.attributes.is_volume_muted === true, call: (so, it) => ['media_player', 'volume_mute', { entity_id: it.id, is_volume_muted: so.attributes.is_volume_muted !== true }] },
    { id: 'media_volume', domain: ['media_player'], kind: 'slider', icon: 'mdi:volume-medium', avail: (so) => usable(so) && so.state !== 'off' && (featOf(so) & 4) > 0,
      slider: (so) => ({ min: 0, max: 100, step: 1, value: toNumOrNull(so.attributes.volume_level) === null ? 0 : Math.round(toNumOrNull(so.attributes.volume_level) * 100), format: (v) => v + ' %' }),
      send: (hass, it, v) => hass.callService('media_player', 'volume_set', { entity_id: it.id, volume_level: v / 100 }) },
    // Lås. At låse op kræver et ekstra tryk, så man ikke kommer til det ved et uheld.
    { id: 'lock_toggle', domain: ['lock'], kind: 'action', confirm: (so) => isLockedState(so), icon: (so) => (isLockedState(so) ? 'mdi:lock' : 'mdi:lock-open-variant'), avail: (so) => usable(so), on: (so) => isLockedState(so), call: (so, it) => ['lock', isLockedState(so) ? 'unlock' : 'lock', { entity_id: it.id }] },
    // Climate. Funktionsbits: 1 måltemperatur, 8 ventilator, 16 forudindstilling.
    { id: 'climate_target', domain: ['climate'], kind: 'slider', icon: 'mdi:thermometer', avail: (so) => usable(so) && (featOf(so) & 1) > 0 && toNumOrNull(so.attributes.temperature) !== null,
      slider: (so) => { const a = so.attributes; const st = toNumOrNull(a.target_temp_step); return { min: toNumOrNull(a.min_temp) === null ? 7 : toNumOrNull(a.min_temp), max: toNumOrNull(a.max_temp) === null ? 35 : toNumOrNull(a.max_temp), step: st && st > 0 ? st : 0.5, value: toNumOrNull(a.temperature), format: (v) => v + '°' }; },
      send: (hass, it, v) => hass.callService('climate', 'set_temperature', { entity_id: it.id, temperature: v }) },
    { id: 'climate_mode', domain: ['climate'], kind: 'select', icon: 'mdi:hvac', avail: (so) => usable(so) && Array.isArray(so.attributes.hvac_modes) && so.attributes.hvac_modes.length > 0,
      options: (so) => so.attributes.hvac_modes, current: (so) => so.state, label: (v) => HVAC_LABELS(v) || String(v),
      send: (hass, it, v) => hass.callService('climate', 'set_hvac_mode', { entity_id: it.id, hvac_mode: v }) },
    { id: 'climate_preset', domain: ['climate'], kind: 'select', icon: 'mdi:home-thermometer-outline', avail: (so) => usable(so) && (featOf(so) & 16) > 0 && Array.isArray(so.attributes.preset_modes) && so.attributes.preset_modes.length > 0,
      options: (so) => so.attributes.preset_modes, current: (so) => so.attributes.preset_mode,
      send: (hass, it, v) => hass.callService('climate', 'set_preset_mode', { entity_id: it.id, preset_mode: v }) },
    { id: 'climate_fan', domain: ['climate'], kind: 'select', icon: 'mdi:fan', avail: (so) => usable(so) && (featOf(so) & 8) > 0 && Array.isArray(so.attributes.fan_modes) && so.attributes.fan_modes.length > 0,
      options: (so) => so.attributes.fan_modes, current: (so) => so.attributes.fan_mode,
      send: (hass, it, v) => hass.callService('climate', 'set_fan_mode', { entity_id: it.id, fan_mode: v }) },
    // Støvsuger. Funktionsbits: 4 pause, 8 stop, 16 hjem, 32 sugestyrke, 512 find mig, 8192 start.
    { id: 'vacuum_start_pause', domain: ['vacuum'], kind: 'action', icon: (so) => (so.state === 'cleaning' ? 'mdi:pause' : 'mdi:play'), avail: (so) => usable(so) && (featOf(so) & (4 | 8192)) > 0, on: (so) => so.state === 'cleaning',
      call: (so, it) => ['vacuum', so.state === 'cleaning' && (featOf(so) & 4) ? 'pause' : (featOf(so) & 8192) ? 'start' : 'start_pause', { entity_id: it.id }] },
    { id: 'vacuum_stop', domain: ['vacuum'], kind: 'action', icon: 'mdi:stop', avail: (so) => usable(so) && (featOf(so) & 8) > 0, call: (so, it) => ['vacuum', 'stop', { entity_id: it.id }] },
    { id: 'vacuum_return', domain: ['vacuum'], kind: 'action', icon: 'mdi:home-import-outline', avail: (so) => usable(so) && (featOf(so) & 16) > 0, on: (so) => so.state === 'returning', call: (so, it) => ['vacuum', 'return_to_base', { entity_id: it.id }] },
    { id: 'vacuum_locate', domain: ['vacuum'], kind: 'action', icon: 'mdi:map-marker-radius', avail: (so) => usable(so) && (featOf(so) & 512) > 0, call: (so, it) => ['vacuum', 'locate', { entity_id: it.id }] },
    { id: 'vacuum_fan_speed', domain: ['vacuum'], kind: 'select', icon: 'mdi:fan', avail: (so) => usable(so) && (featOf(so) & 32) > 0 && Array.isArray(so.attributes.fan_speed_list) && so.attributes.fan_speed_list.length > 0,
      options: (so) => so.attributes.fan_speed_list, current: (so) => so.attributes.fan_speed,
      send: (hass, it, v) => hass.callService('vacuum', 'set_fan_speed', { entity_id: it.id, fan_speed: v }) },
    { id: 'vacuum_clean_area', domain: ['vacuum'], kind: 'areas', icon: 'mdi:floor-plan', avail: (so) => usable(so) && (featOf(so) & 16384) > 0 },
    // Tal og valgliste (number/input_number, select/input_select).
    { id: 'number_slider', domain: ['number', 'input_number'], kind: 'slider', icon: 'mdi:tune-variant', avail: (so) => usable(so) && toNumOrNull(so.state) !== null && toNumOrNull(so.attributes.min) !== null && toNumOrNull(so.attributes.max) !== null,
      slider: (so) => { const a = so.attributes; const u = a.unit_of_measurement ? ' ' + a.unit_of_measurement : ''; const st = toNumOrNull(a.step); return { min: toNumOrNull(a.min), max: toNumOrNull(a.max), step: st && st > 0 ? st : 1, value: toNumOrNull(so.state), format: (v) => v + u }; },
      send: (hass, it, v) => hass.callService(it.domain, 'set_value', { entity_id: it.id, value: v }) },
    { id: 'select_option', domain: ['select', 'input_select'], kind: 'select', icon: 'mdi:format-list-bulleted', avail: (so) => usable(so) && Array.isArray(so.attributes.options) && so.attributes.options.length > 0,
      send: (hass, it, v) => hass.callService(it.domain, 'select_option', { entity_id: it.id, option: v }) }
  ];
  const CONTROL_BY_ID = {};
  for (const c of CONTROLS) CONTROL_BY_ID[c.id] = c;
  const CONTROL_GROUPS = [
    { id: 'light', domains: ['light'], icon: 'mdi:lightbulb' },
    { id: 'cover', domains: ['cover'], icon: 'mdi:window-shutter' },
    { id: 'fan', domains: ['fan'], icon: 'mdi:fan' },
    { id: 'media_player', domains: ['media_player'], icon: 'mdi:speaker' },
    { id: 'lock', domains: ['lock'], icon: 'mdi:lock' },
    { id: 'climate', domains: ['climate'], icon: 'mdi:thermostat' },
    { id: 'vacuum', domains: ['vacuum'], icon: 'mdi:robot-vacuum' },
    { id: 'values', domains: ['number', 'input_number', 'select', 'input_select'], icon: 'mdi:tune-variant' }
  ];
  for (const g of CONTROL_GROUPS) g.options = CONTROLS.filter((c) => c.domain.some((d) => g.domains.includes(d))).map((c) => c.id);
  // Sekundære oplysninger grupperet på samme måde. 'always' vises altid; 'device' regnes som til stede, hvis et element i kortet har en sensor af den slags hos samme enhed.
  const INFO_GROUPS = [
    { id: 'general', label: 'ui.infog_general', icon: 'mdi:information-outline', always: true, domains: [], options: ['state', 'battery', 'last_changed', 'attribute'] },
    { id: 'light', label: 'ui.ctlg_light', icon: 'mdi:lightbulb', domains: ['light'], options: ['brightness', 'kelvin'] },
    { id: 'cover', label: 'ui.ctlg_cover', icon: 'mdi:window-shutter', domains: ['cover'], options: ['cover_position', 'cover_tilt'] },
    { id: 'fan', label: 'ui.ctlg_fan', icon: 'mdi:fan', domains: ['fan'], options: ['fan_speed'] },
    { id: 'media_player', label: 'ui.ctlg_media_player', icon: 'mdi:speaker', domains: ['media_player'], options: ['media_title', 'media_volume'] },
    { id: 'climate', label: 'ui.ctlg_climate', icon: 'mdi:thermostat', domains: ['climate'], options: ['climate_temps', 'climate_action'] },
    { id: 'vacuum', label: 'ui.ctlg_vacuum', icon: 'mdi:robot-vacuum', domains: ['vacuum'], options: ['vacuum_fan'] },
    { id: 'device', label: 'ui.infog_device', icon: 'mdi:chip', domains: [], device: ['dev_signal', 'dev_power', 'dev_energy', 'dev_temperature', 'dev_humidity'], options: ['dev_signal', 'dev_power', 'dev_energy', 'dev_temperature', 'dev_humidity'] }
  ];

  // Enhedens egne valglister, tal og knapper (select/number/button fra samme enhed), fx blæserens svingning eller en afspillers favorit-knap. Højst fire pr. element.
  // Knapper til genstart/opdatering og knapper, HA har markeret som indstilling (config) eller diagnostik, vises ikke.
  const DEVICE_CONTROL_MAX = 4;
  const DEVICE_BUTTON_DEF = { kind: 'action', icon: 'mdi:gesture-tap-button' };
  function deviceControls(hass, item, order) {
    const reg = hass && hass.entities && hass.entities[item.id];
    const dev = reg && reg.device_id;
    if (!dev) return [];
    const out = [];
    for (const eid in hass.entities) {
      const e = hass.entities[eid];
      if (eid === item.id || !e || e.device_id !== dev || e.hidden || e.entity_category === 'diagnostic') continue;
      const so = hass.states[eid];
      if (!so) continue;
      const dom = eid.split('.')[0];
      if (dom === 'button') {
        const dc = so.attributes.device_class;
        if (e.entity_category === 'config' || dc === 'restart' || dc === 'update') continue;
        out.push({ id: 'dev:' + eid, eid, dom, so, def: DEVICE_BUTTON_DEF });
        continue;
      }
      const def = dom === 'number' ? CONTROL_BY_ID.number_slider : dom === 'select' ? CONTROL_BY_ID.select_option : null;
      if (def && def.avail(so)) out.push({ id: 'dev:' + eid, eid, dom, so, def });
    }
    const nm = (d) => d.so.attributes.friendly_name || d.eid;
    const first = order === 'values' ? 'values' : 'buttons';
    const rank = (d) => ((d.dom === 'button') === (first === 'buttons') ? 0 : 1);
    out.sort((a, b) => rank(a) - rank(b) || collator().compare(nm(a), nm(b)));
    return out.slice(0, DEVICE_CONTROL_MAX);
  }
  // Ikon til en knap for enhedens eget valg/tal: entitetens egne ikon først (egenskab eller valgt i HA), ellers HA's eget opslag
  // (ha-state-icon: ikonoversættelser, enhedsklasse). Uden ha-state-icon bruges typens standardikon.
  function deviceControlIcon(hass, d) {
    const reg = hass && hass.entities && hass.entities[d.eid];
    const own = d.so.attributes.icon || (reg && reg.icon);
    if (own || !customElements.get('ha-state-icon')) {
      const ic = document.createElement('ha-icon');
      ic.setAttribute('icon', own || d.def.icon);
      return ic;
    }
    const si = document.createElement('ha-state-icon');
    si.hass = hass;
    si.stateObj = d.so;
    return si;
  }
  // Navnet uden elementets eget navn foran (fx 'Whisper Flex Horizontal Swing' → 'Horizontal Swing').
  function deviceControlName(d, item) {
    const full = d.so.attributes.friendly_name || d.eid;
    const own = item.stateObj && item.stateObj.attributes.friendly_name;
    return own && full.length > own.length && full.indexOf(own) === 0 ? full.slice(own.length).trim() : full;
  }
  // Egen knap, der viser en entitets styring (select, input_select, number, input_number).
  const OWN_ENTITY_DOMAINS = ['select', 'input_select', 'number', 'input_number'];
  function ownEntityOf(cb) {
    const e = cb && typeof cb === 'object' && typeof cb.entity === 'string' ? cb.entity.trim() : '';
    return e && OWN_ENTITY_DOMAINS.includes(e.split('.')[0]) ? e : '';
  }
  // Elementets egne knapper: elementets egen liste, ellers kortets.
  function ownButtonList(ctx, item) {
    return (Array.isArray(item.obj.buttons) ? item.obj.buttons : Array.isArray(ctx.buttons) ? ctx.buttons : []).filter((b) => b && typeof b === 'object');
  }
  const controlIcon = (def, so) => (typeof def.icon === 'function' ? def.icon(so) : def.icon);

  // Sender højst hvert 'ms' millisekund, men altid den sidste værdi.
  function makeThrottle(fn, ms) {
    let timer = null;
    let pending;
    let has = false;
    let last = 0;
    const call = (v) => { last = Date.now(); has = false; fn(v); };
    const t = (v) => {
      const wait = ms - (Date.now() - last);
      if (wait <= 0) { clearTimeout(timer); timer = null; call(v); return; }
      pending = v; has = true;
      if (!timer) timer = setTimeout(() => { timer = null; if (has) call(pending); }, wait);
    };
    t.cancel = () => { clearTimeout(timer); timer = null; has = false; };
    return t;
  }

  // Bred skyder i fuld højde (som i en fyldt bjælke) med tynd streg som håndtag og værdien på bjælken.
  function makeSlider(o) {
    const row = el('div', 'sl');
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(o.min); input.max = String(o.max); input.step = String(o.step || 1); input.value = String(o.value);
    if (o.gradient) row.style.setProperty('--g', o.gradient);
    input.setAttribute('aria-label', o.label || '');
    const val = el('span', 'val', o.format(Number(o.value)));
    let sent = Number(o.value);
    const th = makeThrottle((v) => { sent = v; o.onSend(v); }, 120);
    input.addEventListener('pointerdown', () => o.onBusy(true));
    input.addEventListener('pointerup', () => setTimeout(() => o.onBusy(false), 300));
    input.addEventListener('input', () => {
      const v = Number(input.value);
      val.textContent = o.format(v);
      o.onBusy(true);
      if (o.onLive) o.onLive(v);
      th(v);
    });
    input.addEventListener('change', () => {
      th.cancel();
      const v = Number(input.value);
      if (v !== sent) { sent = v; o.onSend(v); }
      o.onBusy(false);
    });
    row.append(input, val);
    return { row, input };
  }

  // Koblede områder for en støvsuger (HA 2026.3+): ligger i entitetens indstillinger. Hentes via websocket og gemmes kort.
  const AREA_CACHE = new Map();
  const AREA_SEL = new Map();
  function loadVacuumAreas(hass, id) {
    const c = AREA_CACHE.get(id);
    if (c && Date.now() - c.t < 60000) return Promise.resolve(c.list);
    if (!hass || typeof hass.callWS !== 'function') return Promise.resolve(null);
    return hass.callWS({ type: 'config/entity_registry/get', entity_id: id }).then((r) => {
      const m = r && r.options && r.options.vacuum && r.options.vacuum.area_mapping;
      if (!m || typeof m !== 'object') return null;
      const list = Object.keys(m).filter((k) => m[k] && (!Array.isArray(m[k]) || m[k].length)).map((k) => ({ id: k, name: (hass.areas && hass.areas[k] && hass.areas[k].name) || k }));
      list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
      AREA_CACHE.set(id, { t: Date.now(), list });
      return list;
    }).catch(() => null);
  }

  const AREA_OPEN = new Map();
  let AREA_POP = null; // den ene åbne flydende liste: { el, field, off }
  function closeAreaPop() {
    if (!AREA_POP) return;
    const p = AREA_POP; AREA_POP = null;
    p.off(); if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
  }
  // Listen lægger sig ovenpå siden (fixed, i body) og ændrer derfor ikke elementets eller rækkens højde.
  function openAreaPop(field, list, sel, onStart, onChange, id) {
    closeAreaPop();
    const pop = document.createElement('div');
    pop.className = 'curio-pop';
    const st = document.createElement('style');
    st.textContent = '.curio-pop{position:fixed;z-index:100000;box-sizing:border-box;display:flex;flex-direction:column;gap:2px;padding:4px;overflow:auto;font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif);color:var(--primary-text-color);background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#8888);border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.35)}'
      + '.curio-pop .area{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:8px;min-height:32px;padding:0 8px;border-radius:6px;cursor:pointer;font-size:14px;color:var(--primary-text-color)}'
      + '.curio-pop .area ha-icon{--mdc-icon-size:20px;flex:none;opacity:.7}.curio-pop .area.on ha-icon{opacity:1;color:var(--primary-color)}'
      + '.curio-pop .area:hover{background:color-mix(in srgb,var(--primary-text-color) 8%,transparent)}'
      + '.curio-pop .go{all:unset;box-sizing:border-box;align-self:flex-end;margin-top:4px;height:32px;padding:0 16px;border-radius:16px;cursor:pointer;font-size:14px;font-weight:600;background:var(--primary-color);color:var(--text-primary-color,#fff)}'
      + '.curio-pop .go[disabled]{opacity:.35;cursor:default}';
    pop.appendChild(st);
    const go = document.createElement('button');
    go.type = 'button'; go.className = 'go'; go.textContent = tr('card.areas_start');
    const upd = () => { go.disabled = !sel.size; onChange(); };
    for (const a of list) {
      const r = document.createElement('button');
      r.type = 'button'; r.className = 'area'; r.dataset.area = a.id;
      const mark = document.createElement('ha-icon');
      const sync = () => { mark.setAttribute('icon', sel.has(a.id) ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'); r.classList.toggle('on', sel.has(a.id)); };
      r.appendChild(mark);
      const t = document.createElement('span'); t.textContent = a.name; r.appendChild(t);
      sync();
      r.addEventListener('click', () => { if (sel.has(a.id)) sel.delete(a.id); else sel.add(a.id); sync(); upd(); });
      pop.appendChild(r);
    }
    go.addEventListener('click', () => { if (sel.size) onStart(); });
    pop.appendChild(go);
    document.body.appendChild(pop);
    const place = () => {
      const r = field.getBoundingClientRect();
      const vh = window.innerHeight, vw = window.innerWidth;
      const w = Math.min(Math.max(r.width, 190), vw - 16);
      const left = Math.max(8, Math.min(r.left, vw - w - 8));
      const below = vh - r.bottom - 8, above = r.top - 8;
      const wantH = pop.scrollHeight + 2;
      const down = below >= Math.min(wantH, 220) || below >= above;
      pop.style.width = w + 'px';
      pop.style.left = left + 'px';
      pop.style.maxHeight = Math.max(120, down ? below : above) + 'px';
      if (down) { pop.style.top = (r.bottom + 4) + 'px'; pop.style.bottom = ''; } else { pop.style.bottom = (vh - r.top + 4) + 'px'; pop.style.top = ''; }
    };
    place();
    const onDown = (e) => { const path = e.composedPath ? e.composedPath() : []; if (!path.includes(pop) && !path.includes(field)) { closeAreaPop(); AREA_OPEN.set(id, false); onChange(); } };
    const onKey = (e) => { if (e.key === 'Escape') { closeAreaPop(); AREA_OPEN.set(id, false); onChange(); } };
    let raf = 0, gone = 0;
    const tick = () => {
      if (AREA_POP !== me) return;
      if (!field.isConnected) { if (++gone > 20) { closeAreaPop(); AREA_OPEN.set(id, false); return; } } else { gone = 0; place(); }
      raf = requestAnimationFrame(tick);
    };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey, true);
    const me = { el: pop, field, off: () => { document.removeEventListener('pointerdown', onDown, true); document.removeEventListener('keydown', onKey, true); cancelAnimationFrame(raf); } };
    AREA_POP = me;
    raf = requestAnimationFrame(tick);
    upd();
  }

  function buildAreaPanel(ctx, item) {
    const wrap = el('div', 'areas');
    const sel = AREA_SEL.get(item.id) || new Set();
    AREA_SEL.set(item.id, sel);
    const openHa = () => fire(wrap, 'hass-more-info', { entityId: item.id });
    wrap.appendChild(el('span', 'areas-msg', tr('card.areas_loading')));
    loadVacuumAreas(ctx.hass, item.id).then((list) => {
      wrap.textContent = '';
      if (!list || !list.length) {
        const o = el('button', 'pick areas-field areas-none');
        o.type = 'button';
        o.title = tr('card.areas_none_help');
        o.setAttribute('aria-label', tr('card.areas_none_help'));
        o.appendChild(el('span', 'areas-txt', tr('card.areas_none')));
        const ic = document.createElement('ha-icon');
        ic.setAttribute('icon', 'mdi:open-in-new');
        o.appendChild(ic);
        o.addEventListener('click', openHa);
        wrap.appendChild(o);
        return;
      }
      const known = new Set(list.map((a) => a.id));
      for (const k of Array.from(sel)) if (!known.has(k)) sel.delete(k);
      const field = el('button', 'pick areas-field');
      field.type = 'button';
      const caret = document.createElement('ha-icon');
      const txt = el('span', 'areas-txt');
      field.appendChild(txt);
      field.appendChild(caret);
      const label = () => {
        const n = list.filter((a) => sel.has(a.id)).map((a) => a.name);
        txt.textContent = !n.length ? tr('card.areas_pick') : n.length <= 2 ? n.join(', ') : n.length + ' ' + tr('card.areas_n');
        const o = !!(AREA_POP && AREA_POP.field === field);
        caret.setAttribute('icon', o ? 'mdi:chevron-up' : 'mdi:chevron-down');
        field.setAttribute('aria-expanded', o ? 'true' : 'false');
      };
      const start = () => {
        ctx.hass.callService('vacuum', 'clean_area', { entity_id: item.id, cleaning_area_id: Array.from(sel) });
        sel.clear();
        closeAreaPop(); AREA_OPEN.set(item.id, false);
        ctx.ctl.toggle(item.key, ctx.ctl.get(item.key));
      };
      const show = () => { AREA_OPEN.set(item.id, true); openAreaPop(field, list, sel, start, label, item.id); label(); };
      field.addEventListener('click', () => { if (AREA_POP && AREA_POP.field === field) { closeAreaPop(); AREA_OPEN.set(item.id, false); label(); } else show(); });
      wrap.appendChild(field);
      label();
      if (AREA_OPEN.get(item.id)) show();
    });
    return wrap;
  }

  function buildPanel(ctx, item, kind) {
    const a = item.stateObj.attributes;
    const call = (data) => ctx.hass.callService('light', 'turn_on', { entity_id: item.id, ...data });
    const busy = (on) => ctx.ctl.busy(item.key, on);
    const panel = el('div', 'panel' + (ctx.ctl && ctx.ctl.fresh && ctx.ctl.fresh(item.key) ? ' fresh' : ''));
    if (kind === 'brightness') {
      const pct = typeof a.brightness === 'number' ? Math.max(1, Math.round((a.brightness / 255) * 100)) : 100;
      panel.appendChild(makeSlider({ label: tr('card.ctl_brightness'), min: 1, max: 100, value: pct, format: (v) => v + ' %', gradient: 'linear-gradient(to right, color-mix(in srgb, var(--cc) 10%, transparent), var(--cc))', onSend: (v) => call({ brightness_pct: v }), onBusy: busy }).row);
    } else if (kind === 'kelvin') {
      const min = Math.round(a.min_color_temp_kelvin || 2000);
      const max = Math.round(a.max_color_temp_kelvin || 6500);
      let k = typeof a.color_temp_kelvin === 'number' ? a.color_temp_kelvin : typeof a.color_temp === 'number' && a.color_temp > 0 ? 1000000 / a.color_temp : (min + max) / 2;
      k = Math.min(max, Math.max(min, Math.round(k)));
      panel.appendChild(makeSlider({ label: tr('card.ctl_kelvin'), min, max, step: 50, value: k, format: (v) => v + ' K', gradient: 'linear-gradient(to right, #ff9d3b, #ffd9a8, #ffffff, #cfe0ff, #8fb4ff)', onSend: (v) => call({ color_temp_kelvin: v }), onBusy: busy }).row);
    } else if (kind === 'color') {
      // Én nuance-bjælke. Mætningen bevares; er lyset næsten hvidt, bruges fuld mætning, så farven kan ses.
      const hs = Array.isArray(a.hs_color) && a.hs_color.length === 2 ? a.hs_color : [0, 100];
      const sat = hs[1] < 40 ? 100 : Math.round(hs[1]);
      panel.appendChild(makeSlider({ label: tr('card.hue'), min: 0, max: 360, value: Math.round(hs[0]), format: (v) => v + '°', gradient: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)', onSend: (v) => call({ hs_color: [v, sat] }), onBusy: busy }).row);
    }
    // Enhedens egne valg/tal (kind 'dev:select.xxx') bruger den andens entitet; ellers elementets egen.
    let def = CONTROL_BY_ID[kind];
    let tgt = item;
    let tso = item.stateObj;
    let aria = tr('card.ctl_' + kind);
    if (kind.indexOf('dev:') === 0) {
      const eid = kind.slice(4);
      const dom = eid.split('.')[0];
      tso = ctx.hass && ctx.hass.states ? ctx.hass.states[eid] : null;
      def = dom === 'number' || dom === 'input_number' ? CONTROL_BY_ID.number_slider : dom === 'select' || dom === 'input_select' ? CONTROL_BY_ID.select_option : null;
      tgt = { id: eid, domain: dom };
      aria = tso ? deviceControlName({ so: tso, eid }, item) : eid;
      if (!tso) def = null;
    }
    if (def && def.kind === 'areas') {
      panel.appendChild(buildAreaPanel(ctx, item));
    } else if (def && def.kind === 'slider' && def.slider) {
      const sp = def.slider(tso);
      panel.appendChild(makeSlider({ label: aria, min: sp.min, max: sp.max, value: sp.value, step: sp.step, format: sp.format, gradient: 'linear-gradient(to right, color-mix(in srgb, var(--cc) 10%, transparent), var(--cc))', onSend: (v) => def.send(ctx.hass, tgt, v), onBusy: busy }).row);
    } else if (def && def.kind === 'select') {
      const sel = document.createElement('select');
      sel.className = 'pick';
      sel.setAttribute('aria-label', aria);
      const list = def.options ? def.options(tso) : tso.attributes.options;
      const curv = def.current ? def.current(tso) : tso.state;
      for (const o of list) {
        const op = document.createElement('option');
        op.value = String(o); op.textContent = def.label ? def.label(o) : String(o);
        if (String(o) === String(curv)) op.selected = true;
        sel.appendChild(op);
      }
      sel.addEventListener('focus', () => busy(true));
      sel.addEventListener('blur', () => setTimeout(() => busy(false), 200));
      sel.addEventListener('change', () => { def.send(ctx.hass, tgt, sel.value); setTimeout(() => busy(false), 300); });
      panel.appendChild(sel);
    }
    const x = el('button', 'cb cx');
    x.type = 'button';
    x.title = tr('card.close');
    x.setAttribute('aria-label', tr('card.close'));
    const ic = document.createElement('ha-icon');
    ic.setAttribute('icon', 'mdi:close');
    x.appendChild(ic);
    x.addEventListener('click', () => ctx.ctl.toggle(item.key, ctx.ctl.get(item.key)));
    panel.appendChild(x);
    return panel;
  }

  // En handling på en knap uden mål rammer elementets egen entitet. Et helt tomt mål ({}), som HA's editor selv skriver,
  // tæller også som «intet mål», men kun når HA's tjenesteliste siger, at tjenesten tager et mål (ellers sendes handlingen som sat).
  function serviceTakesTarget(hass, a) {
    const id = String(a.perform_action || a.service || '');
    const dot = id.indexOf('.');
    const def = dot > 0 && hass && hass.services && hass.services[id.slice(0, dot)] && hass.services[id.slice(0, dot)][id.slice(dot + 1)];
    return !!def && def.target !== undefined && def.target !== null;
  }
  function withEntityTarget(a, item, hass) {
    if (!a || (a.action !== 'perform-action' && a.action !== 'call-service')) return a;
    const d = a.data || a.service_data || {};
    if (d.entity_id) return a;
    if (a.target) {
      const emptyTarget = typeof a.target === 'object' && !Array.isArray(a.target) && Object.keys(a.target).length === 0;
      if (!emptyTarget || !serviceTakesTarget(hass, a)) return a;
    }
    return { ...a, target: { entity_id: item.id } };
  }

  function tintButton(b, col) { if (col) { b.classList.add('tinted'); b.style.setProperty('--bc', col); } }

  // Returnerer { btns, panel }: knapperækken og (hvis en styring er åben) skyderen, der erstatter elementets indhold.
  function buildControls(ctx, item, S) {
    if (item.kind !== 'entity' || item.missing || !item.stateObj || item.obj.hide_buttons === true) return null;
    const chips = ctx.eff.layout === 'chips';
    const kinds = [];
    for (const k of normMulti(SETTING_BY_KEY.controls, S('controls'), 'tiles')) {
      const def = CONTROL_BY_ID[k];
      if (!def || !def.domain.includes(item.domain) || !def.avail(item.stateObj, item)) continue;
      if (chips && def.kind !== 'action') continue; // chips er for små til skydere og lister
      kinds.push(k);
    }
    const devs = !chips && S('device_controls') ? deviceControls(ctx.hass, item, S('device_controls_order')) : [];
    const custom = chips ? [] : ownButtonList(ctx, item);
    if (!kinds.length && !devs.length && !custom.length) return null;
    const btns = el('div', 'btns');
    // Knapperne må ikke udløse elementets egne handlinger.
    for (const ev of ['pointerdown', 'pointerup', 'click', 'keydown']) btns.addEventListener(ev, (e) => e.stopPropagation());
    const open = ctx.ctl.get(item.key);
    for (const k of kinds) {
      const def = CONTROL_BY_ID[k];
      const so = item.stateObj;
      const b = el('button', 'cb');
      b.type = 'button';
      b.title = tr('card.ctl_' + k);
      b.setAttribute('aria-label', tr('card.ctl_' + k));
      b.dataset.ctl = k;
      tintButton(b, resolveColor(ctx.eff.button_color));
      if (def.kind === 'action' && def.on && def.on(so)) b.classList.add('on');
      if (def.kind === 'action' && def.off && def.off(so)) b.disabled = true;
      const ic = document.createElement('ha-icon');
      ic.setAttribute('icon', controlIcon(def, so));
      b.appendChild(ic);
      if (def.kind === 'action') {
        let armed = null;
        b.addEventListener('click', () => {
          if (def.confirm && def.confirm(so) && !armed) {
            b.classList.add('arm');
            b.title = tr('card.lock_confirm');
            armed = setTimeout(() => { armed = null; b.classList.remove('arm'); b.title = tr('card.ctl_' + k); }, 3000);
            return;
          }
          clearTimeout(armed); armed = null;
          const c = def.call(so, item);
          ctx.hass.callService(c[0], c[1], c[2]);
        });
      } else b.addEventListener('click', () => ctx.ctl.toggle(item.key, k, b.closest('.item')));
      btns.appendChild(b);
    }
    for (const d of devs) {
      const b = el('button', 'cb');
      const nm = deviceControlName(d, item);
      b.type = 'button';
      b.title = nm;
      b.setAttribute('aria-label', nm);
      b.dataset.ctl = d.id;
      tintButton(b, resolveColor(ctx.eff.button_color));
      b.appendChild(deviceControlIcon(ctx.hass, d));
      if (d.dom === 'button') {
        // Enhedens egen knap: et tryk kalder button.press; utilgængelig knap står nedtonet (rækken hopper ikke).
        const fb = S('button_press_feedback') !== false;
        if (d.so.state === 'unavailable') b.disabled = true;
        else {
          if (fb && ctx.ctl.pressed(d.eid)) { b.classList.add('pressed'); ctx.ctl.pressNode(d.eid, b); }
          b.addEventListener('click', () => {
            ctx.hass.callService('button', 'press', { entity_id: d.eid });
            if (fb) { b.classList.add('pressed'); ctx.ctl.press(d.eid, b); }
          });
        }
      } else b.addEventListener('click', () => ctx.ctl.toggle(item.key, d.id, b.closest('.item')));
      btns.appendChild(b);
    }
    custom.forEach((cb, i) => {
      const b = el('button', 'cb custom');
      b.type = 'button';
      b.dataset.btn = String(i);
      tintButton(b, resolveColor(cb.color) || resolveColor(ctx.eff.button_color));
      if (cb.name) { b.title = cb.name; b.setAttribute('aria-label', cb.name); }
      const oe = ownEntityOf(cb);
      const oso = oe && ctx.hass && ctx.hass.states ? ctx.hass.states[oe] : null;
      if (oe) {
        // Knap, der viser en entitets styring: ikon og navn følger entiteten, hvis de ikke er sat.
        b.dataset.ownEntity = oe;
        if (!cb.name) { const nm = oso ? deviceControlName({ so: oso, eid: oe }, item) : oe; b.title = nm; b.setAttribute('aria-label', nm); }
      }
      if (oe && oso && !cb.icon) b.appendChild(deviceControlIcon(ctx.hass, { eid: oe, so: oso, def: oe.indexOf('select') >= 0 ? CONTROL_BY_ID.select_option : CONTROL_BY_ID.number_slider }));
      else {
        const ic = document.createElement('ha-icon');
        ic.setAttribute('icon', cb.icon || 'mdi:gesture-tap-button');
        b.appendChild(ic);
      }
      const tap = oe ? { action: 'curio-panel', entity: oe } : cb.tap_action;
      const bound = bindActions(b, { tap, hold: cb.hold_action, double: cb.double_tap_action }, (a) => { if (b.disabled) return; if (a.action === 'curio-panel') ctx.ctl.toggle(item.key, 'dev:' + a.entity, b.closest('.item')); else ctx.run(b, item, withEntityTarget(a, item, ctx.hass)); }, true);
      if (!bound || (oe && !(oso && usable(oso)))) b.disabled = true;
      btns.appendChild(b);
    });
    let panel = null;
    if (open && (devs.some((d) => d.id === open) || custom.some((cb) => { const e = ownEntityOf(cb); return e && 'dev:' + e === open; }) || (kinds.includes(open) && CONTROL_BY_ID[open].kind !== 'action'))) {
      panel = buildPanel(ctx, item, open);
      for (const ev of ['pointerdown', 'pointerup', 'click', 'keydown']) panel.addEventListener(ev, (e) => e.stopPropagation());
    }
    return { btns, panel, open: panel ? open : null, count: kinds.length + devs.length + custom.length };
  }

  const _crCache = new WeakMap();
  function createColorRulesCached(list) {
    if (!Array.isArray(list) || !list.length) return null;
    if (!_crCache.has(list)) _crCache.set(list, createColorRules(list));
    return _crCache.get(list);
  }

  // Fælles element-opbygning. Layouts bestemmer klasser og rækkefølge.
  function buildItem(ctx, item, layout) {
    const { hass, eff, run } = ctx;
    const S = (k) => (ITEM_KEYS.has(k) && item.obj[k] !== undefined ? item.obj[k] : eff[k]);
    const name = itemName(hass, item);
    const ip = normIconPos(layout, S('icon_position'));
    const col = ip === 'top' || ip === 'top_center' || ip === 'top_right';
    const node = el('div', 'item it-' + layout + (col ? ' it-col' : '') + (ip === 'top_center' ? ' ic-center' : '') + (ip === 'top_right' ? ' ic-right' : '') + (ip === 'right' ? ' ip-right' : '') + (item.active ? ' on' : '') + (item.unavailable ? ' unavail' : '') + (item.missing ? ' missing' : ''));
    const isz = S('icon_size');
    if (isz && isz !== 'auto' && SCALE[isz]) node.style.setProperty('--is', String(SCALE[isz]));
    const bsz = S('button_size');
    if (bsz && bsz !== 'auto' && SCALE[bsz]) node.style.setProperty('--bs', String(SCALE[bsz]));
    node.style.setProperty('--cc', itemColor(item, S));
    node.dataset.id = item.id;
    // Farveregler (pr. entitet først, så kortets)
    if (item.stateObj && !item.missing) {
      const own = createColorRulesCached(item.obj.color_rules);
      const hit = (own && own(item.id, item.stateObj, hass)) || (ctx.colorRules && ctx.colorRules(item.id, item.stateObj, hass));
      if (hit) {
        const col = hit.color ? resolveColor(hit.color) : '';
        if (col) {
          if (hit.affects === 'icon') { node.style.setProperty('--ic', col); node.classList.add('ri'); }
          else if (hit.affects === 'indicator') { node.style.setProperty('--ci', col); node.classList.add('ri'); }
          else { node.style.setProperty('--cc', col); node.classList.add('rc'); }
        }
        // Animation: rotation gælder altid ikonet; Hele elementet = elementets kant og baggrund (ikon og tekst står stille)
        if (hit.animation) {
          const secs = ANIM_SECONDS[hit.animation][hit.speed === 'slow' ? 0 : hit.speed === 'fast' ? 2 : 1];
          const target = hit.animation === 'spin' || (hit.animation === 'pulse_size' && hit.affects === 'all') ? 'icon' : hit.affects === 'icon' ? 'icon' : hit.affects === 'indicator' ? 'ind' : 'all';
          node.dataset['an' + target[0].toUpperCase() + target.slice(1)] = hit.animation;
          node.style.setProperty('--ad', secs + 's');
        }
      }
    }
    const indicator = S('indicator');
    const pos = S('indicator_position');
    const runHere = (a) => run(node, item, a);

    let icon = null;
    if (S('show_icon')) {
      icon = makeIcon(hass, item);
      node.appendChild(icon);
    }
    const txt = el('div', 'txt');
    const roll = layout !== 'chips' && eff.long_text !== 'truncate';
    if (S('show_name')) {
      const nm = el('div', 'nm');
      if (roll) nm.appendChild(el('span', 'mq', name)); else nm.textContent = name;
      txt.appendChild(nm);
    }
    // Stor værdi: første sekundære del vises stort (kun tiles/grid)
    let sec;
    let big = null;
    if (S('big_value') && (layout === 'tiles' || layout === 'grid')) {
      const parts = secondaryParts(hass, item, S);
      if (parts) {
        big = el('div', 'bigv');
        const p0 = parts[0];
        // Tal og enhed deles ('18 %' -> '18' + lille '%'), så enheden kan vises mindre og lysere.
        const m = p0.nodeType === 3 ? /^\s*([-+]?[\d.,]+)\s*(\D.*?)\s*$/.exec(p0.nodeValue) : null;
        if (m) { big.appendChild(document.createTextNode(m[1])); big.appendChild(el('span', 'bu', m[2])); } else big.appendChild(p0);
        if (big.textContent.trim().length > 6) big.classList.add('long');
        node.classList.add('has-big');
        sec = parts.length > 1 ? joinParts(parts.slice(1)) : null;
      }
    }
    if (big === null) sec = secondaryNode(hass, item, S);
    if (big) txt.appendChild(big);
    // Tilstandstekst som indikator erstatter en sekundær linje med samme tekst (ellers står den to gange).
    if (sec && indicator === 'state_label' && sec.textContent.trim() === fmtState(hass, item).trim()) sec = null;
    if (sec) {
      const s = el('div', 'sec');
      if (roll) { const m = el('span', 'mq'); m.appendChild(sec); s.appendChild(m); } else s.appendChild(sec);
      txt.appendChild(s);
    }
    if (indicator === 'state_label') txt.appendChild(el('span', 'ind label', fmtState(hass, item)));
    if (txt.childNodes.length) node.appendChild(txt);

    const sw = S('show_switch') && item.obj.hide_buttons !== true && (layout === 'list' || layout === 'tiles') && canToggle(item) ? makeSwitch(hass, item, runHere) : null;
    {
      const ctls = buildControls(ctx, item, S);
      if (ctls) {
        node.classList.add('has-ctl');
        node.dataset.nb = String(ctls.count);
        if (ctls.panel) {
          node.classList.add('ctl-open');
          const h = ctx.ctl.height(item.key);
          if (h && layout !== 'grid') node.style.minHeight = h + 'px';
          node.appendChild(ctls.panel);
        } else node.appendChild(ctls.btns);
      }
    }
    if (sw) node.appendChild(sw);
    const mirror = layout === 'chips' && ip === 'right' ? pos.replace(/left|right/, (m) => (m === 'left' ? 'right' : 'left')) : pos;
    if (indicator !== 'none' && indicator !== 'state_label') addIndicator(node, icon, indicator, indicator === 'corner_badge' ? pos : mirror, item, hass, layout, !!S('bubble_text'));

    if (!item.missing) {
      node.setAttribute('aria-label', name);
      const el1 = bindActions(node, { tap: S('tap_action'), hold: S('hold_action'), double: S('double_tap_action') }, (a) => runHere(a), false);
      if (el1) { node.tabIndex = 0; node.setAttribute('role', 'button'); }
      if (icon) bindActions(icon, { tap: S('icon_tap_action'), hold: S('icon_hold_action'), double: S('icon_double_tap_action') }, (a) => runHere(a), true);
    }
    return node;
  }

  const LAYOUTS = {
    chips: { render: (ctx, item) => buildItem(ctx, item, 'chips') },
    tiles: { render: (ctx, item) => buildItem(ctx, item, 'tiles') },
    list: { render: (ctx, item) => buildItem(ctx, item, 'list') },
    grid: { render: (ctx, item) => buildItem(ctx, item, 'grid') }
  };

  function renderSection(item, ctx) {
    if (item.kind === 'group') {
      const gc = resolveColor(item.color);
      const h = el('div', 'sect grp' + (item.foldable ? ' fold' : '') + (item.collapsed ? ' closed' : '') + (item.style === 'line' ? ' gst-line' : item.style === 'fill' ? ' gst-fill' : '') + (item.align === 'center' ? ' ga-center' : item.align === 'right' ? ' ga-right' : '') + (gc ? ' hc' : ''));
      if (gc) h.style.setProperty('--gc', gc);
      if (item.size !== 'm' && SCALE[item.size]) h.style.setProperty('--gz', String(SCALE[item.size]));
      if (item.foldable) {
        const ic = document.createElement('ha-icon'); ic.setAttribute('icon', 'mdi:chevron-down'); h.appendChild(ic);
        h.tabIndex = 0; h.setAttribute('role', 'button'); h.setAttribute('aria-expanded', item.collapsed ? 'false' : 'true');
        const go = () => ctx.toggleGroup(item.gkey);
        h.addEventListener('click', go);
        h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      }
      h.append(el('span', 'gl', item.label));
      if (item.showCount) h.append(el('span', 'cnt', '(' + item.count + ')'));
      return h;
    }
    if (item.kind === 'divider') return el('div', 'sect divider');
    return el('div', 'sect', item.obj.label || '');
  }

  /* ====================================================================
   * 6. KORT-ELEMENT
   * ================================================================== */
  const CARD_CSS = `
    :host { display: block; }
    ha-card { padding: 12px; overflow: hidden; }
    ha-card.tr { background: color-mix(in srgb, var(--ha-card-background, var(--card-background-color, #fff)) var(--ca, 100%), transparent); }
    .title { font-size: var(--ha-card-header-font-size, 16px); font-weight: 500; color: var(--primary-text-color); padding: 0 4px 10px; }
    .empty { color: var(--secondary-text-color); font-size: 14px; padding: 8px 4px; }
    .limitnote { color: var(--secondary-text-color); font-size: 12px; padding: 6px 4px 0; }
    .limitnote strong { font-weight: 600; color: var(--primary-text-color); }
    .wrap { --s: 1; --gap: 8px; --r: calc(12px * var(--s)); --ir: 50%; --minw: 170px; display: flex; flex-wrap: wrap; gap: var(--gap); }
    .wrap.l-list { flex-direction: column; flex-wrap: nowrap; }
    .wrap.l-grid { --minw: 112px; }
    .wrap.has-btns.l-tiles { --minw: max(170px, calc(140px + var(--nb) * var(--bw, 38px))); }
    .wrap.has-btns.l-grid { --minw: max(112px, calc(18px + var(--nb) * var(--bw, 38px))); }
    .wrap.stretch.l-tiles, .wrap.stretch.l-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(calc(var(--minw) * var(--s)), 100%), 1fr)); }
    .wrap.stretch.l-tiles.cols, .wrap.stretch.l-grid.cols { grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); }
    .wrap.stretch.l-chips .item { flex: 1 1 auto; }
    .wrap.a-start { justify-content: flex-start; } .wrap.a-center { justify-content: center; }
    .wrap.a-end { justify-content: flex-end; } .wrap.a-space-between { justify-content: space-between; }
    .wrap:not(.stretch).l-tiles .item, .wrap:not(.stretch).l-grid .item { flex: 0 0 auto; width: min(calc(var(--minw) * var(--s)), 100%); }
    .wrap:not(.stretch).l-tiles.cols .item, .wrap:not(.stretch).l-grid.cols .item { width: calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols)); }
    .item { position: relative; box-sizing: border-box; display: flex; align-items: center; min-width: 0; overflow: hidden; border-radius: var(--r);
      font-size: calc(14px * var(--s)); color: var(--primary-text-color); -webkit-tap-highlight-color: transparent; user-select: none; transition: background-color .15s; }
    .item.act { cursor: pointer; touch-action: manipulation; }
    .item:focus-visible, .icon:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 1px; }
    .bg-filled .item { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
    .bg-filled.tint .item.on { background: color-mix(in srgb, var(--cc) 14%, color-mix(in srgb, var(--primary-text-color) 6%, transparent)); }
    .bg-filled .item.rc { background: color-mix(in srgb, var(--cc) 14%, color-mix(in srgb, var(--primary-text-color) 6%, transparent)); }
    .bg-outlined .item { border: 1px solid var(--divider-color); }
    .bg-transparent.l-list .item + .item { border-top: 1px solid var(--divider-color); border-radius: 0; }
    .item.unavail { opacity: .6; }
    .icon { position: relative; flex: none; display: flex; align-items: center; justify-content: center; border-radius: var(--ir);
      width: calc(34px * var(--is, var(--s))); height: calc(34px * var(--is, var(--s))); --mdc-icon-size: calc(20px * var(--is, var(--s)));
      color: var(--ic, var(--cc)); background: color-mix(in srgb, var(--ic, var(--cc)) 20%, transparent); }
    .icon.ring { box-shadow: 0 0 0 2px var(--ic, var(--cc)); }
    .txt { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; flex: 1 1 auto; }
    .nm { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sec { font-size: .85em; color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .it-tiles, .it-list { gap: calc(10px * var(--s)); padding: calc(8px * var(--s)) calc(10px * var(--s)); min-height: calc(48px * var(--s)); }
    .it-chips { gap: calc(6px * var(--s)); height: calc(34px * var(--s)); padding: 0 calc(12px * var(--s)) 0 calc(5px * var(--s)); font-size: calc(13px * var(--s)); }
    .it-chips .icon { width: calc(24px * var(--is, var(--s))); height: calc(24px * var(--is, var(--s))); --mdc-icon-size: calc(16px * var(--is, var(--s))); background: none; }
    .it-chips .txt { flex-direction: row; align-items: center; gap: calc(6px * var(--s)); flex: 0 1 auto; }
    .it-chips .sec { font-size: .9em; }
    .it-chips:not(:has(.icon)) { padding-left: calc(12px * var(--s)); }
    .it-col { flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: calc(8px * var(--s)); padding: calc(12px * var(--s)); min-height: 0; }
    .it-col .txt { flex: none; width: 100%; }
    .it-col.ic-center { align-items: center; text-align: center; } .it-col.ic-center .btns { justify-content: center; }
    .it-col.ic-right { align-items: flex-end; text-align: right; } .it-col.ic-right .btns { justify-content: flex-end; }
    .it-col.ic-center .ind.label { align-self: center; } .it-col.ic-right .ind.label { align-self: flex-end; }
    .it-chips.ip-right { flex-direction: row; padding: 0 calc(5px * var(--s)) 0 calc(12px * var(--s)); }
    .ip-right .btns, .ip-right .sw { order: 2; } .ip-right .icon { order: 3; }
    .bigv { font-size: calc(22px * var(--s)); font-weight: 600; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 0 1 auto; min-width: 0; max-width: 100%;
      font-variant-numeric: tabular-nums; color: color-mix(in srgb, var(--cc) 75%, var(--primary-text-color)); }
    .bigv .bu { font-size: .6em; font-weight: 500; margin-left: .2em; opacity: .75; }
    .bigv.long { font-size: calc(15px * var(--s)); }
    .has-big:not(.it-col) .nm { font-size: .9em; color: var(--secondary-text-color); }
    .it-col .bigv { order: -1; width: 100%; }
    .it-col .sw { align-self: flex-end; margin-left: 0; }
    .sect { flex: 1 0 100%; grid-column: 1 / -1; box-sizing: border-box; width: 100%; font-size: calc(12px * var(--s)); color: var(--secondary-text-color); padding: calc(6px * var(--s)) 4px 0; font-weight: 500; }
    .sect.divider { padding: 0; height: 1px; background: var(--divider-color); margin: 2px 0; }
    .sect.grp { display: flex; align-items: center; gap: 4px; font-size: calc(13px * var(--s) * var(--gz, 1)); color: var(--gc, var(--primary-text-color)); padding: calc(10px * var(--s)) 4px calc(2px * var(--s)); }
    .sect.grp:first-child { padding-top: 0; }
    .sect.grp.fold { cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; }
    .sect.grp.fold:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; border-radius: 6px; }
    .sect.grp ha-icon { --mdc-icon-size: calc(18px * var(--s) * var(--gz, 1)); color: var(--gc, var(--secondary-text-color)); transition: transform .15s; }
    .sect.grp.closed ha-icon { transform: rotate(-90deg); }
    .sect.grp .cnt { color: var(--secondary-text-color); font-weight: 400; }
    .sect.grp.hc .cnt { color: var(--gc); opacity: .75; }
    .sect.grp.ga-center { justify-content: center; } .sect.grp.ga-right { justify-content: flex-end; }
    .sect.grp.gst-line { padding-bottom: calc(4px * var(--s)); border-bottom: 1.5px solid color-mix(in srgb, var(--gc, var(--divider-color)) 70%, transparent); }
    .sect.grp.gst-fill { padding: calc(6px * var(--s)) calc(10px * var(--s)); margin-top: calc(8px * var(--s)); border-radius: calc(8px * var(--s)); background: color-mix(in srgb, var(--gc, var(--primary-text-color)) 14%, transparent); }
    .sect.grp.gst-fill:first-child { margin-top: 0; }
    .sw { margin-left: auto; flex: none; width: 34px; height: 20px; border-radius: 10px; position: relative; cursor: pointer; background: color-mix(in srgb, var(--primary-text-color) 22%, transparent); transition: background-color .15s; }
    .sw.on { background: var(--cc); }
    .sw .knob { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .15s; }
    .sw.on .knob { transform: translateX(14px); }
    .ind { position: absolute; background: var(--ci, var(--cc)); }
    .ind.dot { width: 8px; height: 8px; border-radius: 50%; }
    .ind.corner { width: calc(20px * var(--s)); height: calc(20px * var(--s)); }
    .ind.pos-top-right { top: 8px; right: 8px; } .ind.pos-top-left { top: 8px; left: 8px; }
    .ind.pos-bottom-right { bottom: 8px; right: 8px; } .ind.pos-bottom-left { bottom: 8px; left: 8px; }
    .ind.corner.pos-top-right { top: 0; right: 0; clip-path: polygon(0 0, 100% 0, 100% 100%); } .ind.corner.pos-top-left { top: 0; left: 0; clip-path: polygon(0 0, 100% 0, 0 100%); }
    .ind.corner.pos-bottom-right { bottom: 0; right: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%); } .ind.corner.pos-bottom-left { bottom: 0; left: 0; clip-path: polygon(0 0, 100% 100%, 0 100%); }
    .ind.stripe { left: 0; top: 20%; bottom: 20%; width: 3px; border-radius: 0 3px 3px 0; }
    .it-chips .ind.stripe { left: max(calc(16px * var(--s)), 22%); right: max(calc(16px * var(--s)), 22%); top: auto; bottom: 3px; height: 3px; width: auto; border-radius: 3px; }
    /* Chips: markeringer må ikke ligge oven på teksten */
    .it-chips .ind.dot { width: 7px; height: 7px; }
    .it-chips .ind.dot.pos-top-right, .it-chips .ind.dot.pos-bottom-right { right: 3px; } .it-chips .ind.dot.pos-top-left, .it-chips .ind.dot.pos-bottom-left { left: 3px; }
    .it-chips .ind.dot.pos-top-right, .it-chips .ind.dot.pos-top-left { top: 4px; } .it-chips .ind.dot.pos-bottom-right, .it-chips .ind.dot.pos-bottom-left { bottom: 4px; }
    /* Chips: hjørnebadgen er en trekant i chippens egne hjørner, skåret til af chippens runding (uafhængig af bredde og Justering) */
    .it-chips .ind.corner { width: calc(19px * var(--s)); height: calc(19px * var(--s)); }
    /* Slukkede/utilgængelige elementer: dæmpede markeringer (ikke når en farveregel har sat farven) */
    .item:not(.on):not(.rc):not(.ri) .ind:not(.label), .item:not(.on):not(.rc):not(.ri) .icon.ring { opacity: .55; }
    .item:not(.on):not(.rc):not(.ri) .icon.ring { box-shadow: 0 0 0 2px color-mix(in srgb, var(--ic, var(--cc)) 55%, transparent); }
    .ind.bubble { min-width: 16px; height: 16px; box-sizing: border-box; border-radius: 8px; padding: 0 3px; font-size: 10px; text-align: center; white-space: nowrap;
      color: var(--ha-card-background, var(--card-background-color, #000)); border: 1.5px solid color-mix(in srgb, var(--ha-card-background, var(--card-background-color, #000)) 60%, transparent);
      background-clip: padding-box; line-height: 13px; font-weight: 600; }
    .ind.bubble.wide { max-width: 9em; overflow: hidden; text-overflow: ellipsis; }
    .ind.bubble.empty { min-width: 0; width: 11px; height: 11px; padding: 0; border-radius: 50%; }
    .ind.bubble.free { position: absolute; }
    .icon .ind.bubble { top: -4px; right: -4px; } .icon .ind.bubble.pos-top-left { left: -4px; right: auto; }
    .icon .ind.bubble.pos-bottom-right { top: auto; bottom: -4px; } .icon .ind.bubble.pos-bottom-left { top: auto; bottom: -4px; left: -4px; right: auto; }
    /* Chips: indikatorer sidder helt inde i chippen (ikonets hjørner), skalerer med størrelsen og skæres aldrig af runde ender */
    .it-chips { --icy: calc((34px * var(--s) - 24px * var(--is, var(--s))) / 2); }
    .it-chips .icon .ind.bubble { --bo: -1px; --vo: calc(4px * var(--s) - var(--icy)); min-width: calc(14px * var(--s)); height: calc(14px * var(--s)); font-size: max(7px, calc(9px * var(--s))); line-height: calc(11px * var(--s)); padding: 0 calc(2px * var(--s)); border-radius: calc(7px * var(--s)); }
    .it-chips .icon .ind.bubble.empty { --bo: 0px; --vo: calc(5px * var(--s) - var(--icy)); min-width: 0; width: calc(10px * var(--s)); height: calc(10px * var(--s)); padding: 0; border-radius: 50%; }
    .it-chips .icon .ind.bubble.pos-top-right { top: var(--vo); right: var(--bo); bottom: auto; left: auto; }
    .it-chips .icon .ind.bubble.pos-top-left { top: var(--vo); left: var(--bo); bottom: auto; right: auto; }
    .it-chips .icon .ind.bubble.pos-bottom-right { bottom: var(--vo); right: var(--bo); top: auto; left: auto; }
    .it-chips .icon .ind.bubble.pos-bottom-left { bottom: var(--vo); left: var(--bo); top: auto; right: auto; }
    /* Boblens tekst centreres efter bogstavernes egen højde (text-box-trim), ikke efter skriftens linjemål.
       Tal, store og høje bogstaver (Til, Off, 18 %) centreres på versalhøjden, tekst med mange lave bogstaver (On, Tændt) på x-højden. */
    @supports (text-box: trim-both cap alphabetic) {
      .ind.bubble:not(.empty) { display: flex; align-items: center; justify-content: center; }
      .ind.bubble > .bt { display: block; line-height: 1; white-space: nowrap; text-box: trim-both cap alphabetic; }
      .ind.bubble.lc > .bt { text-box: trim-both ex alphabetic; }
      .ind.bubble.wide > .bt { min-width: 0; overflow: hidden; text-overflow: ellipsis; padding-block: .3em; margin-block: -.3em; }
    }
    /* Reserve til browsere uden text-box-trim: fast justering af teksten */
    @supports not (text-box: trim-both cap alphabetic) {
      .ind.bubble { padding-top: .15em; }
      .it-chips .icon .ind.bubble { padding-top: calc(2px * var(--s)); }
      .wrap[data-sz="l"] .it-chips .icon .ind.bubble { padding-top: calc(1.5px * var(--s)); }
      .ind.bubble.lc, .wrap .it-chips .icon .ind.bubble.lc { padding-top: 0; }
    }
    /* Små chips (XS og S): bobler uden tal, som en tydelig prik med kant, så de ikke dækker ikonet */
    .wrap[data-sz="xs"] .it-chips .icon .ind.bubble, .wrap[data-sz="s"] .it-chips .icon .ind.bubble { font-size: 0; line-height: 0; min-width: 0; width: calc(10px * var(--s)); height: calc(10px * var(--s)); padding: 0; border-radius: 50%; --bo: 0px; --vo: calc(5px * var(--s) - var(--icy)); }
    .it-chips .icon .ind.dot { width: max(6px, calc(7px * var(--s))); height: max(6px, calc(7px * var(--s))); }
    .it-chips .icon .ind.dot.pos-top-right { top: calc(7px * var(--s) - var(--icy)); right: calc(2px * var(--s)); } .it-chips .icon .ind.dot.pos-top-left { top: calc(7px * var(--s) - var(--icy)); left: calc(2px * var(--s)); }
    .it-chips .icon .ind.dot.pos-bottom-right { bottom: calc(7px * var(--s) - var(--icy)); right: calc(2px * var(--s)); } .it-chips .icon .ind.dot.pos-bottom-left { bottom: calc(7px * var(--s) - var(--icy)); left: calc(2px * var(--s)); }
    .ind.label { position: static; align-self: flex-start; margin-top: 2px; font-size: calc(11px * var(--s)); padding: 1px 7px; border-radius: 999px; white-space: nowrap;
      color: color-mix(in srgb, var(--ci, var(--cc)) 65%, var(--primary-text-color)); background: color-mix(in srgb, var(--ci, var(--cc)) 22%, transparent); }
    .it-chips .ind.label { margin: 0; align-self: center; }
    .btns { flex: none; display: flex; flex-wrap: nowrap; justify-content: flex-end; gap: calc(6px * var(--s)); cursor: default; }
    .it-col .btns { margin-top: auto; justify-content: flex-start; align-self: stretch; flex-wrap: wrap; }
    .cb { font: inherit; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; flex: none; width: calc(32px * var(--bs, var(--s))); height: calc(32px * var(--bs, var(--s)));
      padding: 0; border: none; border-radius: 50%; cursor: pointer; color: var(--primary-text-color); --mdc-icon-size: calc(18px * var(--bs, var(--s)));
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
    .cb:hover { background: color-mix(in srgb, var(--primary-text-color) 18%, transparent); }
    .cb.tinted { color: var(--bc); background: color-mix(in srgb, var(--bc) 20%, transparent); }
    .cb.tinted:hover { background: color-mix(in srgb, var(--bc) 32%, transparent); }
    .cb.on { color: var(--cc, var(--primary-color)); background: color-mix(in srgb, var(--cc, var(--primary-color)) 26%, transparent); }
    .cb.tinted.on { background: color-mix(in srgb, var(--bc) 38%, transparent); }
    .cb.pressed { color: var(--cc, var(--primary-color)); background: color-mix(in srgb, var(--cc, var(--primary-color)) 38%, transparent); transition: background .15s ease-out; }
    .cb.tinted.pressed { background: color-mix(in srgb, var(--bc) 48%, transparent); }
    .cb.arm { background: var(--warning-color, #ff9800); color: #fff; animation: curio-arm 1s ease-in-out infinite alternate; }
    @keyframes curio-arm { from { opacity: 1; } to { opacity: .6; } }
    .cb:disabled { opacity: .5; cursor: default; }
    .it-chips .btns { gap: calc(3px * var(--s)); align-items: center; }
    .it-chips .cb { width: calc(24px * var(--bs, var(--s))); height: calc(24px * var(--bs, var(--s))); --mdc-icon-size: calc(15px * var(--bs, var(--s))); }
    .it-chips:has(.btns) { padding-right: calc(5px * var(--s)); }
    .it-chips.ip-right:has(.btns) { padding-left: calc(5px * var(--s)); padding-right: calc(5px * var(--s)); }
    .areas { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 4px; }
    .areas .areas-field { flex: 1 1 0; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 4px; height: calc(32px * var(--bs, var(--s))); cursor: pointer; text-align: left; padding: 0 6px; }
    .areas .areas-txt { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .areas .areas-field ha-icon { --mdc-icon-size: 18px; flex: none; }
    .areas-msg { font-size: 12px; opacity: .7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .areas .areas-none { opacity: .75; }
    .pick { flex: 1 1 auto; min-width: 0; font: inherit; color: var(--primary-text-color); background: var(--card-background-color, transparent); border: 1px solid var(--divider-color); border-radius: calc(var(--r) - 2px); padding: 0 8px; }
    .cb:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 1px; }
    .item.ctl-open:not(.it-col) { padding: calc(6px * var(--s)); gap: calc(8px * var(--s)); }
    .item.ctl-open:not(.it-col) > :not(.panel) { display: none; }
    .panel { flex: 1 1 auto; align-self: stretch; min-width: 0; display: flex; align-items: stretch; gap: calc(8px * var(--s)); cursor: default; touch-action: pan-y; }
    .panel.fresh { animation: curio-fade .18s ease-out; }
    .panel .cx { align-self: center; }
    .it-col .panel { flex: none; align-self: stretch; margin-top: auto; height: calc(32px * var(--bs, var(--s))); }
    .it-col .sl { border-radius: calc(16px * var(--s)); min-height: 0; }
    .it-col .sl .val { font-size: .78em; }
    .sl { position: relative; flex: 1 1 auto; min-width: 0; overflow: hidden; border-radius: calc(var(--r) - 2px); background: var(--g, var(--divider-color)); }
    .it-list .sl, .it-tiles .sl { min-height: calc(36px * var(--bs, var(--s))); }
    .sl input { -webkit-appearance: none; appearance: none; position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; background: transparent; touch-action: pan-y; cursor: pointer; }
    .sl input::-webkit-slider-runnable-track { background: transparent; height: 100%; }
    .sl input::-webkit-slider-thumb { -webkit-appearance: none; width: 5px; height: 400px; margin-top: 0; border-radius: 3px; background: #fff; box-shadow: 0 0 3px rgba(0, 0, 0, .6); }
    .sl input::-moz-range-thumb { width: 5px; height: 400px; border: none; border-radius: 3px; background: #fff; box-shadow: 0 0 3px rgba(0, 0, 0, .6); }
    .sl input::-moz-range-track { background: transparent; }
    .sl .val { white-space: nowrap; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); pointer-events: none; font-size: .85em; font-weight: 500; color: #fff; text-shadow: 0 0 2px #000, 0 0 4px rgba(0, 0, 0, .8), 0 0 8px rgba(0, 0, 0, .5); font-variant-numeric: tabular-nums; }
    .mq { display: inline-block; white-space: nowrap; }
    .mq.roll { animation: curio-roll var(--t, 8s) ease-in-out infinite alternate; }
    @keyframes curio-roll { 0%, 18% { transform: translateX(0); } 82%, 100% { transform: translateX(calc(var(--d, 0) * -1px)); } }
    @keyframes curio-fade { from { opacity: 0; } to { opacity: 1; } }
    /* Animationer fra regler (data-an-all / -icon / -ind) */
    .item[data-an-all] { isolation: isolate; }
    .item[data-an-all]::before { content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; pointer-events: none; opacity: 0; }
    .item[data-an-all="pulse"]::before { background: var(--cc); animation: curio-a-bgpulse var(--ad, 1.8s) ease-in-out infinite; }
    .item[data-an-all="blink"]::before { background: var(--cc); animation: curio-a-bgblink var(--ad, 1.2s) steps(1, end) infinite; }
    .item[data-an-all="glow"]::before { box-shadow: inset 0 0 0 2px var(--cc), inset 0 0 18px 2px var(--cc); animation: curio-a-bgglow var(--ad, 2s) ease-in-out infinite; }
    .item[data-an-icon="pulse"] .icon { animation: curio-a-pulse var(--ad, 1.8s) ease-in-out infinite; }
    .item[data-an-icon="pulse_size"] .icon { animation: curio-a-size var(--ad, 1.8s) ease-in-out infinite; }
    .item[data-an-icon="blink"] .icon { animation: curio-a-blink var(--ad, 1.2s) steps(1, end) infinite; }
    .item[data-an-icon="glow"] .icon { animation: curio-a-glow var(--ad, 2s) ease-in-out infinite; --gc: var(--ic, var(--cc)); }
    .item[data-an-icon="spin"] .icon > :not(.ind) { animation: curio-a-spin var(--ad, 2s) linear infinite; }
    .item[data-an-ind="pulse"] .ind { animation: curio-a-pulse var(--ad, 1.8s) ease-in-out infinite; }
    .item[data-an-ind="pulse_size"] .ind { animation: curio-a-size var(--ad, 1.8s) ease-in-out infinite; }
    .item[data-an-ind="pulse_size"] .icon.ring { animation: curio-a-ringpulse var(--ad, 1.8s) ease-in-out infinite; }
    .item[data-an-ind="blink"] .ind { animation: curio-a-blink var(--ad, 1.2s) steps(1, end) infinite; }
    .item[data-an-ind="glow"] .ind { animation: curio-a-glow var(--ad, 2s) ease-in-out infinite; --gc: var(--ci, var(--cc)); }
    .item[data-an-ind="pulse"] .icon.ring { animation: curio-a-ringpulse var(--ad, 1.8s) ease-in-out infinite; }
    .item[data-an-ind="blink"] .icon.ring { animation: curio-a-ringblink var(--ad, 1.2s) steps(1, end) infinite; }
    .item[data-an-ind="glow"] .icon.ring { animation: curio-a-ringglow var(--ad, 2s) ease-in-out infinite; }
    @keyframes curio-a-bgpulse { 0%, 100% { opacity: 0; } 50% { opacity: .3; } }
    @keyframes curio-a-bgblink { 0%, 49% { opacity: .35; } 50%, 100% { opacity: 0; } }
    @keyframes curio-a-bgglow { 0%, 100% { opacity: .15; } 50% { opacity: 1; } }
    @keyframes curio-a-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
    @keyframes curio-a-size { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.14); opacity: .75; } }
    @keyframes curio-a-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: .15; } }
    @keyframes curio-a-glow { 0%, 100% { filter: none; } 50% { filter: drop-shadow(0 0 6px var(--gc)) drop-shadow(0 0 2px var(--gc)); } }
    @keyframes curio-a-spin { to { transform: rotate(360deg); } }
    @keyframes curio-a-ringpulse { 0%, 100% { box-shadow: 0 0 0 2px var(--ic, var(--cc)); } 50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--ic, var(--cc)) 30%, transparent); } }
    @keyframes curio-a-ringblink { 0%, 49% { box-shadow: 0 0 0 2px var(--ic, var(--cc)); } 50%, 100% { box-shadow: 0 0 0 2px transparent; } }
    @keyframes curio-a-ringglow { 0%, 100% { box-shadow: 0 0 0 2px var(--ic, var(--cc)); } 50% { box-shadow: 0 0 0 2px var(--ic, var(--cc)), 0 0 12px 3px var(--ic, var(--cc)); } }
    @media (prefers-reduced-motion: reduce) {
      .item[data-an-all]::before, .item[data-an-icon] .icon, .item[data-an-icon] .icon > *, .item[data-an-ind] .ind, .item[data-an-ind] .icon.ring { animation: none !important; }
      .item, .sw, .sw .knob { transition: none; } .panel, .panel.fresh { animation: none; } .cb.pressed { transition: none; } .mq { display: inline; } .mq.roll { animation: none; }
    }
  `;

  class CurioCard extends HTMLElement {
    constructor() {
      super();
      this._config = null;
      this._hass = null;
      this._cache = new Map();
      this._folded = new Set();
      this._ids = [];
      this._watch = [];
      this._engine = null;
      this._ctl = new Map();
      this._ctlH = new Map();
      this._closeTimer = null;
      this._busy = null;
      this._pressed = new Map(); // eid -> { node, until, timer } for tryk-feedback
      this._fresh = null; // nøglen på det panel, der netop er åbnet (kun det får fade-ind)
      this.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = CARD_CSS;
      this._card = document.createElement('ha-card');
      this._title = el('div', 'title');
      this._wrap = el('div', 'wrap');
      this._empty = el('div', 'empty');
      this._limit = el('div', 'limitnote');
      this._card.append(this._title, this._wrap, this._limit, this._empty);
      this.shadowRoot.append(style, this._card);
    }

    static getConfigElement() { return document.createElement(EDITOR_TAG); }

    static getStubConfig(hass, entities) {
      const all = Array.isArray(entities) ? entities : [];
      const lights = all.filter((e) => e.startsWith('light.'));
      return { type: 'custom:' + CARD_TAG, entities: (lights.length ? lights : all).slice(0, 4) };
    }

    setConfig(config) {
      if (!config || typeof config !== 'object') throw new Error('Invalid configuration');
      this._config = config;
      this._eff = effective(config);
      this._engine = createFilterEngine(config.filter);
      this._colorRules = createColorRules(config.color_rules);
      this._cache.clear();
      this._render();
    }

    set hass(hass) {
      setLang(hass);
      const prev = this._hass;
      this._hass = hass;
      if (!this._config) return;
      const dirty = this._engine ? this._engine.update(hass) : false;
      if (prev && prev.language === hass.language && !dirty && this._watch.every((id) => prev.states[id] === hass.states[id])) return;
      this._render();
    }
    get hass() { return this._hass; }

    getCardSize() {
      const n = this._ids.length || 1;
      const l = this._eff ? this._eff.layout : 'tiles';
      const rows = l === 'list' ? n : l === 'chips' ? Math.ceil(n / 4) : l === 'grid' ? Math.ceil(n / 3) : Math.ceil(n / 2);
      return Math.max(1, rows) + (this._config && this._config.title ? 1 : 0);
    }

    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto' }; }

    // Lukker åbne styringer efter en pause (valgfrit). Nulstilles ved enhver berøring af skyderen.
    _armClose() {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
      const sec = this._eff ? Number(this._eff.controls_autoclose) : 0;
      if (!(sec > 0) || !this._ctl.size) return;
      this._closeTimer = setTimeout(() => {
        this._closeTimer = null;
        if (this._busy) { this._armClose(); return; }
        for (const k of this._ctl.keys()) this._cache.delete(k);
        this._ctl.clear(); this._ctlH.clear();
        this._render();
      }, sec * 1000);
    }

    connectedCallback() { if (this._ro && this._wrap) this._ro.observe(this._wrap); this._measure(); }
    disconnectedCallback() { clearTimeout(this._closeTimer); this._closeTimer = null; if (this._ro) this._ro.disconnect(); }

    // Finder tekst, der er for lang, og lader den rulle (kun hvis den ikke passer).
    _measure() {
      if (this._mq) return;
      this._mq = requestAnimationFrame(() => {
        this._mq = 0;
        if (!this._wrap || !this._wrap.isConnected) return;
        for (const m of this._wrap.querySelectorAll('.mq')) {
          const box = m.parentElement;
          const over = Math.ceil(m.scrollWidth - box.clientWidth);
          if (over > 1 && box.clientWidth > 0) {
            m.style.setProperty('--d', String(over));
            m.style.setProperty('--t', Math.max(6, Math.round(over / 18 + 5)) + 's');
            m.classList.add('roll');
          } else { m.classList.remove('roll'); m.style.removeProperty('--d'); }
        }
      });
    }

    _render() {
      const cfg = this._config;
      const eff = this._eff;
      const hass = this._hass;
      const layout = eff.layout;
      this._title.textContent = eff.title || '';
      this._title.style.display = eff.title ? '' : 'none';

      const w = this._wrap;
      const cols = layout === 'tiles' || layout === 'grid' ? Math.round(eff.columns) : 0;
      w.className = 'wrap l-' + layout + ' bg-' + eff.background + ' a-' + eff.align + (eff.align === 'stretch' && layout !== 'list' ? ' stretch' : '') + (cols > 0 ? ' cols' : ' cols0');
      if (eff.color_mode === 'state') w.classList.add('tint');
      w.style.setProperty('--s', String(SCALE[eff.size] || 1));
      w.dataset.sz = eff.size;
      w.style.setProperty('--gap', eff.gap + 'px');
      if (cols > 0) w.style.setProperty('--cols', String(cols)); else w.style.removeProperty('--cols');
      // Eget valg af elementbredde (kun i auto-kolonner); ellers beregnes den ud fra indholdet.
      const iw = Math.round(Number(eff.item_width) || 0);
      if (cols === 0 && (layout === 'tiles' || layout === 'grid') && iw > 0) w.style.setProperty('--minw', iw + 'px'); else w.style.removeProperty('--minw');
      const shape = eff.shape;
      w.style.setProperty('--r', shape === 'pill' ? '999px' : shape === 'square' ? '4px' : shape === 'custom' ? eff.radius + 'px' : 'calc(12px * var(--s))');
      w.style.setProperty('--ir', shape === 'square' ? '6px' : '50%');

      let fids = [];
      if (this._engine && hass) { this._engine.update(hass); fids = this._engine.ids(hass, eff.sort_by, eff.sort_dir); }
      const items = hass ? buildItems(cfg, hass, eff, fids) : [];
      this._ids = items.filter((i) => i.kind === 'entity').map((i) => i.id);
      const shown = groupItems(items, eff, hass, this._folded, cfg.group_rules);
      if (items.limited) {
        // **tekst** i oversættelsen bliver til fed skrift (uden innerHTML)
        const parts = tr('card.limit_note', { n: items.limited.total, m: items.limited.shown, s: tr('label.filter_show_all') }).split('**');
        this._limit.replaceChildren(...parts.map((t, i) => (i % 2 ? el('strong', '', t) : document.createTextNode(t))));
        this._limit.style.display = '';
      } else this._limit.style.display = 'none';
      // Hold øje med alle konfigurerede entiteter, også de skjulte (kun aktive, maks. antal m.m.).
      this._watch = (Array.isArray(cfg.entities) ? cfg.entities : []).map((r) => (typeof r === 'string' ? r : r && (r.entity || r.entity_id))).filter(Boolean);
      // Entiteter, som egne knapper viser styring for, følges også (knappen blokeres, når de er utilgængelige).
      const lists = [cfg.buttons, ...(Array.isArray(cfg.entities) ? cfg.entities : []).map((r) => r && typeof r === 'object' && r.buttons)];
      for (const l of lists) if (Array.isArray(l)) for (const b of l) { const e = ownEntityOf(b); if (e && !this._watch.includes(e)) this._watch.push(e); }
      const ctx = {
        hass, eff, buttons: cfg.buttons, colorRules: this._colorRules,
        toggleGroup: (gkey) => { if (this._folded.has(gkey)) this._folded.delete(gkey); else this._folded.add(gkey); this._render(); },
        run: (node, item, a) => runAction(node, this._hass, item, a),
        ctl: {
          get: (key) => this._ctl.get(key),
          height: (key) => this._ctlH.get(key) || 0,
          toggle: (key, kind, node) => {
            if (this._ctl.get(key) === kind) { this._ctl.delete(key); this._ctlH.delete(key); }
            else { this._ctl.set(key, kind); this._fresh = key; if (node && node.offsetHeight) this._ctlH.set(key, node.offsetHeight); }
            this._cache.delete(key); this._busy = null; this._armClose(); this._render();
            this._fresh = null;
          },
          fresh: (key) => this._fresh === key,
          // Tryk-feedback på enhedens knapper: huskes pr. entitet, så den overlever en gentegning inden for vinduet.
          pressed: (eid) => (this._pressed.get(eid) || { until: 0 }).until > Date.now(),
          press: (eid, node) => {
            const old = this._pressed.get(eid);
            if (old) clearTimeout(old.timer);
            const rec = { node, until: Date.now() + PRESS_FEEDBACK_MS, timer: 0 };
            rec.timer = setTimeout(() => { this._pressed.delete(eid); if (rec.node) rec.node.classList.remove('pressed'); }, PRESS_FEEDBACK_MS);
            this._pressed.set(eid, rec);
          },
          pressNode: (eid, node) => { const r = this._pressed.get(eid); if (r) r.node = node; },
          busy: (key, on) => {
            this._armClose();
            if (on) { this._busy = key; return; }
            if (this._busy !== key) return;
            this._busy = null; this._cache.delete(key); this._render();
          }
        }
      };
      const render = LAYOUTS[layout].render;
      const live = new Set();
      const nodes = shown.map((item) => {
        live.add(item.key);
        if (item.kind === 'group') {
          const sig = [item.label, item.count, item.collapsed, item.foldable, item.size, item.color, item.style, item.align, item.showCount].join('|');
          const gh = this._cache.get(item.key);
          if (gh && gh.stateObj === sig) return gh.node;
          const gn = renderSection(item, ctx);
          this._cache.set(item.key, { stateObj: sig, node: gn });
          return gn;
        }
        if (item.kind !== 'entity') return renderSection(item, ctx);
        const hit = this._cache.get(item.key);
        // Egne knapper, der viser en anden entitets styring, afhænger også af den entitets tilstand.
        const deps = layout === 'chips' ? [] : ownButtonList(ctx, item).map(ownEntityOf).filter(Boolean).map((e) => hass.states[e]);
        const sameDeps = hit && (hit.deps || []).length === deps.length && deps.every((d, i) => d === hit.deps[i]);
        if (hit && ((hit.stateObj === item.stateObj && sameDeps) || this._busy === item.key)) return hit.node;
        const node = render(ctx, item);
        this._cache.set(item.key, { stateObj: item.stateObj, deps, node });
        return node;
      });
      for (const k of [...this._cache.keys()]) if (!live.has(k)) this._cache.delete(k);
      for (const k of [...this._ctl.keys()]) if (!live.has(k)) { this._ctl.delete(k); this._ctlH.delete(k); }

      // Skriv kun til DOM'en, hvis noget er ændret.
      // Rører kun de noder, der skal flyttes: ellers frakobles et element, hvor brugeren trækker i en skyder, når et andet element opdateres.
      const cur = Array.from(w.children);
      if (cur.length !== nodes.length || cur.some((c, i) => c !== nodes[i])) {
        const keep = new Set(nodes);
        for (const c of cur) if (!keep.has(c)) w.removeChild(c);
        nodes.forEach((n, i) => { if (w.children[i] !== n) w.insertBefore(n, w.children[i] || null); });
      }
      // Elementerne får plads til alle knapper på én linje (bredden vokser i stedet for højden).
      let nb = 0;
      for (const n of nodes) if (n.dataset && n.dataset.nb) nb = Math.max(nb, Number(n.dataset.nb));
      w.classList.toggle('has-btns', nb > 0);
      if (nb > 0) w.style.setProperty('--nb', String(nb)); else w.style.removeProperty('--nb');
      // Pladsen pr. knap følger knapstørrelsen (32 px + 6 px mellemrum ved automatisk).
      const bsc = SCALE[eff.button_size];
      if (nb > 0 && bsc) w.style.setProperty('--bw', (32 * bsc / (SCALE[eff.size] || 1) + 6).toFixed(1) + 'px'); else w.style.removeProperty('--bw');

      if (typeof ResizeObserver !== 'undefined') {
        if (!this._ro) { this._ro = new ResizeObserver(() => this._measure()); this._ro.observe(this._wrap); }
      }
      this._measure();

      const none = this._ids.length === 0;
      this._empty.style.display = none && hass ? '' : 'none';
      this._empty.textContent = eff.empty_text || tr('card.empty');
      w.style.display = none ? 'none' : '';

      // Kortets egen stil: gennemsigtighed, ramme, skygge og hjørner (tema er standard).
      const card = this._card;
      const plain = !!eff.card_plain;
      const op = plain ? 0 : Math.min(100, Math.max(0, Math.round(eff.card_opacity)));
      card.classList.toggle('tr', op < 100);
      if (op < 100) card.style.setProperty('--ca', op + '%'); else card.style.removeProperty('--ca');
      const noBorder = plain || eff.hide_border;
      const noShadow = plain || eff.hide_shadow;
      const setOrClear = (prop, v) => { if (v === null) card.style.removeProperty(prop); else card.style.setProperty(prop, v); };
      setOrClear('--ha-card-border-width', noBorder ? '0px' : null);
      setOrClear('border-width', noBorder ? '0' : null);
      setOrClear('--ha-card-box-shadow', noShadow ? 'none' : null);
      setOrClear('box-shadow', noShadow ? 'none' : null);
      const rad = plain ? null : eff.card_corners === 'square' ? '0px' : eff.card_corners === 'custom' ? Math.max(0, eff.card_radius) + 'px' : null;
      setOrClear('--ha-card-border-radius', rad);
      setOrClear('border-radius', rad);
      // Skjul hele kortet, når det er tomt – dog ikke i editorens forhåndsvisning.
      const hide = !!eff.hide_when_empty && none && !!hass && !insideEditorPreview(this);
      this.style.display = hide ? 'none' : '';
    }
  }

  /* ====================================================================
   * 7. VISUEL EDITOR
   * Bygges ud fra indstillingsregistret. Gemmer kun afvigelser fra
   * standard. Sektioner har titel og ikon.
   * ================================================================== */
  // Udklipsholder til regler og knapper i editoren. Deles af alle åbne editorer på siden og huskes, til siden genindlæses.
  const CLIP = { item: null, editors: new Set() };
  function clipSync() { for (const ed of CLIP.editors) if (ed._clipSync) ed._clipSync(); }
  function clipSet(kind, data, label) { CLIP.item = { kind, data, label }; clipSync(); }
  function clipClear() { CLIP.item = null; clipSync(); }

  const EDITOR_CSS = `
    :host { display: block; }
    .ed { display: flex; flex-direction: column; gap: 8px; }
    ha-expansion-panel { display: block; --expansion-panel-content-padding: 0 12px 12px; }
    .hdr { font-size: 15px; font-weight: 500; margin: 0; }
    .hdr.mv { display: flex; align-items: center; gap: 2px; }
    .hdr.mv .move { font-size: 18px; line-height: 1; padding: 2px 8px; }
    .hdr.mv .move:first-of-type { margin-left: auto; }
    button:disabled { opacity: .3; cursor: default; background: none; }
    .body { display: block; padding-top: 4px; }
    .note { color: var(--secondary-text-color); font-size: 13px; padding: 4px 0 8px; }
    .ovr { margin-top: 12px; display: flex; flex-direction: column; gap: 6px; }
    .ovr h4 { margin: 4px 0; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .grp { display: flex; align-items: center; gap: 6px; margin: 10px 0 2px; font-weight: 500; font-size: 13px; color: var(--secondary-text-color); }
    .row { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 14px; }
    .row .nm { flex: 1 1 auto; min-width: 0; }
    .row .val { color: var(--secondary-text-color); display: inline-flex; align-items: center; gap: 6px; max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; border: 1px solid var(--divider-color); }
    button { font: inherit; cursor: pointer; border: none; background: none; color: var(--primary-color); padding: 4px 8px; border-radius: 8px; }
    button.undo { font-size: 18px; line-height: 1; padding: 2px 8px; }
    button:hover { background: color-mix(in srgb, var(--primary-color) 10%, transparent); }
    .acts { display: flex; gap: 8px; align-items: center; padding-top: 8px; }
    .warn { color: var(--error-color); }
    .frules { display: flex; flex-direction: column; gap: 8px; margin: 8px 0; }
    .ctlgrp { display: flex; flex-direction: column; gap: 8px; margin: 0 0 12px; }
    .fgroup { display: flex; flex-direction: column; gap: 8px; }
    .fgroup h4 { margin: 6px 0 0; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .rule { border: 1px solid var(--divider-color); border-radius: 12px; padding: 8px 12px; }
    .rhead { display: flex; align-items: center; justify-content: space-between; font-weight: 500; font-size: 14px; }
    .cond { display: flex; align-items: flex-start; gap: 4px; }
    .cond ha-form { flex: 1 1 auto; min-width: 0; }
    .and { color: var(--secondary-text-color); font-size: 12px; text-transform: uppercase; letter-spacing: .5px; padding: 2px 0; }
    button.rm { font-size: 14px; padding: 4px 8px; margin-top: 6px; }
    .rhead button.rm { margin-top: 0; }
    .rtools { display: inline-flex; align-items: center; gap: 2px; }
    .rtools .move { font-size: 16px; line-height: 1; padding: 2px 8px; }
    button.add { align-self: flex-start; }
    .mrow { display: flex; align-items: center; gap: 4px; border: 1px solid var(--divider-color); border-radius: 12px; padding: 4px 8px 4px 12px; }
    .mrow ha-icon { color: var(--secondary-text-color); --mdc-icon-size: 20px; margin-right: 4px; }
    .mrow ha-form { flex: 1 1 auto; min-width: 0; }
    .mrow .mlabel { flex: 1 1 auto; font-size: 14px; color: var(--secondary-text-color); }
    .mrow .move { font-size: 18px; line-height: 1; padding: 2px 8px; }
    .mrow button.rm { margin-top: 0; }
    .oadd { display: flex; gap: 8px; flex-wrap: wrap; }
    .iovr { margin-bottom: 8px; }
    .irows { display: flex; flex-direction: column; gap: 4px; }
    .ovrow { display: flex; align-items: flex-start; gap: 4px; }
    .ovrow ha-form { flex: 1 1 auto; min-width: 0; }
    .ovrow button.rm { margin-top: 12px; }
    .rule.fold { padding: 0; }
    .rule.fold > .rhead { padding: 8px 12px; cursor: pointer; justify-content: flex-start; gap: 6px; border-radius: 12px; }
    .rule.fold > .rhead:hover { background: color-mix(in srgb, var(--primary-color) 6%, transparent); }
    .rule.fold > .rhead:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .rhead .chev { display: inline-block; width: 14px; flex: 0 0 14px; font-size: 12px; font-weight: 400; color: var(--secondary-text-color); transition: transform .15s; }
    .rule.open > .rhead .chev { transform: rotate(90deg); }
    .rule.fold > .rhead > span:not(.chev):not(.rsum) { flex: 0 0 auto; white-space: nowrap; }
    .rhead .rsum { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 400; font-size: 13px; color: var(--secondary-text-color); }
    .rhead .rsum .dot { vertical-align: -1px; margin-right: 6px; }
    .rule.fold > .rbody { display: none; padding: 4px 12px 10px; border-top: 1px solid var(--divider-color); }
    .rule.fold.open > .rbody { display: block; }
    .rhead button.clipbtn { font-size: 12px; padding: 2px 8px; border: 1px solid var(--divider-color); }
    .curblk { margin: 0 0 12px; }
    .curblk .curhead { margin: 8px 0 0; padding-top: 12px; border-top: 1px solid var(--divider-color); }
    .curblk .curtitle { font-size: 13px; font-weight: 500; }
    .curblk .curhelp { font-size: 12px; color: var(--secondary-text-color); margin: 2px 0 0; }
    .curblk .curcap { font-size: 12px; color: var(--secondary-text-color); margin: 8px 0 0; }
    .curblk .curok { border-left: 3px solid var(--success-color, #43a047); padding: 4px 10px; margin: 0 0 6px; font-size: 12px; color: var(--secondary-text-color); }
    .clipbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 4px 10px; border: 1px dashed var(--divider-color); border-radius: 10px; font-size: 13px; color: var(--secondary-text-color); }
    .clipbar .cliptxt { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .clipbar button.rm { margin-top: 0; }
    .rtools .dup, .rhead .dup { font-size: 16px; line-height: 1; padding: 2px 8px; }
    .ovr .body > .cpsec > h4 { margin: 14px 0 4px; padding-top: 12px; border-top: 1px solid var(--divider-color); font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .cpact { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 4px; }
    .cpact button.go { font-weight: 500; border: 1px solid var(--primary-color); }
    .cpok { color: var(--success-color, #43a047); font-size: 13px; padding-top: 4px; }
    .fbar { display: flex; gap: 4px; justify-content: flex-end; }
    .fbar button { font-size: 12px; padding: 2px 8px; }
    .osum { font-size: 12px; font-weight: 400; color: var(--secondary-text-color); margin-left: 10px; }
    .ogrp { display: flex; align-items: center; gap: 8px; margin: 10px 0 2px; font-size: 12px; color: var(--secondary-text-color); }
    .ogrp::after { content: ''; flex: 1; border-top: 1px dashed var(--divider-color); }
    .ovr .body > h4 { margin: 14px 0 4px; padding-top: 12px; border-top: 1px solid var(--divider-color); }
    .irows:not(:empty) + .oadd { margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--divider-color); }
    .oadd ha-form { flex: 1 1 200px; min-width: 0; }
    .note.intro { padding-bottom: 12px; margin-bottom: 4px; border-bottom: 1px solid var(--divider-color); }
    .fgroup + .fgroup { border-top: 1px solid var(--divider-color); padding-top: 12px; }
    .body > .frules + ha-form, .body > .ctlgrp + ha-form, .body > .gwrap + ha-form { display: block; margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--divider-color); }
    .body > .gwrap[style*="display: none"] + ha-form { margin-top: 0; padding-top: 0; border-top: 0; }
    .gwrap { margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--divider-color); }
    .body > .note.sep { margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--divider-color); }
    .ovr:not(:empty) { padding-top: 12px; border-top: 1px solid var(--divider-color); }
    .ovr > .oadd { margin-top: 4px; padding-top: 8px; border-top: 1px dashed var(--divider-color); }
    .fprev { padding-top: 8px; margin-top: 8px; border-top: 1px solid var(--divider-color); }
    .fprev .warn { color: var(--warning-color, #ff9800); }
    .fprev button { font: inherit; background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 0 0 0 4px; }
    .alldef { color: var(--secondary-text-color); padding: 6px 0; font-size: 14px; }
  `;

  // Sikrer, at HA's editor-komponenter (ha-form m.fl.) er indlæst. Samme trick som Auto Entities bruger.
  async function ensureHelpers() {
    if (customElements.get('ha-form') && customElements.get('ha-expansion-panel')) return true;
    try {
      const helpers = await (window.loadCardHelpers && window.loadCardHelpers());
      const card = helpers && (await helpers.createCardElement({ type: 'entity' }));
      if (card && card.constructor && card.constructor.getConfigElement) await card.constructor.getConfigElement();
    } catch (e) { /* prøver videre nedenfor */ }
    try {
      await Promise.race([
        Promise.all([customElements.whenDefined('ha-form'), customElements.whenDefined('ha-expansion-panel')]),
        new Promise((_, rej) => setTimeout(rej, 4000))
      ]);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Er editoren placeret inde i Auto Entities' editor? Går op gennem shadow DOM.
  function insideAutoEntities(node) {
    let n = node;
    while (n) {
      if (n.localName && n.localName.indexOf('auto-entities') === 0) return true;
      n = n.parentNode || n.host;
    }
    return false;
  }

  function insideEditorPreview(node) {
    let n = node;
    while (n) {
      const t = n.tagName ? n.tagName.toLowerCase() : '';
      if (t === 'hui-card-preview' || t === 'hui-card-element-editor' || t === 'hui-dialog-edit-card') return true;
      n = n.parentNode || n.host;
    }
    return false;
  }

  function displayValue(s, v) {
    if (s.type === 'select') return tr('o.' + s.key + '.' + v);
    if (s.type === 'boolean') return v ? tr('ui.on') : tr('ui.off');
    if (s.type === 'number') return v + (s.unit ? (s.unit === 'percent' ? '' : ' ') + tr('ui.' + s.unit) : '');
    if (s.type === 'multiselect') {
      v = normMulti(s, v, 'tiles');
      return v.length ? v.map((o) => tr('o.' + s.key + '.' + o)).join(' · ') : tr('o.secondary_info.none');
    }
    if (s.type === 'action') return tr('o.action.' + (v && v.action ? v.action : 'none'));
    return v === '' || v === undefined ? tr('o.secondary_info.none') : String(v);
  }

  class CurioCardEditor extends HTMLElement {
    constructor() {
      super();
      this._config = { type: 'custom:' + CARD_TAG };
      this._hass = null;
      this._ready = false;
      this._open = { entities: true };
      this._panels = new Map();
      this._forms = new Map();
      this._rowOpen = new Set(); // åbne rækker i editoren (liste + placering), så de ikke klapper sammen når felterne bygges om
      this._ovrPanels = new Map();
      this._ovrSum = new Map();
      this._ovrKey = '';
      this._confirmReset = false;
      this.attachShadow({ mode: 'open' });
    }

    set hass(h) {
      setLang(h);
      this._hass = h;
      this._forms.forEach((f) => { f.hass = h; });
      if (this._curBlocks) for (const b of [...this._curBlocks]) { if (b.el.isConnected) b.update(); else this._curBlocks.delete(b); }
      // Forhåndsvisningen genberegnes ikke ved hver tilstandsændring (skåner HA); kun første gang og når reglerne ændres.
      if (this._ready && this._open.filter && !this._pvHass) { this._pvHass = true; this._updatePreview(); }
    }
    get hass() { return this._hass; }

    setConfig(config) {
      this._config = { ...(config || {}) };
      // Entiteter er foldet sammen fra start, når der allerede er entiteter (første gang editoren åbnes).
      // Kan komme både før og efter at editoren er bygget, og HA kan først sende den rigtige konfiguration lidt senere:
      // indtil brugeren selv folder sektionen ud/sammen, følger den om der er entiteter.
      if (!this._touched) {
        this._open.entities = !(Array.isArray(this._config.entities) && this._config.entities.length);
        const ep = this._panels.get('entities');
        if (ep && ep.expanded !== this._open.entities) ep.expanded = this._open.entities;
      }
      if (this._ready) this._refresh();
    }

    connectedCallback() { CLIP.editors.add(this); if (!this._started) { this._started = true; this._start(); } }

    disconnectedCallback() { CLIP.editors.delete(this); }

    async _start() {
      const root = this.shadowRoot;
      const style = document.createElement('style');
      style.textContent = EDITOR_CSS;
      this._root = el('div', 'ed');
      root.append(style, this._root);
      const ok = await ensureHelpers();
      if (!ok) { this._root.appendChild(el('div', 'note', tr('ui.editor_unavailable'))); return; }
      this._build();
      this._ready = true;
      this._refresh();
    }

    // Kontakt under en handlingsvælger: «Ram elementets egen entitet (current)». Vises kun for «Kald handling».
    // defs: [{ label, get(), set(action) }]. Bygges kun om, når noget af det viste ændrer sig (så fokus ikke mistes).
    _curBlock(defs, withHead) {
      const box = el('div', 'curblk');
      let sig = null;
      const update = () => {
        const rows = defs.map((d) => ({ d, a: d.get() })).filter((r) => isParamAction(r.a));
        rows.forEach((r) => { r.fields = entityFieldsOf(this._hass, r.a); });
        const s = JSON.stringify(rows.map((r) => [r.d.label, curTargetOn(r.a), curUsed(r.a), r.fields.map((x) => [x.key, x.name, curDataOn(r.a, x.key)])]));
        if (s === sig) return;
        sig = s;
        box.replaceChildren();
        if (withHead && rows.length) {
          const hd = el('div', 'curhead');
          hd.append(el('div', 'curtitle', tr('ui.cur_head')), el('div', 'curhelp', tr(defs.length > 1 ? 'ui.cur_head_help' : 'ui.cur_head_help1')));
          box.appendChild(hd);
        }
        for (const r of rows) {
          const wrap = el('div', 'curow');
          if (defs.length > 1) wrap.appendChild(el('div', 'curcap', r.d.label));
          const f = document.createElement('ha-form');
          f.schema = [{ name: 'cur', selector: { boolean: {} } }];
          f.computeLabel = () => tr('label.cur_target');
          f.computeHelper = () => tr('help.cur_target');
          f.hass = this._hass;
          f.data = { cur: curTargetOn(r.a) };
          f.addEventListener('value-changed', (e) => { e.stopPropagation(); r.d.set(curTargetSet(r.d.get(), !!(e.detail.value && e.detail.value.cur))); });
          wrap.appendChild(f);
          for (const fd of r.fields) {
            const g = document.createElement('ha-form');
            g.schema = [{ name: 'cur', selector: { boolean: {} } }];
            g.computeLabel = () => tr('label.cur_data', { f: fd.name });
            g.computeHelper = () => tr('help.cur_data');
            g.hass = this._hass;
            g.data = { cur: curDataOn(r.a, fd.key) };
            g.addEventListener('value-changed', (e) => { e.stopPropagation(); r.d.set(curDataSet(r.d.get(), fd.key, !!(e.detail.value && e.detail.value.cur))); });
            wrap.appendChild(g);
          }
          if (curUsed(r.a)) wrap.appendChild(el('div', 'note curok', tr(curTargetOn(r.a) ? 'ui.cur_ok' : 'ui.cur_ok_data')));
          box.appendChild(wrap);
        }
      };
      update();
      const blk = { el: box, update };
      (this._curBlocks || (this._curBlocks = new Set())).add(blk);
      return blk;
    }

    _panel(id, icon, titleText, openDefault) {
      const p = document.createElement('ha-expansion-panel');
      p.setAttribute('outlined', '');
      p.expanded = openDefault !== undefined ? openDefault : !!this._open[id];
      const ic = document.createElement('ha-icon');
      ic.setAttribute('icon', icon);
      ic.slot = 'leading-icon';
      const h = el('h3', 'hdr', titleText);
      h.slot = 'header';
      const body = el('div', 'body');
      p.append(ic, h, body);
      p.addEventListener('expanded-changed', (e) => { if (e.target === p) { this._open[id] = !!(e.detail && e.detail.expanded); if (id === 'entities') this._touched = true; } });
      return { p, body, header: h };
    }

    _build() {
      for (const sec of SECTIONS) {
        const { p, body } = this._panel(sec.id, sec.icon, tr('section.' + sec.id));
        this._panels.set(sec.id, p);
        const form = document.createElement('ha-form');
        form.computeLabel = (sch) => tr('label.' + sch.name);
        form.computeHelper = (sch) => this._helper(sch.name);
        form.addEventListener('value-changed', (e) => { e.stopPropagation(); this._onForm(sec.id, e.detail.value); });
        this._forms.set(sec.id, form);
        if (sec.id === 'entities') {
          this._aeNote = el('div', 'note', tr('ui.ae_note'));
          this._ovr = el('div', 'ovr');
          body.append(this._aeNote, form, this._ovr);
        } else if (sec.id === 'colors') {
          this._cbody = el('div', 'frules');
          body.append(el('div', 'note intro', tr('ui.colors_intro')), this._cbody);
        } else if (sec.id === 'grouping') {
          // Reglerne til egne grupper står lige under 'Gruppér efter'; resten af valgene kommer under dem.
          const formB = document.createElement('ha-form');
          formB.computeLabel = (sch) => tr('label.' + sch.name);
          formB.computeHelper = (sch) => this._helper(sch.name);
          formB.addEventListener('value-changed', (e) => { e.stopPropagation(); this._onForm('grouping', e.detail.value); });
          this._forms.set('grouping:more', formB);
          this._gbody = el('div', 'frules');
          this._gwrap = el('div', 'gwrap');
          this._gwrap.append(el('div', 'note', tr('ui.group_intro')), this._gbody);
          body.append(form, this._gwrap, formB);
        } else if (sec.id === 'buttons') {
          this._bbody = el('div', 'frules');
          this._bintro = el('div', 'note sep', tr('ui.buttons_intro'));
          this._cwrap = el('div', 'ctlgrp');
          body.append(this._cwrap, form, this._bintro, this._bbody);
        } else if (sec.id === 'interaction') {
          this._curA = this._curBlock(['tap_action', 'hold_action', 'double_tap_action', 'icon_tap_action', 'icon_hold_action', 'icon_double_tap_action'].map((k) => ({
            label: tr('label.' + k),
            get: () => effective(this._config)[k],
            set: (a) => this._onForm('interaction', { [k]: a })
          })), true);
          body.append(form, this._curA.el);
        } else if (sec.id === 'filter') {
          this._fbody = el('div', 'frules');
          this._fprev = el('div', 'note fprev');
          body.append(el('div', 'note intro', tr('ui.filter_intro')), this._fbody, form, this._fprev);
        } else if (sec.id === 'appearance') {
          this._iwrap = el('div', 'ctlgrp');
          body.append(this._iwrap, form);
        } else body.appendChild(form);
        this._root.appendChild(p);
      }
      const c = this._panel('changed', 'mdi:history', '', false);
      this._changed = c;
      this._panels.set('changed', c.p);
      this._root.appendChild(c.p);
      this._root.appendChild(el('div', 'note', 'Curio Card ' + CURIO_VERSION));
      this._root.querySelectorAll('ha-form').forEach((f) => { f.hass = this._hass; });
    }

    _helper(key) {
      const s = SETTING_BY_KEY[key];
      const base = tr('help.' + key, { n: FILTER_LIMIT });
      if (!s || s.type === 'action') return base;
      const d = defOf(s, layoutOf(this._config));
      const shown = s.type === 'color' ? (d || tr('o.secondary_info.none')) : displayValue(s, d);
      return base + ' ' + tr('ui.default_is', { v: shown });
    }

    _schema(secId, eff) {
      if (secId === 'entities') return [{ name: 'entities', selector: { entity: { multiple: true } } }];
      const out = [];
      for (const s of SETTINGS) {
        if (s.section !== secId || !isRelevant(s, eff)) continue;
        let selector;
        switch (s.type) {
          case 'select': selector = { select: { mode: 'dropdown', options: (s.optionsFor ? s.optionsFor(eff.layout) : s.options).map((v) => ({ value: v, label: tr('o.' + s.key + '.' + v) })) } }; break;
          case 'multiselect': selector = { select: { multiple: true, mode: 'list', options: s.options.map((v) => ({ value: v, label: tr('o.' + s.key + '.' + v) })) } }; break;
          case 'boolean': selector = { boolean: {} }; break;
          case 'number': selector = { number: { min: s.min, max: s.max, step: s.step, mode: s.mode || 'box', unit_of_measurement: s.unit ? tr('ui.' + s.unit) : undefined } }; break;
          case 'color': selector = { ui_color: { include_state: false } }; break;
          case 'action': selector = { ui_action: {} }; break;
          default: selector = { text: {} };
        }
        out.push({ name: s.key, selector });
      }
      return out;
    }

    _refresh() {
      const cfg = this._config;
      const eff = effective(cfg);
      const layout = eff.layout;
      const srcMode = eff.data_source;
      const inAE = srcMode === 'auto_entities' || (srcMode === 'auto' && insideAutoEntities(this));
      for (const sec of SECTIONS) {
        const form = this._forms.get(sec.id);
        const panel = this._panels.get(sec.id);
        const schema = this._schema(sec.id, eff);
        if (sec.id === 'entities') {
          const raw = Array.isArray(cfg.entities) ? cfg.entities : [];
          const ids = raw.map((r) => (typeof r === 'string' ? r : r && (r.entity || r.entity_id))).filter(Boolean);
          form.data = { entities: ids };
          panel.style.display = inAE ? 'none' : '';
          this._aeNote.style.display = 'none';
          this._renderOverrides();
          this._ovrSum.forEach((fn) => fn());
        } else {
          const data = {};
          for (const s of SETTINGS) if (s.section === sec.id) data[s.key] = eff[s.key];
          form.data = data;
        }
        if (sec.id === 'grouping') {
          const formB = this._forms.get('grouping:more');
          form.schema = schema.filter((x) => x.name === 'group_by');
          formB.schema = schema.filter((x) => x.name !== 'group_by');
          formB.data = form.data;
          formB.hass = this._hass;
          this._gwrap.style.display = eff.group_by === 'custom' ? '' : 'none';
          if (eff.group_by === 'custom') this._renderGroups();
        } else if (sec.id === 'buttons') {
          form.schema = schema.filter((x) => x.name !== 'controls');
          this._renderControls(eff);
        } else if (sec.id === 'appearance') {
          form.schema = schema.filter((x) => x.name !== 'secondary_info');
          this._renderInfo(eff);
        } else form.schema = schema;
        if (sec.id === 'filter') { panel.style.display = inAE ? 'none' : ''; this._renderFilter(eff); }
        else if (sec.id === 'colors') { panel.style.display = ''; this._renderColors(); }
        else if (sec.id === 'buttons') { panel.style.display = ''; this._bintro.style.display = this._bbody.style.display = layout === 'chips' ? 'none' : ''; this._renderButtons(); }
        else if (sec.id !== 'entities') panel.style.display = schema.length ? '' : 'none';
      }
      if (this._curA) this._curA.update();
      this._renderChanged(eff);
    }

    /* ---------- Grupperet valg (styringer og sekundære oplysninger): kun de typer der findes i kortet ---------- */
    _presentInfo() {
      const hass = this._hass;
      const domains = new Set();
      const ids = [];
      for (const r of Array.isArray(this._config.entities) ? this._config.entities : []) {
        const id = typeof r === 'string' ? r : r && (r.entity || r.entity_id);
        if (id) { domains.add(String(id).split('.')[0]); ids.push(String(id)); }
      }
      const f = this._filterCfg();
      const fkey = JSON.stringify(f);
      if (fkey !== this._pdKey) { this._pdKey = fkey; this._pdEngine = createFilterEngine(f); }
      if (this._pdEngine && hass && hass.states) {
        this._pdEngine.update(hass);
        for (const id of this._pdEngine.ids(hass, 'entity_id', 'asc')) { domains.add(id.split('.')[0]); ids.push(id); }
      }
      return { domains, ids };
    }


    // Fælles byggeklods: foldbare grupper med afkrydsning, kun de typer der findes i kortet (eller er valgt), og en kontakt til alle typer.
    _renderPick(spec, eff) {
      const S = spec.setting;
      const sel = normMulti(S, eff[S.key], eff.layout);
      const pres = this._presentInfo();
      const all = !!this[spec.allFlag] || pres.domains.size === 0; // et tomt kort viser alle typer
      const isPresent = (g) => g.always || g.domains.some((d) => pres.domains.has(d)) || (g.device && this._hass && pres.ids.some((id) => g.device.some((k) => deviceSensor(this._hass, id, DEVICE_SENSOR_CLASSES[k]))));
      const groups = spec.groups.filter((g) => all || isPresent(g) || g.options.some((o) => sel.includes(o)));
      const canToggle = pres.domains.size > 0 && (this[spec.allFlag] || groups.length < spec.groups.length);
      const struct = JSON.stringify([groups.map((g) => g.id), canToggle, !!this[spec.allFlag]]);
      const short = (o) => { const t = tr('o.' + S.key + '.' + o).replace(/^[^:]*:\s*/, ''); return t.charAt(0).toUpperCase() + t.slice(1); };
      const keyOf = (g) => spec.prefix + ':' + g.id;
      if (struct !== this[spec.structKey]) {
        this[spec.structKey] = struct;
        for (const k of [...this._forms.keys()]) if (k.indexOf(spec.prefix + ':') === 0) this._forms.delete(k);
        spec.wrap.replaceChildren(el('div', 'note', tr(spec.intro)));
        if (canToggle) {
          const f = document.createElement('ha-form');
          f.schema = [{ name: 'all', selector: { boolean: {} } }];
          f.computeLabel = () => tr('ui.ctl_all');
          f.computeHelper = () => tr('ui.ctl_all_help');
          f.hass = this._hass;
          f.addEventListener('value-changed', (e) => { e.stopPropagation(); this[spec.allFlag] = !!(e.detail.value && e.detail.value.all); this._refresh(); });
          this._forms.set(spec.prefix + ':all', f);
          spec.wrap.appendChild(f);
        }
        if (!groups.length) spec.wrap.appendChild(el('div', 'note', tr(spec.none)));
        for (const g of groups) {
          const id = keyOf(g);
          const open = id in this._open ? !!this._open[id] : isPresent(g) || g.options.some((o) => sel.includes(o));
          const { p, body, header } = this._panel(id, g.icon, '', open);
          header.dataset.g = spec.prefix + ':' + g.id;
          const form = document.createElement('ha-form');
          form.schema = [{ name: 'v', selector: { select: { multiple: true, mode: 'list', options: g.options.map((o) => ({ value: o, label: short(o) })) } } }];
          form.computeLabel = () => '';
          form.hass = this._hass;
          form.addEventListener('value-changed', (e) => {
            e.stopPropagation();
            const mine = (e.detail.value && e.detail.value.v) || [];
            const cur = normMulti(S, effective(this._config)[S.key], layoutOf(this._config));
            this._onForm(S.section, { [S.key]: S.options.filter((o) => (g.options.includes(o) ? mine.includes(o) : cur.includes(o))) });
          });
          body.appendChild(form);
          this._forms.set(id, form);
          spec.wrap.appendChild(p);
        }
      }
      for (const g of groups) {
        const form = this._forms.get(keyOf(g));
        const mine = sel.filter((o) => g.options.includes(o));
        if (!deepEq(form.data && form.data.v, mine)) form.data = { v: mine };
        const h = spec.wrap.querySelector('[data-g="' + keyOf(g) + '"]');
        if (h) h.textContent = tr(g.label) + (mine.length ? ' (' + mine.length + ')' : '');
      }
      const af = this._forms.get(spec.prefix + ':all');
      if (af) af.data = { all: !!this[spec.allFlag] };
    }

    _renderControls(eff) {
      this._renderPick({ setting: SETTING_BY_KEY.controls, groups: CONTROL_GROUPS.map((g) => ({ ...g, label: 'ui.ctlg_' + g.id })), wrap: this._cwrap, prefix: 'ctlg', allFlag: '_ctlAll', structKey: '_cStruct', intro: 'ui.ctl_intro', none: 'ui.ctl_none' }, eff);
    }

    _renderInfo(eff) {
      this._renderPick({ setting: SETTING_BY_KEY.secondary_info, groups: INFO_GROUPS, wrap: this._iwrap, prefix: 'infog', allFlag: '_infoAll', structKey: '_iStruct', intro: 'ui.info_intro', none: 'ui.info_none' }, eff);
    }

    /* ---------- Egne knapper ---------- */
    _buttonsCfg() { return Array.isArray(this._config.buttons) ? this._config.buttons : []; }

    _setButtons(list, structural) {
      const cfg = { ...this._config };
      if (list.length) cfg.buttons = list; else delete cfg.buttons;
      this._config = cfg;
      if (!structural) this._bKey = JSON.stringify(list);
      fire(this, 'config-changed', { config: cfg });
      this._refresh();
    }

    /* ---------- Farveregler ---------- */
    _renderColors() {
      if (!this._colorEd) {
        this._colorEd = this._ruleEditor(this._cbody, {
          prefix: 'cr',
          get: () => (Array.isArray(this._config.color_rules) ? this._config.color_rules : []),
          set: (list) => {
            const cfg = { ...this._config };
            if (list.length) cfg.color_rules = list; else delete cfg.color_rules;
            this._config = cfg;
            fire(this, 'config-changed', { config: cfg });
          }
        });
      } else this._colorEd.refresh();
    }

    /* ---------- Egne grupper ---------- */
    _renderGroups() {
      if (!this._groupEd) {
        this._groupEd = this._ruleEditor(this._gbody, {
          prefix: 'gr',
          kind: 'group',
          get: () => (Array.isArray(this._config.group_rules) ? this._config.group_rules : []),
          set: (list) => {
            const cfg = { ...this._config };
            if (list.length) cfg.group_rules = list; else delete cfg.group_rules;
            this._config = cfg;
            fire(this, 'config-changed', { config: cfg });
          }
        });
      } else this._groupEd.refresh();
    }

    /* ---------- Udklipsholder: Kopiér på en regel/knap og «Sæt ind her» i lister af samme slags ---------- */
    _clipBtn(kind, get, label) {
      const b = el('button', 'clipbtn', tr('ui.clip_copy'));
      b.type = 'button';
      b.title = tr('ui.clip_copy_hint');
      b.addEventListener('click', () => clipSet(kind, JSON.parse(JSON.stringify(get())), tr('ui.clip_' + kind) + ' «' + label() + '»'));
      return b;
    }

    _clipBar(kind, paste) {
      const bar = el('div', 'clipbar');
      bar.dataset.clip = kind;
      const go = el('button', 'add', '+ ' + tr('ui.clip_paste'));
      go.type = 'button';
      go.addEventListener('click', () => { if (CLIP.item && CLIP.item.kind === kind) paste(JSON.parse(JSON.stringify(CLIP.item.data))); });
      const x = el('button', 'rm', '✕');
      x.type = 'button';
      x.title = tr('ui.clip_clear');
      x.addEventListener('click', clipClear);
      bar.append(el('span', 'cliptxt'), go, x);
      this._clipBarUpdate(bar);
      return bar;
    }

    _clipBarUpdate(bar) {
      const c = CLIP.item;
      const show = !!c && c.kind === bar.dataset.clip;
      bar.style.display = show ? '' : 'none';
      if (show) bar.querySelector('.cliptxt').textContent = tr('ui.clip_has') + ': ' + c.label;
    }

    _clipSync() {
      if (!this._root) return;
      this._root.querySelectorAll('.clipbar').forEach((b) => this._clipBarUpdate(b));
    }

    // Foldbare rækker i regel- og knaplister. Åben/lukket gemmes pr. liste og placering, så en række ikke klapper sammen, når felterne bygges om.
    _foldRow(rb, head, id, info) {
      const body = el('div', 'rbody');
      while (head.nextSibling) body.appendChild(head.nextSibling);
      rb.appendChild(body);
      const title = head.firstChild;
      head.prepend(el('span', 'chev', '▸'));
      const sum = el('span', 'rsum');
      if (info && info.color) { const d = el('span', 'dot'); d.style.background = resolveColor(info.color); sum.appendChild(d); }
      if (info && info.text) sum.appendChild(document.createTextNode(info.text));
      title.after(sum);
      rb.classList.add('fold');
      rb.dataset.fid = id;
      head.setAttribute('role', 'button');
      head.tabIndex = 0;
      const set = (v) => {
        rb.classList.toggle('open', v);
        head.setAttribute('aria-expanded', v ? 'true' : 'false');
        if (v) this._rowOpen.add(id); else this._rowOpen.delete(id);
      };
      rb._foldSet = set;
      set(this._rowOpen.has(id));
      head.addEventListener('click', (e) => { if (e.target.closest('button')) return; set(!rb.classList.contains('open')); });
      head.addEventListener('keydown', (e) => { if (e.target === head && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); set(!rb.classList.contains('open')); } });
    }

    // Når en række fjernes eller flyttes, følger åben-tilstanden med.
    _rowDrop(prefix, i) {
      const keep = new Set();
      for (const id of this._rowOpen) {
        const m = id.indexOf(prefix + ':') === 0 && /^\d+$/.test(id.slice(prefix.length + 1)) ? Number(id.slice(prefix.length + 1)) : -1;
        if (m < 0) keep.add(id); else if (m < i) keep.add(id); else if (m > i) keep.add(prefix + ':' + (m - 1));
      }
      this._rowOpen = keep;
    }

    // En række sættes ind på plads i: de efterfølgende rækkers åben-tilstand rykker med.
    _rowIns(prefix, i) {
      const out = new Set();
      for (const id of this._rowOpen) {
        const m = id.indexOf(prefix + ':') === 0 && /^\d+$/.test(id.slice(prefix.length + 1)) ? Number(id.slice(prefix.length + 1)) : -1;
        out.add(m >= i ? prefix + ':' + (m + 1) : id);
      }
      this._rowOpen = out;
    }

    // De nøgler på en entitet, som er overstyringer af kortets indstillinger (ikke navn og ikon).
    _ovrKeysOf(o) {
      return Object.keys(o).filter((k) => k === 'hide_buttons' || (ITEM_KEYS.has(k) && k !== 'name' && k !== 'icon'));
    }

    _rowSwap(prefix, a, b) {
      const ia = prefix + ':' + a, ib = prefix + ':' + b;
      const wa = this._rowOpen.has(ia), wb = this._rowOpen.has(ib);
      this._rowOpen.delete(ia); this._rowOpen.delete(ib);
      if (wa) this._rowOpen.add(ib);
      if (wb) this._rowOpen.add(ia);
    }

    // Små knapper øverst i en liste med to eller flere foldbare rækker.
    _foldBar(host) {
      const rows = host.querySelectorAll(':scope > .rule.fold');
      if (rows.length < 2) return;
      const bar = el('div', 'fbar');
      for (const [open, k] of [[false, 'ui.fold_all_in'], [true, 'ui.fold_all_out']]) {
        const b = el('button', '', tr(k));
        b.type = 'button';
        b.addEventListener('click', () => rows.forEach((r) => r._foldSet(open)));
        bar.appendChild(b);
      }
      host.prepend(bar);
    }

    // Kort tekst om betingelserne i en regel, til den foldede række.
    _condText(rule) {
      const conds = rule && Array.isArray(rule.conditions) ? rule.conditions : [];
      return conds.map((c) => {
        const f = c.field === 'attribute' && c.attribute ? c.attribute : tr('o.field.' + c.field);
        const v = c.value === undefined || c.value === null ? '' : String(c.value);
        return (f + ' ' + tr('o.operator.' + c.operator) + (v ? ' ' + v : '')).trim();
      }).join(' ' + tr('ui.and') + ' ');
    }

    // Regelbygger (betingelser + farve) brugt til farveregler, både for kortet og pr. entitet, og til egne grupper.
    _ruleEditor(host, o) {
      let lastKey = null;
      const mkBtn = (text, fn, cls) => { const b = el('button', cls || '', text); b.type = 'button'; b.addEventListener('click', fn); return b; };
      const G = o.kind === 'group';
      const newCond = () => (G ? { field: 'domain', operator: 'is', value: '' } : { field: 'state', operator: 'lt', value: '' });
      const commit = (list, structural) => {
        lastKey = JSON.stringify(list);
        o.set(list);
        if (structural) render();
      };
      const render = () => {
        for (const k of [...this._forms.keys()]) if (k.indexOf(o.prefix + ':') === 0) this._forms.delete(k);
        host.replaceChildren();
        const list = o.get();
        lastKey = JSON.stringify(list);
        list.forEach((rule, ri) => {
          const conds = rule && Array.isArray(rule.conditions) ? rule.conditions : [];
          const rb = el('div', 'rule');
          const head = el('div', 'rhead');
          const rm = mkBtn('✕', () => { this._rowDrop(o.prefix, ri); commit(o.get().filter((_, i) => i !== ri), true); }, 'rm');
          rm.title = tr('ui.remove_rule');
          const title = el('span', '', G && rule.name ? rule.name : tr(G ? 'ui.group_rule_n' : 'ui.color_rule_n', { n: ri + 1 }));
          const clipB = () => this._clipBtn(G ? 'group' : 'color', () => o.get()[ri], () => (G && rule.name ? rule.name : this._condText(rule)));
          const dupBtn = () => {
            const b = mkBtn('⧉', () => {
              const cur = o.get();
              this._rowIns(o.prefix, ri + 1);
              this._rowOpen.add(o.prefix + ':' + (ri + 1));
              commit([...cur.slice(0, ri + 1), JSON.parse(JSON.stringify(cur[ri])), ...cur.slice(ri + 1)], true);
            }, 'dup');
            b.title = tr('ui.dup_rule');
            return b;
          };
          if (G) {
            const tools = el('span', 'rtools');
            for (const [dir, label, key] of [[-1, '↑', 'ui.move_up'], [1, '↓', 'ui.move_down']]) {
              const b = mkBtn(label, () => {
                const cur = o.get().slice(); const j = ri + dir;
                if (j < 0 || j >= cur.length) return;
                [cur[ri], cur[j]] = [cur[j], cur[ri]];
                this._rowSwap(o.prefix, ri, j);
                commit(cur, true);
              }, 'move');
              b.title = tr(key);
              if ((dir < 0 && ri === 0) || (dir > 0 && ri === list.length - 1)) b.disabled = true;
              tools.appendChild(b);
            }
            tools.append(clipB(), dupBtn(), rm);
            head.append(title, tools);
          } else head.append(title, clipB(), dupBtn(), rm);
          rb.appendChild(head);
          conds.forEach((cond, ci) => {
            if (ci) rb.appendChild(el('div', 'and', tr('ui.and')));
            const row = el('div', 'cond');
            const form = document.createElement('ha-form');
            form.computeLabel = (sch) => tr('label.c_' + sch.name);
            form.hass = this._hass;
            form.schema = this._condSchema(cond);
            form.data = { field: cond.field, operator: cond.operator, attribute: cond.attribute || '', value: cond.value === undefined ? '' : cond.value };
            form.addEventListener('value-changed', (e) => {
              e.stopPropagation();
              const v = e.detail.value || {};
              form.data = v;
              const cur = o.get();
              const old = cur[ri].conditions[ci];
              const next = { field: v.field || old.field, operator: v.operator || old.operator, value: v.value === undefined || v.value === null ? '' : v.value };
              const nf = FIELD_BY_ID[next.field];
              if (OPERATOR_BY_ID[next.operator] && OPERATOR_BY_ID[next.operator].numeric && !(nf && nf.numeric)) next.operator = 'is';
              if (next.field === 'attribute') next.attribute = v.attribute || '';
              const structural = next.field !== old.field || next.operator !== old.operator;
              const conds2 = cur[ri].conditions.slice(); conds2[ci] = next;
              commit(cur.map((r, i) => (i === ri ? { ...r, conditions: conds2 } : r)), structural);
            });
            this._forms.set(o.prefix + ':' + ri + ':' + ci, form);
            const crm = mkBtn('✕', () => {
              const cur = o.get();
              const left = cur[ri].conditions.filter((_, i) => i !== ci);
              if (!left.length) this._rowDrop(o.prefix, ri);
              commit(left.length ? cur.map((r, i) => (i === ri ? { ...r, conditions: left } : r)) : cur.filter((_, i) => i !== ri), true);
            }, 'rm');
            crm.title = tr('ui.remove_condition');
            row.append(form, crm);
            rb.appendChild(row);
          });
          rb.appendChild(mkBtn('+ ' + tr('ui.add_condition'), () => {
            const cur = o.get();
            commit(cur.map((r, i) => (i === ri ? { ...r, conditions: [...(r.conditions || []), newCond()] } : r)), true);
          }, 'add'));
          const rf = document.createElement('ha-form');
          rf.computeLabel = (sch) => tr('label.r_' + sch.name);
          rf.hass = this._hass;
          const selOpts = (list, key) => ({ select: { mode: 'dropdown', options: list.map((x) => ({ value: x, label: tr('o.' + key + '.' + x) })) } });
          if (G) {
            rf.schema = [{ name: 'name', selector: { text: {} } }, { name: 'color', selector: { ui_color: { include_state: false } } }];
            rf.data = { name: rule.name || '', color: rule.color || '' };
          } else {
            rf.schema = [
              { name: 'color', selector: { ui_color: { include_state: false } } },
              { name: 'animation', selector: selOpts(['none', ...ANIMATIONS], 'animation') },
              ...(rule.animation ? [{ name: 'speed', selector: selOpts(['slow', 'normal', 'fast'], 'speed') }] : []),
              { name: 'affects', selector: selOpts(['all', 'icon', 'indicator'], 'affects') }
            ];
            rf.data = { color: rule.color || '', animation: rule.animation || 'none', speed: rule.speed || 'normal', affects: rule.affects || 'all' };
          }
          rf.addEventListener('value-changed', (e) => {
            e.stopPropagation();
            const v = e.detail.value || {};
            rf.data = v;
            const cur = o.get();
            const next = { ...cur[ri] };
            if (G) {
              if (v.name) next.name = String(v.name); else delete next.name;
              if (v.color) next.color = v.color; else delete next.color;
              commit(cur.map((r, i) => (i === ri ? next : r)), false);
              return;
            }
            if (v.color) next.color = v.color; else delete next.color;
            if (v.affects && v.affects !== 'all') next.affects = v.affects; else delete next.affects;
            if (v.animation && v.animation !== 'none') next.animation = v.animation; else { delete next.animation; delete next.speed; }
            if (next.animation && v.speed && v.speed !== 'normal') next.speed = v.speed; else delete next.speed;
            // Hastighedsfeltet vises kun med en animation, så skemaet skal bygges om, når det skifter
            commit(cur.map((r, i) => (i === ri ? next : r)), (cur[ri].animation || 'none') !== (next.animation || 'none'));
          });
          this._forms.set(o.prefix + ':' + ri + ':r', rf);
          rb.appendChild(rf);
          this._foldRow(rb, head, o.prefix + ':' + ri, { color: rule.color, text: [this._condText(rule), !G && rule.animation ? tr('o.animation.' + rule.animation) : ''].filter(Boolean).join(' · ') });
          host.appendChild(rb);
        });
        host.appendChild(mkBtn('+ ' + tr(G ? 'ui.add_group_rule' : 'ui.add_color_rule'), () => { this._rowOpen.add(o.prefix + ':' + o.get().length); commit([...o.get(), G ? { conditions: [newCond()] } : { conditions: [newCond()], color: 'red' }], true); }, 'add'));
        host.appendChild(this._clipBar(G ? 'group' : 'color', (item) => { this._rowOpen.add(o.prefix + ':' + o.get().length); commit([...o.get(), item], true); }));
        this._foldBar(host);
      };
      render();
      return { refresh: () => { if (JSON.stringify(o.get()) !== lastKey) render(); } };
    }

    _renderButtons() {
      const key = JSON.stringify(this._buttonsCfg());
      if (key === this._bKey) return;
      this._bKey = key;
      this._buttonList(this._bbody, { prefix: 'b', get: () => this._buttonsCfg(), set: (list, structural) => this._setButtons(list, structural) }).render();
    }

    // Byggeklods til egne knapper: bruges både til kortets knapper og til knapperne på én entitet.
    _buttonList(box, o) {
      const render = () => {
        for (const k of [...this._forms.keys()]) if (k.indexOf(o.prefix + ':') === 0) this._forms.delete(k);
        box.replaceChildren();
        const list = o.get();
        list.forEach((b, i) => {
          const rb = el('div', 'rule');
          const head = el('div', 'rhead');
          const rm = el('button', 'rm', '✕');
          rm.type = 'button';
          rm.title = tr('ui.remove_button');
          rm.addEventListener('click', () => { this._rowDrop(o.prefix, i); o.set(o.get().filter((_, j) => j !== i), true); });
          const dup = el('button', 'dup', '⧉');
          dup.type = 'button';
          dup.title = tr('ui.dup_rule');
          dup.addEventListener('click', () => {
            const cur = o.get();
            this._rowIns(o.prefix, i + 1);
            this._rowOpen.add(o.prefix + ':' + (i + 1));
            o.set([...cur.slice(0, i + 1), JSON.parse(JSON.stringify(cur[i])), ...cur.slice(i + 1)], true);
          });
          head.append(el('span', '', tr('ui.button_n', { n: i + 1 })), this._clipBtn('button', () => o.get()[i], () => b.name || b.entity || b.icon || tr('ui.button_n', { n: i + 1 })), dup, rm);
          rb.appendChild(head);
          const form = document.createElement('ha-form');
          form.computeLabel = (sch) => tr('label.b_' + sch.name);
          form.hass = this._hass;
          form.schema = [
            { name: 'icon', selector: { icon: {} } },
            { name: 'name', selector: { text: {} } },
            { name: 'color', selector: { ui_color: { include_state: false } } },
            { name: 'entity', selector: { entity: { domain: OWN_ENTITY_DOMAINS } } },
            ...(b.entity ? [] : [{ name: 'tap_action', selector: { ui_action: {} } }]),
            { name: 'hold_action', selector: { ui_action: {} } },
            { name: 'double_tap_action', selector: { ui_action: {} } }
          ];
          form.computeHelper = (sch) => (sch.name === 'entity' ? tr('help.b_entity') : '');
          form.data = { icon: b.icon || '', name: b.name || '', color: b.color || '', entity: b.entity || '', tap_action: b.tap_action || { action: 'none' }, hold_action: b.hold_action || { action: 'none' }, double_tap_action: b.double_tap_action || { action: 'none' } };
          form.addEventListener('value-changed', (e) => {
            e.stopPropagation();
            const v = e.detail.value || {};
            form.data = v; // ha-form opdaterer ikke selv sin data
            const next = { ...o.get()[i] };
            for (const f of ['icon', 'name', 'color', 'entity']) { if (v[f]) next[f] = v[f]; else delete next[f]; }
            for (const f of ['tap_action', 'hold_action', 'double_tap_action']) { if (v[f] && v[f].action && v[f].action !== 'none') next[f] = v[f]; else delete next[f]; }
            // Med en entitet valgt bruges tryk-handlingen ikke (tryk åbner styringen); feltet skjules og fjernes.
            if (next.entity) delete next.tap_action;
            // Felterne skal bygges forfra, når entitet-feltet bliver udfyldt eller tømt (tryk-feltet kommer og går).
            o.set(o.get().map((x, j) => (j === i ? next : x)), !!next.entity !== !!o.get()[i].entity);
            blk.update();
          });
          this._forms.set(o.prefix + ':' + i, form);
          rb.appendChild(form);
          const blk = this._curBlock(['tap_action', 'hold_action', 'double_tap_action'].map((k) => ({
            label: tr('label.b_' + k),
            get: () => { const c = o.get()[i]; return c && !(k === 'tap_action' && c.entity) ? c[k] : null; },
            set: (a) => { o.set(o.get().map((x, j) => (j === i ? { ...x, [k]: a } : x)), false); form.data = { ...form.data, [k]: a }; blk.update(); }
          })), true);
          rb.appendChild(blk.el);
          const act = b.entity ? b.entity : (b.tap_action && b.tap_action.action && b.tap_action.action !== 'none' ? b.tap_action.action : '');
          this._foldRow(rb, head, o.prefix + ':' + i, { color: b.color, text: [b.name, act].filter(Boolean).join(' · ') || b.icon || '' });
          box.appendChild(rb);
        });
        const add = el('button', 'add', '+ ' + tr('ui.add_button'));
        add.type = 'button';
        add.addEventListener('click', () => { this._rowOpen.add(o.prefix + ':' + o.get().length); o.set([...o.get(), { icon: 'mdi:gesture-tap-button', tap_action: { action: 'more-info' } }], true); });
        box.appendChild(add);
        box.appendChild(this._clipBar('button', (item) => { this._rowOpen.add(o.prefix + ':' + o.get().length); o.set([...o.get(), item], true); }));
        this._foldBar(box);
      };
      return { render };
    }

    /* ---------- Filter: regler ---------- */
    _filterCfg() {
      const f = this._config.filter && typeof this._config.filter === 'object' ? this._config.filter : {};
      return { include: Array.isArray(f.include) ? f.include : [], exclude: Array.isArray(f.exclude) ? f.exclude : [], only_if: Array.isArray(f.only_if) ? f.only_if : [] };
    }

    _fkey() {
      const h = this._hass || {};
      return JSON.stringify(this._filterCfg()) + '|' + ['areas', 'floors', 'devices', 'entities'].map((k) => (h[k] ? 1 : 0)).join('');
    }

    _setFilter(f, structural) {
      const cfg = { ...this._config };
      const out = {};
      if (f.include.length) out.include = f.include;
      if (f.exclude.length) out.exclude = f.exclude;
      if (f.only_if.length) out.only_if = f.only_if;
      if (Object.keys(out).length) cfg.filter = out; else delete cfg.filter;
      this._config = cfg;
      if (!structural) this._fKey = this._fkey(); // værdiændringer må ikke genopbygge felterne (mister markøren)
      fire(this, 'config-changed', { config: cfg });
      this._refresh();
    }

    _condSchema(cond) {
      const h = this._hass || {};
      const fields = FIELDS.filter((f) => !f.needs || h[f.needs] || f.id === cond.field);
      const fdef = FIELD_BY_ID[cond.field];
      const ops = OPERATORS.filter((o) => !o.numeric || (fdef && fdef.numeric));
      const sel = (list, key) => ({ select: { mode: 'dropdown', options: list.map((x) => ({ value: x.id, label: tr('o.' + key + '.' + x.id) })) } });
      const out = [{ type: 'grid', name: '', schema: [{ name: 'field', selector: sel(fields, 'field') }, { name: 'operator', selector: sel(ops, 'operator') }] }];
      if (cond.field === 'attribute') out.push({ name: 'attribute', selector: { text: {} } });
      let valueSel = { text: {} };
      if (cond.operator !== 'in') {
        let names = [];
        if (cond.field === 'domain' && h.states) names = [...new Set(Object.keys(h.states).map((i) => i.split('.')[0]))].sort();
        else if (cond.field === 'area' && h.areas) names = Object.values(h.areas).map((a) => a.name).filter(Boolean).sort();
        else if (cond.field === 'floor' && h.floors) names = Object.values(h.floors).map((a) => a.name).filter(Boolean).sort();
        if (names.length) valueSel = { select: { mode: 'dropdown', custom_value: true, options: names.map((n) => ({ value: n, label: n })) } };
      }
      out.push({ name: 'value', selector: valueSel });
      return out;
    }

    _renderFilter(eff) {
      const key = this._fkey();
      if (key === this._fKey) { this._updatePreview(eff); return; }
      this._fKey = key;
      for (const k of [...this._forms.keys()]) if (k.indexOf('f:') === 0) this._forms.delete(k);
      const box = this._fbody;
      box.replaceChildren();
      const f = this._filterCfg();
      const mkBtn = (text, fn, cls) => { const b = el('button', cls || '', text); b.type = 'button'; b.addEventListener('click', fn); return b; };
      const newCond = () => ({ field: 'domain', operator: 'is', value: '' });
      for (const mode of ['include', 'exclude', 'only_if']) {
        const group = el('div', 'fgroup');
        group.appendChild(el('h4', '', tr('ui.' + mode)));
        if (mode === 'only_if') group.appendChild(el('div', 'note', tr('ui.only_if_hint')));
        f[mode].forEach((rule, ri) => {
          const conds = rule && Array.isArray(rule.conditions) ? rule.conditions : [];
          if (ri) group.appendChild(el('div', 'and or', tr('ui.or')));
          const rb = el('div', 'rule');
          const head = el('div', 'rhead');
          const fdup = mkBtn('⧉', () => {
            const g = this._filterCfg();
            this._rowIns('f:' + mode, ri + 1);
            this._rowOpen.add('f:' + mode + ':' + (ri + 1));
            g[mode] = [...g[mode].slice(0, ri + 1), JSON.parse(JSON.stringify(g[mode][ri])), ...g[mode].slice(ri + 1)];
            this._setFilter(g, true);
          }, 'dup');
          fdup.title = tr('ui.dup_rule');
          head.append(el('span', '', tr('ui.rule_n', { n: ri + 1 })), this._clipBtn('filter', () => this._filterCfg()[mode][ri], () => this._condText(rule)), fdup, mkBtn('✕', () => {
            this._rowDrop('f:' + mode, ri);
            const g = this._filterCfg(); g[mode] = g[mode].filter((_, i) => i !== ri); this._setFilter(g, true);
          }, 'rm'));
          head.lastChild.title = tr('ui.remove_rule');
          rb.appendChild(head);
          conds.forEach((cond, ci) => {
            if (ci) rb.appendChild(el('div', 'and', tr('ui.and')));
            const row = el('div', 'cond');
            const form = document.createElement('ha-form');
            form.computeLabel = (sch) => tr('label.c_' + sch.name);
            form.hass = this._hass;
            form.schema = this._condSchema(cond);
            form.data = { field: cond.field, operator: cond.operator, attribute: cond.attribute || '', value: cond.value === undefined ? '' : cond.value };
            form.addEventListener('value-changed', (e) => {
              e.stopPropagation();
              const v = e.detail.value || {};
              form.data = v; // ha-form opdaterer ikke selv sin data
              const g = this._filterCfg();
              const old = g[mode][ri].conditions[ci];
              const next = { field: v.field || old.field, operator: v.operator || old.operator, value: v.value === undefined || v.value === null ? '' : v.value };
              const nf = FIELD_BY_ID[next.field];
              if (OPERATOR_BY_ID[next.operator] && OPERATOR_BY_ID[next.operator].numeric && !(nf && nf.numeric)) next.operator = 'is';
              if (next.field === 'attribute') next.attribute = v.attribute || '';
              const structural = next.field !== old.field || next.operator !== old.operator;
              const conds2 = g[mode][ri].conditions.slice(); conds2[ci] = next;
              g[mode] = g[mode].map((r, i) => (i === ri ? { ...r, conditions: conds2 } : r));
              this._setFilter(g, structural);
            });
            this._forms.set('f:' + mode + ':' + ri + ':' + ci, form);
            const rm = mkBtn('✕', () => {
              const g = this._filterCfg();
              const left = g[mode][ri].conditions.filter((_, i) => i !== ci);
              if (!left.length) this._rowDrop('f:' + mode, ri);
              g[mode] = left.length ? g[mode].map((r, i) => (i === ri ? { ...r, conditions: left } : r)) : g[mode].filter((_, i) => i !== ri);
              this._setFilter(g, true);
            }, 'rm');
            rm.title = tr('ui.remove_condition');
            row.append(form, rm);
            rb.appendChild(row);
          });
          rb.appendChild(mkBtn('+ ' + tr('ui.add_condition'), () => {
            const g = this._filterCfg();
            g[mode] = g[mode].map((r, i) => (i === ri ? { ...r, conditions: [...(r.conditions || []), newCond()] } : r));
            this._setFilter(g, true);
          }, 'add'));
          this._foldRow(rb, head, 'f:' + mode + ':' + ri, { text: this._condText(rule) });
          group.appendChild(rb);
        });
        group.appendChild(mkBtn('+ ' + tr('ui.add_' + mode), () => {
          const g = this._filterCfg(); this._rowOpen.add('f:' + mode + ':' + g[mode].length); g[mode] = [...g[mode], { conditions: [newCond()] }]; this._setFilter(g, true);
        }, 'add'));
        group.appendChild(this._clipBar('filter', (item) => {
          const g = this._filterCfg(); this._rowOpen.add('f:' + mode + ':' + g[mode].length); g[mode] = [...g[mode], item]; this._setFilter(g, true);
        }));
        this._foldBar(group);
        box.appendChild(group);
      }
      this._updatePreview(eff);
    }

    // Udskudt, så hvert tastetryk ikke kører filteret over alle entiteter.
    _updatePreview(eff, now) {
      if (!this._fprev) return;
      clearTimeout(this._pvTimer);
      if (now) { this._doPreview(eff); return; }
      this._pvTimer = setTimeout(() => this._doPreview(), 350);
    }

    _doPreview(eff) {
      if (!this._fprev) return;
      const hass = this._hass;
      const f = this._filterCfg();
      const fkey = JSON.stringify(f);
      if (fkey !== this._pvKey) { this._pvKey = fkey; this._pvEngine = createFilterEngine(f); this._pvAll = false; }
      const engine = this._pvEngine;
      const req = createRequireTest(f);
      const box = this._fprev;
      box.replaceChildren();
      if (!engine && !req) { box.textContent = tr('ui.filter_no_rules'); return; }
      if (!hass || !hass.states) return;
      const e = eff || effective(this._config);
      let found = [];
      if (engine) {
        engine.update(hass);
        found = engine.ids(hass, e.sort_by, e.sort_dir);
        const lim = this._pvAll ? found.length : 20;
        const names = found.slice(0, lim).map((id) => hass.states[id].attributes.friendly_name || id);
        const head = found.length === 0 ? tr('ui.filter_match_none') : found.length === 1 ? tr('ui.filter_match_one') : tr('ui.filter_match', { n: found.length });
        box.appendChild(document.createTextNode(head + (names.length ? ' ' + names.join(', ') + (found.length > names.length ? ' …' : '') : '')));
        if (found.length > 20) {
          const btn = el('button', '', this._pvAll ? tr('ui.show_few_names') : tr('ui.show_all_names'));
          btn.type = 'button';
          btn.addEventListener('click', () => { this._pvAll = !this._pvAll; this._doPreview(); });
          box.appendChild(btn);
        }
      }
      if (req) {
        const manual = (Array.isArray(this._config.entities) ? this._config.entities : []).map((r) => (typeof r === 'string' ? r : r && (r.entity || r.entity_id))).filter(Boolean);
        const all = [...new Set([...manual, ...found])].filter((id) => hass.states[id]);
        const pass = all.filter((id) => req(id, hass.states[id], hass));
        box.appendChild(document.createTextNode((box.firstChild ? ' ' : '') + tr('ui.only_if_match', { n: pass.length, m: all.length })));
      }
      // Advarsler for brede regler
      const broad = (f.include || []).some((rule) => { const cs = rule && Array.isArray(rule.conditions) ? rule.conditions : []; return cs.length > 0 && cs.every((c) => c && String(c.value).trim() === '*'); });
      const warn = [];
      if (broad) warn.push(tr('ui.filter_warn_broad'));
      if (found.length > BROAD_WARN && !e.filter_show_all) warn.push(tr('ui.filter_warn_many', { n: found.length, l: FILTER_LIMIT }));
      for (const w of warn) { const d = el('div', 'warn', w); box.appendChild(d); }
    }

    _emit(cfg) {
      this._config = cfg;
      fire(this, 'config-changed', { config: cfg });
    }

    _onForm(secId, value) {
      if (!value) return;
      if (secId === 'entities') return this._onEntities(value.entities || []);
      const prevEff = effective(this._config);
      let cfg = { ...this._config };
      let layoutChanged = false;
      for (const s of SETTINGS) {
        if (s.section !== secId || !(s.key in value)) continue;
        let v = value[s.key];
        if (s.type === 'number') { v = Number(v); if (!Number.isFinite(v)) v = undefined; }
        if (s.type === 'text' && v === '') v = undefined;
        if (v !== undefined && deepEq(v, prevEff[s.key])) continue;
        if (s.key === 'layout') layoutChanged = true;
        if (v === undefined) delete cfg[s.key]; else cfg[s.key] = v;
      }
      cfg = pruneToDeviations(cfg);
      if (layoutChanged) cfg = pruneToDeviations(cfg);
      if (deepEq(cfg, this._config)) { this._refresh(); return; }
      this._emit(cfg);
      this._refresh();
    }

    _onEntities(ids) {
      const raw = Array.isArray(this._config.entities) ? this._config.entities : [];
      const queue = new Map();
      const others = [];
      raw.forEach((r, i) => {
        const id = typeof r === 'string' ? r : r && (r.entity || r.entity_id);
        if (id) { if (!queue.has(id)) queue.set(id, []); queue.get(id).push(r); } else if (r) others.push([i, r]);
      });
      // Samme entitet kan stå flere gange: hver forekomst beholder sine egne indstillinger.
      const list = ids.map((id) => { const q = queue.get(id); return q && q.length ? q.shift() : id; });
      // Sektioner og skillelinjer bevares på deres oprindelige placering.
      for (const [i, r] of others) list.splice(Math.min(i, list.length), 0, r);
      this._emit({ ...this._config, entities: list });
      this._refresh();
    }

    // Rækkerne i entitetslisten i den rækkefølge, de står i konfigurationen: entiteter og egne sektioner/skillelinjer.
    _rows() {
      const list = Array.isArray(this._config.entities) ? this._config.entities : [];
      const rows = [];
      list.forEach((r, i) => {
        if (typeof r === 'string') rows.push({ i, id: r });
        else if (r && typeof r === 'object') {
          const id = r.entity || r.entity_id;
          if (id) rows.push({ i, id });
          else if (r.type === 'section' || r.type === 'divider') rows.push({ i, type: r.type });
        }
      });
      // Samme entitet kan stå flere gange: den første kaldes id, de næste id#2, id#3 …
      const seen = {};
      for (const r of rows) if (r.id) { seen[r.id] = (seen[r.id] || 0) + 1; r.uid = seen[r.id] === 1 ? r.id : r.id + '#' + seen[r.id]; }
      return rows;
    }

    // Placeringen i entitetslisten for en række (uid fra _rows).
    _idx(uid) { const r = this._rows().find((x) => x.uid === uid); return r ? r.i : -1; }

    _renderOverrides() {
      const rows = this._rows();
      const key = layoutOf(this._config) + '|' + rows.map((r) => r.id || '#' + r.type).join('|');
      if (key === this._ovrKey) return;
      this._ovrKey = key;
      for (const k of [...this._forms.keys()]) if (k.indexOf('ovr:') === 0 || k.indexOf('ovrcr:') === 0 || k.indexOf('mk:') === 0 || k.indexOf('io:') === 0 || k.indexOf('ib:') === 0 || k.indexOf('ibu:') === 0 || k.indexOf('cp:') === 0) this._forms.delete(k);
      this._ovr.replaceChildren();
      this._ovrPanels.clear();
      this._ovrSum.clear();
      if (!rows.length) return;
      this._ovr.appendChild(el('h4', '', tr('ui.customize_title')));
      if (rows.filter((r) => !r.type).length >= 2) {
        const bar = el('div', 'fbar');
        for (const [open, k] of [[false, 'ui.fold_all_in'], [true, 'ui.fold_all_out']]) {
          const b = el('button', '', tr(k));
          b.type = 'button';
          b.addEventListener('click', () => this._ovrPanels.forEach((pn, u) => { pn.expanded = open; this._open['ovr:' + u] = open; }));
          bar.appendChild(b);
        }
        this._ovr.appendChild(bar);
      }
      const stop = (e) => e.stopPropagation();
      const moveBtns = (parent, pos, cls) => {
        const made = [];
        for (const [dir, label, k] of [[-1, '↑', 'ui.move_up'], [1, '↓', 'ui.move_down']]) {
          const b = el('button', 'move', label);
          b.type = 'button'; b.title = tr(k);
          b.disabled = pos + dir < 0 || pos + dir >= rows.length;
          b.addEventListener('click', (e) => { stop(e); this._moveRow(rows[pos].i, dir); });
          for (const ev of ['keydown', 'keyup', 'pointerdown']) b.addEventListener(ev, stop);
          parent.appendChild(b);
          made.push(b);
        }
        return made;
      };
      rows.forEach((row, pos) => {
        if (row.type) {
          const m = el('div', 'mrow');
          const ic = document.createElement('ha-icon');
          ic.setAttribute('icon', row.type === 'section' ? 'mdi:format-title' : 'mdi:minus');
          m.appendChild(ic);
          if (row.type === 'section') {
            const form = document.createElement('ha-form');
            form.computeLabel = () => tr('ui.section_label');
            form.schema = [{ name: 'label', selector: { text: {} } }];
            form.hass = this._hass;
            const cur = this._config.entities[row.i];
            form.data = { label: (cur && typeof cur.label === 'string' ? cur.label : '') };
            form.addEventListener('value-changed', (e) => { e.stopPropagation(); form.data = e.detail.value; this._setMarkerLabel(row.i, (e.detail.value && e.detail.value.label) || ''); });
            m.appendChild(form);
            this._forms.set('mk:' + row.i, form);
          } else m.appendChild(el('span', 'mlabel', tr('ui.divider_row')));
          moveBtns(m, pos);
          const rm = el('button', 'rm', '✕');
          rm.type = 'button'; rm.title = tr('ui.remove_row');
          rm.addEventListener('click', () => this._removeRow(row.i));
          m.appendChild(rm);
          this._ovr.appendChild(m);
          return;
        }
        const id = row.id;
        const uid = row.uid;
        const { p, body, header } = this._panel('ovr:' + uid, 'mdi:tune', uid === id ? id : id + ' (' + uid.split('#')[1] + ')', !!this._open['ovr:' + uid]);
        header.className = 'hdr mv';
        const osum = el('span', 'osum');
        header.appendChild(osum);
        const updSum = () => { osum.textContent = this._ovrSummary(uid); };
        updSum();
        this._ovrSum.set(uid, updSum);
        this._ovrPanels.set(uid, p);
        const mb = moveBtns(header, pos);
        mb[0].style.marginLeft = 'auto';
        const dup = el('button', 'move', '⧉');
        dup.type = 'button'; dup.title = tr('ui.item_duplicate');
        dup.addEventListener('click', (e) => { stop(e); this._duplicateRow(row.i); });
        for (const ev of ['keydown', 'keyup', 'pointerdown']) dup.addEventListener(ev, stop);
        header.appendChild(dup);
        const form = document.createElement('ha-form');
        form.computeLabel = (sch) => tr('label.item_' + sch.name);
        form.computeHelper = (sch) => tr('help.item_' + sch.name);
        form.schema = [{ name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } }];
        form.hass = this._hass;
        const raw = (this._config.entities || [])[row.i];
        form.data = { name: (raw && typeof raw === 'object' && typeof raw.name === 'string' ? raw.name : '') || '', icon: (raw && typeof raw === 'object' && raw.icon) || '' };
        form.addEventListener('value-changed', (e) => { e.stopPropagation(); form.data = e.detail.value; this._onOverride(uid, e.detail.value); });
        body.appendChild(form);
        this._forms.set('ovr:' + uid, form);
        body.appendChild(el('h4', '', tr('ui.item_overrides')));
        body.appendChild(el('div', 'note', tr('ui.item_overrides_hint')));
        const iovr = el('div', 'iovr');
        body.appendChild(iovr);
        this._renderItemOverrides(iovr, row);
        body.appendChild(el('h4', '', tr('ui.item_color_rules')));
        const rbox = el('div', 'frules');
        body.appendChild(rbox);
        const crEd = this._ruleEditor(rbox, {
          prefix: 'ovrcr:' + uid,
          get: () => { const l = this._entityObj(uid).color_rules; return Array.isArray(l) ? l : []; },
          set: (l) => this._patchEntity(uid, (o) => { if (l.length) o.color_rules = l; else delete o.color_rules; })
        });
        const cpc = el('button', 'add', '+ ' + tr('ui.item_copy_card_rules'));
        cpc.type = 'button';
        const updCpc = () => { cpc.style.display = Array.isArray(this._config.color_rules) && this._config.color_rules.length ? '' : 'none'; };
        cpc.addEventListener('click', () => {
          const copy = JSON.parse(JSON.stringify(this._config.color_rules));
          this._patchEntity(uid, (o) => { o.color_rules = [...(Array.isArray(o.color_rules) ? o.color_rules : []), ...copy]; });
          crEd.refresh();
        });
        body.appendChild(cpc);
        this._ovrSum.set(uid + '|cc', updCpc);
        updCpc();
        if (this._config.layout !== 'chips') {
          body.appendChild(el('h4', '', tr('ui.item_buttons')));
          body.appendChild(el('div', 'note', tr('ui.item_buttons_hint')));
          // Kortets knapper bruges, medmindre entiteten har sin egen liste (også en tom liste: ingen knapper).
          const top = el('div', 'ibtop');
          body.appendChild(top);
          const bbox = el('div', 'frules bbox');
          body.appendChild(bbox);
          const hasOwn = () => Array.isArray(this._entityObj(uid).buttons);
          const renderTop = () => {
            this._forms.delete('ibu:' + uid);
            top.replaceChildren();
            const form = document.createElement('ha-form');
            form.computeLabel = () => tr('ui.item_use_card_buttons');
            form.computeHelper = () => tr('ui.item_use_card_buttons_hint');
            form.hass = this._hass;
            form.schema = [{ name: 'use', selector: { boolean: {} } }];
            form.data = { use: !hasOwn() };
            form.addEventListener('value-changed', (e) => {
              e.stopPropagation();
              const use = !!(e.detail.value || {}).use;
              form.data = { use };
              this._patchEntity(uid, (o) => { if (use) delete o.buttons; else o.buttons = []; });
              renderTop();
              bl.render();
            });
            this._forms.set('ibu:' + uid, form);
            top.appendChild(form);
            if (hasOwn() && this._buttonsCfg().length) {
              const cp = el('button', 'add', '+ ' + tr('ui.item_copy_card_buttons'));
              cp.type = 'button';
              cp.addEventListener('click', () => {
                const copy = JSON.parse(JSON.stringify(this._buttonsCfg()));
                this._patchEntity(uid, (o) => { o.buttons = [...(Array.isArray(o.buttons) ? o.buttons : []), ...copy]; });
                bl.render();
              });
              top.appendChild(cp);
            }
          };
          const bl = this._buttonList(bbox, {
            prefix: 'ib:' + uid,
            get: () => { const l = this._entityObj(uid).buttons; return Array.isArray(l) ? l : []; },
            set: (list, structural) => {
              // Listen bliver stående, også når den er tom: så vender kortets knapper ikke tilbage ved et uheld.
              this._patchEntity(uid, (o) => { o.buttons = list; });
              if (structural) { bl.render(); renderTop(); }
            }
          });
          renderTop();
          bl.render();
        }
        this._copySection(body, uid);
        this._ovr.appendChild(p);
      });
      const add = el('div', 'oadd');
      for (const [type, k] of [['section', 'ui.add_section'], ['divider', 'ui.add_divider']]) {
        const b = el('button', 'add', '+ ' + tr(k));
        b.type = 'button';
        b.addEventListener('click', () => this._addMarker(type));
        add.appendChild(b);
      }
      this._ovr.appendChild(add);
    }

    // «Kopiér til andre entiteter»: vælg hvad (overstyringer, farveregler, knapper) og hvilke modtagere. Ét skift af konfigurationen.
    _copySection(body, uid) {
      const wrap = el('div', 'cpsec');
      body.appendChild(wrap);
      const st = { ovr: true, rules: true, btns: true, to: [], mode: 'replace' };
      let lastKey = null;
      const render = () => {
        const o = this._entityObj(uid);
        const others = this._rows().filter((r) => !r.type && r.uid !== uid);
        const nOvr = this._ovrKeysOf(o).length;
        const nRules = Array.isArray(o.color_rules) ? o.color_rules.length : 0;
        const hasBtns = this._config.layout !== 'chips' && Array.isArray(o.buttons);
        const nBtns = hasBtns ? o.buttons.length : 0;
        const key = JSON.stringify([nOvr, nRules, hasBtns ? nBtns : -1, others.map((r) => r.uid)]);
        if (key === lastKey) return;
        lastKey = key;
        this._forms.delete('cp:' + uid);
        wrap.replaceChildren();
        wrap.style.display = others.length ? '' : 'none';
        if (!others.length) return;
        wrap.appendChild(el('h4', '', tr('ui.copy_title')));
        if (!nOvr && !nRules && !hasBtns) { wrap.appendChild(el('div', 'note', tr('ui.cp_none'))); return; }
        wrap.appendChild(el('div', 'note', tr('ui.copy_hint')));
        st.to = st.to.filter((u) => others.some((r) => r.uid === u));
        const hass = this._hass;
        const nameOf = (r) => {
          const fn = hass && hass.states && hass.states[r.id] && hass.states[r.id].attributes && hass.states[r.id].attributes.friendly_name;
          const base = r.uid === r.id ? r.id : r.id + ' (' + r.uid.split('#')[1] + ')';
          return fn ? fn + ' – ' + base : base;
        };
        const schema = [];
        const labels = {};
        const data = {};
        if (nOvr) { schema.push({ name: 'ovr', selector: { boolean: {} } }); labels.ovr = tr('label.cp_ovr', { n: nOvr }); data.ovr = st.ovr; }
        if (nRules) { schema.push({ name: 'rules', selector: { boolean: {} } }); labels.rules = tr('label.cp_rules', { n: nRules }); data.rules = st.rules; }
        if (hasBtns) { schema.push({ name: 'btns', selector: { boolean: {} } }); labels.btns = nBtns ? tr('label.cp_btns', { n: nBtns }) : tr('label.cp_btns_zero'); data.btns = st.btns; }
        schema.push({ name: 'to', selector: { select: { multiple: true, mode: 'list', options: others.map((r) => ({ value: r.uid, label: nameOf(r) })) } } });
        labels.to = tr('label.cp_to');
        data.to = st.to;
        if (nRules || hasBtns) {
          schema.push({ name: 'mode', selector: { select: { mode: 'dropdown', options: ['replace', 'add'].map((v) => ({ value: v, label: tr('o.cp_mode.' + v) })) } } });
          labels.mode = tr('label.cp_mode');
          data.mode = st.mode;
        }
        const form = document.createElement('ha-form');
        form.computeLabel = (sch) => labels[sch.name] || sch.name;
        form.schema = schema;
        form.hass = this._hass;
        form.data = data;
        const use = () => ({ ovr: !!nOvr && st.ovr, rules: !!nRules && st.rules, btns: hasBtns && st.btns });
        const go = el('button', 'go', tr('ui.cp_go'));
        go.type = 'button';
        const upd = () => { const u = use(); go.disabled = !(st.to.length && (u.ovr || u.rules || u.btns)); };
        form.addEventListener('value-changed', (e) => {
          e.stopPropagation();
          const v = e.detail.value || {};
          form.data = v;
          for (const k of ['ovr', 'rules', 'btns']) if (k in v) st[k] = !!v[k];
          st.to = Array.isArray(v.to) ? v.to : [];
          if (v.mode) st.mode = v.mode;
          upd();
        });
        this._forms.set('cp:' + uid, form);
        wrap.appendChild(form);
        const act = el('div', 'cpact');
        const all = el('button', 'add', '+ ' + tr('ui.cp_all'));
        all.type = 'button';
        all.addEventListener('click', () => { st.to = others.map((r) => r.uid); form.data = { ...form.data, to: st.to }; upd(); });
        go.addEventListener('click', () => {
          const u = use();
          const n = st.to.length;
          if (!n || go.disabled) return;
          this._copyNote = { uid, n };
          this._copyTo(uid, st.to, u, st.mode);
        });
        act.append(all, go);
        wrap.appendChild(act);
        upd();
        if (this._copyNote && this._copyNote.uid === uid) {
          const ok = el('div', 'cpok', this._copyNote.n === 1 ? tr('ui.cp_done_1') : tr('ui.cp_done_n', { n: this._copyNote.n }));
          wrap.appendChild(ok);
          this._copyNote = null;
          setTimeout(() => ok.remove(), 5000);
        }
      };
      this._ovrSum.set(uid + '|cp', render);
      render();
    }

    _copyTo(srcUid, targets, what, mode) {
      const src = this._entityObj(srcUid);
      const clone = (v) => JSON.parse(JSON.stringify(v));
      const idxOf = new Map(this._rows().map((r) => [r.uid, r.i]));
      const at = new Set(targets.map((u) => idxOf.get(u)));
      const list = (this._config.entities || []).map((r, i) => {
        if (!at.has(i)) return r;
        const obj = typeof r === 'string' ? { entity: r } : { ...r };
        if (what.ovr) for (const k of this._ovrKeysOf(src)) obj[k] = clone(src[k]);
        if (what.rules && Array.isArray(src.color_rules)) obj.color_rules = mode === 'add' ? [...(Array.isArray(obj.color_rules) ? obj.color_rules : []), ...clone(src.color_rules)] : clone(src.color_rules);
        if (what.btns && Array.isArray(src.buttons)) {
          if (mode !== 'add') obj.buttons = clone(src.buttons);
          else if (src.buttons.length) obj.buttons = [...(Array.isArray(obj.buttons) ? obj.buttons : []), ...clone(src.buttons)];
        }
        return Object.keys(obj).length === 1 && obj.entity ? obj.entity : obj;
      });
      this._ovrKey = null; // modtagernes paneler skal bygges om
      this._emit({ ...this._config, entities: list });
      this._refresh();
    }

    // Kort oversigt til entitetens overskrift: hvad er ændret i forhold til kortet.
    _ovrSummary(uid) {
      const o = this._entityObj(uid);
      const out = [];
      const n = this._ovrKeysOf(o).length;
      if (n) out.push(n === 1 ? tr('ui.sum_ovr_1') : tr('ui.sum_ovr_n', { n }));
      if (o.name || o.icon) out.push(tr('ui.sum_look'));
      const r = Array.isArray(o.color_rules) ? o.color_rules.length : 0;
      if (r) out.push(r === 1 ? tr('ui.sum_rules_1') : tr('ui.sum_rules_n', { n: r }));
      if (Array.isArray(o.buttons)) out.push(o.buttons.length === 0 ? tr('ui.sum_btn_zero') : o.buttons.length === 1 ? tr('ui.sum_btn_1') : tr('ui.sum_btn_n', { n: o.buttons.length }));
      return out.length ? out.join(' · ') : tr('ui.sum_none');
    }

    // Ændrer én entitets objekt i entitetslisten (uid fra _rows). Et objekt der kun har 'entity' skrives igen som ren tekst.
    _patchEntity(uid, fn) {
      const at = this._idx(uid);
      const list = (this._config.entities || []).map((r, i) => {
        if (i !== at) return r;
        const obj = typeof r === 'string' ? { entity: r } : { ...r };
        fn(obj);
        return Object.keys(obj).length === 1 && obj.entity ? obj.entity : obj;
      });
      this._emit({ ...this._config, entities: list });
      this._ovrSum.forEach((fn) => fn());
    }

    _entityObj(uid) {
      const r = (this._config.entities || [])[this._idx(uid)];
      return r && typeof r === 'object' ? r : {};
    }

    // Valgmuligheder for en liste-indstilling på én entitet: kun dem der giver mening for entitetens type, samt dem der allerede er valgt.
    _itemOptions(s, id, current) {
      const dom = String(id).split('.')[0];
      const groups = s.key === 'controls' ? CONTROL_GROUPS : INFO_GROUPS;
      let opts = groups.filter((g) => g.always || (g.domains || []).includes(dom) || (s.key !== 'controls' && g.device)).flatMap((g) => g.options);
      if (!opts.length) opts = s.options.slice();
      for (const c of current) if (!opts.includes(c)) opts.push(c);
      return s.options.filter((o) => opts.includes(o));
    }

    _itemSelector(s, row, eff) {
      switch (s.type) {
        case 'select': return { select: { mode: 'dropdown', options: (s.optionsFor ? s.optionsFor(eff.layout) : s.options).map((v) => ({ value: v, label: tr('o.' + s.key + '.' + v) })) } };
        case 'multiselect': return { select: { multiple: true, mode: 'list', options: this._itemOptions(s, row.id, normMulti(s, this._entityObj(row.uid)[s.key], eff.layout)).map((v) => ({ value: v, label: tr('o.' + s.key + '.' + v) })) } };
        case 'boolean': return { boolean: {} };
        case 'color': return { ui_color: { include_state: false } };
        case 'action': return { ui_action: {} };
        default: return { text: {} };
      }
    }

    // Overstyringer af kortets indstillinger for én entitet: kun de, du selv har tilføjet, vises. Resten følger kortet.
    _renderItemOverrides(box, row) {
      const id = row.id;
      const uid = row.uid;
      const shown = this._ovrShown || (this._ovrShown = new Set());
      const base = effective(this._config);
      const mergedEff = () => { const o = this._entityObj(uid); const e = { ...base }; for (const k of ITEM_KEYS) if (o[k] !== undefined) e[k] = SETTING_BY_KEY[k].type === 'multiselect' ? normMulti(SETTING_BY_KEY[k], o[k], base.layout) : o[k]; return e; };
      const rowsBox = el('div', 'irows');
      const addBox = el('div', 'oadd');
      box.replaceChildren(rowsBox, addBox);
      const sOf = (k) => (k === 'hide_buttons' ? HIDE_BUTTONS : SETTING_BY_KEY[k]);
      const keys = ['hide_buttons', ...SETTINGS.filter((s) => s.item && s.key !== 'name' && s.key !== 'icon').map((s) => s.key)];
      const hasKey = (k) => this._entityObj(uid)[k] !== undefined || shown.has(uid + '|' + k);
      let cat = ''; // valgt kategori i første trin af «Tilføj overstyring»
      const grpOf = (k) => (k === 'hide_buttons' ? 'buttons' : sOf(k).section);
      const addKey = (k) => {
        const s = sOf(k);
        shown.add(uid + '|' + k);
        if (s.type !== 'text' && s.type !== 'color') {
          const v = k === 'hide_buttons' ? true : mergedEff()[k];
          this._patchEntity(uid, (o) => { o[k] = JSON.parse(JSON.stringify(v)); });
        }
        cat = '';
        renderRows();
        renderAdd();
      };
      const renderAdd = () => {
        addBox.replaceChildren();
        this._forms.delete('io:' + uid + '|add2');
        const eff = mergedEff();
        const free = keys.filter((k) => !hasKey(k) && isRelevant(sOf(k), eff));
        if (!free.length) return;
        const cats = SECTIONS.map((x) => x.id).filter((id) => free.some((k) => k !== 'hide_buttons' && grpOf(k) === id));
        if (cat && !cats.includes(cat)) cat = '';
        const opts = cats.map((c) => ({ value: 'cat:' + c, label: tr('section.' + c) }));
        if (free.includes('hide_buttons')) opts.push({ value: 'hide_buttons', label: tr('label.hide_buttons') });
        const f = document.createElement('ha-form');
        f.schema = [{ name: 'add', selector: { select: { mode: 'dropdown', options: opts } } }];
        f.computeLabel = () => tr('ui.item_add_override');
        f.hass = this._hass;
        f.data = { add: cat ? 'cat:' + cat : '' };
        f.addEventListener('value-changed', (e) => {
          e.stopPropagation();
          const v = e.detail.value && e.detail.value.add;
          if (!v) return;
          if (v === 'hide_buttons') { addKey(v); return; }
          cat = v.slice(4);
          renderAdd();
        });
        this._forms.set('io:' + uid + '|add', f);
        addBox.appendChild(f);
        if (cat) {
          const f2 = document.createElement('ha-form');
          f2.schema = [{ name: 'add2', selector: { select: { mode: 'dropdown', options: free.filter((k) => k !== 'hide_buttons' && grpOf(k) === cat).map((k) => ({ value: k, label: tr('label.' + k) })) } } }];
          f2.computeLabel = () => tr('ui.item_add_pick');
          f2.hass = this._hass;
          f2.data = { add2: '' };
          f2.addEventListener('value-changed', (e) => {
            e.stopPropagation();
            const k = e.detail.value && e.detail.value.add2;
            if (k) addKey(k);
          });
          this._forms.set('io:' + uid + '|add2', f2);
          addBox.appendChild(f2);
        }
      };
      const renderRows = () => {
        for (const k of [...this._forms.keys()]) if (k.indexOf('io:' + uid + '|') === 0 && !k.endsWith('|add') && !k.endsWith('|add2')) this._forms.delete(k);
        rowsBox.replaceChildren();
        const eff = mergedEff();
        // Overstyringerne står under små overskrifter efter kategori (samme som i kortets egen editor).
        const order = SECTIONS.map((x) => x.id);
        let lastG = null;
        for (const k of keys.filter(hasKey).sort((a, b) => order.indexOf(grpOf(a)) - order.indexOf(grpOf(b)))) {
          if (grpOf(k) !== lastG) { lastG = grpOf(k); rowsBox.appendChild(el('div', 'ogrp', tr('section.' + lastG))); }
          const s = sOf(k);
          const orow = el('div', 'ovrow');
          const form = document.createElement('ha-form');
          form.schema = [{ name: k, selector: this._itemSelector(s, row, eff) }];
          form.computeLabel = () => tr('label.' + k);
          form.computeHelper = () => tr('help.' + k);
          form.hass = this._hass;
          const cur = this._entityObj(uid)[k];
          form.data = { [k]: cur !== undefined ? cur : s.type === 'multiselect' ? [] : s.type === 'boolean' ? !!eff[k] : eff[k] === undefined ? '' : eff[k] };
          let blk = null;
          form.addEventListener('value-changed', (e) => {
            e.stopPropagation();
            const v = e.detail.value ? e.detail.value[k] : undefined;
            form.data = e.detail.value;
            const empty = v === undefined || v === null || v === '';
            this._patchEntity(uid, (o) => { if (empty) delete o[k]; else o[k] = v; });
            renderAdd();
            if (blk) blk.update();
          });
          const rm = el('button', 'rm', '✕');
          rm.type = 'button'; rm.title = tr('ui.remove_row');
          rm.addEventListener('click', () => {
            shown.delete(uid + '|' + k);
            this._patchEntity(uid, (o) => { delete o[k]; if (k === 'hide_buttons' && Array.isArray(o.buttons) && !o.buttons.length) delete o.buttons; });
            renderRows();
            renderAdd();
          });
          orow.append(form, rm);
          rowsBox.appendChild(orow);
          if (s.type === 'action') {
            blk = this._curBlock([{ label: tr('label.' + k), get: () => this._entityObj(uid)[k], set: (a) => { this._patchEntity(uid, (o) => { o[k] = a; }); form.data = { [k]: a }; blk.update(); } }], true);
            rowsBox.appendChild(blk.el);
          }
          this._forms.set('io:' + uid + '|' + k, form);
        }
      };
      renderRows();
      renderAdd();
    }

    // Flytter en række ét skridt og bytter plads med nabo-rækken, uanset om den er en entitet, en sektion eller en skillelinje.
    _moveRow(i, dir) {
      const rows = this._rows();
      const pos = rows.findIndex((r) => r.i === i);
      const to = pos + dir;
      if (pos < 0 || to < 0 || to >= rows.length) return;
      const list = [...this._config.entities];
      [list[i], list[rows[to].i]] = [list[rows[to].i], list[i]];
      this._ovrKey = null; // også ved to ens entiteter skal panelerne bygges om
      this._emit({ ...this._config, entities: list });
      this._refresh();
    }

    // Sætter en kopi af entiteten ind lige efter sig selv (samme entitet kan stå flere gange).
    _duplicateRow(i) {
      const list = [...this._config.entities];
      const r = list[i];
      list.splice(i + 1, 0, typeof r === 'string' ? r : { entity: r.entity || r.entity_id });
      this._emit({ ...this._config, entities: list });
      this._refresh();
    }

    _setMarkerLabel(i, label) {
      const list = [...this._config.entities];
      const cur = list[i];
      if (!cur || typeof cur !== 'object') return;
      const next = { ...cur };
      if (label) next.label = label; else delete next.label;
      list[i] = next;
      this._emit({ ...this._config, entities: list });
    }

    _removeRow(i) {
      const list = this._config.entities.filter((_, k) => k !== i);
      const cfg = { ...this._config };
      if (list.length) cfg.entities = list; else delete cfg.entities;
      this._emit(cfg);
      this._refresh();
    }

    _addMarker(type) {
      const list = [...(Array.isArray(this._config.entities) ? this._config.entities : [])];
      list.push(type === 'section' ? { type: 'section', label: tr('ui.section_default') } : { type: 'divider' });
      this._emit({ ...this._config, entities: list });
      this._refresh();
    }

    _onOverride(uid, value) {
      this._patchEntity(uid, (obj) => {
        for (const k of ['name', 'icon']) {
          if (value[k]) obj[k] = value[k]; else delete obj[k];
        }
      });
    }

    _renderChanged(eff) {
      const cfg = this._config;
      const layout = eff.layout;
      const dev = SETTINGS.filter((s) => cfg[s.key] !== undefined && !deepEq(s.type === 'multiselect' ? normMulti(s, cfg[s.key], layout) : cfg[s.key], defOf(s, layout)));
      this._changed.header.textContent = tr('ui.changed_title', { n: dev.length });
      const body = this._changed.body;
      body.replaceChildren();
      if (!dev.length) { body.appendChild(el('div', 'alldef', tr('ui.all_default'))); return; }
      for (const sec of SECTIONS) {
        const mine = dev.filter((s) => s.section === sec.id);
        if (!mine.length) continue;
        const g = el('div', 'grp');
        const ic = document.createElement('ha-icon');
        ic.setAttribute('icon', sec.icon);
        g.append(ic, document.createTextNode(tr('section.' + sec.id)));
        body.appendChild(g);
        for (const s of mine) {
          const row = el('div', 'row');
          row.appendChild(el('span', 'nm', tr('label.' + s.key)));
          const val = el('span', 'val');
          if (s.type === 'color') {
            const d = el('span', 'dot');
            d.style.background = resolveColor(cfg[s.key]);
            val.appendChild(d);
          } else val.textContent = displayValue(s, cfg[s.key]);
          row.appendChild(val);
          const undo = el('button', 'undo', '↺');
          undo.title = tr('ui.reset_one');
          undo.addEventListener('click', () => { const c = { ...this._config }; delete c[s.key]; this._emit(pruneToDeviations(c)); this._refresh(); });
          row.appendChild(undo);
          body.appendChild(row);
        }
      }
      const acts = el('div', 'acts');
      if (!this._confirmReset) {
        const b = el('button', '', tr('ui.reset_all'));
        b.addEventListener('click', () => { this._confirmReset = true; this._renderChanged(effective(this._config)); });
        acts.appendChild(b);
      } else {
        acts.appendChild(el('span', 'warn', tr('ui.reset_confirm')));
        const yes = el('button', '', tr('ui.reset_yes'));
        yes.addEventListener('click', () => {
          const c = { ...this._config };
          for (const s of SETTINGS) delete c[s.key];
          this._confirmReset = false;
          this._emit(c);
          this._refresh();
        });
        const no = el('button', '', tr('ui.reset_no'));
        no.addEventListener('click', () => { this._confirmReset = false; this._renderChanged(effective(this._config)); });
        acts.append(yes, no);
      }
      body.appendChild(acts);
    }
  }

  /* ====================================================================
   * 8. REGISTRERING
   * ================================================================== */
  if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, CurioCard);
  if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, CurioCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === CARD_TAG)) {
    window.customCards.push({ type: CARD_TAG, name: 'Curio Card', description: tr('card.description'), preview: true });
  }
  console.info('%c CURIO-CARD %c ' + CURIO_VERSION + ' ', 'color:#fff;background:#03a9f4;font-weight:700;border-radius:3px 0 0 3px', 'color:#03a9f4;background:#fff;font-weight:700;border-radius:0 3px 3px 0');

  // Kun til test: giver testkode adgang til de rene funktioner.
  if (typeof globalThis.__CURIO_EXPOSE__ === 'function') {
    globalThis.__CURIO_EXPOSE__({ clipboard: () => CLIP, lowBody, setLang, groupItems, createGroupRules, SETTINGS, SECTIONS, STRINGS, tr, effective, pruneToDeviations, buildItems, isActive, resolveColor, layoutOf, defOf, deepEq, insideAutoEntities, createFilterEngine, createRequireTest, createColorRules, FIELDS, OPERATORS, CURIO_VERSION });
  }
})();
