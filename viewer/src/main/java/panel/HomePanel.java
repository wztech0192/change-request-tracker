package panel;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.GridLayout;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

import main.App;
import main.User;
import panel.nested.home.*;
import tool.CRTStyle;

/**
 * HomePanel
 */
public class HomePanel extends AppPanel {

    private JPanel profilePane;

    public HomePanel(App app) {
        super(app);
        this.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        this.setLayout(new BorderLayout());
        this.setBackground(Color.white);
        this.profilePane = setProfilePane();
        this.add(profilePane, BorderLayout.NORTH);
        this.add(new CRTable(app), BorderLayout.CENTER);
        this.add(getBtnGroup(), BorderLayout.SOUTH);
    }

    // get profile component
    public JPanel setProfilePane() {
        User user = this.app.getUser();
        JPanel panel = new JPanel(new GridLayout(2, 1, 5, 0));
        panel.setBackground(Color.white);
        panel.add(new Avator(user));
        // sub panel for more information
        JPanel subpanel = new JPanel(new GridLayout(4, 2, 0, 10));
        subpanel.setBackground(Color.white);
        subpanel.add(myLabel("<b>Email</b>", JLabel.LEFT));
        subpanel.add(myLabel(user.getEmail(), JLabel.LEFT));
        subpanel.add(myLabel("<b>Member Since</b>", JLabel.LEFT));
        subpanel.add(myLabel(user.getCreatedAt(), JLabel.LEFT));
        subpanel.add(myLabel("<b>Last Visit</b>", JLabel.LEFT));
        subpanel.add(myLabel(user.getUpdatedAt(), JLabel.LEFT));
        panel.add(subpanel);
        return panel;
    }

    public JLabel myLabel(String txt, int pos) {
        JLabel label = new JLabel("<html><p style='padding:5px; 0'>" + txt + "</p></html>", pos);
        label.setFont(CRTStyle.getFont());
        label.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, Color.LIGHT_GRAY));
        return label;
    }

    // combine of logout button and link button
    public JPanel getBtnGroup() {
        // logout
        JPanel group = new JPanel(new GridLayout(1, 2, 20, 0));
        group.setBackground(Color.WHITE);
        JButton logout = new JButton("Logout", new ImageIcon(app.getDir() + "img/logout.png"));
        logout.setIconTextGap(10);

        logout.addActionListener(e -> {
            app.toLogin();
        });
        group.add(logout);

        // open link
        JButton openLink = new JButton("Web App", new ImageIcon(app.getDir() + "img/link.png"));
        openLink.setHorizontalTextPosition(JButton.LEFT);
        openLink.addActionListener(e -> {

            if (!app.openWebpage()) {
                JOptionPane.showMessageDialog(this, "Your OS doesn't support browser!");
            }

        });
        group.add(openLink);
        return group;
    }

    private static final long serialVersionUID = 1L;

}