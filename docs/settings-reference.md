# Settings reference

Every setting of the card in one place: the key to use in YAML, the label in the editor, the default, and whether it can be changed for one entity. You never need this page to set the card up, because everything is in the editor. It is here to look things up, and for those who keep their cards in YAML.

Defaults marked with a layout in brackets depend on the layout. **Per entity** means the setting can be changed for one entity under **Customise per entity → Add override…** (see [Entities](entities.md#override-card-settings)).

## Layout

| YAML key | Editor label | Default | Per entity |
|---|---|---|---|
| `layout` | Layout | `tiles` |  |
| `align` | Alignment | `stretch` (`start` in chips) |  |
| `icon_position` | Icon position | `left` (`top` in grid) |  |
| `columns` | Columns | 0 (automatic) |  |
| `item_width` | Item width | 0 (automatic) |  |
| `gap` | Gap | 8 (6 in chips, 4 in list) |  |
| `title` | Title | empty |  |
| `empty_text` | Text when empty | empty |  |

## Grouping

| YAML key | Editor label | Default | Per entity |
|---|---|---|---|
| `group_by` | Group by | `none` |  |
| `group_size` | Heading size | `m` |  |
| `group_color` | Heading colour | empty |  |
| `group_style` | Heading style | `plain` |  |
| `group_align` | Heading alignment | `left` |  |
| `group_count` | Show count | `true` |  |
| `group_collapsible` | Collapsible | `true` |  |
| `group_rest_label` | Name of the rest | empty (shows "Other") |  |
| `group_rest_show` | Show the rest | `true` |  |

## Appearance

| YAML key | Editor label | Default | Per entity |
|---|---|---|---|
| `shape` | Shape | `rounded` (`pill` in chips) |  |
| `radius` | Custom radius | 12 |  |
| `size` | Size | `m` |  |
| `color_mode` | Colours | `state` |  |
| `color` | Fixed colour | empty | yes |
| `show_icon` | Show icon | `true` | yes |
| `icon_size` | Icon size | `auto` |  |
| `show_name` | Show name | `true` | yes |
| `long_text` | Long text | `scroll` |  |
| `secondary_info` | Secondary information | `state` (none in chips) | yes |
| `big_value` | Big value | `false` |  |
| `secondary_attribute` | Attribute name | empty | yes |
| `card_plain` | No card style | `false` |  |
| `card_opacity` | Card opacity | 100 |  |
| `hide_border` | Hide border | `false` |  |
| `hide_shadow` | Hide shadow | `false` |  |
| `card_corners` | Card corners | `theme` |  |
| `card_radius` | Card corner radius | 12 |  |
| `background` | Item background | `filled` (`transparent` in list) |  |
| `show_switch` | Show switch | `true` in list, otherwise `false` | yes |

## Interaction

| YAML key | Editor label | Default | Per entity |
|---|---|---|---|
| `tap_action` | Tap on item | `toggle` | yes |
| `hold_action` | Hold on item | `none` | yes |
| `double_tap_action` | Double tap on item | `none` | yes |
| `icon_tap_action` | Tap on icon | `more-info` | yes |
| `icon_hold_action` | Hold on icon | `none` | yes |
| `icon_double_tap_action` | Double tap on icon | `none` | yes |

## Buttons

| YAML key | Editor label | Default | Per entity |
|---|---|---|---|
| `controls` | Controls | none (empty list) | yes |
| `device_controls` | The device's own choices, numbers and buttons | `false` | yes |
| `device_controls_order` | The device's own controls: order | `buttons` | yes |
| `button_press_feedback` | Device buttons: light up when pressed | `true` | yes |
| `button_size` | Button size | `auto` |  |
| `button_color` | Button colour | empty |  |
| `controls_autoclose` | Close control automatically after (sec.) | 0 (off) |  |

## Status indicators

| YAML key | Editor label | Default | Per entity |
|---|---|---|---|
| `indicator` | Status indicator | `none` (`dot` in grid) | yes |
| `bubble_text` | Bubble shows the text | `false` | yes |
| `indicator_position` | Position | `top_right` | yes |

## Filter

| YAML key | Editor label | Default | Per entity |
|---|---|---|---|
| `sort_by` | Sort the filter result by | `name` |  |
| `filter_show_all` | Show all filter results | `false` |  |
| `sort_manual` | Also sort manual entities | `false` |  |
| `sort_dir` | Direction | `asc` |  |

## Advanced

| YAML key | Editor label | Default | Per entity |
|---|---|---|---|
| `only_active` | Show only active | `false` |  |
| `hide_when_empty` | Hide the card when empty | `false` |  |
| `hide_unavailable` | Hide unavailable | `false` |  |
| `max_items` | Max number of items | 0 (no limit) |  |
| `data_source` | Data source (editor only) | `auto` |  |

## Settings that are lists

These are edited in their own place in the editor, not in the sections above.

| YAML key | What it holds | Edited under |
|---|---|---|
| `entities` | The entities, sections and dividers | Entities |
| `filter` | The rules `include`, `exclude` and `only_if` | Filter |
| `color_rules` | Colour and animation rules | Colours and animation |
| `group_rules` | Your own groups, with `name`, `color` and `conditions` | Grouping (Custom groups) |
| `buttons` | Your own buttons | Buttons |

A button can carry `icon`, `name`, `color`, `tap_action`, `hold_action`, `double_tap_action` and `entity` (shows the control of a `select`, `input_select`, `number` or `input_number`; then `tap_action` is not used).

An entity written as an object can also carry `name`, `icon`, `color_rules`, `buttons`, `hide_buttons` and any setting marked *Per entity* above.
