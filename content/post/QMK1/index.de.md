+++
title = 'Mein QMK-Abenteuer'
date = 2025-07-19T18:05:09+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Hardware",
    "open source",
    "Tastatur",
]
+++

Vor kurzem habe ich mir einen lang gehegten Wunsch erfüllt und mir eine mechanische Tastatur gegönnt, die voll programmierbar ist: die Keychron V5 Max im ISO-DE Layout. Die Möglichkeit, jede Taste und Funktion nach meinen Wünschen anzupassen, war für mich als Linux-Nutzer und Technik-Enthusiast der entscheidende Kaufgrund. Mein erstes Projekt war schnell definiert: Ich wollte eine visuelle Bestätigung, wenn der Nummernblock aktiv ist. Statt nur einer einzelnen Indikator-LED sollte der gesamte Block die Farbe wechseln.

## Die Vorbereitung: Die ersten Schritte ins Unbekannte
Als Neuling in der QMK-Welt habe ich mich zuerst an die offizielle Dokumentation gehalten. Die Einrichtung auf meinem Arch-Linux-System verlief dank des AUR und `pikaur` erstaunlich reibungslos.

```sh
# 1. Firmware von Keychron klonen
git clone https://github.com/Keychron/qmk_firmware.git

# 2. Alle notwendigen Abhängigkeiten installieren
pikaur -S python-platformdirs python-argcomplete python-colorama python-milc python-dotty-dict python-jsonschema git avr-gcc arm-none-eabi-gcc avr-libc arm-none-eabi-binutils arm-none-eabi-newlib avr-binutils dfu-programmer dfu-util avrdude python-hjson python-pygments python-pyusb python-pyserial python-pillow gcc libffi libusb-compat clang zip wget diffutils

# 3. QMK Umgebung einrichten
qmk setup --home /pfad/zu/qmk_firmware
```

Bis hierhin lief alles nach Plan. Ich fühlte mich bereit, den Code für meine Beleuchtungsidee zu schreiben. Doch QMK hatte andere Pläne.

## Hürde 1: Das Verzeichnis, das nicht existierte...
Jede Anleitung, die ich fand, folgte einem klaren Muster: Finde das Verzeichnis deiner Tastatur, kopiere die default-Keymap und beginne mit den Anpassungen. Voller Tatendrang tippte ich: `cd keyboards/keychron/v5_max/iso/`  
Die Antwort des Terminals war ernüchternd: `Datei oder Verzeichnis nicht gefunden`. Eine schnelle Überprüfung mit `ls` offenbarte das erste Problem: Es gab kein `v5_max`-Verzeichnis. Ein kleiner Rückschlag, aber kein Grund zur Sorge. Dachte ich.

## Hürde 2: Der richtige Zug auf dem falschen Gleis...
Auch wenn der Titel nach MRB oder DB klingt, wir sind immer noch im Universal Serial Bus...  
Nachdem ich versuchte, mit den `v5`-Dateien zu arbeiten, wurde schnell klar, dass hier etwas **grundlegend** nicht stimmte. Die Tastatur wurde nicht korrekt erkannt, das Flashen schlug fehl, und einmal **reagierte sie gar nicht mehr** – der erste "Brick". Ein beängstigendes Gefühl, aber zum Glück fast immer durch erneutes Flashen im DFU-Modus (USB-Kabel ab, Knopf unter der Leertaste halten, Kabel wieder dran) behebbar.

Der entscheidende Hinweis kam nach intensiver Recherche: Keychron pflegt neue oder kabellose Modelle oft in **separaten Git-Branches**. Meine V5 Max war nicht im Haupt-Branch, sondern versteckte sich im Branch `wls_2025q1`. Ein sauberer Neustart war nötig:
```sh
rm -rf /pfad/zu/qmk_firmware
git clone https://github.com/Keychron/qmk_firmware.git
cd qmk_firmware
git checkout wls_2025q1
qmk setup --home /pfad/zu/qmk_firmware
```
Endlich! Das `v5_max`-Verzeichnis war da. Doch die Freude währte nur kurz. Die Verzeichnisstruktur war völlig anders als erwartet. Es gab kein einfaches `keymaps/default`-Verzeichnis. Stattdessen war die ISO-DE-Version in einem Unterordner namens `iso_encoder` versteckt. Die *Schatzkarte* wurde immer komplexer.

