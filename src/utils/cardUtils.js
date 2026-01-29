
// Helper to convert numbers to Roman Numerals (1-21)
// 0 is usually The Fool (0 or Unnumbered). We'll use "0" or "O".
const toRoman = (num) => {
    if (num === 0) return "0";
    const map = {
        M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let result = '';
    for (let key in map) {
        while (num >= map[key]) {
            result += key;
            num -= map[key];
        }
    }
    return result;
};

// Helper to get card info ID (0-77)
export const getCardInfo = (id) => {
    // Major Arcana (0-21)
    if (id < 22) {
        const majors = [
            "THE FOOL", "THE MAGICIAN", "THE HIGH PRIESTESS", "THE EMPRESS", "THE EMPEROR",
            "THE HIEROPHANT", "THE LOVERS", "THE CHARIOT", "STRENGTH", "THE HERMIT",
            "WHEEL OF FORTUNE", "JUSTICE", "THE HANGED MAN", "DEATH", "TEMPERANCE",
            "THE DEVIL", "THE TOWER", "THE STAR", "THE MOON", "THE SUN",
            "JUDGEMENT", "THE WORLD"
        ];
        return {
            type: 'major',
            number: id,
            roman: toRoman(id),
            name: majors[id],
            filename: `major_${id}`
        };
    }

    // Minor Arcana (22-77)
    // Suits order: Wands, Cups, Swords, Pentacles (14 cards each)
    const minorId = id - 22;
    const suitIndex = Math.floor(minorId / 14);
    const rankIndex = minorId % 14;

    const suits = ["WANDS", "CUPS", "SWORDS", "PENTACLES"];
    const suit = suits[suitIndex];

    const ranks = [
        "ACE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN",
        "EIGHT", "NINE", "TEN", "PAGE", "KNIGHT", "QUEEN", "KING"
    ];
    const rank = ranks[rankIndex];

    // Roman for Minors? usually just the number for pip cards (1-10), and P/Kn/Q/K for courts or names.
    // User image showed "IV" for Four of Cups. So we use Roman for ranks 1-10.
    // Courts usually don't have numbers or use symbols. Let's use names for courts.

    let romanDisplay = "";
    if (rankIndex < 10) {
        romanDisplay = toRoman(rankIndex + 1); // Ace=I, Two=II
    } else {
        // Courts: Page, Knight, Queen, King. Maybe put first letter or leave empty?
        // Let's use the Rank Name as the "Roman" slot for courts? Or leave blank?
        // User requested "Roman numeral on top".
        // For courts, standard is often the name overlay.
        // Let's stick to standard Tarot: P, Kn, Q, K or just the full name at bottom.
        // We'll leave top blank for courts or put representative letter.
        const courtSymbols = ["P", "KN", "Q", "K"];
        romanDisplay = courtSymbols[rankIndex - 10];
    }

    return {
        type: 'minor',
        suit: suit,
        rank: rank,
        roman: romanDisplay,
        name: `${rank} OF ${suit}`,
        filename: `${suit.toLowerCase()}_${rankIndex === 0 ? 'ace' : rankIndex < 10 ? rankIndex + 1 : rank.toLowerCase()}`
        // filename mapping needs to match backend script logic:
        // script: wands_ace, wands_2... wands_10, wands_page...
    };
};

export const getAudioFileName = (id) => {
    // Logic to match the python script generation filenames
    if (id < 22) return `major_${id}`;

    const info = getCardInfo(id);
    // Re-construct filename based on python script's logic
    // wands_ace, wands_2, ..., wands_king
    // My getCardInfo logic for filename might be slightly off compared to script, let's align.

    let suffix = "";
    const ranks = [
        "ace", "2", "3", "4", "5", "6", "7",
        "8", "9", "10", "page", "knight", "queen", "king"
    ];
    // minorId calculation again
    const minorId = id - 22;
    const rankIndex = minorId % 14;
    const suitIndex = Math.floor(minorId / 14);
    const suits = ["wands", "cups", "swords", "pentacles"];

    return `${suits[suitIndex]}_${ranks[rankIndex]}`;
};
