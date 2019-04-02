package panel.nested.home;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;

import javax.swing.BorderFactory;
import javax.swing.JPanel;

import main.User;

/**
 * Avator
 */
public class Avator extends JPanel {

    private static final long serialVersionUID = 1L;
    private String name;
    private User user;

    public Avator(User user) {
        this.user = user;
        this.name = user.getFirstName().charAt(0) + "" + user.getLastName().charAt(0);
        this.setBackground(Color.white);
        this.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, Color.LIGHT_GRAY));
    }

    public Color getBG() {
        // set color based on first letter of first name
        switch ((this.name.toUpperCase().charAt(0))) {
        case 'A':
        case 'B':
            // blue
            return new Color(0, 115, 183);
        case 'C':
        case 'D': // navy
            return new Color(0, 52, 107);

        case 'E':
        case 'F':
            // gray
            return new Color(111, 117, 124);
        case 'G':
        case 'H': // tile
            return new Color(53, 191, 191);
        case 'I':
        case 'J': // purpole
            return new Color(83, 79, 145);
        case 'K':
        case 'L': // red
            return new Color(191, 79, 63);
        case 'M':
        case 'N': // maroon
            return new Color(216, 27, 96);
        case 'O':
        case 'P': // orange
            return new Color(255, 133, 27);
        case 'Q':
        case 'R': // yellow
            return new Color(234, 149, 14);
        case 'S':
        case 'T': // green
            return new Color(1, 137, 75);
        case 'U':
        case 'V':
        case 'W':
        case 'X':
        case 'Y':
        case 'Z':
            // blue
            return new Color(0, 115, 183);
        }

        // blue
        return new Color(0, 115, 183);
    }

    @Override
    public void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g;
        RenderingHints rh = new RenderingHints(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHints(rh);

        g2.setColor(Color.LIGHT_GRAY);
        int radius = 100;
        g2.fillOval((this.getWidth() / 2) - radius / 2, 0, radius, radius);
        radius -= 8;
        g2.setColor(getBG());
        g2.fillOval((this.getWidth() / 2) - radius / 2, 4, radius, radius);
        g2.setColor(Color.WHITE);

        Font font = new Font("SansSerif", Font.PLAIN, 40);
        // Get the FontMetrics
        FontMetrics metrics = g2.getFontMetrics(font);
        // Determine the X coordinate for the text
        int x = (this.getWidth() - metrics.stringWidth(name)) / 2;
        // Determine the Y coordinate for the text
        int y = ((metrics.getHeight()) / 2) + metrics.getAscent() + 2;
        // Set the font
        g2.setFont(font);
        // Draw the String
        g2.drawString(name, x, y);

        font = new Font("SansSerif", Font.PLAIN, 24);
        // Get the FontMetrics
        metrics = g2.getFontMetrics(font);
        // Determine the X coordinate for the text
        x = (this.getWidth() - metrics.stringWidth(user.getFullName())) / 2;
        // Set the font
        g2.setFont(font);
        g2.setColor(Color.BLACK);
        g2.drawString(user.getFullName(), x, y + 60);

        font = new Font("SansSerif", Font.PLAIN, 18);

        // Get the FontMetrics
        metrics = g2.getFontMetrics(font);
        // Determine the X coordinate for the text
        x = (this.getWidth() - metrics.stringWidth(user.getRole())) / 2;
        // Set the font
        g2.setFont(font);
        g2.setColor(Color.LIGHT_GRAY);
        g2.drawString(user.getRole(), x, y + 90);

    }

}