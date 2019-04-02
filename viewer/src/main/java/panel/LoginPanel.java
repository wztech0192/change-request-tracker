package panel;

import java.awt.Color;
import java.awt.Dimension;

import java.awt.GridLayout;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;

import main.App;
import tool.CRTStyle;

/**
 * Login panel that prompt user for email and password to access the app
 */
public class LoginPanel extends AppPanel {

    private static final long serialVersionUID = 1L;
    private JTextField email = null;
    private JPasswordField password = null;
    private String loadEmail = null;

    public LoginPanel(App app, String email) {
        super(app);
        this.loadEmail = email;

        this.setComponent();
    }

    public LoginPanel(App app) {
        super(app);
        this.setBorder(BorderFactory.createEmptyBorder(80, 150, 120, 0));
        this.setComponent();
    }

    // set up component
    private void setComponent() {
        this.setBackground(Color.WHITE);

        this.setBorder(BorderFactory.createEmptyBorder(80, 150, 120, 150));
        JLabel logo = new JLabel("<html><p style='font-size:40px;'><b>CR</b>Viewer<p><html>",
                new ImageIcon(app.getDir() + "img/logo.png"), JLabel.CENTER);
        this.add(logo);
        this.add(new JLabel(
                "<html><p style='padding-bottom:15px; padding-top:30px; color:gray; font-size:15px;'>Sign in to start your session</p></html>",
                JLabel.RIGHT));

        this.add(getInputGroup());
        this.add(getBtnGroup());
        this.add(getTipGroup());
    }

    private JPanel getTipGroup() {

        JPanel group = new JPanel();
        group.setBorder(BorderFactory.createEmptyBorder(260, 0, 0, 0));
        group.setBackground(Color.WHITE);
        JButton btnLink = new JButton(new ImageIcon(app.getDir() + "img/link.png"));
        btnLink.setHorizontalTextPosition(JButton.LEFT);
        btnLink.setBackground(null);
        btnLink.addActionListener(e -> {
            if (!app.openWebpage()) {
                JOptionPane.showMessageDialog(this, "Your OS doesn't support browser!");
            }
        });

        JButton btnConfig = new JButton(new ImageIcon(app.getDir() + "img/gear.png"));
        btnConfig.addActionListener(e -> {
            app.setConfig();
        });
        btnConfig.setBackground(Color.WHITE);
        group.add(btnConfig);
        group.add(new JLabel("<html><i>Visit the CRTracker web app for full features</i></html>"));

        group.add(btnLink);

        return group;
    }

    // password and email input text field
    private JPanel getInputGroup() {
        JPanel group = new JPanel(new GridLayout(4, 1, 0, 0));
        this.email = new JTextField(10);
        group.setBackground(Color.WHITE);
        this.password = new JPasswordField();
        if (this.app.getUser() != null) {
            this.email.setText(app.getUser().getEmail());
        } else {
            this.email.setText(this.loadEmail);
        }
        this.email.setFont(CRTStyle.getFont());
        this.password.setFont(CRTStyle.getFont());
        JLabel emailLabel = new JLabel("Email");
        emailLabel.setFont(CRTStyle.getFont());
        group.add(emailLabel);
        group.add(email);
        JLabel pwLabel = new JLabel("Password");
        pwLabel.setFont(CRTStyle.getFont());
        group.add(pwLabel);
        group.add(password);
        group.setPreferredSize(new Dimension(425, 200));
        group.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        return group;
    }

    // clear and login button
    private JPanel getBtnGroup() {
        JPanel group = new JPanel(new GridLayout(1, 2, 10, 5));
        JButton clear = new JButton("Reset", new ImageIcon(app.getDir() + "img/reset.png"));
        clear.setIconTextGap(5);
        clear.setHorizontalTextPosition(JButton.LEFT);
        JButton login = new JButton("Login", new ImageIcon(app.getDir() + "img/login.png"));
        login.setIconTextGap(10);
        login.setHorizontalTextPosition(JButton.LEFT);
        group.setBackground(Color.WHITE);
        // bind enter key to login
        app.getRootPane().setDefaultButton(login);

        // set button property
        clear.setFont(CRTStyle.getFont());
        login.setBackground(CRTStyle.getDarkBlue());
        login.setForeground(Color.WHITE);
        login.setFont(CRTStyle.getFont());

        // set button event
        clear.addActionListener(e -> {
            clearInput();
        });
        login.addActionListener(e -> {
            // background thread running
            Thread thread = new Thread(() -> {
                login.setEnabled(false);
                login.setText("Loading...");
                int status = app.http().login(email.getText(), String.valueOf(password.getPassword()));
                switch (status) {
                case 500:
                    JOptionPane.showMessageDialog(this,
                            "<html><h3 style='color:red;'>Connection failed, try next time!</h3></html>");
                    break;
                case 200:
                    // set user information
                    if (!app.setUser()) {
                        JOptionPane.showMessageDialog(this,
                                "<html><h3 style='color:red;'>Cannot find the user!</h3></html>");
                    }
                    break;
                default:
                    JOptionPane.showMessageDialog(this,
                            "<html><h3 style='color:red;'>Wrong Email or Password!</h3></html>");
                }
                password.setText("");
                login.setEnabled(true);
                login.setText("Login");
            });
            thread.start();
        });

        group.add(clear);
        group.add(login);
        group.setPreferredSize(new Dimension(425, 90));
        group.setBorder(BorderFactory.createEmptyBorder(30, 10, 10, 10));
        return group;
    }

    // clear input
    private void clearInput() {
        email.setText("");
        password.setText("");
    }
}