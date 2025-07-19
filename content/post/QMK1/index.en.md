+++
title = 'My QMK Adventure'
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

I recently fulfilled a long-held wish and treated myself to a fully programmable mechanical keyboard: the Keychron V5 Max in the ISO-DE layout. As a Linux user and tech enthusiast, the ability to customize every key and function to my liking was the deciding factor for the purchase. My first project was quickly defined: I wanted a visual confirmation when the number pad is active. Instead of just a single indicator LED, the entire block should change color.

## Preparation: The First Steps into the Unknown

As a newcomer to the QMK world, I first stuck to the official documentation. Setting it up on my Arch Linux system went surprisingly smoothly, thanks to the AUR and `pikaur`.

```ssh
# 1. Clone firmware from Keychron
git clone https://github.com/Keychron/qmk_firmware.git

# 2. Install all necessary dependencies
pikaur -S python-platformdirs python-argcomplete python-colorama python-milc python-dotty-dict python-jsonschema git avr-gcc arm-none-eabi-gcc avr-libc arm-none-eabi-binutils arm-none-eabi-newlib avr-binutils dfu-programmer dfu-util avrdude python-hjson python-pygments python-pyusb python-pyserial python-pillow gcc libffi libusb-compat clang zip wget diffutils

# 3. Set up QMK environment
qmk setup --home /path/to/qmk_firmware
```

Up to this point, everything went according to plan. I felt ready to write the code for my lighting idea. But QMK had other plans.

## Hurdle 1: The Directory That Didn't Exist...
Every guide I found followed a clear pattern: find your keyboard's directory, copy the default keymap, and start customizing. Full of motivation, I typed: `cd keyboards/keychron/v5_max/iso/`

The terminal's response was sobering: `No such file or directory`. A quick check with ls revealed the first problem: there was no `v5_max` directory. A small setback, but no reason to worry. Or so I thought.

## Hurdle 2: The Right Train on the Wrong Track...
Even though the title sounds like a railway reference, we're still talking about the Universal Serial Bus...

After trying to work with the `v5` files, it quickly became clear that something was **fundamentally** wrong. The keyboard wasn't recognized correctly, flashing failed, and at one point, it **stopped responding entirely** – the first "brick." A scary feeling, but fortunately, almost always fixable by re-flashing in DFU mode (unplug the USB cable, hold the button under the spacebar, plug the cable back in).

The crucial clue came after intensive research: Keychron often maintains new or wireless models in **separate Git branches**. My V5 Max wasn't in the main branch but was hiding in the `wls_2025q1` branch. a clean restart was necessary:
```sh
rm -rf /path/to/qmk_firmware
git clone https://github.com/Keychron/qmk_firmware.git
cd qmk_firmware
git checkout wls_2025q1
qmk setup --home /path/to/qmk_firmware
```

Finally! The `v5_max` directory was there. But the joy was **short-lived**. The directory structure was completely different than expected. There was no simple `keymaps/default` directory. Instead, the ISO-DE version was hidden in a subfolder called `iso_encoder`. The *treasure map* was getting more and more complex.

## The Core Problem: Hunting for Phantom LEDs
After I finally found the right files, I added the code for my lighting. I compiled, flashed – and the wrong keys lit up. A chaotic jumble from the `5`, `t`, `g`, `b` row glowed green, while my number pad remained dark.

This is where the real detective work began. My assumption that the LED numbers would follow a logical sequence was not entirely wrong... but also not correct enough. A look into the JSON configuration files didn't help either, as they only describe the key matrix, not the LED wiring.

## The Breakthrough: A Brilliant Idea

After countless failed attempts to guess the correct LED numbers, I had an idea that changed everything. Instead of flashing a new firmware for every single test, I built a "diagnostic firmware."
The idea:
 1. A global counter variable (led_index) is set to 0.
 2. Every time the Num key is pressed, this variable is incremented by 1.
 3. The lighting function turns off all LEDs except for the one whose number is stored in led_index.

This way, I could "click" my way through the entire LED matrix, key by key, and create an exact map of my keyboard. After a few initial implementation hiccups, it worked!

Key by key, I pressed Num and noted which LED lit up... or so I thought...
 - ESC was 0.
 - F1 was 1.
 - Num Lock was 30.
 - Caps Lock was 51.
 - The 0 on the numpad was 96.
 - The . on the numpad was 97.

## The Final Hurdle: Logic Instead of Counting

But even with this method, errors occurred. One miscount and the whole list was shifted. The `0` and `.` keys wouldn't light up, but `Ctrl` and `Shift` did instead. The counting method was too error-prone. We needed a new strategy: logic and targeted tests.

Instead of testing individual LEDs, we tested entire rows of the numpad at once. A decisive test was the `4`, `5`, `6`, `+` row. From an earlier test, I knew that LED `65` was under the `5` key. So I tested the logical group `64`, `65`, `66`, `67`. The test was a success! These four keys lit up as expected. This single successful test confirmed the block structure of the LED matrix and allowed me to deduce the remaining numbers with high confidence and verify them in larger groups. This saved countless flashing operations and finally led me to the correct and complete LED map.

## The Reward for the Effort: The Final Code

With the complete and verified list of LED numbers, the rest was a piece of cake. I extended the code with another feature: the `Caps Lock` key should light up red when activated. As a final adjustment, I mapped the `Print Screen` key, which my keyboard lacks, to the combination `Fn + P`.

Here is the final code, the result of our long journey:
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

## Conclusion and One Last Mystery

This journey was a rollercoaster. It showed me how powerful, but also how unforgiving, QMK can be. The documentation is a good start, but with manufacturer-specific deviations, you are quickly on your own and have to become a detective. However, the feeling of finally having a firmware that does exactly what you want is priceless.

One small mystery remains unsolved, though: The key combination to display the battery level (Fn + B) no longer seems to work with my custom firmware. Unfortunately, I don't know why. Perhaps that's an adventure for another time.

To everyone facing a similar challenge: Don't give up! The solution is out there, sometimes you just have to work hard to find it. And if anyone has any ideas, **please** let me know.