## Das Kernproblem: Die Jagd nach den Phantom-LEDs
Nachdem ich endlich die richtigen Dateien gefunden hatte, fügte ich den Code für meine Beleuchtung hinzu. Ich kompilierte, flashte – und die falschen Tasten leuchteten. Ein wildes Durcheinander aus der `5`, `t`, `g`, `b`-Reihe erstrahlte grün, während mein Nummernblock dunkel blieb.  
Hier begann die eigentliche Detektivarbeit. Meine Annahme, die LED-Nummern würden einer logischen Reihenfolge folgen, war zwar nicht ganz falsch... aber auch nicht so richtig wie nötig. Ein Blick in die JSON-Konfigurationsdateien half auch nicht, da diese nur die Tastenmatrix, nicht aber die LED-Verkabelung beschreiben.

## Der Durchbruch: Eine geniale Idee
Nach unzähligen fehlgeschlagenen Versuchen, die richtigen LED-Nummern zu erraten, kam mir eine Idee, die alles veränderte. Statt für jeden einzelnen Test eine neue Firmware zu flashen, baute ich eine "Diagnose-Firmware".
Die Idee:
 1. Eine globale Zählvariable (led_index) wird auf 0 gesetzt.
 2. Bei jedem Druck auf die Num-Taste wird diese Variable um 1 erhöht.
 3. Die Beleuchtungsfunktion schaltet alle LEDs aus, bis auf die eine, deren Nummer im led_index steht.

So konnte ich mich Taste für Taste durch die gesamte LED-Matrix "klicken" und eine exakte Karte meiner Tastatur erstellen. Nach ein paar Anlaufschwierigkeiten mit der Implementierung funktionierte es!

Taste für Taste drückte ich Num und notierte mir, welche LED aufleuchtete... dachte ich...
 - ESC war die 0.
 - F1 war die 1.
 - Num Lock war die 30.
 - Caps Lock war die 51.
 - Die 0 auf dem Nummernblock war die 96.
 - Der . auf dem Nummernblock war die 97.

## Die letzte Hürde: Logik statt Zählen
Doch selbst mit dieser Methode kam es zu Fehlern. Einmal verzählt, und schon war die ganze Liste verschoben. Die `0` und der `.` leuchteten nicht, dafür aber `Strg` und `Shift`. Die Zählmethode war zu fehleranfällig. Wir brauchten eine neue Strategie: Logik und gezielte Tests.

Statt einzelne LEDs zu testen, prüften wir ganze Reihen des Nummernblocks auf einmal. Ein entscheidender Test war die Reihe `4`, `5`, `6`, `+`. Aus einem früheren Test wusste ich, dass die LED `65` unter der Taste `5` lag. Also testete ich die logische Gruppe `64`, `65`, `66`, `67`. Der Test war ein Erfolg! Diese vier Tasten leuchteten wie erwartet. Dieser eine erfolgreiche Test bestätigte die Blockstruktur der LED-Matrix und erlaubte es, die restlichen Nummern mit hoher Sicherheit abzuleiten und in größeren Gruppen zu verifizieren. Das sparte unzählige Flash-Vorgänge und führte mich schließlich zur korrekten und vollständigen LED-Karte.

## Der Lohn der Mühe: Der finale Code
Mit der vollständigen und verifizierten Liste der LED-Nummern war der Rest ein Kinderspiel. Ich erweiterte den Code um eine weitere Funktion: Die `Caps Lock`-Taste sollte bei Aktivierung rot leuchten. Als letzte Anpassung legte ich die `Druck`-Taste, die meiner Tastatur fehlt, auf die Kombination `Fn + P`.

