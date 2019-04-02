package tool;

import java.awt.Color;
import java.awt.Font;

import javax.swing.JComponent;

/**
 * CRTColor
 */
public final class CRTStyle {
    final static Color blue = new Color(35, 80, 132);
    final static Color yellow = new Color(243, 156, 18);
    final static Color red = new Color(229, 40, 18);
    final static Color green = new Color(0, 166, 90);
    final static Color darkBlue = new Color(0, 31, 112);
    final static Font font = new Font("SansSerif", Font.PLAIN, 20);
    final static Font crFont = new Font("SansSerif", Font.PLAIN, 16);

    public static Color getBlue() {
        return blue;
    }

    public static Color getDarkBlue() {
        return darkBlue;
    }

    public static Font getFont() {
        return font;
    }

    public static Font getCrfont() {
        return crFont;
    }

    public static Color getStatusColor(String status) {
        switch (status) {
        case "Cancelled":
            return red;
        case "To Do":
            return yellow;
        case "In Progress":
            return blue;
        case "Complete":
            return green;
        }
        return Color.LIGHT_GRAY;
    }

    public static void setStatusStyle(JComponent com) {
        com.setBackground(getBlue());
        com.setForeground(Color.WHITE);

    }
}