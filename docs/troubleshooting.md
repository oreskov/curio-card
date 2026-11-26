# Troubleshooting

Find the symptom, then read what usually causes it.

## The card does not appear or shows an error

| Symptom | Cause and fix |
|---|---|
| **Custom element doesn't exist: curio-card** | The file is not loaded. Check that it is added as a dashboard resource of the type *JavaScript module*, and reload the page without the cache (Ctrl+F5 on a computer, or clear the app cache on a phone) |
| **The card is not in the card picker** | Same cause as above. Reload without the cache after adding the resource |
| **The editor shows the old texts or settings after an update** | The browser keeps the old file. Reload without the cache |

## The card is empty

| Symptom | Cause and fix |
|---|---|
| "No entities to show" | No entities are picked and the filter finds nothing. You can change the text under **Layout → Text when empty** |
| The filter does not do anything | The filter needs at least one complete **Include** rule. A rule with an empty value, or without a field, is ignored. The editor says *Add an Include rule to use the filter.* |
| The card is empty, but you expected entities | Check **Show only if**, **Advanced → Show only active**, **Hide unavailable** and **Max number of items**. Any of them can remove entities |
| The card is gone from the dashboard | **Advanced → Hide the card when empty** is on, and nothing matches. The editor preview still shows the card |
| A gap is left where a hidden card was | Home Assistant keeps a place for every card on the dashboard, also when the card hides itself, and the card cannot change that. It shows most in the Sections view. The gap is Home Assistant's, not a setting of the card. If it bothers you, put the entities that come and go in the same card as the ones that stay, and use [grouping](grouping.md) or [sections](entities.md#sections-and-dividers) instead of several cards |

## The filter finds the wrong entities

- **The state is text.** Compare with `on`, not `true`, and with `playing`, not `Playing`. Text is not case sensitive, but spelling matters. The state field shows the raw state, for example `on` and not "Turned on"
- **A number comparison needs numbers.** *is less than* only matches when the state or attribute is a number. `unavailable` and `unknown` never match
- **Area, Floor, Label and Device** match either the name or the ID. If an entity has no area of its own, the area of its device is used
- **`*` is a wildcard** in *is*, *is not*, *is one of* and *is not one of*. A name with a `*` in it is read as a pattern
- **To combine values of one field, use *is one of***. Two conditions in the same rule must both match, so *State is on* and *State is off* in one rule never match anything. Use two rules instead, or *is one of*
- **The filter shows at most 100 results.** The card says so. Turn on **Filter → Show all filter results** to lift the limit

## Entities look wrong

| Symptom | Cause and fix |
|---|---|
| An entity shows "Not found" | The entity ID does not exist in Home Assistant. Check the spelling, and that the entity has not been renamed |
| An entity with "Not found" is still shown, although **Show only if** should remove it | **Show only if** works on entities that exist. A missing entity is not removed by it. Correct or remove the ID |
| An entity is shown twice | It is picked by hand twice, or it appears under two sections. An entity that you pick and that the filter also finds is only shown once |
| A section heading is missing | A section is only shown when an entity follows it. If **Grouping** is on, the groups replace your sections |
| I cannot change the name of an entity found by the filter | Settings for one entity exist for entities you pick by hand. Pick the entity by hand if you need its own name or icon |

## Colours and animation

| Symptom | Cause and fix |
|---|---|
| A rule does not colour anything | Rules are checked from the top and the first match wins. A rule above it may match first. Also check that the rule has a finished condition and a colour or an animation |
| The animation does not move | The device is set to reduce motion, and the card follows that on purpose |
| The colour looks the same on every item | **Appearance → Colours** is *Theme* or *Fixed*. Choose *State based* for colours that follow the state |
| Only the icon changes colour | The rule has **Affects** set to *Icon only* |

## Buttons and controls

| Symptom | Cause and fix |
|---|---|
| No buttons are shown | **Controls** is empty by default, so choose the ones you want. In **chips** only buttons that act at once are shown, and your own buttons are not shown |
| A control I want is not in the list | The list only shows the types that are in the card. Turn on **Buttons → Show all types** |
| The buttons are in the wrong place or the wrong order | **Buttons → Button placement** moves the whole row, and **Buttons → Order of the buttons** orders the buttons in it. On one entity, check its own **Order of the buttons** and its overrides, since they replace the card's |
| A control is missing on one entity | An entity only shows the controls its type and device can do. A light with no colour support has no colour control |
| A device's own button (for example a player's favorite button) is not shown | **Buttons → The device's own choices, numbers and buttons** must be on. The button must belong to the same device as the entity, and must not be marked as configuration or diagnostic in Home Assistant, or be a restart or update button. Only four of the device's own controls are shown per item; buttons come first unless you changed the order |
| A device's own button lights up when pressed, but nothing happens (Home Assistant's log may say "This feature is not supported") | The card only sends the press (`button.press`); it cannot tell whether the action worked. Try the same button in Home Assistant under *Settings → Devices*. If it fails there too, the cause is the integration, not the card. The Music Assistant favorite button, for example, fails when the current track cannot be found as an item in the library (some streams and radio stations) |
| A device's own button does not stay lit after a press | By design: it lights up for about a second and a half. A button has no on/off state in Home Assistant, so the card cannot show whether the action worked. The light can be turned off with **Device buttons: light up when pressed** |
| An entity has no buttons, although the card has | **Hide all buttons** is set on that entity, or the entity has its own list of buttons, which replaces the card's |
| A slider closes by itself | **Close control automatically after** is set. Set it to 0 to keep the slider open until you press ✕ |
| The switch on a media player is off while it is paused, but a tap turns the player off | The switch shows the state *on* only while the player plays. For a player that can be turned on and off, a tap switches it off. This is a known limitation |
| A button for an entity's list or number is dimmed | The entity is unavailable, does not exist, or the name is misspelled. Only `select`, `input_select`, `number` and `input_number` work. Any other entity makes it an ordinary button that uses the tap action |
| The card's button is shown on an entity that should not have it | Under **Customise per entity**, open the entity and switch off **Use the card's buttons** (or use `buttons: []` in YAML). **Hide all buttons** removes everything, not only the buttons |
| A button calls a service on the wrong entity | An action without a target on your own button goes to the item's own entity. The empty target (`target: {}`) that Home Assistant's editor adds counts as no target for services that accept a target. Give the action a target of its own to send it somewhere else. If a script needs the entity in its data, write `current` as the value (see [Actions](actions.md#use-the-items-own-entity-with-current)) |

## Taps

| Symptom | Cause and fix |
|---|---|
| A tap feels slow | A double tap action is set on the item, so a single tap waits 0.25 seconds to see whether a second one follows. Set double tap to *Nothing* to make taps instant |
| *Toggle* opens the details instead | The entity cannot be toggled (a sensor, climate or vacuum, for example), or it is unavailable |
| Holding opens a menu in the browser | The browser menu is only blocked when a hold action is set |

## In the editor

| Symptom | Cause and fix |
|---|---|
| The **Entities** and **Filter** sections are missing | The card sits inside Auto Entities, which supplies the entities. Change **Advanced → Data source (editor only)** to *Manual list* to show them |
| A setting is missing | Settings only appear when they make sense. The corner radius needs *Custom* corners, and **Item width** is hidden when you have fixed the columns |
| Something I changed is hard to find | **Changed from default** lists every change. Use **↺** to undo one |

## Still stuck?

Note the Home Assistant version, the browser, and the YAML of the card (use **Show code editor** in the card editor), and check the browser console (F12) for errors. With that, the problem can be reproduced.