Hier ist der finale Code, das Ergebnis unserer langen Reise:
```c
#include QMK_KEYBOARD_H
#include "keychron_common.h"

enum layers {
    MAC_BASE,
    MAC_FN,
    WIN_BASE,
    WIN_FN,
};

const uint8_t numpad_leds[] = {
    30, 31, 32, 33, // Num, /, *, -
    48, 49, 50,     // 7, 8, 9
    64, 65, 66, 67, // 4, 5, 6, +
    82, 83, 84, 85, // 1, 2, 3, Enter
    96, 97          // 0, .
};

// Die LED-Nummer für die Caps-Lock-Taste
#define CAPS_LOCK_LED 51

// clang-format off
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
 [MAC_BASE] = LAYOUT_iso_99(
        KC_ESC,             KC_BRID,  KC_BRIU,  KC_MCTRL, KC_LNPAD, RGB_VAD,  RGB_VAI,  KC_MPRV,  KC_MPLY,  KC_MNXT,  KC_MUTE,    KC_VOLD,  KC_VOLU,            KC_DEL,   KC_HOME,  KC_END,     KC_MUTE,
        KC_GRV,   KC_1,     KC_2,     KC_3,     KC_4,     KC_5,     KC_6,     KC_7,     KC_8,     KC_9,     KC_0,     KC_MINS,    KC_EQL,   KC_BSPC,            KC_NUM,   KC_PSLS,  KC_PAST,    KC_PMNS,
        KC_TAB,   KC_Q,     KC_W,     KC_E,     KC_R,     KC_T,     KC_Y,     KC_U,     KC_I,     KC_O,     KC_P,     KC_LBRC,    KC_RBRC,                      KC_P7,    KC_P8,    KC_P9,      KC_PPLS,
        KC_CAPS,  KC_A,     KC_S,     KC_D,     KC_F,     KC_G,     KC_H,     KC_J,     KC_K,     KC_L,     KC_SCLN,  KC_QUOT,    KC_NUHS,  KC_ENT,             KC_P4,    KC_P5,    KC_P6,
        KC_LSFT,  KC_NUBS,  KC_Z,     KC_X,     KC_C,     KC_V,     KC_B,     KC_N,     KC_M,     KC_COMM,  KC_DOT,   KC_SLSH,              KC_RSFT,  KC_UP,    KC_P1,    KC_P2,    KC_P3,      KC_PENT,
        KC_LCTL,  KC_LOPTN, KC_LCMMD,                               KC_SPC,                                 KC_RCMMD, MO(MAC_FN), KC_RCTL,  KC_LEFT,  KC_DOWN,  KC_RGHT,  KC_P0,    KC_PDOT               ),

    [MAC_FN] = LAYOUT_iso_99(
        _______,            KC_F1,    KC_F2,    KC_F3,    KC_F4,    KC_F5,    KC_F6,    KC_F7,    KC_F8,    KC_F9,    KC_F10,     KC_F11,   KC_F12,             _______,  _______,  _______,    RGB_TOG,
        _______,  BT_HST1,  BT_HST2,  BT_HST3,  P2P4G,    _______,  _______,  _______,  _______,  _______,  _______,  _______,    _______,  _______,            _______,  _______,  _______,    _______,
        RGB_TOG,  RGB_MOD,  RGB_VAI,  RGB_HUI,  RGB_SAI,  RGB_SPI,  _______,  _______,  _______,  _______,  KC_PSCR,  _______,    _______,                      _______,  _______,  _______,    _______, // <-- HIER: P = Print Screen
        _______,  RGB_RMOD, RGB_VAD,  RGB_HUD,  RGB_SAD,  RGB_SPD,  _______,  _______,  _______,  _______,  _______,  _______,    _______,  _______,            _______,  _______,  _______,
        _______,  _______,  _______,  _______,  _______,  _______,  BAT_LVL,  NK_TOGG,  _______,  _______,  _______,  _______,              _______,  _______,  _______,  _______,  _______,    _______,
        _______,  _______,  _______,                                _______,                                _______,  _______,    _______,  _______,  _______,  _______,  _______,  _______            ),

    [WIN_BASE] = LAYOUT_iso_99(
        KC_ESC,             KC_F1,    KC_F2,    KC_F3,    KC_F4,    KC_F5,    KC_F6,    KC_F7,    KC_F8,    KC_F9,    KC_F10,     KC_F11,   KC_F12,             KC_DEL,   KC_HOME,  KC_END,     KC_MUTE,
        KC_GRV,   KC_1,     KC_2,     KC_3,     KC_4,     KC_5,     KC_6,     KC_7,     KC_8,     KC_9,     KC_0,     KC_MINS,    KC_EQL,   KC_BSPC,            KC_NUM,   KC_PSLS,  KC_PAST,    KC_PMNS,
        KC_TAB,   KC_Q,     KC_W,     KC_E,     KC_R,     KC_T,     KC_Y,     KC_U,     KC_I,     KC_O,     KC_P,     KC_LBRC,    KC_RBRC,                      KC_P7,    KC_P8,    KC_P9,      KC_PPLS,
        KC_CAPS,  KC_A,     KC_S,     KC_D,     KC_F,     KC_G,     KC_H,     KC_J,     KC_K,     KC_L,     KC_SCLN,  KC_QUOT,    KC_NUHS,  KC_ENT,             KC_P4,    KC_P5,    KC_P6,
        KC_LSFT,  KC_NUBS,  KC_Z,     KC_X,     KC_C,     KC_V,     KC_B,     KC_N,     KC_M,     KC_COMM,  KC_DOT,   KC_SLSH,              KC_RSFT,  KC_UP,    KC_P1,    KC_P2,    KC_P3,      KC_PENT,
        KC_LCTL,  KC_LWIN,  KC_LALT,                                KC_SPC,                                 KC_RALT,  MO(WIN_FN), KC_RCTL,  KC_LEFT,  KC_DOWN,  KC_RGHT,  KC_P0,    KC_PDOT            ),

    [WIN_FN] = LAYOUT_iso_99(
        _______,            KC_BRID,  KC_BRIU,  KC_TASK,  KC_FILE,  RGB_VAD,  RGB_VAI,  KC_MPRV,  KC_MPLY,  KC_MNXT,  KC_MUTE,    KC_VOLD,  KC_VOLU,            _______,  _______,  _______,    RGB_TOG,
        _______,  BT_HST1,  BT_HST2,  BT_HST3,  P2P4G,    _______,  _______,  _______,  _______,  _______,  _______,  _______,    _______,  _______,            _______,  _______,  _______,    _______,
        RGB_TOG,  RGB_MOD,  RGB_VAI,  RGB_HUI,  RGB_SAI,  RGB_SPI,  _______,  _______,  _______,  _______,  KC_PSCR,  _______,    _______,                      _______,  _______,  _______,    _______, // <-- HIER: P = Print Screen
        _______,  RGB_RMOD, RGB_VAD,  RGB_HUD,  RGB_SAD,  RGB_SPD,  _______,  _______,  _______,  _______,  _______,  _______,    _______,  _______,            _______,  _______,  _______,
        _______,  _______,  _______,  _______,  _______,  _______,  BAT_LVL,  NK_TOGG,  _______,  _______,  _______,  _______,              _______,  _______,  _______,  _______,  _______,    _______,
        _______,  _______,  _______,                                _______,                                _______,  _______,    _______,  _______,  _______,  _______,  _______,  _______            ),
 };

#if defined(ENCODER_MAP_ENABLE)
const uint16_t PROGMEM encoder_map[][NUM_ENCODERS][2] = {
    [MAC_BASE] = {ENCODER_CCW_CW(KC_VOLD, KC_VOLU)},
    [MAC_FN]   = {ENCODER_CCW_CW(RGB_VAD, RGB_VAI)},
    [WIN_BASE] = {ENCODER_CCW_CW(KC_VOLD, KC_VOLU)},
    [WIN_FN]   = {ENCODER_CCW_CW(RGB_VAD, RGB_VAI)},
};
#endif // ENCODER_MAP_ENABLE

// clang-format on
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    if (!process_record_keychron_common(keycode, record)) {
        return false;
    }
    return true;
}

bool rgb_matrix_indicators_user(void) {
    // Num-Lock-Anzeige
    if (host_keyboard_led_state().num_lock) {
        for (uint8_t i = 0; i < sizeof(numpad_leds); i++) {
            rgb_matrix_set_color(numpad_leds[i], 0, 255, 0); // Grün
        }
    }

    // Caps-Lock-Anzeige
    if (host_keyboard_led_state().caps_lock) {
        rgb_matrix_set_color(CAPS_LOCK_LED, 255, 0, 0); // Rot
    }

    return false;
}
```

## Fazit und ein letztes Rätsel
Diese Reise war eine Achterbahnfahrt. Sie hat mir gezeigt, wie mächtig, aber auch wie unversöhnlich QMK sein kann. Die Dokumentation ist ein guter Start, aber bei herstellerspezifischen Abweichungen ist man schnell auf sich allein gestellt und muss zum Detektiv werden. Das Gefühl, am Ende eine Firmware zu haben, die exakt das tut, was man will, ist jedoch unbezahlbar.

Ein kleines Rätsel bleibt allerdings ungelöst: Die Tastenkombination zur Anzeige des Batteriestands (Fn + B) scheint mit meiner benutzerdefinierten Firmware nicht mehr zu funktionieren. Warum, weiß ich leider nicht. Vielleicht ist das ein Abenteuer für ein anderes Mal.

An alle, die vor einer ähnlichen Herausforderung stehen: Gebt nicht auf! Die Lösung ist da draußen, manchmal muss man sie sich nur hart erarbeiten. Und wer Ideen hat, **Bitte** melden.