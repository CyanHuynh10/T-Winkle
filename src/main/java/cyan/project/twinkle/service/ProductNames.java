package cyan.project.twinkle.service;

import java.text.Normalizer;
import java.util.regex.Pattern;

/** Commercial display titles; descriptions and historical snapshots are left alone. */
public final class ProductNames {
    private ProductNames() {}
    private static final Pattern PREFIX = Pattern.compile("^Giày(?:\\s*[-:–—]\\s*|\\s+|$)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE | Pattern.UNICODE_CHARACTER_CLASS);
    public static String commercial(String value) {
        if (value == null) return null;
        String name = PREFIX.matcher(Normalizer.normalize(value.strip(), Normalizer.Form.NFC)).replaceFirst("").strip();
        if (name.isBlank()) throw new IllegalArgumentException("Tên thương mại không được để trống");
        return name;
    }
}
